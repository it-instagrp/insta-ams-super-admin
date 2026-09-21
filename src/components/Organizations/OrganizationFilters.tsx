/**
 * FILE: components/Organizations/OrganizationFilters.tsx
 * Purpose: Shared UI/data logic for the Master Admin application.
 * NOTE: Keep presentation unchanged when refactoring; move repeated logic into reusable modules.
 */
import { Plus } from "lucide-react";
import { SearchInput, SelectField } from "../common";

interface OrganizationFiltersProps {
  onAddClick: () => void;
  search: string;
  onSearchChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  plan: string;
  onPlanChange: (value: string) => void;
}

export default function OrganizationFilters({
  onAddClick,
  search,
  onSearchChange,
  status,
  onStatusChange,
  plan,
  onPlanChange,
}: OrganizationFiltersProps) {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-3">
      <SearchInput
        widthClass="w-[260px]"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search by organization name..."
      />
      <SelectField
        value={status}
        onChange={(e) => onStatusChange(e.target.value)}
        className="h-10 rounded-lg border border-border bg-white px-3 text-base text-text-muted outline-none focus:border-primary"
      >
        <option value="">All Statuses</option>
        <option value="Active">Active</option>
        <option value="Trial">Trial</option>
        <option value="Pending Renewal">Pending Renewal</option>
        <option value="Suspended">Suspended</option>
      </SelectField>
      <SelectField
        value={plan}
        onChange={(e) => onPlanChange(e.target.value)}
        className="h-10 rounded-lg border border-border bg-white px-3 text-base text-text-muted outline-none focus:border-primary"
      >
        <option value="">All Plans</option>
        <option value="Monthly">Monthly</option>
        <option value="Quarterly">Quarterly</option>
        <option value="Yearly">Yearly</option>
        <option value="ENTERPRISE">Enterprise</option>
      </SelectField>
      <button
        onClick={onAddClick}
        className="flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-base font-medium text-white hover:bg-primary-dark"
      >
        <Plus size={16} strokeWidth={2} /> Add Organization
      </button>
    </div>
  );
}
