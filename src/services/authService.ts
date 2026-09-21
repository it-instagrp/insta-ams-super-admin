import { apiClient, getApiErrorMessage } from "./apiClient";

const SESSION_KEY = "instaSuperAdminSession_v1";
const LEGACY_AUTH_KEY = "masterAdminAuthenticated_v1";
const LEGACY_EMAIL_KEY = "masterAdminUserEmail_v1";

export interface AuthSession {
  token: string;
  email: string;
  name?: string;
}

function readSession(storage: Storage): AuthSession | null {
  try {
    const value = storage.getItem(SESSION_KEY);
    if (!value) return null;
    const parsed: unknown = JSON.parse(value);
    if (!parsed || typeof parsed !== "object") return null;
    const session = parsed as Record<string, unknown>;
    if (typeof session.token !== "string" || !session.token.trim() ||
        typeof session.email !== "string") return null;
    return { token: session.token, email: session.email, name: typeof session.name === "string" ? session.name : undefined };
  } catch {
    return null;
  }
}

export function getAuthSession(): AuthSession | null {
  return readSession(sessionStorage) ?? readSession(localStorage);
}

export function getAccessToken(): string | null {
  return getAuthSession()?.token ?? null;
}

export function updateAuthIdentity(name: string, email: string): void {
  const session = getAuthSession();
  if (!session) return;
  const storage = readSession(sessionStorage) ? sessionStorage : localStorage;
  storage.setItem(SESSION_KEY, JSON.stringify({ ...session, name, email } satisfies AuthSession));
}

export function isAuthenticated(): boolean {
  return getAccessToken() !== null;
}

export function clearAuthentication(): void {
  sessionStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(LEGACY_AUTH_KEY);
  localStorage.removeItem(LEGACY_EMAIL_KEY);
  localStorage.removeItem("lastActivity");
  window.dispatchEvent(new Event("auth-changed"));
}

function extractToken(body: unknown): string | null {
  if (!body || typeof body !== "object") return null;
  const response = body as Record<string, unknown>;
  const data = response.data && typeof response.data === "object"
    ? response.data as Record<string, unknown>
    : response;
  const token = data.token ?? data.accessToken ?? data.access_token;
  return typeof token === "string" && token.trim() ? token : null;
}

export async function signIn(email: string, password: string, remember: boolean): Promise<void> {
  try {
    const response = await apiClient.post<unknown>("auth/login", {
      email: email.trim(),
      password,
    });
    const token = extractToken(response.data);
    if (!token) throw new Error("The login response did not include an access token.");

    const body = response.data as Record<string, unknown>;
    const admin = body.admin && typeof body.admin === "object" ? body.admin as Record<string, unknown> : null;
    const accountEmail = typeof admin?.email === "string" ? admin.email : email.trim();
    const accountName = typeof admin?.name === "string" ? admin.name : undefined;

    clearAuthentication();
    const storage = remember ? localStorage : sessionStorage;
    storage.setItem(SESSION_KEY, JSON.stringify({ token, email: accountEmail, name: accountName } satisfies AuthSession));
    window.dispatchEvent(new Event("auth-changed"));
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Unable to sign in. Please try again."), { cause: error });
  }
}
