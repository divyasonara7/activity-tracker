import { useState, useEffect, useMemo } from "react";
import { Search, Pin, ClipboardList } from "lucide-react";
import { useAppStore } from "@/stores/appStore";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui";
import { entryOps } from "@/lib/db";
import { formatShortDate, subDays, toDateString } from "@/utils/dates";
import { CATEGORY_CONFIG, getMoodEmoji } from "@/utils/constants";
import type { Entry, EntryCategory } from "@/types";
import { cn } from "@/lib/utils";
import styles from "./NotesBoardView.module.css";

// ============================================
// Types
// ============================================

type DateFilter = "all" | "7" | "30" | "90";

interface Filters {
    search: string;
    categories: EntryCategory[];
    dateRange: DateFilter;
    pinnedOnly: boolean;
}

// ============================================
// Category Colors
// ============================================

const CATEGORY_BG_COLORS: Record<EntryCategory, string> = {
    "learning-technology": "bg-habit-blue/20 text-habit-blue",
    "learning-finance": "bg-habit-yellow/20 text-habit-yellow",
    "learning-other": "bg-habit-purple/20 text-habit-purple",
    "exercise": "bg-habit-green/20 text-habit-green",
    "motivation": "bg-habit-orange/20 text-habit-orange",
    "reflection": "bg-habit-pink/20 text-habit-pink",
};

const ALL_CATEGORIES: EntryCategory[] = [
    "learning-technology",
    "learning-finance",
    "learning-other",
    "exercise",
    "motivation",
    "reflection",
];

// ============================================
// Notes Board View Component
// ============================================

