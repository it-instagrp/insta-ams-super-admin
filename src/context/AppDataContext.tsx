/**
 * FILE: context/AppDataContext.tsx
 * Purpose: Shared UI/data logic for the Master Admin application.
 * NOTE: Keep presentation unchanged when refactoring; move repeated logic into reusable modules.
 */
import { createContext, useContext, useState, type ReactNode } from "react";
import type { NewOrgFormData } from "../components/Organizations/AddOrganizationModal";
import { addBillingCycle, formatDisplayDate, type BillingCycle } from "../lib/billingCycle";
import { initialOrganizations, initialLicenses, initialOrgAdmins } from "../data/mockData";

export type { BillingCycle };
export type LicenseTier = "Evolution";

export type LicenseRequestStatus = "Pending" | "Approved" | "Rejected";

/** Backend-shaped license approval request model used by the request UI. */
export interface LicenseRequest {
  id: string;
  organizationId: string;
  organizationName: string;
  plan: BillingCycle;
  status: LicenseRequestStatus;
  requestDate: string;
  decisionDate?: string;
  expiryDate?: string;
}

// Maps 1:1 to license_plan / license_started_at / license_expires_at that a
// real backend would return. An organization has NO License record until
// one is explicitly issued via "Issue New License".
export interface License {
  id: string;
  organizationId: string;
  organizationName: string;
  tier: LicenseTier;
  billingCycle: BillingCycle;
  startedAt: string;  // ISO
  expiresAt: string;  // ISO
  cancelled: boolean;
}

export type OrgAdminStatus = "Active" | "Invited" | "Suspended";

export interface OrgAdmin {
  id: string;
  organizationId: string;
  organizationName: string;
  name: string;
  email: string;
  status: OrgAdminStatus;
  lastActive: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  logoUrl: string;
  orgAddress: string;
  adminName: string;
  adminPhone: string;
  email: string;
  plan: BillingCycle;
  status: "Active" | "Trial" | "Suspended" | "Pending Renewal";
  timezone: string;
  maxUsers: number;
  workingDays: string[];
  workingHours: number;
  renewalDate: string;
}

interface AppDataContextValue {
  organizations: Organization[];
  licenses: License[];
  orgAdmins: OrgAdmin[];
  addOrganization: (data: NewOrgFormData) => void;
  toggleSuspendOrganization: (id: string) => void;
  deleteOrganization: (id: string) => void;
  issueLicense: (organizationId: string, billingCycle: BillingCycle) => void;
  renewLicense: (id: string, billingCycle: BillingCycle) => void;
  modifyLicense: (id: string, updates: { tier: LicenseTier; billingCycle: BillingCycle }) => void;
  toggleCancelLicense: (id: string) => void;
  toggleSuspendAdmin: (id: string) => void;
  removeAdmin: (id: string) => void;
}

const AppDataContext = createContext<AppDataContextValue | null>(null);

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [organizations, setOrganizations] = useState<Organization[]>(initialOrganizations);
  const [licenses, setLicenses] = useState<License[]>(initialLicenses);
  const [orgAdmins, setOrgAdmins] = useState<OrgAdmin[]>(initialOrgAdmins);

  // Creating an organization no longer issues a license automatically —
  // it appears in Organizations, and shows up as an "unlicensed" option in
  // the License page's "Issue New License" flow until one is issued.
  const addOrganization = (data: NewOrgFormData) => {
    const id = String(Date.now());

    const newOrg: Organization = {
      id,
      name: data.name,
      slug: data.slug,
      logoUrl: data.logoUrl,
      orgAddress: data.orgAddress,
      adminName: data.adminName,
      adminPhone: data.adminPhone,
      email: data.email,
      plan: data.plan,
      status: data.status,
      timezone: data.timezone,
      maxUsers: data.maxUsers,
      workingDays: data.workingDays,
      workingHours: data.workingHours,
      renewalDate: "—",
    };
    setOrganizations((prev) => [newOrg, ...prev]);

    const newAdmin: OrgAdmin = {
      id: `admin-${id}`,
      organizationId: id,
      organizationName: data.name,
      name: data.adminName,
      email: data.email,
      status: "Invited",
      lastActive: "—",
    };
    setOrgAdmins((prev) => [newAdmin, ...prev]);

    // TODO (future): trigger invite email to data.email once backend exists.
  };

  const toggleSuspendOrganization = (id: string) =>
    setOrganizations((prev) =>
      prev.map((o) => o.id === id ? { ...o, status: o.status === "Suspended" ? "Active" : "Suspended" } : o)
    );

  const deleteOrganization = (id: string) =>
    setOrganizations((prev) => prev.filter((o) => o.id !== id));

  // Explicit action from the "Issue New License" flow.
  const issueLicense = (organizationId: string, billingCycle: BillingCycle) => {
    const org = organizations.find((o) => o.id === organizationId);
    if (!org) return;

    const now = new Date();
    const expires = addBillingCycle(now, billingCycle);
    const expiryDisplay = formatDisplayDate(expires);

    const newLicense: License = {
      id: `lic-${organizationId}`,
      organizationId,
      organizationName: org.name,
      tier: "Evolution",
      billingCycle,
      startedAt: now.toISOString(),
      expiresAt: expires.toISOString(),
      cancelled: false,
    };
    setLicenses((prev) => [newLicense, ...prev]);

    setOrganizations((prev) =>
      prev.map((o) =>
        o.id === organizationId ? { ...o, status: "Active", plan: billingCycle, renewalDate: expiryDisplay } : o
      )
    );
  };

  // Extends expiry by one billing-cycle term from the chosen cycle (which
  // may differ from the license's current cycle). If lapsed, the new term
  // starts fresh from today.
  const renewLicense = (id: string, billingCycle: BillingCycle) => {
    setLicenses((prev) =>
      prev.map((lic) => {
        if (lic.id !== id) return lic;
        const now = new Date();
        const currentExpiry = new Date(lic.expiresAt);
        const isLapsed = lic.cancelled || currentExpiry.getTime() < now.getTime();
        const baseDate = isLapsed ? now : currentExpiry;
        const newExpiry = addBillingCycle(baseDate, billingCycle);
        return {
          ...lic,
          billingCycle,
          cancelled: false,
          startedAt: isLapsed ? now.toISOString() : lic.startedAt,
          expiresAt: newExpiry.toISOString(),
        };
      })
    );
  };

  const modifyLicense = (id: string, updates: { tier: LicenseTier; billingCycle: BillingCycle }) => {
    setLicenses((prev) => prev.map((lic) => (lic.id === id ? { ...lic, ...updates } : lic)));
  };

  const toggleCancelLicense = (id: string) => {
    setLicenses((prev) => prev.map((lic) => (lic.id === id ? { ...lic, cancelled: !lic.cancelled } : lic)));
  };

  const toggleSuspendAdmin = (id: string) =>
    setOrgAdmins((prev) =>
      prev.map((a) => a.id === id ? { ...a, status: a.status === "Suspended" ? "Active" : "Suspended" } : a)
    );

  const removeAdmin = (id: string) =>
    setOrgAdmins((prev) => prev.filter((a) => a.id !== id));

  // Context value is intentionally assembled here so the data/actions boundary
  // stays explicit. A backend service can later replace these implementations.
  const value = {
    organizations, licenses, orgAdmins,
    addOrganization, toggleSuspendOrganization, deleteOrganization,
    issueLicense, renewLicense, modifyLicense, toggleCancelLicense,
    toggleSuspendAdmin, removeAdmin,
  };

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAppData() {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error("useAppData must be used within AppDataProvider");
  return ctx;
}