/**
 * FILE: components/Dashboard/PlatformOverview.tsx
 * Purpose: Shared UI/data logic for the Master Admin application.
 * NOTE: Keep presentation unchanged when refactoring; move repeated logic into reusable modules.
 */
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { colors } from "../../styles/theme";

import type { OverviewPoint } from "../../services/dashboardService";



const PlatformOverview = ({ data, period, onPeriodChange }: { data: OverviewPoint[]; period: string; onPeriodChange: (period: string) => void }) => {
  return (
    <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-text-primary">Platform Overview</h2>
          <p className="mt-1 text-sm text-text-muted">
            Organization growth and membership performance
          </p>
        </div>

        <select value={period} onChange={(event) => onPeriodChange(event.target.value)} className="rounded-lg border border-border bg-white px-3 py-2 text-sm text-text-muted outline-none focus:border-primary">
          <option value="3m">Last 3 months</option>
          <option value="6m">Last 6 months</option>
          <option value="12m">Last 12 months</option>
        </select>
      </div>

      {data.length === 0 ? <p className="py-10 text-sm text-text-muted">No overview data available for this period.</p> : <div className="h-[220px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
            <Tooltip
              cursor={{ fill: "rgba(16, 185, 129, 0.05)" }}
              contentStyle={{ borderRadius: "10px", border: `1px solid ${colors.border}`, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)" }}
            />
            <Bar dataKey="organizations" name="Organizations" fill={colors.primary} radius={[6, 6, 0, 0]} barSize={28} />
            <Bar dataKey="memberships" name="Memberships" fill={colors.textMuted} radius={[6, 6, 0, 0]} barSize={28} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      }

      <div className="mt-4 flex items-center gap-6 text-sm text-text-muted">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-primary" />
          <span>Organizations</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-text-muted" />
          <span>Memberships</span>
        </div>
      </div>
    </div>
  );
};

export default PlatformOverview;
