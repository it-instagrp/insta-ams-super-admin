import { apiClient } from "./apiClient";
import type { NewOrgFormData } from "../components/Organizations/AddOrganizationModal";

export interface OrganizationRecord {
  id: string;
  name: string;
  slug: string;
  logoUrl: string;
  orgAddress: string;
  adminName: string;
  adminPhone: string;
  email: string;
  plan: string;
  status: string;
  timezone: string;
  maxUsers: number;
  workingDays: string[];
  workingHours: number;
  renewalDate: string;
}

interface ApiOrganization {
  id: string;
  name: string;
  slug?: string | null;
  logo_url?: string | null;
  org_address?: string | null;
  admin_name?: string | null;
  admin_phone?: string | null;
  email?: string | null;
  plan?: string | null;
  status?: string | null;
  timezone?: string | null;
  max_users?: number | null;
  working_days?: string[] | null;
  working_hours?: number | null;
  renewal_date?: string | null;
}

function mapOrganization(org: ApiOrganization): OrganizationRecord {
  if (!org || typeof org.id !== "string" || typeof org.name !== "string") {
    throw new Error("The organization response is missing an ID or name.");
  }
  return {
    id: org.id,
    name: org.name,
    slug: org.slug ?? "",
    logoUrl: org.logo_url ?? "",
    orgAddress: org.org_address ?? "",
    adminName: org.admin_name ?? "",
    adminPhone: org.admin_phone ?? "",
    email: org.email ?? "",
    plan: org.plan ?? "",
    status: org.status ?? "",
    timezone: org.timezone ?? "",
    maxUsers: org.max_users ?? 0,
    workingDays: Array.isArray(org.working_days) ? org.working_days : [],
    workingHours: org.working_hours ?? 0,
    renewalDate: org.renewal_date ?? "",
  };
}

export interface OrganizationQuery {
  search: string;
  status: string;
  plan: string;
  page: number;
  perPage: number;
}

export interface OrganizationPage {
  organizations: OrganizationRecord[];
  total: number;
  page: number;
  perPage: number;
}

export async function listOrganizations(query: OrganizationQuery, signal?: AbortSignal): Promise<OrganizationPage> {
  const response = await apiClient.get<{
    data: ApiOrganization[]; total: number; page: number; per_page: number;
  }>("organizations", {
    params: {
      search: query.search,
      status: query.status,
      plan: query.plan,
      page: query.page,
      per_page: query.perPage,
    },
    signal,
  });
  const body = response.data;
  if (!Array.isArray(body?.data) || !Number.isFinite(body.total)) {
    throw new Error("The organizations list response is invalid.");
  }
  return {
    organizations: body.data.map(mapOrganization),
    total: body.total,
    page: body.page,
    perPage: body.per_page,
  };
}

export async function getOrganization(id: string, signal?: AbortSignal): Promise<OrganizationRecord> {
  const response = await apiClient.get<ApiOrganization>(`organizations/${encodeURIComponent(id)}`, { signal });
  return mapOrganization(response.data);
}

export async function createOrganization(form: NewOrgFormData): Promise<void> {
  await apiClient.post("organizations", {
    name: form.name.trim(),
    slug: form.slug.trim(),
    email: form.email.trim(),
    timezone: form.timezone,
    admin_name: form.adminName.trim(),
    admin_phone: form.adminPhone.trim(),
    org_address: form.orgAddress.trim(),
    max_users: form.maxUsers,
    working_days: form.workingDays,
    working_hours: form.workingHours,
  });
}

export async function setOrganizationSuspended(id: string, suspended: boolean): Promise<void> {
  await apiClient.patch(`organizations/${encodeURIComponent(id)}/${suspended ? "suspend" : "activate"}`);
}

export async function deleteOrganization(id: string): Promise<void> {
  await apiClient.delete(`organizations/${encodeURIComponent(id)}`);
}
