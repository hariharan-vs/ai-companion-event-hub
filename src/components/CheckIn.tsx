import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScanLine, Keyboard, CheckCircle, XCircle, UserCheck, Camera, CameraOff, Search } from "lucide-react";
import { findAttendeeById, checkInAttendee, getAttendees, type Attendee } from "@/lib/eventStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

type Mode = "scan" | "manual";

export default function CheckIn() {
  const [mode, setMode] = useState<Mode>("manual");
  const [manualId, setManualId] = useState("");
  const [result, setResult] = useState<{ attendee: Attendee; alreadyCheckedIn: boolean } | null>(null);
  const [error, setError] = useState("");
  const [scanning, setScanning] = useState(false);
  const scannerRef = useRef<any>(null);
  const scannerContainerId = "qr-reader";

  // Stats
  const attendees = getAttendees();
  const checkedInCount = attendees.filter((a) => a.checked_in).length;

  const handleCheckIn = useCallback((attendeeId: string) => {
    setError("");
    setResult(null);

    const found = findAttendeeById(attendeeId.trim().toUpperCase());
    if (!found) {
      setError(`No attendee found with ID: ${attendeeId}`);
      toast.error("Attendee not found");
      return;
    }

    if (found.checked_in) {
      setResult({ attendee: found, alreadyCheckedIn: true });
      toast.warning(`${found.name} is already checked in`);
      return;
    }

    const updated = checkInAttendee(found.attendee_id);
    if (updated) {
      setResult({ attendee: updated, alreadyCheckedIn: false });
      toast.success(`${updated.name} checked in successfully!`);
    }
  }, []);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualId.trim()) return;
    handleCheckIn(manualId);
    setManualId("");
  };

  // QR Scanner
  const startScanner = useCallback(async () => {
    try {
      const { Html5Qrcode } = await import("html5-qrcode");
      if (scannerRef.current) {
        await scannerRef.current.stop().catch(() => {});
        scannerRef.current = null;
      }
      const scanner = new Html5Qrcode(scannerContainerId);
      scannerRef.current = scanner;
      await scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText: string) => {
          try {
            const data = JSON.parse(decodedText);
            if (data.id) {
              handleCheckIn(data.id);
            }
          } catch {
            // Try as plain text ID
            handleCheckIn(decodedText);
          }
        },
        () => {} // ignore scan failures
      );
      setScanning(true);
    } catch (err: any) {
      toast.error("Camera access denied or unavailable");
      setMode("manual");
    }
  }, [handleCheckIn]);

  const stopScanner = useCallback(async () => {
    if (scannerRef.current) {
      await scannerRef.current.stop().catch(() => {});
      scannerRef.current = null;
    }
    setScanning(false);
  }, []);

  useEffect(() => {
    if (mode === "scan") {
      startScanner();
    } else {
      stopScanner();
    }
    return () => {
      stopScanner();
    };
  }, [mode, startScanner, stopScanner]);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
          <UserCheck className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">Attendee Check-In</h2>
          <p className="text-sm text-muted-foreground">
            {checkedInCount} / {attendees.length} checked in
          </p>
        </div>
      </motion.div>

      {/* Progress Bar */}
      <div className="glass-card p-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-muted-foreground">Check-in Progress</span>
          <span className="text-primary font-semibold">
            {attendees.length > 0 ? Math.round((checkedInCount / attendees.length) * 100) : 0}%
          </span>
        </div>
        <div className="h-2.5 rounded-full bg-muted overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${attendees.length > 0 ? (checkedInCount / attendees.length) * 100 : 0}%` }}
            transition={{ duration: 0.8 }}
          />
        </div>
      </div>

      {/* Mode Toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setMode("manual")}
          className={`nav-pill flex items-center gap-2 ${mode === "manual" ? "nav-pill-active" : "nav-pill-inactive"}`}
        >
          <Keyboard className="w-4 h-4" /> Enter ID
        </button>
        <button
          onClick={() => setMode("scan")}
          className={`nav-pill flex items-center gap-2 ${mode === "scan" ? "nav-pill-active" : "nav-pill-inactive"}`}
        >
          <ScanLine className="w-4 h-4" /> Scan QR
        </button>
      </div>

      {/* Manual Entry */}
      <AnimatePresence mode="wait">
        {mode === "manual" ? (
          <motion.div key="manual" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <form onSubmit={handleManualSubmit} className="glass-card p-6 space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <Search className="w-5 h-5 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Enter the attendee's unique ID (e.g. ATT-SAMPLE01)</p>
              </div>
              <div className="flex gap-3">
                <Input
                  value={manualId}
                  onChange={(e) => setManualId(e.target.value.toUpperCase())}
                  placeholder="ATT-XXXXXXXX"
                  className="font-mono text-lg tracking-wider"
                  autoFocus
                />
                <Button type="submit" disabled={!manualId.trim()}>
                  Check In
                </Button>
              </div>
            </form>
          </motion.div>
        ) : (
          <motion.div key="scan" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <div className="glass-card p-6 space-y-4">
              <div className="flex items-center gap-3 mb-2">
                {scanning ? <Camera className="w-5 h-5 text-primary" /> : <CameraOff className="w-5 h-5 text-muted-foreground" />}
                <p className="text-sm text-muted-foreground">Point the camera at the attendee's QR badge</p>
              </div>
              <div
                id={scannerContainerId}
                className="w-full max-w-sm mx-auto rounded-xl overflow-hidden border border-border bg-muted/50"
                style={{ minHeight: 300 }}
              />
              {scanning && (
                <p className="text-center text-xs text-primary animate-pulse">Scanning for QR codes...</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Result Card */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className={`glass-card p-5 border-2 ${
              result.alreadyCheckedIn ? "border-amber-500/40" : "border-primary/40"
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 mt-1">
                {result.alreadyCheckedIn ? (
                  <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                    <XCircle className="w-5 h-5 text-amber-400" />
                  </div>
                ) : (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.1 }}
                    className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center"
                  >
                    <CheckCircle className="w-5 h-5 text-primary" />
                  </motion.div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground text-lg">
                  {result.alreadyCheckedIn ? "Already Checked In" : "Check-In Successful!"}
                </h3>
                <div className="mt-2 space-y-1 text-sm">
                  <p className="text-foreground font-medium">{result.attendee.name}</p>
                  <p className="font-mono text-primary text-xs">{result.attendee.attendee_id}</p>
                  <p className="text-muted-foreground">{result.attendee.event_name}</p>
                  <p className="text-muted-foreground">{result.attendee.college}</p>
                  {result.attendee.checked_in_at && (
                    <p className="text-xs text-muted-foreground">
                      Checked in at: {result.attendee.checked_in_at}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="glass-card p-4 border-2 border-destructive/40"
          >
            <div className="flex items-center gap-3">
              <XCircle className="w-5 h-5 text-destructive flex-shrink-0" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Recent Check-ins */}
      {attendees.filter((a) => a.checked_in).length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-5">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Recent Check-ins
          </h3>
          <div className="space-y-2">
            {attendees
              .filter((a) => a.checked_in)
              .reverse()
              .slice(0, 10)
              .map((a) => (
                <div key={a.attendee_id} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{a.name}</p>
                      <p className="text-xs text-muted-foreground">{a.event_name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-xs text-primary">{a.attendee_id}</p>
                    <p className="text-xs text-muted-foreground">{a.checked_in_at}</p>
                  </div>
                </div>
              ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
