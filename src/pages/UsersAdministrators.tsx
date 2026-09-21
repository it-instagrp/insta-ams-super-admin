import { useEffect, useMemo, useRef, useState } from "react";
import { SearchInput, SelectField } from "../components/common";
import OrgAdminsFilters from "../components/Users/OrgAdminsFilters";
import OrgAdminsTable from "../components/Users/OrgAdminsTable";
import UsersTable from "../components/Users/UsersTable";
import { getApiErrorMessage } from "../services/apiClient";
import {
  deleteAdmin, listAdmins, listOrganizationOptions, listUsers,
  sendAdminResetLink, setAdminSuspended,
} from "../services/usersAdminService";
import type { AdminRecord, UserPage } from "../services/usersAdminService";

const PAGE_SIZE = 20;
type AdminAction = "suspend" | "delete" | "reset";

function AdministratorsPanel() {
  const [admins, setAdmins] = useState<AdminRecord[] | null>(null);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [reload, setReload] = useState(0);
  const [target, setTarget] = useState<{ admin: AdminRecord; action: AdminAction } | null>(null);
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
    listAdmins(query, status, controller.signal).then((data) => {
      if (controller.signal.aborted || version !== requestVersion.current) return;
      setAdmins(data);
      setError("");
      setLoading(false);
    }).catch((error: unknown) => {
      if (controller.signal.aborted || version !== requestVersion.current) return;
      setAdmins(null);
      setError(getApiErrorMessage(error, "Could not load administrators."));
      setLoading(false);
    });
    return () => controller.abort();
  }, [query, status, reload]);

  const refresh = () => {
    requestVersion.current += 1;
    setLoading(true);
    setReload((value) => value + 1);
  };

  const confirm = async () => {
    if (!target || actionBusy) return;
    const { admin, action } = target;
    setActionBusy(true);
    setActionError("");
    try {
      if (action === "suspend") await setAdminSuspended(admin.id, admin.status !== "Suspended");
      if (action === "delete") await deleteAdmin(admin.id);
      if (action === "reset") await sendAdminResetLink(admin.id);
      setNotice(action === "delete" ? "Administrator removed." : action === "reset" ? "Password reset link sent." : admin.status === "Suspended" ? "Administrator activated." : "Administrator suspended.");
      setTarget(null);
      refresh();
    } catch (error) {
      setActionError(getApiErrorMessage(error, "Could not update the administrator."));
    } finally {
      setActionBusy(false);
    }
  };

  const title = target?.action === "delete" ? "Remove Administrator" : target?.action === "reset" ? "Send Password Reset Link" : target?.admin.status === "Suspended" ? "Activate Administrator" : "Suspend Administrator";
  const message = target?.action === "delete"
    ? `Permanently remove ${target.admin.name} as an administrator?`
    : target?.action === "reset"
      ? `Send a password reset link to ${target.admin.email}?`
      : target?.admin.status === "Suspended"
        ? `Restore access for ${target.admin.name}?`
        : `${target?.admin.name} will lose administrator access until reactivated.`;

  return <>
    <div className="mb-4 flex items-start justify-between gap-3">
      <OrgAdminsFilters
        search={search}
        onSearchChange={(value) => { requestVersion.current += 1; setSearch(value); setLoading(true); }}
        status={status}
        onStatusChange={(value) => { requestVersion.current += 1; setStatus(value); setLoading(true); }}
      />
      <button onClick={refresh} className="rounded-lg border border-border bg-white px-3 py-2 text-sm text-text-muted">Refresh</button>
    </div>
    {notice && <p role="status" className="mb-4 rounded-lg border border-primary bg-primary-light px-4 py-2 text-sm text-primary-dark">{notice}</p>}
    {error && <p role="alert" className="mb-4 rounded-lg border border-error bg-error-bg px-4 py-2 text-sm text-error">{error} <button onClick={refresh} className="ml-2 underline">Retry</button></p>}
    {loading ? <div className="empty-state" role="status">Loading administrators…</div> : !error && <OrgAdminsTable
      admins={admins ?? []}
      onResetPassword={(admin) => { setActionError(""); setTarget({ admin, action: "reset" }); }}
      onToggleSuspend={(admin) => { setActionError(""); setTarget({ admin, action: "suspend" }); }}
      onRemove={(admin) => { setActionError(""); setTarget({ admin, action: "delete" }); }}
    />}

    {target && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
        <p className="mt-2 text-sm text-text-muted">{message}</p>
        {actionError && <p role="alert" className="mt-3 text-sm text-error">{actionError}</p>}
        <div className="mt-6 flex justify-end gap-3">
          <button disabled={actionBusy} onClick={() => setTarget(null)} className="rounded-lg border border-border px-4 py-2 text-sm">Back</button>
          <button disabled={actionBusy} onClick={() => void confirm()} className={`rounded-lg px-4 py-2 text-sm font-medium text-white disabled:opacity-50 ${target.action === "delete" || (target.action === "suspend" && target.admin.status !== "Suspended") ? "bg-error" : "bg-primary"}`}>
            {actionBusy ? "Working…" : target.action === "reset" ? "Send Link" : target.action === "delete" ? "Remove" : target.admin.status === "Suspended" ? "Activate" : "Suspend"}
          </button>
        </div>
      </div>
    </div>}
  </>;
}

