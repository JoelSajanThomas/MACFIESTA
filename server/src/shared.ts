import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// Shared JWT Secret
export const JWT_SECRET = process.env.JWT_SECRET || "supersecretkeymacfiesta2026";

// Auth request type
export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

// Authentication Middleware
export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ success: false, message: "Access token missing" });
  }

  jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
    if (err) {
      return res.status(401).json({ success: false, message: "Invalid or expired token" });
    }
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role
    };
    next();
  });
};

// Admin authorization middleware
export const authorizeAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ success: false, message: "Forbidden: Admin access level required" });
  }
  next();
};

// Check if database is active
export const isDbConnected = () => mongoose.connection.readyState === 1;

// Global Socket.io instance reference & broadcaster
let ioInstance: any = null;
export const setSocketIO = (io: any) => {
  ioInstance = io;
};
export const getSocketIO = () => ioInstance;
export const broadcastEvent = (eventName: string, payload: any) => {
  if (ioInstance) {
    ioInstance.emit(eventName, payload);
  }
};

// --- Local In-Memory Fallback Database ---
export let localUsers: any[] = [
  {
    _id: "admin-id-default",
    name: "Admin User",
    email: "admin@macfast.org",
    password: bcrypt.hashSync("admin123", 10),
    phone: "+91 99999 99999",
    college: "MACFAST Tiruvalla",
    department: "Management",
    year: "Faculty",
    role: "admin",
    xpPoints: 1000,
    badges: [{ id: "god-mode", name: "Grand Organizer" }]
  },
  {
    _id: "student-id-default",
    name: "Joel Shaji",
    email: "student@macfast.org",
    password: bcrypt.hashSync("student123", 10),
    phone: "+91 94470 99999",
    college: "MACFAST Tiruvalla",
    department: "Computer Applications",
    year: "MCA 2nd Year",
    role: "student",
    xpPoints: 120,
    badges: [{ id: "newcomer", name: "Festival Pioneer" }]
  }
];

export let localEvents: any[] = [
  {
    _id: "event-gaming-id",
    title: "Urumi Gaming Arena",
    slug: "urumi-gaming",
    description: "Prepare your triggers and coordination as we host the ultimate esports arena showdown. Featuring competitive lobbies in Valorant, BGMI and FIFA formats.",
    rules: [
      "All squad members must belong to the same college/institution.",
      "Players must bring their own mobile devices, charging adapters, and headsets.",
      "Emulators are strictly prohibited for BGMI battles.",
      "Decisions of the gaming coordinators are final and binding."
    ],
    coverImage: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop",
    date: "24 Sep 2026",
    time: "Day 1, 11:00 AM onwards",
    venue: "MACFAST Esports Lounge",
    category: "gaming",
    type: "squad",
    prizePool: 30000,
    maxSeats: 8,
    registeredCount: 0,
    isLive: true,
    coordinator: {
      name: "Abhijith R.",
      phone: "+91 94470 12345",
      email: "abhijith@macfast.org"
    }
  },
  {
    _id: "event-cultural-id",
    title: "Dusk 'N Dawn Concert",
    slug: "dusk-n-dawn",
    description: "MacFiesta's signature ending performance featuring national music tracks, DJ battles, and EDM showcase from guest artists.",
    rules: [
      "Gates open at 05:30 PM. Unified entry pass / QR badge is mandatory.",
      "Alcohol, smoking, and narcotic substances are strictly prohibited inside the grounds.",
      "Outside food or metal items are not allowed.",
      "Re-entry is allowed only under coordinator authorization."
    ],
    coverImage: "https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=800&auto=format&fit=crop",
    date: "25 Sep 2026",
    time: "Day 2, 06:00 PM - 10:00 PM",
    venue: "Main Campus Athletic Grounds",
    category: "cultural",
    type: "group",
    prizePool: 50000,
    maxSeats: 120,
    registeredCount: 0,
    isLive: false,
    coordinator: {
      name: "Suresh Pillai",
      phone: "+91 94470 54321",
      email: "suresh@macfast.org"
    }
  },
  {
    _id: "event-technical-id",
    title: "Byte & Code Hackathon",
    slug: "byte-and-code",
    description: "24-hour design and code sprint where developers form teams to construct digital solutions addressing real-world problem statements.",
    rules: [
      "Work must be started from scratch. Pre-built templates are disqualified.",
      "All code must be committed to a public GitHub repository.",
      "Teams must present their live demonstration before the panel.",
      "Use of open source libraries is encouraged with attribution."
    ],
    coverImage: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=800&auto=format&fit=crop",
    date: "24 Sep 2026",
    time: "Day 1, 10:00 AM onwards",
    venue: "MACFAST Computer Labs",
    category: "technical",
    type: "duo",
    prizePool: 25000,
    maxSeats: 12,
    registeredCount: 0,
    isLive: true,
    coordinator: {
      name: "Anjali Mathew",
      phone: "+91 94470 98765",
      email: "anjali@macfast.org"
    }
  }
];

export let localRegistrations: any[] = [];

export let localScores: any[] = [
  {
    _id: "score-gaming-id",
    eventId: "event-gaming-id",
    teams: [
      { rank: 1, name: "Apex Overlords", college: "CET Trivandrum", score: 95 },
      { rank: 2, name: "Silent Killers", college: "MACFAST Tiruvalla", score: 80 },
      { rank: 3, name: "Hyper Void", college: "TKM Kollam", score: 78 },
      { rank: 4, name: "Nexus Knights", college: "SJCET Pala", score: 60 }
    ],
    isLive: true
  },
  {
    _id: "score-technical-id",
    eventId: "event-technical-id",
    teams: [
      { rank: 1, name: "Byte Busters", college: "MACFAST Tiruvalla", score: 400 },
      { rank: 2, name: "Syntax Sorcerers", college: "AJCE Kanjirappally", score: 380 },
      { rank: 3, name: "Null Pointers", college: "MITS Kochi", score: 320 },
      { rank: 4, name: "Stack Overflowers", college: "CET Trivandrum", score: 250 }
    ],
    isLive: true
  }
];

