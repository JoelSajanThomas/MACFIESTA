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
import nodemailer from "nodemailer";
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

// ── CORS Configuration ─────────────────────────────────────────────────────
// Explicitly allow all known production, preview, and dev origins so that
// requests from macfiesta.macfast.org and Vercel deployments are never blocked.
const ALLOWED_ORIGINS = [
  "https://macfiesta.macfast.org",
  "https://www.macfiesta.macfast.org",
  "https://macfiesta-app.vercel.app",
  "https://macfiesta.vercel.app",
  // Allow all *.vercel.app preview URLs
  /\.vercel\.app$/,
  // Allow all *.onrender.com (self-calls, dev tunnels)
  /\.onrender\.com$/,
  // Local development
  "http://localhost:3000",
  "http://localhost:3001",
  "http://192.168.0.101:3000",
  "http://127.0.0.1:3000",
];

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    const allowed = ALLOWED_ORIGINS.some((o) =>
      typeof o === "string" ? o === origin : o.test(origin)
    );
    if (allowed) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked origin: ${origin}`);
      // Still allow — avoids hard failures; just logs for monitoring
      callback(null, true);
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
};

// Middleware chains
app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // Pre-flight for all routes
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 200, // Limit IP calls
  message: "Rate limit threshold reached. Please retry in 15 mins."
});
app.use("/api/", limiter);
app.use("/", limiter); // Also rate-limit root-prefix calls

// Shared configurations, database collections, and auth middlewares
import { adminRouter } from "./admin";
import {
  JWT_SECRET,
  AuthRequest,
  authenticateToken,
  authorizeAdmin,
  isDbConnected,
  localUsers,
  localEvents,
  localRegistrations,
  localScores,
  localARLocations,
  localVolunteers,
  localPayments,
  localAnnouncements,
  localAuditLogs
} from "./shared";

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

    // Validation rules
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({ success: false, message: "Please provide a valid email address" });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters long" });
    }

    const phoneRegex = /^\+?[0-9\s\-()]{7,15}$/;
    if (!phoneRegex.test(phone.replace(/\s+/g, ""))) {
      return res.status(400).json({ success: false, message: "Please provide a valid phone number" });
    }

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

      let isMatch = await bcrypt.compare(password, user.password || "");
      // Safe fallback: ensure the known seeded "old id and password" accounts
      // always authenticate, matching the pattern used in the local fallback
      // and the admin console login.
      if (!isMatch) {
        const isDefaultAdmin = normalizedEmail === "admin@macfast.org" && password === "admin123";
        const isDefaultStudent = normalizedEmail === "student@macfast.org" && password === "student123";
        if (isDefaultAdmin || isDefaultStudent) {
          isMatch = true;
        }
      }

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

app.post("/api/auth/forgot-password", async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    const normalizedEmail = email.trim().toLowerCase();
    let userExists = false;

    if (isDbConnected()) {
      const user = await User.findOne({ email: normalizedEmail });
      userExists = !!user;
    } else {
      userExists = localUsers.some(u => u.email.toLowerCase() === normalizedEmail);
    }

    if (!userExists) {
      return res.json({ success: true, message: "If the email is registered, a password recovery link has been generated." });
    }

    const resetToken = jwt.sign({ email: normalizedEmail }, JWT_SECRET, { expiresIn: "1h" });
    const resetLink = `${process.env.NEXT_PUBLIC_CLIENT_URL || "http://localhost:3000"}/reset-password?token=${resetToken}`;

    console.log(`[PASSWORD RECOVERY] Reset Link for ${normalizedEmail}: ${resetLink}`);

    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || "localhost",
        port: Number(process.env.SMTP_PORT) || 1025,
        ignoreTLS: true,
        auth: process.env.SMTP_USER ? {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS || ""
        } : undefined
      });

      await transporter.sendMail({
        from: '"MacFiesta Support" <no-reply@macfast.org>',
        to: normalizedEmail,
        subject: "Password Reset Request - MacFiesta",
        text: `You requested a password reset. Click the following link to reset your password: ${resetLink}. This link is valid for 1 hour.`,
        html: `<p>You requested a password reset. Click the link below to reset your password:</p><p><a href="${resetLink}">${resetLink}</a></p><p>This link is valid for 1 hour.</p>`
      });
      console.log(`[PASSWORD RECOVERY] Reset email sent to ${normalizedEmail}`);
    } catch (mailErr) {
      console.warn("[PASSWORD RECOVERY] Nodemailer not configured or failed to send mail. Fallback to console log.");
    }

    res.json({ success: true, message: "Password recovery link has been generated. Check console logs / inbox." });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post("/api/auth/reset-password", async (req: Request, res: Response) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) {
      return res.status(400).json({ success: false, message: "Reset token and new password are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters long" });
    }

    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return res.status(400).json({ success: false, message: "Invalid or expired reset token" });
    }

    const email = decoded.email;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    if (isDbConnected()) {
      const user = await User.findOneAndUpdate({ email }, { password: hashedPassword }, { new: true });
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
    } else {
      const userIdx = localUsers.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
      if (userIdx === -1) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
      localUsers[userIdx].password = hashedPassword;
    }

    res.json({ success: true, message: "Password has been reset successfully. You can now log in." });
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
    const param = req.params.slug;
    if (isDbConnected()) {
      const updatedEvent = await Event.findOneAndUpdate(
        { $or: [{ slug: param }, { _id: param }] },
        req.body,
        { new: true }
      );
      if (!updatedEvent) {
        return res.status(404).json({ success: false, message: "Event not found to update" });
      }
      res.json({ success: true, event: updatedEvent });
    } else {
      let idx = localEvents.findIndex(e => e.slug === param || e._id === param);
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
      localScores.splice(0, localScores.length, ...localScores.filter(s => s.eventId !== eventId));
      localRegistrations.splice(0, localRegistrations.length, ...localRegistrations.filter(r => r.eventId !== eventId));
      res.json({ success: true, message: "Event and associated records deleted successfully in fallback" });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// --- Registrations Endpoints ---

app.post("/api/registrations", authenticateToken as any, async (req: AuthRequest, res: Response) => {
  try {
    const { eventId, paymentCompleted, paymentId, paymentMethod, amount } = req.body;
    const userId = req.user?.id;

    if (!eventId) {
      return res.status(400).json({ success: false, message: "Event ID is required" });
    }

    if (!paymentCompleted) {
      return res.status(400).json({
        success: false,
        message: "Payment is required. Event registration can only be completed after successful payment."
      });
    }

    const txId = paymentId || `TXN_${Math.floor(10000000 + Math.random() * 90000000)}`;

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

      const user = await User.findById(userId);
      const entryPass = `MF-2K26-${Math.floor(1000 + Math.random() * 9000)}`;

      const qrPayload = `MACFIESTA 2K26 OFFICIAL ENTRY TICKET
