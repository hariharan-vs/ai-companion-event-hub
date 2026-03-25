import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, UserPlus, BarChart3, CalendarDays, GraduationCap, Heart, Sun, Moon, LogOut, Shield, Users, UserCheck } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import Chatbot from "@/components/Chatbot";
import RegisterForm from "@/components/RegisterForm";
import Dashboard from "@/components/Dashboard";
import ScheduleManager from "@/components/ScheduleManager";
import CheckIn from "@/components/CheckIn";
import FloatingChatWidget from "@/components/FloatingChatWidget";

type Tab = "chatbot" | "register" | "dashboard" | "schedule" | "checkin";

const Index = () => {
  const { user, role, loading, signOut } = useAuth();
  const navigate = useNavigate();

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [loading, user, navigate]);

  const isAdmin = role === "admin";

  // Build tabs based on role
  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "chatbot", label: "Chatbot", icon: MessageSquare },
    { id: "register", label: "Register", icon: UserPlus },
    ...(isAdmin
      ? [
          { id: "checkin" as Tab, label: "Check-In", icon: UserCheck },
          { id: "dashboard" as Tab, label: "Dashboard", icon: BarChart3 },
          { id: "schedule" as Tab, label: "Schedule", icon: CalendarDays },
        ]
      : []),
  ];

  const [active, setActive] = useState<Tab>("chatbot");
  const [dark, setDark] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") === "dark" || (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches);
    }
    return true;
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  // Reset to chatbot if current tab not available for role
  useEffect(() => {
    if (!isAdmin && (active === "dashboard" || active === "schedule" || active === "checkin")) {
      setActive("chatbot");
    }
  }, [isAdmin, active]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) return null;

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="glass-card !rounded-none px-4 md:px-6 py-3 flex items-center justify-between sticky top-0 z-50" style={{ boxShadow: "0 4px 30px -10px hsl(170, 25%, 7%, 0.3)" }}>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2.5"
        >
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "var(--gradient-primary)" }}>
            <GraduationCap className="w-4.5 h-4.5 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-foreground text-base hidden sm:inline">
            AI FAQ & Event Sphere
          </span>
        </motion.div>

        <div className="flex items-center gap-2 md:gap-3">
          <div className="flex gap-1.5 md:gap-2">
            {tabs.map((tab, i) => (
              <motion.button
                key={tab.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setActive(tab.id)}
                className={`nav-pill flex items-center gap-1.5 ${
                  active === tab.id ? "nav-pill-active" : "nav-pill-inactive"
                }`}
              >
                <tab.icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline text-xs md:text-sm">{tab.label}</span>
              </motion.button>
            ))}
          </div>

          {/* Role Badge */}
          <div className={`hidden md:flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
            isAdmin ? "bg-amber-500/20 text-amber-400" : "bg-primary/20 text-primary"
          }`}>
            {isAdmin ? <Shield className="w-3 h-3" /> : <Users className="w-3 h-3" />}
            {isAdmin ? "Admin" : "Participant"}
          </div>

          {/* Theme Toggle */}
          <motion.button
            whileTap={{ scale: 0.85, rotate: 180 }}
            onClick={() => setDark(!dark)}
            className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all"
            title={dark ? "Switch to light mode" : "Switch to dark mode"}
          >
            <AnimatePresence mode="wait">
              {dark ? (
                <motion.div key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <Sun className="w-4 h-4" />
                </motion.div>
              ) : (
                <motion.div key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <Moon className="w-4 h-4" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Sign Out */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleSignOut}
            className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-destructive hover:border-destructive/40 transition-all"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </motion.button>
        </div>
      </nav>

      {/* Content */}
      <main className="flex-1 p-4 md:p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25, type: "spring", stiffness: 200 }}
          >
            {active === "chatbot" && <Chatbot />}
            {active === "register" && <RegisterForm />}
            {active === "checkin" && isAdmin && <CheckIn />}
            {active === "dashboard" && isAdmin && <Dashboard />}
            {active === "schedule" && isAdmin && <ScheduleManager />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="glass-card !rounded-none px-6 py-4 mt-auto">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <span>Built with</span>
            <Heart className="w-3 h-3 text-destructive" />
            <span>AI FAQ & Event Sphere © 2026</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="badge-glow">React + Tailwind</span>
            <span className="badge-glow">NLP Powered</span>
          </div>
        </div>
      </footer>

      {active !== "chatbot" && <FloatingChatWidget />}
    </div>
  );
};

export default Index;
