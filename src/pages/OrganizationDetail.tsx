import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Building2 } from "lucide-react";
import { getOrganization } from "../services/organizationService";
import type { OrganizationRecord } from "../services/organizationService";
import { getApiErrorMessage } from "../services/apiClient";
import { statusBadgeClass } from "../lib/statusStyles";
import { DAY_SHORT } from "../data/appDefaults";

export default function OrganizationDetail() {
  const { id } = useParams();
  const [org, setOrg] = useState<OrganizationRecord | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    if (!id) return;
    const controller = new AbortController();
    getOrganization(id, controller.signal).then((data) => {
      if (controller.signal.aborted) return;
      setOrg(data);
      setError("");
      setLoading(false);
    }).catch((error: unknown) => {
      if (controller.signal.aborted) return;
      setError(getApiErrorMessage(error, "Could not load organization details."));
      setLoading(false);
    });
    return () => controller.abort();
  }, [id, reload]);

  const rows: [string, string][] = org ? [
    ["Admin Name", org.adminName || "—"],
    ["Admin Email", org.email || "—"],
    ["Admin Phone", org.adminPhone || "—"],
    ["Slug", org.slug || "—"],
    ["Logo URL", org.logoUrl || "—"],
    ["Organization Address", org.orgAddress || "—"],
    ["Timezone", org.timezone || "—"],
    ["Max Users", org.maxUsers ? String(org.maxUsers) : "—"],
    ["Working Days", org.workingDays.map((day) => DAY_SHORT[day] ?? day).join(", ") || "—"],
    ["Working Hours", org.workingHours ? `${org.workingHours}h / day` : "—"],
    ["Renewal Date", org.renewalDate || "—"],
  ] : [];

  return (
    <div>
      <Link to="/organizations" className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-text-muted hover:text-primary-dark">
        <ArrowLeft size={15} /> Back to Organizations
      </Link>

      {loading ? <div className="empty-state" role="status">Loading organization…</div> : error ? (
        <div className="empty-state" role="alert">{error} <button type="button" onClick={() => { setLoading(true); setReload((value) => value + 1); }} className="ml-2 text-primary underline">Retry</button></div>
      ) : org ? <>
        <div className="mb-6 flex items-start justify-between rounded-2xl border border-border bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary text-white"><Building2 size={26} strokeWidth={1.8} /></div>
            <div>
              <h1 className="text-2xl font-bold text-text-primary">{org.name}</h1>
              <p className="mt-1 text-sm text-text-muted">{org.plan || "No plan"} · Org ID: {org.id}</p>
            </div>
          </div>
          <span className={statusBadgeClass(org.status)}>{org.status}</span>
        </div>
        <div className="surface-card-static p-6">
          <h2 className="mb-4 text-lg font-semibold text-text-primary">Organization Details</h2>
          <div className="divide-y divide-border overflow-hidden rounded-xl border border-border">
            {rows.map(([label, value]) => (
              <div key={label} className="flex items-start gap-4 px-4 py-3">
                <span className="w-48 shrink-0 text-sm text-text-muted">{label}</span>
                <span className="flex-1 break-all text-sm font-medium text-text-primary">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </> : <div className="empty-state">Organization not found.</div>}
    </div>
  );
}
