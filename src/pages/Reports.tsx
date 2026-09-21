import { useEffect, useState } from "react";
import ReportsFilters from "../components/Reports/ReportsFilters";
import RevenueChart from "../components/Reports/RevenueChart";
import PlanDistribution from "../components/Reports/PlanDistribution";
import TopOrganizations from "../components/Reports/TopOrganizations";
import { getApiErrorMessage } from "../services/apiClient";
import {
  exportReport, getPlanDistribution, getRevenueReport, getTopOrganizations,
} from "../services/reportsService";
import type {
  ReportPeriod, RevenueReport, PlanDistributionItem, TopOrganizationItem,
} from "../services/reportsService";

interface Resource<T> { data: T | null; error: string; loading: boolean }
const initial = <T,>(): Resource<T> => ({ data: null, error: "", loading: true });

function SectionState({ title, loading, error }: { title: string; loading: boolean; error: string }) {
  return <div className="rounded-2xl border border-border bg-white p-5 shadow-sm" role={error ? "alert" : "status"}>
    <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
    <p className="mt-2 text-sm text-text-muted">{loading ? "Loading…" : error || "No data available."}</p>
  </div>;
}

export default function Reports() {
  const [period, setPeriod] = useState<ReportPeriod>("6m");
  const [revenue, setRevenue] = useState<Resource<RevenueReport>>(initial);
  const [distribution, setDistribution] = useState<Resource<PlanDistributionItem[]>>(initial);
  const [top, setTop] = useState<Resource<TopOrganizationItem[]>>(initial);
  const [reload, setReload] = useState(0);
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    getRevenueReport(period, controller.signal).then((data) => {
      if (!controller.signal.aborted) setRevenue({ data, error: "", loading: false });
    }).catch((error: unknown) => {
      if (!controller.signal.aborted) setRevenue({ data: null, error: getApiErrorMessage(error, "Could not load revenue."), loading: false });
    });
    return () => controller.abort();
  }, [period, reload]);

  useEffect(() => {
    const controller = new AbortController();
    getPlanDistribution(controller.signal).then((data) => {
      if (!controller.signal.aborted) setDistribution({ data, error: "", loading: false });
    }).catch((error: unknown) => {
      if (!controller.signal.aborted) setDistribution({ data: null, error: getApiErrorMessage(error, "Could not load plan distribution."), loading: false });
    });
    getTopOrganizations(controller.signal).then((data) => {
      if (!controller.signal.aborted) setTop({ data, error: "", loading: false });
    }).catch((error: unknown) => {
      if (!controller.signal.aborted) setTop({ data: null, error: getApiErrorMessage(error, "Could not load top organizations."), loading: false });
    });
    return () => controller.abort();
  }, [reload]);

  const handleExport = async () => {
    if (exporting) return;
    setExporting(true);
    setExportError("");
    try {
      await exportReport(period);
    } catch (error) {
      setExportError(getApiErrorMessage(error, "Could not export the report."));
    } finally {
      setExporting(false);
    }
  };

  const retry = () => {
    setRevenue(initial()); setDistribution(initial()); setTop(initial());
    setReload((value) => value + 1);
  };

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="page-title">Reports</h1>
          <p className="section-subtitle">Platform-wide analytics and performance insights.</p>
        </div>
        <button type="button" onClick={retry} className="rounded-lg border border-border bg-white px-3 py-2 text-sm text-text-muted hover:bg-primary-light">Refresh</button>
      </div>

      <div className="mt-6">
        <ReportsFilters period={period} onPeriodChange={(value) => { setPeriod(value); setRevenue(initial()); setExportError(""); }} onExport={handleExport} exporting={exporting} />
        {exportError && <p role="alert" className="mb-4 rounded-lg border border-error bg-error-bg px-4 py-2 text-sm text-error">{exportError}</p>}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {revenue.data ? <RevenueChart report={revenue.data} /> : <SectionState title="Platform Revenue" loading={revenue.loading} error={revenue.error} />}
          </div>
          <div className="lg:col-span-1">
            {distribution.data ? <PlanDistribution data={distribution.data} /> : <SectionState title="Plan Distribution" loading={distribution.loading} error={distribution.error} />}
          </div>
        </div>

        <div className="mt-6">
          {top.data ? <TopOrganizations data={top.data} /> : <SectionState title="Top Organizations by Revenue" loading={top.loading} error={top.error} />}
        </div>
      </div>
    </div>
  );
}