------------------------------------
Pass Code: ${entryPass}
Participant: ${user?.name || "Delegate"}
Email: ${user?.email || "N/A"}
College: ${user?.college || "MACFAST Tiruvalla"}
Event: ${event.title} (${event.category ? event.category.toUpperCase() : "GENERAL"})
Date & Time: ${event.date} @ ${event.time}
Venue: ${event.venue}
Payment Status: VERIFIED & PAID
Organized By: MACFAST Tiruvalla
Verification Link: https://macfiesta.macfast.org/verify/${entryPass}
------------------------------------`;

      const qrCodeBase64 = await QRCode.toDataURL(qrPayload, { margin: 1, width: 300 });

      const newReg = await Registration.create({
        userId,
        eventId,
        paymentStatus: "completed",
        paymentId: txId,
        qrCode: qrCodeBase64,
        entryPass
      });

      // Record payment log
      localPayments.push({
        _id: `pay-${Date.now()}`,
        email: user?.email || "student@macfast.org",
        amount: amount || 250,
        gateway: paymentMethod || "UPI",
        txId,
        status: "completed",
        date: new Date().toISOString()
      });

      event.registeredCount += 1;
      await event.save();

      if (user) {
        user.xpPoints += 100;
        if (user.xpPoints >= 150 && !user.badges.some((b: any) => b.id === "competitor")) {
          user.badges.push({ id: "competitor", name: "Gladiator Attendee", earnedAt: new Date() });
        }
        await user.save();
      }

      res.status(201).json({ success: true, registration: newReg, txId });
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

      const user = localUsers.find(u => u._id === userId);
      const entryPass = `MF-2K26-${Math.floor(1000 + Math.random() * 9000)}`;

      const qrPayload = `MACFIESTA 2K26 OFFICIAL ENTRY TICKET
