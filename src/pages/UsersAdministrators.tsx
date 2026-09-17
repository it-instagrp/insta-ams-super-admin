/**
 * FILE: pages/UsersAdministrators.tsx
 * Purpose: Shared UI/data logic for the Master Admin application.
 * NOTE: Keep presentation unchanged when refactoring; move repeated logic into reusable modules.
 */
// src/pages/UsersAdministrators.tsx
import { useMemo, useState } from "react";
import { useAppData } from "../context/AppDataContext";
import type { OrgAdmin } from "../context/AppDataContext";
import OrgAdminsFilters from "../components/Users/OrgAdminsFilters";
import OrgAdminsTable from "../components/Users/OrgAdminsTable";
import ConfirmDialog from "../components/Users/ConfirmDialog";

export default function UsersAdministrators() {
  const { orgAdmins, toggleSuspendAdmin, removeAdmin } = useAppData();

  const [suspendTarget, setSuspendTarget] = useState<OrgAdmin | null>(null);
  const [removeTarget, setRemoveTarget] = useState<OrgAdmin | null>(null);
  const [resetTarget, setResetTarget] = useState<OrgAdmin | null>(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const filteredAdmins = useMemo(() => {
    const query = search.trim().toLowerCase();
    return orgAdmins.filter((admin) => {
      const matchesSearch =
        !query ||
        admin.name.toLowerCase().includes(query) ||
        admin.organizationName.toLowerCase().includes(query);
      const matchesStatus = !statusFilter || admin.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orgAdmins, search, statusFilter]);

  const handleConfirmSuspend = () => {
    if (!suspendTarget) return;
    toggleSuspendAdmin(suspendTarget.id);
    setSuspendTarget(null);
  };

  const handleConfirmRemove = () => {
    if (!removeTarget) return;
    removeAdmin(removeTarget.id);
    setRemoveTarget(null);
  };

  const handleConfirmReset = () => {
    setResetTarget(null);
  };

  return (
    <div>
      <h1 className="page-title">Users & Administrators</h1>
      <p className="section-subtitle">
        Each organization's admin — added automatically when the organization is created.
      </p>

      <div className="mt-6">
        <OrgAdminsFilters
          admins={orgAdmins}
          search={search}
          onSearchChange={setSearch}
          status={statusFilter}
          onStatusChange={setStatusFilter}
        />
        <OrgAdminsTable
          admins={filteredAdmins}
          onResetPassword={(admin) => setResetTarget(admin)}
          onToggleSuspend={(admin) => setSuspendTarget(admin)}
          onRemove={(admin) => setRemoveTarget(admin)}
        />
      </div>

      <ConfirmDialog
        open={!!suspendTarget}
        title={suspendTarget?.status === "Suspended" ? "Activate Administrator" : "Suspend Administrator"}
        message={
          suspendTarget?.status === "Suspended"
            ? `Restore access for ${suspendTarget?.name}?`
            : `${suspendTarget?.name} will immediately lose access to ${suspendTarget?.organizationName}'s admin page. You can reactivate them later.`
        }
        confirmLabel={suspendTarget?.status === "Suspended" ? "Activate" : "Suspend"}
        danger={suspendTarget?.status !== "Suspended"}
        onCancel={() => setSuspendTarget(null)}
        onConfirm={handleConfirmSuspend}
      />

      <ConfirmDialog
        open={!!removeTarget}
        title="Remove Administrator"
        message={`This will permanently remove ${removeTarget?.name} as the admin for ${removeTarget?.organizationName}. This action cannot be undone.`}
        confirmLabel="Remove"
        danger
        onCancel={() => setRemoveTarget(null)}
        onConfirm={handleConfirmRemove}
      />

      <ConfirmDialog
        open={!!resetTarget}
        title="Reset Password"
        message={`Send a password reset link to ${resetTarget?.name} (${resetTarget?.email})?`}
        confirmLabel="Send Reset Link"
        onCancel={() => setResetTarget(null)}
        onConfirm={handleConfirmReset}
      />
    </div>
  );
}