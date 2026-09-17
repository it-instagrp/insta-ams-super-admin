/** Dashboard development data. Replace these arrays with backend responses later. */
import { AlertTriangle, Bell, CreditCard, UserPlus } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { colors } from "../styles/theme";

export const activeUsersBreakdown = [
  { label: "Manufacturing", count: 3240, color: colors.primary },
  { label: "Retail & E-commerce", count: 2810, color: colors.info },
  { label: "Logistics & Supply Chain", count: 2190, color: colors.warning },
  { label: "Technology", count: 1870, color: colors.purple },
  { label: "Healthcare", count: 1950, color: colors.error },
];

export const platformOverviewData = [
  { month: "Jan", organizations: 120, memberships: 94 },
  { month: "Feb", organizations: 145, memberships: 108 },
  { month: "Mar", organizations: 160, memberships: 121 },
  { month: "Apr", organizations: 185, memberships: 139 },
  { month: "May", organizations: 210, memberships: 158 },
  { month: "Jun", organizations: 235, memberships: 176 },
];

export const platformStatusData = [
  { label: "Active", count: 219, percentage: 88, color: colors.primary },
  { label: "Trial", count: 18, percentage: 7, color: colors.warning },
  { label: "Pending Renewal", count: 8, percentage: 3, color: colors.info },
  { label: "Suspended", count: 3, percentage: 2, color: colors.error },
];

export const weeklyTrendsData = [
  { day: "Mon", newOrgs: 4, renewals: 6, cancellations: 1 },
  { day: "Tue", newOrgs: 6, renewals: 8, cancellations: 0 },
  { day: "Wed", newOrgs: 3, renewals: 5, cancellations: 2 },
  { day: "Thu", newOrgs: 8, renewals: 9, cancellations: 1 },
  { day: "Fri", newOrgs: 5, renewals: 7, cancellations: 0 },
  { day: "Sat", newOrgs: 2, renewals: 3, cancellations: 1 },
  { day: "Sun", newOrgs: 1, renewals: 2, cancellations: 0 },
];

export interface DashboardReminder {
  id: number; title: string; subtitle: string; time: string;
  icon: LucideIcon; iconColor: string; iconBackground: string;
}

export const dashboardReminders: DashboardReminder[] = [
  { id: 1, title: "Subscription renewal due", subtitle: "Acme Corp — Enterprise plan", time: "Today", icon: CreditCard, iconColor: colors.primary, iconBackground: colors.primaryLight },
  { id: 2, title: "Trial ending soon", subtitle: "Nimbus Retail — 3 days left", time: "Tomorrow", icon: AlertTriangle, iconColor: colors.warning, iconBackground: colors.warningBg },
  { id: 3, title: "New organization pending approval", subtitle: "Bluepeak Logistics", time: "2 days", icon: UserPlus, iconColor: colors.info, iconBackground: colors.infoBg },
  { id: 4, title: "Payment failed", subtitle: "Orbit Solutions — retry required", time: "3 days", icon: Bell, iconColor: colors.error, iconBackground: colors.errorBg },
];
