import type { EntryCategory, Mood, StickyNoteColor } from '../types';

// ============================================
// Category Helpers
// ============================================

export const CATEGORY_CONFIG: Record<
    EntryCategory,
    {
        label: string;
        emoji: string;
        color: string;
        stickyColor: keyof typeof STICKY_COLORS;
    }
> = {
    'learning-technology': {
        label: 'Technology',
        emoji: '💻',
        color: 'var(--color-learning-technology)',
        stickyColor: 'blue',
    },
    'learning-finance': {
        label: 'Finance',
        emoji: '💰',
        color: 'var(--color-learning-finance)',
        stickyColor: 'yellow',
    },
    'learning-other': {
        label: 'Learning',
        emoji: '📚',
        color: 'var(--color-learning-other)',
        stickyColor: 'purple',
    },
    exercise: {
        label: 'Exercise',
        emoji: '🏋️',
        color: 'var(--color-exercise)',
        stickyColor: 'green',
    },
    motivation: {
        label: 'Motivation',
        emoji: '💬',
        color: 'var(--color-motivation)',
        stickyColor: 'orange',
    },
    reflection: {
        label: 'Reflection',
        emoji: '🧠',
        color: 'var(--color-reflection)',
        stickyColor: 'pink',
    },
};

export function getCategoryLabel(category: EntryCategory): string {
    return CATEGORY_CONFIG[category].label;
}

export function getCategoryEmoji(category: EntryCategory): string {
    return CATEGORY_CONFIG[category].emoji;
}

export function getCategoryColor(category: EntryCategory): string {
    return CATEGORY_CONFIG[category].color;
}

// ============================================
// Mood Helpers
// ============================================

export const MOOD_CONFIG: Record<
    Mood,
    { label: string; emoji: string; color: string }
> = {
    fire: { label: 'On Fire', emoji: '🔥', color: 'var(--mood-fire)' },
    happy: { label: 'Happy', emoji: '😊', color: 'var(--mood-happy)' },
    neutral: { label: 'Okay', emoji: '😐', color: 'var(--mood-neutral)' },
    sad: { label: 'Low', emoji: '😔', color: 'var(--mood-sad)' },
};

export function getMoodLabel(mood: Mood): string {
    return MOOD_CONFIG[mood].label;
}

export function getMoodEmoji(mood: Mood): string {
    return MOOD_CONFIG[mood].emoji;
}

export function getMoodColor(mood: Mood): string {
    return MOOD_CONFIG[mood].color;
}

// ============================================
// Sticky Note Colors
// ============================================

export const STICKY_COLORS = {
    yellow: {
        background: 'rgb(var(--sticky-yellow))',
        border: 'rgb(var(--sticky-yellow) / 0.8)',
        text: 'rgb(120 53 15)', // Amber 900
    },
    pink: {
        background: 'rgb(var(--sticky-pink))',
        border: 'rgb(var(--sticky-pink) / 0.8)',
        text: 'rgb(136 19 55)', // Rose 900
    },
    blue: {
        background: 'rgb(var(--sticky-blue))',
        border: 'rgb(var(--sticky-blue) / 0.8)',
        text: 'rgb(30 58 138)', // Blue 900
    },
    green: {
        background: 'rgb(var(--sticky-green))',
        border: 'rgb(var(--sticky-green) / 0.8)',
        text: 'rgb(20 83 45)', // Green 900
    },
    purple: {
        background: 'rgb(var(--sticky-purple))',
        border: 'rgb(var(--sticky-purple) / 0.8)',
        text: 'rgb(88 28 135)', // Purple 900
    },
    orange: {
        background: 'rgb(var(--sticky-orange))',
        border: 'rgb(var(--sticky-orange) / 0.8)',
        text: 'rgb(124 45 18)', // Orange 900
    },
} as const satisfies Record<string, StickyNoteColor>;

export function getStickyColor(category: EntryCategory): StickyNoteColor {
    const colorKey = CATEGORY_CONFIG[category].stickyColor;
    return STICKY_COLORS[colorKey];
}

// ============================================
// Achievement Labels
// ============================================

export const ACHIEVEMENT_CONFIG = {
    'first-entry': {
        title: 'First Step',
        description: 'Created your first entry',
        emoji: '🌱',
    },
    'streak-7': {
        title: 'Week Warrior',
        description: 'Maintained a 7-day streak',
        emoji: '🔥',
    },
    'streak-14': {
        title: 'Fortnight Focus',
        description: 'Maintained a 14-day streak',
        emoji: '⚡',
    },
    'streak-30': {
        title: 'Monthly Master',
        description: 'Maintained a 30-day streak',
        emoji: '🏆',
    },
    'streak-60': {
        title: 'Two Month Champion',
        description: 'Maintained a 60-day streak',
        emoji: '👑',
    },
    'streak-90': {
        title: 'Quarterly Legend',
        description: 'Maintained a 90-day streak',
        emoji: '🌟',
    },
    'consistency-champion': {
        title: 'Consistency Champion',
        description: 'Logged entries in 3+ categories in one day',
        emoji: '🎯',
    },
    'reflection-master': {
        title: 'Reflection Master',
        description: 'Created 10 reflection entries',
        emoji: '🧘',
    },
    'learning-warrior': {
        title: 'Learning Warrior',
        description: 'Created 50 learning entries',
        emoji: '📖',
    },
    'exercise-enthusiast': {
        title: 'Exercise Enthusiast',
        description: 'Created 30 exercise entries',
        emoji: '💪',
    },
} as const;
