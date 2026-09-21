import { useEffect, useRef, useState } from "react";
import { ShieldCheck, ShieldOff, Clock } from "lucide-react";
import StatCard from "../components/Dashboard/StatCard";
import LicensesFilters from "../components/Licenses/LicensesFilters";
import LicensesTable from "../components/Licenses/LicensesTable";
import IssueLicenseModal from "../components/Licenses/IssueLicenseModal";
import RenewLicenseModal from "../components/Licenses/RenewLicenseModal";
import { getApiErrorMessage } from "../services/apiClient";
import { issueLicense, listLicenses, renewLicense, setLicenseCancelled } from "../services/licenseService";
import type { IssueLicenseInput, LicenseList, LicenseRecord } from "../services/licenseService";

export default function Licenses() {
  const [result, setResult] = useState<LicenseList | null>(null);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [reload, setReload] = useState(0);
  const [issueModalOpen, setIssueModalOpen] = useState(false);
  const [renewTarget, setRenewTarget] = useState<LicenseRecord | null>(null);
  const [cancelTarget, setCancelTarget] = useState<LicenseRecord | null>(null);
  const [actionBusy, setActionBusy] = useState(false);
  const [actionError, setActionError] = useState("");
  const requestVersion = useRef(0);

  useEffect(() => {
    const timer = window.setTimeout(() => setQuery(search.trim()), 300);
    return () => window.clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const controller = new AbortController();
    const version = ++requestVersion.current;
    listLicenses(query, statusFilter, controller.signal).then((data) => {
      if (controller.signal.aborted || version !== requestVersion.current) return;
      setResult(data);
      setError("");
      setLoading(false);
    }).catch((error: unknown) => {
      if (controller.signal.aborted || version !== requestVersion.current) return;
      setResult(null);
      setError(getApiErrorMessage(error, "Could not load licenses."));
      setLoading(false);
    });
    return () => controller.abort();
  }, [query, statusFilter, reload]);

  const refresh = () => {
    requestVersion.current += 1;
    setLoading(true);
    setReload((value) => value + 1);
  };

  const handleIssue = async (input: IssueLicenseInput) => {
    await issueLicense(input);
    setNotice("License issued successfully.");
    refresh();
  };

  const handleRenew = async (id: string) => {
    await renewLicense(id);
    setNotice("License renewed successfully.");
    refresh();
    setRenewTarget(null);
  };

  const handleCancelToggle = async () => {
    if (!cancelTarget || actionBusy) return;
    setActionBusy(true);
    setActionError("");
    try {
      await setLicenseCancelled(cancelTarget.id, !cancelTarget.cancelled);
      setNotice(cancelTarget.cancelled ? "License reactivated." : "License cancelled.");
      setCancelTarget(null);
      refresh();
    } catch (error) {
      setActionError(getApiErrorMessage(error, "Could not update the license."));
    } finally {
      setActionBusy(false);
    }
  };

  return (
    <div>
      <h1 className="page-title">License Management</h1>
      <p className="section-subtitle">View and manage every organization's license — plan, renewal, and status.</p>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard title="Active" value={result?.stats.active ?? "—"} icon={ShieldCheck} />
        <StatCard title="Trial" value={result?.stats.trial ?? "—"} icon={Clock} iconColor="#F59E0B" iconBackground="#FEF3C7" />
        <StatCard title="Expired" value={result?.stats.expired ?? "—"} icon={ShieldOff} iconColor="#DC2626" iconBackground="#FEE2E2" />
      </div>

      <div className="mt-6">
        <LicensesFilters
          search={search}
          onSearchChange={(value) => { requestVersion.current += 1; setSearch(value); setLoading(true); }}
          status={statusFilter}
          onStatusChange={(value) => { requestVersion.current += 1; setStatusFilter(value); setLoading(true); }}
          onIssueClick={() => { setNotice(""); setIssueModalOpen(true); }}
        />
        {notice && <p role="status" className="mb-4 rounded-lg border border-primary bg-primary-light px-4 py-2 text-sm text-primary-dark">{notice}</p>}
        {error && <div role="alert" className="mb-4 rounded-lg border border-error bg-error-bg px-4 py-2 text-sm text-error">{error} <button onClick={refresh} className="ml-2 underline">Retry</button></div>}
        {loading ? <div className="surface-card-static p-10 text-center text-text-muted" role="status">Loading licenses…</div> : !error && <LicensesTable
          licenses={result?.licenses ?? []}
          onRenew={setRenewTarget}
          onToggleCancel={(license) => { setActionError(""); setCancelTarget(license); }}
        />}
      </div>

      {issueModalOpen && <IssueLicenseModal onClose={() => setIssueModalOpen(false)} onIssue={handleIssue} />}
      {renewTarget && <RenewLicenseModal key={renewTarget.id} license={renewTarget} onClose={() => setRenewTarget(null)} onRenew={handleRenew} />}

      {cancelTarget && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
        <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
          <h2 className="text-lg font-semibold text-text-primary">{cancelTarget.cancelled ? "Reactivate License" : "Cancel License"}</h2>
          <p className="mt-2 text-sm text-text-muted">{cancelTarget.cancelled
            ? `Reactivate ${cancelTarget.organizationName}'s license?`
            : `${cancelTarget.organizationName} will lose access once cancelled. You can reactivate later.`}</p>
          {actionError && <p role="alert" className="mt-3 text-sm text-error">{actionError}</p>}
          <div className="mt-6 flex justify-end gap-3">
            <button disabled={actionBusy} onClick={() => setCancelTarget(null)} className="rounded-lg border border-border px-4 py-2 text-sm">Back</button>
            <button disabled={actionBusy} onClick={handleCancelToggle} className={`rounded-lg px-4 py-2 text-sm font-medium text-white disabled:opacity-50 ${cancelTarget.cancelled ? "bg-primary" : "bg-error"}`}>
              {actionBusy ? "Working…" : cancelTarget.cancelled ? "Reactivate" : "Cancel License"}
            </button>
          </div>
        </div>
      </div>}
    </div>
  );
}
