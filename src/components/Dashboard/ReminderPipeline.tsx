/**
 * FILE: components/Dashboard/ReminderPipeline.tsx
 * Purpose: Shared UI/data logic for the Master Admin application.
 * NOTE: Keep presentation unchanged when refactoring; move repeated logic into reusable modules.
 */

import { Bell, CreditCard, AlertTriangle, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
import { colors } from "../../styles/theme";
import type { DashboardReminder } from "../../services/dashboardService";

export default function ReminderPipeline({ data }: { data: DashboardReminder[] }) {
  return (
    <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-text-primary">Reminders</h2>
        <Link to="/reminders" className="text-sm font-medium text-primary hover:underline">View all</Link>
      </div>

      <div className="space-y-4">
        {data.length === 0 && <p className="text-sm text-text-muted">No reminders right now.</p>}
        {data.map((item, index) => {
          const kind = item.type.toLowerCase();
          const Icon = kind.includes("renew") ? CreditCard : kind.includes("trial") ? AlertTriangle : kind.includes("approval") ? UserPlus : Bell;
          const iconColor = kind.includes("renew") ? colors.primary : kind.includes("trial") ? colors.warning : kind.includes("approval") ? colors.info : colors.error;
          return (
            <div key={item.id || index} className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: colors.primaryLight, color: iconColor }}>
                <Icon size={16} strokeWidth={1.8} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-base font-medium text-text-primary">{item.title}</p>
                <p className="truncate text-sm text-text-muted">{item.subtitle}</p>
              </div>
              <span className="shrink-0 text-xs text-text-muted">{item.time}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
