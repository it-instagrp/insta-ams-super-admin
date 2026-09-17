/** Development audit-log seed data. Replace with the audit-log API later. */
import type { AuditLogEntry } from "../types";

export const mockAuditLogs: AuditLogEntry[] = [
  { id: "1", category: "License", action: "Renewed license", actor: "Master Admin", target: "Vertex Manufacturing", timestamp: "Today, 3:42 PM", ipAddress: "103.21.244.10" },
  { id: "2", category: "User", action: "Changed role to Billing Admin", actor: "Master Admin", target: "Devansh Rao", timestamp: "Today, 1:15 PM", ipAddress: "103.21.244.10" },
  { id: "3", category: "Organization", action: "Created new organization", actor: "Master Admin", target: "Nimbus Retail", timestamp: "Yesterday, 4:50 PM", ipAddress: "103.21.244.10" },
  { id: "4", category: "Security", action: "Suspended administrator account", actor: "Master Admin", target: "Karan Shah", timestamp: "Yesterday, 2:03 PM", ipAddress: "103.21.244.10" },
  { id: "5", category: "License", action: "Revoked license", actor: "Master Admin", target: "Bluepeak Logistics", timestamp: "Aug 25, 2026, 9:20 AM", ipAddress: "103.21.244.10" },
  { id: "6", category: "Billing", action: "Payment failed — retry required", actor: "System", target: "Orbit Solutions", timestamp: "Aug 24, 2026, 6:00 AM", ipAddress: "—" },
  { id: "7", category: "Organization", action: "Suspended organization", actor: "Master Admin", target: "Orbit Solutions", timestamp: "Aug 22, 2026, 11:30 AM", ipAddress: "103.21.244.10" },
  { id: "8", category: "User", action: "Invited new administrator", actor: "Master Admin", target: "Anjali Mehta", timestamp: "Aug 20, 2026, 3:10 PM", ipAddress: "103.21.244.10" },
];
