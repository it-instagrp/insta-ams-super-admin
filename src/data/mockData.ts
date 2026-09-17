/**
 * FILE: data/mockData.ts
 * Purpose: Development-only seed data. Replace this module with API calls when the backend is connected.
 * NOTE: Keeping mock data outside components/context prevents hardcoded records from being mixed with UI logic.
 */
import type { License, OrgAdmin, Organization } from "../context/AppDataContext";

export const initialOrganizations: Organization[] = [
  {
    id: "1", name: "Acme Corp", slug: "acme-corp", logoUrl: "",
    orgAddress: "Detroit, Michigan, USA",
    adminName: "Sarah Chen", adminPhone: "+1 313 555 0142", email: "admin@acmecorp.com",
    plan: "Yearly", status: "Active", timezone: "America/New_York",
    maxUsers: 500, workingDays: ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"], workingHours: 8,
    renewalDate: "Sep 12, 2026",
  },
  {
    id: "2", name: "Nimbus Retail", slug: "nimbus-retail", logoUrl: "",
    orgAddress: "Austin, Texas, USA",
    adminName: "Priya Nair", adminPhone: "+1 512 555 0198", email: "priya.nair@nimbusretail.com",
    plan: "Monthly", status: "Trial", timezone: "America/New_York",
    maxUsers: 200, workingDays: ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"], workingHours: 8,
    renewalDate: "Aug 29, 2026",
  },
  {
    id: "3", name: "Bluepeak Logistics", slug: "bluepeak-logistics", logoUrl: "",
    orgAddress: "Rotterdam, Netherlands",
    adminName: "Tom Reilly", adminPhone: "+31 6 5555 0123", email: "tom.reilly@bluepeaklogistics.com",
    plan: "Quarterly", status: "Pending Renewal", timezone: "Europe/London",
    maxUsers: 300, workingDays: ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"], workingHours: 9,
    renewalDate: "Aug 27, 2026",
  },
  {
    id: "4", name: "Orbit Solutions", slug: "orbit-solutions", logoUrl: "",
    orgAddress: "Singapore",
    adminName: "James Patel", adminPhone: "+65 9555 0187", email: "james.patel@orbitsolutions.com",
    plan: "Monthly", status: "Suspended", timezone: "Asia/Singapore",
    maxUsers: 150, workingDays: ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"], workingHours: 8,
    renewalDate: "Jul 15, 2026",
  },
  {
    id: "5", name: "Vertex Manufacturing", slug: "vertex-manufacturing", logoUrl: "",
    orgAddress: "Pune, Maharashtra, India",
    adminName: "Maria Gomez", adminPhone: "+91 98765 43210", email: "maria.gomez@vertexmfg.com",
    plan: "Yearly", status: "Active", timezone: "Asia/Kolkata",
    maxUsers: 1000, workingDays: ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"], workingHours: 9,
    renewalDate: "Nov 3, 2026",
  },
];

// Seeded for the first 4 orgs — Vertex Manufacturing (id "5") is left
// deliberately unlicensed, so "Issue New License" has something to show
// out of the box, same as any freshly created organization would.
export const initialLicenses: License[] = [
  {
    id: "lic-1", organizationId: "1", organizationName: "Acme Corp",
    tier: "Evolution", billingCycle: "Yearly",
    startedAt: "2025-09-12T00:00:00.000Z", expiresAt: "2026-09-12T23:59:59.000Z",
    cancelled: false,
  },
  {
    id: "lic-2", organizationId: "2", organizationName: "Nimbus Retail",
    tier: "Evolution", billingCycle: "Monthly",
    startedAt: "2026-07-29T00:00:00.000Z", expiresAt: "2026-08-29T23:59:59.000Z",
    cancelled: false,
  },
  {
    id: "lic-3", organizationId: "3", organizationName: "Bluepeak Logistics",
    tier: "Evolution", billingCycle: "Quarterly",
    startedAt: "2026-05-27T00:00:00.000Z", expiresAt: "2026-08-27T23:59:59.000Z",
    cancelled: false,
  },
  {
    id: "lic-4", organizationId: "4", organizationName: "Orbit Solutions",
    tier: "Evolution", billingCycle: "Monthly",
    startedAt: "2026-06-15T00:00:00.000Z", expiresAt: "2026-07-15T23:59:59.000Z",
    cancelled: true,
  },
];

export const initialOrgAdmins: OrgAdmin[] = [
  { id: "admin-1", organizationId: "1", organizationName: "Acme Corp", name: "Sarah Chen", email: "admin@acmecorp.com", status: "Active", lastActive: "2 hours ago" },
  { id: "admin-2", organizationId: "2", organizationName: "Nimbus Retail", name: "Priya Nair", email: "priya.nair@nimbusretail.com", status: "Invited", lastActive: "—" },
  { id: "admin-3", organizationId: "3", organizationName: "Bluepeak Logistics", name: "Tom Reilly", email: "tom.reilly@bluepeaklogistics.com", status: "Active", lastActive: "1 day ago" },
  { id: "admin-4", organizationId: "4", organizationName: "Orbit Solutions", name: "James Patel", email: "james.patel@orbitsolutions.com", status: "Suspended", lastActive: "3 weeks ago" },
  { id: "admin-5", organizationId: "5", organizationName: "Vertex Manufacturing", name: "Maria Gomez", email: "maria.gomez@vertexmfg.com", status: "Active", lastActive: "5 hours ago" },
];

