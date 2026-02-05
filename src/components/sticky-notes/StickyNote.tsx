import { cn } from "@/lib/utils";
import type { Entry, EntryCategory } from "@/types";
import { getCategoryEmoji, getMoodEmoji } from "@/utils/constants";
import { Check } from "lucide-react";

interface HabitCardProps {
    entry: Entry;
    onClick?: () => void;
    onToggle?: () => void;
    index?: number;
}

// Colorful sticky note backgrounds - like real Post-it notes
const STICKY_NOTE_COLORS: Record<EntryCategory, string> = {
    "learning-technology": "sticky-blue",
    "learning-finance": "sticky-yellow",
    "learning-other": "sticky-purple",
    "exercise": "sticky-green",
    "motivation": "sticky-orange",
    "reflection": "sticky-pink",
};

export function HabitCard({ entry, onClick, onToggle, index = 0 }: HabitCardProps) {
    const stickyColor = STICKY_NOTE_COLORS[entry.category] || "sticky-yellow";
    const isCompleted = true; // All entries are "completed" since they exist

    return (
        <div
            className={cn(
                "sticky-note cursor-pointer animate-fade-up",
                stickyColor,
                isCompleted && "opacity-95",
                entry.isPinned && "pushpin"
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
            {/* Header with category and mood */}
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <span className="text-xl">{getCategoryEmoji(entry.category)}</span>
                    <span className="text-lg">{getMoodEmoji(entry.mood)}</span>
                </div>

                {/* Checkmark button */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggle?.();
                    }}
                    className={cn(
                        "w-7 h-7 rounded-full flex items-center justify-center",
                        "transition-all duration-200",
                        isCompleted
                            ? "bg-green-600 text-white"
                            : "bg-white/50 hover:bg-white/70"
                    )}
                >
                    {isCompleted && <Check className="w-4 h-4 animate-check" />}
                </button>
            </div>

            {/* Content */}
            <div className="font-handwriting-alt">
                {entry.title && (
                    <h3 className="font-bold text-lg mb-1 line-clamp-1">
                        {entry.title}
                    </h3>
                )}
                <p className="text-sm leading-relaxed line-clamp-2">
                    {entry.content}
                </p>
            </div>
        </div>
    );
}

// Re-export as EntryCard for compatibility
export { HabitCard as EntryCard };
