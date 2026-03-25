/**
 * Client-side event management store using localStorage.
 */

export interface Attendee {
  attendee_id: string;
  name: string;
  email: string;
  phone: string;
  college: string;
  event_name: string;
  registered_at: string;
  checked_in: boolean;
  checked_in_at?: string;
}

export interface Session {
  speaker: string;
  topic: string;
  time: string;
  venue: string;
}

export interface EventSchedule {
  event_name: string;
  created_at: string;
  sessions: Session[];
}

const ATTENDEES_KEY = "eventsphere_attendees";
const SCHEDULES_KEY = "eventsphere_schedules";

function generateId(): string {
  return "ATT-" + Math.random().toString(36).substring(2, 10).toUpperCase();
}

// Seed some sample data on first load
function seedData() {
  if (!localStorage.getItem(ATTENDEES_KEY)) {
    const samples: Attendee[] = [
      { attendee_id: "ATT-SAMPLE01", name: "Rahul Sharma", email: "rahul@example.com", phone: "9876543210", college: "IIT Delhi", event_name: "TechFest 2026", registered_at: "2026-03-01 10:00", checked_in: false },
      { attendee_id: "ATT-SAMPLE02", name: "Priya Patel", email: "priya@example.com", phone: "9876543211", college: "NIT Trichy", event_name: "Hackathon 2026", registered_at: "2026-03-02 14:30", checked_in: false },
      { attendee_id: "ATT-SAMPLE03", name: "Amit Kumar", email: "amit@example.com", phone: "9876543212", college: "BITS Pilani", event_name: "TechFest 2026", registered_at: "2026-03-03 09:15", checked_in: false },
      { attendee_id: "ATT-SAMPLE04", name: "Sneha Reddy", email: "sneha@example.com", phone: "9876543213", college: "VIT Vellore", event_name: "Cultural Night", registered_at: "2026-03-04 11:00", checked_in: false },
      { attendee_id: "ATT-SAMPLE05", name: "Arjun Nair", email: "arjun@example.com", phone: "9876543214", college: "IIIT Hyderabad", event_name: "Hackathon 2026", registered_at: "2026-03-05 16:45", checked_in: false },
    ];
    localStorage.setItem(ATTENDEES_KEY, JSON.stringify(samples));
  }
  if (!localStorage.getItem(SCHEDULES_KEY)) {
    const samples: EventSchedule[] = [
      {
        event_name: "TechFest 2026",
        created_at: "2026-02-15 09:00",
        sessions: [
          { speaker: "Dr. A. Rao", topic: "AI in Healthcare", time: "10:00 AM", venue: "Auditorium A" },
          { speaker: "Prof. S. Kumar", topic: "Cloud Computing", time: "12:00 PM", venue: "Hall B" },
          { speaker: "Ms. P. Gupta", topic: "Cybersecurity Trends", time: "2:00 PM", venue: "Lab 3" },
        ],
      },
    ];
    localStorage.setItem(SCHEDULES_KEY, JSON.stringify(samples));
  }
}

seedData();

export function getAttendees(): Attendee[] {
  return JSON.parse(localStorage.getItem(ATTENDEES_KEY) || "[]");
}

export function registerAttendee(data: Omit<Attendee, "attendee_id" | "registered_at" | "checked_in" | "checked_in_at">): Attendee {
  const attendees = getAttendees();
  const newAttendee: Attendee = {
    ...data,
    attendee_id: generateId(),
    registered_at: new Date().toLocaleString(),
    checked_in: false,
  };
  attendees.push(newAttendee);
  localStorage.setItem(ATTENDEES_KEY, JSON.stringify(attendees));
  return newAttendee;
}

export function checkInAttendee(attendeeId: string): Attendee | null {
  const attendees = getAttendees();
  const idx = attendees.findIndex((a) => a.attendee_id === attendeeId);
  if (idx === -1) return null;
  attendees[idx].checked_in = true;
  attendees[idx].checked_in_at = new Date().toLocaleString();
  localStorage.setItem(ATTENDEES_KEY, JSON.stringify(attendees));
  return attendees[idx];
}

export function findAttendeeById(attendeeId: string): Attendee | null {
  const attendees = getAttendees();
  return attendees.find((a) => a.attendee_id === attendeeId) || null;
}

export function getSchedules(): EventSchedule[] {
  return JSON.parse(localStorage.getItem(SCHEDULES_KEY) || "[]");
}

export function createSchedule(event_name: string, sessions: Session[]): EventSchedule {
  const schedules = getSchedules();
  const newSchedule: EventSchedule = {
    event_name,
    created_at: new Date().toLocaleString(),
    sessions,
  };
  schedules.push(newSchedule);
  localStorage.setItem(SCHEDULES_KEY, JSON.stringify(schedules));
  return newSchedule;
}

export function getDashboardStats() {
  const attendees = getAttendees();
  const schedules = getSchedules();
  const events = new Set(attendees.map((a) => a.event_name));
  const totalSessions = schedules.reduce((sum, s) => sum + s.sessions.length, 0);
  const checkedInCount = attendees.filter((a) => a.checked_in).length;
  const attendeesPerEvent: Record<string, number> = {};
  for (const a of attendees) {
    attendeesPerEvent[a.event_name] = (attendeesPerEvent[a.event_name] || 0) + 1;
  }
  return {
    totalAttendees: attendees.length,
    totalEvents: events.size,
    totalSchedules: schedules.length,
    totalSessions,
    checkedInCount,
    attendeesPerEvent,
  };
}
