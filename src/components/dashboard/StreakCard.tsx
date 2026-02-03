import { cn } from "@/lib/utils";
import { Flame, Trophy } from "lucide-react";

interface StreakCardProps {
    currentStreak: number;
    longestStreak: number;
    label?: string;
}

export function StreakCard({ currentStreak, longestStreak, label = "Day Streak" }: StreakCardProps) {
    const isNewRecord = currentStreak === longestStreak && currentStreak > 0;
    const percentage = longestStreak > 0 ? (currentStreak / longestStreak) * 100 : 0;

    return (
        <div className={cn(
            "relative overflow-hidden rounded-2xl border p-6",
            "bg-gradient-to-br from-accent-500/10 via-card to-accent-600/5",
            "border-accent-500/30",
            isNewRecord && "border-accent-500/60 shadow-lg shadow-accent-500/20"
        )}>
            {/* Background fire glow */}
            {currentStreak > 0 && (
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-accent-500/20 rounded-full blur-3xl" />
            )}

            {/* Content */}
            <div className="relative z-10">
                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                    <div className={cn(
                        "p-3 rounded-xl",
                        currentStreak > 0 ? "bg-accent-500/20" : "bg-muted"
                    )}>
                        <Flame className={cn(
                            "w-6 h-6",
                            currentStreak > 0 ? "text-accent-500 fire-glow" : "text-muted-foreground"
                        )} />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">{label}</p>
                        <div className="flex items-baseline gap-2">
                            <span className={cn(
                                "text-4xl font-bold",
                                currentStreak > 0 ? "text-accent-500" : "text-muted-foreground"
                            )}>
                                {currentStreak}
                            </span>
                            <span className="text-sm text-muted-foreground">days</span>
                        </div>
                    </div>
                </div>

                {/* Progress bar */}
                <div className="h-2 bg-muted rounded-full overflow-hidden mb-3">
                    <div
                        className={cn(
                            "h-full rounded-full transition-all duration-1000 ease-out",
                            currentStreak > 0
                                ? "bg-gradient-to-r from-accent-400 via-accent-500 to-red-500"
                                : "bg-muted-foreground/30"
                        )}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                        Best: <span className="font-medium text-foreground">{longestStreak}</span> days
                    </span>

                    {isNewRecord && (
                        <div className="flex items-center gap-1 text-accent-500">
                            <Trophy className="w-4 h-4" />
                            <span className="font-medium">New Record!</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// Mini streak indicator for header
export function StreakBadge({ count }: { count: number }) {
    if (count === 0) return null;

    return (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-500/20 border border-accent-500/30">
            <Flame className="w-4 h-4 text-accent-500 fire-glow" />
            <span className="text-sm font-semibold text-accent-500">{count}</span>
            <span className="text-xs text-muted-foreground">day streak</span>
        </div>
    );
}
