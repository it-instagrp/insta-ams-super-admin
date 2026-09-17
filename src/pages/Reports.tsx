/**
 * FILE: pages/Reports.tsx
 * Purpose: Shared UI/data logic for the Master Admin application.
 * NOTE: Keep presentation unchanged when refactoring; move repeated logic into reusable modules.
 */
import ReportsFilters from "../components/Reports/ReportsFilters";
import RevenueChart from "../components/Reports/RevenueChart";
import PlanDistribution from "../components/Reports/PlanDistribution";
import TopOrganizations from "../components/Reports/TopOrganizations";

export default function Reports() {
  return (
    <div>
      <h1 className="page-title">Reports</h1>
      <p className="section-subtitle">Platform-wide analytics and performance insights.</p>

      <div className="mt-6">
        <ReportsFilters />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <RevenueChart />
          </div>
          <div className="lg:col-span-1">
            <PlanDistribution />
          </div>
        </div>

        <div className="mt-6">
          <TopOrganizations />
        </div>
      </div>
    </div>
  );
}