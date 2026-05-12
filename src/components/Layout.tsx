import { Link, Outlet, useLocation } from "@tanstack/react-router";
import { Home, BarChart3, Sparkles, Brain, Info } from "lucide-react";
import { useState } from "react";
import { Chatbot } from "./Chatbot";

const nav = [
  { to: "/", label: "Home", icon: Home },
  { to: "/predict", label: "Predict", icon: Brain },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/recommendations", label: "AI Picks", icon: Sparkles },
  { to: "/about", label: "About", icon: Info },
] as const;

export function Layout() {
  const { pathname } = useLocation();
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 border-b border-white/5 backdrop-blur-xl bg-background/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative w-9 h-9 rounded-xl bg-gradient-primary grid place-items-center shadow-glow">
              <Brain className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="leading-tight">
              <div className="font-display font-bold text-base">Estate<span className="text-gradient">AI</span></div>
              <div className="text-[10px] text-muted-foreground tracking-widest uppercase">Smart Pricing</div>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {nav.map((n) => {
              const active = pathname === n.to;
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    active
                      ? "text-foreground glass-strong shadow-glow"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                  }`}
                >
                  {n.label}
                </Link>
              );
            })}
          </nav>

          <Link
            to="/predict"
            className="hidden sm:inline-flex items-center gap-2 bg-gradient-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold shadow-glow hover:scale-[1.03] transition-transform"
          >
            <Sparkles className="w-4 h-4" />
            Try AI Predict
          </Link>
        </div>

        {/* mobile nav */}
        <nav className="md:hidden flex items-center gap-1 px-4 pb-3 overflow-x-auto">
          {nav.map((n) => {
            const active = pathname === n.to;
            const Icon = n.icon;
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
                  active ? "glass-strong text-foreground" : "text-muted-foreground"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {n.label}
              </Link>
            );
          })}
        </nav>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-white/5 mt-20">
        <div className="mx-auto max-w-7xl px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div>© 2026 EstateAI · Smart House Price Prediction System</div>
          <div className="flex gap-6">
            <Link to="/about" className="hover:text-foreground">About</Link>
            <Link to="/analytics" className="hover:text-foreground">Analytics</Link>
            <Link to="/predict" className="hover:text-foreground">Predict</Link>
          </div>
        </div>
      </footer>

      <Chatbot open={chatOpen} onOpenChange={setChatOpen} />
    </div>
  );
}
