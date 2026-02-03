import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { cn } from '../../utils';
import styles from './TextArea.module.css';

// ============================================
// TextArea Component
// ============================================

export interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    hint?: string;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
    function TextArea({ label, error, hint, className, id, ...props }, ref) {
        const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-');

        return (
            <div className={styles.wrapper}>
                {label && (
                    <label htmlFor={textareaId} className={styles.label}>
                        {label}
                    </label>
                )}
                <textarea
                    ref={ref}
                    id={textareaId}
                    className={cn(styles.textarea, error && styles.hasError, className)}
                    {...props}
                />
                {(error || hint) && (
                    <p className={cn(styles.helper, error && styles.errorText)}>
                        {error || hint}
                    </p>
                )}
            </div>
        );
    }
);
