/**
 * FILE: components/Dashboard/CalendarWidget.tsx
 * Purpose: Shared UI/data logic for the Master Admin application.
 * NOTE: Keep presentation unchanged when refactoring; move repeated logic into reusable modules.
 */
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];
const HIGHLIGHTED_DATES = [5, 12, 18, 23];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

export default function CalendarWidget() {
  const today = new Date();
  const [viewDate, setViewDate] = useState(new Date());
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const monthLabel = viewDate.toLocaleString("default", { month: "long", year: "numeric" });

  const goToPrevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const goToNextMonth = () => setViewDate(new Date(year, month + 1, 1));
  const isToday = (day: number) => day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
  const isHighlighted = (day: number) => HIGHLIGHTED_DATES.includes(day);

  const blanks = Array.from({ length: firstDay });
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-text-primary">{monthLabel}</h2>
        <div className="flex items-center gap-1">
          <button onClick={goToPrevMonth} className="flex h-7 w-7 items-center justify-center rounded-md text-text-muted hover:bg-primary-light">
            <ChevronLeft size={16} />
          </button>
          <button onClick={goToNextMonth} className="flex h-7 w-7 items-center justify-center rounded-md text-text-muted hover:bg-primary-light">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="mb-2 grid grid-cols-7 text-center text-xs font-medium text-text-muted">
        {WEEKDAYS.map((d, i) => <span key={i}>{d}</span>)}
      </div>

      <div className="grid grid-cols-7 gap-y-1 text-center text-base">
        {blanks.map((_, i) => <span key={`blank-${i}`} />)}
        {days.map((day) => (
          <div key={day} className="flex items-center justify-center py-1">
            <span className={`flex h-7 w-7 items-center justify-center rounded-full ${
              isToday(day) ? "bg-primary font-semibold text-white" : isHighlighted(day) ? "font-medium text-primary" : "text-text-primary"
            }`}>
              {day}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-4 border-t border-border pt-4 text-xs text-text-muted">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-primary" />
          <span>Today</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full border border-primary" />
          <span>Activity</span>
        </div>
      </div>
    </div>
  );
}