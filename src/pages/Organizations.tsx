/**
 * FILE: pages/Organizations.tsx
 * Purpose: Shared UI/data logic for the Master Admin application.
 * NOTE: Keep presentation unchanged when refactoring; move repeated logic into reusable modules.
 */
import { useMemo, useState } from "react";
import { useAppData } from "../context/AppDataContext";
import OrganizationFilters from "../components/Organizations/OrganizationFilters";
import OrganizationsTable from "../components/Organizations/OrganizationsTable";
import AddOrganizationModal from "../components/Organizations/AddOrganizationModal";
import type { NewOrgFormData } from "../components/Organizations/AddOrganizationModal";

export default function Organizations() {
  const { organizations, addOrganization, toggleSuspendOrganization, deleteOrganization } = useAppData();

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [search, setSearch]             = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [planFilter, setPlanFilter]     = useState("");

  const filteredOrganizations = useMemo(() => {
    return organizations.filter((org) => {
      const matchesSearch = org.name.toLowerCase().includes(search.trim().toLowerCase());
      const matchesStatus = !statusFilter || org.status === statusFilter;
      const matchesPlan   = !planFilter   || org.plan   === planFilter;
      return matchesSearch && matchesStatus && matchesPlan;
    });
  }, [organizations, search, statusFilter, planFilter]);

  // Explicit wrapper — never pass addOrganization directly as a prop
  // so the modal controls exactly when the call is made (confirm screen only)
  const handleAddOrganization = (data: NewOrgFormData) => {
    addOrganization(data);
    setAddModalOpen(false);
  };

  return (
    <div>
      <h1 className="page-title">Organizations</h1>
      <p className="section-subtitle">Manage all client organizations on the platform.</p>

      <div className="mt-6">
        <OrganizationFilters
          onAddClick={() => setAddModalOpen(true)}
          search={search}
          onSearchChange={setSearch}
          status={statusFilter}
          onStatusChange={setStatusFilter}
          plan={planFilter}
          onPlanChange={setPlanFilter}
        />
        <OrganizationsTable
          organizations={filteredOrganizations}
          onToggleSuspend={(org) => toggleSuspendOrganization(org.id)}
          onDelete={(org) => deleteOrganization(org.id)}
        />
      </div>

      <AddOrganizationModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSubmit={handleAddOrganization}
      />
    </div>
  );
}