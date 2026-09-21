/**
 * FILE: components/Dashboard/PlatformStatus.tsx
 * Purpose: Shared UI/data logic for the Master Admin application.
 * NOTE: Keep presentation unchanged when refactoring; move repeated logic into reusable modules.
 */

import type { StatusPoint } from "../../services/dashboardService";
import { colors } from "../../styles/theme";

const statusColors: Record<string, string> = {
  active: colors.primary, trial: colors.warning,
  "pending renewal": colors.info, suspended: colors.error,
};

export default function PlatformStatus({ data }: { data: StatusPoint[] }) {
  return (
    <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-text-primary">Platform Status</h2>
        <p className="mt-1 text-sm text-text-muted">
          Organization status breakdown across the platform
        </p>
      </div>

      <div className="space-y-5">
        {data.length === 0 && <p className="text-sm text-text-muted">No status data available.</p>}
        {data.map((item) => (
          <div key={item.label}>
            <div className="mb-1.5 flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: statusColors[item.label.toLowerCase()] ?? colors.textMuted }} />
                <span className="font-medium text-text-primary">{item.label}</span>
              </div>
              <div className="flex items-center gap-2 text-text-muted">
                <span>{item.count} orgs</span>
                <span className="font-semibold text-text-primary">{item.percentage}%</span>
              </div>
            </div>

            <div className="h-2 w-full overflow-hidden rounded-full bg-primary-light">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${Math.min(100, Math.max(0, item.percentage))}%`, backgroundColor: statusColors[item.label.toLowerCase()] ?? colors.textMuted }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
