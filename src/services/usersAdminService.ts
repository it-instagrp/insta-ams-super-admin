import { apiClient } from "./apiClient";
import { listOrganizations } from "./organizationService";

export interface AdminRecord {
  id: string;
  organizationId: string;
  organizationName: string;
  name: string;
  email: string;
  status: string;
  lastActive: string | null;
}

export interface UserRecord {
  id: string;
  organizationId: string;
  name: string;
  email: string;
  phone: string;
  enrolled: boolean;
  status: string;
  createdAt: string;
}

export interface UserPage { users: UserRecord[]; total: number; page: number; perPage: number }
export interface UsersQuery {
  organizationId: string;
  enrolled: "" | "true" | "false";
  search: string;
  page: number;
  perPage: number;
}

function required(value: unknown, label: string): string {
  if (typeof value !== "string" || !value) throw new Error(`${label} is missing from the response.`);
  return value;
}

export async function listAdmins(search: string, status: string, signal?: AbortSignal): Promise<AdminRecord[]> {
  const { data } = await apiClient.get<{ data: Record<string, unknown>[] }>("admins", {
    params: { search, status }, signal,
  });
  if (!Array.isArray(data?.data)) throw new Error("The administrators response is invalid.");
  return data.data.map((row) => ({
    id: required(row.id, "Administrator ID"),
    organizationId: required(row.organization_id, "Organization ID"),
    organizationName: required(row.organization_name, "Organization name"),
    name: required(row.name, "Administrator name"),
    email: required(row.email, "Administrator email"),
    status: required(row.status, "Administrator status"),
    lastActive: typeof row.last_active === "string" ? row.last_active : null,
  }));
}

export async function listUsers(query: UsersQuery, signal?: AbortSignal): Promise<UserPage> {
  const params: Record<string, string | number> = {
    organization_id: query.organizationId,
    search: query.search,
    page: query.page,
    per_page: query.perPage,
  };
  if (query.enrolled) params.enrolled = query.enrolled;
  const { data } = await apiClient.get<{
    data: Record<string, unknown>[]; total: number; page: number; per_page: number;
  }>("users", { params, signal });
  if (!Array.isArray(data?.data) || !Number.isFinite(data.total)) {
    throw new Error("The users response is invalid.");
  }
  return {
    users: data.data.map((row) => ({
      id: required(row.id, "User ID"),
      organizationId: required(row.organization_id, "Organization ID"),
      name: required(row.name, "User name"),
      email: required(row.email, "User email"),
      phone: typeof row.phone === "string" ? row.phone : "",
      enrolled: row.enrolled === true,
      status: required(row.status, "User status"),
      createdAt: typeof row.created_at === "string" ? row.created_at : "",
    })),
    total: data.total,
    page: data.page,
    perPage: data.per_page,
  };
}

export async function listOrganizationOptions(signal?: AbortSignal): Promise<{ id: string; name: string }[]> {
  const pageSize = 100;
  const first = await listOrganizations({ search: "", status: "", plan: "", page: 1, perPage: pageSize }, signal);
  const items = [...first.organizations];
  const pages = Math.ceil(first.total / (first.perPage || pageSize));
  for (let page = 2; page <= pages; page += 1) {
    const next = await listOrganizations({ search: "", status: "", plan: "", page, perPage: pageSize }, signal);
    items.push(...next.organizations);
  }
  return items.map((org) => ({ id: org.id, name: org.name }));
}

export async function setAdminSuspended(id: string, suspended: boolean): Promise<void> {
  await apiClient.patch(`admins/${encodeURIComponent(id)}/${suspended ? "suspend" : "activate"}`);
}

export async function deleteAdmin(id: string): Promise<void> {
  await apiClient.delete(`admins/${encodeURIComponent(id)}`);
}

export async function sendAdminResetLink(id: string): Promise<void> {
  await apiClient.get(`admins/${encodeURIComponent(id)}/reset-password`);
}
