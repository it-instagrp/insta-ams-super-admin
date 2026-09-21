import { apiClient } from "./apiClient";

export interface ReminderRecord {
  id: string;
  type: string;
  title: string;
  subtitle: string;
  dueLabel: string;
  status: string;
}

interface ApiReminder {
  id?: string | number;
  _id?: string | number;
  type?: string | null;
  category?: string | null;
  title?: string | null;
  message?: string | null;
  subtitle?: string | null;
  description?: string | null;
  organization_name?: string | null;
  due_label?: string | null;
  due_date?: string | null;
  time?: string | null;
  status?: string | null;
}

function mapReminder(item: ApiReminder): ReminderRecord {
  const rawId = item?.id ?? item?._id;
  if (typeof rawId !== "string" && typeof rawId !== "number") {
    throw new Error("A reminder is missing its ID.");
  }
  const title = item.title ?? item.message;
  if (typeof title !== "string" || !title.trim()) {
    throw new Error("A reminder is missing its title.");
  }
  const type = item.type ?? item.category ?? "";
  const status = item.status ?? "";
  const knownTypes: Record<string, string> = { renewal: "Renewal", trial: "Trial", approval: "Approval", payment: "Payment" };
  const knownStatuses: Record<string, string> = { open: "Open", snoozed: "Snoozed", resolved: "Resolved" };
  return {
    id: String(rawId),
    type: knownTypes[type.toLowerCase()] ?? type,
    title,
    subtitle: item.subtitle ?? item.description ?? item.organization_name ?? "",
    dueLabel: item.due_label ?? item.time ?? item.due_date ?? "",
    status: knownStatuses[status.toLowerCase()] ?? status,
  };
}

export interface ReminderQuery { search: string; type: string; status: string }

export async function listReminders(query: ReminderQuery, signal?: AbortSignal): Promise<ReminderRecord[]> {
  const { data } = await apiClient.get<{ data: ApiReminder[] }>("reminders", { params: query, signal });
  if (!Array.isArray(data?.data)) throw new Error("The reminders response is invalid.");
  return data.data.map(mapReminder);
}

export async function resolveReminder(id: string): Promise<void> {
  await apiClient.patch(`reminders/${encodeURIComponent(id)}/resolve`);
}

export async function snoozeReminder(id: string): Promise<void> {
  await apiClient.patch(`reminders/${encodeURIComponent(id)}/snooze`);
}

export async function deleteReminder(id: string): Promise<void> {
  await apiClient.delete(`reminders/${encodeURIComponent(id)}`);
}
