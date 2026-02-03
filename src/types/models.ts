// Core application type definitions

// ============================================
// Enums & Literal Types
// ============================================

export type EntryCategory =
    | 'learning-technology'
    | 'learning-finance'
    | 'learning-other'
    | 'exercise'
    | 'motivation'
    | 'reflection';

export type Mood = 'fire' | 'happy' | 'neutral' | 'sad';

export type StreakType = 'learning' | 'exercise' | 'reflection' | 'overall';

export type AchievementType =
    | 'first-entry'
    | 'streak-7'
    | 'streak-14'
    | 'streak-30'
    | 'streak-60'
    | 'streak-90'
    | 'consistency-champion'
    | 'reflection-master'
    | 'learning-warrior'
    | 'exercise-enthusiast';

export type Theme = 'light' | 'dark' | 'system';

// ============================================
// Core Models
// ============================================

export interface User {
    id: string;
    name: string;
    createdAt: Date;
    preferences: UserPreferences;
    onboardingComplete: boolean;
}

export interface UserPreferences {
    dailyReminderTime: string | null;  // "09:00" format
    graceDays: number;                  // Default: 1
    theme: Theme;
    weekStartsOn: 0 | 1;               // 0 = Sunday, 1 = Monday
    enableNotifications: boolean;
    enableRecallReminders: boolean;
}

export interface Entry {
    id: string;
    userId: string;
    date: string;                       // YYYY-MM-DD (for indexing)
    createdAt: Date;
    updatedAt: Date;

    category: EntryCategory;
    title: string | null;
    content: string;                    // Markdown supported
    mood: Mood;
    tags: string[];
    timeSpentMinutes: number | null;

    isPinned: boolean;
    isArchived: boolean;
}

export interface Streak {
    id: string;
    userId: string;
    type: StreakType;
    currentCount: number;
    longestCount: number;
    lastActiveDate: string;            // YYYY-MM-DD
    startDate: string;                 // Current streak start
}

export interface Goal {
    id: string;
    userId: string;
    title: string;
    description: string | null;
    targetDays: number;                // 7, 14, 30, 90
    category: EntryCategory | 'any';
    startDate: string;                 // YYYY-MM-DD
    completedDays: number;
    isCompleted: boolean;
    isArchived: boolean;
    createdAt: Date;
}

export interface Achievement {
    id: string;
    userId: string;
    type: AchievementType;
    unlockedAt: Date;
    metadata: Record<string, unknown>;
}

// ============================================
// Analytics & Computed Types
// ============================================

export interface DayStats {
    date: string;
    entryCount: number;
    categories: EntryCategory[];
    mood: Mood | null;                 // Dominant mood
    hasStreak: boolean;
}

export interface WeeklyComparison {
    thisWeek: number;
    lastWeek: number;
    percentChange: number;
    trend: 'up' | 'down' | 'stable';
}

export interface CategoryBreakdown {
    category: EntryCategory;
    count: number;
    percentage: number;
}

export interface MoodTrend {
    date: string;
    mood: Mood;
    count: number;
}

export interface AnalyticsSummary {
    totalActiveDays: number;
    currentStreak: number;
    longestStreak: number;
    categoryBreakdown: CategoryBreakdown[];
    weeklyComparison: WeeklyComparison;
    moodTrends: MoodTrend[];
}

// ============================================
// UI Helper Types
// ============================================

export interface StickyNoteColor {
    background: string;
    border: string;
    text: string;
}

export interface CalendarDay {
    date: string;
    isCurrentMonth: boolean;
    isToday: boolean;
    stats: DayStats | null;
}

// ============================================
// Form Types
// ============================================

export interface EntryFormData {
    category: EntryCategory;
    title: string;
    content: string;
    mood: Mood;
    tags: string[];
    timeSpentMinutes: number | null;
}

export interface GoalFormData {
    title: string;
    description: string;
    targetDays: number;
    category: EntryCategory | 'any';
}
