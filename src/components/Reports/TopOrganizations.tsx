/**
 * FILE: components/Reports/TopOrganizations.tsx
 * Purpose: Shared UI/data logic for the Master Admin application.
 * NOTE: Keep presentation unchanged when refactoring; move repeated logic into reusable modules.
 */
import type { TopOrganizationItem } from "../../services/reportsService";

export default function TopOrganizations({ data }: { data: TopOrganizationItem[] }) {
  const formatCurrency = (value: number, currency: string) => new Intl.NumberFormat(undefined, {
    style: "currency", currency, maximumFractionDigits: 0,
  }).format(value);
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
          {data.length === 0 && <tr><td colSpan={4} className="px-5 py-10 text-center text-sm text-text-muted">No organizations to show.</td></tr>}
          {data.map((org) => (
            <tr key={org.id} className="table-row">
              <td className="table-cell-primary">{org.name}</td>
              <td className="table-cell">{org.plan}</td>
              <td className="table-cell">{formatCurrency(org.revenue, org.currency)}</td>
              <td className="px-5 py-4 text-right">
                <span className={`text-sm font-semibold ${org.growth === null ? "text-text-muted" : String(org.growth).startsWith("-") ? "text-error" : "text-success"}`}>
                  {org.growth === null ? "—" : typeof org.growth === "number" ? `${org.growth > 0 ? "+" : ""}${org.growth}%` : org.growth}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
