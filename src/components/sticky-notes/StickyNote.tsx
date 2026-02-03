import { cn } from "@/lib/utils";
import type { Entry } from "@/types";
import { getCategoryEmoji, getMoodEmoji } from "@/utils/constants";
import { Check } from "lucide-react";

interface HabitCardProps {
    entry: Entry;
    onClick?: () => void;
    onToggle?: () => void;
    index?: number;
}

// Habitify uses vibrant colors for each habit
const HABIT_COLORS: Record<string, { bg: string; text: string; ring: string }> = {
    "learning-technology": {
        bg: "bg-habit-blue/20",
        text: "text-habit-blue",
        ring: "ring-habit-blue",
    },
    "learning-finance": {
        bg: "bg-habit-yellow/20",
        text: "text-habit-yellow",
        ring: "ring-habit-yellow",
    },
    "learning-other": {
        bg: "bg-habit-purple/20",
        text: "text-habit-purple",
        ring: "ring-habit-purple",
    },
    "exercise": {
        bg: "bg-habit-green/20",
        text: "text-habit-green",
        ring: "ring-habit-green",
    },
    "motivation": {
        bg: "bg-habit-orange/20",
        text: "text-habit-orange",
        ring: "ring-habit-orange",
    },
    "reflection": {
        bg: "bg-habit-pink/20",
        text: "text-habit-pink",
        ring: "ring-habit-pink",
    },
};

export function HabitCard({ entry, onClick, onToggle, index = 0 }: HabitCardProps) {
    const colors = HABIT_COLORS[entry.category] || HABIT_COLORS["learning-technology"];
    const isCompleted = true; // All entries are "completed" since they exist

    return (
        <div
            className={cn(
                "habit-card flex items-center gap-4 cursor-pointer animate-fade-up",
                isCompleted && "habit-card-completed"
            )}
            style={{ animationDelay: `${index * 50}ms` }}
            onClick={onClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (onClick && (e.key === "Enter" || e.key === " ")) {
                    e.preventDefault();
                    onClick();
                }
            }}
        >
            {/* Color indicator / Check circle */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onToggle?.();
                }}
                className={cn(
                    "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center",
                    "transition-all duration-200",
                    isCompleted
                        ? "bg-success text-white"
                        : cn(colors.bg, colors.text, "ring-2", colors.ring)
                )}
            >
                {isCompleted ? (
                    <Check className="w-5 h-5 animate-check" />
                ) : (
                    <span className="text-lg">{getCategoryEmoji(entry.category)}</span>
                )}
            </button>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <span className="text-lg">{getCategoryEmoji(entry.category)}</span>
                    {entry.title && (
                        <h3 className="font-medium text-foreground truncate">
                            {entry.title}
                        </h3>
                    )}
                    <span className="text-sm">{getMoodEmoji(entry.mood)}</span>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-1 mt-0.5">
                    {entry.content}
                </p>
            </div>

            {/* Pin indicator */}
            {entry.isPinned && (
                <span className="text-primary-400">📌</span>
            )}
        </div>
    );
}

// Re-export as EntryCard for compatibility
export { HabitCard as EntryCard };
