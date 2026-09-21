import { useEffect, useState } from "react";
import { X, Search, Building2, ArrowLeft } from "lucide-react";
import { getApiErrorMessage } from "../../services/apiClient";
import { listLicenses } from "../../services/licenseService";
import type { IssueLicenseInput } from "../../services/licenseService";
import { listOrganizations } from "../../services/organizationService";
import type { OrganizationRecord, OrganizationPage } from "../../services/organizationService";

interface Props {
  onClose: () => void;
  onIssue: (input: IssueLicenseInput) => Promise<void>;
}

export default function IssueLicenseModal({ onClose, onIssue }: Props) {
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [orgResult, setOrgResult] = useState<OrganizationPage | null>(null);
  const [licensedIds, setLicensedIds] = useState<Set<string> | null>(null);
  const [selected, setSelected] = useState<OrganizationRecord | null>(null);
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("INR");
  const [paymentReference, setPaymentReference] = useState("");
  const [loading, setLoading] = useState(true);
  const [lookupRevision, setLookupRevision] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => setQuery(search.trim()), 300);
    return () => window.clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const controller = new AbortController();
    listLicenses("", "", controller.signal).then((result) => {
      if (!controller.signal.aborted) setLicensedIds(new Set(result.licenses.map((lic) => lic.organizationId)));
    }).catch((error: unknown) => {
      if (!controller.signal.aborted) setError(getApiErrorMessage(error, "Could not check existing licenses."));
    });
    return () => controller.abort();
  }, [lookupRevision]);

  useEffect(() => {
    const controller = new AbortController();
    listOrganizations({ search: query, status: "", plan: "", page, perPage: 20 }, controller.signal)
      .then((result) => {
        if (controller.signal.aborted) return;
        setOrgResult(result);
        setLoading(false);
      }).catch((error: unknown) => {
        if (controller.signal.aborted) return;
        setError(getApiErrorMessage(error, "Could not load organizations."));
        setLoading(false);
      });
    return () => controller.abort();
  }, [query, page, lookupRevision]);

  const submit = async () => {
    if (!selected || busy) return;
    const parsedAmount = Number(amount);
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0 || !paymentReference.trim() || !/^[A-Za-z]{3}$/.test(currency.trim())) {
      setError("Enter an amount greater than zero, a three-letter currency, and a payment reference.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      await onIssue({ organizationId: selected.id, amount: parsedAmount, currency: currency.trim().toUpperCase(), paymentReference });
      onClose();
    } catch (error) {
      setError(getApiErrorMessage(error, "Could not issue the license."));
    } finally {
      setBusy(false);
    }
  };

  const available = orgResult?.organizations.filter((org) => !licensedIds?.has(org.id)) ?? [];
  const totalPages = Math.max(1, Math.ceil((orgResult?.total ?? 0) / 20));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-text-primary">Issue New License</h2>
            <p className="text-sm text-text-muted">{selected ? selected.name : "Choose an organization without a license."}</p>
          </div>
          <button disabled={busy} onClick={onClose} className="rounded-md p-1 text-text-muted hover:bg-primary-light"><X size={18} /></button>
        </div>

        {error && <div role="alert" className="mx-6 mt-4 rounded-lg border border-error bg-error-bg p-3 text-sm text-error">{error}{!selected && <button type="button" onClick={() => { setError(""); setLoading(true); setLicensedIds(null); setLookupRevision((value) => value + 1); }} className="ml-2 underline">Retry</button>}</div>}

        {!selected ? <div className="p-6">
          <div className="relative mb-4">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); setLoading(true); setError(""); }} placeholder="Search organizations..." className="h-10 w-full rounded-lg border border-border bg-white pl-9 pr-3 text-sm" />
          </div>
          {error ? null : loading || !licensedIds ? <p role="status" className="py-8 text-center text-sm text-text-muted">Loading organizations…</p> : <>
            <div className="max-h-72 space-y-1 overflow-y-auto">
              {available.length === 0 ? <p className="py-8 text-center text-sm text-text-muted">No unlicensed organizations on this page.</p> : available.map((org) => (
                <button key={org.id} onClick={() => { setSelected(org); setError(""); }} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left hover:bg-primary-light">
                  <Building2 size={16} className="text-primary" />
                  <span className="truncate text-sm font-medium text-text-primary">{org.name}</span>
                </button>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between text-sm text-text-muted">
              <span>Page {page} of {totalPages}</span>
              <div className="flex gap-2">
                <button disabled={page <= 1} onClick={() => { setPage(page - 1); setLoading(true); }} className="rounded border border-border px-2 py-1 disabled:opacity-50">Previous</button>
                <button disabled={page >= totalPages} onClick={() => { setPage(page + 1); setLoading(true); }} className="rounded border border-border px-2 py-1 disabled:opacity-50">Next</button>
              </div>
            </div>
          </>}
        </div> : <div className="space-y-4 p-6">
          <div className="rounded-lg border border-border bg-primary-light p-3 text-sm text-text-primary">Evolution license · Monthly billing</div>
          <label className="block text-sm font-medium text-text-primary">Amount
            <input type="number" min="0.01" step="0.01" value={amount} onChange={(event) => setAmount(event.target.value)} className="mt-1 h-10 w-full rounded-lg border border-border px-3" placeholder="1499.00" />
          </label>
          <label className="block text-sm font-medium text-text-primary">Currency
            <input value={currency} onChange={(event) => setCurrency(event.target.value)} maxLength={3} className="mt-1 h-10 w-full rounded-lg border border-border px-3 uppercase" placeholder="INR" />
          </label>
          <label className="block text-sm font-medium text-text-primary">Payment reference
            <input value={paymentReference} onChange={(event) => setPaymentReference(event.target.value)} className="mt-1 h-10 w-full rounded-lg border border-border px-3" placeholder="Payment transaction ID" />
          </label>
          <div className="flex justify-between pt-2">
            <button disabled={busy} onClick={() => { setSelected(null); setError(""); }} className="flex items-center gap-1 rounded-lg border border-border px-4 py-2 text-sm"><ArrowLeft size={14} /> Back</button>
            <button disabled={busy} onClick={submit} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white disabled:opacity-50">{busy ? "Issuing…" : "Confirm & Issue"}</button>
          </div>
        </div>}
      </div>
    </div>
  );
}
