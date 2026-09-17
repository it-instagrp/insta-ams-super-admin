/**
 * FILE: components/Organizations/EditOrganizationModal.tsx
 * Purpose: Shared UI/data logic for the Master Admin application.
 * NOTE: Keep presentation unchanged when refactoring; move repeated logic into reusable modules.
 */
import { X } from "lucide-react";
import { useState } from "react";
import type { Organization } from "../../context/AppDataContext";

interface EditOrganizationModalProps {
  organization: Organization | null;
  onClose: () => void;
  onSave: (id: string, updates: Pick<Organization, "name" | "plan">) => void;
}

export default function EditOrganizationModal({
  organization,
  onClose,
  onSave,
}: EditOrganizationModalProps) {
  const [name, setName] = useState(organization?.name ?? "");
  const [plan, setPlan] = useState<Organization["plan"]>(organization?.plan ?? "Monthly");

  if (!organization) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(organization.id, { name, plan });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-text-primary">Edit Organization</h2>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-text-muted hover:bg-primary-light hover:text-primary-dark"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-base font-medium text-text-primary">
              Organization Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-10 w-full rounded-lg border border-border bg-white px-3 text-base text-text-primary outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-base font-medium text-text-primary">
              Plan
            </label>
            <select
              value={plan}
              onChange={(e) => setPlan(e.target.value as Organization["plan"])}
              className="h-10 w-full rounded-lg border border-border bg-white px-3 text-base text-text-primary outline-none focus:border-primary"
            >
              <option value="Starter">Starter</option>
              <option value="Professional">Professional</option>
              <option value="Enterprise">Enterprise</option>
            </select>
          </div>

          <div className="mt-6 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-border px-4 py-2 text-base font-medium text-text-muted hover:bg-primary-light"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-primary px-4 py-2 text-base font-medium text-white hover:bg-primary-dark"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}