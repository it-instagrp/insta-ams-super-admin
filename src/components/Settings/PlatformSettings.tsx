/**
 * FILE: components/Settings/PlatformSettings.tsx
 * Purpose: Shared UI/data logic for the Master Admin application.
 * NOTE: Keep presentation unchanged when refactoring; move repeated logic into reusable modules.
 */
import { useState } from "react";
import { Check } from "lucide-react";
import { useSettings } from "../../context/SettingsContext";

export default function PlatformSettings() {
  const {
    settings,
    updatePlatform,
  } = useSettings();

  const [form, setForm] =
    useState(settings.platform);

  const [saved, setSaved] =
    useState(false);


  const saveChanges = () => {
    updatePlatform(form);

    setSaved(true);

    window.setTimeout(() => {
      setSaved(false);
    }, 2200);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
        <h2 className="mb-1 text-lg font-semibold text-text-primary">
          General
        </h2>

        <p className="mb-5 text-sm text-text-muted">
          Platform-wide defaults and branding.
        </p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-base font-medium text-text-primary">
              Platform Name
            </label>

            <input
              type="text"
              value={form.platformName}
              onChange={(e) => {
                setForm({
                  ...form,
                  platformName:
                    e.target.value,
                });

                setSaved(false);
              }}
              className="h-10 w-full rounded-lg border border-border bg-white px-3 text-base text-text-primary outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-base font-medium text-text-primary">
              Support Email
            </label>

            <input
              type="email"
              value={form.supportEmail}
              onChange={(e) => {
                setForm({
                  ...form,
                  supportEmail:
                    e.target.value,
                });

                setSaved(false);
              }}
              className="h-10 w-full rounded-lg border border-border bg-white px-3 text-base text-text-primary outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-base font-medium text-text-primary">
              Default Timezone
            </label>

            <select
              value={form.timezone}
              onChange={(e) => {
                setForm({
                  ...form,
                  timezone:
                    e.target.value,
                });

                setSaved(false);
              }}
              className="h-10 w-full rounded-lg border border-border bg-white px-3 text-base text-text-primary outline-none focus:border-primary"
            >
              <option>
                Asia/Kolkata (IST)
              </option>

              <option>UTC</option>

              <option>
                America/New_York (EST)
              </option>

              <option>
                Europe/London (GMT)
              </option>

              <option>
                Asia/Singapore (SGT)
              </option>
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-base font-medium text-text-primary">
              Default Currency
            </label>

            <select
              value={form.currency}
              onChange={(e) => {
                setForm({
                  ...form,
                  currency:
                    e.target.value,
                });

                setSaved(false);
              }}
              className="h-10 w-full rounded-lg border border-border bg-white px-3 text-base text-text-primary outline-none focus:border-primary"
            >
              <option>
                INR (₹)
              </option>

              <option>
                USD ($)
              </option>

              <option>
                EUR (€)
              </option>

              <option>
                GBP (£)
              </option>
            </select>
          </div>
        </div>

        <button
          type="button"
          onClick={saveChanges}
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-base font-medium text-white hover:bg-primary-dark"
        >
          {saved && <Check size={16} />}

          {saved
            ? "Saved"
            : "Save Changes"}
        </button>

        <p className="mt-2 text-xs text-text-muted">
          Platform name changes are reflected
          across the application title immediately.
        </p>
      </div>
    </div>
  );
}