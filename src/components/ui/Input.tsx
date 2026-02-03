import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '../../utils';
import styles from './Input.module.css';

// ============================================
// Input Component
// ============================================

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    hint?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    function Input(
        { label, error, hint, leftIcon, rightIcon, className, id, ...props },
        ref
    ) {
        const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

        return (
            <div className={styles.wrapper}>
                {label && (
                    <label htmlFor={inputId} className={styles.label}>
                        {label}
                    </label>
                )}
                <div className={cn(styles.inputWrapper, error && styles.hasError)}>
                    {leftIcon && <span className={styles.iconLeft}>{leftIcon}</span>}
                    <input
                        ref={ref}
                        id={inputId}
                        className={cn(
                            styles.input,
                            leftIcon && styles.hasLeftIcon,
                            rightIcon && styles.hasRightIcon,
                            className
                        )}
                        {...props}
                    />
                    {rightIcon && <span className={styles.iconRight}>{rightIcon}</span>}
                </div>
                {(error || hint) && (
                    <p className={cn(styles.helper, error && styles.errorText)}>
                        {error || hint}
                    </p>
                )}
            </div>
        );
    }
);
