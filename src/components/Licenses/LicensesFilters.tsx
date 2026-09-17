/**
 * FILE: components/Licenses/LicensesFilters.tsx
 * Purpose: Shared UI/data logic for the Master Admin application.
 * NOTE: Keep presentation unchanged when refactoring; move repeated logic into reusable modules.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { ShieldPlus } from "lucide-react";
import { SearchInput, SelectField } from "../common";

interface LicensesFiltersProps {
  organizationNames: string[];
  search: string;
  onSearchChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  onIssueClick: () => void;
}

export default function LicensesFilters({
  organizationNames, search, onSearchChange, status, onStatusChange, onIssueClick,
}: LicensesFiltersProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const suggestions = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return [];
    return organizationNames.filter((name) => name.toLowerCase().includes(query)).slice(0, 8);
  }, [organizationNames, search]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative w-[280px]" ref={containerRef}>
          <SearchInput
            value={search}
            onChange={(e) => { onSearchChange(e.target.value); setOpen(true); }}
            onFocus={() => search && setOpen(true)}
            placeholder="Search by organization name..."
          />
          {open && suggestions.length > 0 && (
            <div className="absolute left-0 right-0 top-11 z-50 max-h-64 overflow-y-auto rounded-lg border border-border bg-white py-1 shadow-lg">
              {suggestions.map((name) => (
                <button key={name} onClick={() => { onSearchChange(name); setOpen(false); }}
                  className="flex w-full items-center px-3 py-2 text-left text-base text-text-primary hover:bg-primary-light">
                  {name}
                </button>
              ))}
            </div>
          )}
        </div>

        <SelectField value={status} onChange={(e) => onStatusChange(e.target.value)}
          className="h-10 rounded-lg border border-border bg-white px-3 text-base text-text-muted outline-none focus:border-primary">
          <option value="">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Trial">Trial</option>
          <option value="Expired">Expired</option>
        </SelectField>
      </div>

      <button onClick={onIssueClick}
        className="flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-base font-medium text-white hover:bg-primary-dark">
        <ShieldPlus size={16} strokeWidth={2} /> Issue New License
      </button>
    </div>
  );
}