/**
 * FILE: components/Licenses/ModifyLicenseModal.tsx
 * Purpose: Shared UI/data logic for the Master Admin application.
 * NOTE: Keep presentation unchanged when refactoring; move repeated logic into reusable modules.
 */
import { X } from "lucide-react";
import { useState } from "react";
import type { License, BillingCycle } from "../../context/AppDataContext";

interface ModifyLicenseModalProps {
  license: License;
  onClose: () => void;
  onSave: (id: string, updates: { tier: "Evolution"; billingCycle: BillingCycle }) => void;
}

export default function ModifyLicenseModal({ license, onClose, onSave }: ModifyLicenseModalProps) {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>(license.billingCycle);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(license.id, { tier: "Evolution", billingCycle });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-text-primary">Modify License</h2>
            <p className="text-sm text-text-muted">{license.organizationName}</p>
          </div>
          <button onClick={onClose} className="rounded-md p-1 text-text-muted hover:bg-primary-light hover:text-primary-dark">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-primary">Plan</label>
            <select value="Evolution" disabled className="h-10 w-full rounded-lg border border-border bg-primary-light px-3 text-sm text-text-primary outline-none">
              <option value="Evolution">Evolution</option>
            </select>
            <p className="mt-1 text-xs text-text-muted">Evolution is currently the only available plan.</p>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-primary">Billing Cycle</label>
            <select value={billingCycle} onChange={(e) => setBillingCycle(e.target.value as BillingCycle)} className="h-10 w-full rounded-lg border border-border bg-white px-3 text-sm text-text-primary outline-none focus:border-primary">
              <option value="Monthly">Monthly</option>
              <option value="Quarterly">Quarterly</option>
              <option value="Yearly">Yearly</option>
            </select>
          </div>
          <p className="text-xs text-text-muted">
            Changing the billing cycle applies at the next renewal — it won't shorten or extend the current expiry date.
          </p>
          <div className="mt-6 flex items-center justify-end gap-3">
            <button type="button" onClick={onClose} className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-text-muted hover:bg-primary-light">Cancel</button>
            <button type="submit" className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
}