export function NotesBoardView() {
    const [entries, setEntries] = useState<Entry[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);
    const [filters, setFilters] = useState<Filters>({
        search: "",
        categories: [],
        dateRange: "all",
        pinnedOnly: false,
    });

    const { user } = useAppStore();

    // Load all entries
    useEffect(() => {
        async function loadEntries() {
            if (!user?.id) return;

            setIsLoading(true);
            try {
                const allEntries = await entryOps.getRecent(user.id, 1000);
                setEntries(allEntries.filter((e) => !e.isArchived));
            } catch (error) {
                console.error("Failed to load entries:", error);
            } finally {
                setIsLoading(false);
            }
        }

        loadEntries();
    }, [user?.id]);

    // Apply filters
    const filteredEntries = useMemo(() => {
        let result = [...entries];

        // Search filter
        if (filters.search.trim()) {
            const searchLower = filters.search.toLowerCase();
            result = result.filter(
                (e) =>
                    e.content.toLowerCase().includes(searchLower) ||
                    (e.title && e.title.toLowerCase().includes(searchLower))
            );
        }

        // Category filter
        if (filters.categories.length > 0) {
            result = result.filter((e) => filters.categories.includes(e.category));
        }

        // Date range filter
        if (filters.dateRange !== "all") {
            const days = parseInt(filters.dateRange);
            const cutoffDate = toDateString(subDays(new Date(), days));
            result = result.filter((e) => e.date >= cutoffDate);
        }

        // Pinned only filter
        if (filters.pinnedOnly) {
            result = result.filter((e) => e.isPinned);
        }

        return result;
    }, [entries, filters]);

    // Separate pinned entries
    const pinnedEntries = useMemo(
        () => filteredEntries.filter((e) => e.isPinned),
        [filteredEntries]
    );
    const regularEntries = useMemo(
        () => filteredEntries.filter((e) => !e.isPinned),
        [filteredEntries]
    );

    // Toggle category filter
    const toggleCategory = (category: EntryCategory) => {
        setFilters((prev) => ({
            ...prev,
            categories: prev.categories.includes(category)
                ? prev.categories.filter((c) => c !== category)
                : [...prev.categories, category],
        }));
    };

    // Clear all filters
    const clearFilters = () => {
        setFilters({
            search: "",
            categories: [],
            dateRange: "all",
            pinnedOnly: false,
        });
    };

    const hasActiveFilters =
        filters.search ||
        filters.categories.length > 0 ||
        filters.dateRange !== "all" ||
        filters.pinnedOnly;

    if (isLoading) {
        return (
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 className={styles.title}>History</h1>
                    <p className={styles.subtitle}>All your entries in one place</p>
                </div>
                <div className={styles.loadingGrid}>
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className={styles.loadingCard}>
                            <div className={cn(styles.loadingLine, styles.loadingLineShort)} />
                            <div className={cn(styles.loadingLine, styles.loadingLineMedium)} />
                            <div className={styles.loadingLine} />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            {/* Header */}
            <header className={styles.header}>
                <h1 className={styles.title}>History</h1>
                <p className={styles.subtitle}>All your entries in one place</p>
            </header>

            {/* Search Bar */}
            <div className={styles.searchBar}>
                <Search className={cn(styles.searchIcon, "w-4 h-4")} />
                <input
                    type="text"
                    placeholder="Search entries..."
                    value={filters.search}
                    onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
                    className={styles.searchInput}
                />
            </div>

            {/* Filters */}
            <div className={styles.filters}>
                {/* Category Filters */}
                {ALL_CATEGORIES.map((category) => (
                    <button
                        key={category}
                        onClick={() => toggleCategory(category)}
                        className={cn(
                            styles.filterChip,
                            filters.categories.includes(category) && styles.filterChipActive
                        )}
                    >
                        <span>{CATEGORY_CONFIG[category].emoji}</span>
                        <span>{CATEGORY_CONFIG[category].label}</span>
                    </button>
                ))}

                {/* Pinned Only */}
                <button
                    onClick={() =>
                        setFilters((prev) => ({ ...prev, pinnedOnly: !prev.pinnedOnly }))
                    }
                    className={cn(
                        styles.filterChip,
                        filters.pinnedOnly && styles.filterChipActive
                    )}
                >
                    <Pin className="w-3 h-3" />
                    <span>Pinned</span>
                </button>
            </div>

            {/* Date Range Filters */}
            <div className={cn(styles.filters, styles.dateFilters)}>
                {[
                    { value: "all" as DateFilter, label: "All Time" },
                    { value: "7" as DateFilter, label: "7 Days" },
                    { value: "30" as DateFilter, label: "30 Days" },
                    { value: "90" as DateFilter, label: "90 Days" },
                ].map((option) => (
                    <button
                        key={option.value}
                        onClick={() =>
                            setFilters((prev) => ({ ...prev, dateRange: option.value }))
                        }
                        className={cn(
                            styles.dateButton,
                            filters.dateRange === option.value && styles.dateButtonActive
                        )}
                    >
                        {option.label}
                    </button>
                ))}
            </div>

            {/* Results Info */}
            <div className={styles.resultsInfo}>
                <span className={styles.resultsCount}>
                    {filteredEntries.length} {filteredEntries.length === 1 ? "entry" : "entries"}
                </span>
                {hasActiveFilters && (
                    <button onClick={clearFilters} className={styles.clearFilters}>
                        Clear filters
                    </button>
                )}
            </div>

            {/* Pinned Section */}
            {pinnedEntries.length > 0 && !filters.pinnedOnly && (
                <section className={styles.pinnedSection}>
                    <h2 className={styles.sectionTitle}>
                        <Pin className={cn(styles.sectionIcon, "w-4 h-4")} />
                        Pinned
                    </h2>
                    <div className={styles.notesGrid}>
                        {pinnedEntries.map((entry) => (
                            <NoteCard
                                key={entry.id}
                                entry={entry}
                                onClick={() => setSelectedEntry(entry)}
                            />
                        ))}
                    </div>
                </section>
            )}

            {/* All Entries */}
            {regularEntries.length > 0 ? (
                <div className={styles.notesGrid}>
                    {(filters.pinnedOnly ? filteredEntries : regularEntries).map((entry) => (
                        <NoteCard
                            key={entry.id}
                            entry={entry}
                            onClick={() => setSelectedEntry(entry)}
                        />
                    ))}
                </div>
            ) : pinnedEntries.length === 0 ? (
                <div className={styles.emptyState}>
                    <div className={styles.emptyStateIcon}>
                        <ClipboardList className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className={styles.emptyStateTitle}>No entries found</h3>
                    <p className={styles.emptyStateText}>
                        {hasActiveFilters
                            ? "Try adjusting your filters"
                            : "Start by adding entries in the Today view"}
                    </p>
                </div>
            ) : null}

            {/* Entry Detail Modal */}
            <Dialog open={!!selectedEntry} onOpenChange={() => setSelectedEntry(null)}>
                <DialogContent className="sm:max-w-md bg-card border-border">
                    {selectedEntry && (
                        <>
                            <DialogHeader>
                                <div className="flex items-center gap-2">
                                    <div
                                        className={cn(
                                            "w-10 h-10 rounded-full flex items-center justify-center text-lg",
                                            CATEGORY_BG_COLORS[selectedEntry.category]
                                        )}
                                    >
                                        {CATEGORY_CONFIG[selectedEntry.category].emoji}
                                    </div>
                                    <div>
                                        <DialogTitle>
                                            {CATEGORY_CONFIG[selectedEntry.category].label}
                                        </DialogTitle>
                                        <p className="text-sm text-muted-foreground">
                                            {formatShortDate(selectedEntry.date)} •{" "}
                                            {getMoodEmoji(selectedEntry.mood)}
                                        </p>
                                    </div>
                                </div>
                            </DialogHeader>
                            <div className="py-4">
                                {selectedEntry.title && (
                                    <h3 className="font-semibold mb-2">{selectedEntry.title}</h3>
                                )}
                                <p className="text-foreground whitespace-pre-wrap">
                                    {selectedEntry.content}
                                </p>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}

// ============================================
// Note Card Component
// ============================================

interface NoteCardProps {
    entry: Entry;
    onClick: () => void;
}

function NoteCard({ entry, onClick }: NoteCardProps) {
    return (
        <div
            className={styles.noteCard}
            onClick={onClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onClick();
                }
            }}
        >
            <div className={styles.noteCardHeader}>
                <div className={styles.noteCardMeta}>
                    <span className={cn(styles.categoryBadge, CATEGORY_BG_COLORS[entry.category])}>
                        {CATEGORY_CONFIG[entry.category].emoji}{" "}
                        {CATEGORY_CONFIG[entry.category].label}
                    </span>
                </div>
                <span className={styles.noteCardDate}>{formatShortDate(entry.date)}</span>
            </div>

            <p className={styles.noteCardContent}>{entry.content}</p>

            <div className={styles.noteCardFooter}>
                <span className={styles.moodBadge}>{getMoodEmoji(entry.mood)}</span>
                {entry.isPinned && (
                    <Pin className={cn(styles.pinnedIndicator, "w-4 h-4")} />
                )}
            </div>
        </div>
    );
}
