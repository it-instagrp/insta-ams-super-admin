/**
 * FILE: components/Settings/SecuritySettings.tsx
 * Purpose: Shared UI/data logic for the Master Admin application.
 * NOTE: Keep presentation unchanged when refactoring; move repeated logic into reusable modules.
 */
import { useState } from "react";
import { Check } from "lucide-react";
import { useSettings } from "../../context/SettingsContext";

function ToggleRow({
  title,
  description,
  checked,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between py-4">
      <div className="pr-4">
        <p className="text-base font-medium text-text-primary">
          {title}
        </p>

        <p className="mt-0.5 text-sm text-text-muted">
          {description}
        </p>
      </div>

      <button
        type="button"
        aria-pressed={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
          checked
            ? "bg-primary"
            : "bg-border"
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
            checked
              ? "translate-x-5"
              : "translate-x-0.5"
          }`}
        />
      </button>
    </div>
  );
}

export default function SecuritySettings() {
  const {
    settings,
    updateSecurity,
    changePassword,
  } = useSettings();

  const [
    currentPassword,
    setCurrentPassword,
  ] = useState("");

  const [
    newPassword,
    setNewPassword,
  ] = useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  const updatePassword = () => {
    setMessage("");
    setError("");

    if (newPassword !== confirmPassword) {
      setError(
        "New password and confirmation do not match."
      );

      return;
    }

    const result = changePassword(
      currentPassword,
      newPassword
    );

    if (!result.success) {
      setError(result.message);
      return;
    }

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");

    setMessage(result.message);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
        <h2 className="mb-1 text-lg font-semibold text-text-primary">
          Password
        </h2>

        <p className="mb-5 text-sm text-text-muted">
          Change your account password.
        </p>

        <div className="space-y-4 sm:max-w-sm">
          <input
            aria-label="Current Password"
            type="password"
            value={currentPassword}
            onChange={(e) =>
              setCurrentPassword(
                e.target.value
              )
            }
            placeholder="Current Password"
            className="h-10 w-full rounded-lg border border-border bg-white px-3 text-base text-text-primary outline-none focus:border-primary"
          />

          <input
            aria-label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) =>
              setNewPassword(
                e.target.value
              )
            }
            placeholder="New Password"
            className="h-10 w-full rounded-lg border border-border bg-white px-3 text-base text-text-primary outline-none focus:border-primary"
          />

          <input
            aria-label="Confirm New Password"
            type="password"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(
                e.target.value
              )
            }
            placeholder="Confirm New Password"
            className="h-10 w-full rounded-lg border border-border bg-white px-3 text-base text-text-primary outline-none focus:border-primary"
          />
        </div>

        {error && (
          <p className="mt-3 text-sm text-error">
            {error}
          </p>
        )}

        {message && (
          <p className="mt-3 text-sm text-primary-dark">
            {message}
          </p>
        )}

        <button
          type="button"
          onClick={updatePassword}
          className="mt-5 rounded-lg bg-primary px-5 py-2.5 text-base font-medium text-white hover:bg-primary-dark"
        >
          Update Password
        </button>

        <p className="mt-2 text-xs text-text-muted">
          Demo account default password:
          admin123
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
        <h2 className="mb-1 text-lg font-semibold text-text-primary">
          Account Security
        </h2>

        <p className="mb-2 text-sm text-text-muted">
          Manage additional layers of protection.
        </p>

        <div className="divide-y divide-border">
          <ToggleRow
            title="Two-Factor Authentication"
            description="Require a verification code in addition to your password"
            checked={
              settings.security.twoFactor
            }
            onChange={(value) =>
              updateSecurity({
                twoFactor: value,
              })
            }
          />

          <ToggleRow
            title="Login Alerts"
            description="Get notified by email when a new device signs in"
            checked={
              settings.security.loginAlerts
            }
            onChange={(value) =>
              updateSecurity({
                loginAlerts: value,
              })
            }
          />

          <ToggleRow
            title="Session Timeout"
            description="Automatically sign out after 30 minutes of inactivity"
            checked={
              settings.security.sessionTimeout
            }
            onChange={(value) =>
              updateSecurity({
                sessionTimeout: value,
              })
            }
          />
        </div>

        <div className="mt-3 inline-flex items-center gap-2 text-xs text-text-muted">
          <Check
            size={14}
            className="text-primary"
          />

          Security preferences are saved automatically.
        </div>
      </div>
    </div>
  );
}