import type { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Layout.module.css';

// ============================================
// App Layout
// ============================================

interface LayoutProps {
    children: ReactNode;
}

const NAV_ITEMS = [
    { path: '/', label: 'Today', icon: '📝' },
    { path: '/calendar', label: 'Calendar', icon: '📅' },
    { path: '/notes', label: 'Notes', icon: '🗒️' },
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/goals', label: 'Goals', icon: '🎯' },
];

export function Layout({ children }: LayoutProps) {
    return (
        <div className={styles.layout}>
            {/* Main Content */}
            <main className={styles.main}>{children}</main>

            {/* Bottom Navigation */}
            <nav className={styles.nav} aria-label="Main navigation">
                {NAV_ITEMS.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `${styles.navItem} ${isActive ? styles.active : ''}`
                        }
                    >
                        <span className={styles.navIcon}>{item.icon}</span>
                        <span className={styles.navLabel}>{item.label}</span>
                    </NavLink>
                ))}
            </nav>
        </div>
    );
}
