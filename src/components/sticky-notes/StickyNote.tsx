import type { Entry } from '../../types';
import { cn, truncate } from '../../utils';
import { getStickyColor, getCategoryEmoji, getMoodEmoji } from '../../utils/constants';
import { formatShortDate } from '../../utils/dates';
import styles from './StickyNote.module.css';

// ============================================
// Sticky Note Component
// ============================================

export interface StickyNoteProps {
    entry: Entry;
    onClick?: () => void;
    onPin?: () => void;
    onArchive?: () => void;
    size?: 'sm' | 'md' | 'lg';
    showDate?: boolean;
}

export function StickyNote({
    entry,
    onClick,
    onPin,
    onArchive,
    size = 'md',
    showDate = false,
}: StickyNoteProps) {
    const colors = getStickyColor(entry.category);
    const categoryEmoji = getCategoryEmoji(entry.category);
    const moodEmoji = getMoodEmoji(entry.mood);

    // Random slight rotation for sticky note effect
    const rotation = ((entry.id.charCodeAt(0) % 7) - 3) * 0.5;

    const contentLength = size === 'sm' ? 60 : size === 'md' ? 120 : 200;

    return (
        <article
            className={cn(
                styles.stickyNote,
                styles[size],
                entry.isPinned && styles.pinned,
                onClick && styles.clickable
            )}
            style={{
                '--sticky-bg': colors.background,
                '--sticky-border': colors.border,
                '--sticky-text': colors.text,
                '--rotation': `${rotation}deg`,
            } as React.CSSProperties}
            onClick={onClick}
            role={onClick ? 'button' : undefined}
            tabIndex={onClick ? 0 : undefined}
            onKeyDown={(e) => {
                if (onClick && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault();
                    onClick();
                }
            }}
        >
            {/* Pin indicator */}
            {entry.isPinned && (
                <div className={styles.pinIcon} aria-label="Pinned">
                    📌
                </div>
            )}

            {/* Header */}
            <div className={styles.header}>
                <span className={styles.category}>{categoryEmoji}</span>
                <span className={styles.mood}>{moodEmoji}</span>
            </div>

            {/* Title */}
            {entry.title && <h3 className={styles.title}>{entry.title}</h3>}

            {/* Content */}
            <p className={styles.content}>{truncate(entry.content, contentLength)}</p>

            {/* Footer */}
            <div className={styles.footer}>
                {showDate && (
                    <span className={styles.date}>{formatShortDate(entry.date)}</span>
                )}
                {entry.tags.length > 0 && (
                    <div className={styles.tags}>
                        {entry.tags.slice(0, 2).map((tag) => (
                            <span key={tag} className={styles.tag}>
                                #{tag}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* Actions */}
            {(onPin || onArchive) && (
                <div className={styles.actions}>
                    {onPin && (
                        <button
                            type="button"
                            className={styles.actionBtn}
                            onClick={(e) => {
                                e.stopPropagation();
                                onPin();
                            }}
                            aria-label={entry.isPinned ? 'Unpin' : 'Pin'}
                        >
                            {entry.isPinned ? '📍' : '📌'}
                        </button>
                    )}
                    {onArchive && (
                        <button
                            type="button"
                            className={styles.actionBtn}
                            onClick={(e) => {
                                e.stopPropagation();
                                onArchive();
                            }}
                            aria-label="Archive"
                        >
                            🗃️
                        </button>
                    )}
                </div>
            )}
        </article>
    );
}
