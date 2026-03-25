import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarDays, Plus, Trash2, Clock, MapPin, Mic2, ChevronDown, ChevronUp, Filter } from "lucide-react";
import { getSchedules, createSchedule, type Session, type EventSchedule } from "@/lib/eventStore";

export default function ScheduleManager() {
  const [schedules, setSchedules] = useState<EventSchedule[]>(getSchedules());
  const [eventName, setEventName] = useState("");
  const [sessions, setSessions] = useState<Session[]>([{ speaker: "", topic: "", time: "", venue: "" }]);
  const [expanded, setExpanded] = useState<number | null>(0);
  const [filter, setFilter] = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => setSchedules(getSchedules()), []);

  const addRow = () => setSessions((s) => [...s, { speaker: "", topic: "", time: "", venue: "" }]);
  const removeRow = (i: number) => setSessions((s) => s.filter((_, idx) => idx !== i));
  const updateRow = (i: number, field: keyof Session, value: string) =>
    setSessions((s) => s.map((row, idx) => (idx === i ? { ...row, [field]: value } : row)));

  const handleCreate = () => {
    if (!eventName.trim()) return;
    const validSessions = sessions.filter((s) => s.speaker && s.topic);
    if (!validSessions.length) return;
    createSchedule(eventName, validSessions);
    setSchedules(getSchedules());
    setEventName("");
    setSessions([{ speaker: "", topic: "", time: "", venue: "" }]);
    setShowForm(false);
  };

  const filtered = schedules.filter(s =>
    !filter || s.event_name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
            <CalendarDays className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">Event Schedules</h2>
            <p className="text-sm text-muted-foreground">{schedules.length} schedules created</p>
          </div>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-gradient !py-2 !px-4 !text-sm flex items-center gap-2">
          <Plus className="w-4 h-4" /> New Schedule
        </button>
      </motion.div>

      {/* Create form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="glass-card p-5">
              <input value={eventName} onChange={(e) => setEventName(e.target.value)} placeholder="Event Name" className="glass-input w-full mb-4" />
              <div className="space-y-2">
                {sessions.map((s, i) => (
                  <div key={i} className="grid grid-cols-2 md:grid-cols-5 gap-2">
                    <input value={s.speaker} onChange={(e) => updateRow(i, "speaker", e.target.value)} placeholder="Speaker" className="glass-input" />
                    <input value={s.topic} onChange={(e) => updateRow(i, "topic", e.target.value)} placeholder="Topic" className="glass-input" />
                    <input value={s.time} onChange={(e) => updateRow(i, "time", e.target.value)} placeholder="Time" className="glass-input" />
                    <input value={s.venue} onChange={(e) => updateRow(i, "venue", e.target.value)} placeholder="Venue" className="glass-input" />
                    {sessions.length > 1 && (
                      <button onClick={() => removeRow(i)} className="text-destructive hover:text-destructive/80 flex items-center justify-center transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex gap-3 mt-4">
                <button onClick={addRow} className="nav-pill nav-pill-inactive flex items-center gap-1 text-sm">
                  <Plus className="w-3 h-3" /> Add Session
                </button>
                <button onClick={handleCreate} className="btn-gradient !py-2 !text-sm">Create Schedule</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filter */}
      {schedules.length > 1 && (
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input value={filter} onChange={e => setFilter(e.target.value)} placeholder="Filter schedules..." className="glass-input w-full pl-10" />
        </div>
      )}

      {/* Timeline schedules */}
      <div className="space-y-4">
        {filtered.map((sched, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass-card-hover"
          >
            <button
              onClick={() => setExpanded(expanded === i ? null : i)}
              className="w-full p-5 flex items-center justify-between text-left"
            >
              <div className="flex items-center gap-3">
                <div className="timeline-dot" />
                <div>
                  <h3 className="text-base font-semibold text-foreground">{sched.event_name}</h3>
                  <p className="text-xs text-muted-foreground">{sched.sessions.length} sessions • {sched.created_at}</p>
                </div>
              </div>
              {expanded === i ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
            </button>

            <AnimatePresence>
              {expanded === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-5 space-y-3">
                    {sched.sessions.map((sess, j) => (
                      <motion.div
                        key={j}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: j * 0.05 }}
                        className="relative pl-6 border-l-2 border-primary/20"
                      >
                        <div className="absolute -left-[5px] top-2 w-2 h-2 rounded-full bg-primary" />
                        <div className="glass-card p-4">
                          <h4 className="font-medium text-foreground text-sm mb-2">{sess.topic}</h4>
                          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1"><Mic2 className="w-3 h-3" /> {sess.speaker}</span>
                            {sess.time && <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {sess.time}</span>}
                            {sess.venue && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {sess.venue}</span>}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-muted-foreground text-sm py-8">
          {schedules.length === 0 ? "No schedules yet. Create one!" : "No matches found."}
        </p>
      )}
    </div>
  );
}
