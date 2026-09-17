/** Development reminder seed data. Backend reminder records will replace this later. */
import type { Reminder } from "../types";

export const initialReminders: Reminder[] = [
  { id: "1", type: "Renewal", title: "Subscription renewal due", subtitle: "Acme Corp — Yearly plan", dueLabel: "Today", status: "Open" },
  { id: "2", type: "Trial", title: "Trial ending soon", subtitle: "Nimbus Retail — 3 days left", dueLabel: "Tomorrow", status: "Open" },
  { id: "3", type: "Approval", title: "New organization pending approval", subtitle: "Bluepeak Logistics", dueLabel: "2 days", status: "Open" },
  { id: "4", type: "Payment", title: "Payment failed", subtitle: "Orbit Solutions — retry required", dueLabel: "3 days", status: "Open" },
  { id: "5", type: "Renewal", title: "License renewal upcoming", subtitle: "Vertex Manufacturing — Yearly plan", dueLabel: "1 week", status: "Snoozed" },
  { id: "6", type: "Trial", title: "Trial ended", subtitle: "Skyline Freight — converted to paid", dueLabel: "Aug 20, 2026", status: "Resolved" },
];
