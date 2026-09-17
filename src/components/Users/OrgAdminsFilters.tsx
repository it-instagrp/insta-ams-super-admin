/**
 * FILE: components/Users/OrgAdminsFilters.tsx
 * Purpose: Shared UI/data logic for the Master Admin application.
 * NOTE: Keep presentation unchanged when refactoring; move repeated logic into reusable modules.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { SearchInput, SelectField } from "../common";
import type { OrgAdmin } from "../../context/AppDataContext";

interface OrgAdminsFiltersProps {
  admins: OrgAdmin[];
  search: string;
  onSearchChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
}

export default function OrgAdminsFilters({
  admins,
  search,
  onSearchChange,
  status,
  onStatusChange,
}: OrgAdminsFiltersProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const suggestions = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return [];

    const nameMatches = new Set<string>();
    const orgMatches = new Set<string>();

    admins.forEach((admin) => {
      if (admin.name.toLowerCase().includes(query)) nameMatches.add(admin.name);
      if (admin.organizationName.toLowerCase().includes(query)) orgMatches.add(admin.organizationName);
    });

    return [
      ...Array.from(nameMatches).map((value) => ({ label: value, type: "Admin" as const })),
      ...Array.from(orgMatches).map((value) => ({ label: value, type: "Organization" as const })),
    ].slice(0, 8);
  }, [admins, search]);

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
        <div className="relative" ref={containerRef}>
          <SearchInput
            value={search}
            onChange={(e) => { onSearchChange(e.target.value); setOpen(true); }}
            onFocus={() => search && setOpen(true)}
            placeholder="Search by admin or organization..."
          />

          {open && suggestions.length > 0 && (
            <div className="absolute left-0 right-0 top-11 z-50 max-h-64 overflow-y-auto rounded-lg border border-border bg-white py-1 shadow-lg">
              {suggestions.map((item) => (
                <button
                  key={`${item.type}-${item.label}`}
                  onClick={() => {
                    onSearchChange(item.label);
                    setOpen(false);
                  }}
                  className="flex w-full items-center justify-between px-3 py-2 text-left text-base text-text-primary hover:bg-primary-light"
                >
                  <span className="truncate">{item.label}</span>
                  <span className="ml-2 shrink-0 text-xs text-text-muted">{item.type}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <SelectField
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className="h-10 rounded-lg border border-border bg-white px-3 text-base text-text-muted outline-none focus:border-primary"
        >
          <option value="">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Invited">Invited</option>
          <option value="Suspended">Suspended</option>
        </SelectField>
      </div>
    </div>
  );
}
