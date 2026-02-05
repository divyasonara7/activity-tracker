import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Calendar, ClipboardList, LayoutDashboard, Target, Home, Quote } from "lucide-react";

interface LayoutProps {
    children: ReactNode;
}

const NAV_ITEMS = [
    { path: "/", label: "Today", icon: Home },
    { path: "/quotes", label: "Quotes", icon: Quote },
    { path: "/calendar", label: "Calendar", icon: Calendar },
    { path: "/notes", label: "History", icon: ClipboardList },
    { path: "/dashboard", label: "Stats", icon: LayoutDashboard },
    { path: "/goals", label: "Goals", icon: Target },
];

export function Layout({ children }: LayoutProps) {
    return (
        <div className="min-h-screen bg-background">
            {/* Main Content */}
            <main className="pb-20 md:pb-0 md:pl-20 lg:pl-64">
                {children}
            </main>

            {/* Navigation - Habitify style bottom/side nav */}
            <nav className="fixed bottom-0 left-0 right-0 md:top-0 md:bottom-0 md:right-auto md:w-20 lg:w-64 z-50 bg-card border-t md:border-t-0 md:border-r border-border">
                <div className="flex md:flex-col items-center md:items-stretch justify-around md:justify-start h-16 md:h-full md:p-4 md:pt-8 md:gap-1">
                    {/* Logo (desktop) */}
                    <div className="hidden lg:flex items-center gap-3 px-4 py-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-primary-500 flex items-center justify-center shadow-lg shadow-primary-500/30">
                            <span className="text-xl">🎯</span>
                        </div>
                        <div>
                            <h1 className="font-bold text-foreground">Growth Tracker</h1>
                            <p className="text-xs text-muted-foreground">Build better habits</p>
                        </div>
                    </div>

                    {NAV_ITEMS.map((item) => {
                        const Icon = item.icon;
                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) =>
                                    cn(
                                        "flex flex-col md:flex-row items-center gap-1 md:gap-3 px-3 py-2 md:px-4 md:py-3 rounded-xl transition-all duration-200",
                                        isActive
                                            ? "text-primary-400 bg-primary-500/10"
                                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                    )
                                }
                            >
                                <Icon className="w-5 h-5" />
                                <span className="text-[10px] md:text-sm font-medium">
                                    {item.label}
                                </span>
                            </NavLink>
                        );
                    })}
                </div>
            </nav>
        </div>
    );
}
