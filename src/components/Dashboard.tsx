import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, Calendar, Layers, BarChart3, TrendingUp } from "lucide-react";
import { getDashboardStats } from "@/lib/eventStore";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const CHART_COLORS = [
  "hsl(162, 63%, 41%)",
  "hsl(175, 65%, 40%)",
  "hsl(185, 100%, 45%)",
  "hsl(142, 71%, 45%)",
  "hsl(38, 92%, 50%)",
  "hsl(200, 80%, 50%)",
];

export default function Dashboard() {
  const [stats, setStats] = useState(getDashboardStats());
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => setLoaded(true), 300);
    const interval = setInterval(() => setStats(getDashboardStats()), 2000);
    return () => clearInterval(interval);
  }, []);

  const cards = [
    { label: "Total Attendees", value: stats.totalAttendees, icon: Users, color: "text-primary" },
    { label: "Total Events", value: stats.totalEvents, icon: Calendar, color: "text-accent" },
    { label: "Schedules", value: stats.totalSchedules, icon: Layers, color: "text-green-400" },
    { label: "Sessions", value: stats.totalSessions, icon: BarChart3, color: "text-amber-400" },
  ];

  const barData = Object.entries(stats.attendeesPerEvent).map(([name, count]) => ({ name, count }));
  const pieData = barData.map((d, i) => ({ ...d, fill: CHART_COLORS[i % CHART_COLORS.length] }));

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
          <TrendingUp className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">Event Dashboard</h2>
          <p className="text-sm text-muted-foreground">Real-time analytics overview</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={loaded ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: i * 0.1, type: "spring", stiffness: 200 }}
            className="stat-card"
          >
            <card.icon className={`w-6 h-6 ${card.color} mx-auto mb-2`} />
            <motion.p
              className="text-3xl font-bold text-foreground"
              initial={{ opacity: 0 }}
              animate={loaded ? { opacity: 1 } : {}}
              transition={{ delay: i * 0.1 + 0.2 }}
            >
              {card.value}
            </motion.p>
            <p className="text-xs text-muted-foreground mt-1">{card.label}</p>
          </motion.div>
        ))}
      </div>

      {barData.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={loaded ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.3 }} className="glass-card p-5">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Attendees per Event</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={barData}>
                <XAxis dataKey="name" tick={{ fill: "hsl(160, 10%, 55%)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "hsl(160, 10%, 55%)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "hsl(170, 20%, 11%)", border: "1px solid hsl(170, 15%, 22%)", borderRadius: 12, fontSize: 12, color: "hsl(160, 15%, 90%)" }} cursor={{ fill: "hsl(162, 63%, 41%, 0.08)" }} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {barData.map((_, i) => (<Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={loaded ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.4 }} className="glass-card p-5">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Distribution</h3>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={pieData} dataKey="count" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} strokeWidth={0}>
                  {pieData.map((entry, i) => (<Cell key={i} fill={entry.fill} />))}
                </Pie>
                <Tooltip contentStyle={{ background: "hsl(170, 20%, 11%)", border: "1px solid hsl(170, 15%, 22%)", borderRadius: 12, fontSize: 12, color: "hsl(160, 15%, 90%)" }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-2 justify-center mt-2">
              {pieData.map((d, i) => (
                <div key={i} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className="w-2 h-2 rounded-full" style={{ background: d.fill }} />
                  {d.name}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {barData.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={loaded ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.5 }} className="glass-card p-5">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Registration Progress</h3>
          <div className="space-y-3">
            {barData.map((item, i) => {
              const pct = Math.round((item.count / stats.totalAttendees) * 100);
              return (
                <div key={item.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-foreground">{item.name}</span>
                    <span className="text-muted-foreground">{item.count} ({pct}%)</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <motion.div className="h-full rounded-full" style={{ background: CHART_COLORS[i % CHART_COLORS.length] }} initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, delay: 0.5 + i * 0.1 }} />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
}
