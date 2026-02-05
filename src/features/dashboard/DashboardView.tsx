import { useState, useEffect, useMemo } from "react";
import {
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
} from "recharts";
import { Flame, Trophy, Calendar, TrendingUp, TrendingDown, Minus, BarChart3 } from "lucide-react";
import { useAppStore } from "@/stores/appStore";
import { entryOps } from "@/lib/db";
import {
    subDays,
    toDateString,
    getWeekDays,
    parseDate,
} from "@/utils/dates";
import { addWeeks, startOfWeek, format } from "date-fns";
import { CATEGORY_CONFIG, getMoodEmoji } from "@/utils/constants";
import type { Entry, EntryCategory, Mood } from "@/types";
import { cn } from "@/lib/utils";
import styles from "./DashboardView.module.css";

// ============================================
// Types
// ============================================

interface CategoryData {
    category: EntryCategory;
    label: string;
    count: number;
    color: string;
    emoji: string;
}

interface WeeklyData {
    day: string;
    thisWeek: number;
    lastWeek: number;
}

interface MoodData {
    date: string;
    fire: number;
    happy: number;
    neutral: number;
    sad: number;
}

interface HeatmapCell {
    date: string;
    count: number;
    level: 0 | 1 | 2 | 3 | 4;
}

// ============================================
// Colors
// ============================================

const CATEGORY_COLORS: Record<EntryCategory, string> = {
    "learning-technology": "#3b82f6",
    "learning-finance": "#eab308",
    "learning-other": "#8b5cf6",
    "exercise": "#22c55e",
    "motivation": "#f97316",
    "reflection": "#ec4899",
};

const MOOD_COLORS: Record<Mood, string> = {
    fire: "#f97316",
    happy: "#22c55e",
    neutral: "#6b7280",
    sad: "#ef4444",
};

const HEATMAP_COLORS = [
    "rgba(255, 255, 255, 0.05)",
    "rgba(34, 197, 94, 0.3)",
    "rgba(34, 197, 94, 0.5)",
    "rgba(34, 197, 94, 0.7)",
    "rgba(34, 197, 94, 0.9)",
];

// ============================================
// Dashboard View Component
// ============================================