function UsersPanel() {
  const [result, setResult] = useState<UserPage | null>(null);
  const [organizations, setOrganizations] = useState<{ id: string; name: string }[]>([]);
  const [orgError, setOrgError] = useState("");
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [organizationId, setOrganizationId] = useState("");
  const [enrolled, setEnrolled] = useState<"" | "true" | "false">("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reload, setReload] = useState(0);
  const requestVersion = useRef(0);
  const organizationNames = useMemo(() => new Map(organizations.map((org) => [org.id, org.name])), [organizations]);

  useEffect(() => {
    const controller = new AbortController();
    listOrganizationOptions(controller.signal).then((data) => {
      if (!controller.signal.aborted) setOrganizations(data);
    }).catch((error: unknown) => {
      if (!controller.signal.aborted) setOrgError(getApiErrorMessage(error, "Could not load organization names."));
    });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => setQuery(search.trim()), 300);
    return () => window.clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const controller = new AbortController();
    const version = ++requestVersion.current;
    listUsers({ organizationId, enrolled, search: query, page, perPage: PAGE_SIZE }, controller.signal)
      .then((data) => {
        if (controller.signal.aborted || version !== requestVersion.current) return;
        setResult(data);
        setError("");
        setLoading(false);
      }).catch((error: unknown) => {
        if (controller.signal.aborted || version !== requestVersion.current) return;
        setResult(null);
        setError(getApiErrorMessage(error, "Could not load users."));
        setLoading(false);
      });
    return () => controller.abort();
  }, [organizationId, enrolled, query, page, reload]);

  const changeFilter = (apply: () => void) => {
    requestVersion.current += 1;
    setLoading(true);
    setPage(1);
    apply();
  };
  const totalPages = Math.max(1, Math.ceil((result?.total ?? 0) / PAGE_SIZE));
  const refresh = () => { requestVersion.current += 1; setLoading(true); setReload((value) => value + 1); };

  return <>
    <div className="mb-4 flex flex-wrap items-center gap-3">
      <SearchInput value={search} onChange={(event) => changeFilter(() => setSearch(event.target.value))} placeholder="Search users..." />
      <SelectField value={organizationId} onChange={(event) => changeFilter(() => setOrganizationId(event.target.value))}>
        <option value="">All Organizations</option>
        {organizations.map((org) => <option key={org.id} value={org.id}>{org.name}</option>)}
      </SelectField>
      <SelectField value={enrolled} onChange={(event) => changeFilter(() => setEnrolled(event.target.value as "" | "true" | "false"))}>
        <option value="">All Enrollment</option>
        <option value="true">Enrolled</option>
        <option value="false">Not enrolled</option>
      </SelectField>
      <button onClick={refresh} className="rounded-lg border border-border bg-white px-3 py-2 text-sm text-text-muted">Refresh</button>
    </div>
    {orgError && <p role="alert" className="mb-4 rounded-lg border border-warning bg-warningBg px-4 py-2 text-sm text-text-primary">{orgError} Organization IDs will be shown.</p>}
    {error && <p role="alert" className="mb-4 rounded-lg border border-error bg-error-bg px-4 py-2 text-sm text-error">{error} <button onClick={refresh} className="ml-2 underline">Retry</button></p>}
    {loading ? <div className="empty-state" role="status">Loading users…</div> : !error && <>
      <UsersTable users={result?.users ?? []} organizationNames={organizationNames} />
      <div className="mt-4 flex items-center justify-between text-sm text-text-muted">
        <span>{result?.total ?? 0} users · Page {page} of {totalPages}</span>
        <div className="flex gap-2">
          <button disabled={page <= 1} onClick={() => { setLoading(true); setPage(page - 1); }} className="rounded-lg border border-border px-3 py-1.5 disabled:opacity-50">Previous</button>
          <button disabled={page >= totalPages} onClick={() => { setLoading(true); setPage(page + 1); }} className="rounded-lg border border-border px-3 py-1.5 disabled:opacity-50">Next</button>
        </div>
      </div>
    </>}
  </>;
}

export default function UsersAdministrators() {
  const [tab, setTab] = useState<"users" | "admins">("users");
  return <div>
    <h1 className="page-title">Users & Administrators</h1>
    <p className="section-subtitle">Manage platform users and organization administrators.</p>
    <div className="mt-6 flex gap-2 border-b border-border">
      <button type="button" onClick={() => setTab("users")} className={`px-4 py-2 text-sm font-medium ${tab === "users" ? "border-b-2 border-primary text-primary" : "text-text-muted"}`}>Users</button>
      <button type="button" onClick={() => setTab("admins")} className={`px-4 py-2 text-sm font-medium ${tab === "admins" ? "border-b-2 border-primary text-primary" : "text-text-muted"}`}>Administrators</button>
    </div>
    <div className="mt-5">{tab === "users" ? <UsersPanel /> : <AdministratorsPanel />}</div>
  </div>;
}
