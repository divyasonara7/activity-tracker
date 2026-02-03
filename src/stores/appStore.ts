import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User, Entry, Streak, Goal, Achievement, EntryFormData } from '../types';
import { userOps, entryOps, streakOps, goalOps, achievementOps } from '../lib/db';
import { generateId, getTodayString } from '../utils';

// ============================================
// App Store Types
// ============================================

interface AppState {
    // Current user
    user: User | null;
    isLoading: boolean;
    error: string | null;

    // Today's entries (cached for quick access)
    todayEntries: Entry[];

    // Current streaks
    streaks: Streak[];

    // Active goals
    activeGoals: Goal[];

    // Unlocked achievements
    achievements: Achievement[];

    // Selected date for viewing
    selectedDate: string;
}

interface AppActions {
    // Initialization
    initialize: () => Promise<void>;

    // User actions
    updateUser: (updates: Partial<User>) => Promise<void>;
    completeOnboarding: () => Promise<void>;

    // Entry actions
    addEntry: (data: EntryFormData) => Promise<Entry>;
    updateEntry: (id: string, updates: Partial<Entry>) => Promise<void>;
    deleteEntry: (id: string) => Promise<void>;
    togglePin: (id: string) => Promise<void>;
    toggleArchive: (id: string) => Promise<void>;
    loadTodayEntries: () => Promise<void>;

    // Date navigation
    setSelectedDate: (date: string) => void;

    // Streak actions
    refreshStreaks: () => Promise<void>;

    // Goal actions
    addGoal: (title: string, targetDays: number, category: string) => Promise<Goal>;
    updateGoal: (id: string, updates: Partial<Goal>) => Promise<void>;
    archiveGoal: (id: string) => Promise<void>;
    loadActiveGoals: () => Promise<void>;

    // Achievement actions
    checkAndUnlockAchievements: () => Promise<Achievement[]>;
    loadAchievements: () => Promise<void>;

    // Error handling
    clearError: () => void;
}

type AppStore = AppState & AppActions;

// ============================================
// Default User ID (for local-only mode)
// ============================================

const DEFAULT_USER_ID = 'local-user';
const DEFAULT_USER_NAME = 'You';

// ============================================
// Store Implementation
// ============================================

