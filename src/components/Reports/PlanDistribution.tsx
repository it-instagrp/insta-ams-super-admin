/**
 * FILE: components/Reports/PlanDistribution.tsx
 * Purpose: Shared UI/data logic for the Master Admin application.
 * NOTE: Keep presentation unchanged when refactoring; move repeated logic into reusable modules.
 */

import { planDistributionData } from "../../data/reportData";



export default function PlanDistribution() {
  return (
    <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-text-primary">Plan Distribution</h2>
        <p className="mt-1 text-sm text-text-muted">Organizations by subscription tier</p>
      </div>

      {/* Single plan — show as a full-width bar with label */}
      <div className="flex flex-col items-center justify-center py-8 gap-4">
        <div className="flex h-32 w-32 items-center justify-center rounded-full border-[10px] border-primary bg-primary-light">
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">{planDistributionData[0].value}</p>
            <p className="text-xs text-text-muted">orgs</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-primary" />
          <span className="text-base font-medium text-text-primary">Monthly</span>
          <span className="text-sm text-text-muted">— 100%</span>
        </div>
      </div>
    </div>
  );
}