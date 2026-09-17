/** Reports development data. Replace with backend/report API responses later. */
import { colors } from "../styles/theme";

export const planDistributionData = [{ name: "Monthly", value: 248, color: colors.primary }];

export const revenueChartData = [
  { month: "Mar", revenue: 38400 }, { month: "Apr", revenue: 42100 },
  { month: "May", revenue: 45800 }, { month: "Jun", revenue: 51200 },
  { month: "Jul", revenue: 54900 }, { month: "Aug", revenue: 61300 },
];

export interface TopOrganizationReportItem {
  id: string; name: string; plan: string; revenue: string; growth: string;
}

export const topOrganizationsData: TopOrganizationReportItem[] = [
  { id: "1", name: "Vertex Manufacturing", plan: "Yearly", revenue: "$18,400", growth: "+12.4%" },
  { id: "2", name: "Acme Corp", plan: "Yearly", revenue: "$14,200", growth: "+8.1%" },
  { id: "3", name: "Orbit Solutions", plan: "Quarterly", revenue: "$6,800", growth: "+3.6%" },
  { id: "4", name: "Nimbus Retail", plan: "Quarterly", revenue: "$4,950", growth: "-1.2%" },
  { id: "5", name: "Bluepeak Logistics", plan: "Monthly", revenue: "$1,200", growth: "+0.4%" },
];
