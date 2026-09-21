/**
 * FILE: components/Licenses/RenewLicenseModal.tsx
 * Purpose: Shared UI/data logic for the Master Admin application.
 * NOTE: Keep presentation unchanged when refactoring; move repeated logic into reusable modules.
 */
import { useState } from "react";
import { X, ArrowLeft, RefreshCw } from "lucide-react";
import type { LicenseRecord } from "../../services/licenseService";
import { getApiErrorMessage } from "../../services/apiClient";

interface RenewLicenseModalProps {
  license: LicenseRecord;
  onClose: () => void;
  onRenew: (id: string) => Promise<void>;
}

type Step = "configure" | "confirm";

export default function RenewLicenseModal({ license, onClose, onRenew }: RenewLicenseModalProps) {
  const [step, setStep] = useState<Step>("configure");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const now = new Date();
  const currentExpiry = new Date(license.expiresAt);
  const isLapsed = license.cancelled || currentExpiry.getTime() < now.getTime();
  const handleConfirm = async () => {
    setBusy(true);
    setError("");
    try {
      await onRenew(license.id);
      onClose();
    } catch (error) {
      setError(getApiErrorMessage(error, "Could not renew the license."));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-text-primary">Renew License</h2>
            <p className="text-sm text-text-muted">{license.organizationName}</p>
          </div>
          <button disabled={busy} onClick={onClose} className="rounded-md p-1 text-text-muted hover:bg-primary-light hover:text-primary-dark">
            <X size={18} />
          </button>
        </div>

        {step === "configure" && (
          <div className="p-6">
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-text-primary">Plan</label>
                <div className="flex h-10 items-center rounded-lg border border-border bg-primary-light px-3 text-sm text-text-primary">
                  {license.tier}
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-text-primary">Billing Cycle</label>
                <div className="flex h-10 items-center rounded-lg border border-border bg-primary-light px-3 text-sm text-text-primary">
                  Monthly
                </div>
                <p className="mt-1 text-xs text-text-muted">Licenses are renewed on a monthly basis.</p>
              </div>
              {isLapsed && (
                <p className="text-xs text-warning">
                  This license had {license.cancelled ? "been cancelled" : "expired"} — renewing will reactivate it starting today.
                </p>
              )}
            </div>
            <div className="mt-6 flex items-center justify-end">
              <button
                onClick={() => setStep("confirm")}
                className="rounded-lg bg-primary px-5 py-2 text-sm font-medium text-white hover:bg-primary-dark"
              >
                Next →
              </button>
            </div>
          </div>
        )}

        {step === "confirm" && (
          <div className="p-6">
            <div className="flex items-start gap-3 rounded-xl border border-border bg-primary-light/40 p-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                <RefreshCw size={16} strokeWidth={1.8} />
              </div>
              <div className="text-sm text-text-primary">
                Renew <strong>{license.organizationName}</strong>'s license, billed <strong>monthly</strong>.
              </div>
            </div>

            <div className="mt-4 divide-y divide-border overflow-hidden rounded-xl border border-border">
              <Row label="Plan"           value={license.tier} />
              <Row label="Billing Cycle"  value="Monthly" />
              <Row label="Current Expiry Date" value={Number.isNaN(currentExpiry.getTime()) ? "—" : currentExpiry.toLocaleDateString()} />
            </div>
            <p className="mt-3 text-xs text-text-muted">The server will calculate and return the new expiry date.</p>
            {error && <p role="alert" className="mt-3 text-sm text-error">{error}</p>}

            <div className="mt-6 flex items-center justify-between">
              <button
                disabled={busy}
                onClick={() => setStep("configure")}
                className="flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm font-medium text-text-muted hover:bg-primary-light"
              >
                <ArrowLeft size={14} /> Back
              </button>
              <button
                disabled={busy}
                onClick={handleConfirm}
                className="rounded-lg bg-primary px-5 py-2 text-sm font-medium text-white hover:bg-primary-dark"
              >
                {busy ? "Renewing…" : "Confirm & Renew"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between px-4 py-2.5">
      <span className="text-sm text-text-muted">{label}</span>
      <span className="text-sm font-medium text-text-primary">{value}</span>
    </div>
  );
}
