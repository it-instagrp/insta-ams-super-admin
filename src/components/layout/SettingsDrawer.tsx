/**
 * FILE: components/layout/SettingsDrawer.tsx
 * Purpose: Shared UI/data logic for the Master Admin application.
 * NOTE: Keep presentation unchanged when refactoring; move repeated logic into reusable modules.
 */
import { useState } from "react";

import {
  X,
  User,
  Lock,
  Bell,
  Sliders,
} from "lucide-react";

import ProfileSettings from "../Settings/ProfileSettings";
import SecuritySettings from "../Settings/SecuritySettings";
import NotificationSettings from "../Settings/NotificationSettings";
import PlatformSettings from "../Settings/PlatformSettings";

type SettingsTab =
  | "profile"
  | "security"
  | "notifications"
  | "platform";

const tabs: {
  id: SettingsTab;
  label: string;
  icon: typeof User;
}[] = [
  {
    id: "profile",
    label: "Profile",
    icon: User,
  },
  {
    id: "security",
    label: "Security",
    icon: Lock,
  },
  {
    id: "notifications",
    label: "Notifications",
    icon: Bell,
  },
  {
    id: "platform",
    label: "Platform",
    icon: Sliders,
  },
];

interface SettingsDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function SettingsDrawer({
  open,
  onClose,
}: SettingsDrawerProps) {
  const [
    activeTab,
    setActiveTab,
  ] = useState<SettingsTab>("profile");

  if (!open) {
    return null;
  }

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/40"
        onClick={onClose}
      />

      <div className="fixed right-0 top-0 z-50 flex h-screen w-full max-w-3xl flex-col bg-primary-light shadow-2xl">
        <div className="flex shrink-0 items-center justify-between border-b border-border bg-white px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-text-primary">
              Settings
            </h2>

            <p className="text-sm text-text-muted">
              Manage your account, security,
              and platform preferences.
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-md p-1.5 text-text-muted hover:bg-primary-light hover:text-primary-dark"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex min-h-0 flex-1 overflow-hidden">
          <div className="w-56 shrink-0 space-y-1 overflow-y-auto border-r border-border bg-white p-3">
            {tabs.map((tab) => {
              const Icon = tab.icon;

              const active =
                activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() =>
                    setActiveTab(tab.id)
                  }
                  className={`relative flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-base font-medium transition-colors ${
                    active
                      ? "bg-primary-light text-primary-dark"
                      : "text-text-muted hover:bg-primary-light hover:text-primary-dark"
                  }`}
                >
                  {active && (
                    <span className="absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-r-full bg-primary" />
                  )}

                  <Icon
                    size={18}
                    strokeWidth={1.8}
                  />

                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {activeTab ===
              "profile" && (
              <ProfileSettings />
            )}

            {activeTab ===
              "security" && (
              <SecuritySettings />
            )}

            {activeTab ===
              "notifications" && (
              <NotificationSettings />
            )}

            {activeTab ===
              "platform" && (
              <PlatformSettings />
            )}
          </div>
        </div>
      </div>
    </>
  );
}