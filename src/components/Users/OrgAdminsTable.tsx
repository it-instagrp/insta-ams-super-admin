/**
 * FILE: components/Users/OrgAdminsTable.tsx
 * Purpose: Shared UI/data logic for the Master Admin application.
 * NOTE: Keep presentation unchanged when refactoring; move repeated logic into reusable modules.
 */
import { MoreVertical, Ban, Trash2, KeyRound, CheckCircle2, Mail } from "lucide-react";
import { useState } from "react";
import type { AdminRecord } from "../../services/usersAdminService";
import { statusBadgeClass } from "../../lib/statusStyles";

interface OrgAdminsTableProps {
  admins: AdminRecord[];
  onResetPassword: (admin: AdminRecord) => void;
  onToggleSuspend: (admin: AdminRecord) => void;
  onRemove: (admin: AdminRecord) => void;
}

export default function OrgAdminsTable({
  admins,
  onResetPassword,
  onToggleSuspend,
  onRemove,
}: OrgAdminsTableProps) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [menuDirection, setMenuDirection] = useState<"down" | "up">("down");

  const closeMenu = () => setOpenMenuId(null);
  const MENU_HEIGHT_ESTIMATE = 150;

  const handleToggleMenu = (id: string, e: React.MouseEvent<HTMLButtonElement>) => {
    if (openMenuId === id) {
      closeMenu();
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    setMenuDirection(spaceBelow < MENU_HEIGHT_ESTIMATE ? "up" : "down");
    setOpenMenuId(id);
  };

  return (
    <div className="surface-card-static overflow-hidden">
      <table className="w-full text-left">
        <thead>
          <tr className="table-head-row">
            <th className="table-head-cell rounded-tl-xl">Name</th>
            <th className="table-head-cell">Organization</th>
            <th className="table-head-cell">Status</th>
            <th className="table-head-cell">Last Active</th>
            <th className="table-head-cell rounded-tr-xl text-right">Actions</th>
          </tr>
        </thead>

        <tbody>
          {admins.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-5 py-10 text-center text-base text-text-muted">
                No administrators found.
              </td>
            </tr>
          ) : (
            admins.map((admin) => (
              <tr key={admin.id} className="table-row">
                <td className="table-cell">
                  <p className="text-base font-medium text-text-primary">{admin.name}</p>
                  <p className="text-sm text-text-muted">{admin.email}</p>
                </td>
                <td className="table-cell">{admin.organizationName}</td>
                <td className="table-cell">
                  <span className={statusBadgeClass(admin.status)}>{admin.status}</span>
                </td>
                <td className="table-cell">{admin.lastActive && !Number.isNaN(new Date(admin.lastActive).getTime()) ? new Date(admin.lastActive).toLocaleString() : "—"}</td>
                <td className="relative table-cell text-right">
                  <div className="flex items-center justify-end gap-1">
                    <a href={`mailto:${admin.email}`} title="Contact Admin" className="rounded-md p-1.5 text-text-muted hover:bg-primary-light hover:text-primary-dark">
                      <Mail size={16} />
                    </a>
                    <button onClick={(e) => handleToggleMenu(admin.id, e)} className="rounded-md p-1.5 text-text-muted hover:bg-primary-light hover:text-primary-dark">
                      <MoreVertical size={16} />
                    </button>
                  </div>

                  {openMenuId === admin.id && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={closeMenu} />
                      <div
                        className={`absolute right-5 z-50 w-44 rounded-lg border border-border bg-white py-1 shadow-[var(--shadow-raised)] ${
                          menuDirection === "up" ? "bottom-11" : "top-11"
                        }`}
                      >
                        <button onClick={() => { onResetPassword(admin); closeMenu(); }} className="flex w-full items-center gap-2 px-3 py-2 text-left text-base text-text-primary hover:bg-primary-light">
                          <KeyRound size={14} /> Reset Password
                        </button>
                        <button
                          onClick={() => { onToggleSuspend(admin); closeMenu(); }}
                          className={`flex w-full items-center gap-2 px-3 py-2 text-left text-base hover:bg-primary-light ${
                            admin.status === "Suspended" ? "text-success" : "text-warning"
                          }`}
                        >
                          {admin.status === "Suspended" ? <CheckCircle2 size={14} /> : <Ban size={14} />}
                          {admin.status === "Suspended" ? "Activate" : "Suspend"}
                        </button>
                        <button onClick={() => { onRemove(admin); closeMenu(); }} className="flex w-full items-center gap-2 px-3 py-2 text-left text-base text-error hover:bg-primary-light">
                          <Trash2 size={14} /> Remove
                        </button>
                      </div>
                    </>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
