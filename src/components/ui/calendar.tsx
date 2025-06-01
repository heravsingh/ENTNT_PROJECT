import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = {
  className?: string;
  selected?: Date;
  onSelect?: (date: Date) => void;
  showOutsideDays?: boolean;
  currentMonth?: Date;
  onMonthChange?: (date: Date) => void;
};

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export function Calendar({
  className,
  selected,
  onSelect,
  showOutsideDays = true,
  currentMonth = new Date(),
  onMonthChange,
  ...props
}: CalendarProps) {
  const [displayMonth, setDisplayMonth] = React.useState(currentMonth);

  const today = new Date();
  const year = displayMonth.getFullYear();
  const month = displayMonth.getMonth();

  // Get first day of month and calculate offset
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startOffset = firstDay.getDay(); // 0 = Sunday
  const daysInMonth = lastDay.getDate();

  // Generate calendar days
  const calendarDays = [];
  
  // Previous month days (if showOutsideDays)
  if (showOutsideDays && startOffset > 0) {
    const prevMonth = new Date(year, month - 1, 0);
    const prevMonthDays = prevMonth.getDate();
    for (let i = startOffset - 1; i >= 0; i--) {
      calendarDays.push({
        date: new Date(year, month - 1, prevMonthDays - i),
        isCurrentMonth: false,
        isToday: false,
      });
    }
  } else {
    // Add empty slots for days before month starts
    for (let i = 0; i < startOffset; i++) {
      calendarDays.push(null);
    }
  }

  // Current month days
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    calendarDays.push({
      date,
      isCurrentMonth: true,
      isToday: date.toDateString() === today.toDateString(),
    });
  }

  // Next month days (if showOutsideDays)
  const remainingSlots = 42 - calendarDays.length; // 6 weeks * 7 days
  if (showOutsideDays && remainingSlots > 0) {
    for (let day = 1; day <= remainingSlots; day++) {
      calendarDays.push({
        date: new Date(year, month + 1, day),
        isCurrentMonth: false,
        isToday: false,
      });
    }
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(displayMonth);
    newMonth.setMonth(newMonth.getMonth() + (direction === 'next' ? 1 : -1));
    setDisplayMonth(newMonth);
    onMonthChange?.(newMonth);
  };

  const handleDateClick = (date: Date) => {
    onSelect?.(date);
  };

  const isSelected = (date: Date) => {
    return selected && date.toDateString() === selected.toDateString();
  };

  // Split days into weeks
  const weeks = [];
  for (let i = 0; i < calendarDays.length; i += 7) {
    weeks.push(calendarDays.slice(i, i + 7));
  }

  return (
    <div className={cn("p-3", className)} {...props}>
      {/* Header */}
      <div className="flex justify-center pt-1 relative items-center mb-4">
        <button
          onClick={() => navigateMonth('prev')}
          className={cn(
            buttonVariants({ variant: "outline" }),
            "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 absolute left-1"
          )}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        
        <div className="text-sm font-medium">
          {MONTHS[month]} {year}
        </div>
        
        <button
          onClick={() => navigateMonth('next')}
          className={cn(
            buttonVariants({ variant: "outline" }),
            "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 absolute right-1"
          )}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 gap-0 mb-2">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="text-muted-foreground text-sm font-normal text-center py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-0">
        {weeks.map((week, weekIndex) =>
          week.map((dayData, dayIndex) => {
            if (!dayData) {
              return <div key={`empty-${weekIndex}-${dayIndex}`} className="h-9" />;
            }

            const { date, isCurrentMonth, isToday } = dayData;
            const selected = isSelected(date);

            return (
              <div
                key={date.toISOString()}
                className="h-9 text-center text-sm p-0 relative"
              >
                <button
                  onClick={() => handleDateClick(date)}
                  className={cn(
                    buttonVariants({ variant: "ghost" }),
                    "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground",
                    !isCurrentMonth && "text-muted-foreground opacity-50",
                    isToday && "bg-accent font-medium",
                    selected && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
                  )}
                  type="button"
                >
                  {date.getDate()}
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}