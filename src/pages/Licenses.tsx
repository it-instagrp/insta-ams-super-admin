/**
 * FILE: pages/Licenses.tsx
 * Purpose: Shared UI/data logic for the Master Admin application.
 * NOTE: Keep presentation unchanged when refactoring; move repeated logic into reusable modules.
 */
import { useMemo, useState } from "react";
import { ShieldCheck, ShieldOff, Clock } from "lucide-react";
import { useAppData } from "../context/AppDataContext";
import type { License } from "../context/AppDataContext";
import StatCard from "../components/Dashboard/StatCard";
import LicensesFilters from "../components/Licenses/LicensesFilters";
import LicensesTable from "../components/Licenses/LicensesTable";
import IssueLicenseModal from "../components/Licenses/IssueLicenseModal";
import RenewLicenseModal from "../components/Licenses/RenewLicenseModal";
import ConfirmDialog from "../components/Users/ConfirmDialog";
import { getLicenseEffectiveStatus } from "../lib/licenseStatus";

export default function Licenses() {
  const { organizations, licenses, issueLicense, renewLicense, toggleCancelLicense } = useAppData();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [issueModalOpen, setIssueModalOpen] = useState(false);
  const [renewTarget, setRenewTarget] = useState<License | null>(null);
  const [cancelTarget, setCancelTarget] = useState<License | null>(null);

  const unlicensedOrganizations = useMemo(
    () => organizations.filter((org) => !licenses.some((lic) => lic.organizationId === org.id)),
    [organizations, licenses]
  );

  const filteredLicenses = useMemo(() => {
    const query = search.trim().toLowerCase();
    return licenses.filter((lic) => {
      const matchesSearch = !query || lic.organizationName.toLowerCase().includes(query);
      const effectiveStatus = getLicenseEffectiveStatus(lic.tier, lic.expiresAt, lic.cancelled);
      const matchesStatus = !statusFilter || effectiveStatus === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [licenses, search, statusFilter]);

  const stats = useMemo(() => {
    let active = 0, trial = 0, expired = 0;
    licenses.forEach((lic) => {
      const s = getLicenseEffectiveStatus(lic.tier, lic.expiresAt, lic.cancelled);
      if (s === "Active")  active++;
      else if (s === "Trial")   trial++;
      else if (s === "Expired") expired++;
    });
    return { active, trial, expired };
  }, [licenses]);

  const handleConfirmCancelToggle = () => {
    if (!cancelTarget) return;
    toggleCancelLicense(cancelTarget.id);
    setCancelTarget(null);
  };

  return (
    <div>
      <h1 className="page-title">License Management</h1>
      <p className="section-subtitle">
        View and manage every organization's license — plan, renewal, and status.
      </p>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard title="Active"  value={stats.active}  icon={ShieldCheck} />
        <StatCard title="Trial"   value={stats.trial}   icon={Clock}  iconColor="#F59E0B" iconBackground="#FEF3C7" />
        <StatCard title="Expired" value={stats.expired} icon={ShieldOff} iconColor="#DC2626" iconBackground="#FEE2E2" positive={false} />
      </div>

      <div className="mt-6">
        <LicensesFilters
          organizationNames={organizations.map((o) => o.name)}
          search={search}
          onSearchChange={setSearch}
          status={statusFilter}
          onStatusChange={setStatusFilter}
          onIssueClick={() => setIssueModalOpen(true)}
        />
        <LicensesTable
          licenses={filteredLicenses}
          onRenew={(lic) => setRenewTarget(lic)}
          onToggleCancel={(lic) => setCancelTarget(lic)}
        />
      </div>

      {issueModalOpen && (
        <IssueLicenseModal
          unlicensedOrganizations={unlicensedOrganizations}
          onClose={() => setIssueModalOpen(false)}
          onIssue={issueLicense}
        />
      )}

      {renewTarget && (
        <RenewLicenseModal
          key={renewTarget.id}
          license={renewTarget}
          onClose={() => setRenewTarget(null)}
          onRenew={renewLicense}
        />
      )}

      <ConfirmDialog
        open={!!cancelTarget}
        title={cancelTarget?.cancelled ? "Reactivate License" : "Cancel License"}
        message={
          cancelTarget?.cancelled
            ? `Reactivate ${cancelTarget?.organizationName}'s license?`
            : `${cancelTarget?.organizationName} will immediately lose access once cancelled. You can reactivate later.`
        }
        confirmLabel={cancelTarget?.cancelled ? "Reactivate" : "Cancel License"}
        danger={!cancelTarget?.cancelled}
        onCancel={() => setCancelTarget(null)}
        onConfirm={handleConfirmCancelToggle}
      />
    </div>
  );
}