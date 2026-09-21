import { useSettings } from "../../context/SettingsContext";
import type { SettingsSection as Section } from "../../context/SettingsContext";
import ProfileSettings from "./ProfileSettings";
import SecuritySettings from "./SecuritySettings";
import NotificationSettings from "./NotificationSettings";
import PlatformSettings from "./PlatformSettings";

export default function SettingsSection({ section }: { section: Section }) {
  const { loading, errors, refresh } = useSettings();
  if (loading[section]) return <div role="status" className="rounded-2xl border border-border bg-white p-6 text-sm text-text-muted">Loading settings…</div>;
  if (errors[section]) return <div role="alert" className="rounded-2xl border border-error bg-error-bg p-6 text-sm text-error">
    {errors[section]} <button type="button" onClick={() => void refresh(section)} className="ml-2 underline">Retry</button>
  </div>;
  if (section === "profile") return <ProfileSettings />;
  if (section === "security") return <SecuritySettings />;
  if (section === "notifications") return <NotificationSettings />;
  return <PlatformSettings />;
}
