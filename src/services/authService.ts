/**
 * FILE: services/authService.ts
 * Purpose: Centralize frontend authentication state storage.
 * NOTE: Replace these helpers with real backend authentication once the API is connected.
 */

// Versioned key prevents an old development login from silently authenticating a new build.
export const AUTH_STORAGE_KEY = "masterAdminAuthenticated_v1";
export const USER_EMAIL_STORAGE_KEY = "masterAdminUserEmail_v1";

export function isAuthenticated(): boolean {
  return localStorage.getItem(AUTH_STORAGE_KEY) === "true";
}

export function setAuthenticated(email: string): void {
  localStorage.setItem(AUTH_STORAGE_KEY, "true");
  localStorage.setItem(USER_EMAIL_STORAGE_KEY, email);
}

export function clearAuthentication(): void {
  localStorage.removeItem(AUTH_STORAGE_KEY);
  localStorage.removeItem(USER_EMAIL_STORAGE_KEY);
  localStorage.removeItem("lastActivity");
}
