import Dexie, { type Table } from 'dexie';
import type { User, Entry, Streak, Goal, Achievement } from '../../types';

// ============================================
// Database Schema
// ============================================

export class GrowthTrackerDB extends Dexie {
    users!: Table<User, string>;
    entries!: Table<Entry, string>;
    streaks!: Table<Streak, string>;
    goals!: Table<Goal, string>;
    achievements!: Table<Achievement, string>;

    constructor() {
        super('GrowthTrackerDB');

        this.version(1).stores({
            users: 'id, createdAt',
            entries: 'id, userId, date, category, [userId+date], createdAt',
            streaks: 'id, userId, type, [userId+type]',
            goals: 'id, userId, isCompleted, isArchived, [userId+isCompleted]',
            achievements: 'id, userId, type, [userId+type]',
        });
    }
}

// Singleton database instance
export const db = new GrowthTrackerDB();

// ============================================
// Database Operations
// ============================================

// User operations
export const userOps = {
    async get(id: string): Promise<User | undefined> {
        return db.users.get(id);
    },

    async getOrCreate(id: string, name: string): Promise<User> {
        const existing = await this.get(id);
        if (existing) return existing;

        const newUser: User = {
            id,
            name,
            createdAt: new Date(),
            onboardingComplete: false,
            preferences: {
                dailyReminderTime: '09:00',
                graceDays: 1,
                theme: 'system',
                weekStartsOn: 1,
                enableNotifications: true,
                enableRecallReminders: true,
            },
        };

        await db.users.add(newUser);
        return newUser;
    },

    async update(id: string, updates: Partial<User>): Promise<void> {
        await db.users.update(id, updates);
    },
};

// Entry operations
export const entryOps = {
    async getById(id: string): Promise<Entry | undefined> {
        return db.entries.get(id);
    },

    async getByDate(userId: string, date: string): Promise<Entry[]> {
        return db.entries
            .where('[userId+date]')
            .equals([userId, date])
            .toArray();
    },

    async getByDateRange(
        userId: string,
        startDate: string,
        endDate: string
    ): Promise<Entry[]> {
        return db.entries
            .where('userId')
            .equals(userId)
            .and((entry) => entry.date >= startDate && entry.date <= endDate)
            .toArray();
    },

    async getRecent(userId: string, limit: number = 10): Promise<Entry[]> {
        return db.entries
            .where('userId')
            .equals(userId)
            .reverse()
            .sortBy('createdAt')
            .then((entries) => entries.slice(0, limit));
    },

    async getPinned(userId: string): Promise<Entry[]> {
        return db.entries
            .where('userId')
            .equals(userId)
            .and((entry) => entry.isPinned && !entry.isArchived)
            .toArray();
    },

    async getByCategory(userId: string, category: string): Promise<Entry[]> {
        return db.entries
            .where('userId')
            .equals(userId)
            .and((entry) => entry.category === category && !entry.isArchived)
            .toArray();
    },

    async getForMotivation(userId: string): Promise<Entry[]> {
        // Get high-mood and motivation entries for recall
        return db.entries
            .where('userId')
            .equals(userId)
            .and(
                (entry) =>
                    !entry.isArchived &&
                    (entry.mood === 'fire' ||
                        entry.mood === 'happy' ||
                        entry.category === 'motivation')
            )
            .toArray();
    },

    async create(entry: Entry): Promise<string> {
        await db.entries.add(entry);
        return entry.id;
    },

    async update(id: string, updates: Partial<Entry>): Promise<void> {
        await db.entries.update(id, { ...updates, updatedAt: new Date() });
    },

    async delete(id: string): Promise<void> {
        await db.entries.delete(id);
    },

    async getActiveDates(userId: string): Promise<string[]> {
        const entries = await db.entries
            .where('userId')
            .equals(userId)
            .toArray();

        const uniqueDates = new Set(entries.map((e) => e.date));
        return Array.from(uniqueDates).sort();
    },

    async count(userId: string): Promise<number> {
        return db.entries.where('userId').equals(userId).count();
    },
};

// Streak operations
export const streakOps = {
    async get(userId: string, type: string): Promise<Streak | undefined> {
        return db.streaks
            .where('[userId+type]')
            .equals([userId, type])
            .first();
    },

    async getAll(userId: string): Promise<Streak[]> {
        return db.streaks.where('userId').equals(userId).toArray();
    },

    async upsert(streak: Streak): Promise<void> {
        const existing = await this.get(streak.userId, streak.type);
        if (existing) {
            await db.streaks.update(existing.id, streak);
        } else {
            await db.streaks.add(streak);
        }
    },

    async updateCurrent(
        userId: string,
        type: string,
        count: number,
        date: string
    ): Promise<void> {
        const streak = await this.get(userId, type);
        if (streak) {
            await db.streaks.update(streak.id, {
                currentCount: count,
                lastActiveDate: date,
                longestCount: Math.max(streak.longestCount, count),
            });
        }
    },
};

// Goal operations
export const goalOps = {
    async getById(id: string): Promise<Goal | undefined> {
        return db.goals.get(id);
    },

    async getActive(userId: string): Promise<Goal[]> {
        return db.goals
            .where('[userId+isCompleted]')
            .equals([userId, 0]) // 0 = false in IndexedDB
            .and((goal) => !goal.isArchived)
            .toArray();
    },

    async getCompleted(userId: string): Promise<Goal[]> {
        return db.goals
            .where('[userId+isCompleted]')
            .equals([userId, 1])
            .toArray();
    },

    async create(goal: Goal): Promise<string> {
        await db.goals.add(goal);
        return goal.id;
    },

    async update(id: string, updates: Partial<Goal>): Promise<void> {
        await db.goals.update(id, updates);
    },

    async incrementProgress(id: string): Promise<void> {
        const goal = await this.getById(id);
        if (goal) {
            const newCompleted = goal.completedDays + 1;
            await db.goals.update(id, {
                completedDays: newCompleted,
                isCompleted: newCompleted >= goal.targetDays,
            });
        }
    },
};

// Achievement operations
export const achievementOps = {
    async getAll(userId: string): Promise<Achievement[]> {
        return db.achievements.where('userId').equals(userId).toArray();
    },

    async has(userId: string, type: string): Promise<boolean> {
        const achievement = await db.achievements
            .where('[userId+type]')
            .equals([userId, type])
            .first();
        return !!achievement;
    },

    async unlock(achievement: Achievement): Promise<void> {
        const exists = await this.has(achievement.userId, achievement.type);
        if (!exists) {
            await db.achievements.add(achievement);
        }
    },
};
