import { useState, useEffect, useMemo } from "react";
import { useAppStore } from "@/stores/appStore";
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, Textarea } from "@/components/ui";
import { HabitCard } from "@/components/sticky-notes/StickyNote";
import { DailyProgress, StreakCounter } from "@/components/dashboard/StreakCard";
import { getRelativeDay } from "@/utils/dates";
import { CATEGORY_CONFIG, MOOD_CONFIG } from "@/utils/constants";
import { getDailyQuote } from "@/utils/quotes";
import type { EntryCategory, Mood } from "@/types";
import { Plus, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

// ============================================
// Today View - Habitify Style
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

// Category color mapping for Habitify-style
const CATEGORY_COLORS: Record<string, string> = {
    "learning-technology": "bg-habit-blue",
    "learning-finance": "bg-habit-yellow",
    "learning-other": "bg-habit-purple",
    "exercise": "bg-habit-green",
    "motivation": "bg-habit-orange",
    "reflection": "bg-habit-pink",
};

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
        loadTodayEntries,
    } = useAppStore();

    useEffect(() => {
        loadTodayEntries();
    }, [loadTodayEntries]);

    // Get today's pre-defined quote (same quote for the whole day)
    const dailyQuote = useMemo(() => getDailyQuote(), []);

    const overallStreak = streaks.find((s) => s.type === "overall");
    const currentStreakCount = overallStreak?.currentCount || 0;

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
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
                <div className="w-10 h-10 border-3 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
                <p className="text-muted-foreground">Loading habits...</p>
            </div>
        );
    }

    const visibleEntries = todayEntries.filter((e) => !e.isArchived);

    return (
        <div className="max-w-2xl mx-auto p-4 md:p-6 space-y-6">
            {/* Header */}
            <header className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-handwriting text-foreground doodle-underline">
                            {getRelativeDay(new Date())}
                        </h1>
                        <p className="text-sm text-muted-foreground mt-2 font-handwriting-alt">
                            ✨ Track your daily progress
                        </p>
                    </div>
                    <StreakCounter count={currentStreakCount} size="lg" />
                </div>

                {/* Daily Progress */}
                <DailyProgress
                    completed={visibleEntries.length}
                    total={Math.max(visibleEntries.length, 5)} // Target 5 habits/day
                    streak={currentStreakCount}
                />
            </header>

            {/* Add Entry Button */}
            <Button
                variant="default"
                size="lg"
                className="w-full"
                onClick={() => setIsFormOpen(true)}
            >
                <Plus className="w-5 h-5" />
                <span>Add New Entry</span>
            </Button>

            {/* Daily Quote - Sticky Note Style */}
            <div className="quote-card">
                <p className="text-xl md:text-2xl leading-relaxed">
                    {dailyQuote.text}
                </p>
                <p className="quote-author">— {dailyQuote.author}</p>
            </div>

            {/* Entries List */}
            <div className="space-y-3">
                {visibleEntries.length > 0 ? (
                    <>
                        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                            Today's Entries
                        </h2>
                        {visibleEntries.map((entry, index) => (
                            <HabitCard
                                key={entry.id}
                                entry={entry}
                                index={index}
                                onClick={() => setSelectedEntry(entry.id)}
                                onToggle={() => togglePin(entry.id)}
                            />
                        ))}
                    </>
                ) : (
                    <div className="text-center py-12 space-y-4">
                        <div className="w-20 h-20 mx-auto bg-card rounded-2xl flex items-center justify-center">
                            <Sparkles className="w-10 h-10 text-primary-400" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold">No entries yet</h3>
                            <p className="text-muted-foreground text-sm mt-1">
                                Start tracking your habits and progress today!
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Add Entry Dialog */}
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent className="sm:max-w-md bg-card border-border" style={{ fontFamily: 'system-ui, sans-serif' }}>
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold">✏️ New Entry</DialogTitle>
                        <DialogDescription>
                            What did you accomplish today?
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-5 py-4">
                        {/* Category Selection */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">Category</label>
                            <div className="grid grid-cols-3 gap-2">
                                {CATEGORIES.map((cat) => (
                                    <button
                                        key={cat}
                                        type="button"
                                        onClick={() => setCategory(cat)}
                                        className={cn(
                                            "flex flex-col items-center gap-2 p-3 rounded-xl transition-all border-2",
                                            category === cat
                                                ? cn(CATEGORY_COLORS[cat], "text-white border-transparent")
                                                : "bg-muted/30 hover:bg-muted/50 text-foreground border-transparent hover:border-muted-foreground/30"
                                        )}
                                    >
                                        <span className="text-2xl">{CATEGORY_CONFIG[cat].emoji}</span>
                                        <span className="text-[10px] font-medium">
                                            {CATEGORY_CONFIG[cat].label}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Content */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">What did you do?</label>
                            <Textarea
                                placeholder="Describe your activity, learning, or reflection..."
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                rows={4}
                                className="bg-muted/30 border-border focus:border-primary-500 resize-none"
                                style={{ fontFamily: 'system-ui, sans-serif' }}
                            />
                        </div>

                        {/* Mood Selection */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">How did it feel?</label>
                            <div className="flex gap-2">
                                {MOODS.map((m) => (
                                    <button
                                        key={m}
                                        type="button"
                                        onClick={() => setMood(m)}
                                        className={cn(
                                            "flex-1 flex flex-col items-center gap-1 p-3 rounded-xl text-2xl transition-all border-2",
                                            mood === m
                                                ? "bg-primary-500/20 border-primary-500 scale-105"
                                                : "bg-muted/30 border-transparent hover:bg-muted/50"
                                        )}
                                    >
                                        <span>{MOOD_CONFIG[m].emoji}</span>
                                        <span className="text-[10px] font-medium text-muted-foreground">
                                            {MOOD_CONFIG[m].label}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                        <Button variant="ghost" className="flex-1" onClick={() => setIsFormOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            variant="default"
                            className="flex-1"
                            onClick={handleSubmit}
                            isLoading={isSubmitting}
                            disabled={!content.trim()}
                        >
                            💾 Save Entry
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* View Entry Dialog */}
            <Dialog open={!!selectedEntry} onOpenChange={() => setSelectedEntry(null)}>
                <DialogContent className="sm:max-w-md bg-card border-border" style={{ fontFamily: 'system-ui, sans-serif' }}>
                    {(() => {
                        const entry = todayEntries.find((e) => e.id === selectedEntry);
                        if (!entry) return null;

                        return (
                            <>
                                <DialogHeader>
                                    <div className="flex items-center gap-3">
                                        <div className={cn(
                                            "w-12 h-12 rounded-xl flex items-center justify-center text-2xl",
                                            CATEGORY_COLORS[entry.category]
                                        )}>
                                            {CATEGORY_CONFIG[entry.category].emoji}
                                        </div>
                                        <div>
                                            <DialogTitle>{CATEGORY_CONFIG[entry.category].label}</DialogTitle>
                                            <p className="text-sm text-muted-foreground">
                                                {getMoodEmoji(entry.mood)} {MOOD_CONFIG[entry.mood].label}
                                            </p>
                                        </div>
                                    </div>
                                </DialogHeader>
                                <div className="py-4">
                                    <p className="text-foreground whitespace-pre-wrap leading-relaxed">
                                        {entry.content}
                                    </p>
                                </div>
                            </>
                        );
                    })()}
                </DialogContent>
            </Dialog>
        </div>
    );
}

function getMoodEmoji(mood: Mood): string {
    return MOOD_CONFIG[mood]?.emoji || "😊";
}
