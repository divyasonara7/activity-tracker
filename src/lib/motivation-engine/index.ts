import type { Entry } from '../../types';
import { entryOps } from '../db';
import { randomPick, randomPickMultiple } from '../../utils';
import { getTodayString, subDays, toDateString } from '../../utils/dates';

// ============================================
// Motivation Recall Engine
// ============================================

export interface RecallSuggestion {
    entry: Entry;
    reason: string;
    type: 'high-mood' | 'motivation' | 'anniversary' | 'random';
}

/**
 * Get entries that would be good for motivation recall
 */
async function getMotivationalEntries(userId: string): Promise<Entry[]> {
    return entryOps.getForMotivation(userId);
}

/**
 * Get "on this day" entries from previous years
 */
async function getAnniversaryEntries(userId: string): Promise<Entry[]> {
    const monthDay = getTodayString().slice(5); // MM-DD

    const allEntries = await entryOps.getRecent(userId, 1000);

    return allEntries.filter((entry) => {
        // Check if same month-day but different year
        if (entry.date.slice(5) === monthDay && entry.date !== getTodayString()) {
            return true;
        }
        return false;
    });
}

/**
 * Get a random past entry for recall
 */
async function getRandomRecall(userId: string): Promise<Entry | undefined> {
    // Get entries from at least 7 days ago
    const cutoff = toDateString(subDays(new Date(), 7));
    const entries = await entryOps.getRecent(userId, 500);

    const oldEntries = entries.filter((e) => e.date < cutoff);
    return randomPick(oldEntries);
}

/**
 * Check if today is a low-activity day
 */
export async function isLowActivityDay(userId: string): Promise<boolean> {
    const today = getTodayString();
    const todayEntries = await entryOps.getByDate(userId, today);
    return todayEntries.length === 0;
}

/**
 * Get recall suggestions for the user
 * Prioritizes high-mood entries and motivation quotes
 */
export async function getRecallSuggestions(
    userId: string,
    count: number = 3
): Promise<RecallSuggestion[]> {
    const suggestions: RecallSuggestion[] = [];

    // Priority 1: Anniversary entries ("On this day...")
    const anniversaryEntries = await getAnniversaryEntries(userId);
    for (const entry of anniversaryEntries.slice(0, 1)) {
        suggestions.push({
            entry,
            reason: `You wrote this on ${entry.date.slice(0, 4)}`,
            type: 'anniversary',
        });
    }

    // Priority 2: High-mood and motivation entries
    const motivationalEntries = await getMotivationalEntries(userId);
    const picked = randomPickMultiple(motivationalEntries, count - suggestions.length);

    for (const entry of picked) {
        if (entry.mood === 'fire' || entry.mood === 'happy') {
            suggestions.push({
                entry,
                reason: 'You were feeling great when you wrote this',
                type: 'high-mood',
            });
        } else if (entry.category === 'motivation') {
            suggestions.push({
                entry,
                reason: 'A quote that inspired you',
                type: 'motivation',
            });
        }
    }

    // Fill remaining with random entries
    while (suggestions.length < count) {
        const randomEntry = await getRandomRecall(userId);
        if (!randomEntry) break;

        // Avoid duplicates
        if (suggestions.some((s) => s.entry.id === randomEntry.id)) break;

        suggestions.push({
            entry: randomEntry,
            reason: 'From your past reflections',
            type: 'random',
        });
    }

    return suggestions;
}

/**
 * Get an encouraging message based on streak history
 */
export function getEncouragingMessage(
    currentStreak: number,
    longestStreak: number
): string {
    if (currentStreak === 0 && longestStreak > 0) {
        return `You were consistent for ${longestStreak} days once. You can do it again! 💪`;
    }

    if (currentStreak > 0 && currentStreak === longestStreak) {
        return `You're on your longest streak ever! Keep the momentum! 🚀`;
    }

    if (currentStreak > 0) {
        const remaining = longestStreak - currentStreak;
        if (remaining <= 3) {
            return `Just ${remaining} more days to beat your record! 🎯`;
        }
        return `Keep going! ${currentStreak} days strong! ⚡`;
    }

    return 'Every journey starts with a single step. Add your first entry today! 🌱';
}
