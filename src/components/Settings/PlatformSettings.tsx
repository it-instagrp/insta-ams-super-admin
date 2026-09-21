import { useState } from "react";
import { useSettings } from "../../context/SettingsContext";
import { TIMEZONES } from "../../data/appDefaults";
import { getApiErrorMessage } from "../../services/apiClient";

const currencies = ["INR", "USD", "EUR", "GBP"];

export default function PlatformSettings() {
  const { settings, updatePlatform } = useSettings();
  const [form, setForm] = useState(settings.platform);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const save = async () => {
    setError("");
    setSaved(false);
    if (!form.platformName.trim() || !/^\S+@\S+\.\S+$/.test(form.supportEmail.trim())) {
      setError("Enter a platform name and a valid support email.");
      return;
    }
    setBusy(true);
    try {
      await updatePlatform(form);
      setSaved(true);
    } catch (error) {
      setError(getApiErrorMessage(error, "Could not save platform settings."));
    } finally {
      setBusy(false);
    }
  };

  return <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
    <h2 className="mb-1 text-lg font-semibold text-text-primary">General</h2>
    <p className="mb-5 text-sm text-text-muted">Platform-wide defaults and branding.</p>
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <label className="text-sm font-medium text-text-primary">Platform Name
        <input value={form.platformName} onChange={(event) => { setForm({ ...form, platformName: event.target.value }); setSaved(false); }} className="mt-1.5 h-10 w-full rounded-lg border border-border bg-white px-3" />
      </label>
      <label className="text-sm font-medium text-text-primary">Support Email
        <input type="email" value={form.supportEmail} onChange={(event) => { setForm({ ...form, supportEmail: event.target.value }); setSaved(false); }} className="mt-1.5 h-10 w-full rounded-lg border border-border bg-white px-3" />
      </label>
      <label className="text-sm font-medium text-text-primary">Default Timezone
        <select value={form.timezone} onChange={(event) => { setForm({ ...form, timezone: event.target.value }); setSaved(false); }} className="mt-1.5 h-10 w-full rounded-lg border border-border bg-white px-3">
          {!TIMEZONES.includes(form.timezone as typeof TIMEZONES[number]) && <option value={form.timezone}>{form.timezone}</option>}
          {TIMEZONES.map((timezone) => <option key={timezone} value={timezone}>{timezone}</option>)}
        </select>
      </label>
      <label className="text-sm font-medium text-text-primary">Default Currency
        <select value={form.currency} onChange={(event) => { setForm({ ...form, currency: event.target.value }); setSaved(false); }} className="mt-1.5 h-10 w-full rounded-lg border border-border bg-white px-3">
          {!currencies.includes(form.currency) && <option value={form.currency}>{form.currency}</option>}
          {currencies.map((currency) => <option key={currency} value={currency}>{currency}</option>)}
        </select>
      </label>
    </div>
    {error && <p role="alert" className="mt-4 text-sm text-error">{error}</p>}
    {saved && <p role="status" className="mt-4 text-sm text-primary-dark">Platform settings saved.</p>}
    <button type="button" disabled={busy} onClick={() => void save()} className="mt-6 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white disabled:opacity-50">
      {busy ? "Saving…" : "Save Changes"}
    </button>
  </div>;
}
