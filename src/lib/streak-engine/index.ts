import type { Streak, StreakType } from '../../types';
import {
    getTodayString,
    parseDate,
    subDays,
    toDateString,
    daysBetween
} from '../../utils/dates';
import { entryOps, streakOps } from '../db';
import { generateId } from '../../utils';

// ============================================
// Streak Engine
// ============================================

/**
 * Categories that count towards learning streak
 */
const LEARNING_CATEGORIES = [
    'learning-technology',
    'learning-finance',
    'learning-other',
];

/**
 * Determine streak type from entry category
 */
export function getStreakTypeFromCategory(category: string): StreakType | null {
    if (LEARNING_CATEGORIES.includes(category)) return 'learning';
    if (category === 'exercise') return 'exercise';
    if (category === 'reflection') return 'reflection';
    return null;
}

/**
 * Check if a date has qualifying entries for a streak type
 */
export async function hasQualifyingEntry(
    userId: string,
    date: string,
    type: StreakType
): Promise<boolean> {
    const entries = await entryOps.getByDate(userId, date);

    if (type === 'overall') {
        return entries.length > 0;
    }

    return entries.some((entry) => {
        const entryType = getStreakTypeFromCategory(entry.category);
        return entryType === type;
    });
}

/**
 * Calculate streak for a specific type
 * Respects grace days configuration
 */
export async function calculateStreak(
    userId: string,
    type: StreakType,
    graceDays: number = 1
): Promise<{ current: number; longest: number; startDate: string }> {
    const today = getTodayString();
    let currentDate = parseDate(today);
    let streakCount = 0;
    let startDate = today;
    let graceUsed = 0;

    // Walk backwards through days
    while (true) {
        const dateStr = toDateString(currentDate);
        const hasEntry = await hasQualifyingEntry(userId, dateStr, type);

        if (hasEntry) {
            streakCount++;
            startDate = dateStr;
            graceUsed = 0; // Reset grace counter on active day
        } else {
            graceUsed++;
            if (graceUsed > graceDays) {
                // Streak is broken
                break;
            }
            // Don't count grace days towards streak, just continue
        }

        // Move to previous day
        currentDate = subDays(currentDate, 1);

        // Safety limit (don't check more than 1 year back)
        if (daysBetween(currentDate, parseDate(today)) > 365) {
            break;
        }
    }

    // Get existing streak to compare longest
    const existingStreak = await streakOps.get(userId, type);
    const longestCount = Math.max(
        existingStreak?.longestCount || 0,
        streakCount
    );

    return {
        current: streakCount,
        longest: longestCount,
        startDate,
    };
}

/**
 * Update all streaks for a user
 */
export async function updateAllStreaks(
    userId: string,
    graceDays: number = 1
): Promise<Streak[]> {
    const types: StreakType[] = ['learning', 'exercise', 'reflection', 'overall'];
    const today = getTodayString();
    const streaks: Streak[] = [];

    for (const type of types) {
        const { current, longest, startDate } = await calculateStreak(
            userId,
            type,
            graceDays
        );

        const existingStreak = await streakOps.get(userId, type);

        const streak: Streak = {
            id: existingStreak?.id || generateId(),
            userId,
            type,
            currentCount: current,
            longestCount: longest,
            lastActiveDate: today,
            startDate,
        };

        await streakOps.upsert(streak);
        streaks.push(streak);
    }

    return streaks;
}

/**
 * Get streak status message
 */
export function getStreakMessage(streak: Streak): string {
    if (streak.currentCount === 0) {
        return 'Start your streak today!';
    }

    if (streak.currentCount === streak.longestCount) {
        return `🔥 ${streak.currentCount} day streak - your best ever!`;
    }

    if (streak.currentCount >= 30) {
        return `🏆 Amazing ${streak.currentCount} day streak!`;
    }

    if (streak.currentCount >= 7) {
        return `⚡ Great ${streak.currentCount} day streak!`;
    }

    return `${streak.currentCount} day streak - keep going!`;
}

/**
 * Check if streak is at risk (no entry today)
 */
export async function isStreakAtRisk(
    userId: string,
    type: StreakType
): Promise<boolean> {
    const today = getTodayString();
    const hasToday = await hasQualifyingEntry(userId, today, type);

    if (hasToday) return false;

    // Check if there was an entry yesterday
    const yesterday = toDateString(subDays(new Date(), 1));
    const hadYesterday = await hasQualifyingEntry(userId, yesterday, type);

    // If we had entries yesterday but not today, streak is at risk
    return hadYesterday;
}