export const useAppStore = create<AppStore>()(
    persist(
        (set, get) => ({
            // Initial state
            user: null,
            isLoading: true,
            error: null,
            todayEntries: [],
            streaks: [],
            activeGoals: [],
            achievements: [],
            selectedDate: getTodayString(),

            // Initialization
            initialize: async () => {
                try {
                    set({ isLoading: true, error: null });

                    // Get or create user
                    const user = await userOps.getOrCreate(DEFAULT_USER_ID, DEFAULT_USER_NAME);

                    // Load today's entries
                    const today = getTodayString();
                    const todayEntries = await entryOps.getByDate(user.id, today);

                    // Load streaks
                    const streaks = await streakOps.getAll(user.id);

                    // Load active goals
                    const activeGoals = await goalOps.getActive(user.id);

                    // Load achievements
                    const achievements = await achievementOps.getAll(user.id);

                    set({
                        user,
                        todayEntries,
                        streaks,
                        activeGoals,
                        achievements,
                        isLoading: false,
                    });
                } catch (error) {
                    console.error('Failed to initialize app:', error);
                    set({
                        error: 'Failed to load your data. Please refresh the page.',
                        isLoading: false,
                    });
                }
            },

            // User actions
            updateUser: async (updates) => {
                const { user } = get();
                if (!user) return;

                try {
                    await userOps.update(user.id, updates);
                    set({ user: { ...user, ...updates } });
                } catch (error) {
                    console.error('Failed to update user:', error);
                    set({ error: 'Failed to save preferences.' });
                }
            },

            completeOnboarding: async () => {
                await get().updateUser({ onboardingComplete: true });
            },

            // Entry actions
            addEntry: async (data) => {
                const { user, todayEntries } = get();
                if (!user) throw new Error('User not initialized');

                const now = new Date();
                const today = getTodayString();

                const entry: Entry = {
                    id: generateId(),
                    userId: user.id,
                    date: today,
                    createdAt: now,
                    updatedAt: now,
                    category: data.category,
                    title: data.title || null,
                    content: data.content,
                    mood: data.mood,
                    tags: data.tags,
                    timeSpentMinutes: data.timeSpentMinutes,
                    isPinned: false,
                    isArchived: false,
                };

                await entryOps.create(entry);

                // Update today's entries if this is for today
                if (entry.date === today) {
                    set({ todayEntries: [...todayEntries, entry] });
                }

                // Refresh streaks after adding entry
                await get().refreshStreaks();

                // Check for new achievements
                await get().checkAndUnlockAchievements();

                return entry;
            },

            updateEntry: async (id, updates) => {
                const { todayEntries } = get();

                await entryOps.update(id, updates);

                // Update in today's entries if present
                set({
                    todayEntries: todayEntries.map((e) =>
                        e.id === id ? { ...e, ...updates, updatedAt: new Date() } : e
                    ),
                });
            },

            deleteEntry: async (id) => {
                const { todayEntries } = get();

                await entryOps.delete(id);

                set({
                    todayEntries: todayEntries.filter((e) => e.id !== id),
                });

                // Refresh streaks after deletion
                await get().refreshStreaks();
            },

            togglePin: async (id) => {
                const { todayEntries } = get();
                const entry = todayEntries.find((e) => e.id === id);
                if (entry) {
                    await get().updateEntry(id, { isPinned: !entry.isPinned });
                }
            },

            toggleArchive: async (id) => {
                const { todayEntries } = get();
                const entry = todayEntries.find((e) => e.id === id);
                if (entry) {
                    await get().updateEntry(id, { isArchived: !entry.isArchived });
                }
            },

            loadTodayEntries: async () => {
                const { user } = get();
                if (!user) return;

                const today = getTodayString();
                const entries = await entryOps.getByDate(user.id, today);
                set({ todayEntries: entries });
            },

            // Date navigation
            setSelectedDate: (date) => {
                set({ selectedDate: date });
            },

            // Streak actions
            refreshStreaks: async () => {
                const { user } = get();
                if (!user) return;

                // This would call the streak engine to recalculate
                // For now, just reload from DB
                const streaks = await streakOps.getAll(user.id);
                set({ streaks });
            },

            // Goal actions
            addGoal: async (title, targetDays, category) => {
                const { user, activeGoals } = get();
                if (!user) throw new Error('User not initialized');

                const goal: Goal = {
                    id: generateId(),
                    userId: user.id,
                    title,
                    description: null,
                    targetDays,
                    category: category as Goal['category'],
                    startDate: getTodayString(),
                    completedDays: 0,
                    isCompleted: false,
                    isArchived: false,
                    createdAt: new Date(),
                };

                await goalOps.create(goal);
                set({ activeGoals: [...activeGoals, goal] });

                return goal;
            },

            updateGoal: async (id, updates) => {
                const { activeGoals } = get();

                await goalOps.update(id, updates);

                set({
                    activeGoals: activeGoals.map((g) =>
                        g.id === id ? { ...g, ...updates } : g
                    ),
                });
            },

            archiveGoal: async (id) => {
                await get().updateGoal(id, { isArchived: true });
                set({
                    activeGoals: get().activeGoals.filter((g) => g.id !== id),
                });
            },

            loadActiveGoals: async () => {
                const { user } = get();
                if (!user) return;

                const goals = await goalOps.getActive(user.id);
                set({ activeGoals: goals });
            },

            // Achievement actions
            checkAndUnlockAchievements: async () => {
                const { user, achievements } = get();
                if (!user) return [];

                const newAchievements: Achievement[] = [];

                // Check for first entry
                if (!achievements.find((a) => a.type === 'first-entry')) {
                    const count = await entryOps.count(user.id);
                    if (count >= 1) {
                        const achievement: Achievement = {
                            id: generateId(),
                            userId: user.id,
                            type: 'first-entry',
                            unlockedAt: new Date(),
                            metadata: {},
                        };
                        await achievementOps.unlock(achievement);
                        newAchievements.push(achievement);
                    }
                }

                // More achievement checks would go here...

                if (newAchievements.length > 0) {
                    set({ achievements: [...achievements, ...newAchievements] });
                }

                return newAchievements;
            },

            loadAchievements: async () => {
                const { user } = get();
                if (!user) return;

                const achievements = await achievementOps.getAll(user.id);
                set({ achievements });
            },

            // Error handling
            clearError: () => {
                set({ error: null });
            },
        }),
        {
            name: 'growth-tracker-store',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                // Only persist minimal UI state, not data (that's in IndexedDB)
                selectedDate: state.selectedDate,
            }),
        }
    )
);
