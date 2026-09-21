import { apiClient } from "./apiClient";

type RecordValue = Record<string, unknown>;
export interface DashboardStats {
  totalOrganizations: number;
  activeOrganizations: number;
  activeMemberships: number;
  totalActiveUsers: number;
}
export interface OverviewPoint { month: string; organizations: number; memberships: number }
export interface StatusPoint { label: string; count: number; percentage: number }
export interface TrendPoint { day: string; newOrgs: number; renewals: number; cancellations: number }
export interface DashboardReminder { id: string; title: string; subtitle: string; time: string; type: string }

function record(value: unknown): RecordValue | null {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? value as RecordValue : null;
}

function payload(value: unknown): unknown {
  let current = value;
  for (let i = 0; i < 2; i += 1) {
    const next = record(current)?.data;
    if (next === undefined) break;
    current = next;
  }
  return current;
}

function field(row: RecordValue, ...names: string[]): unknown {
  for (const name of names) if (row[name] !== undefined && row[name] !== null) return row[name];
  return undefined;
}

function number(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value.replace(/,/g, ""));
    if (Number.isFinite(parsed)) return parsed;
  }
  return null;
}

function requiredNumber(row: RecordValue, label: string, ...names: string[]): number {
  const parsed = number(field(row, ...names));
  if (parsed === null) throw new Error(`Dashboard response is missing ${label}.`);
  return parsed;
}

function text(value: unknown): string {
  return typeof value === "string" || typeof value === "number" ? String(value) : "";
}

function list(value: unknown, ...keys: string[]): unknown[] {
  const body = payload(value);
  if (Array.isArray(body)) return body;
  const container = record(body);
  for (const key of keys) {
    const items = container?.[key];
    if (Array.isArray(items)) return items;
  }
  throw new Error("Dashboard response has an unexpected list format.");
}

function rows(value: unknown, ...keys: string[]): RecordValue[] {
  return list(value, ...keys).map((item) => {
    const row = record(item);
    if (!row) throw new Error("Dashboard response contains an invalid item.");
    return row;
  });
}

function label(value: unknown): string {
  const raw = text(value);
  if (!raw) return "";
  const date = /^\d{4}-\d{2}/.test(raw) ? new Date(raw) : null;
  return date && !Number.isNaN(date.getTime())
    ? date.toLocaleDateString(undefined, { month: "short" }) : raw;
}

export async function getDashboardStats(signal?: AbortSignal): Promise<DashboardStats> {
  const { data } = await apiClient.get<unknown>("dashboard/stats", { signal });
  const body = record(payload(data));
  if (!body) throw new Error("Dashboard stats response is invalid.");
  return {
    totalOrganizations: requiredNumber(body, "total organizations", "total_organizations", "totalOrganizations"),
    activeOrganizations: requiredNumber(body, "active organizations", "active_organizations", "activeOrganizations"),
    activeMemberships: requiredNumber(body, "active memberships", "active_memberships", "activeMemberships", "active_licenses", "activeLicenses"),
    totalActiveUsers: requiredNumber(body, "total active users", "total_active_users", "totalActiveUsers", "active_users", "activeUsers"),
  };
}

export async function getPlatformOverview(period: string, signal?: AbortSignal): Promise<OverviewPoint[]> {
  const { data } = await apiClient.get<unknown>("dashboard/platform-overview", { params: { period }, signal });
  return rows(data, "overview", "chart", "trends", "items").map((row) => ({
    month: label(field(row, "month", "label", "period", "date")),
    organizations: requiredNumber(row, "organization count", "organizations", "organization_count", "organizationCount", "total_organizations"),
    memberships: requiredNumber(row, "membership count", "memberships", "membership_count", "membershipCount", "active_memberships"),
  }));
}

export async function getPlatformStatus(signal?: AbortSignal): Promise<StatusPoint[]> {
  const { data } = await apiClient.get<unknown>("dashboard/platform-status", { signal });
  const body = payload(data);
  let source: RecordValue[];
  if (Array.isArray(body)) source = rows(body);
  else {
    const container = record(body);
    const nested = container && (container.statuses ?? container.breakdown ?? container.items);
    if (Array.isArray(nested)) source = rows(nested);
    else if (container) source = Object.entries(container).filter(([, value]) => number(value) !== null).map(([status, count]) => ({ status, count }));
    else throw new Error("Platform status response is invalid.");
  }
  const result = source.map((row) => ({
    label: text(field(row, "label", "status", "name")),
    count: requiredNumber(row, "status count", "count", "total", "organizations", "value"),
    percentage: number(field(row, "percentage", "percent")) ?? -1,
  }));
  const total = result.reduce((sum, item) => sum + item.count, 0);
  return result.map((item) => ({ ...item, percentage: item.percentage < 0 ? (total ? Math.round(item.count / total * 100) : 0) : item.percentage }));
}

export async function getWeeklyTrends(signal?: AbortSignal): Promise<TrendPoint[]> {
  const { data } = await apiClient.get<unknown>("dashboard/weekly-trends", { signal });
  return rows(data, "trends", "weekly_trends", "weeklyTrends", "items").map((row) => ({
    day: text(field(row, "day", "label", "date")),
    newOrgs: requiredNumber(row, "new organizations", "new_organizations", "newOrganizations", "new_orgs", "newOrgs"),
    renewals: requiredNumber(row, "renewals", "renewals"),
    cancellations: requiredNumber(row, "cancellations", "cancellations"),
  }));
}

export async function getDashboardReminders(signal?: AbortSignal): Promise<DashboardReminder[]> {
  const { data } = await apiClient.get<unknown>("dashboard/reminders", { params: { limit: 4 }, signal });
  return rows(data, "reminders", "items", "results").map((row) => ({
    id: text(field(row, "id", "_id")),
    title: text(field(row, "title", "message", "name")),
    subtitle: text(field(row, "subtitle", "description", "organization_name", "organizationName")),
    time: text(field(row, "time", "due_label", "dueLabel", "due_date", "dueDate")),
    type: text(field(row, "type", "category")),
  }));
}
