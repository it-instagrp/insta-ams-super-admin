/**
 * FILE: components/Dashboard/ReminderPipeline.tsx
 * Purpose: Shared UI/data logic for the Master Admin application.
 * NOTE: Keep presentation unchanged when refactoring; move repeated logic into reusable modules.
 */

import { dashboardReminders } from "../../data/dashboardData";

export default function ReminderPipeline() {
  return (
    <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-text-primary">Reminders</h2>
        <button className="text-sm font-medium text-primary hover:underline">View all</button>
      </div>

      <div className="space-y-4">
        {dashboardReminders.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.id} className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: item.iconBackground, color: item.iconColor }}>
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