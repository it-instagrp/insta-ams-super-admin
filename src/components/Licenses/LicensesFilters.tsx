/**
 * FILE: components/Licenses/LicensesFilters.tsx
 * Purpose: Shared UI/data logic for the Master Admin application.
 * NOTE: Keep presentation unchanged when refactoring; move repeated logic into reusable modules.
 */
import { ShieldPlus } from "lucide-react";
import { SearchInput, SelectField } from "../common";

interface LicensesFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  onIssueClick: () => void;
}

export default function LicensesFilters({
  search, onSearchChange, status, onStatusChange, onIssueClick,
}: LicensesFiltersProps) {
  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative w-[280px]">
          <SearchInput
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by organization name..."
          />
        </div>

        <SelectField value={status} onChange={(e) => onStatusChange(e.target.value)}
          className="h-10 rounded-lg border border-border bg-white px-3 text-base text-text-muted outline-none focus:border-primary">
          <option value="">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Trial">Trial</option>
          <option value="Expired">Expired</option>
          <option value="Cancelled">Cancelled</option>
        </SelectField>
      </div>

      <button onClick={onIssueClick}
        className="flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-base font-medium text-white hover:bg-primary-dark">
        <ShieldPlus size={16} strokeWidth={2} /> Issue New License
      </button>
    </div>
  );
}
