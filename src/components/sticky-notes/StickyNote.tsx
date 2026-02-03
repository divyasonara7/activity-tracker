import { cn } from "@/lib/utils";
import type { Entry } from "@/types";
import { getCategoryEmoji, getMoodEmoji } from "@/utils/constants";
import { Pin, Archive } from "lucide-react";

interface StickyNoteProps {
    entry: Entry;
    onClick?: () => void;
    onPin?: () => void;
    onArchive?: () => void;
    index?: number;
}

const CATEGORY_COLORS: Record<string, string> = {
    "learning-technology": "from-indigo-500/20 to-indigo-600/10 border-indigo-500/40",
    "learning-finance": "from-amber-500/20 to-amber-600/10 border-amber-500/40",
    "learning-other": "from-purple-500/20 to-purple-600/10 border-purple-500/40",
    "exercise": "from-emerald-500/20 to-emerald-600/10 border-emerald-500/40",
    "motivation": "from-orange-500/20 to-orange-600/10 border-orange-500/40",
    "reflection": "from-pink-500/20 to-pink-600/10 border-pink-500/40",
};

const CATEGORY_ACCENT: Record<string, string> = {
    "learning-technology": "bg-indigo-500",
    "learning-finance": "bg-amber-500",
    "learning-other": "bg-purple-500",
    "exercise": "bg-emerald-500",
    "motivation": "bg-orange-500",
    "reflection": "bg-pink-500",
};

export function StickyNote({ entry, onClick, onPin, onArchive, index = 0 }: StickyNoteProps) {
    const colorClass = CATEGORY_COLORS[entry.category] || CATEGORY_COLORS["learning-technology"];
    const accentClass = CATEGORY_ACCENT[entry.category] || CATEGORY_ACCENT["learning-technology"];

    // Slight random rotation for organic feel
    const rotation = ((entry.id.charCodeAt(0) % 5) - 2) * 0.8;

    return (
        <article
            onClick={onClick}
            className={cn(
                "group relative overflow-hidden rounded-2xl border bg-gradient-to-br p-5 cursor-pointer",
                "transition-all duration-300 ease-out",
                "hover:scale-[1.03] hover:shadow-2xl hover:shadow-primary-500/10",
                "hover:-translate-y-1",
                "animate-slide-up",
                colorClass
            )}
            style={{
                transform: `rotate(${rotation}deg)`,
                animationDelay: `${index * 80}ms`,
            }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (onClick && (e.key === "Enter" || e.key === " ")) {
                    e.preventDefault();
                    onClick();
                }
            }}
        >
            {/* Accent bar */}
            <div className={cn("absolute top-0 left-0 right-0 h-1", accentClass)} />

            {/* Pin indicator */}
            {entry.isPinned && (
                <div className="absolute -top-1 -right-1 p-2">
                    <Pin className="w-4 h-4 text-primary-400 fill-primary-400 rotate-45" />
                </div>
            )}

            {/* Header */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <span className="text-2xl">{getCategoryEmoji(entry.category)}</span>
                    <span className="text-lg">{getMoodEmoji(entry.mood)}</span>
                </div>

                {/* Quick actions */}
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {onPin && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onPin();
                            }}
                            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                            aria-label={entry.isPinned ? "Unpin" : "Pin"}
                        >
                            <Pin className={cn("w-4 h-4", entry.isPinned && "fill-current text-primary-400")} />
                        </button>
                    )}
                    {onArchive && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onArchive();
                            }}
                            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                            aria-label="Archive"
                        >
                            <Archive className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>

            {/* Title */}
            {entry.title && (
                <h3 className="font-semibold text-foreground mb-2 line-clamp-1">
                    {entry.title}
                </h3>
            )}

            {/* Content */}
            <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                {entry.content}
            </p>

            {/* Tags */}
            {entry.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                    {entry.tags.slice(0, 3).map((tag) => (
                        <span
                            key={tag}
                            className="px-2 py-0.5 text-xs rounded-full bg-white/10 text-muted-foreground"
                        >
                            #{tag}
                        </span>
                    ))}
                </div>
            )}

            {/* Mood fire glow for "fire" mood */}
            {entry.mood === "fire" && (
                <div className="absolute -bottom-4 -right-4 text-4xl fire-glow opacity-50">
                    🔥
                </div>
            )}
        </article>
    );
}
