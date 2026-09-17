/**
 * FILE: components/Licenses/LicensesTable.tsx
 * Purpose: Shared UI/data logic for the Master Admin application.
 * NOTE: Keep presentation unchanged when refactoring; move repeated logic into reusable modules.
 */
import { RefreshCw, Ban, CheckCircle2, Building2 } from "lucide-react";
import type { License } from "../../context/AppDataContext";
import { statusBadgeClass } from "../../lib/statusStyles";
import { getLicenseEffectiveStatus, formatDaysRemaining } from "../../lib/licenseStatus";

interface LicensesTableProps {
  licenses: License[];
  onRenew: (license: License) => void;
  onToggleCancel: (license: License) => void;
}

export default function LicensesTable({ licenses, onRenew, onToggleCancel }: LicensesTableProps) {
  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  return (
    <div className="surface-card-static overflow-hidden">
      <table className="w-full text-left">
        <thead>
          <tr className="table-head-row">
            <th className="table-head-cell rounded-tl-xl">Organization</th>
            <th className="table-head-cell">Plan</th>
            <th className="table-head-cell">Started</th>
            <th className="table-head-cell">Expires</th>
            <th className="table-head-cell">Status</th>
            <th className="table-head-cell rounded-tr-xl text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {licenses.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-5 py-10 text-center text-base text-text-muted">
                No licenses found.
              </td>
            </tr>
          ) : (
            licenses.map((lic) => {
              const effectiveStatus = getLicenseEffectiveStatus(lic.tier, lic.expiresAt, lic.cancelled);
              return (
                <tr key={lic.id} className="table-row">
                  <td className="table-cell-primary">
                    <div className="flex items-center gap-2">
                      <Building2 size={14} className="text-text-muted" />
                      {lic.organizationName}
                    </div>
                  </td>
                  <td className="table-cell">{lic.tier}</td>
                  <td className="table-cell">{formatDate(lic.startedAt)}</td>
                  <td className="table-cell">
                    <p>{formatDate(lic.expiresAt)}</p>
                    <p className="text-xs text-text-muted">
                      {formatDaysRemaining(lic.tier, lic.expiresAt, lic.cancelled)}
                    </p>
                  </td>
                  <td className="table-cell">
                    <span className={statusBadgeClass(effectiveStatus)}>{effectiveStatus}</span>
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        title="Renew"
                        onClick={() => onRenew(lic)}
                        className="rounded-md p-1.5 text-text-muted hover:bg-primary-light hover:text-primary-dark"
                      >
                        <RefreshCw size={16} />
                      </button>
                      <button
                        title={lic.cancelled ? "Reactivate" : "Cancel License"}
                        onClick={() => onToggleCancel(lic)}
                        className={`rounded-md p-1.5 hover:bg-primary-light ${lic.cancelled ? "text-success" : "text-error"}`}
                      >
                        {lic.cancelled ? <CheckCircle2 size={16} /> : <Ban size={16} />}
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
  );
}