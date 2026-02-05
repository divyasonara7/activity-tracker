import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAppStore } from "@/stores/appStore";
import { Layout } from "./Layout";
import { TodayView } from "@/features/today";
import { CalendarView } from "@/features/calendar";
import { NotesBoardView } from "@/features/notes-board";
import { DashboardView } from "@/features/dashboard";
import { GoalsView } from "@/features/goals";
import { QuotesView } from "@/features/quotes";
import "@/styles/globals.css";

export function App() {
    const initialize = useAppStore((state) => state.initialize);

    useEffect(() => {
        initialize();
    }, [initialize]);

    return (
        <BrowserRouter>
            <Layout>
                <Routes>
                    <Route path="/" element={<TodayView />} />
                    <Route path="/quotes" element={<QuotesView />} />
                    <Route path="/calendar" element={<CalendarView />} />
                    <Route path="/notes" element={<NotesBoardView />} />
                    <Route path="/dashboard" element={<DashboardView />} />
                    <Route path="/goals" element={<GoalsView />} />
                </Routes>
            </Layout>
        </BrowserRouter>
    );
}

export default App;