export let localARLocations: any[] = [
  { _id: "ar-1", building: "Main Block", floor: "Ground Floor", room: "Seminar Hall", type: "POI", status: "active" },
  { _id: "ar-2", building: "MCA Block", floor: "1st Floor", room: "Lab 3", type: "Anchor", status: "active" },
  { _id: "ar-3", building: "MBA Block", floor: "2nd Floor", room: "Conference Room", type: "POI", status: "active" }
];

export let localVolunteers: any[] = [
  { _id: "vol-1", name: "Rohan Das", email: "rohan@student.org", duty: "Gaming Coordinator Assistant", shift: "Day 1, Morning", status: "assigned" },
  { _id: "vol-2", name: "Sneha Kurian", email: "sneha@student.org", duty: "Help Desk Support", shift: "Day 1, Afternoon", status: "present" },
  { _id: "vol-3", name: "Adarsh Nair", email: "adarsh@student.org", duty: "Stage Sound Coordinator", shift: "Day 2, Full Day", status: "assigned" }
];

export let localPayments: any[] = [
  { _id: "pay-1", email: "student@macfast.org", amount: 150, gateway: "Razorpay", txId: "TXN_78945612", status: "completed", date: new Date().toISOString() },
  { _id: "pay-2", email: "sneha@student.org", amount: 200, gateway: "UPI", txId: "TXN_12457896", status: "completed", date: new Date().toISOString() },
  { _id: "pay-3", email: "rohan@student.org", amount: 150, gateway: "Card", txId: "TXN_98765412", status: "refunded", date: new Date().toISOString() }
];

export let localAnnouncements: any[] = [
  { _id: "ann-1", title: "Inauguration Ceremony Delayed", message: "The inauguration ceremony will start at 10:30 AM instead of 10:00 AM.", type: "urgent", date: new Date().toISOString() },
  { _id: "ann-2", title: "Gaming Registrations Closing Soon", message: "Spot registrations for Urumi Gaming Arena will close in 30 minutes.", type: "general", date: new Date().toISOString() }
];

export let localAuditLogs: any[] = [
  { _id: "log-1", admin: "admin@macfast.org", action: "Seeded Default Database", timestamp: new Date().toISOString() },
  { _id: "log-2", admin: "admin@macfast.org", action: "Modified Scoreboard Standings", timestamp: new Date().toISOString() }
];

export let localFestivalSettings: any = {
  name: "MacFiesta",
  edition: "2K26",
  tagline: "Every Hero Has A Mission",
  subtitle: "Marvelverse Avengers Command Center",
  motto: "United to Excel",
  logoUrl: "/logo.png",
  faviconUrl: "/favicon.ico",
  homepageBanner: "/MARVEL/3025924746959430.jpg",
  aboutText: "MACFIESTA 2K26 is the ultimate inter-collegiate Marvelverse festival at MACFAST Tiruvalla.",
  contactEmail: "macfiesta@macfast.org",
  contactPhone: "+91 94470 12345",
  venueAddress: "MACFAST Campus, Tiruvalla, Kerala - 689101",
  registrationOpen: true,
  maintenanceMode: false,
  countdownEnabled: true,
  socialInstagram: "https://www.instagram.com/macfiestaofficial",
  socialYoutube: "https://youtube.com/@macfiesta",
  socialLinkedin: "https://linkedin.com/company/macfast",
  heroTitle: "MACFIESTA 2K26",
  heroName: "MARVELVERSE",
  heroSubtitle: "EVERY HERO HAS A MISSION",
  heroDesc: "The premier national inter-collegiate Marvel Cinematic Universe cultural and technical festival.",
  bgType: "video",
  videoBgUrl: "/MARVEL/Video Project 4.mp4",
  wallpaperUrl: "/MARVEL/3025924746959430.jpg",
  themeToggle: "marvel",
  ctaPrimaryText: "Enter The Arena",
  ctaPrimaryUrl: "/events",
  ctaSecondaryText: "Live Scoreboard",
  ctaSecondaryUrl: "/scoreboard",
  floatingIronManEnabled: true,
  heroOverlayOpacity: 70,
};

export let localTimelineSettings: any = {
  festStartDate: "2026-09-24T09:00:00+05:30",
  festEndDate: "2026-09-25T22:00:00+05:30",
  regOpenDate: "2026-08-01T00:00:00+05:30",
  regCloseDate: "2026-09-23T23:59:59+05:30",
  spotRegDate: "2026-09-24T08:00:00+05:30",
  resultPubDate: "2026-09-25T20:00:00+05:30",
  certificateDate: "2026-09-26T10:00:00+05:30",
  autoCloseRegistration: false,
  autoPublishResults: true,
  countdownStyle: "marvel",
};

export let localThemeSettings: any = {
  primaryColor: "#ED1D24",
  secondaryColor: "#00D4FF",
  backgroundColor: "#05050A",
  fontFamily: "Space Grotesk",
  borderRadius: "16px",
  shadowIntensity: "heavy",
  animationSpeed: "normal",
  presetTheme: "marvel",
  glassmorphismBlur: 20,
  neonGlowIntensity: 85,
};

