/**
 * FILE: lib/statusStyles.ts
 * Purpose: Shared UI/data logic for the Master Admin application.
 * NOTE: Keep presentation unchanged when refactoring; move repeated logic into reusable modules.
 */
export type StatusVariant = "success" | "warning" | "error" | "info" | "neutral";

export const statusVariantMap: Record<string, StatusVariant> = {
  // Org statuses
  Active:            "success",
  Trial:             "warning",
  "Pending Renewal": "info",
  Suspended:         "error",
  // License statuses
  Expired:           "error",
  // Admin statuses
  Invited:           "warning",
  // Reminder statuses
  Open:              "success",
  Snoozed:           "warning",
  Resolved:          "neutral",
  // License request
  Approved:          "success",
  Rejected:          "error",
  Pending:           "warning",
  // Cancelled
  Cancelled:         "error",
};

export function statusBadgeClass(status: string): string {
  const variant = statusVariantMap[status] ?? "neutral";
  return `status-badge status-badge--${variant}`;
}