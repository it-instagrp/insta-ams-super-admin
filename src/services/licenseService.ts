import { apiClient } from "./apiClient";

export interface LicenseRecord {
  id: string;
  organizationId: string;
  organizationName: string;
  tier: string;
  billingCycle: string;
  startedAt: string;
  expiresAt: string;
  cancelled: boolean;
  status: string;
}

export interface LicenseStats { active: number; trial: number; expired: number }
export interface LicenseList { licenses: LicenseRecord[]; stats: LicenseStats }

interface ApiLicense {
  id: string;
  organization_id: string;
  organization_name: string;
  tier: string;
  billing_cycle: string;
  started_at: string;
  expires_at: string;
  cancelled: boolean;
  status: string;
}

function mapLicense(value: ApiLicense): LicenseRecord {
  if (!value || typeof value.id !== "string" || typeof value.organization_id !== "string") {
    throw new Error("The license response is missing an ID or organization.");
  }
  return {
    id: value.id,
    organizationId: value.organization_id,
    organizationName: value.organization_name ?? "",
    tier: value.tier ?? "",
    billingCycle: value.billing_cycle ?? "",
    startedAt: value.started_at ?? "",
    expiresAt: value.expires_at ?? "",
    cancelled: value.cancelled === true,
    status: value.status ?? "",
  };
}

export async function listLicenses(search: string, status: string, signal?: AbortSignal): Promise<LicenseList> {
  const response = await apiClient.get<{ data: ApiLicense[]; stats: LicenseStats }>("licenses", {
    params: { search, status }, signal,
  });
  const body = response.data;
  if (!Array.isArray(body?.data) || !body.stats ||
      ![body.stats.active, body.stats.trial, body.stats.expired].every(Number.isFinite)) {
    throw new Error("The licenses response is invalid.");
  }
  return { licenses: body.data.map(mapLicense), stats: body.stats };
}

export interface IssueLicenseInput {
  organizationId: string;
  amount: number;
  currency: string;
  paymentReference: string;
}

export async function issueLicense(input: IssueLicenseInput): Promise<void> {
  await apiClient.post("licenses/issue", {
    organization_id: input.organizationId,
    tier: "Evolution",
    billing_cycle: "Monthly",
    amount: input.amount,
    currency: input.currency,
    payment_reference: input.paymentReference.trim(),
  });
}

export async function renewLicense(id: string): Promise<void> {
  await apiClient.post(`licenses/${encodeURIComponent(id)}/renew`, { billing_cycle: "Monthly" });
}

export async function setLicenseCancelled(id: string, cancelled: boolean): Promise<void> {
  await apiClient.patch(`licenses/${encodeURIComponent(id)}/${cancelled ? "cancel" : "reactivate"}`, {
    billing_cycle: "Monthly",
  });
}