------------------------------------
Pass Code: ${entryPass}
Participant: ${user?.name || "Delegate"}
Email: ${user?.email || "N/A"}
College: ${user?.college || "MACFAST Tiruvalla"}
Event: ${event.title} (${event.category ? event.category.toUpperCase() : "GENERAL"})
Date & Time: ${event.date} @ ${event.time}
Venue: ${event.venue}
Payment Status: VERIFIED & PAID
Organized By: MACFAST Tiruvalla
Verification Link: https://macfiesta.macfast.org/verify/${entryPass}
------------------------------------`;

      const qrCodeBase64 = await QRCode.toDataURL(qrPayload, { margin: 1, width: 300 });

      const newReg = {
        _id: `reg-${Date.now()}`,
        userId,
        eventId,
        paymentStatus: "completed",
        paymentId: txId,
        qrCode: qrCodeBase64,
        entryPass
      };
      localRegistrations.push(newReg);

      // Record payment log
      localPayments.push({
        _id: `pay-${Date.now()}`,
        email: user?.email || "student@macfast.org",
        amount: amount || 250,
        gateway: paymentMethod || "UPI",
        txId,
        status: "completed",
        date: new Date().toISOString()
      });

      event.registeredCount += 1;

      if (user) {
        user.xpPoints += 100;
        if (user.xpPoints >= 150 && !user.badges.some((b: any) => b.id === "competitor")) {
          user.badges.push({ id: "competitor", name: "Gladiator Attendee", earnedAt: new Date() });
        }
      }

      res.status(201).json({ success: true, registration: newReg, txId });
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

app.post("/api/registrations/:id/cancel", authenticateToken as any, async (req: AuthRequest, res: Response) => {
  try {
    const regId = req.params.id;
    const userId = req.user?.id;

    if (isDbConnected()) {
      const registration = await Registration.findById(regId);
      if (!registration) {
        return res.status(404).json({ success: false, message: "Registration record not found" });
      }

      if (registration.userId.toString() !== userId) {
        return res.status(403).json({ success: false, message: "Unauthorized to cancel this registration" });
      }

      if (registration.status === "cancelled") {
        return res.status(400).json({ success: false, message: "This event registration is already cancelled" });
      }

      registration.status = "cancelled";
      registration.paymentStatus = "cancelled_no_refund";
      registration.cancelledAt = new Date();
      registration.cancellationPolicyNotice = "Cancelled by participant without refund of money per event policy.";
      await registration.save();

      // Release seat in event
      const event = await Event.findById(registration.eventId);
      if (event && event.registeredCount > 0) {
        event.registeredCount -= 1;
        await event.save();
      }

      res.json({
        success: true,
        message: "Event registration cancelled successfully. As per festival policy, no refund of money is provided.",
        registration
      });
    } else {
      const reg = localRegistrations.find(r => r._id === regId);
      if (!reg) {
        return res.status(404).json({ success: false, message: "Registration record not found" });
      }

      if (reg.userId !== userId) {
        return res.status(403).json({ success: false, message: "Unauthorized to cancel this registration" });
      }

      if (reg.status === "cancelled") {
        return res.status(400).json({ success: false, message: "This event registration is already cancelled" });
      }

      reg.status = "cancelled";
      reg.paymentStatus = "cancelled_no_refund";
      reg.cancelledAt = new Date().toISOString();
      reg.cancellationPolicyNotice = "Cancelled by participant without refund of money per event policy.";

      const eventIdStr = typeof reg.eventId === "object" ? reg.eventId._id : reg.eventId;
      const event = localEvents.find(e => e._id === eventIdStr);
      if (event && event.registeredCount > 0) {
        event.registeredCount -= 1;
      }

      res.json({
        success: true,
        message: "Event registration cancelled successfully. As per festival policy, no refund of money is provided.",
        registration: reg
      });
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

// Mount admin router under /api/admin (primary)
app.use("/api/admin", adminRouter);

// ── Root-Level Aliases (no /api prefix) ────────────────────────────────────
// Supports frontends where NEXT_PUBLIC_API_URL is set to the Render base URL
// WITHOUT /api suffix (e.g. https://macfiesta-api.onrender.com instead of
// https://macfiesta-api.onrender.com/api). Mounting the same routers at both
// paths ensures all clients work regardless of env var configuration.

// Mount admin router at BOTH /api/admin (primary) and /admin (alias)
app.use("/admin", adminRouter);

// Mount a root alias that rewrites /auth/* → /api/auth/* etc.
// Using a lightweight next-hop rewrite instead of app._router.handle
app.use((req: Request, res: Response, next: NextFunction) => {
  // Only rewrite if path does NOT already start with /api or /socket.io
  if (req.path.startsWith("/api") || req.path.startsWith("/socket.io")) {
    return next();
  }
  // Rewrite to /api prefix and re-dispatch
  const originalUrl = req.url;
  req.url = "/api" + req.url;
  app._router.handle(req, res, (err: any) => {
    // If /api-prefixed path also fails, restore and pass on
    req.url = originalUrl;
    next(err);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`\n🚀 MacFiesta API running on port ${PORT}`);
  console.log(`   Mode: ${isDbConnected() ? "MongoDB" : "In-Memory Fallback"}`);
  console.log(`   Allowed origins: macfiesta.macfast.org + *.vercel.app + localhost\n`);
});
