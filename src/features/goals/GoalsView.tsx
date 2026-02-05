import { useState, useEffect } from "react";
import { Plus, Archive, Check, Target } from "lucide-react";
import { useAppStore } from "@/stores/appStore";
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui";
import { ProgressRing } from "@/components/dashboard/StreakCard";
import { formatShortDate } from "@/utils/dates";
import { CATEGORY_CONFIG, ACHIEVEMENT_CONFIG } from "@/utils/constants";
import type { Goal, EntryCategory, AchievementType } from "@/types";
import { cn } from "@/lib/utils";
import styles from "./GoalsView.module.css";

// ============================================
// Types
// ============================================

type TabType = "active" | "completed" | "achievements";

const ALL_CATEGORIES: (EntryCategory | "any")[] = [
    "any",
    "learning-technology",
    "learning-finance",
    "learning-other",
    "exercise",
    "motivation",
    "reflection",
];

const TARGET_DAYS_OPTIONS = [7, 14, 30, 60, 90];

// ============================================
// Goals View Component
// ============================================

export function GoalsView() {
    const [activeTab, setActiveTab] = useState<TabType>("active");
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        targetDays: 30,
        category: "any" as EntryCategory | "any",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        activeGoals,
        achievements,
        addGoal,
        archiveGoal,
        loadActiveGoals,
        loadAchievements,
        checkAndUnlockAchievements,
    } = useAppStore();

    // Load data on mount
    useEffect(() => {
        loadActiveGoals();
        loadAchievements();
        checkAndUnlockAchievements();
    }, [loadActiveGoals, loadAchievements, checkAndUnlockAchievements]);

    // Filter goals
    const completedGoals = activeGoals.filter((g) => g.isCompleted);
    const inProgressGoals = activeGoals.filter((g) => !g.isCompleted);

    // Handle form submit
    const handleSubmit = async () => {
        if (!formData.title.trim()) return;

        setIsSubmitting(true);
        try {
            await addGoal(formData.title.trim(), formData.targetDays, formData.category);
            setFormData({ title: "", description: "", targetDays: 30, category: "any" });
            setIsFormOpen(false);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Get all achievement types
    const allAchievementTypes = Object.keys(ACHIEVEMENT_CONFIG) as AchievementType[];

    return (
        <div className={styles.container}>
            {/* Header */}
            <header className={styles.header}>
                <div className={styles.headerText}>
                    <h1>Goals & Achievements</h1>
                    <p>Set goals and track your progress</p>
                </div>
                <Button variant="default" onClick={() => setIsFormOpen(true)}>
                    <Plus className="w-4 h-4" />
                    <span>New Goal</span>
                </Button>
            </header>

            {/* Tabs */}
            <div className={styles.tabs}>
                <button
                    className={cn(styles.tab, activeTab === "active" && styles.tabActive)}
                    onClick={() => setActiveTab("active")}
                >
                    Active ({inProgressGoals.length})
                </button>
                <button
                    className={cn(styles.tab, activeTab === "completed" && styles.tabActive)}
                    onClick={() => setActiveTab("completed")}
                >
                    Completed ({completedGoals.length})
                </button>
                <button
                    className={cn(styles.tab, activeTab === "achievements" && styles.tabActive)}
                    onClick={() => setActiveTab("achievements")}
                >
                    Badges ({achievements.length})
                </button>
            </div>

            {/* Content */}
            {activeTab === "active" && (
                <div>
                    {inProgressGoals.length > 0 ? (
                        <div className={styles.goalsGrid}>
                            {inProgressGoals.map((goal) => (
                                <GoalCard
                                    key={goal.id}
                                    goal={goal}
                                    onArchive={() => archiveGoal(goal.id)}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className={styles.emptyState}>
                            <div className={styles.emptyStateIcon}>🎯</div>
                            <h3 className={styles.emptyStateTitle}>No active goals</h3>
                            <p className={styles.emptyStateText}>
                                Create a goal to start tracking your progress
                            </p>
                            <Button variant="default" onClick={() => setIsFormOpen(true)}>
                                <Plus className="w-4 h-4" />
                                <span>Create Goal</span>
                            </Button>
                        </div>
                    )}
                </div>
            )}

            {activeTab === "completed" && (
                <div>
                    {completedGoals.length > 0 ? (
                        <div className={styles.goalsGrid}>
                            {completedGoals.map((goal) => (
                                <GoalCard
                                    key={goal.id}
                                    goal={goal}
                                    isCompleted
                                    onArchive={() => archiveGoal(goal.id)}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className={styles.emptyState}>
                            <div className={styles.emptyStateIcon}>🏆</div>
                            <h3 className={styles.emptyStateTitle}>No completed goals yet</h3>
                            <p className={styles.emptyStateText}>
                                Keep working on your active goals!
                            </p>
                        </div>
                    )}
                </div>
            )}

            {activeTab === "achievements" && (
                <div className={styles.achievementsGrid}>
                    {allAchievementTypes.map((type) => {
                        const config = ACHIEVEMENT_CONFIG[type];
                        const unlocked = achievements.find((a) => a.type === type);

                        return (
                            <AchievementBadge
                                key={type}
                                emoji={config.emoji}
                                title={config.title}
                                description={config.description}
                                unlockedAt={unlocked?.unlockedAt}
                                isLocked={!unlocked}
                            />
                        );
                    })}
                </div>
            )}

            {/* Create Goal Dialog */}
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent className="sm:max-w-md bg-card border-border">
                    <DialogHeader>
                        <DialogTitle>Create New Goal</DialogTitle>
                        <DialogDescription>
                            Set a goal and track your progress over time
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-4 space-y-4">
                        {/* Title */}
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Goal Title</label>
                            <input
                                type="text"
                                placeholder="e.g., Learn TypeScript basics"
                                value={formData.title}
                                onChange={(e) =>
                                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                                }
                                className={styles.formInput}
                            />
                        </div>

                        {/* Target Days */}
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Target Duration</label>
                            <div className={styles.targetDaysGrid}>
                                {TARGET_DAYS_OPTIONS.map((days) => (
                                    <button
                                        key={days}
                                        type="button"
                                        onClick={() =>
                                            setFormData((prev) => ({ ...prev, targetDays: days }))
                                        }
                                        className={cn(
                                            styles.targetDayButton,
                                            formData.targetDays === days && styles.targetDayButtonActive
                                        )}
                                    >
                                        {days}d
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Category */}
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Category (Optional)</label>
                            <div className={styles.categoryChips}>
                                {ALL_CATEGORIES.map((cat) => (
                                    <button
                                        key={cat}
                                        type="button"
                                        onClick={() =>
                                            setFormData((prev) => ({ ...prev, category: cat }))
                                        }
                                        className={cn(
                                            styles.categoryChip,
                                            formData.category === cat && styles.categoryChipActive
                                        )}
                                    >
                                        {cat === "any" ? (
                                            "Any"
                                        ) : (
                                            <>
                                                <span>{CATEGORY_CONFIG[cat].emoji}</span>
                                                <span>{CATEGORY_CONFIG[cat].label}</span>
                                            </>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className={styles.formActions}>
                        <Button variant="ghost" className="flex-1" onClick={() => setIsFormOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            variant="default"
                            className="flex-1"
                            onClick={handleSubmit}
                            isLoading={isSubmitting}
                            disabled={!formData.title.trim()}
                        >
                            Create Goal
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}

// ============================================
// Goal Card Component
// ============================================

interface GoalCardProps {
    goal: Goal;
    isCompleted?: boolean;
    onArchive: () => void;
}

function GoalCard({ goal, isCompleted, onArchive }: GoalCardProps) {
    const progress = Math.round((goal.completedDays / goal.targetDays) * 100);
    const remaining = goal.targetDays - goal.completedDays;

    return (
        <div className={cn(styles.goalCard, isCompleted && styles.goalCardCompleted)}>
            <div className={styles.goalCardHeader}>
                <div>
                    <h3 className={styles.goalCardTitle}>{goal.title}</h3>
                    {goal.description && (
                        <p className={styles.goalCardDesc}>{goal.description}</p>
                    )}
                </div>
                <div className={styles.goalCardProgress}>
                    <ProgressRing
                        progress={progress}
                        size={56}
                        strokeWidth={5}
                        color={isCompleted ? "#22c55e" : "#3b82f6"}
                    >
                        {isCompleted ? (
                            <Check className="w-5 h-5 text-success" />
                        ) : (
                            <span className="text-sm font-bold">{progress}%</span>
                        )}
                    </ProgressRing>
                    <div className={styles.goalCardStats}>
                        <div className={styles.goalCardDays}>
                            {goal.completedDays}/{goal.targetDays}
                        </div>
                        <div className={styles.goalCardTarget}>
                            {isCompleted ? "Completed!" : `${remaining} days left`}
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.goalCardFooter}>
                <div className={styles.goalCardCategory}>
                    {goal.category === "any" ? (
                        <>
                            <Target className="w-3 h-3" />
                            <span>Any Category</span>
                        </>
                    ) : (
                        <>
                            <span>{CATEGORY_CONFIG[goal.category].emoji}</span>
                            <span>{CATEGORY_CONFIG[goal.category].label}</span>
                        </>
                    )}
                </div>
                <div className={styles.goalCardDate}>
                    Started {formatShortDate(goal.startDate)}
                </div>
                <div className={styles.goalCardActions}>
                    <button
                        onClick={onArchive}
                        className={styles.goalCardAction}
                        title="Archive goal"
                    >
                        <Archive className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}

// ============================================
// Achievement Badge Component
// ============================================

interface AchievementBadgeProps {
    emoji: string;
    title: string;
    description: string;
    unlockedAt?: Date;
    isLocked: boolean;
}

function AchievementBadge({
    emoji,
    title,
    description,
    unlockedAt,
    isLocked,
}: AchievementBadgeProps) {
    return (
        <div
            className={cn(
                styles.achievementBadge,
                isLocked ? styles.achievementBadgeLocked : styles.achievementBadgeUnlocked
            )}
        >
            <div className={styles.achievementEmoji}>{emoji}</div>
            <div className={styles.achievementTitle}>{title}</div>
            <div className={styles.achievementDesc}>{description}</div>
            {unlockedAt && (
                <div className={styles.achievementDate}>
                    {formatShortDate(unlockedAt)}
                </div>
            )}
        </div>
    );
}
