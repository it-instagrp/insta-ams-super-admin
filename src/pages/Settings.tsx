/**
 * FILE: pages/Settings.tsx
 * Purpose: Shared UI/data logic for the Master Admin application.
 * NOTE: Keep presentation unchanged when refactoring; move repeated logic into reusable modules.
 */
import { useState } from "react";
import { User, Lock, Bell, Sliders } from "lucide-react";
import ProfileSettings from "../components/Settings/ProfileSettings";
import SecuritySettings from "../components/Settings/SecuritySettings";
import NotificationSettings from "../components/Settings/NotificationSettings";
import PlatformSettings from "../components/Settings/PlatformSettings";

type SettingsTab = "profile" | "security" | "notifications" | "platform";

const tabs: { id: SettingsTab; label: string; icon: typeof User }[] = [
  { id: "profile", label: "Profile", icon: User },
  { id: "security", label: "Security", icon: Lock },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "platform", label: "Platform", icon: Sliders },
];

export default function Settings() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");

  return (
    <div>
      <h1 className="text-2xl font-semibold text-text-primary">Settings</h1>
      <p className="mt-1 text-sm text-text-muted">
        Manage your account, security, and platform preferences.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Side nav */}
        <div className="lg:col-span-1">
          <div className="space-y-1 rounded-2xl border border-border bg-white p-3 shadow-sm">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-base font-medium transition-colors ${
                    active
                      ? "bg-primary-light text-primary-dark"
                      : "text-text-muted hover:bg-primary-light hover:text-primary-dark"
                  }`}
                >
                  {active && (
                    <span className="absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-r-full bg-primary" />
                  )}
                  <Icon size={18} strokeWidth={1.8} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {activeTab === "profile" && <ProfileSettings />}
          {activeTab === "security" && <SecuritySettings />}
          {activeTab === "notifications" && <NotificationSettings />}
          {activeTab === "platform" && <PlatformSettings />}
        </div>
      </div>
    </div>
  );
}