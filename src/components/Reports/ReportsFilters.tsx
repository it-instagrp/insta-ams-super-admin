/**
 * FILE: components/Reports/ReportsFilters.tsx
 * Purpose: Shared UI/data logic for the Master Admin application.
 * NOTE: Keep presentation unchanged when refactoring; move repeated logic into reusable modules.
 */
import { Download, Calendar } from "lucide-react";

export default function ReportsFilters() {
  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <Calendar size={16} className="text-text-muted" />
        <select className="h-10 rounded-lg border border-border bg-white px-3 text-base text-text-muted outline-none focus:border-primary">
          <option>Last 30 days</option>
          <option>Last 90 days</option>
          <option>Last 6 months</option>
          <option>Last 12 months</option>
          <option>Year to date</option>
        </select>
      </div>

      <button className="flex h-10 items-center gap-2 rounded-lg border border-border bg-white px-4 text-base font-medium text-text-primary hover:bg-primary-light">
        <Download size={16} strokeWidth={1.8} />
        Export Report
      </button>
    </div>
  );
}