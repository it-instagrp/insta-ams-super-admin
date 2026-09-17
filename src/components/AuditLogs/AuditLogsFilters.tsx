/**
 * FILE: components/AuditLogs/AuditLogsFilters.tsx
 * Purpose: Shared UI/data logic for the Master Admin application.
 * NOTE: Keep presentation unchanged when refactoring; move repeated logic into reusable modules.
 */
// src/components/AuditLogs/AuditLogsFilters.tsx
import { Calendar } from "lucide-react";
import { SearchInput, SelectField } from "../common";

interface AuditLogsFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  category: string;
  onCategoryChange: (value: string) => void;
  actor: string;
  onActorChange: (value: string) => void;
  dateRange: string;
  onDateRangeChange: (value: string) => void;
}

export default function AuditLogsFilters({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  actor,
  onActorChange,
  dateRange,
  onDateRangeChange,
}: AuditLogsFiltersProps) {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-3">
      <SearchInput widthClass="w-[280px]" value={search} onChange={(e) => onSearchChange(e.target.value)} placeholder="Search by actor or action..." />

      <SelectField
        value={category}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="h-10 rounded-lg border border-border bg-white px-3 text-base text-text-muted outline-none focus:border-primary"
      >
        <option value="">All Categories</option>
        <option value="Organization">Organization</option>
        <option value="User">User</option>
        <option value="License">License</option>
        <option value="Billing">Billing</option>
        <option value="Security">Security</option>
      </SelectField>

      <SelectField
        value={actor}
        onChange={(e) => onActorChange(e.target.value)}
        className="h-10 rounded-lg border border-border bg-white px-3 text-base text-text-muted outline-none focus:border-primary"
      >
        <option value="">All Actors</option>
        <option value="Master Admin">Master Admin</option>
        <option value="System">System</option>
      </SelectField>

      <div className="flex items-center gap-2">
        <Calendar size={16} className="text-text-muted" />
        <SelectField
          value={dateRange}
          onChange={(e) => onDateRangeChange(e.target.value)}
          className="h-10 rounded-lg border border-border bg-white px-3 text-base text-text-muted outline-none focus:border-primary"
        >
          <option>Last 7 days</option>
          <option>Last 30 days</option>
          <option>Last 90 days</option>
          <option>All time</option>
        </SelectField>
      </div>
    </div>
  );
}