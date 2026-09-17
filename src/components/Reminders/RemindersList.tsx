/**
 * FILE: components/Reminders/RemindersList.tsx
 * Purpose: Shared UI/data logic for the Master Admin application.
 * NOTE: Keep presentation unchanged when refactoring; move repeated logic into reusable modules.
 */
import {
  CreditCard,
  AlertTriangle,
  UserPlus,
  Bell,
  Check,
  Clock,
  X,
  type LucideIcon,
} from "lucide-react";
import { colors } from "../../styles/theme";
import { statusBadgeClass } from "../../lib/statusStyles";

export type { Reminder } from "../../types";
import type { Reminder } from "../../types";

const typeConfig: Record<Reminder["type"], { icon: LucideIcon; color: string; bg: string }> = {
  Renewal: { icon: CreditCard, color: colors.primary, bg: colors.primaryLight },
  Trial: { icon: AlertTriangle, color: colors.warning, bg: colors.warningBg },
  Approval: { icon: UserPlus, color: colors.info, bg: colors.infoBg },
  Payment: { icon: Bell, color: colors.error, bg: colors.errorBg },
};

interface RemindersListProps {
  reminders: Reminder[];
  onResolve: (id: string) => void;
  onSnooze: (id: string) => void;
  onDismiss: (id: string) => void;
}

export default function RemindersList({ reminders, onResolve, onSnooze, onDismiss }: RemindersListProps) {
  if (reminders.length === 0) {
    return <div className="empty-state">No reminders found.</div>;
  }

  return (
    <div className="space-y-3">
      {reminders.map((reminder) => {
        const config = typeConfig[reminder.type];
        const Icon = config.icon;
        const isResolved = reminder.status === "Resolved";

        return (
          <div
            key={reminder.id}
            className={`surface-card-static flex items-center gap-4 p-4 ${isResolved ? "opacity-60" : ""}`}
          >
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg"
              style={{ backgroundColor: config.bg, color: config.color }}
            >
              <Icon size={19} strokeWidth={1.8} />
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-base font-medium text-text-primary">{reminder.title}</p>
              <p className="truncate text-sm text-text-muted">{reminder.subtitle}</p>
            </div>

            <span className="shrink-0 text-sm text-text-muted">{reminder.dueLabel}</span>

            <span className={statusBadgeClass(reminder.status)}>{reminder.status}</span>

            {!isResolved && (
              <div className="flex shrink-0 items-center gap-1">
                <button onClick={() => onResolve(reminder.id)} title="Mark Resolved" className="btn-ghost rounded-md p-2">
                  <Check size={16} />
                </button>
                <button onClick={() => onSnooze(reminder.id)} title="Snooze" className="btn-ghost rounded-md p-2 hover:text-warning">
                  <Clock size={16} />
                </button>
                <button onClick={() => onDismiss(reminder.id)} title="Dismiss" className="btn-ghost rounded-md p-2 hover:text-error">
                  <X size={16} />
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}