export function DashboardView() {
    const [entries, setEntries] = useState<Entry[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const { user, streaks } = useAppStore();

    // Load all entries
    useEffect(() => {
        async function loadEntries() {
            if (!user?.id) return;

            setIsLoading(true);
            try {
                const allEntries = await entryOps.getRecent(user.id, 10000);
                setEntries(allEntries);
            } catch (error) {
                console.error("Failed to load entries:", error);
            } finally {
                setIsLoading(false);
            }
        }

        loadEntries();
    }, [user?.id]);

    // Compute stats
    const stats = useMemo(() => {
        const uniqueDates = new Set(entries.map((e) => e.date));
        const overallStreak = streaks.find((s) => s.type === "overall");

        return {
            totalDays: uniqueDates.size,
            totalEntries: entries.length,
            currentStreak: overallStreak?.currentCount ?? 0,
            longestStreak: overallStreak?.longestCount ?? 0,
        };
    }, [entries, streaks]);

    // Category breakdown for pie chart
    const categoryData = useMemo<CategoryData[]>(() => {
        const counts: Record<EntryCategory, number> = {
            "learning-technology": 0,
            "learning-finance": 0,
            "learning-other": 0,
            "exercise": 0,
            "motivation": 0,
            "reflection": 0,
        };

        entries.forEach((e) => {
            counts[e.category]++;
        });

        return Object.entries(counts)
            .filter(([, count]) => count > 0)
            .map(([category, count]) => ({
                category: category as EntryCategory,
                label: CATEGORY_CONFIG[category as EntryCategory].label,
                count,
                color: CATEGORY_COLORS[category as EntryCategory],
                emoji: CATEGORY_CONFIG[category as EntryCategory].emoji,
            }))
            .sort((a, b) => b.count - a.count);
    }, [entries]);

    // Weekly comparison data
    const weeklyData = useMemo<{
        data: WeeklyData[];
        change: number;
        trend: "up" | "down" | "stable";
    }>(() => {
        const today = new Date();
        const thisWeekStart = startOfWeek(today, { weekStartsOn: 1 });
        const lastWeekStart = addWeeks(thisWeekStart, -1);

        const thisWeekDays = getWeekDays(thisWeekStart, 1);
        const lastWeekDays = getWeekDays(lastWeekStart, 1);

        const data: WeeklyData[] = thisWeekDays.map((day, i) => {
            const thisWeekDate = toDateString(day);
            const lastWeekDate = toDateString(lastWeekDays[i]);

            return {
                day: format(day, "EEE"),
                thisWeek: entries.filter((e) => e.date === thisWeekDate).length,
                lastWeek: entries.filter((e) => e.date === lastWeekDate).length,
            };
        });

        const thisWeekTotal = data.reduce((sum, d) => sum + d.thisWeek, 0);
        const lastWeekTotal = data.reduce((sum, d) => sum + d.lastWeek, 0);

        let change = 0;
        let trend: "up" | "down" | "stable" = "stable";

        if (lastWeekTotal > 0) {
            change = Math.round(((thisWeekTotal - lastWeekTotal) / lastWeekTotal) * 100);
            trend = change > 0 ? "up" : change < 0 ? "down" : "stable";
        } else if (thisWeekTotal > 0) {
            change = 100;
            trend = "up";
        }

        return { data, change, trend };
    }, [entries]);

    // Mood trends (last 14 days)
    const moodData = useMemo<MoodData[]>(() => {
        const days: MoodData[] = [];

        for (let i = 13; i >= 0; i--) {
            const date = toDateString(subDays(new Date(), i));
            const dayEntries = entries.filter((e) => e.date === date);

            const moodCounts = { fire: 0, happy: 0, neutral: 0, sad: 0 };
            dayEntries.forEach((e) => {
                moodCounts[e.mood]++;
            });

            days.push({
                date: format(parseDate(date), "d"),
                ...moodCounts,
            });
        }

        return days;
    }, [entries]);

    // Activity heatmap (last 12 weeks)
    const heatmapData = useMemo<HeatmapCell[][]>(() => {
        const weeks: HeatmapCell[][] = [];

        for (let w = 11; w >= 0; w--) {
            const weekStart = subDays(new Date(), w * 7 + 6);
            const weekDays = getWeekDays(weekStart, 1);

            const week: HeatmapCell[] = weekDays.map((day) => {
                const dateStr = toDateString(day);
                const count = entries.filter((e) => e.date === dateStr).length;

                let level: 0 | 1 | 2 | 3 | 4 = 0;
                if (count >= 5) level = 4;
                else if (count >= 3) level = 3;
                else if (count >= 2) level = 2;
                else if (count >= 1) level = 1;

                return { date: dateStr, count, level };
            });

            weeks.push(week);
        }

        return weeks;
    }, [entries]);

    if (isLoading) {
        return (
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Dashboard</h1>
                    <p className={styles.subtitle}>Your growth analytics</p>
                </div>
                <div className={styles.statsGrid}>
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className={styles.statCard}>
                            <div className={cn(styles.loadingSkeleton, "w-10 h-10")} />
                            <div className={cn(styles.loadingSkeleton, "w-16 h-8")} />
                            <div className={cn(styles.loadingSkeleton, "w-20 h-4")} />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (entries.length === 0) {
        return (
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Dashboard</h1>
                    <p className={styles.subtitle}>Your growth analytics</p>
                </div>
                <div className={styles.emptyState}>
                    <div className={styles.emptyStateIcon}>
                        <BarChart3 className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className={styles.emptyStateTitle}>No data yet</h3>
                    <p className={styles.emptyStateText}>
                        Start adding entries to see your analytics
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            {/* Header */}
            <header className={styles.header}>
                <h1 className={styles.title}>Dashboard</h1>
                <p className={styles.subtitle}>Your growth analytics</p>
            </header>

            {/* Stats Cards */}
            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={cn(styles.statCardIcon, "bg-habit-blue/20")}>
                        <Calendar className="w-5 h-5 text-habit-blue" />
                    </div>
                    <div className={styles.statCardValue}>{stats.totalDays}</div>
                    <div className={styles.statCardLabel}>Active Days</div>
                </div>

                <div className={styles.statCard}>
                    <div className={cn(styles.statCardIcon, "bg-habit-orange/20")}>
                        <Flame className="w-5 h-5 text-habit-orange" />
                    </div>
                    <div className={styles.statCardValue}>{stats.currentStreak}</div>
                    <div className={styles.statCardLabel}>Current Streak</div>
                </div>

                <div className={styles.statCard}>
                    <div className={cn(styles.statCardIcon, "bg-habit-purple/20")}>
                        <Trophy className="w-5 h-5 text-habit-purple" />
                    </div>
                    <div className={styles.statCardValue}>{stats.longestStreak}</div>
                    <div className={styles.statCardLabel}>Longest Streak</div>
                </div>

                <div className={styles.statCard}>
                    <div className={cn(styles.statCardIcon, "bg-habit-green/20")}>📝</div>
                    <div className={styles.statCardValue}>{stats.totalEntries}</div>
                    <div className={styles.statCardLabel}>Total Entries</div>
                </div>
            </div>

            {/* Charts Grid */}
            <div className={styles.chartsGrid}>
                {/* Category Distribution */}
                <div className={styles.chartCard}>
                    <h3 className={styles.chartTitle}>Category Distribution</h3>
                    <div className={styles.chartContainer}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={40}
                                    outerRadius={70}
                                    paddingAngle={2}
                                    dataKey="count"
                                >
                                    {categoryData.map((entry) => (
                                        <Cell key={entry.category} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "var(--color-card)",
                                        border: "1px solid var(--color-border)",
                                        borderRadius: "0.5rem",
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className={styles.legend}>
                        {categoryData.map((item) => (
                            <div key={item.category} className={styles.legendItem}>
                                <div
                                    className={styles.legendDot}
                                    style={{ backgroundColor: item.color }}
                                />
                                <span>
                                    {item.emoji} {item.count}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Weekly Comparison */}
                <div className={styles.chartCard}>
                    <h3 className={styles.chartTitle}>Weekly Comparison</h3>
                    <div className={styles.chartContainer}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={weeklyData.data}>
                                <XAxis
                                    dataKey="day"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
                                />
                                <YAxis hide />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "var(--color-card)",
                                        border: "1px solid var(--color-border)",
                                        borderRadius: "0.5rem",
                                    }}
                                />
                                <Bar
                                    dataKey="lastWeek"
                                    fill="rgba(255, 255, 255, 0.2)"
                                    radius={[4, 4, 0, 0]}
                                    name="Last Week"
                                />
                                <Bar
                                    dataKey="thisWeek"
                                    fill="#3b82f6"
                                    radius={[4, 4, 0, 0]}
                                    name="This Week"
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className={styles.weeklyComparison}>
                        {weeklyData.trend === "up" && (
                            <TrendingUp className={cn("w-4 h-4", styles.trendUp)} />
                        )}
                        {weeklyData.trend === "down" && (
                            <TrendingDown className={cn("w-4 h-4", styles.trendDown)} />
                        )}
                        {weeklyData.trend === "stable" && (
                            <Minus className={cn("w-4 h-4", styles.trendStable)} />
                        )}
                        <span
                            className={cn(
                                styles.trendLabel,
                                weeklyData.trend === "up" && styles.trendUp,
                                weeklyData.trend === "down" && styles.trendDown,
                                weeklyData.trend === "stable" && styles.trendStable
                            )}
                        >
                            {weeklyData.change >= 0 ? "+" : ""}
                            {weeklyData.change}% vs last week
                        </span>
                    </div>
                </div>

                {/* Mood Trends */}
                <div className={styles.chartCard}>
                    <h3 className={styles.chartTitle}>Mood Trends (14 Days)</h3>
                    <div className={styles.chartContainer}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={moodData}>
                                <XAxis
                                    dataKey="date"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: "var(--color-muted-foreground)", fontSize: 10 }}
                                />
                                <YAxis hide />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "var(--color-card)",
                                        border: "1px solid var(--color-border)",
                                        borderRadius: "0.5rem",
                                    }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="fire"
                                    stroke={MOOD_COLORS.fire}
                                    strokeWidth={2}
                                    dot={false}
                                    name={`${getMoodEmoji("fire")} On Fire`}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="happy"
                                    stroke={MOOD_COLORS.happy}
                                    strokeWidth={2}
                                    dot={false}
                                    name={`${getMoodEmoji("happy")} Happy`}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="neutral"
                                    stroke={MOOD_COLORS.neutral}
                                    strokeWidth={2}
                                    dot={false}
                                    name={`${getMoodEmoji("neutral")} Okay`}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="sad"
                                    stroke={MOOD_COLORS.sad}
                                    strokeWidth={2}
                                    dot={false}
                                    name={`${getMoodEmoji("sad")} Low`}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                    <div className={styles.legend}>
                        {(["fire", "happy", "neutral", "sad"] as Mood[]).map((mood) => (
                            <div key={mood} className={styles.legendItem}>
                                <div
                                    className={styles.legendDot}
                                    style={{ backgroundColor: MOOD_COLORS[mood] }}
                                />
                                <span>{getMoodEmoji(mood)}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Activity Heatmap */}
                <div className={cn(styles.chartCard, styles.chartCardFull)}>
                    <h3 className={styles.chartTitle}>Activity (12 Weeks)</h3>
                    <div className={styles.heatmapContainer}>
                        <div className={styles.heatmapGrid}>
                            {heatmapData.map((week, weekIndex) => (
                                <div key={weekIndex} className="flex flex-col gap-[3px]">
                                    {week.map((cell) => (
                                        <div
                                            key={cell.date}
                                            className={styles.heatmapCell}
                                            style={{ backgroundColor: HEATMAP_COLORS[cell.level] }}
                                            title={`${cell.date}: ${cell.count} entries`}
                                        />
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className={styles.legend}>
                        <span className={styles.legendItem}>Less</span>
                        {HEATMAP_COLORS.map((color, i) => (
                            <div
                                key={i}
                                className={styles.legendDot}
                                style={{ backgroundColor: color }}
                            />
                        ))}
                        <span className={styles.legendItem}>More</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
