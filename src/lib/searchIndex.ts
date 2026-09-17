/**
 * FILE: lib/searchIndex.ts
 * Purpose: Shared UI/data logic for the Master Admin application.
 * NOTE: Keep presentation unchanged when refactoring; move repeated logic into reusable modules.
 */
// src/lib/searchIndex.ts
import type { LucideIcon } from "lucide-react";
import { Building2, CreditCard, UserCog, Bell } from "lucide-react";

export type SearchResultType = "Organization" | "License" | "Administrator" | "Reminder";

export interface SearchResult {
  id: string;
  type: SearchResultType;
  title: string;
  subtitle: string;
  path: string;
}

export const typeConfig: Record<SearchResultType, { icon: LucideIcon; label: string }> = {
  Organization: { icon: Building2, label: "Organizations" },
  License: { icon: CreditCard, label: "Licenses" },
  Administrator: { icon: UserCog, label: "Administrators" },
  Reminder: { icon: Bell, label: "Reminders" },
};

// Mirrors the mock data used on each page. If you move to a real API/shared
// state later, replace this with a live query instead of a static list.
const searchIndex: SearchResult[] = [
  // Organizations
  { id: "1", type: "Organization", title: "Acme Corp", subtitle: "Enterprise · Active", path: "/organizations/1" },
  { id: "2", type: "Organization", title: "Nimbus Retail", subtitle: "Professional · Trial", path: "/organizations/2" },
  { id: "3", type: "Organization", title: "Bluepeak Logistics", subtitle: "Starter · Pending Renewal", path: "/organizations/3" },
  { id: "4", type: "Organization", title: "Orbit Solutions", subtitle: "Professional · Suspended", path: "/organizations/4" },
  { id: "5", type: "Organization", title: "Vertex Manufacturing", subtitle: "Enterprise · Active", path: "/organizations/5" },

  // Licenses
  { id: "l1", type: "License", title: "Acme Corp", subtitle: "Enterprise license · Active", path: "/licenses" },
  { id: "l2", type: "License", title: "Nimbus Retail", subtitle: "Professional license · Trial", path: "/licenses" },
  { id: "l3", type: "License", title: "Bluepeak Logistics", subtitle: "Starter license · Expired", path: "/licenses" },
  { id: "l4", type: "License", title: "Orbit Solutions", subtitle: "Professional license · Active", path: "/licenses" },
  { id: "l5", type: "License", title: "Vertex Manufacturing", subtitle: "Enterprise license · Active", path: "/licenses" },

  // Administrators
  { id: "a1", type: "Administrator", title: "Master Admin", subtitle: "Super Admin · admin@instaattend.com", path: "/users" },
  { id: "a2", type: "Administrator", title: "Riya Kapoor", subtitle: "Support · riya.kapoor@instaattend.com", path: "/users" },
  { id: "a3", type: "Administrator", title: "Devansh Rao", subtitle: "Billing Admin · devansh.rao@instaattend.com", path: "/users" },
  { id: "a4", type: "Administrator", title: "Anjali Mehta", subtitle: "Read Only · Invited", path: "/users" },
  { id: "a5", type: "Administrator", title: "Karan Shah", subtitle: "Support · Suspended", path: "/users" },

  // Reminders
  { id: "r1", type: "Reminder", title: "Subscription renewal due", subtitle: "Acme Corp — Enterprise plan", path: "/reminders" },
  { id: "r2", type: "Reminder", title: "Trial ending soon", subtitle: "Nimbus Retail — 3 days left", path: "/reminders" },
  { id: "r3", type: "Reminder", title: "New organization pending approval", subtitle: "Bluepeak Logistics", path: "/reminders" },
  { id: "r4", type: "Reminder", title: "Payment failed", subtitle: "Orbit Solutions — retry required", path: "/reminders" },
];

export function searchGlobal(query: string, limit = 8): SearchResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  return searchIndex
    .filter(
      (item) =>
        item.title.toLowerCase().includes(q) || item.subtitle.toLowerCase().includes(q)
    )
    .slice(0, limit);
}