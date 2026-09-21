import { useEffect, useRef, useState } from "react";
import OrganizationFilters from "../components/Organizations/OrganizationFilters";
import OrganizationsTable from "../components/Organizations/OrganizationsTable";
import AddOrganizationModal from "../components/Organizations/AddOrganizationModal";
import type { NewOrgFormData } from "../components/Organizations/AddOrganizationModal";
import { getApiErrorMessage } from "../services/apiClient";
import {
  createOrganization, deleteOrganization, listOrganizations, setOrganizationSuspended,
} from "../services/organizationService";
import type { OrganizationRecord, OrganizationPage } from "../services/organizationService";

const PAGE_SIZE = 20;

export default function Organizations() {
  const [result, setResult] = useState<OrganizationPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [planFilter, setPlanFilter] = useState("");
  const [page, setPage] = useState(1);
  const [reload, setReload] = useState(0);
  const requestVersion = useRef(0);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => window.clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const controller = new AbortController();
    const version = ++requestVersion.current;
    listOrganizations({
      search: debouncedSearch, status: statusFilter, plan: planFilter,
      page, perPage: PAGE_SIZE,
    }, controller.signal).then((data) => {
      if (controller.signal.aborted || version !== requestVersion.current) return;
      setResult(data);
      setError("");
      setLoading(false);
    }).catch((error: unknown) => {
      if (controller.signal.aborted || version !== requestVersion.current) return;
      setResult(null);
      setError(getApiErrorMessage(error, "Could not load organizations."));
      setLoading(false);
    });
    return () => controller.abort();
  }, [debouncedSearch, statusFilter, planFilter, page, reload]);

  const changeFilter = (setter: (value: string) => void) => (value: string) => {
    requestVersion.current += 1;
    setLoading(true);
    setPage(1);
    setter(value);
  };

  const handleCreate = async (data: NewOrgFormData) => {
    await createOrganization(data);
    requestVersion.current += 1;
    setNotice("Organization created successfully.");
    setLoading(true);
    setPage(1);
    setReload((value) => value + 1);
  };

  const handleToggleSuspend = async (org: OrganizationRecord) => {
    await setOrganizationSuspended(org.id, org.status !== "Suspended");
    requestVersion.current += 1;
    setNotice(org.status === "Suspended" ? "Organization activated." : "Organization suspended.");
    setLoading(true);
    setReload((value) => value + 1);
  };

  const handleDelete = async (org: OrganizationRecord) => {
    await deleteOrganization(org.id);
    requestVersion.current += 1;
    setNotice("Organization deleted.");
    setLoading(true);
    if (result?.organizations.length === 1 && page > 1) setPage(page - 1);
    else setReload((value) => value + 1);
  };

  const totalPages = Math.max(1, Math.ceil((result?.total ?? 0) / PAGE_SIZE));

  return (
    <div>
      <h1 className="page-title">Organizations</h1>
      <p className="section-subtitle">Manage all client organizations on the platform.</p>

      <div className="mt-6">
        <OrganizationFilters
          onAddClick={() => { setNotice(""); setAddModalOpen(true); }}
          search={search}
          onSearchChange={changeFilter(setSearch)}
          status={statusFilter}
          onStatusChange={changeFilter(setStatusFilter)}
          plan={planFilter}
          onPlanChange={changeFilter(setPlanFilter)}
        />
        {notice && <p role="status" className="mb-4 rounded-lg border border-primary bg-primary-light px-4 py-2 text-sm text-primary-dark">{notice}</p>}
        {error && <div role="alert" className="mb-4 rounded-lg border border-error bg-error-bg px-4 py-2 text-sm text-error">{error} <button type="button" onClick={() => { setLoading(true); setReload((value) => value + 1); }} className="ml-2 underline">Retry</button></div>}
        {loading ? <div className="surface-card-static p-10 text-center text-text-muted" role="status">Loading organizations…</div> : !error && <>
          <OrganizationsTable
            organizations={result?.organizations ?? []}
            onToggleSuspend={handleToggleSuspend}
            onDelete={handleDelete}
          />
          <div className="mt-4 flex items-center justify-between text-sm text-text-muted">
            <span>{result?.total ?? 0} organizations · Page {page} of {totalPages}</span>
            <div className="flex gap-2">
              <button type="button" disabled={page <= 1} onClick={() => { setLoading(true); setPage(page - 1); }} className="rounded-lg border border-border px-3 py-1.5 disabled:opacity-50">Previous</button>
              <button type="button" disabled={page >= totalPages} onClick={() => { setLoading(true); setPage(page + 1); }} className="rounded-lg border border-border px-3 py-1.5 disabled:opacity-50">Next</button>
            </div>
          </div>
        </>}
      </div>

      <AddOrganizationModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSubmit={handleCreate}
      />
    </div>
  );
}
