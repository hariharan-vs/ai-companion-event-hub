import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  MessageSquare,
  Users,
  BarChart3,
  CalendarDays,
  GraduationCap,
  Sparkles,
  ArrowRight,
  Bot,
  Zap,
  Shield,
  ChevronDown,
} from "lucide-react";

const FEATURES = [
  {
    icon: Bot,
    title: "AI-Powered Chatbot",
    desc: "150+ FAQs answered instantly with NLP-driven accuracy.",
    gradient: "from-primary to-accent",
  },
  {
    icon: Users,
    title: "Smart Registration",
    desc: "Auto-generated IDs, QR badges, and email confirmations.",
    gradient: "from-accent to-[hsl(185,100%,45%)]",
  },
  {
    icon: BarChart3,
    title: "Live Dashboard",
    desc: "Real-time analytics with interactive charts and insights.",
    gradient: "from-[hsl(185,100%,45%)] to-primary",
  },
  {
    icon: CalendarDays,
    title: "Schedule Manager",
    desc: "Timeline views, session cards, and speaker management.",
    gradient: "from-primary to-[hsl(185,100%,45%)]",
  },
];

const STATS = [
  { label: "FAQs Covered", value: "150+", icon: MessageSquare },
  { label: "NLP Accuracy", value: "84%", icon: Zap },
  { label: "Response Time", value: "<1s", icon: Shield },
  { label: "Events Managed", value: "∞", icon: CalendarDays },
];

const floatingVariants = {
  animate: (i: number) => ({
    y: [0, -12, 0],
    transition: {
      duration: 3 + i * 0.5,
      repeat: Infinity,
      ease: "easeInOut" as const,
    },
  }),
};

export default function Landing() {
  const navigate = useNavigate();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowContent(true), 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Animated background orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ x: [0, 60, 0], y: [0, -40, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[10%] left-[15%] w-[500px] h-[500px] rounded-full opacity-[0.07]"
          style={{ background: "radial-gradient(circle, hsl(var(--primary)), transparent 70%)" }}
        />
        <motion.div
          animate={{ x: [0, -50, 0], y: [0, 50, 0], scale: [1, 1.3, 1] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[10%] right-[10%] w-[600px] h-[600px] rounded-full opacity-[0.05]"
          style={{ background: "radial-gradient(circle, hsl(var(--accent)), transparent 70%)" }}
        />
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, 30, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[50%] left-[50%] w-[400px] h-[400px] rounded-full opacity-[0.04]"
          style={{ background: "radial-gradient(circle, hsl(var(--neon-teal) / 1), transparent 70%)" }}
        />
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 py-20">
        <AnimatePresence>
          {showContent && (
            <>
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="mb-8"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 backdrop-blur-md">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-primary">AI-Powered College Platform</span>
                </div>
              </motion.div>

              {/* Main heading */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
                className="text-center max-w-4xl mx-auto"
              >
                <h1 className="font-display text-4xl sm:text-5xl md:text-7xl font-bold text-foreground leading-[1.1] tracking-tight">
                  Your College,{" "}
                  <span className="relative inline-block">
                    <span className="relative z-10 bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-primary)" }}>
                      Reimagined
                    </span>
                    <motion.span
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
                      className="absolute bottom-1 left-0 h-[3px] rounded-full"
                      style={{ background: "var(--gradient-primary)" }}
                    />
                  </span>
                </h1>
              </motion.div>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.35, ease: "easeOut" }}
                className="mt-6 text-lg sm:text-xl text-muted-foreground text-center max-w-2xl leading-relaxed"
              >
                AI-driven FAQ chatbot, smart event registration, real-time dashboards,
                and schedule management — all in one beautiful platform.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
                className="mt-10 flex flex-col sm:flex-row items-center gap-4"
              >
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "var(--shadow-neon)" }}
                  whileTap={{ scale: 0.97 }}
onClick={() => navigate("/auth")}
                   className="btn-gradient !px-8 !py-4 !text-base !rounded-2xl font-semibold flex items-center gap-2 group"
                >
                  Launch App
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </motion.button>
                <motion.a
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  href="#features"
                  className="px-8 py-4 rounded-2xl border border-border text-foreground font-semibold text-base hover:border-primary/40 hover:bg-primary/5 transition-all"
                >
                  Explore Features
                </motion.a>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.7, ease: "easeOut" }}
                className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-3xl mx-auto w-full"
              >
                {STATS.map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    custom={i}
                    variants={floatingVariants}
                    animate="animate"
                    className="glass-card p-4 sm:p-5 text-center group hover:border-primary/30 transition-colors"
                  >
                    <stat.icon className="w-5 h-5 text-primary mx-auto mb-2 group-hover:scale-110 transition-transform" />
                    <p className="font-display text-2xl sm:text-3xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
                  </motion.div>
                ))}
              </motion.div>

              {/* Scroll indicator */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2"
              >
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="flex flex-col items-center gap-1 text-muted-foreground/50"
                >
                  <span className="text-xs">Scroll</span>
                  <ChevronDown className="w-4 h-4" />
                </motion.div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-24 sm:py-32 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-sm font-medium text-primary uppercase tracking-widest">Features</span>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mt-3">
              Everything You Need
            </h2>
            <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
              A comprehensive suite of tools designed for modern college event management.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <motion.div
                  whileHover={{ y: -4, boxShadow: "var(--shadow-glow)" }}
                  className="glass-card p-6 sm:p-8 h-full group cursor-default transition-all"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.gradient} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                    <f.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="font-display text-xl font-semibold text-foreground mb-2">{f.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{f.desc}</p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 sm:py-32 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center"
        >
          <div className="glass-card p-10 sm:p-16 relative overflow-hidden">
            {/* Decorative gradient */}
            <div
              className="absolute inset-0 opacity-[0.06]"
              style={{ background: "radial-gradient(ellipse at center, hsl(var(--primary)), transparent 70%)" }}
            />
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{ background: "var(--gradient-primary)" }}>
                <GraduationCap className="w-8 h-8 text-primary-foreground" />
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Explore the AI chatbot, register for events, and manage everything from one sleek interface.
              </p>
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "var(--shadow-neon)" }}
                whileTap={{ scale: 0.97 }}
onClick={() => navigate("/auth")}
                 className="btn-gradient !px-10 !py-4 !text-base !rounded-2xl font-semibold inline-flex items-center gap-2 group"
              >
                Enter Platform
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-8">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: "var(--gradient-primary)" }}>
              <GraduationCap className="w-3.5 h-3.5 text-primary-foreground" />
            </div>
            <span className="font-display font-semibold text-foreground">AI FAQ & Event Sphere</span>
            <span>© 2026</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="badge-glow">React + Tailwind</span>
            <span className="badge-glow">NLP Powered</span>
            <span className="badge-glow">Framer Motion</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
