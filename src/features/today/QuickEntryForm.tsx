import { useState } from 'react';
import type { EntryCategory, Mood, EntryFormData } from '../../types';
import { Button, TextArea } from '../../components/ui';
import { CATEGORY_CONFIG, MOOD_CONFIG } from '../../utils/constants';
import styles from './QuickEntryForm.module.css';

// ============================================
// Quick Entry Form Component
// ============================================

interface QuickEntryFormProps {
    onSubmit: (data: EntryFormData) => Promise<void>;
    onCancel?: () => void;
}

const CATEGORIES: EntryCategory[] = [
    'learning-technology',
    'learning-finance',
    'learning-other',
    'exercise',
    'motivation',
    'reflection',
];

const MOODS: Mood[] = ['fire', 'happy', 'neutral', 'sad'];

export function QuickEntryForm({ onSubmit, onCancel }: QuickEntryFormProps) {
    const [category, setCategory] = useState<EntryCategory>('learning-technology');
    const [content, setContent] = useState('');
    const [mood, setMood] = useState<Mood>('happy');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [title, setTitle] = useState('');
    const [tagsInput, setTagsInput] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;

        setIsSubmitting(true);
        try {
            await onSubmit({
                category,
                content: content.trim(),
                mood,
                title: title.trim() || '',
                tags: tagsInput
                    .split(',')
                    .map((t) => t.trim())
                    .filter(Boolean),
                timeSpentMinutes: null,
            });
            // Reset form
            setContent('');
            setTitle('');
            setTagsInput('');
            setShowAdvanced(false);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            {/* Category Selection */}
            <div className={styles.section}>
                <label className={styles.label}>Category</label>
                <div className={styles.categoryGrid}>
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat}
                            type="button"
                            className={`${styles.categoryBtn} ${category === cat ? styles.selected : ''}`}
                            onClick={() => setCategory(cat)}
                            title={CATEGORY_CONFIG[cat].label}
                        >
                            <span className={styles.emoji}>{CATEGORY_CONFIG[cat].emoji}</span>
                            <span className={styles.categoryLabel}>{CATEGORY_CONFIG[cat].label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className={styles.section}>
                <TextArea
                    label="What did you learn or do today?"
                    placeholder="Write your thoughts, learnings, or reflections..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={4}
                    required
                />
            </div>

            {/* Mood Selection */}
            <div className={styles.section}>
                <label className={styles.label}>How are you feeling?</label>
                <div className={styles.moodGrid}>
                    {MOODS.map((m) => (
                        <button
                            key={m}
                            type="button"
                            className={`${styles.moodBtn} ${mood === m ? styles.selected : ''}`}
                            onClick={() => setMood(m)}
                            title={MOOD_CONFIG[m].label}
                        >
                            <span className={styles.moodEmoji}>{MOOD_CONFIG[m].emoji}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Advanced Options Toggle */}
            <button
                type="button"
                className={styles.advancedToggle}
                onClick={() => setShowAdvanced(!showAdvanced)}
            >
                {showAdvanced ? '− Less options' : '+ More options'}
            </button>

            {/* Advanced Options */}
            {showAdvanced && (
                <div className={styles.advanced}>
                    <div className={styles.section}>
                        <label className={styles.label}>Title (optional)</label>
                        <input
                            type="text"
                            className={styles.input}
                            placeholder="Give this entry a title..."
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                    <div className={styles.section}>
                        <label className={styles.label}>Tags (optional)</label>
                        <input
                            type="text"
                            className={styles.input}
                            placeholder="react, typescript, learning"
                            value={tagsInput}
                            onChange={(e) => setTagsInput(e.target.value)}
                        />
                        <span className={styles.hint}>Separate tags with commas</span>
                    </div>
                </div>
            )}

            {/* Actions */}
            <div className={styles.actions}>
                {onCancel && (
                    <Button type="button" variant="ghost" onClick={onCancel}>
                        Cancel
                    </Button>
                )}
                <Button
                    type="submit"
                    variant="primary"
                    isLoading={isSubmitting}
                    disabled={!content.trim()}
                >
                    Save Entry
                </Button>
            </div>
        </form>
    );
}
