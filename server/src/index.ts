import express, { Request, Response, NextFunction } from "express";
import http from "http";
import { Server, Socket } from "socket.io";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import QRCode from "qrcode";
import mongoose from "mongoose";
import { connectDB } from "./db";
import { User } from "./models/User";
import { Event } from "./models/Event";
import { Registration } from "./models/Registration";
import { Score } from "./models/Score";

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middleware chains
app.use(cors());
app.use(helmet());
app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 200, // Limit IP calls
  message: "Rate limit threshold reached. Please retry in 15 mins."
});
app.use("/api/", limiter);

// Helper constants
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkeymacfiesta2026";

// Authentication Middleware
interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ success: false, message: "Access token missing" });
  }

  jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
    if (err) {
      return res.status(403).json({ success: false, message: "Invalid or expired token" });
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
const authorizeAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ success: false, message: "Forbidden: Admin access level required" });
  }
  next();
};

// Check if database is active
const isDbConnected = () => mongoose.connection.readyState === 1;

// --- Local In-Memory Fallback Database ---
let localUsers: any[] = [
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

let localEvents: any[] = [
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
    date: "13 Nov 2026",
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
    date: "14 Nov 2026",
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
    date: "13 Nov 2026",
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

let localRegistrations: any[] = [];

let localScores: any[] = [
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

// Health check
app.get("/api/health", (req: Request, res: Response) => {
  res.json({ status: "online", time: new Date(), mode: isDbConnected() ? "db" : "fallback" });
});

// --- Auth Endpoints ---

app.post("/api/auth/register", async (req: Request, res: Response) => {
  try {
    const { name, email, password, phone, college, department, year } = req.body;

    if (!name || !email || !password || !phone || !college || !department || !year) {
      return res.status(400).json({ success: false, message: "All registration fields are required" });
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (isDbConnected()) {
      const existingUser = await User.findOne({ email: normalizedEmail });
      if (existingUser) {
        return res.status(400).json({ success: false, message: "User with this email already exists" });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = await User.create({
        name,
        email: normalizedEmail,
        password: hashedPassword,
        phone,
        college,
        department,
        year,
        role: "student",
        xpPoints: 50,
        badges: [{ id: "newcomer", name: "Festival Pioneer" }]
      });

      const token = jwt.sign({ id: newUser._id, email: newUser.email, role: newUser.role }, JWT_SECRET, {
        expiresIn: "7d"
      });

      res.status(201).json({
        success: true,
        token,
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          phone: newUser.phone,
          college: newUser.college,
          department: newUser.department,
          year: newUser.year,
          role: newUser.role,
          xpPoints: newUser.xpPoints,
          badges: newUser.badges
        }
      });
    } else {
      const existingUser = localUsers.find(u => u.email.toLowerCase() === normalizedEmail);
      if (existingUser) {
        return res.status(400).json({ success: false, message: "User with this email already exists" });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = {
        _id: `user-${Date.now()}`,
        name,
        email: normalizedEmail,
        password: hashedPassword,
        phone,
        college,
        department,
        year,
        role: "student",
        xpPoints: 50,
        badges: [{ id: "newcomer", name: "Festival Pioneer" }]
      };
      localUsers.push(newUser);

      const token = jwt.sign({ id: newUser._id, email: newUser.email, role: newUser.role }, JWT_SECRET, {
        expiresIn: "7d"
      });

      res.status(201).json({
        success: true,
        token,
        user: newUser
      });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post("/api/auth/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (isDbConnected()) {
      const user = await User.findOne({ email: normalizedEmail }).select("+password");
      if (!user) {
        return res.status(401).json({ success: false, message: "Invalid email or password credentials" });
      }

      const isMatch = await bcrypt.compare(password, user.password || "");
      if (!isMatch) {
        return res.status(401).json({ success: false, message: "Invalid email or password credentials" });
      }

      const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, JWT_SECRET, {
        expiresIn: "7d"
      });

      res.status(200).json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          college: user.college,
          department: user.department,
          year: user.year,
          role: user.role,
          xpPoints: user.xpPoints,
          badges: user.badges
        }
      });
    } else {
      const user = localUsers.find(u => u.email.toLowerCase() === normalizedEmail);
      if (!user) {
        return res.status(401).json({ success: false, message: "Invalid email or password credentials" });
      }

      // Hardcode plain check bypass for seeded admin user testing
      const isMatch = (password === "admin123" && normalizedEmail === "admin@macfast.org") || await bcrypt.compare(password, user.password || "");
      if (!isMatch) {
        return res.status(401).json({ success: false, message: "Invalid email or password credentials" });
      }

      const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, JWT_SECRET, {
        expiresIn: "7d"
      });

      res.status(200).json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          college: user.college,
          department: user.department,
          year: user.year,
          role: user.role,
          xpPoints: user.xpPoints,
          badges: user.badges
        }
      });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get("/api/auth/me", authenticateToken as any, async (req: AuthRequest, res: Response) => {
  try {
    if (isDbConnected()) {
      const user = await User.findById(req.user?.id);
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
      res.json({ success: true, user });
    } else {
      const user = localUsers.find(u => u._id === req.user?.id);
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
      res.json({ success: true, user });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// --- Events Endpoints ---

app.get("/api/events", async (req: Request, res: Response) => {
  try {
    if (isDbConnected()) {
      const events = await Event.find();
      res.json({ success: true, events });
    } else {
      res.json({ success: true, events: localEvents });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get("/api/events/:slug", async (req: Request, res: Response) => {
  try {
    if (isDbConnected()) {
      const event = await Event.findOne({ slug: req.params.slug });
      if (!event) {
        return res.status(404).json({ success: false, message: "Event not found" });
      }
      res.json({ success: true, event });
    } else {
      const event = localEvents.find(e => e.slug === req.params.slug);
      if (!event) {
        return res.status(404).json({ success: false, message: "Event not found" });
      }
      res.json({ success: true, event });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post("/api/events", [authenticateToken, authorizeAdmin] as any, async (req: AuthRequest, res: Response) => {
  try {
    const { title, slug, description, rules, coverImage, date, time, venue, category, type, prizePool, maxSeats, coordinator } = req.body;

    if (isDbConnected()) {
      const existingEvent = await Event.findOne({ slug });
      if (existingEvent) {
        return res.status(400).json({ success: false, message: "Event with this slug already exists" });
      }

      const newEvent = await Event.create({
        title,
        slug,
        description,
        rules,
        coverImage,
        date,
        time,
        venue,
        category,
        type,
        prizePool,
        maxSeats,
        coordinator,
        registeredCount: 0,
        isLive: false
      });

      await Score.create({
        eventId: newEvent._id,
        teams: [],
        isLive: false
      });

      res.status(201).json({ success: true, event: newEvent });
    } else {
      const existingEvent = localEvents.find(e => e.slug === slug);
      if (existingEvent) {
        return res.status(400).json({ success: false, message: "Event with this slug already exists" });
      }

      const newEvent = {
        _id: `event-${Date.now()}`,
        title,
        slug,
        description,
        rules,
        coverImage,
        date,
        time,
        venue,
        category,
        type,
        prizePool,
        maxSeats,
        coordinator,
        registeredCount: 0,
        isLive: false
      };
      localEvents.push(newEvent);

      localScores.push({
        _id: `score-${Date.now()}`,
        eventId: newEvent._id,
        teams: [],
        isLive: false
      });

      res.status(201).json({ success: true, event: newEvent });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.put("/api/events/:slug", [authenticateToken, authorizeAdmin] as any, async (req: AuthRequest, res: Response) => {
  try {
    if (isDbConnected()) {
      const updatedEvent = await Event.findOneAndUpdate({ slug: req.params.slug }, req.body, { new: true });
      if (!updatedEvent) {
        return res.status(404).json({ success: false, message: "Event not found to update" });
      }
      res.json({ success: true, event: updatedEvent });
    } else {
      const idx = localEvents.findIndex(e => e.slug === req.params.slug);
      if (idx === -1) {
        return res.status(404).json({ success: false, message: "Event not found to update" });
      }
      localEvents[idx] = { ...localEvents[idx], ...req.body };
      res.json({ success: true, event: localEvents[idx] });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.delete("/api/events/:slug", [authenticateToken, authorizeAdmin] as any, async (req: AuthRequest, res: Response) => {
  try {
    if (isDbConnected()) {
      const deletedEvent = await Event.findOneAndDelete({ slug: req.params.slug });
      if (!deletedEvent) {
        return res.status(404).json({ success: false, message: "Event not found to delete" });
      }
      await Score.deleteOne({ eventId: deletedEvent._id });
      await Registration.deleteMany({ eventId: deletedEvent._id });
      res.json({ success: true, message: "Event and associated records deleted successfully" });
    } else {
      const idx = localEvents.findIndex(e => e.slug === req.params.slug);
      if (idx === -1) {
        return res.status(404).json({ success: false, message: "Event not found to delete" });
      }
      const eventId = localEvents[idx]._id;
      localEvents.splice(idx, 1);
      localScores = localScores.filter(s => s.eventId !== eventId);
      localRegistrations = localRegistrations.filter(r => r.eventId !== eventId);
      res.json({ success: true, message: "Event and associated records deleted successfully in fallback" });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// --- Registrations Endpoints ---

app.post("/api/registrations", authenticateToken as any, async (req: AuthRequest, res: Response) => {
  try {
    const { eventId } = req.body;
    const userId = req.user?.id;

    if (!eventId) {
      return res.status(400).json({ success: false, message: "Event ID is required" });
    }

    if (isDbConnected()) {
      const event = await Event.findById(eventId);
      if (!event) {
        return res.status(404).json({ success: false, message: "Event not found" });
      }

      const existingReg = await Registration.findOne({ userId, eventId });
      if (existingReg) {
        return res.status(400).json({ success: false, message: "You are already registered for this event" });
      }

      if (event.registeredCount >= event.maxSeats) {
        return res.status(400).json({ success: false, message: "No seats left in this event" });
      }

      const entryPass = `MF-2K26-${Math.floor(1000 + Math.random() * 9000)}`;

      const qrPayload = JSON.stringify({
        userId,
        eventId,
        pass: entryPass,
        date: new Date()
      });

      const qrCodeBase64 = await QRCode.toDataURL(qrPayload);

      const newReg = await Registration.create({
        userId,
        eventId,
        paymentStatus: "completed",
        qrCode: qrCodeBase64,
        entryPass
      });

      event.registeredCount += 1;
      await event.save();

      const user = await User.findById(userId);
      if (user) {
        user.xpPoints += 100;
        if (user.xpPoints >= 150 && !user.badges.some((b: any) => b.id === "competitor")) {
          user.badges.push({ id: "competitor", name: "Gladiator Attendee", earnedAt: new Date() });
        }
        await user.save();
      }

      res.status(201).json({ success: true, registration: newReg });
    } else {
      const event = localEvents.find(e => e._id === eventId);
      if (!event) {
        return res.status(404).json({ success: false, message: "Event not found" });
      }

      const existingReg = localRegistrations.find(r => r.userId === userId && r.eventId === eventId);
      if (existingReg) {
        return res.status(400).json({ success: false, message: "You are already registered for this event" });
      }

      if (event.registeredCount >= event.maxSeats) {
        return res.status(400).json({ success: false, message: "No seats left in this event" });
      }

      const entryPass = `MF-2K26-${Math.floor(1000 + Math.random() * 9000)}`;

      const qrPayload = JSON.stringify({
        userId,
        eventId,
        pass: entryPass,
        date: new Date()
      });

      const qrCodeBase64 = await QRCode.toDataURL(qrPayload);

      const newReg = {
        _id: `reg-${Date.now()}`,
        userId,
        eventId,
        paymentStatus: "completed",
        qrCode: qrCodeBase64,
        entryPass
      };
      localRegistrations.push(newReg);

      event.registeredCount += 1;

      const user = localUsers.find(u => u._id === userId);
      if (user) {
        user.xpPoints += 100;
        if (user.xpPoints >= 150 && !user.badges.some((b: any) => b.id === "competitor")) {
          user.badges.push({ id: "competitor", name: "Gladiator Attendee", earnedAt: new Date() });
        }
      }

      res.status(201).json({ success: true, registration: newReg });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get("/api/registrations/my", authenticateToken as any, async (req: AuthRequest, res: Response) => {
  try {
    if (isDbConnected()) {
      const registrations = await Registration.find({ userId: req.user?.id }).populate("eventId");
      res.json({ success: true, registrations });
    } else {
      const myRegs = localRegistrations
        .filter(r => r.userId === req.user?.id)
        .map(r => {
          const event = localEvents.find(e => e._id === r.eventId);
          return { ...r, eventId: event };
        });
      res.json({ success: true, registrations: myRegs });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// --- Scoreboard Endpoints ---

app.get("/api/scoreboard", async (req: Request, res: Response) => {
  try {
    if (isDbConnected()) {
      const scores = await Score.find().populate("eventId");
      res.json({ success: true, scores });
    } else {
      const populatedScores = localScores.map(s => {
        const event = localEvents.find(e => e._id === s.eventId);
        return { ...s, eventId: event };
      });
      res.json({ success: true, scores: populatedScores });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get("/api/scoreboard/:eventId", async (req: Request, res: Response) => {
  try {
    if (isDbConnected()) {
      const score = await Score.findOne({ eventId: req.params.eventId }).populate("eventId");
      if (!score) {
        return res.status(404).json({ success: false, message: "Score record not found" });
      }
      res.json({ success: true, score });
    } else {
      const score = localScores.find(s => s.eventId === req.params.eventId);
      if (!score) {
        return res.status(404).json({ success: false, message: "Score record not found" });
      }
      const event = localEvents.find(e => e._id === score.eventId);
      res.json({ success: true, score: { ...score, eventId: event } });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.put("/api/scoreboard/:eventId", [authenticateToken, authorizeAdmin] as any, async (req: AuthRequest, res: Response) => {
  try {
    const { teams, isLive } = req.body;
    const { eventId } = req.params;

    if (isDbConnected()) {
      let score = await Score.findOne({ eventId });
      if (!score) {
        score = new Score({ eventId, teams, isLive });
      } else {
        if (teams) score.teams = teams;
        if (isLive !== undefined) score.isLive = isLive;
      }

      await score.save();
      const populatedScore = await score.populate("eventId");

      io.emit("score-live", populatedScore);
      res.json({ success: true, score: populatedScore });
    } else {
      let score = localScores.find(s => s.eventId === eventId);
      if (!score) {
        score = { _id: `score-${Date.now()}`, eventId, teams, isLive };
        localScores.push(score);
      } else {
        if (teams) score.teams = teams;
        if (isLive !== undefined) score.isLive = isLive;
      }

      const event = localEvents.find(e => e._id === score.eventId);
      const populated = { ...score, eventId: event };

      io.emit("score-live", populated);
      res.json({ success: true, score: populated });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Socket connection
io.on("connection", (socket: Socket) => {
  console.log("Client connecting socket:", socket.id);

  socket.on("update-score", async (data: any) => {
    try {
      const { eventId, teams, isLive } = data;
      let populated;
      
      if (isDbConnected()) {
        let score = await Score.findOne({ eventId });
        if (!score) {
          score = new Score({ eventId, teams, isLive });
        } else {
          if (teams) score.teams = teams;
          if (isLive !== undefined) score.isLive = isLive;
        }
        await score.save();
        populated = await score.populate("eventId");
      } else {
        let score = localScores.find(s => s.eventId === eventId);
        if (!score) {
          score = { _id: `score-${Date.now()}`, eventId, teams, isLive };
          localScores.push(score);
        } else {
          if (teams) score.teams = teams;
          if (isLive !== undefined) score.isLive = isLive;
        }
        const event = localEvents.find(e => e._id === score.eventId);
        populated = { ...score, eventId: event };
      }
      
      io.emit("score-live", populated);
    } catch (error) {
      console.error("Socket update-score failed:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server starting on port ${PORT}...`);
});
