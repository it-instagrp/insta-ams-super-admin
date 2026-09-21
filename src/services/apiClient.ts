import axios, { AxiosError } from "axios";

const DEFAULT_API_URL = "https://test-api.ams.instagrp.in/api/v1/";
const baseURL = (import.meta.env.VITE_API_BASE_URL || DEFAULT_API_URL).replace(/\/+$/, "") + "/";
const SESSION_KEY = "instaSuperAdminSession_v1";

function tokenFrom(storage: Storage): string | null {
  try {
    const value = storage.getItem(SESSION_KEY);
    if (!value) return null;
    const session: unknown = JSON.parse(value);
    if (!session || typeof session !== "object") return null;
    const token = (session as Record<string, unknown>).token;
    return typeof token === "string" && token.trim() ? token : null;
  } catch {
    return null;
  }
}

export const apiClient = axios.create({
  baseURL,
  timeout: 20_000,
  headers: { Accept: "application/json" },
});

apiClient.interceptors.request.use((config) => {
  const token = tokenFrom(sessionStorage) ?? tokenFrom(localStorage);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error) && error.response?.status === 401 &&
        !error.config?.url?.includes("auth/login")) {
      sessionStorage.removeItem(SESSION_KEY);
      localStorage.removeItem(SESSION_KEY);
      if (window.location.pathname !== "/signin") window.location.replace("/signin");
    }
    return Promise.reject(error);
  },
);

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof AxiosError) {
    const body: unknown = error.response?.data;
    if (body && typeof body === "object") {
      const message = (body as Record<string, unknown>).message;
      if (typeof message === "string" && message.trim()) return message;
    }
    if (error.response?.status === 401) return "Invalid email or password.";
    if (error.response?.status === 429) return "Too many requests. Please wait a moment and try again.";
    if (!error.response) return "Could not reach the server. Check your connection and try again.";
    return fallback;
  }
  return error instanceof Error ? error.message : fallback;
}
