/**
 * FILE: components/Reports/ReportsFilters.tsx
 * Purpose: Shared UI/data logic for the Master Admin application.
 * NOTE: Keep presentation unchanged when refactoring; move repeated logic into reusable modules.
 */
import { Download, Calendar } from "lucide-react";
import type { ReportPeriod } from "../../services/reportsService";

export default function ReportsFilters({ period, onPeriodChange, onExport, exporting }: {
  period: ReportPeriod;
  onPeriodChange: (period: ReportPeriod) => void;
  onExport: () => void;
  exporting: boolean;
}) {
  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <Calendar size={16} className="text-text-muted" />
        <select value={period} disabled={exporting} onChange={(event) => onPeriodChange(event.target.value as ReportPeriod)} className="h-10 rounded-lg border border-border bg-white px-3 text-base text-text-muted outline-none focus:border-primary disabled:opacity-50">
          <option value="1m">Last month</option>
          <option value="3m">Last 3 months</option>
          <option value="6m">Last 6 months</option>
          <option value="12m">Last 12 months</option>
          <option value="ytd">Year to date</option>
        </select>
      </div>

      <button type="button" disabled={exporting} onClick={onExport} className="flex h-10 items-center gap-2 rounded-lg border border-border bg-white px-4 text-base font-medium text-text-primary hover:bg-primary-light disabled:opacity-50">
        <Download size={16} strokeWidth={1.8} />
        {exporting ? "Exporting…" : "Export Report"}
      </button>
    </div>
  );
}
