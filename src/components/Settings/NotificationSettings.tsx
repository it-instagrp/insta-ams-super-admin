/**
 * FILE: components/Settings/NotificationSettings.tsx
 * Purpose: Shared UI/data logic for the Master Admin application.
 * NOTE: Keep presentation unchanged when refactoring; move repeated logic into reusable modules.
 */
import { useState } from "react";

function ToggleRow({
  title,
  description,
  defaultChecked = false,
}: {
  title: string;
  description: string;
  defaultChecked?: boolean;
}) {
  const [checked, setChecked] = useState(defaultChecked);

  return (
    <div className="flex items-center justify-between py-4">
      <div className="pr-4">
        <p className="text-base font-medium text-text-primary">{title}</p>
        <p className="mt-0.5 text-sm text-text-muted">{description}</p>
      </div>

      <button
        onClick={() => setChecked((c) => !c)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
          checked ? "bg-primary" : "bg-border"
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
            checked ? "translate-x-5" : "translate-x-0.5"
          }`}
        />
      </button>
    </div>
  );
}

export default function NotificationSettings() {
  return (
    <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
      <h2 className="mb-1 text-lg font-semibold text-text-primary">Notifications</h2>
      <p className="mb-2 text-sm text-text-muted">
        Choose what you want to be notified about.
      </p>

      <div className="divide-y divide-border">
        <ToggleRow
          title="Renewal Reminders"
          description="Email alerts when a client license is nearing expiry"
          defaultChecked
        />
        <ToggleRow
          title="New Organization Signups"
          description="Get notified when a new organization joins the platform"
          defaultChecked
        />
        <ToggleRow
          title="Payment Failures"
          description="Immediate alerts when a client's payment fails"
          defaultChecked
        />
        <ToggleRow
          title="Weekly Summary"
          description="A digest of platform activity every Monday morning"
        />
        <ToggleRow
          title="Product Updates"
          description="News about new Insta Attend features and releases"
        />
      </div>
    </div>
  );
}