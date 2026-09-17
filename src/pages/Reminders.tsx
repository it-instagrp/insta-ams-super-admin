/**
 * FILE: pages/Reminders.tsx
 * Purpose: Shared UI/data logic for the Master Admin application.
 * NOTE: Keep presentation unchanged when refactoring; move repeated logic into reusable modules.
 */
// src/pages/Reminders.tsx
import { useMemo, useState } from "react";
import RemindersFilters from "../components/Reminders/RemindersFilters";
import RemindersList from "../components/Reminders/RemindersList";

import { initialReminders } from "../data/reminderData";
import type { Reminder } from "../types";

export default function Reminders() {
  const [reminders, setReminders] = useState<Reminder[]>(initialReminders);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const filteredReminders = useMemo(() => {
    const query = search.trim().toLowerCase();
    return reminders.filter((reminder) => {
      const matchesSearch =
        !query ||
        reminder.title.toLowerCase().includes(query) ||
        reminder.subtitle.toLowerCase().includes(query);
      const matchesType = !typeFilter || reminder.type === typeFilter;
      const matchesStatus = !statusFilter || reminder.status === statusFilter;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [reminders, search, typeFilter, statusFilter]);

  const handleResolve = (id: string) => {
    setReminders((prev) => prev.map((r) => (r.id === id ? { ...r, status: "Resolved" } : r)));
  };

  const handleSnooze = (id: string) => {
    setReminders((prev) => prev.map((r) => (r.id === id ? { ...r, status: "Snoozed" } : r)));
  };

  const handleDismiss = (id: string) => {
    setReminders((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div>
      <h1 className="page-title">Reminders</h1>
      <p className="section-subtitle">
        Stay on top of renewals, approvals, and account issues across the platform.
      </p>

      <div className="mt-6">
        <RemindersFilters
          search={search}
          onSearchChange={setSearch}
          type={typeFilter}
          onTypeChange={setTypeFilter}
          status={statusFilter}
          onStatusChange={setStatusFilter}
        />
        <RemindersList
          reminders={filteredReminders}
          onResolve={handleResolve}
          onSnooze={handleSnooze}
          onDismiss={handleDismiss}
        />
      </div>
    </div>
  );
}