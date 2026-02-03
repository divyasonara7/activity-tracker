import {
    format,
    parseISO,
    startOfWeek,
    endOfWeek,
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    addDays,
    subDays,
    differenceInDays,
    isToday,
    isSameDay,
    isBefore,
    isAfter,
} from 'date-fns';

// ============================================
// Date Formatting
// ============================================

/**
 * Format date to YYYY-MM-DD string (used as key in DB)
 */
export function toDateString(date: Date): string {
    return format(date, 'yyyy-MM-dd');
}

/**
 * Get today's date as YYYY-MM-DD string
 */
export function getTodayString(): string {
    return toDateString(new Date());
}

/**
 * Parse YYYY-MM-DD string to Date object
 */
export function parseDate(dateString: string): Date {
    return parseISO(dateString);
}

/**
 * Format date for display (e.g., "Feb 3, 2026")
 */
export function formatDisplayDate(date: Date | string): string {
    const d = typeof date === 'string' ? parseISO(date) : date;
    return format(d, 'MMM d, yyyy');
}

/**
 * Format date for short display (e.g., "Feb 3")
 */
export function formatShortDate(date: Date | string): string {
    const d = typeof date === 'string' ? parseISO(date) : date;
    return format(d, 'MMM d');
}

/**
 * Format day of week (e.g., "Monday")
 */
export function formatDayOfWeek(date: Date | string): string {
    const d = typeof date === 'string' ? parseISO(date) : date;
    return format(d, 'EEEE');
}

/**
 * Get relative day label (Today, Yesterday, or date)
 */
export function getRelativeDay(date: Date | string): string {
    const d = typeof date === 'string' ? parseISO(date) : date;

    if (isToday(d)) return 'Today';
    if (isSameDay(d, subDays(new Date(), 1))) return 'Yesterday';

    return formatDisplayDate(d);
}

// ============================================
// Week & Month Helpers
// ============================================

/**
 * Get start of week (configurable start day)
 */
export function getWeekStart(date: Date, weekStartsOn: 0 | 1 = 1): Date {
    return startOfWeek(date, { weekStartsOn });
}

/**
 * Get end of week
 */
export function getWeekEnd(date: Date, weekStartsOn: 0 | 1 = 1): Date {
    return endOfWeek(date, { weekStartsOn });
}

/**
 * Get all days in a week
 */
export function getWeekDays(date: Date, weekStartsOn: 0 | 1 = 1): Date[] {
    return eachDayOfInterval({
        start: getWeekStart(date, weekStartsOn),
        end: getWeekEnd(date, weekStartsOn),
    });
}

/**
 * Get first day of month
 */
export function getMonthStart(date: Date): Date {
    return startOfMonth(date);
}

/**
 * Get last day of month
 */
export function getMonthEnd(date: Date): Date {
    return endOfMonth(date);
}

/**
 * Get all days in a month
 */
export function getMonthDays(date: Date): Date[] {
    return eachDayOfInterval({
        start: getMonthStart(date),
        end: getMonthEnd(date),
    });
}

/**
 * Get calendar grid (includes padding days from prev/next month)
 */
export function getCalendarGrid(date: Date, weekStartsOn: 0 | 1 = 1): Date[] {
    const monthStart = getMonthStart(date);
    const monthEnd = getMonthEnd(date);

    // Get the first day to show (might be from previous month)
    const gridStart = getWeekStart(monthStart, weekStartsOn);
    // Get the last day to show (might be from next month)
    const gridEnd = getWeekEnd(monthEnd, weekStartsOn);

    return eachDayOfInterval({ start: gridStart, end: gridEnd });
}

// ============================================
// Date Comparison & Calculations
// ============================================

/**
 * Check if date is today
 */
export { isToday };

/**
 * Check if two dates are the same day
 */
export { isSameDay };

/**
 * Check if date is before another
 */
export { isBefore };

/**
 * Check if date is after another
 */
export { isAfter };

/**
 * Get number of days between two dates
 */
export function daysBetween(start: Date | string, end: Date | string): number {
    const startDate = typeof start === 'string' ? parseISO(start) : start;
    const endDate = typeof end === 'string' ? parseISO(end) : end;
    return Math.abs(differenceInDays(endDate, startDate));
}

/**
 * Add days to a date
 */
export { addDays };

/**
 * Subtract days from a date
 */
export { subDays };

/**
 * Check if a date string is within a range
 */
export function isInRange(
    dateString: string,
    startString: string,
    endString: string
): boolean {
    return dateString >= startString && dateString <= endString;
}

/**
 * Get date range as array of date strings
 */
export function getDateRange(startDate: Date, endDate: Date): string[] {
    const days = eachDayOfInterval({ start: startDate, end: endDate });
    return days.map(toDateString);
}
