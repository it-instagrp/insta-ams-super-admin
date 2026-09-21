import { useEffect, useRef, useState } from "react";
import AuditLogsFilters from "../components/AuditLogs/AuditLogsFilters";
import AuditLogsTable from "../components/AuditLogs/AuditLogsTable";
import { getApiErrorMessage } from "../services/apiClient";
import { listAuditLogs } from "../services/auditLogService";
import type { AuditLogPage } from "../services/auditLogService";

const PAGE_SIZE = 20;

export default function AuditLogs() {
  const [result, setResult] = useState<AuditLogPage | null>(null);
  const [search, setSearch] = useState("");
  const [actor, setActor] = useState("");
  const [debounced, setDebounced] = useState({ search: "", actor: "" });
  const [category, setCategory] = useState("");
  const [dateRange, setDateRange] = useState("30d");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reload, setReload] = useState(0);
  const requestVersion = useRef(0);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced({ search: search.trim(), actor: actor.trim() }), 300);
    return () => window.clearTimeout(timer);
  }, [search, actor]);

  useEffect(() => {
    const controller = new AbortController();
    const version = ++requestVersion.current;
    listAuditLogs({
      search: debounced.search,
      actor: debounced.actor,
      category,
      dateRange,
      page,
      perPage: PAGE_SIZE,
    }, controller.signal).then((data) => {
      if (controller.signal.aborted || version !== requestVersion.current) return;
      setResult(data);
      setError("");
      setLoading(false);
    }).catch((error: unknown) => {
      if (controller.signal.aborted || version !== requestVersion.current) return;
      setResult(null);
      setError(getApiErrorMessage(error, "Could not load audit logs."));
      setLoading(false);
    });
    return () => controller.abort();
  }, [debounced, category, dateRange, page, reload]);

  const changeFilter = (apply: () => void) => {
    requestVersion.current += 1;
    setLoading(true);
    setPage(1);
    apply();
  };
  const refresh = () => {
    requestVersion.current += 1;
    setLoading(true);
    setReload((value) => value + 1);
  };
  const totalPages = Math.max(1, Math.ceil((result?.total ?? 0) / PAGE_SIZE));

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="page-title">Audit Logs</h1>
          <p className="section-subtitle">Track all administrative actions across the platform.</p>
        </div>
        <button type="button" onClick={refresh} className="rounded-lg border border-border bg-white px-3 py-2 text-sm text-text-muted hover:bg-primary-light">Refresh</button>
      </div>

      <div className="mt-6">
        <AuditLogsFilters
          search={search}
          onSearchChange={(value) => changeFilter(() => setSearch(value))}
          category={category}
          onCategoryChange={(value) => changeFilter(() => setCategory(value))}
          actor={actor}
          onActorChange={(value) => changeFilter(() => setActor(value))}
          dateRange={dateRange}
          onDateRangeChange={(value) => changeFilter(() => setDateRange(value))}
        />
        {error && <p role="alert" className="mb-4 rounded-lg border border-error bg-error-bg px-4 py-2 text-sm text-error">{error} <button type="button" onClick={refresh} className="ml-2 underline">Retry</button></p>}
        {loading ? <div className="empty-state" role="status">Loading audit logs…</div> : !error && <>
          <AuditLogsTable logs={result?.logs ?? []} />
          <div className="mt-4 flex items-center justify-between text-sm text-text-muted">
            <span>{result?.total ?? 0} entries · Page {page} of {totalPages}</span>
            <div className="flex gap-2">
              <button type="button" disabled={page <= 1} onClick={() => { setLoading(true); setPage(page - 1); }} className="rounded-lg border border-border px-3 py-1.5 disabled:opacity-50">Previous</button>
              <button type="button" disabled={page >= totalPages} onClick={() => { setLoading(true); setPage(page + 1); }} className="rounded-lg border border-border px-3 py-1.5 disabled:opacity-50">Next</button>
            </div>
          </div>
        </>}
      </div>
    </div>
  );
}
