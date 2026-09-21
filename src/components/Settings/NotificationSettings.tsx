import { useState } from "react";
import { useSettings } from "../../context/SettingsContext";
import type { NotificationSettings as NotificationSettingsType } from "../../services/settingsService";
import { getApiErrorMessage } from "../../services/apiClient";

const rows: { key: keyof NotificationSettingsType; title: string; description: string }[] = [
  { key: "renewalReminders", title: "Renewal Reminders", description: "Email alerts when a client license is nearing expiry" },
  { key: "newOrganizationSignups", title: "New Organization Signups", description: "Get notified when a new organization joins the platform" },
  { key: "paymentFailures", title: "Payment Failures", description: "Immediate alerts when a client's payment fails" },
  { key: "weeklySummary", title: "Weekly Summary", description: "A digest of platform activity every Monday morning" },
  { key: "productUpdates", title: "Product Updates", description: "News about new Insta Attend features and releases" },
];

export default function NotificationSettings() {
  const { settings, updateNotifications } = useSettings();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const toggle = async (key: keyof NotificationSettingsType) => {
    if (busy) return;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await updateNotifications({ [key]: !settings.notifications[key] });
      setNotice("Notification settings saved.");
    } catch (error) {
      setError(getApiErrorMessage(error, "Could not save notification settings."));
    } finally {
      setBusy(false);
    }
  };

  return <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
    <h2 className="mb-1 text-lg font-semibold text-text-primary">Notifications</h2>
    <p className="mb-2 text-sm text-text-muted">Choose what you want to be notified about.</p>
    {error && <p role="alert" className="mt-3 text-sm text-error">{error}</p>}
    {notice && <p role="status" className="mt-3 text-sm text-primary-dark">{notice}</p>}
    <div className="divide-y divide-border">
      {rows.map((row) => <div key={row.key} className="flex items-center justify-between py-4">
        <div className="pr-4">
          <p className="text-base font-medium text-text-primary">{row.title}</p>
          <p className="mt-0.5 text-sm text-text-muted">{row.description}</p>
        </div>
        <button type="button" role="switch" aria-label={row.title} aria-checked={settings.notifications[row.key]} disabled={busy}
          onClick={() => void toggle(row.key)}
          className={`relative h-6 w-11 shrink-0 rounded-full transition-colors disabled:opacity-50 ${settings.notifications[row.key] ? "bg-primary" : "bg-border"}`}>
          <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${settings.notifications[row.key] ? "translate-x-5" : "translate-x-0.5"}`} />
        </button>
      </div>)}
    </div>
  </div>;
}
