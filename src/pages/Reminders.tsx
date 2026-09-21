import { useEffect, useRef, useState } from "react";
import RemindersFilters from "../components/Reminders/RemindersFilters";
import RemindersList from "../components/Reminders/RemindersList";
import { getApiErrorMessage } from "../services/apiClient";
import { deleteReminder, listReminders, resolveReminder, snoozeReminder } from "../services/reminderService";
import type { ReminderRecord } from "../services/reminderService";

export default function Reminders() {
  const [reminders, setReminders] = useState<ReminderRecord[] | null>(null);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ReminderRecord | null>(null);
  const [actionError, setActionError] = useState("");
  const [reload, setReload] = useState(0);
  const requestVersion = useRef(0);

  useEffect(() => {
    const timer = window.setTimeout(() => setQuery(search.trim()), 300);
    return () => window.clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const controller = new AbortController();
    const version = ++requestVersion.current;
    listReminders({ search: query, type: typeFilter, status: statusFilter }, controller.signal)
      .then((data) => {
        if (controller.signal.aborted || version !== requestVersion.current) return;
        setReminders(data);
        setError("");
        setLoading(false);
      }).catch((error: unknown) => {
        if (controller.signal.aborted || version !== requestVersion.current) return;
        setReminders(null);
        setError(getApiErrorMessage(error, "Could not load reminders."));
        setLoading(false);
      });
    return () => controller.abort();
  }, [query, typeFilter, statusFilter, reload]);

  const refresh = () => {
    requestVersion.current += 1;
    setLoading(true);
    setReload((value) => value + 1);
  };

  const runAction = async (id: string, action: () => Promise<void>, message: string) => {
    if (busyId) return;
    setBusyId(id);
    setActionError("");
    try {
      await action();
      setNotice(message);
      refresh();
      setDeleteTarget(null);
    } catch (error) {
      setActionError(getApiErrorMessage(error, "Could not update the reminder."));
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="page-title">Reminders</h1>
          <p className="section-subtitle">Stay on top of renewals, approvals, and account issues across the platform.</p>
        </div>
        <button type="button" onClick={refresh} className="rounded-lg border border-border bg-white px-3 py-2 text-sm text-text-muted hover:bg-primary-light">Refresh</button>
      </div>

      <div className="mt-6">
        <RemindersFilters
          search={search}
          onSearchChange={(value) => { requestVersion.current += 1; setSearch(value); setLoading(true); }}
          type={typeFilter}
          onTypeChange={(value) => { requestVersion.current += 1; setTypeFilter(value); setLoading(true); }}
          status={statusFilter}
          onStatusChange={(value) => { requestVersion.current += 1; setStatusFilter(value); setLoading(true); }}
        />
        {notice && <p role="status" className="mb-4 rounded-lg border border-primary bg-primary-light px-4 py-2 text-sm text-primary-dark">{notice}</p>}
        {actionError && !deleteTarget && <p role="alert" className="mb-4 rounded-lg border border-error bg-error-bg px-4 py-2 text-sm text-error">{actionError}</p>}
        {error && <p role="alert" className="mb-4 rounded-lg border border-error bg-error-bg px-4 py-2 text-sm text-error">{error} <button type="button" onClick={refresh} className="ml-2 underline">Retry</button></p>}
        {loading ? <div className="empty-state" role="status">Loading reminders…</div> : !error && <RemindersList
          reminders={reminders ?? []}
          busyId={busyId}
          onResolve={(id) => void runAction(id, () => resolveReminder(id), "Reminder resolved.")}
          onSnooze={(id) => void runAction(id, () => snoozeReminder(id), "Reminder snoozed.")}
          onDelete={(reminder) => { setActionError(""); setDeleteTarget(reminder); }}
        />}
      </div>

      {deleteTarget && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
        <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
          <h2 className="text-lg font-semibold text-text-primary">Delete Reminder</h2>
          <p className="mt-2 text-sm text-text-muted">Permanently delete “{deleteTarget.title}”?</p>
          {actionError && <p role="alert" className="mt-3 text-sm text-error">{actionError}</p>}
          <div className="mt-6 flex justify-end gap-3">
            <button type="button" disabled={busyId !== null} onClick={() => setDeleteTarget(null)} className="rounded-lg border border-border px-4 py-2 text-sm">Back</button>
            <button type="button" disabled={busyId !== null} onClick={() => void runAction(deleteTarget.id, () => deleteReminder(deleteTarget.id), "Reminder deleted.")} className="rounded-lg bg-error px-4 py-2 text-sm font-medium text-white disabled:opacity-50">
              {busyId ? "Deleting…" : "Delete"}
            </button>
          </div>
        </div>
      </div>}
    </div>
  );
}
