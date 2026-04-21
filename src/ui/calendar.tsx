import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../utils/cn";

// Lightweight month-grid calendar. Built in-place so the library has no
// react-day-picker peer dep. Supports keyboard-free point-and-click date
// selection, month navigation, today highlight, and out-of-month fading.

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"] as const;

interface CalendarProps {
  /** YYYY-MM-DD — selected date, controlled. */
  value?: string;
  onChange: (date: string) => void;
  className?: string;
}

function parseISO(value: string | undefined): Date {
  if (!value) return new Date();
  const [y, m, d] = value.split("-").map(Number);
  if (!y || !m || !d) return new Date();
  return new Date(y, m - 1, d);
}

function toISO(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
}

function sameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function Calendar({ value, onChange, className }: CalendarProps) {
  const selected = value ? parseISO(value) : null;
  const [cursor, setCursor] = React.useState(() =>
    selected ? new Date(selected) : new Date(),
  );
  const today = new Date();
  const firstOfMonth = new Date(
    cursor.getFullYear(),
    cursor.getMonth(),
    1,
  );
  const startWeekday = firstOfMonth.getDay();
  const gridStart = new Date(firstOfMonth);
  gridStart.setDate(firstOfMonth.getDate() - startWeekday);

  const days: Date[] = Array.from({ length: 42 }, (_, i) => {
    const d = new Date(gridStart);
    d.setDate(gridStart.getDate() + i);
    return d;
  });

  const monthLabel = cursor.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  return (
    <div
      data-slot="calendar"
      className={cn("p-3 text-sm text-foreground", className)}
    >
      <div className="mb-2 flex items-center justify-between">
        <button
          type="button"
          aria-label="Previous month"
          className="inline-flex h-7 w-7 items-center justify-center rounded-md hover:bg-accent"
          onClick={() =>
            setCursor(
              new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1),
            )
          }
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="font-medium">{monthLabel}</div>
        <button
          type="button"
          aria-label="Next month"
          className="inline-flex h-7 w-7 items-center justify-center rounded-md hover:bg-accent"
          onClick={() =>
            setCursor(
              new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1),
            )
          }
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
      <div className="grid grid-cols-7 text-[11px] text-muted-foreground">
        {WEEKDAYS.map((w) => (
          <div key={w} className="py-1 text-center">
            {w}
          </div>
        ))}
      </div>
      <div role="grid" className="grid grid-cols-7">
        {days.map((d, i) => {
          const isCurrentMonth = d.getMonth() === cursor.getMonth();
          const isSelected = selected ? sameDay(d, selected) : false;
          const isToday = sameDay(d, today);
          return (
            <button
              key={i}
              type="button"
              role="gridcell"
              aria-selected={isSelected}
              onClick={() => onChange(toISO(d))}
              className={cn(
                "relative inline-flex h-8 w-8 items-center justify-center rounded-md text-sm",
                !isCurrentMonth && "text-muted-foreground/50",
                !isSelected && "hover:bg-accent",
                isSelected && "bg-primary text-primary-foreground",
                isToday &&
                  !isSelected &&
                  "outline outline-1 outline-primary/40",
              )}
            >
              {d.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}
