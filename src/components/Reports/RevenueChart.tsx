/**
 * FILE: components/Reports/RevenueChart.tsx
 * Purpose: Shared UI/data logic for the Master Admin application.
 * NOTE: Keep presentation unchanged when refactoring; move repeated logic into reusable modules.
 */
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { colors } from "../../styles/theme";

import type { RevenueReport } from "../../services/reportsService";

export default function RevenueChart({ report }: { report: RevenueReport }) {
  const formatCurrency = (value: number) => new Intl.NumberFormat(undefined, {
    style: "currency", currency: report.currency, maximumFractionDigits: 0,
  }).format(value);
  return (
    <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-text-primary">Platform Revenue</h2>
        <p className="mt-1 text-sm text-text-muted">
          Monthly recurring revenue across all organizations
        </p>
      </div>

      {report.points.length === 0 ? <p className="py-10 text-sm text-text-muted">No revenue data for this period.</p> : <div className="h-[260px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={report.points} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colors.primary} stopOpacity={0.25} />
                <stop offset="95%" stopColor={colors.primary} stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => formatCurrency(Number(value))}
            />
            <Tooltip
              formatter={(value) => [
                formatCurrency(typeof value === "number" ? value : Number(value ?? 0)),
                "Revenue",
              ]}
              contentStyle={{
                borderRadius: "10px",
                border: `1px solid ${colors.border}`,
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
              }}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke={colors.primary}
              strokeWidth={2.5}
              fill="url(#revenueGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      }
    </div>
  );
}
