import { apiClient } from "./apiClient";

export interface AuditLogRecord {
  id: string;
  category: string;
  action: string;
  actor: string;
  target: string;
  timestamp: string;
  ipAddress: string;
}

export interface AuditLogQuery {
  search: string;
  category: string;
  actor: string;
  dateRange: string;
  page: number;
  perPage: number;
}

export interface AuditLogPage {
  logs: AuditLogRecord[];
  total: number;
  page: number;
  perPage: number;
}

function required(value: unknown, label: string): string {
  if (typeof value !== "string") throw new Error(`The audit log response is missing ${label}.`);
  return value;
}

export async function listAuditLogs(query: AuditLogQuery, signal?: AbortSignal): Promise<AuditLogPage> {
  const { data } = await apiClient.get<{
    data: Record<string, unknown>[];
    total: number;
    page: number;
    per_page: number;
  }>("audit-logs", {
    params: {
      search: query.search,
      category: query.category,
      actor: query.actor,
      date_range: query.dateRange,
      page: query.page,
      per_page: query.perPage,
    },
    signal,
  });
  if (!Array.isArray(data?.data) || !Number.isFinite(data.total)) {
    throw new Error("The audit logs response is invalid.");
  }
  return {
    logs: data.data.map((row) => ({
      id: required(row.id, "an ID"),
      category: required(row.category, "a category"),
      action: required(row.action, "an action"),
      actor: required(row.actor, "an actor"),
      target: required(row.target, "a target"),
      timestamp: required(row.timestamp, "a timestamp"),
      ipAddress: typeof row.ip_address === "string" ? row.ip_address : "",
    })),
    total: data.total,
    page: data.page,
    perPage: data.per_page,
  };
}
