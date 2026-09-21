import { apiClient } from "./apiClient";

export type ReportPeriod = "1m" | "3m" | "6m" | "12m" | "ytd";

export interface RevenuePoint { month: string; revenue: number }
export interface RevenueReport { points: RevenuePoint[]; currency: string }
export interface PlanDistributionItem { plan: string; count: number; percentage: number }
export interface TopOrganizationItem {
  id: string;
  name: string;
  plan: string;
  revenue: number;
  currency: string;
  growth: number | string | null;
}

function checkList(value: unknown, label: string): Record<string, unknown>[] {
  if (!Array.isArray(value) || !value.every((item) => item !== null && typeof item === "object" && !Array.isArray(item))) {
    throw new Error(`${label} response is invalid.`);
  }
  return value as Record<string, unknown>[];
}

function asNumber(value: unknown, label: string): number {
  if (typeof value !== "number" || !Number.isFinite(value)) throw new Error(`${label} is missing from the report.`);
  return value;
}

function asString(value: unknown, label: string): string {
  if (typeof value !== "string") throw new Error(`${label} is missing from the report.`);
  return value;
}

export async function getRevenueReport(period: ReportPeriod, signal?: AbortSignal): Promise<RevenueReport> {
  const { data } = await apiClient.get<{ data: unknown; currency: unknown }>("reports/revenue", { params: { period }, signal });
  return {
    currency: asString(data.currency, "Currency"),
    points: checkList(data.data, "Revenue").map((row) => ({
      month: asString(row.month, "Month"),
      revenue: asNumber(row.revenue, "Revenue"),
    })),
  };
}

export async function getPlanDistribution(signal?: AbortSignal): Promise<PlanDistributionItem[]> {
  const { data } = await apiClient.get<{ data: unknown }>("reports/plan-distribution", { signal });
  return checkList(data.data, "Plan distribution").map((row) => ({
    plan: asString(row.plan, "Plan"),
    count: asNumber(row.count, "Plan count"),
    percentage: asNumber(row.percentage, "Plan percentage"),
  }));
}

export async function getTopOrganizations(signal?: AbortSignal): Promise<TopOrganizationItem[]> {
  const { data } = await apiClient.get<{ data: unknown }>("reports/top-organizations", { params: { limit: 5 }, signal });
  return checkList(data.data, "Top organizations").map((row) => ({
    id: asString(row.id, "Organization ID"),
    name: asString(row.name, "Organization name"),
    plan: asString(row.plan, "Plan"),
    revenue: asNumber(row.revenue, "Organization revenue"),
    currency: asString(row.currency, "Currency"),
    growth: typeof row.growth === "number" || typeof row.growth === "string" ? row.growth : null,
  }));
}

export async function exportReport(period: ReportPeriod): Promise<void> {
  const response = await apiClient.get<Blob>("reports/export", { params: { period }, responseType: "blob" });
  const contentType = response.headers["content-type"] ?? "";
  if (!String(contentType).includes("text/csv")) throw new Error("The server did not return a CSV report.");
  const url = URL.createObjectURL(response.data);
  const link = document.createElement("a");
  link.href = url;
  link.download = `platform-revenue-${period}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
