import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useAppStore } from '../stores/appStore';
import { Layout } from './Layout';
import { TodayView } from '../features/today';
import '../styles/globals.css';

// Lazy load other views
// const CalendarView = lazy(() => import('../features/calendar/CalendarView'));
// const NotesBoard = lazy(() => import('../features/notes-board/NotesBoard'));
// const DashboardView = lazy(() => import('../features/dashboard/DashboardView'));
// const GoalsView = lazy(() => import('../features/goals/GoalsView'));

// Placeholder components for routes not yet implemented
function ComingSoon({ title }: { title: string }) {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60vh',
            gap: '1rem',
            textAlign: 'center',
            padding: '2rem'
        }}>
            <span style={{ fontSize: '4rem' }}>🚧</span>
            <h1 style={{ margin: 0 }}>{title}</h1>
            <p style={{ color: 'rgb(var(--text-secondary))', maxWidth: '300px' }}>
                This feature is coming soon. For now, try the Today view!
            </p>
        </div>
    );
}

export function App() {
    const initialize = useAppStore((state) => state.initialize);

    // Initialize app on mount
    useEffect(() => {
        initialize();
    }, [initialize]);

    return (
        <BrowserRouter>
            <Layout>
                <Routes>
                    <Route path="/" element={<TodayView />} />
                    <Route path="/calendar" element={<ComingSoon title="Calendar View" />} />
                    <Route path="/notes" element={<ComingSoon title="Notes Board" />} />
                    <Route path="/dashboard" element={<ComingSoon title="Dashboard" />} />
                    <Route path="/goals" element={<ComingSoon title="Goals" />} />
                </Routes>
            </Layout>
        </BrowserRouter>
    );
}

export default App;
