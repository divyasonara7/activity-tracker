import { useState, useEffect, useMemo } from "react";
import { format, addMonths, subMonths, isSameMonth } from "date-fns";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { useAppStore } from "@/stores/appStore";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui";
import { HabitCard } from "@/components/sticky-notes/StickyNote";
import {
    getCalendarGrid,
    toDateString,
    isToday,
    parseDate,
} from "@/utils/dates";
import { entryOps } from "@/lib/db";
import type { Entry, EntryCategory } from "@/types";
import { cn } from "@/lib/utils";
import styles from "./CalendarView.module.css";

// ============================================
// Types
// ============================================

interface DayData {
    date: Date;
    dateString: string;
    entries: Entry[];
    isCurrentMonth: boolean;
    isToday: boolean;
    hasStreak: boolean;
}

// ============================================
// Category Colors for Entry Dots
// ============================================

const CATEGORY_DOT_COLORS: Record<EntryCategory, string> = {
    "learning-technology": "bg-habit-blue",
    "learning-finance": "bg-habit-yellow",
    "learning-other": "bg-habit-purple",
    "exercise": "bg-habit-green",
    "motivation": "bg-habit-orange",
    "reflection": "bg-habit-pink",
};

// ============================================
// Calendar View Component
// ============================================

export function CalendarView() {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [monthEntries, setMonthEntries] = useState<Entry[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const { user, streaks } = useAppStore();
    const weekStartsOn = user?.preferences?.weekStartsOn ?? 1;

    // Load entries for the visible month
    useEffect(() => {
        async function loadMonthEntries() {
            if (!user?.id) return;

            setIsLoading(true);
            const grid = getCalendarGrid(currentMonth, weekStartsOn);
            const startDate = toDateString(grid[0]);
            const endDate = toDateString(grid[grid.length - 1]);

            try {
                const entries = await entryOps.getByDateRange(user.id, startDate, endDate);
                setMonthEntries(entries);
            } catch (error) {
                console.error("Failed to load entries:", error);
            } finally {
                setIsLoading(false);
            }
        }

        loadMonthEntries();
    }, [currentMonth, user?.id, weekStartsOn]);

    // Build calendar grid with entry data
    const calendarDays = useMemo<DayData[]>(() => {
        const grid = getCalendarGrid(currentMonth, weekStartsOn);
        const overallStreak = streaks.find((s) => s.type === "overall");
        const streakStartDate = overallStreak?.startDate
            ? parseDate(overallStreak.startDate)
            : null;

        return grid.map((date) => {
            const dateString = toDateString(date);
            const entries = monthEntries.filter((e) => e.date === dateString);

            // Check if this date is within the current streak
            let hasStreak = false;
            if (streakStartDate && overallStreak && overallStreak.currentCount > 0) {
                hasStreak = entries.length > 0 && date >= streakStartDate;
            }

            return {
                date,
                dateString,
                entries,
                isCurrentMonth: isSameMonth(date, currentMonth),
                isToday: isToday(date),
                hasStreak,
            };
        });
    }, [currentMonth, weekStartsOn, monthEntries, streaks]);

    // Get weekday labels
    const weekdayLabels = useMemo(() => {
        const labels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        if (weekStartsOn === 1) {
            return [...labels.slice(1), labels[0]];
        }
        return labels;
    }, [weekStartsOn]);

    // Navigation handlers
    const goToPrevMonth = () => setCurrentMonth((m) => subMonths(m, 1));
    const goToNextMonth = () => setCurrentMonth((m) => addMonths(m, 1));
    const goToToday = () => {
        setCurrentMonth(new Date());
        setSelectedDate(toDateString(new Date()));
    };

    // Get entries for selected date
    const selectedEntries = useMemo(() => {
        if (!selectedDate) return [];
        return monthEntries
            .filter((e) => e.date === selectedDate && !e.isArchived)
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }, [selectedDate, monthEntries]);

    if (isLoading && monthEntries.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
                <div className="w-10 h-10 border-3 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
                <p className="text-muted-foreground">Loading calendar...</p>
            </div>
        );
    }

    return (
        <div className={styles.calendarContainer}>
            {/* Header */}
            <header className={styles.header}>
                <h1 className={styles.monthTitle}>{format(currentMonth, "MMMM yyyy")}</h1>
                <div className={styles.navButtons}>
                    <button
                        onClick={goToPrevMonth}
                        className={styles.navButton}
                        aria-label="Previous month"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button onClick={goToToday} className={styles.todayButton}>
                        Today
                    </button>
                    <button
                        onClick={goToNextMonth}
                        className={styles.navButton}
                        aria-label="Next month"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </header>

            {/* Weekday Labels */}
            <div className={styles.weekdayHeader}>
                {weekdayLabels.map((label) => (
                    <div key={label} className={styles.weekdayLabel}>
                        {label}
                    </div>
                ))}
            </div>

            {/* Calendar Grid */}
            <div className={styles.calendarGrid}>
                {calendarDays.map((day) => (
                    <DayCell
                        key={day.dateString}
                        day={day}
                        onClick={() => setSelectedDate(day.dateString)}
                    />
                ))}
            </div>

            {/* Day Entries Modal */}
            <Dialog open={!!selectedDate} onOpenChange={() => setSelectedDate(null)}>
                <DialogContent className="sm:max-w-md bg-card border-border">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-primary-400" />
                            {selectedDate && format(parseDate(selectedDate), "EEEE, MMMM d")}
                        </DialogTitle>
                    </DialogHeader>
                    <div className={styles.entriesModal}>
                        {selectedEntries.length > 0 ? (
                            <div className={styles.entriesList}>
                                {selectedEntries.map((entry, index) => (
                                    <HabitCard key={entry.id} entry={entry} index={index} />
                                ))}
                            </div>
                        ) : (
                            <div className={styles.emptyState}>
                                <div className={styles.emptyStateIcon}>📝</div>
                                <p>No entries for this day</p>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}

// ============================================
// Day Cell Component
// ============================================

interface DayCellProps {
    day: DayData;
    onClick: () => void;
}

function DayCell({ day, onClick }: DayCellProps) {
    const { isCurrentMonth, isToday: isTodayDay, entries, hasStreak, date } = day;

    // Get unique categories for dot display (max 4)
    const uniqueCategories = [
        ...new Set(entries.map((e) => e.category)),
    ].slice(0, 4) as EntryCategory[];

    return (
        <div
            className={cn(
                styles.dayCell,
                !isCurrentMonth && styles.dayCellDisabled,
                isTodayDay && styles.dayCellToday,
                entries.length > 0 && styles.dayCellHasEntries
            )}
            onClick={isCurrentMonth ? onClick : undefined}
            role="button"
            tabIndex={isCurrentMonth ? 0 : -1}
            onKeyDown={(e) => {
                if (isCurrentMonth && (e.key === "Enter" || e.key === " ")) {
                    e.preventDefault();
                    onClick();
                }
            }}
            aria-label={`${format(date, "MMMM d")}, ${entries.length} entries`}
        >
            {/* Streak Indicator */}
            {hasStreak && isCurrentMonth && (
                <span className={styles.streakIndicator}>🔥</span>
            )}

            {/* Day Number */}
            <span
                className={cn(
                    styles.dayNumber,
                    isTodayDay && styles.dayNumberToday,
                    !isCurrentMonth && styles.dayNumberDisabled
                )}
            >
                {format(date, "d")}
            </span>

            {/* Entry Indicators */}
            {entries.length > 0 && isCurrentMonth && (
                <div className={styles.entryIndicators}>
                    {uniqueCategories.map((category) => (
                        <div
                            key={category}
                            className={cn(styles.entryDot, CATEGORY_DOT_COLORS[category])}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
