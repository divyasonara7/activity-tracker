import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../../utils';
import styles from './Card.module.css';

// ============================================
// Card Component
// ============================================

export type CardVariant = 'default' | 'elevated' | 'outlined' | 'ghost';
export type CardPadding = 'none' | 'sm' | 'md' | 'lg';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
    variant?: CardVariant;
    padding?: CardPadding;
    hoverable?: boolean;
    children: ReactNode;
}

export function Card({
    variant = 'default',
    padding = 'md',
    hoverable = false,
    className,
    children,
    ...props
}: CardProps) {
    return (
        <div
            className={cn(
                styles.card,
                styles[variant],
                styles[`padding-${padding}`],
                hoverable && styles.hoverable,
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}

// Card Header
export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
    title?: string;
    subtitle?: string;
    action?: ReactNode;
    children?: ReactNode;
}

export function CardHeader({
    title,
    subtitle,
    action,
    className,
    children,
    ...props
}: CardHeaderProps) {
    return (
        <div className={cn(styles.header, className)} {...props}>
            {children || (
                <>
                    <div className={styles.headerContent}>
                        {title && <h3 className={styles.title}>{title}</h3>}
                        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
                    </div>
                    {action && <div className={styles.action}>{action}</div>}
                </>
            )}
        </div>
    );
}

// Card Content
export interface CardContentProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
}

export function CardContent({
    className,
    children,
    ...props
}: CardContentProps) {
    return (
        <div className={cn(styles.content, className)} {...props}>
            {children}
        </div>
    );
}

// Card Footer
export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
}

export function CardFooter({
    className,
    children,
    ...props
}: CardFooterProps) {
    return (
        <div className={cn(styles.footer, className)} {...props}>
            {children}
        </div>
    );
}
