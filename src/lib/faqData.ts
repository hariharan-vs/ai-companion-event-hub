export interface Intent {
  tag: string;
  patterns: string[];
  responses: string[];
}

export const faqData: Intent[] = [
  // College Admission
  { tag: "admission_process", patterns: ["how do i apply for admission", "admission process", "how to get admission", "how to apply", "admission steps", "enrollment process", "how can i enroll", "admission requirements", "apply for admission", "application steps"], responses: ["You can apply through our online portal at college.edu/apply. Fill the application form, upload documents, and pay the application fee. Shortlisted candidates will be called for counseling."] },
  { tag: "admission_deadline", patterns: ["admission deadline", "last date for admission", "when do admissions close", "deadline for applications", "admission last date"], responses: ["The admission deadline for the current academic year is June 30th. Late applications may be accepted until July 15th with a late fee."] },
  { tag: "admission_documents", patterns: ["documents needed for admission", "documents required", "required documents list", "what papers do i need", "admission document checklist"], responses: ["You need: 10th & 12th marksheets, transfer certificate, migration certificate, Aadhaar card, passport-size photos, and category certificate (if applicable)."] },
  { tag: "admission_fees", patterns: ["admission fees", "tuition fee", "fee structure", "total cost", "semester fee", "how much is the fee"], responses: ["The annual tuition fee ranges from ₹50,000 to ₹1,20,000 depending on the program. Hostel and mess charges are extra."] },
  { tag: "admission_eligibility", patterns: ["eligibility for admission", "eligibility criteria", "minimum marks", "what percentage is needed", "eligibility requirements"], responses: ["General category needs 50% in 12th. SC/ST candidates need 45%. Some programs require specific subjects."] },

  // Hostel
  { tag: "hostel_availability", patterns: ["is hostel available", "hostel facility", "hostel rooms available", "can i get a hostel room", "hostel accommodation", "hostel rooms"], responses: ["Yes, we have separate hostel facilities for boys and girls. Rooms are allotted on first-come-first-served basis."] },
  { tag: "hostel_fees", patterns: ["hostel fees", "hostel charges per year", "mess fee", "hostel and mess charges", "hostel cost"], responses: ["Hostel fee is ₹30,000 per semester. Mess charges are ₹15,000 per semester. Security deposit of ₹5,000 is refundable."] },
  { tag: "hostel_rules", patterns: ["hostel rules", "hostel timings", "hostel curfew", "hostel regulations", "rules in hostel"], responses: ["Hostel curfew is 9:30 PM. Visitors allowed only in the common area from 4-6 PM. No cooking in rooms. Ragging is strictly prohibited."] },
  { tag: "hostel_wifi", patterns: ["wifi in hostel", "hostel internet", "hostel wifi speed", "rooms have internet", "hostel wifi"], responses: ["Yes, all hostel rooms have WiFi with 50 Mbps speed. Each student gets a personal login."] },

  // Events
  { tag: "event_registration", patterns: ["register for events", "event registration", "sign up for event", "how do i join an event", "register for hackathon", "event signup"], responses: ["Visit the Events section on our portal or use the EventSphere system. Select the event, fill your details, and confirm registration."] },
  { tag: "event_fees", patterns: ["registration fee for events", "event participation cost", "how much do events cost", "are events free", "event charges"], responses: ["Most departmental events are free. Technical fests and workshops may have fees ranging from ₹100 to ₹500."] },
  { tag: "event_schedule", patterns: ["upcoming events", "events schedule", "event calendar", "next event", "list of events", "college fest"], responses: ["Check our event calendar! Major upcoming events include TechFest (March), Cultural Night (April), and Sports Day (February)."] },
  { tag: "event_certificate", patterns: ["get a certificate", "event participation certificate", "certificates for events", "do you give certificates"], responses: ["Yes, participation and winner certificates are provided for all official college events. Digital certificates are sent via email within a week."] },

  // Lab
  { tag: "lab_timings", patterns: ["lab timings", "computer lab open", "lab schedule", "lab hours", "when can i use the lab", "lab timing"], responses: ["Computer labs are open from 9 AM to 6 PM on weekdays. Extended hours till 8 PM during exam season."] },
  { tag: "lab_rules", patterns: ["lab rules", "lab regulations", "guidelines for lab", "lab dos and donts", "rules for lab"], responses: ["Wear lab coat in science labs. No food or drinks. Handle equipment carefully. Log your attendance."] },
  { tag: "lab_software", patterns: ["software in lab", "lab computer software", "labs have matlab", "programming tools in lab", "lab software"], responses: ["Labs have Python, MATLAB, AutoCAD, MS Office, VS Code, Eclipse, and other standard software."] },

  // Placements
  { tag: "placement_stats", patterns: ["placement statistics", "placement record", "how many students got placed", "placement percentage", "last year placements"], responses: ["Last year, 85% of eligible students were placed. Highest package was ₹24 LPA and average was ₹6.5 LPA."] },
  { tag: "placement_companies", patterns: ["companies visit for placement", "recruiters list", "top companies", "who recruits", "placement companies"], responses: ["Regular recruiters include TCS, Infosys, Wipro, Cognizant, Amazon, Google, Microsoft, and Deloitte. 50+ companies visit annually."] },
  { tag: "placement_eligibility", patterns: ["eligibility for placements", "placement criteria", "minimum cgpa for placement", "who can sit for placements", "placement eligibility"], responses: ["Minimum 6.0 CGPA with no active backlogs. You must be in the final year."] },
  { tag: "placement_preparation", patterns: ["prepare for placements", "placement preparation", "what should i study for placements", "placement training", "placement tips"], responses: ["Focus on DSA, aptitude, and communication skills. College provides placement training from 5th semester. Practice on LeetCode and HackerRank."] },
  { tag: "placement_internship", patterns: ["internships provided", "summer internship", "how to get internship", "internship placement", "internship opportunities"], responses: ["Yes, the placement cell arranges summer internships for 3rd year students. Many lead to pre-placement offers."] },

  // Clubs
  { tag: "clubs_list", patterns: ["clubs in college", "student clubs", "college clubs", "student organizations", "how many clubs"], responses: ["We have 15+ clubs: Coding Club, Robotics Club, Photography Club, Music Club, Dance Club, Literary Club, NSS, NCC, Entrepreneurship Cell, and more."] },
  { tag: "club_join", patterns: ["join a club", "club membership", "can i join multiple clubs", "become a club member", "join club"], responses: ["Attend the club orientation at the start of each semester. Fill the membership form. You can join up to 3 clubs."] },
  { tag: "club_activities", patterns: ["activities do clubs organize", "club events", "weekly club activities", "what happens in clubs", "club activities", "coding club"], responses: ["Clubs organize weekly sessions, workshops, competitions, hackathons, and annual showcases."] },
  { tag: "club_benefits", patterns: ["benefits of joining a club", "why join a club", "are clubs useful", "club advantages"], responses: ["Clubs build leadership, teamwork, and technical skills. Great for resumes. Many club members get referrals for internships and jobs."] },

  // General
  { tag: "greeting", patterns: ["hi", "hello", "hey", "good morning", "whats up", "howdy", "hi there", "hello there", "greetings", "hello chatbot"], responses: ["Hello! Welcome to the College FAQ Chatbot. How can I help you today? 😊"] },
  { tag: "goodbye", patterns: ["bye", "goodbye", "see you", "thanks bye", "thats all", "exit", "quit"], responses: ["Goodbye! Feel free to come back anytime. All the best! 👋"] },
  { tag: "thanks", patterns: ["thank you", "thanks", "thanks a lot", "thank you so much", "appreciate it"], responses: ["You're welcome! Let me know if you have any other questions. 😊"] },
  { tag: "college_location", patterns: ["where is the college", "college address", "how to reach college", "college location", "campus address"], responses: ["The college is at 123 University Road, Tech City. Nearest metro station is University Metro (500m)."] },
  { tag: "library", patterns: ["library timings", "when is library open", "library hours", "library on weekends", "library schedule"], responses: ["The library is open 8 AM-9 PM weekdays and 9 AM-5 PM weekends. Digital library is accessible 24/7 with student login."] },
  { tag: "sports", patterns: ["sports facilities", "have a gym", "sports in college", "playground available", "sports activities", "swimming pool"], responses: ["We have cricket, football, basketball, badminton courts, a swimming pool, and a fully equipped gym."] },
  { tag: "canteen", patterns: ["canteen timings", "food on campus", "where to eat", "cafeteria menu", "is there a canteen"], responses: ["The main canteen is open 8 AM-7 PM. We also have a juice bar and a South Indian food stall. Student-friendly prices!"] },
  { tag: "scholarships", patterns: ["scholarships available", "apply for scholarship", "merit scholarship", "financial aid", "fee concession", "scholarship"], responses: ["We offer merit scholarships (top 10% get 25-100% fee waiver), need-based scholarships, and government scholarships."] },
  { tag: "exam_schedule", patterns: ["when are the exams", "exam timetable", "end semester exam dates", "exam schedule", "exams start"], responses: ["End semester exams: Nov/Dec and Apr/May. Mid-semester: Sep and Feb. Detailed timetable released 2 weeks before."] },
  { tag: "attendance", patterns: ["minimum attendance", "attendance rules", "how much attendance", "attendance criteria", "low attendance"], responses: ["Minimum 75% attendance is mandatory. Below 65%, you may be debarred from exams."] },
  { tag: "transport", patterns: ["college bus", "transport facility", "bus routes", "college bus pass", "shuttle service"], responses: ["College buses run on 12 routes across the city. Bus pass costs ₹3,000 per semester."] },
  { tag: "wifi_campus", patterns: ["wifi on campus", "campus internet", "free wifi", "wifi password", "internet access", "campus wifi"], responses: ["Free WiFi across campus. Connect to 'CampusNet' and login with your student ID. 100 Mbps."] },
  { tag: "medical", patterns: ["medical facility", "is there a doctor", "health center", "first aid available", "medical emergency"], responses: ["Campus health center: 9 AM-5 PM with a doctor and nurse. Ambulance on standby for emergencies."] },
  { tag: "dress_code", patterns: ["dress code", "uniform required", "what to wear", "dress code rules"], responses: ["No strict dress code for regular classes. Formal attire for presentations, lab coats for lab sessions."] },
  { tag: "contact", patterns: ["contact the college", "phone number", "email address", "contact details", "help desk"], responses: ["Phone: +91-1234-567890. Email: info@college.edu. Help desk: 9 AM-5 PM weekdays."] },
];
