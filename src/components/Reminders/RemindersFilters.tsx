/**
 * FILE: components/Reminders/RemindersFilters.tsx
 * Purpose: Shared UI/data logic for the Master Admin application.
 * NOTE: Keep presentation unchanged when refactoring; move repeated logic into reusable modules.
 */
// src/components/Reminders/RemindersFilters.tsx
import { SearchInput, SelectField } from "../common";

interface RemindersFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  type: string;
  onTypeChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
}

export default function RemindersFilters({
  search,
  onSearchChange,
  type,
  onTypeChange,
  status,
  onStatusChange,
}: RemindersFiltersProps) {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-3">
      <SearchInput
        widthClass="w-[280px]"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search reminders..."
      />

      <SelectField
        value={type}
        onChange={(e) => onTypeChange(e.target.value)}
        className="h-10 rounded-lg border border-border bg-white px-3 text-base text-text-muted outline-none focus:border-primary"
      >
        <option value="">All Types</option>
        <option value="Renewal">Renewal</option>
        <option value="Trial">Trial Ending</option>
        <option value="Approval">Pending Approval</option>
        <option value="Payment">Payment Issue</option>
      </SelectField>

      <SelectField
        value={status}
        onChange={(e) => onStatusChange(e.target.value)}
        className="h-10 rounded-lg border border-border bg-white px-3 text-base text-text-muted outline-none focus:border-primary"
      >
        <option value="">All Statuses</option>
        <option value="Open">Open</option>
        <option value="Snoozed">Snoozed</option>
        <option value="Resolved">Resolved</option>
      </SelectField>
    </div>
  );
}