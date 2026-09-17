/**
 * FILE: components/Reports/TopOrganizations.tsx
 * Purpose: Shared UI/data logic for the Master Admin application.
 * NOTE: Keep presentation unchanged when refactoring; move repeated logic into reusable modules.
 */
import { topOrganizationsData } from "../../data/reportData";

export default function TopOrganizations() {
  return (
    <div className="surface-card-static overflow-hidden">
      <div className="border-b border-border px-6 py-4">
        <h2 className="text-lg font-semibold text-text-primary">Top Organizations by Revenue</h2>
      </div>

      <table className="w-full text-left">
        <thead>
          <tr className="table-head-row">
            <th className="table-head-cell">Organization</th>
            <th className="table-head-cell">Plan</th>
            <th className="table-head-cell">Revenue</th>
            <th className="table-head-cell text-right">Growth</th>
          </tr>
        </thead>
        <tbody>
          {topOrganizationsData.map((org) => (
            <tr key={org.id} className="table-row">
              <td className="table-cell-primary">{org.name}</td>
              <td className="table-cell">{org.plan}</td>
              <td className="table-cell">{org.revenue}</td>
              <td className="px-5 py-4 text-right">
                <span className={`text-sm font-semibold ${org.growth.startsWith("-") ? "text-error" : "text-success"}`}>
                  {org.growth}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}