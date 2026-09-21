import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { clearAuthentication, getAuthSession, isAuthenticated, updateAuthIdentity } from "../services/authService";
import { getApiErrorMessage } from "../services/apiClient";
import {
  getNotifications, getPlatform, getProfile, getSecurity,
  saveNotifications, savePlatform, saveProfile, saveSecurity,
} from "../services/settingsService";
import type {
  NotificationSettings, PlatformSettings, ProfileSettings, SecuritySettings,
} from "../services/settingsService";

export type { NotificationSettings, PlatformSettings, ProfileSettings, SecuritySettings };
export interface AppSettings {
  profile: ProfileSettings;
  security: SecuritySettings;
  notifications: NotificationSettings;
  platform: PlatformSettings;
}
export type SettingsSection = keyof AppSettings;
type SectionState = Record<SettingsSection, boolean>;
type SectionErrors = Record<SettingsSection, string>;

const emptyLoading = (): SectionState => ({ profile: false, security: false, notifications: false, platform: false });
const allLoading = (): SectionState => ({ profile: true, security: true, notifications: true, platform: true });
const emptyErrors = (): SectionErrors => ({ profile: "", security: "", notifications: "", platform: "" });

function initialSettings(): AppSettings {
  const session = getAuthSession();
  return {
    profile: { name: session?.name || "Master Admin", email: session?.email || "", jobTitle: "", phone: "", photo: "" },
    security: { twoFactor: false, loginAlerts: false, sessionTimeout: false },
    notifications: { renewalReminders: false, newOrganizationSignups: false, paymentFailures: false, weeklySummary: false, productUpdates: false },
    platform: { platformName: "Insta Attend", supportEmail: "", timezone: "", currency: "" },
  };
}

interface SettingsContextValue {
  settings: AppSettings;
  loading: SectionState;
  errors: SectionErrors;
  refresh: (section: SettingsSection) => Promise<void>;
  updateProfile: (updates: Partial<ProfileSettings>) => Promise<void>;
  updateSecurity: (updates: Partial<SecuritySettings>) => Promise<void>;
  updateNotifications: (updates: Partial<NotificationSettings>) => Promise<void>;
  updatePlatform: (updates: PlatformSettings) => Promise<void>;
  getInitials: () => string;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(initialSettings);
  const [loading, setLoading] = useState<SectionState>(allLoading);
  const [errors, setErrors] = useState<SectionErrors>(emptyErrors);

  useEffect(() => {
    localStorage.removeItem("adminPassword");
    localStorage.removeItem("instaAttendSettings");
    localStorage.removeItem("userEmail");
    let controller: AbortController | null = null;
    const load = () => {
      controller?.abort();
      controller = new AbortController();
      const signal = controller.signal;
      if (!isAuthenticated()) {
        setSettings(initialSettings());
        setLoading(emptyLoading());
        setErrors(emptyErrors());
        return;
      }
      setSettings(initialSettings());
      setLoading(allLoading());
      setErrors(emptyErrors());
      Promise.allSettled([
        getProfile(signal), getSecurity(signal), getNotifications(signal), getPlatform(signal),
      ]).then(([profile, security, notifications, platform]) => {
        if (signal.aborted) return;
        if (profile.status === "fulfilled") updateAuthIdentity(profile.value.name, profile.value.email);
        setSettings((current) => ({
          profile: profile.status === "fulfilled" ? profile.value : current.profile,
          security: security.status === "fulfilled" ? security.value : current.security,
          notifications: notifications.status === "fulfilled" ? notifications.value : current.notifications,
          platform: platform.status === "fulfilled" ? platform.value : current.platform,
        }));
        setErrors({
          profile: profile.status === "rejected" ? getApiErrorMessage(profile.reason, "Could not load profile settings.") : "",
          security: security.status === "rejected" ? getApiErrorMessage(security.reason, "Could not load security settings.") : "",
          notifications: notifications.status === "rejected" ? getApiErrorMessage(notifications.reason, "Could not load notification settings.") : "",
          platform: platform.status === "rejected" ? getApiErrorMessage(platform.reason, "Could not load platform settings.") : "",
        });
        setLoading(emptyLoading());
      });
    };
    window.addEventListener("auth-changed", load);
    load();
    return () => { controller?.abort(); window.removeEventListener("auth-changed", load); };
  }, []);

  useEffect(() => {
    document.title = `${settings.platform.platformName || "Insta Attend"} | Master Admin`;
  }, [settings.platform.platformName]);

  useEffect(() => {
    if (!settings.security.sessionTimeout || !isAuthenticated()) return;
    const timeoutMs = 30 * 60 * 1000;
    let timer: number | undefined;
    const signOut = () => { clearAuthentication(); window.location.replace("/signin"); };
    const checkActivity = () => {
      const last = Number(localStorage.getItem("lastActivity") || Date.now());
      if (Date.now() - last >= timeoutMs) { signOut(); return; }
      if (timer) window.clearTimeout(timer);
      timer = window.setTimeout(signOut, timeoutMs - (Date.now() - last));
    };
    const activity = () => { localStorage.setItem("lastActivity", String(Date.now())); checkActivity(); };
    const events = ["mousedown", "keydown", "scroll", "touchstart"] as const;
    events.forEach((event) => window.addEventListener(event, activity));
    window.addEventListener("focus", checkActivity);
    checkActivity();
    return () => {
      events.forEach((event) => window.removeEventListener(event, activity));
      window.removeEventListener("focus", checkActivity);
      if (timer) window.clearTimeout(timer);
    };
  }, [settings.security.sessionTimeout]);

  const refresh = useCallback(async (section: SettingsSection) => {
    setLoading((current) => ({ ...current, [section]: true }));
    setErrors((current) => ({ ...current, [section]: "" }));
    try {
      if (section === "profile") {
        const profile = await getProfile();
        updateAuthIdentity(profile.name, profile.email);
        setSettings((current) => ({ ...current, profile }));
      } else if (section === "security") {
        const security = await getSecurity();
        setSettings((current) => ({ ...current, security }));
      } else if (section === "notifications") {
        const notifications = await getNotifications();
        setSettings((current) => ({ ...current, notifications }));
      } else {
        const platform = await getPlatform();
        setSettings((current) => ({ ...current, platform }));
      }
    } catch (error) {
      setErrors((current) => ({ ...current, [section]: getApiErrorMessage(error, `Could not load ${section} settings.`) }));
    } finally {
      setLoading((current) => ({ ...current, [section]: false }));
    }
  }, []);

  const updateProfile = async (updates: Partial<ProfileSettings>) => {
    const profile = await saveProfile(updates);
    updateAuthIdentity(profile.name, profile.email);
    setSettings((current) => ({ ...current, profile }));
  };
  const updateSecurity = async (updates: Partial<SecuritySettings>) => {
    const security = await saveSecurity(updates);
    setSettings((current) => ({ ...current, security }));
  };
  const updateNotifications = async (updates: Partial<NotificationSettings>) => {
    const notifications = await saveNotifications(updates);
    setSettings((current) => ({ ...current, notifications }));
  };
  const updatePlatform = async (updates: PlatformSettings) => {
    const platform = await savePlatform(updates);
    setSettings((current) => ({ ...current, platform }));
  };

  const getInitials = useCallback(() => (settings.profile.name || "Master Admin")
    .trim().split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase() ?? "").join(""), [settings.profile.name]);

  return <SettingsContext.Provider value={{
    settings, loading, errors, refresh,
    updateProfile, updateSecurity, updateNotifications, updatePlatform, getInitials,
  }}>{children}</SettingsContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) throw new Error("useSettings must be used within SettingsProvider");
  return context;
}
