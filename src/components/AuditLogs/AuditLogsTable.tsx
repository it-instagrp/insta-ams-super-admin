/**
 * FILE: components/AuditLogs/AuditLogsTable.tsx
 * Purpose: Shared UI/data logic for the Master Admin application.
 * NOTE: Keep presentation unchanged when refactoring; move repeated logic into reusable modules.
 */
// src/components/AuditLogs/AuditLogsTable.tsx
import {
  Building2,
  UserCog,
  CreditCard,
  ShieldAlert,
  type LucideIcon,
} from "lucide-react";
import { colors } from "../../styles/theme";

export type { AuditLogEntry } from "../../types";
import type { AuditLogEntry } from "../../types";

const categoryConfig: Record<AuditLogEntry["category"], { icon: LucideIcon; color: string; bg: string }> = {
  Organization: { icon: Building2, color: colors.primary, bg: colors.primaryLight },
  User: { icon: UserCog, color: colors.info, bg: colors.infoBg },
  License: { icon: CreditCard, color: colors.warning, bg: colors.warningBg },
  Billing: { icon: CreditCard, color: colors.warning, bg: colors.warningBg },
  Security: { icon: ShieldAlert, color: colors.error, bg: colors.errorBg },
};

interface AuditLogsTableProps {
  logs: AuditLogEntry[];
}

export default function AuditLogsTable({ logs }: AuditLogsTableProps) {
  return (
    <div className="surface-card-static overflow-hidden">
      <table className="w-full text-left">
        <thead>
          <tr className="table-head-row">
            <th className="table-head-cell rounded-tl-xl">Action</th>
            <th className="table-head-cell">Actor</th>
            <th className="table-head-cell">Target</th>
            <th className="table-head-cell">Timestamp</th>
            <th className="table-head-cell rounded-tr-xl">IP Address</th>
          </tr>
        </thead>

        <tbody>
          {logs.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-5 py-10 text-center text-base text-text-muted">
                No audit log entries found.
              </td>
            </tr>
          ) : (
            logs.map((log) => {
              const config = categoryConfig[log.category];
              const Icon = config.icon;
              return (
                <tr key={log.id} className="table-row">
                  <td className="table-cell">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                        style={{ backgroundColor: config.bg, color: config.color }}
                      >
                        <Icon size={15} strokeWidth={1.8} />
                      </div>
                      <div>
                        <p className="text-base font-medium text-text-primary">{log.action}</p>
                        <p className="text-sm text-text-muted">{log.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="table-cell">{log.actor}</td>
                  <td className="table-cell">{log.target}</td>
                  <td className="table-cell">{log.timestamp}</td>
                  <td className="px-5 py-4 text-sm text-text-muted">{log.ipAddress}</td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}