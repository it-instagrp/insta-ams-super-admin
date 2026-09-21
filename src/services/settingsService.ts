import { apiClient } from "./apiClient";

export interface ProfileSettings {
  name: string;
  email: string;
  jobTitle: string;
  phone: string;
  photo: string;
}
export interface SecuritySettings {
  twoFactor: boolean;
  loginAlerts: boolean;
  sessionTimeout: boolean;
}
export interface NotificationSettings {
  renewalReminders: boolean;
  newOrganizationSignups: boolean;
  paymentFailures: boolean;
  weeklySummary: boolean;
  productUpdates: boolean;
}
export interface PlatformSettings {
  platformName: string;
  supportEmail: string;
  timezone: string;
  currency: string;
}

function object(value: unknown, label: string): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error(`${label} response is invalid.`);
  return value as Record<string, unknown>;
}
function string(value: unknown, label: string): string {
  if (typeof value !== "string") throw new Error(`${label} is missing from the response.`);
  return value;
}
function boolean(value: unknown, label: string): boolean {
  if (typeof value !== "boolean") throw new Error(`${label} is missing from the response.`);
  return value;
}
function optionalString(value: unknown): string { return typeof value === "string" ? value : ""; }

export async function getProfile(signal?: AbortSignal): Promise<ProfileSettings> {
  const { data } = await apiClient.get<unknown>("settings/profile", { signal });
  const row = object(data, "Profile");
  return {
    name: string(row.name, "Name"),
    email: string(row.email, "Email"),
    jobTitle: optionalString(row.job_title),
    phone: optionalString(row.phone),
    photo: optionalString(row.avatar_url),
  };
}

export async function saveProfile(updates: Partial<ProfileSettings>): Promise<ProfileSettings> {
  const payload: Record<string, string> = {};
  if (updates.name !== undefined) payload.name = updates.name.trim();
  if (updates.email !== undefined) payload.email = updates.email.trim();
  if (updates.jobTitle !== undefined) payload.job_title = updates.jobTitle.trim();
  if (updates.phone !== undefined) payload.phone = updates.phone.trim();
  await apiClient.patch("settings/profile", payload);
  return getProfile();
}

export async function getSecurity(signal?: AbortSignal): Promise<SecuritySettings> {
  const { data } = await apiClient.get<unknown>("settings/security", { signal });
  const row = object(data, "Security");
  return {
    twoFactor: boolean(row.two_factor_enabled, "Two-factor setting"),
    loginAlerts: boolean(row.login_alerts_enabled, "Login alerts setting"),
    sessionTimeout: boolean(row.session_timeout_enabled, "Session timeout setting"),
  };
}

export async function saveSecurity(updates: Partial<SecuritySettings>): Promise<SecuritySettings> {
  const payload: Record<string, boolean> = {};
  if (updates.twoFactor !== undefined) payload.two_factor_enabled = updates.twoFactor;
  if (updates.loginAlerts !== undefined) payload.login_alerts_enabled = updates.loginAlerts;
  if (updates.sessionTimeout !== undefined) payload.session_timeout_enabled = updates.sessionTimeout;
  await apiClient.patch("settings/security", payload);
  return getSecurity();
}

export async function getNotifications(signal?: AbortSignal): Promise<NotificationSettings> {
  const { data } = await apiClient.get<unknown>("settings/notifications", { signal });
  const row = object(data, "Notifications");
  return {
    renewalReminders: boolean(row.renewal_reminders, "Renewal reminders setting"),
    newOrganizationSignups: boolean(row.new_org_signups, "New organization setting"),
    paymentFailures: boolean(row.payment_failures, "Payment failures setting"),
    weeklySummary: boolean(row.weekly_summary, "Weekly summary setting"),
    productUpdates: boolean(row.product_updates, "Product updates setting"),
  };
}

export async function saveNotifications(updates: Partial<NotificationSettings>): Promise<NotificationSettings> {
  const payload: Record<string, boolean> = {};
  if (updates.renewalReminders !== undefined) payload.renewal_reminders = updates.renewalReminders;
  if (updates.newOrganizationSignups !== undefined) payload.new_org_signups = updates.newOrganizationSignups;
  if (updates.paymentFailures !== undefined) payload.payment_failures = updates.paymentFailures;
  if (updates.weeklySummary !== undefined) payload.weekly_summary = updates.weeklySummary;
  if (updates.productUpdates !== undefined) payload.product_updates = updates.productUpdates;
  await apiClient.patch("settings/notifications", payload);
  return getNotifications();
}

export async function getPlatform(signal?: AbortSignal): Promise<PlatformSettings> {
  const { data } = await apiClient.get<unknown>("settings/platform", { signal });
  const row = object(data, "Platform");
  return {
    platformName: string(row.platform_name, "Platform name"),
    supportEmail: string(row.support_email, "Support email"),
    timezone: string(row.default_timezone, "Timezone"),
    currency: string(row.default_currency, "Currency"),
  };
}

export async function savePlatform(updates: PlatformSettings): Promise<PlatformSettings> {
  await apiClient.patch("settings/platform", {
    platform_name: updates.platformName.trim(),
    support_email: updates.supportEmail.trim(),
    default_timezone: updates.timezone,
    default_currency: updates.currency,
  });
  return getPlatform();
}
