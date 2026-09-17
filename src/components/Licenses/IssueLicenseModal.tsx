/**
 * FILE: components/Licenses/IssueLicenseModal.tsx
 * Purpose: Shared UI/data logic for the Master Admin application.
 * NOTE: Keep presentation unchanged when refactoring; move repeated logic into reusable modules.
 */
import { useState } from "react";
import { X, Search, Building2, ArrowLeft, ShieldCheck } from "lucide-react";
import type { Organization } from "../../context/AppDataContext";
import { addBillingCycle, formatDisplayDate } from "../../lib/billingCycle";

type LicensePlan = "Trial" | "Evolution";

interface IssueLicenseModalProps {
  unlicensedOrganizations: Organization[];
  onClose: () => void;
  onIssue: (organizationId: string, billingCycle: "Monthly") => void;
}

type Step = "select" | "configure" | "confirm";

export default function IssueLicenseModal({ unlicensedOrganizations, onClose, onIssue }: IssueLicenseModalProps) {
  const [step, setStep] = useState<Step>("select");
  const [search, setSearch] = useState("");
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [plan, setPlan] = useState<LicensePlan>("Evolution");

  const filteredOrgs = unlicensedOrganizations.filter((org) =>
    org.name.toLowerCase().includes(search.trim().toLowerCase())
  );

  // Always Monthly billing cycle
  const previewExpiry = selectedOrg
    ? formatDisplayDate(addBillingCycle(new Date(), "Monthly"))
    : "";

  const handleSelectOrg = (org: Organization) => {
    setSelectedOrg(org);
    setStep("configure");
  };

  const handleConfirm = () => {
    if (!selectedOrg) return;
    onIssue(selectedOrg.id, "Monthly");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-text-primary">Issue New License</h2>
            <p className="text-sm text-text-muted">
              {step === "select" && "Choose an organization without an active license."}
              {step === "configure" && selectedOrg?.name}
              {step === "confirm" && "Review before issuing."}
            </p>
          </div>
          <button onClick={onClose} className="rounded-md p-1 text-text-muted hover:bg-primary-light hover:text-primary-dark">
            <X size={18} />
          </button>
        </div>

        {/* STEP 1 — select org */}
        {step === "select" && (
          <div className="p-6">
            <div className="relative mb-4">
              <Search size={16} strokeWidth={1.8} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                autoFocus
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search organizations..."
                className="h-10 w-full rounded-lg border border-border bg-white pl-9 pr-4 text-sm text-text-primary outline-none placeholder:text-text-muted focus:border-primary"
              />
            </div>
            <div className="max-h-72 space-y-1 overflow-y-auto">
              {filteredOrgs.length === 0 ? (
                <p className="py-8 text-center text-sm text-text-muted">
                  {unlicensedOrganizations.length === 0
                    ? "Every organization already has a license."
                    : "No matching organizations."}
                </p>
              ) : (
                filteredOrgs.map((org) => (
                  <button
                    key={org.id}
                    onClick={() => handleSelectOrg(org)}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left hover:bg-primary-light"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-light text-primary">
                      <Building2 size={16} strokeWidth={1.8} />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-text-primary">{org.name}</p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        )}

        {/* STEP 2 — configure plan */}
        {step === "configure" && selectedOrg && (
          <div className="p-6">
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-text-primary">Plan</label>
                <div className="flex gap-3">
                  {(["Trial", "Evolution"] as LicensePlan[]).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPlan(p)}
                      className={`flex-1 rounded-lg border py-2.5 text-sm font-medium transition-colors ${
                        plan === p
                          ? "border-primary bg-primary text-white"
                          : "border-border bg-white text-text-muted hover:border-primary hover:text-primary"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-text-primary">Billing Cycle</label>
                <div className="h-10 w-full rounded-lg border border-border bg-primary-light px-3 text-sm text-text-primary flex items-center">
                  Monthly
                </div>
                <p className="mt-1 text-xs text-text-muted">Licenses are currently issued on a monthly basis.</p>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-between">
              <button onClick={() => setStep("select")}
                className="flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm font-medium text-text-muted hover:bg-primary-light">
                <ArrowLeft size={14} /> Back
              </button>
              <button onClick={() => setStep("confirm")}
                className="rounded-lg bg-primary px-5 py-2 text-sm font-medium text-white hover:bg-primary-dark">
                Next →
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 — confirm */}
        {step === "confirm" && selectedOrg && (
          <div className="p-6">
            <div className="flex items-start gap-3 rounded-xl border border-border bg-primary-light/40 p-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                <ShieldCheck size={16} strokeWidth={1.8} />
              </div>
              <div className="text-sm text-text-primary">
                You're about to issue a <strong>{plan}</strong> license for <strong>{selectedOrg.name}</strong>, billed <strong>monthly</strong>.
              </div>
            </div>

            <div className="mt-4 divide-y divide-border overflow-hidden rounded-xl border border-border">
              <Row label="Organization" value={selectedOrg.name} />
              <Row label="Plan" value={plan} />
              <Row label="Billing Cycle" value="Monthly" />
              <Row label="Starts" value={formatDisplayDate(new Date())} />
              <Row label="Expires" value={previewExpiry} />
            </div>

            <div className="mt-6 flex items-center justify-between">
              <button onClick={() => setStep("configure")}
                className="flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm font-medium text-text-muted hover:bg-primary-light">
                <ArrowLeft size={14} /> Back
              </button>
              <button onClick={handleConfirm}
                className="rounded-lg bg-primary px-5 py-2 text-sm font-medium text-white hover:bg-primary-dark">
                Confirm & Issue
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