import { cn } from "@/lib/utils";

// ============================================
// Progress Ring Component (Habitify-style)
// ============================================

interface ProgressRingProps {
    progress: number; // 0-100
    size?: number;
    strokeWidth?: number;
    color?: string;
    bgColor?: string;
    children?: React.ReactNode;
}

export function ProgressRing({
    progress,
    size = 48,
    strokeWidth = 4,
    color = "#3b82f6",
    bgColor = "rgba(255,255,255,0.1)",
    children,
}: ProgressRingProps) {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (progress / 100) * circumference;

    return (
        <div className="relative inline-flex items-center justify-center">
            <svg
                className="progress-ring"
                width={size}
                height={size}
            >
                {/* Background circle */}
                <circle
                    stroke={bgColor}
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                />
                {/* Progress circle */}
                <circle
                    className="progress-ring-circle"
                    stroke={color}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    fill="transparent"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                    style={{
                        strokeDasharray: circumference,
                        strokeDashoffset: offset,
                    }}
                />
            </svg>
            {children && (
                <div className="absolute inset-0 flex items-center justify-center">
                    {children}
                </div>
            )}
        </div>
    );
}

// ============================================
// Streak Counter (Habitify-style fire icon)
// ============================================

interface StreakCounterProps {
    count: number;
    size?: "sm" | "md" | "lg";
}

export function StreakCounter({ count, size = "md" }: StreakCounterProps) {
    if (count === 0) return null;

    const sizeClasses = {
        sm: "text-sm gap-1",
        md: "text-base gap-1.5",
        lg: "text-lg gap-2",
    };

    const iconSizes = {
        sm: "text-base",
        md: "text-xl",
        lg: "text-2xl",
    };

    return (
        <div className={cn("flex items-center font-semibold text-streak", sizeClasses[size])}>
            <span className={cn("animate-flame", iconSizes[size])}>🔥</span>
            <span className="tabular-nums">{count}</span>
        </div>
    );
}

// ============================================
// Daily Progress Summary (Habitify-style)
// ============================================

interface DailyProgressProps {
    completed: number;
    total: number;
    streak: number;
}

export function DailyProgress({ completed, total, streak }: DailyProgressProps) {
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return (
        <div className="flex items-center gap-6 p-5 bg-card rounded-2xl border border-border/50">
            {/* Progress Ring */}
            <ProgressRing
                progress={percentage}
                size={72}
                strokeWidth={6}
                color={percentage === 100 ? "#22c55e" : "#3b82f6"}
            >
                <span className="text-lg font-bold">{percentage}%</span>
            </ProgressRing>

            {/* Stats */}
            <div className="flex-1">
                <p className="text-2xl font-bold">
                    {completed}<span className="text-muted-foreground font-normal">/{total}</span>
                </p>
                <p className="text-sm text-muted-foreground">habits completed</p>
            </div>

            {/* Streak */}
            {streak > 0 && (
                <div className="text-right">
                    <StreakCounter count={streak} size="lg" />
                    <p className="text-xs text-muted-foreground mt-1">day streak</p>
                </div>
            )}
        </div>
    );
}
