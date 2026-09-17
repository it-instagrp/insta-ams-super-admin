/**
 * FILE: lib/billingCycle.ts
 * Purpose: Shared UI/data logic for the Master Admin application.
 * NOTE: Keep presentation unchanged when refactoring; move repeated logic into reusable modules.
 */
export type BillingCycle = "Monthly" | "Quarterly" | "Yearly";

export function addBillingCycle(date: Date, cycle: BillingCycle): Date {
  const result = new Date(date);
  if (cycle === "Monthly") result.setMonth(result.getMonth() + 1);
  else if (cycle === "Quarterly") result.setMonth(result.getMonth() + 3);
  else result.setFullYear(result.getFullYear() + 1);
  return result;
}

export function formatDisplayDate(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}