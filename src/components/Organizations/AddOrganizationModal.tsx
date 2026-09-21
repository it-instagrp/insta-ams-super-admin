/**
 * FILE: components/Organizations/AddOrganizationModal.tsx
 * Purpose: Shared UI/data logic for the Master Admin application.
 * NOTE: Keep presentation unchanged when refactoring; move repeated logic into reusable modules.
 */
import { X, Building2, User, Settings, CheckCircle } from "lucide-react";
import { useState } from "react";
import { DAY_SHORT, DAYS, DEFAULT_WORKING_DAYS, TIMEZONES } from "../../data/appDefaults";
import { getApiErrorMessage } from "../../services/apiClient";

interface AddOrganizationModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: NewOrgFormData) => Promise<void>;
}

export interface NewOrgFormData {
  name: string;
  slug: string;
  logoUrl: string;
  adminName: string;
  adminPhone: string;
  email: string;
  orgAddress: string;
  plan: "Monthly" | "Quarterly" | "Yearly";
  status: "Active" | "Trial";
  timezone: string;
  maxUsers: number;
  workingDays: string[];
  workingHours: number;
}

const EMPTY: NewOrgFormData = {
  name: "", slug: "", logoUrl: "", adminName: "", adminPhone: "",
  email: "", orgAddress: "", plan: "Monthly", status: "Trial",
  timezone: "Asia/Kolkata", maxUsers: 500,
  workingDays: DEFAULT_WORKING_DAYS, workingHours: 8,
};

type Step = 1 | 2 | "confirm";

