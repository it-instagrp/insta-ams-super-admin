/**
 * FILE: components/Licenses/LicenseRequestFilters.tsx
 * Purpose: Shared UI/data logic for the Master Admin application.
 * NOTE: Keep presentation unchanged when refactoring; move repeated logic into reusable modules.
 */
import { Building2 } from "lucide-react";

interface LicenseRequestFiltersProps {
  organizationNames: string[];
  organization: string;
  onOrganizationChange: (value: string) => void;
  plan: string;
  onPlanChange: (value: string) => void;
}

export default function LicenseRequestFilters({
  organizationNames,
  organization,
  onOrganizationChange,
  plan,
  onPlanChange,
}: LicenseRequestFiltersProps) {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-3">
      <div className="relative w-[280px]">
        <Building2 size={16} strokeWidth={1.8} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
        <select
          value={organization}
          onChange={(e) => onOrganizationChange(e.target.value)}
          className="h-10 w-full rounded-lg border border-border bg-white pl-9 pr-3 text-base text-text-muted outline-none focus:border-primary"
        >
          <option value="">All Organizations</option>
          {organizationNames.map((name) => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>
      </div>

      <select
        value={plan}
        onChange={(e) => onPlanChange(e.target.value)}
        className="h-10 rounded-lg border border-border bg-white px-3 text-base text-text-muted outline-none focus:border-primary"
      >
        <option value="">All Plans</option>
        <option value="Monthly">Monthly</option>
        <option value="Quarterly">Quarterly</option>
        <option value="Yearly">Yearly</option>
      </select>
    </div>
  );
}