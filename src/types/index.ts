/**
 * Shared domain models.
 *
 * These types mirror the data contracts expected from the backend. Keeping them
 * outside UI components prevents the data layer from depending on presentation.
 */

export type ReminderType = "Renewal" | "Trial" | "Approval" | "Payment";
export type ReminderStatus = "Open" | "Snoozed" | "Resolved";

export interface Reminder {
  id: string;
  type: ReminderType;
  title: string;
  subtitle: string;
  dueLabel: string;
  status: ReminderStatus;
}

export type AuditLogCategory = "Organization" | "User" | "License" | "Billing" | "Security";

export interface AuditLogEntry {
  id: string;
  category: AuditLogCategory;
  action: string;
  actor: string;
  target: string;
  timestamp: string;
  ipAddress: string;
}
