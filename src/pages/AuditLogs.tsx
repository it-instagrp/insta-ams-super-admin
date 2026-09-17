/**
 * FILE: pages/AuditLogs.tsx
 * Purpose: Shared UI/data logic for the Master Admin application.
 * NOTE: Keep presentation unchanged when refactoring; move repeated logic into reusable modules.
 */
// src/pages/AuditLogs.tsx
import { useMemo, useState } from "react";
import AuditLogsFilters from "../components/AuditLogs/AuditLogsFilters";
import AuditLogsTable from "../components/AuditLogs/AuditLogsTable";

import { mockAuditLogs } from "../data/auditData";

const REFERENCE_DATE = new Date(2026, 7, 27);

function parseLogDate(timestamp: string): Date {
  if (timestamp.startsWith("Today")) return new Date(REFERENCE_DATE);
  if (timestamp.startsWith("Yesterday")) {
    const d = new Date(REFERENCE_DATE);
    d.setDate(d.getDate() - 1);
    return d;
  }
  const datePart = timestamp.split(",").slice(0, 2).join(",").trim();
  const parsed = new Date(datePart);
  return isNaN(parsed.getTime()) ? new Date(REFERENCE_DATE) : parsed;
}

function isWithinRange(timestamp: string, range: string): boolean {
  if (!range || range === "All time") return true;
  const days = range === "Last 7 days" ? 7 : range === "Last 30 days" ? 30 : range === "Last 90 days" ? 90 : Infinity;
  const logDate = parseLogDate(timestamp);
  const diffDays = (REFERENCE_DATE.getTime() - logDate.getTime()) / (1000 * 60 * 60 * 24);
  return diffDays <= days;
}

export default function AuditLogs() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [actorFilter, setActorFilter] = useState("");
  const [dateRange, setDateRange] = useState("Last 7 days");

  const filteredLogs = useMemo(() => {
    const query = search.trim().toLowerCase();
    return mockAuditLogs.filter((log) => {
      const matchesSearch =
        !query ||
        log.actor.toLowerCase().includes(query) ||
        log.action.toLowerCase().includes(query) ||
        log.target.toLowerCase().includes(query);
      const matchesCategory = !categoryFilter || log.category === categoryFilter;
      const matchesActor = !actorFilter || log.actor === actorFilter;
      const matchesDate = isWithinRange(log.timestamp, dateRange);
      return matchesSearch && matchesCategory && matchesActor && matchesDate;
    });
  }, [search, categoryFilter, actorFilter, dateRange]);

  return (
    <div>
      <h1 className="page-title">Audit Logs</h1>
      <p className="section-subtitle">Track all administrative actions across the platform.</p>

      <div className="mt-6">
        <AuditLogsFilters
          search={search}
          onSearchChange={setSearch}
          category={categoryFilter}
          onCategoryChange={setCategoryFilter}
          actor={actorFilter}
          onActorChange={setActorFilter}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
        />
        <AuditLogsTable logs={filteredLogs} />
      </div>
    </div>
  );
}