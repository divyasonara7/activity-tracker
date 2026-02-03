import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAppStore } from "@/stores/appStore";
import { Layout } from "./Layout";
import { TodayView } from "@/features/today";
import { Construction, Calendar, ClipboardList, LayoutDashboard, Target } from "lucide-react";
import "@/styles/globals.css";

// Coming Soon placeholder
function ComingSoon({ title, icon: Icon }: { title: string; icon: React.ElementType }) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center p-6">
            <div className="relative">
                <div className="absolute inset-0 bg-primary-500/20 rounded-full blur-2xl animate-pulse" />
                <div className="relative p-6 rounded-2xl bg-gradient-to-br from-muted to-card border border-border">
                    <Icon className="w-12 h-12 text-primary-400" />
                </div>
            </div>
            <div className="space-y-2 max-w-sm">
                <h1 className="text-2xl font-bold text-foreground">{title}</h1>
                <p className="text-muted-foreground">
                    This feature is coming soon. We're working hard to bring you the best experience!
                </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Construction className="w-4 h-4" />
                <span>Under Development</span>
            </div>
        </div>
    );
}

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
                    <Route path="/calendar" element={<ComingSoon title="Calendar View" icon={Calendar} />} />
                    <Route path="/notes" element={<ComingSoon title="Notes Board" icon={ClipboardList} />} />
                    <Route path="/dashboard" element={<ComingSoon title="Dashboard" icon={LayoutDashboard} />} />
                    <Route path="/goals" element={<ComingSoon title="Goals & Achievements" icon={Target} />} />
                </Routes>
            </Layout>
        </BrowserRouter>
    );
}

export default App;
