import { useState, useEffect } from "react";
import { useAppStore } from "@/stores/appStore";
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, Textarea } from "@/components/ui";
import { StickyNote } from "@/components/sticky-notes";
import { StreakCard, StreakBadge } from "@/components/dashboard";
import { getRelativeDay } from "@/utils/dates";
import { CATEGORY_CONFIG, MOOD_CONFIG } from "@/utils/constants";
import type { EntryCategory, Mood } from "@/types";
import { Plus, Sparkles, Target, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

// ============================================
// Today View - Premium Redesign
// ============================================

const CATEGORIES: EntryCategory[] = [
    "learning-technology",
    "learning-finance",
    "learning-other",
    "exercise",
    "motivation",
    "reflection",
];

const MOODS: Mood[] = ["fire", "happy", "neutral", "sad"];

export function TodayView() {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedEntry, setSelectedEntry] = useState<string | null>(null);
    const [category, setCategory] = useState<EntryCategory>("learning-technology");
    const [content, setContent] = useState("");
    const [mood, setMood] = useState<Mood>("happy");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        todayEntries,
        streaks,
        isLoading,
        addEntry,
        togglePin,
        toggleArchive,
        loadTodayEntries,
    } = useAppStore();

    useEffect(() => {
        loadTodayEntries();
    }, [loadTodayEntries]);

    const overallStreak = streaks.find((s) => s.type === "overall");
    const currentStreakCount = overallStreak?.currentCount || 0;
    const longestStreakCount = overallStreak?.longestCount || 0;

    const handleSubmit = async () => {
        if (!content.trim()) return;

        setIsSubmitting(true);
        try {
            await addEntry({
                category,
                content: content.trim(),
                mood,
                title: "",
                tags: [],
                timeSpentMinutes: null,
            });
            setContent("");
            setIsFormOpen(false);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <div className="w-12 h-12 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
                <p className="text-muted-foreground">Loading your growth journey...</p>
            </div>
        );
    }

    const visibleEntries = todayEntries.filter((e) => !e.isArchived);
    const pinnedEntries = visibleEntries.filter((e) => e.isPinned);
    const regularEntries = visibleEntries.filter((e) => !e.isPinned);

    return (
        <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-8">
            {/* Hero Header */}
            <header className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="space-y-1">
                        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                            {getRelativeDay(new Date())}
                        </h1>
                        <p className="text-muted-foreground">
                            {visibleEntries.length === 0
                                ? "Start capturing your growth journey ✨"
                                : `${visibleEntries.length} ${visibleEntries.length === 1 ? "entry" : "entries"} logged`}
                        </p>
                    </div>

                    <StreakBadge count={currentStreakCount} />
                </div>

                {/* Streak Card */}
                {(currentStreakCount > 0 || longestStreakCount > 0) && (
                    <StreakCard
                        currentStreak={currentStreakCount}
                        longestStreak={longestStreakCount}
                    />
                )}
            </header>

            {/* Quick Add Button */}
            <Button
                size="xl"
                className="w-full group"
                onClick={() => setIsFormOpen(true)}
            >
                <Plus className="w-5 h-5 transition-transform group-hover:rotate-90" />
                <span>Add Entry</span>
                <Sparkles className="w-4 h-4 ml-1 opacity-60" />
            </Button>

            {/* Entries Grid */}
            <div className="space-y-6">
                {pinnedEntries.length > 0 && (
                    <section className="space-y-4">
                        <h2 className="text-lg font-semibold flex items-center gap-2">
                            <span>📌 Pinned</span>
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {pinnedEntries.map((entry, index) => (
                                <StickyNote
                                    key={entry.id}
                                    entry={entry}
                                    index={index}
                                    onClick={() => setSelectedEntry(entry.id)}
                                    onPin={() => togglePin(entry.id)}
                                    onArchive={() => toggleArchive(entry.id)}
                                />
                            ))}
                        </div>
                    </section>
                )}

                {regularEntries.length > 0 && (
                    <section className="space-y-4">
                        {pinnedEntries.length > 0 && (
                            <h2 className="text-lg font-semibold">Today's Notes</h2>
                        )}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {regularEntries.map((entry, index) => (
                                <StickyNote
                                    key={entry.id}
                                    entry={entry}
                                    index={index}
                                    onClick={() => setSelectedEntry(entry.id)}
                                    onPin={() => togglePin(entry.id)}
                                    onArchive={() => toggleArchive(entry.id)}
                                />
                            ))}
                        </div>
                    </section>
                )}

                {/* Empty State */}
                {visibleEntries.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-16 space-y-6 text-center">
                        <div className="relative">
                            <div className="absolute inset-0 bg-primary-500/20 rounded-full blur-2xl animate-pulse" />
                            <div className="relative p-6 rounded-2xl bg-gradient-to-br from-primary-500/10 to-accent-500/10 border border-primary-500/20">
                                <Target className="w-12 h-12 text-primary-400" />
                            </div>
                        </div>
                        <div className="space-y-2 max-w-sm">
                            <h3 className="text-xl font-semibold">Ready to grow?</h3>
                            <p className="text-muted-foreground">
                                Capture your first learning, reflection, or motivation for today.
                                Every small step counts! 🚀
                            </p>
                        </div>
                        <Button onClick={() => setIsFormOpen(true)} size="lg">
                            <Zap className="w-4 h-4 mr-2" />
                            Create First Entry
                        </Button>
                    </div>
                )}
            </div>

            {/* Add Entry Dialog */}
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="text-xl">New Entry</DialogTitle>
                        <DialogDescription>
                            What did you learn or accomplish today?
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6 py-4">
                        {/* Category Selection */}
                        <div className="space-y-3">
                            <label className="text-sm font-medium text-foreground">Category</label>
                            <div className="grid grid-cols-3 gap-2">
                                {CATEGORIES.map((cat) => (
                                    <button
                                        key={cat}
                                        type="button"
                                        onClick={() => setCategory(cat)}
                                        className={cn(
                                            "flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all",
                                            category === cat
                                                ? "border-primary-500 bg-primary-500/10"
                                                : "border-border hover:border-muted-foreground/30 hover:bg-muted"
                                        )}
                                    >
                                        <span className="text-2xl">{CATEGORY_CONFIG[cat].emoji}</span>
                                        <span className="text-xs text-muted-foreground">
                                            {CATEGORY_CONFIG[cat].label}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Content */}
                        <div className="space-y-3">
                            <label className="text-sm font-medium text-foreground">
                                What's on your mind?
                            </label>
                            <Textarea
                                placeholder="Share your thoughts, learnings, or reflections..."
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                rows={4}
                                className="resize-none"
                            />
                        </div>

                        {/* Mood Selection */}
                        <div className="space-y-3">
                            <label className="text-sm font-medium text-foreground">
                                How are you feeling?
                            </label>
                            <div className="flex gap-2">
                                {MOODS.map((m) => (
                                    <button
                                        key={m}
                                        type="button"
                                        onClick={() => setMood(m)}
                                        className={cn(
                                            "flex-1 flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all",
                                            mood === m
                                                ? "border-primary-500 bg-primary-500/10 scale-105"
                                                : "border-border hover:border-muted-foreground/30 hover:bg-muted"
                                        )}
                                    >
                                        <span className="text-2xl">{MOOD_CONFIG[m].emoji}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4 border-t border-border">
                        <Button
                            variant="ghost"
                            className="flex-1"
                            onClick={() => setIsFormOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            className="flex-1"
                            onClick={handleSubmit}
                            isLoading={isSubmitting}
                            disabled={!content.trim()}
                        >
                            Save Entry
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* View Entry Dialog */}
            <Dialog open={!!selectedEntry} onOpenChange={() => setSelectedEntry(null)}>
                <DialogContent>
                    {(() => {
                        const entry = todayEntries.find((e) => e.id === selectedEntry);
                        if (!entry) return null;

                        return (
                            <>
                                <DialogHeader>
                                    <div className="flex items-center gap-2">
                                        <span className="text-2xl">{CATEGORY_CONFIG[entry.category].emoji}</span>
                                        <span className="text-xl">{MOOD_CONFIG[entry.mood].emoji}</span>
                                    </div>
                                    <DialogTitle>{entry.title || "Entry Details"}</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                                        {entry.content}
                                    </p>
                                    {entry.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {entry.tags.map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="px-2 py-1 text-sm rounded-full bg-muted text-muted-foreground"
                                                >
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </>
                        );
                    })()}
                </DialogContent>
            </Dialog>
        </div>
    );
}
