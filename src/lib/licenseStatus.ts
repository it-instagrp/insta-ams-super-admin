/**
 * FILE: lib/licenseStatus.ts
 * Purpose: Shared UI/data logic for the Master Admin application.
 * NOTE: Keep presentation unchanged when refactoring; move repeated logic into reusable modules.
 */
// Effective status rules:
// - Trial plan  → always "Trial" (regardless of expiry)
// - Evolution plan, not cancelled, not expired → "Active"
// - Evolution plan, expired or cancelled → "Expired"

export type LicenseEffectiveStatus = "Active" | "Expired" | "Trial";

export function getLicenseEffectiveStatus(
  tier: string,
  expiresAtISO: string,
  cancelled: boolean
): LicenseEffectiveStatus {
  if (tier === "Trial") return "Trial";
  if (cancelled) return "Expired";
  const diff = Math.ceil(
    (new Date(expiresAtISO).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );
  return diff >= 0 ? "Active" : "Expired";
}

export function formatDaysRemaining(
  tier: string,
  expiresAtISO: string,
  cancelled: boolean
): string {
  if (tier === "Trial") return "Trial period";
  if (cancelled) return "Licence cancelled";
  const diff = Math.ceil(
    (new Date(expiresAtISO).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );
  if (diff < 0) return `Expired ${Math.abs(diff)} day${Math.abs(diff) === 1 ? "" : "s"} ago`;
  if (diff === 0) return "Expires today";
  return `${diff} day${diff === 1 ? "" : "s"} left`;
}