/**
 * FILE: components/Licenses/LicenseRequestsList.tsx
 * Purpose: Shared UI/data logic for the Master Admin application.
 * NOTE: Keep presentation unchanged when refactoring; move repeated logic into reusable modules.
 */
import { Check, X as XIcon, Building2 } from "lucide-react";
import type { LicenseRequest, LicenseRequestStatus } from "../../context/AppDataContext";
import { statusBadgeClass } from "../../lib/statusStyles";

interface LicenseRequestsListProps {
  requests: LicenseRequest[];
  status: LicenseRequestStatus;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

const emptyStateCopy: Record<LicenseRequestStatus, string> = {
  Pending: "No pending license requests.",
  Approved: "No approved license requests yet.",
  Rejected: "No rejected license requests.",
};

export default function LicenseRequestsList({ requests, status, onApprove, onReject }: LicenseRequestsListProps) {
  if (requests.length === 0) {
    return <div className="empty-state">{emptyStateCopy[status]}</div>;
  }

  return (
    <div className="space-y-3">
      {requests.map((request) => (
        <div key={request.id} className="surface-card-static flex items-center gap-4 p-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary-light text-primary">
            <Building2 size={19} strokeWidth={1.8} />
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-base font-medium text-text-primary">{request.organizationName}</p>
            <p className="truncate text-sm text-text-muted">
              {request.plan} Plan · Requested {request.requestDate}
            </p>
          </div>

          {request.status === "Pending" && (
            <div className="flex shrink-0 items-center gap-2">
              <button onClick={() => onApprove(request.id)} className="btn btn-primary">
                <Check size={14} /> Approve
              </button>
              <button onClick={() => onReject(request.id)} className="btn btn-destructive">
                <XIcon size={14} /> Reject
              </button>
            </div>
          )}

          {request.status === "Approved" && (
            <div className="shrink-0 text-right">
              <span className={statusBadgeClass("Approved")}>Approved {request.decisionDate}</span>
              {request.expiryDate && (
                <p className="mt-1 text-xs text-text-muted">Expires {request.expiryDate}</p>
              )}
            </div>
          )}

          {request.status === "Rejected" && (
            <span className={statusBadgeClass("Rejected")}>Rejected {request.decisionDate}</span>
          )}
        </div>
      ))}
    </div>
  );
}