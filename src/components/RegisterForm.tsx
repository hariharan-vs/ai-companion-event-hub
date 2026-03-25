import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserPlus, CheckCircle, Search, Download, QrCode, X, Users, Mail, PartyPopper } from "lucide-react";
import { registerAttendee, getAttendees, type Attendee } from "@/lib/eventStore";
import { QRCodeSVG } from "qrcode.react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

const EVENTS = ["TechFest 2026", "Hackathon 2026", "Cultural Night", "Workshop Series", "Sports Meet"];

export default function RegisterForm() {
  const { role } = useAuth();
  const isAdmin = role === "admin";
  const [form, setForm] = useState({ name: "", email: "", phone: "", college: "", event_name: "" });
  const [result, setResult] = useState<Attendee | null>(null);
  const [showList, setShowList] = useState(false);
  const [search, setSearch] = useState("");
  const [filterEvent, setFilterEvent] = useState("");
  const [qrAttendee, setQrAttendee] = useState<Attendee | null>(null);
  const [emailSent, setEmailSent] = useState(false);
  const { toast } = useToast();

  const attendees = getAttendees();
  const filtered = attendees.filter((a) => {
    const matchSearch = !search || [a.name, a.email, a.college, a.attendee_id].some(f => f.toLowerCase().includes(search.toLowerCase()));
    const matchEvent = !filterEvent || a.event_name === filterEvent;
    return matchSearch && matchEvent;
  });

  const events = [...new Set(attendees.map(a => a.event_name))];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone || !form.college || !form.event_name) return;
    const attendee = registerAttendee(form);
    setResult(attendee);
    setForm({ name: "", email: "", phone: "", college: "", event_name: "" });

    // Simulate email confirmation
    setEmailSent(false);
    setTimeout(() => {
      setEmailSent(true);
      toast({
        title: "📧 Confirmation Email Sent!",
        description: `A confirmation email has been sent to ${attendee.email} with event details and QR check-in badge.`,
      });
    }, 1500);

    setTimeout(() => {
      setResult(null);
      setEmailSent(false);
    }, 10000);
  };

  const exportCSV = () => {
    const headers = "ID,Name,Email,Phone,College,Event,Registered At\n";
    const rows = filtered.map(a => `${a.attendee_id},${a.name},${a.email},${a.phone},${a.college},${a.event_name},${a.registered_at}`).join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "attendees.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex gap-3">
        <button onClick={() => setShowList(false)} className={`nav-pill ${!showList ? "nav-pill-active" : "nav-pill-inactive"} flex items-center gap-2`}>
          <UserPlus className="w-4 h-4" /> Register
        </button>
        {isAdmin && (
          <button onClick={() => setShowList(true)} className={`nav-pill ${showList ? "nav-pill-active" : "nav-pill-inactive"} flex items-center gap-2`}>
            <Users className="w-4 h-4" /> Attendees ({attendees.length})
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {!showList ? (
          <motion.div key="form" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <div className="glass-card p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                  <UserPlus className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Event Registration</h2>
                  <p className="text-sm text-muted-foreground">Register for upcoming college events</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input type="text" placeholder="Full Name" value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} required className="glass-input w-full" />
                  <input type="email" placeholder="Email" value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} required className="glass-input w-full" />
                  <input type="tel" placeholder="Phone" value={form.phone} onChange={e => setForm(f => ({...f, phone: e.target.value}))} required className="glass-input w-full" />
                  <input type="text" placeholder="College" value={form.college} onChange={e => setForm(f => ({...f, college: e.target.value}))} required className="glass-input w-full" />
                </div>
                <select value={form.event_name} onChange={e => setForm(f => ({...f, event_name: e.target.value}))} required className="glass-input w-full">
                  <option value="">Select Event</option>
                  {EVENTS.map(ev => <option key={ev} value={ev}>{ev}</option>)}
                </select>
                <button type="submit" className="btn-gradient w-full">Register Now</button>
              </form>
            </div>

            {/* Success card with email confirmation */}
            <AnimatePresence>
              {result && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -10 }}
                  className="glass-card p-5 mt-4 border-primary/30"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-0.5">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", delay: 0.2 }}
                      >
                        <PartyPopper className="w-6 h-6 text-primary" />
                      </motion.div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-1">Registration Successful!</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        ID: <span className="font-mono font-bold text-primary">{result.attendee_id}</span>
                      </p>

                      {/* Email confirmation status */}
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex items-center gap-2 mb-3 p-2.5 rounded-lg bg-muted/50"
                      >
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        {emailSent ? (
                          <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-xs text-primary font-medium flex items-center gap-1"
                          >
                            <CheckCircle className="w-3.5 h-3.5" /> Confirmation sent to {result.email}
                          </motion.span>
                        ) : (
                          <span className="text-xs text-muted-foreground flex items-center gap-2">
                            Sending confirmation email
                            <span className="flex gap-0.5">
                              <span className="w-1 h-1 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0ms" }} />
                              <span className="w-1 h-1 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "150ms" }} />
                              <span className="w-1 h-1 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "300ms" }} />
                            </span>
                          </span>
                        )}
                      </motion.div>

                      <div className="flex items-center gap-4">
                        <div className="bg-background p-2 rounded-lg border border-border">
                          <QRCodeSVG value={JSON.stringify({ id: result.attendee_id, name: result.name, event: result.event_name })} size={80} bgColor="transparent" fgColor="currentColor" className="text-foreground" />
                        </div>
                        <div className="text-xs text-muted-foreground space-y-1">
                          <p className="text-foreground font-medium">{result.name}</p>
                          <p>{result.event_name}</p>
                          <p>Scan QR for check-in</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div key="list" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <div className="glass-card p-5">
              <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search attendees..." className="glass-input w-full pl-10" />
                </div>
                <select value={filterEvent} onChange={e => setFilterEvent(e.target.value)} className="glass-input">
                  <option value="">All Events</option>
                  {events.map(ev => <option key={ev} value={ev}>{ev}</option>)}
                </select>
                <button onClick={exportCSV} className="nav-pill nav-pill-inactive flex items-center gap-2 whitespace-nowrap">
                  <Download className="w-4 h-4" /> Export CSV
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-muted-foreground text-xs uppercase tracking-wider border-b border-border">
                      <th className="text-left py-2 pr-3">ID</th>
                      <th className="text-left py-2 pr-3">Name</th>
                      <th className="text-left py-2 pr-3 hidden md:table-cell">Email</th>
                      <th className="text-left py-2 pr-3 hidden lg:table-cell">College</th>
                      <th className="text-left py-2 pr-3">Event</th>
                      <th className="text-left py-2">QR</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((a, i) => (
                      <motion.tr
                        key={a.attendee_id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.03 }}
                        className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                      >
                        <td className="py-2.5 pr-3 font-mono text-xs text-primary">{a.attendee_id}</td>
                        <td className="py-2.5 pr-3 text-foreground font-medium">{a.name}</td>
                        <td className="py-2.5 pr-3 text-muted-foreground hidden md:table-cell">{a.email}</td>
                        <td className="py-2.5 pr-3 text-muted-foreground hidden lg:table-cell">{a.college}</td>
                        <td className="py-2.5 pr-3"><span className="badge-glow">{a.event_name}</span></td>
                        <td className="py-2.5">
                          <button onClick={() => setQrAttendee(a)} className="text-muted-foreground hover:text-primary transition-colors">
                            <QrCode className="w-4 h-4" />
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
                {filtered.length === 0 && <p className="text-center text-muted-foreground text-sm py-6">No attendees found</p>}
              </div>
              <p className="text-xs text-muted-foreground mt-3">{filtered.length} of {attendees.length} attendees</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* QR Modal */}
      <AnimatePresence>
        {qrAttendee && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setQrAttendee(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card p-6 max-w-sm w-full text-center relative"
              onClick={e => e.stopPropagation()}
            >
              <button onClick={() => setQrAttendee(null)} className="absolute top-3 right-3 text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
              <h3 className="font-semibold text-foreground text-lg mb-1">Check-in Badge</h3>
              <p className="text-sm text-muted-foreground mb-4">{qrAttendee.name}</p>
              <div className="bg-background p-4 rounded-xl inline-block mb-4 border border-border">
                <QRCodeSVG
                  value={JSON.stringify({ id: qrAttendee.attendee_id, name: qrAttendee.name, email: qrAttendee.email, event: qrAttendee.event_name })}
                  size={160}
                  bgColor="transparent"
                  fgColor="currentColor"
                  className="text-foreground"
                />
              </div>
              <div className="space-y-1 text-sm">
                <p className="font-mono text-primary">{qrAttendee.attendee_id}</p>
                <p className="text-muted-foreground">{qrAttendee.event_name}</p>
                <p className="text-muted-foreground">{qrAttendee.college}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
