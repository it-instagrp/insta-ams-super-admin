/**
 * FILE: components/Dashboard/WeeklyTrends.tsx
 * Purpose: Shared UI/data logic for the Master Admin application.
 * NOTE: Keep presentation unchanged when refactoring; move repeated logic into reusable modules.
 */
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { colors } from "../../styles/theme";

import { weeklyTrendsData } from "../../data/dashboardData";



export default function WeeklyTrends() {
  return (
    <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-text-primary">Weekly Platform Trends</h2>
        <p className="mt-1 text-sm text-text-muted">
          New organizations, renewals, and cancellations this week
        </p>
      </div>

      <div className="h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={weeklyTrendsData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
            <Tooltip
              cursor={{ stroke: colors.border, strokeWidth: 1 }}
              contentStyle={{
                borderRadius: "10px",
                border: `1px solid ${colors.border}`,
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
              }}
            />
            <Legend iconType="circle" wrapperStyle={{ fontSize: 13, color: colors.textMuted }} />
            <Line type="monotone" dataKey="newOrgs" name="New Organizations" stroke={colors.primary} strokeWidth={2.5} dot={{ r: 3, fill: colors.primary }} activeDot={{ r: 5 }} />
            <Line type="monotone" dataKey="renewals" name="Renewals" stroke={colors.info} strokeWidth={2.5} dot={{ r: 3, fill: colors.info }} activeDot={{ r: 5 }} />
            <Line type="monotone" dataKey="cancellations" name="Cancellations" stroke={colors.error} strokeWidth={2.5} dot={{ r: 3, fill: colors.error }} activeDot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}