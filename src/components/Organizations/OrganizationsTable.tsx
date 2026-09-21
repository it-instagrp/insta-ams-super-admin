/**
 * FILE: components/Organizations/OrganizationsTable.tsx
 * Purpose: Shared UI/data logic for the Master Admin application.
 * NOTE: Keep presentation unchanged when refactoring; move repeated logic into reusable modules.
 */
import { Eye, Ban, Trash2, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import type { OrganizationRecord } from "../../services/organizationService";
import { getApiErrorMessage } from "../../services/apiClient";

type ActionType = "suspend" | "delete";

interface ConfirmState {
  orgId: string;
  orgName: string;
  action: ActionType;
  currentStatus: string;
}

interface OrganizationsTableProps {
  organizations: OrganizationRecord[];
  onToggleSuspend: (org: OrganizationRecord) => Promise<void>;
  onDelete: (org: OrganizationRecord) => Promise<void>;
}

export default function OrganizationsTable({
  organizations,
  onToggleSuspend,
  onDelete,
}: OrganizationsTableProps) {
  const [confirm, setConfirm] = useState<ConfirmState | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const openConfirm = (org: OrganizationRecord, action: ActionType) => {
    setError("");
    setConfirm({ orgId: org.id, orgName: org.name, action, currentStatus: org.status });
  };

  const handleConfirm = async () => {
    if (!confirm) return;
    const org = organizations.find((o) => o.id === confirm.orgId);
    if (!org) return;
    setBusy(true);
    setError("");
    try {
      if (confirm.action === "suspend") await onToggleSuspend(org);
      if (confirm.action === "delete") await onDelete(org);
      setConfirm(null);
    } catch (error) {
      setError(getApiErrorMessage(error, "Could not update the organization."));
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <div className="surface-card-static overflow-hidden">
        <table className="w-full table-fixed text-left">
          <thead>
            <tr className="table-head-row">
              <th className="table-head-cell w-[25%] rounded-tl-xl">Organization</th>
              <th className="table-head-cell w-[18%]">Admin</th>
              <th className="table-head-cell w-[30%]">Admin Email</th>
              <th className="table-head-cell w-[12%]">Status</th>
              <th className="table-head-cell w-[15%] rounded-tr-xl text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {organizations.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-base text-text-muted">
                  No organizations found.
                </td>
              </tr>
            ) : (
              organizations.map((org) => {
                const suspended = org.status === "Suspended";
                return (
                  <tr key={org.id} className="table-row">
                    <td className="table-cell-primary w-[25%]">{org.name}</td>
                    <td className="table-cell w-[18%]">{org.adminName || "—"}</td>
                    <td className="table-cell w-[30%]">
                      {org.email ? (
                        <a href={`mailto:${org.email}`} className="text-primary hover:underline">
                          {org.email}
                        </a>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="table-cell w-[12%]">{org.status || "—"}</td>
                    <td className="table-cell w-[15%]">
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          to={`/organizations/${org.id}`}
                          title="View"
                          className="rounded-md p-1.5 text-text-muted hover:bg-primary-light hover:text-primary-dark"
                        >
                          <Eye size={16} />
                        </Link>

                        <button
                          title={suspended ? "Activate" : "Suspend"}
                          onClick={() => openConfirm(org, "suspend")}
                          className={`rounded-md p-1.5 hover:bg-primary-light ${
                            suspended ? "text-success" : "text-warning"
                          }`}
                        >
                          {suspended ? <CheckCircle2 size={16} /> : <Ban size={16} />}
                        </button>

                        <button
                          title="Delete"
                          onClick={() => openConfirm(org, "delete")}
                          className="rounded-md p-1.5 text-error hover:bg-error-bg"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {confirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-text-primary">
              {confirm.action === "delete"
                ? "Delete Organization"
                : confirm.currentStatus === "Suspended"
                ? "Activate Organization"
                : "Suspend Organization"}
            </h2>
            <p className="mt-2 text-sm text-text-muted">
              {confirm.action === "delete"
                ? `This will permanently delete ${confirm.orgName} and all associated data. This action cannot be undone.`
                : confirm.currentStatus === "Suspended"
                ? `Restore platform access for ${confirm.orgName}?`
                : `${confirm.orgName} and all its users will immediately lose access. You can reactivate later.`}
            </p>
            {error && <p role="alert" className="mt-3 text-sm text-error">{error}</p>}
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                disabled={busy}
                onClick={() => setConfirm(null)}
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-text-muted hover:bg-primary-light"
              >
                Cancel
              </button>
              <button
                disabled={busy}
                onClick={handleConfirm}
                className={`rounded-lg px-4 py-2 text-sm font-medium text-white ${
                  confirm.action === "delete" || confirm.currentStatus !== "Suspended"
                    ? "bg-error hover:opacity-90"
                    : "bg-primary hover:bg-primary-dark"
                }`}
              >
                {busy ? "Working…" : confirm.action === "delete"
                  ? "Delete"
                  : confirm.currentStatus === "Suspended"
                  ? "Activate"
                  : "Suspend"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
