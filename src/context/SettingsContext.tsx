import { isAuthenticated, clearAuthentication } from "../services/authService";
/**
 * FILE: context/SettingsContext.tsx
 * Purpose: Shared UI/data logic for the Master Admin application.
 * NOTE: Keep presentation unchanged when refactoring; move repeated logic into reusable modules.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type ProfileSettings = {
  name: string;
  email: string;
  jobTitle: string;
  phone: string;
  photo: string;
};

export type SecuritySettings = {
  twoFactor: boolean;
  loginAlerts: boolean;
  sessionTimeout: boolean;
};

export type NotificationSettings = {
  renewalReminders: boolean;
  newOrganizationSignups: boolean;
  paymentFailures: boolean;
  weeklySummary: boolean;
  productUpdates: boolean;
};

export type PlatformSettings = {
  platformName: string;
  supportEmail: string;
  timezone: string;
  currency: string;
};

export type AppSettings = {
  profile: ProfileSettings;
  security: SecuritySettings;
  notifications: NotificationSettings;
  platform: PlatformSettings;
};

const STORAGE_KEY = "instaAttendSettings";
const DEFAULT_PASSWORD = "admin123";

const defaultSettings: AppSettings = {
  profile: {
    name: "Master Admin",
    email: "admin@instaattend.com",
    jobTitle: "Platform Administrator",
    phone: "",
    photo: "",
  },

  security: {
    twoFactor: true,
    loginAlerts: true,
    sessionTimeout: false,
  },

  notifications: {
    renewalReminders: true,
    newOrganizationSignups: true,
    paymentFailures: true,
    weeklySummary: false,
    productUpdates: false,
  },

  platform: {
    platformName: "Insta Attend",
    supportEmail: "support@instaattend.com",
    timezone: "Asia/Kolkata (IST)",
    currency: "INR (₹)",
  },
};

function loadSettings(): AppSettings {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return defaultSettings;
    }

    const parsed = JSON.parse(saved) as Partial<AppSettings>;

    return {
      profile: {
        ...defaultSettings.profile,
        ...(parsed.profile ?? {}),
      },

      security: {
        ...defaultSettings.security,
        ...(parsed.security ?? {}),
      },

      notifications: {
        ...defaultSettings.notifications,
        ...(parsed.notifications ?? {}),
      },

      platform: {
        ...defaultSettings.platform,
        ...(parsed.platform ?? {}),
      },
    };
  } catch {
    return defaultSettings;
  }
}

interface SettingsContextValue {
  settings: AppSettings;

  updateProfile: (
    updates: Partial<ProfileSettings>
  ) => void;

  updateSecurity: (
    updates: Partial<SecuritySettings>
  ) => void;

  updateNotifications: (
    updates: Partial<NotificationSettings>
  ) => void;

  updatePlatform: (
    updates: Partial<PlatformSettings>
  ) => void;

  resetSettings: () => void;

  changePassword: (
    currentPassword: string,
    newPassword: string
  ) => {
    success: boolean;
    message: string;
  };

  getInitials: () => string;
}

const SettingsContext =
  createContext<SettingsContextValue | null>(null);

export function SettingsProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [settings, setSettings] =
    useState<AppSettings>(loadSettings);

  /*
   * Save settings whenever anything changes.
   */
  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(settings)
    );

    localStorage.setItem(
      "userEmail",
      settings.profile.email
    );

    document.title = `${settings.platform.platformName} | Master Admin`;
  }, [settings]);

  /*
   * Session timeout.
   */
  useEffect(() => {
    if (
      !settings.security.sessionTimeout ||
      !isAuthenticated()
    ) {
      return;
    }

    let timer: number | undefined;

    const timeoutMs = 30 * 60 * 1000;

    const refreshTimer = () => {
      localStorage.setItem(
        "lastActivity",
        String(Date.now())
      );

      if (timer) {
        window.clearTimeout(timer);
      }

      timer = window.setTimeout(() => {
        clearAuthentication();

        if (window.location.pathname !== "/signin") {
          window.location.replace("/signin");
        }
      }, timeoutMs);
    };

    const events = [
      "mousedown",
      "keydown",
      "scroll",
      "touchstart",
    ] as const;

    events.forEach((event) =>
      window.addEventListener(event, refreshTimer)
    );

    refreshTimer();

    return () => {
      events.forEach((event) =>
        window.removeEventListener(event, refreshTimer)
      );

      if (timer) {
        window.clearTimeout(timer);
      }
    };
  }, [settings.security.sessionTimeout]);

  /*
   * Profile
   */
  const updateProfile = (
    updates: Partial<ProfileSettings>
  ) => {
    setSettings((prev) => ({
      ...prev,

      profile: {
        ...prev.profile,
        ...updates,
      },
    }));
  };

  /*
   * Security
   */
  const updateSecurity = (
    updates: Partial<SecuritySettings>
  ) => {
    setSettings((prev) => ({
      ...prev,

      security: {
        ...prev.security,
        ...updates,
      },
    }));
  };

  /*
   * Notifications
   */
  const updateNotifications = (
    updates: Partial<NotificationSettings>
  ) => {
    setSettings((prev) => ({
      ...prev,

      notifications: {
        ...prev.notifications,
        ...updates,
      },
    }));
  };

  /*
   * Platform
   */
  const updatePlatform = (
    updates: Partial<PlatformSettings>
  ) => {
    setSettings((prev) => ({
      ...prev,

      platform: {
        ...prev.platform,
        ...updates,
      },
    }));
  };

  /*
   * Reset all settings.
   */
  const resetSettings = () => {
    localStorage.removeItem(STORAGE_KEY);

    setSettings(defaultSettings);
  };

  /*
   * Change password.
   */
  const changePassword = (
    currentPassword: string,
    newPassword: string
  ) => {
    const savedPassword =
      localStorage.getItem("adminPassword") ??
      DEFAULT_PASSWORD;

    if (currentPassword !== savedPassword) {
      return {
        success: false,
        message: "Current password is incorrect.",
      };
    }

    if (newPassword.length < 6) {
      return {
        success: false,
        message:
          "New password must be at least 6 characters.",
      };
    }

    localStorage.setItem(
      "adminPassword",
      newPassword
    );

    return {
      success: true,
      message: "Password updated successfully.",
    };
  };

  /*
   * Generate initials from the current name.
   */
  const getInitials = useCallback(() => {
    const name = settings.profile.name.trim();

    if (!name) {
      return "MA";
    }

    return name
      .split(/\s+/)
      .slice(0, 2)
      .map(
        (part) =>
          part[0]?.toUpperCase() ?? ""
      )
      .join("");
  }, [settings.profile.name]);

  // Expose settings state and actions through one stable API surface for pages.
  const value = {
    settings,
    updateProfile,
    updateSecurity,
    updateNotifications,
    updatePlatform,
    resetSettings,
    changePassword,
    getInitials,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSettings() {
  const context = useContext(SettingsContext);

  if (!context) {
    throw new Error(
      "useSettings must be used within SettingsProvider"
    );
  }

  return context;
}