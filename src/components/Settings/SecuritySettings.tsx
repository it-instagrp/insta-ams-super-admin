import { useState } from "react";
import { useSettings } from "../../context/SettingsContext";
import type { SecuritySettings as SecuritySettingsType } from "../../services/settingsService";
import { getApiErrorMessage } from "../../services/apiClient";

const rows: { key: keyof SecuritySettingsType; title: string; description: string }[] = [
  { key: "twoFactor", title: "Two-Factor Authentication", description: "Require a verification code in addition to your password" },
  { key: "loginAlerts", title: "Login Alerts", description: "Get notified when a new device signs in" },
  { key: "sessionTimeout", title: "Session Timeout", description: "Automatically sign out after 30 minutes of inactivity" },
];

export default function SecuritySettings() {
  const { settings, updateSecurity } = useSettings();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const toggle = async (key: keyof SecuritySettingsType) => {
    if (busy) return;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await updateSecurity({ [key]: !settings.security[key] });
      setNotice("Security settings saved.");
    } catch (error) {
      setError(getApiErrorMessage(error, "Could not save security settings."));
    } finally {
      setBusy(false);
    }
  };

  return <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
    <h2 className="mb-1 text-lg font-semibold text-text-primary">Account Security</h2>
    <p className="mb-2 text-sm text-text-muted">Manage additional layers of protection.</p>
    {error && <p role="alert" className="mt-3 text-sm text-error">{error}</p>}
    {notice && <p role="status" className="mt-3 text-sm text-primary-dark">{notice}</p>}
    <div className="divide-y divide-border">
      {rows.map((row) => <div key={row.key} className="flex items-center justify-between py-4">
        <div className="pr-4">
          <p className="text-base font-medium text-text-primary">{row.title}</p>
          <p className="mt-0.5 text-sm text-text-muted">{row.description}</p>
        </div>
        <button type="button" role="switch" aria-label={row.title} aria-checked={settings.security[row.key]} disabled={busy}
          onClick={() => void toggle(row.key)}
          className={`relative h-6 w-11 shrink-0 rounded-full transition-colors disabled:opacity-50 ${settings.security[row.key] ? "bg-primary" : "bg-border"}`}>
          <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${settings.security[row.key] ? "translate-x-5" : "translate-x-0.5"}`} />
        </button>
      </div>)}
    </div>
  </div>;
}