export default function AddOrganizationModal({ open, onClose, onSubmit }: AddOrganizationModalProps) {
  const [step, setStep] = useState<Step>(1);
  const [formData, setFormData] = useState<NewOrgFormData>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof NewOrgFormData, string>>>({});
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!open) return null;

  const set = <K extends keyof NewOrgFormData>(field: K, value: NewOrgFormData[K]) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const clearError = (field: keyof NewOrgFormData) =>
    setErrors((prev) => { const n = { ...prev }; delete n[field]; return n; });

  const toggleDay = (day: string) =>
    setFormData((prev) => ({
      ...prev,
      workingDays: prev.workingDays.includes(day)
        ? prev.workingDays.filter((d) => d !== day)
        : [...prev.workingDays, day],
    }));

  const validateStep1 = () => {
    const e: typeof errors = {};
    if (!formData.name.trim())      e.name      = "Required";
    if (!formData.slug.trim())      e.slug      = "Required";
    else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(formData.slug.trim())) e.slug = "Use lowercase letters, numbers, and hyphens";
    if (!formData.adminName.trim()) e.adminName = "Required";
    if (!formData.email.trim())     e.email     = "Required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) e.email = "Enter a valid email";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = () => {
    const e: typeof errors = {};
    if (!Number.isInteger(formData.maxUsers) || formData.maxUsers < 1 || formData.maxUsers > 10000) e.maxUsers = "Enter 1 to 10,000 users";
    if (formData.workingDays.length === 0) e.workingDays = "Select at least one day";
    if (!Number.isInteger(formData.workingHours) || formData.workingHours < 1 || formData.workingHours > 24) e.workingHours = "Enter 1 to 24 hours";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleClose = () => { if (submitting) return; setStep(1); setErrors({}); setSubmitError(""); setFormData(EMPTY); onClose(); };

  const handleConfirmAdd = async () => {
    setSubmitting(true);
    setSubmitError("");
    try {
      await onSubmit(formData);
      setFormData(EMPTY);
      setErrors({});
      setStep(1);
      onClose();
    } catch (error) {
      setSubmitError(getApiErrorMessage(error, "Could not create the organization."));
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls = (field?: keyof NewOrgFormData) =>
    `h-10 w-full rounded-lg border px-3 text-sm text-text-primary outline-none placeholder:text-text-muted focus:border-primary bg-white transition-colors ${
      field && errors[field] ? "border-error" : "border-border"
    }`;
  const labelCls = "mb-1 block text-sm font-medium text-text-primary";
  const errCls   = "mt-0.5 text-xs text-error";

  // ── CONFIRM SCREEN ──────────────────────────────────────────────────
  if (step === "confirm") {
    const rows: [string, string][] = [
      ["Organization", formData.name],
      ["Identifier", formData.slug],
      ["Org Address", formData.orgAddress || "—"],
      ["Admin Name", formData.adminName],
      ["Admin Email", formData.email],
      ["Admin Phone", formData.adminPhone || "—"],
      ["Timezone", formData.timezone],
      ["Max Users", String(formData.maxUsers)],
      ["Working Days", formData.workingDays.map((d) => DAY_SHORT[d]).join(", ") || "—"],
      ["Working Hours", `${formData.workingHours}h / day`],
    ];

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
        <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
          <div className="flex items-center gap-3 border-b border-border px-6 py-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-light text-primary">
              <CheckCircle size={18} />
            </div>
            <div>
              <h2 className="text-base font-semibold text-text-primary">Confirm New Organization</h2>
              <p className="text-sm text-text-muted">Review the details before adding.</p>
            </div>
          </div>

          <div className="max-h-[55vh] overflow-y-auto px-6 py-4">
            <div className="divide-y divide-border rounded-xl border border-border overflow-hidden">
              {rows.map(([label, val]) => (
                <div key={label} className="flex items-start gap-4 px-4 py-2.5">
                  <span className="w-36 shrink-0 text-sm text-text-muted">{label}</span>
                  <span className="flex-1 text-sm font-medium text-text-primary break-all">{val}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-border px-6 py-4">
            {submitError && <p role="alert" className="mr-auto text-sm text-error">{submitError}</p>}
            <button disabled={submitting} onClick={() => setStep(2)}
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-text-muted hover:bg-primary-light">
              ← Back
            </button>
            <button disabled={submitting} onClick={handleClose}
              className="rounded-lg border border-error px-4 py-2 text-sm font-medium text-error hover:bg-error-bg">
              Cancel
            </button>
            <button disabled={submitting} onClick={handleConfirmAdd}
              className="rounded-lg bg-primary px-5 py-2 text-sm font-medium text-white hover:bg-primary-dark">
              {submitting ? "Adding…" : "Add Organization"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const stepMeta = [
    { icon: Building2, label: "Organization & Admin Details" },
    { icon: Settings,  label: "Settings & Configuration" },
  ];
  const currentMeta = stepMeta[(step as number) - 1];
  const StepIcon = currentMeta.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl">

        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-light text-primary">
              <StepIcon size={17} />
            </div>
            <div>
              <h2 className="text-base font-semibold text-text-primary">Add Organization</h2>
              <p className="text-sm text-text-muted">Step {step} of 2 — {currentMeta.label}</p>
            </div>
          </div>
          <button onClick={handleClose} className="rounded-md p-1 text-text-muted hover:bg-primary-light hover:text-primary-dark">
            <X size={18} />
          </button>
        </div>

        <div className="flex gap-2 px-6 pt-4">
          {[1, 2].map((s) => (
            <div key={s} className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${(step as number) >= s ? "bg-primary" : "bg-border"}`} />
          ))}
        </div>

        <div className="max-h-[60vh] overflow-y-auto px-6 py-5">

          {step === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Organization Name *</label>
                  <input type="text" value={formData.name}
                    onChange={(e) => { set("name", e.target.value); clearError("name"); }}
                    placeholder="e.g. Insta Group Pvt Ltd"
                    className={inputCls("name")} />
                  {errors.name && <p className={errCls}>{errors.name}</p>}
                </div>
                <div>
                  <label className={labelCls}>Identifier *</label>
                  <input type="text" value={formData.slug}
                    onChange={(e) => { set("slug", e.target.value.toLowerCase().replace(/\s+/g, "-")); clearError("slug"); }}
                    placeholder="e.g. insta-group"
                    className={inputCls("slug")} />
                  {errors.slug && <p className={errCls}>{errors.slug}</p>}
                </div>
              </div>

              <div>
                <label className={labelCls}>Organization Address</label>
                <input type="text" value={formData.orgAddress}
                  onChange={(e) => set("orgAddress", e.target.value)}
                  placeholder="e.g. Pune, Maharashtra, India"
                  className={inputCls()} />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <div className="h-px flex-1 bg-border" />
                <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-text-muted">
                  <User size={12} /> Admin Details
                </span>
                <div className="h-px flex-1 bg-border" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Admin Name *</label>
                  <input type="text" value={formData.adminName}
                    onChange={(e) => { set("adminName", e.target.value); clearError("adminName"); }}
                    placeholder="e.g. Sarah Chen"
                    className={inputCls("adminName")} />
                  {errors.adminName && <p className={errCls}>{errors.adminName}</p>}
                </div>
                <div>
                  <label className={labelCls}>Admin Email *</label>
                  <input type="email" value={formData.email}
                    onChange={(e) => { set("email", e.target.value); clearError("email"); }}
                    placeholder="admin@company.com"
                    className={inputCls("email")} />
                  {errors.email && <p className={errCls}>{errors.email}</p>}
                </div>
              </div>

              <div>
                <label className={labelCls}>Admin Phone Number</label>
                <input type="tel" value={formData.adminPhone}
                  onChange={(e) => set("adminPhone", e.target.value)}
                  placeholder="+91 98765 43210"
                  className={inputCls()} />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Timezone</label>
                  <select value={formData.timezone}
                    onChange={(e) => set("timezone", e.target.value)}
                    className={inputCls()}>
                    {TIMEZONES.map((tz) => <option key={tz} value={tz}>{tz}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Max Users</label>
                  <input type="number" min={1} max={10000}
                    value={formData.maxUsers}
                    onChange={(e) => set("maxUsers", Number(e.target.value))}
                    className={inputCls()} />
                  {errors.maxUsers && <p className={errCls}>{errors.maxUsers}</p>}
                </div>
              </div>

              <div>
                <label className={labelCls}>Working Days</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {DAYS.map((day) => {
                    const active = formData.workingDays.includes(day);
                    return (
                      <button key={day} type="button" onClick={() => toggleDay(day)}
                        className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
                          active
                            ? "border-primary bg-primary text-white"
                            : "border-border bg-white text-text-muted hover:border-primary hover:text-primary"
                        }`}>
                        {DAY_SHORT[day]}
                      </button>
                    );
                  })}
                </div>
                {errors.workingDays && <p className={errCls}>{errors.workingDays}</p>}
              </div>

              <div>
                <label className={labelCls}>
                  Working Hours per Day
                  <span className="ml-2 font-semibold text-primary">{formData.workingHours}h</span>
                </label>
                <input type="range" min={1} max={24}
                  value={formData.workingHours}
                  onChange={(e) => set("workingHours", Number(e.target.value))}
                  className="mt-2 h-2 w-full cursor-pointer accent-primary" />
                {errors.workingHours && <p className={errCls}>{errors.workingHours}</p>}
                <div className="mt-1 flex justify-between text-xs text-text-muted">
                  <span>1h</span><span>12h</span><span>24h</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-border px-6 py-4">
          {step === 2 ? (
            <button type="button" onClick={() => setStep(1)}
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-text-muted hover:bg-primary-light">
              ← Back
            </button>
          ) : (
            <button type="button" onClick={handleClose}
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-text-muted hover:bg-primary-light">
              Cancel
            </button>
          )}

          {step === 1 ? (
            <button type="button" onClick={() => { if (validateStep1()) setStep(2); }}
              className="rounded-lg bg-primary px-5 py-2 text-sm font-medium text-white hover:bg-primary-dark">
              Next →
            </button>
          ) : (
            <button type="button" onClick={() => { if (validateStep2()) setStep("confirm"); }}
              className="rounded-lg bg-primary px-5 py-2 text-sm font-medium text-white hover:bg-primary-dark">
              Done →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
