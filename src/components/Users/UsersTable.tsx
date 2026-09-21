import { Link } from "react-router-dom";
import type { UserRecord } from "../../services/usersAdminService";
import { statusBadgeClass } from "../../lib/statusStyles";

export default function UsersTable({ users, organizationNames }: {
  users: UserRecord[];
  organizationNames: Map<string, string>;
}) {
  return <div className="surface-card-static overflow-x-auto">
    <table className="w-full min-w-[760px] text-left">
      <thead><tr className="table-head-row">
        <th className="table-head-cell rounded-tl-xl">User</th>
        <th className="table-head-cell">Organization</th>
        <th className="table-head-cell">Phone</th>
        <th className="table-head-cell">Enrollment</th>
        <th className="table-head-cell rounded-tr-xl">Status</th>
      </tr></thead>
      <tbody>
        {users.length === 0 && <tr><td colSpan={5} className="px-5 py-10 text-center text-base text-text-muted">No users found.</td></tr>}
        {users.map((user) => <tr key={user.id} className="table-row">
          <td className="table-cell">
            <p className="font-medium text-text-primary">{user.name}</p>
            <p className="text-sm text-text-muted">{user.email}</p>
          </td>
          <td className="table-cell">
            <Link to={`/organizations/${user.organizationId}`} className="text-primary hover:underline">
              {organizationNames.get(user.organizationId) ?? user.organizationId}
            </Link>
          </td>
          <td className="table-cell">{user.phone || "—"}</td>
          <td className="table-cell">{user.enrolled ? "Enrolled" : "Not enrolled"}</td>
          <td className="table-cell"><span className={statusBadgeClass(user.status)}>{user.status}</span></td>
        </tr>)}
      </tbody>
    </table>
  </div>;
}
