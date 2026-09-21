/**
 * FILE: components/Settings/ProfileSettings.tsx
 * Purpose: Shared UI/data logic for the Master Admin application.
 * NOTE: Keep presentation unchanged when refactoring; move repeated logic into reusable modules.
 */
import { useState } from "react";
import { useSettings } from "../../context/SettingsContext";
import SettingsConfirmModal from "./SettingsConfirmModal";
import { getApiErrorMessage } from "../../services/apiClient";

export default function ProfileSettings() {
  const { settings, updateProfile } = useSettings();

  const [form, setForm] = useState(settings.profile);

  const [showConfirm, setShowConfirm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [pendingChanges, setPendingChanges] = useState<
    Partial<typeof settings.profile>
  >({});

  const handleChange = (
    field: keyof typeof settings.profile,
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
    setSaved(false);
  };

  const handleSaveClick = () => {
    setError("");
    if (!form.name.trim() || !/^\S+@\S+\.\S+$/.test(form.email.trim())) {
      setError("Enter a name and a valid email address.");
      return;
    }
    const changes: Partial<typeof settings.profile> = {};

    if (form.name !== settings.profile.name) {
      changes.name = form.name;
    }

    if (form.email !== settings.profile.email) {
      changes.email = form.email;
    }

    if (form.jobTitle !== settings.profile.jobTitle) {
      changes.jobTitle = form.jobTitle;
    }

    if (form.phone !== settings.profile.phone) {
      changes.phone = form.phone;
    }

    if (form.photo !== settings.profile.photo) {
      changes.photo = form.photo;
    }

    if (Object.keys(changes).length === 0) {
      return;
    }

    setPendingChanges(changes);
    setShowConfirm(true);
  };

  const confirmSave = async () => {
    setBusy(true);
    setError("");
    try {
      await updateProfile(pendingChanges);
      setShowConfirm(false);
      setPendingChanges({});
      setSaved(true);
    } catch (error) {
      setError(getApiErrorMessage(error, "Could not save your profile."));
    } finally {
      setBusy(false);
    }
  };

  const cancelSave = () => {
    setShowConfirm(false);
    setPendingChanges({});
  };

  return (
    <>
      <div className="space-y-6">
        {/* Name */}
        <div>
          <label className="mb-2 block text-sm font-medium text-text-primary">
            Name
          </label>

          <input
            type="text"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className="w-full rounded-lg border border-border px-4 py-2.5 text-sm outline-none focus:border-primary"
            placeholder="Enter your name"
          />
        </div>

        {/* Email */}
        <div>
          <label className="mb-2 block text-sm font-medium text-text-primary">
            Email
          </label>

          <input
            type="email"
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
            className="w-full rounded-lg border border-border px-4 py-2.5 text-sm outline-none focus:border-primary"
            placeholder="Enter email"
          />
        </div>

        {/* Job Title */}
        <div>
          <label className="mb-2 block text-sm font-medium text-text-primary">
            Job Title
          </label>

          <input
            type="text"
            value={form.jobTitle}
            onChange={(e) => handleChange("jobTitle", e.target.value)}
            className="w-full rounded-lg border border-border px-4 py-2.5 text-sm outline-none focus:border-primary"
            placeholder="Enter job title"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="mb-2 block text-sm font-medium text-text-primary">
            Phone
          </label>

          <input
            type="text"
            value={form.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            className="w-full rounded-lg border border-border px-4 py-2.5 text-sm outline-none focus:border-primary"
            placeholder="Enter phone number"
          />
        </div>

        {error && !showConfirm && <p role="alert" className="text-sm text-error">{error}</p>}
        {saved && <p role="status" className="text-sm text-primary-dark">Profile saved.</p>}
        {/* Save */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleSaveClick}
            className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white transition hover:bg-primary-dark"
          >
            Save Changes
          </button>
        </div>
      </div>

      <SettingsConfirmModal
        open={showConfirm}
        title="Confirm Profile Changes"
        message="Are you sure you want to save these profile changes? Your updated name and email will be displayed throughout the application."
        onConfirm={confirmSave}
        onCancel={cancelSave}
        busy={busy}
        error={error}
      />
    </>
  );
}
