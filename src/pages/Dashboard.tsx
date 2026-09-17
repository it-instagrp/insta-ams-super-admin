/**
 * FILE: pages/Dashboard.tsx
 * Purpose: Shared UI/data logic for the Master Admin application.
 * NOTE: Keep presentation unchanged when refactoring; move repeated logic into reusable modules.
 */
import { Building2, Activity, CreditCard, Users } from "lucide-react";
import StatCard from "../components/Dashboard/StatCard";
import PlatformOverview from "../components/Dashboard/PlatformOverview";
import PlatformStatus from "../components/Dashboard/PlatformStatus";
import WeeklyTrends from "../components/Dashboard/WeeklyTrends";
import CalendarWidget from "../components/Dashboard/CalendarWidget";
import ReminderPipeline from "../components/Dashboard/ReminderPipeline";
import { colors } from "../styles/theme";

// Total active users = sum of all users across all active orgs, broken down by industry
import { activeUsersBreakdown } from "../data/dashboardData";

const TOTAL_ACTIVE_USERS = activeUsersBreakdown.reduce((s, i) => s + i.count, 0);

export default function Dashboard() {
  return (
    <div>
      <h1 className="page-title">Dashboard</h1>
      <p className="section-subtitle">Welcome to the Master Admin Control Center.</p>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Organizations"
          value="248"
          change="+12.5%"
          icon={Building2}
        />
        <StatCard
          title="Active Organizations"
          value="219"
          change="+8.2%"
          icon={Activity}
        />
        <StatCard
          title="Active Memberships"
          value="203"
          change="+6.8%"
          icon={CreditCard}
        />
        <StatCard
          title="Total Active Users"
          value={TOTAL_ACTIVE_USERS.toLocaleString()}
          change="+9.4%"
          icon={Users}
          iconColor={colors.info}
          iconBackground={colors.infoBg}
          positive={true}
        />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <PlatformOverview />
          <PlatformStatus />
          <WeeklyTrends />
        </div>
        <div className="space-y-4 lg:col-span-1">
          <CalendarWidget />
          <ReminderPipeline />
        </div>
      </div>
    </div>
  );
}