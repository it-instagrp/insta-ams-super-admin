import { useEffect, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import { Building2, Activity, CreditCard, Users, RefreshCw } from "lucide-react";
import StatCard from "../components/Dashboard/StatCard";
import PlatformOverview from "../components/Dashboard/PlatformOverview";
import PlatformStatus from "../components/Dashboard/PlatformStatus";
import WeeklyTrends from "../components/Dashboard/WeeklyTrends";
import CalendarWidget from "../components/Dashboard/CalendarWidget";
import ReminderPipeline from "../components/Dashboard/ReminderPipeline";
import { colors } from "../styles/theme";
import { getApiErrorMessage } from "../services/apiClient";
import {
  getDashboardStats, getPlatformOverview, getPlatformStatus,
  getWeeklyTrends, getDashboardReminders,
} from "../services/dashboardService";
import type {
  DashboardStats, OverviewPoint, StatusPoint, TrendPoint, DashboardReminder,
} from "../services/dashboardService";

interface Resource<T> { data: T | null; error: string | null; loading: boolean }
const initial = <T,>(): Resource<T> => ({ data: null, error: null, loading: true });

function fetchResource<T>(
  request: (signal: AbortSignal) => Promise<T>,
  signal: AbortSignal,
  set: Dispatch<SetStateAction<Resource<T>>>,
) {
  request(signal).then((data) => {
    if (!signal.aborted) set({ data, error: null, loading: false });
  }).catch((error: unknown) => {
    if (!signal.aborted) set({ data: null, error: getApiErrorMessage(error, "Could not load dashboard data."), loading: false });
  });
}

function SectionState({ title, resource }: { title: string; resource: Resource<unknown> }) {
  return (
    <div className="rounded-2xl border border-border bg-white p-5 shadow-sm" role={resource.error ? "alert" : "status"}>
      <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
      <p className="mt-2 text-sm text-text-muted">{resource.loading ? "Loading…" : resource.error ?? "No data available."}</p>
    </div>
  );
}

const formatCount = (value: number | undefined) => value === undefined ? "—" : value.toLocaleString();

export default function Dashboard() {
  const [stats, setStats] = useState<Resource<DashboardStats>>(initial);
  const [overview, setOverview] = useState<Resource<OverviewPoint[]>>(initial);
  const [status, setStatus] = useState<Resource<StatusPoint[]>>(initial);
  const [trends, setTrends] = useState<Resource<TrendPoint[]>>(initial);
  const [reminders, setReminders] = useState<Resource<DashboardReminder[]>>(initial);
  const [period, setPeriod] = useState("3m");
  const [reload, setReload] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    fetchResource(getDashboardStats, controller.signal, setStats);
    fetchResource(getPlatformStatus, controller.signal, setStatus);
    fetchResource(getWeeklyTrends, controller.signal, setTrends);
    fetchResource(getDashboardReminders, controller.signal, setReminders);
    return () => controller.abort();
  }, [reload]);

  useEffect(() => {
    const controller = new AbortController();
    fetchResource((signal) => getPlatformOverview(period, signal), controller.signal, setOverview);
    return () => controller.abort();
  }, [period, reload]);

  const retry = () => {
    setStats(initial()); setOverview(initial()); setStatus(initial());
    setTrends(initial()); setReminders(initial());
    setReload((value) => value + 1);
  };

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="section-subtitle">Welcome to the Master Admin Control Center.</p>
        </div>
        <button type="button" onClick={retry} className="flex items-center gap-2 rounded-lg border border-border bg-white px-3 py-2 text-sm text-text-muted hover:bg-primary-light">
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      {stats.error && <p role="alert" className="mt-4 rounded-lg border border-error bg-error-bg px-4 py-2 text-sm text-error">Stats: {stats.error}</p>}
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Organizations" value={formatCount(stats.data?.totalOrganizations)} icon={Building2} />
        <StatCard title="Active Organizations" value={formatCount(stats.data?.activeOrganizations)} icon={Activity} />
        <StatCard title="Active Memberships" value={formatCount(stats.data?.activeMemberships)} icon={CreditCard} />
        <StatCard title="Total Active Users" value={formatCount(stats.data?.totalActiveUsers)} icon={Users} iconColor={colors.info} iconBackground={colors.infoBg} />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {overview.data ? <PlatformOverview data={overview.data} period={period} onPeriodChange={(value) => { setPeriod(value); setOverview(initial()); }} /> : <SectionState title="Platform Overview" resource={overview} />}
          {status.data ? <PlatformStatus data={status.data} /> : <SectionState title="Platform Status" resource={status} />}
          {trends.data ? <WeeklyTrends data={trends.data} /> : <SectionState title="Weekly Platform Trends" resource={trends} />}
        </div>
        <div className="space-y-4 lg:col-span-1">
          <CalendarWidget />
          {reminders.data ? <ReminderPipeline data={reminders.data} /> : <SectionState title="Reminders" resource={reminders} />}
        </div>
      </div>
    </div>
  );
}
