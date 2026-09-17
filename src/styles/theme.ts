/**
 * FILE: styles/theme.ts
 * Purpose: Shared UI/data logic for the Master Admin application.
 * NOTE: Keep presentation unchanged when refactoring; move repeated logic into reusable modules.
 */
export const colors = {
  primary: "#10B981",
  primaryDark: "#059669",
  primaryLight: "#F0FDF9",
  border: "#D9F5E9",
  avatarBg: "#E7F8F1",

  textPrimary: "#0F172A",
  textMuted: "#647589",

  success: "#16A34A",
  warning: "#F59E0B",
  error: "#DC2626",
  info: "#0EA5E9",
  purple: "#8B5CF6",
  pending: "#64748B",

  warningBg: "#FEF3C7",
  errorBg: "#FEE2E2",
  infoBg: "#E0F2FE",
} as const;