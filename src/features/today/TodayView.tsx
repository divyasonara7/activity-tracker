import { useState, useEffect } from 'react';
import { useAppStore } from '../../stores/appStore';
import { Button, Modal } from '../../components/ui';
import { StickyNote } from '../../components/sticky-notes';
import { QuickEntryForm } from './QuickEntryForm';
import { getRelativeDay } from '../../utils/dates';
import styles from './TodayView.module.css';

// ============================================
// Today View Feature
// ============================================

export function TodayView() {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedEntry, setSelectedEntry] = useState<string | null>(null);

    const {
        todayEntries,
        streaks,
        isLoading,
        addEntry,
        togglePin,
        toggleArchive,
        loadTodayEntries,
    } = useAppStore();

    // Load today's entries on mount
    useEffect(() => {
        loadTodayEntries();
    }, [loadTodayEntries]);

    // Get current overall streak
    const overallStreak = streaks.find((s) => s.type === 'overall');
    const currentStreakCount = overallStreak?.currentCount || 0;

    const handleAddEntry = async (data: Parameters<typeof addEntry>[0]) => {
        await addEntry(data);
        setIsFormOpen(false);
    };

    if (isLoading) {
        return (
            <div className={styles.loading}>
                <div className={styles.spinner} />
                <p>Loading your entries...</p>
            </div>
        );
    }

    const visibleEntries = todayEntries.filter((e) => !e.isArchived);
    const pinnedEntries = visibleEntries.filter((e) => e.isPinned);
    const regularEntries = visibleEntries.filter((e) => !e.isPinned);

    return (
        <div className={styles.container}>
            {/* Header */}
            <header className={styles.header}>
                <div className={styles.headerContent}>
                    <h1 className={styles.title}>{getRelativeDay(new Date())}</h1>
                    <p className={styles.subtitle}>
                        {visibleEntries.length === 0
                            ? "What will you learn today?"
                            : `${visibleEntries.length} ${visibleEntries.length === 1 ? 'entry' : 'entries'} so far`}
                    </p>
                </div>

                {/* Streak Badge */}
                {currentStreakCount > 0 && (
                    <div className={styles.streakBadge}>
                        <span className={styles.streakIcon}>🔥</span>
                        <span className={styles.streakCount}>{currentStreakCount}</span>
                        <span className={styles.streakLabel}>day streak</span>
                    </div>
                )}
            </header>

            {/* Quick Add Button */}
            <div className={styles.addSection}>
                <Button
                    variant="primary"
                    size="lg"
                    fullWidth
                    onClick={() => setIsFormOpen(true)}
                    leftIcon={
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                    }
                >
                    Add Entry
                </Button>
            </div>

            {/* Entries */}
            <div className={styles.entries}>
                {/* Pinned Entries */}
                {pinnedEntries.length > 0 && (
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>📌 Pinned</h2>
                        <div className={styles.notesGrid}>
                            {pinnedEntries.map((entry) => (
                                <StickyNote
                                    key={entry.id}
                                    entry={entry}
                                    onClick={() => setSelectedEntry(entry.id)}
                                    onPin={() => togglePin(entry.id)}
                                    onArchive={() => toggleArchive(entry.id)}
                                />
                            ))}
                        </div>
                    </section>
                )}

                {/* Regular Entries */}
                {regularEntries.length > 0 && (
                    <section className={styles.section}>
                        {pinnedEntries.length > 0 && (
                            <h2 className={styles.sectionTitle}>Today's Notes</h2>
                        )}
                        <div className={styles.notesGrid}>
                            {regularEntries.map((entry) => (
                                <StickyNote
                                    key={entry.id}
                                    entry={entry}
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
                    <div className={styles.emptyState}>
                        <div className={styles.emptyIcon}>📝</div>
                        <h3 className={styles.emptyTitle}>No entries yet</h3>
                        <p className={styles.emptyText}>
                            Capture your first learning, reflection, or motivation for today!
                        </p>
                    </div>
                )}
            </div>

            {/* Add Entry Modal */}
            <Modal
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                title="New Entry"
                size="lg"
            >
                <QuickEntryForm
                    onSubmit={handleAddEntry}
                    onCancel={() => setIsFormOpen(false)}
                />
            </Modal>

            {/* View Entry Modal */}
            {selectedEntry && (
                <Modal
                    isOpen={!!selectedEntry}
                    onClose={() => setSelectedEntry(null)}
                    title="Entry Details"
                    size="md"
                >
                    {(() => {
                        const entry = todayEntries.find((e) => e.id === selectedEntry);
                        if (!entry) return null;

                        return (
                            <div className={styles.entryDetail}>
                                {entry.title && <h3>{entry.title}</h3>}
                                <p className={styles.entryContent}>{entry.content}</p>
                                {entry.tags.length > 0 && (
                                    <div className={styles.entryTags}>
                                        {entry.tags.map((tag) => (
                                            <span key={tag} className={styles.entryTag}>#{tag}</span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })()}
                </Modal>
            )}
        </div>
    );
}
