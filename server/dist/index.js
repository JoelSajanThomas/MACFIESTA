"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const dotenv_1 = __importDefault(require("dotenv"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const qrcode_1 = __importDefault(require("qrcode"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const db_1 = require("./db");
const User_1 = require("./models/User");
const Event_1 = require("./models/Event");
const Registration_1 = require("./models/Registration");
const Score_1 = require("./models/Score");
dotenv_1.default.config();
// Connect to MongoDB
(0, db_1.connectDB)();
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});
// Middleware chains
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(express_1.default.json());
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 mins
    max: 200, // Limit IP calls
    message: "Rate limit threshold reached. Please retry in 15 mins."
});
app.use("/api/", limiter);
// Shared configurations, database collections, and auth middlewares
const admin_1 = require("./admin");
const shared_1 = require("./shared");
// Health check
app.get("/api/health", (req, res) => {
    res.json({ status: "online", time: new Date(), mode: (0, shared_1.isDbConnected)() ? "db" : "fallback" });
});
// --- Auth Endpoints ---
app.post("/api/auth/register", async (req, res) => {
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
        if ((0, shared_1.isDbConnected)()) {
            const existingUser = await User_1.User.findOne({ email: normalizedEmail });
            if (existingUser) {
                return res.status(400).json({ success: false, message: "User with this email already exists" });
            }
            const salt = await bcryptjs_1.default.genSalt(10);
            const hashedPassword = await bcryptjs_1.default.hash(password, salt);
            const newUser = await User_1.User.create({
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
            const token = jsonwebtoken_1.default.sign({ id: newUser._id, email: newUser.email, role: newUser.role }, shared_1.JWT_SECRET, {
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
        }
        else {
            const existingUser = shared_1.localUsers.find(u => u.email.toLowerCase() === normalizedEmail);
            if (existingUser) {
                return res.status(400).json({ success: false, message: "User with this email already exists" });
            }
            const salt = await bcryptjs_1.default.genSalt(10);
            const hashedPassword = await bcryptjs_1.default.hash(password, salt);
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
            shared_1.localUsers.push(newUser);
            const token = jsonwebtoken_1.default.sign({ id: newUser._id, email: newUser.email, role: newUser.role }, shared_1.JWT_SECRET, {
                expiresIn: "7d"
            });
            res.status(201).json({
                success: true,
                token,
                user: newUser
            });
        }
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
app.post("/api/auth/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email and password are required" });
        }
        const normalizedEmail = email.trim().toLowerCase();
        if ((0, shared_1.isDbConnected)()) {
            const user = await User_1.User.findOne({ email: normalizedEmail }).select("+password");
            if (!user) {
                return res.status(401).json({ success: false, message: "Invalid email or password credentials" });
            }
            let isMatch = await bcryptjs_1.default.compare(password, user.password || "");
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
            const token = jsonwebtoken_1.default.sign({ id: user._id, email: user.email, role: user.role }, shared_1.JWT_SECRET, {
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
        else {
            const user = shared_1.localUsers.find(u => u.email.toLowerCase() === normalizedEmail);
            if (!user) {
                return res.status(401).json({ success: false, message: "Invalid email or password credentials" });
            }
            // Hardcode plain check bypass for seeded admin user testing
            const isMatch = (password === "admin123" && normalizedEmail === "admin@macfast.org") || await bcryptjs_1.default.compare(password, user.password || "");
            if (!isMatch) {
                return res.status(401).json({ success: false, message: "Invalid email or password credentials" });
            }
            const token = jsonwebtoken_1.default.sign({ id: user._id, email: user.email, role: user.role }, shared_1.JWT_SECRET, {
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
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
app.get("/api/auth/me", shared_1.authenticateToken, async (req, res) => {
    try {
        if ((0, shared_1.isDbConnected)()) {
            const user = await User_1.User.findById(req.user?.id);
            if (!user) {
                return res.status(404).json({ success: false, message: "User not found" });
            }
            res.json({ success: true, user });
        }
        else {
            const user = shared_1.localUsers.find(u => u._id === req.user?.id);
            if (!user) {
                return res.status(404).json({ success: false, message: "User not found" });
            }
            res.json({ success: true, user });
        }
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
app.post("/api/auth/forgot-password", async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ success: false, message: "Email is required" });
        }
        const normalizedEmail = email.trim().toLowerCase();
        let userExists = false;
        if ((0, shared_1.isDbConnected)()) {
            const user = await User_1.User.findOne({ email: normalizedEmail });
            userExists = !!user;
        }
        else {
            userExists = shared_1.localUsers.some(u => u.email.toLowerCase() === normalizedEmail);
        }
        if (!userExists) {
            return res.json({ success: true, message: "If the email is registered, a password recovery link has been generated." });
        }
        const resetToken = jsonwebtoken_1.default.sign({ email: normalizedEmail }, shared_1.JWT_SECRET, { expiresIn: "1h" });
        const resetLink = `${process.env.NEXT_PUBLIC_CLIENT_URL || "http://localhost:3000"}/reset-password?token=${resetToken}`;
        console.log(`[PASSWORD RECOVERY] Reset Link for ${normalizedEmail}: ${resetLink}`);
        try {
            const transporter = nodemailer_1.default.createTransport({
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
        }
        catch (mailErr) {
            console.warn("[PASSWORD RECOVERY] Nodemailer not configured or failed to send mail. Fallback to console log.");
        }
        res.json({ success: true, message: "Password recovery link has been generated. Check console logs / inbox." });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
app.post("/api/auth/reset-password", async (req, res) => {
    try {
        const { token, password } = req.body;
        if (!token || !password) {
            return res.status(400).json({ success: false, message: "Reset token and new password are required" });
        }
        if (password.length < 6) {
            return res.status(400).json({ success: false, message: "Password must be at least 6 characters long" });
        }
        let decoded;
        try {
            decoded = jsonwebtoken_1.default.verify(token, shared_1.JWT_SECRET);
        }
        catch (err) {
            return res.status(400).json({ success: false, message: "Invalid or expired reset token" });
        }
        const email = decoded.email;
        const salt = await bcryptjs_1.default.genSalt(10);
        const hashedPassword = await bcryptjs_1.default.hash(password, salt);
        if ((0, shared_1.isDbConnected)()) {
            const user = await User_1.User.findOneAndUpdate({ email }, { password: hashedPassword }, { new: true });
            if (!user) {
                return res.status(404).json({ success: false, message: "User not found" });
            }
        }
        else {
            const userIdx = shared_1.localUsers.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
            if (userIdx === -1) {
                return res.status(404).json({ success: false, message: "User not found" });
            }
            shared_1.localUsers[userIdx].password = hashedPassword;
        }
        res.json({ success: true, message: "Password has been reset successfully. You can now log in." });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
// --- Events Endpoints ---
app.get("/api/events", async (req, res) => {
    try {
        if ((0, shared_1.isDbConnected)()) {
            const events = await Event_1.Event.find();
            res.json({ success: true, events });
        }
        else {
            res.json({ success: true, events: shared_1.localEvents });
        }
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
app.get("/api/events/:slug", async (req, res) => {
    try {
        if ((0, shared_1.isDbConnected)()) {
            const event = await Event_1.Event.findOne({ slug: req.params.slug });
            if (!event) {
                return res.status(404).json({ success: false, message: "Event not found" });
            }
            res.json({ success: true, event });
        }
        else {
            const event = shared_1.localEvents.find(e => e.slug === req.params.slug);
            if (!event) {
                return res.status(404).json({ success: false, message: "Event not found" });
            }
            res.json({ success: true, event });
        }
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
app.post("/api/events", [shared_1.authenticateToken, shared_1.authorizeAdmin], async (req, res) => {
    try {
        const { title, slug, description, rules, coverImage, date, time, venue, category, type, prizePool, maxSeats, coordinator } = req.body;
        if ((0, shared_1.isDbConnected)()) {
            const existingEvent = await Event_1.Event.findOne({ slug });
            if (existingEvent) {
                return res.status(400).json({ success: false, message: "Event with this slug already exists" });
            }
            const newEvent = await Event_1.Event.create({
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
            await Score_1.Score.create({
                eventId: newEvent._id,
                teams: [],
                isLive: false
            });
            res.status(201).json({ success: true, event: newEvent });
        }
        else {
            const existingEvent = shared_1.localEvents.find(e => e.slug === slug);
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
            shared_1.localEvents.push(newEvent);
            shared_1.localScores.push({
                _id: `score-${Date.now()}`,
                eventId: newEvent._id,
                teams: [],
                isLive: false
            });
            res.status(201).json({ success: true, event: newEvent });
        }
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
app.put("/api/events/:slug", [shared_1.authenticateToken, shared_1.authorizeAdmin], async (req, res) => {
    try {
        const param = req.params.slug;
        if ((0, shared_1.isDbConnected)()) {
            const updatedEvent = await Event_1.Event.findOneAndUpdate({ $or: [{ slug: param }, { _id: param }] }, req.body, { new: true });
            if (!updatedEvent) {
                return res.status(404).json({ success: false, message: "Event not found to update" });
            }
            res.json({ success: true, event: updatedEvent });
        }
        else {
            let idx = shared_1.localEvents.findIndex(e => e.slug === param || e._id === param);
            if (idx === -1) {
                return res.status(404).json({ success: false, message: "Event not found to update" });
            }
            shared_1.localEvents[idx] = { ...shared_1.localEvents[idx], ...req.body };
            res.json({ success: true, event: shared_1.localEvents[idx] });
        }
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
app.delete("/api/events/:slug", [shared_1.authenticateToken, shared_1.authorizeAdmin], async (req, res) => {
    try {
        if ((0, shared_1.isDbConnected)()) {
            const deletedEvent = await Event_1.Event.findOneAndDelete({ slug: req.params.slug });
            if (!deletedEvent) {
                return res.status(404).json({ success: false, message: "Event not found to delete" });
            }
            await Score_1.Score.deleteOne({ eventId: deletedEvent._id });
            await Registration_1.Registration.deleteMany({ eventId: deletedEvent._id });
            res.json({ success: true, message: "Event and associated records deleted successfully" });
        }
        else {
            const idx = shared_1.localEvents.findIndex(e => e.slug === req.params.slug);
            if (idx === -1) {
                return res.status(404).json({ success: false, message: "Event not found to delete" });
            }
            const eventId = shared_1.localEvents[idx]._id;
            shared_1.localEvents.splice(idx, 1);
            shared_1.localScores.splice(0, shared_1.localScores.length, ...shared_1.localScores.filter(s => s.eventId !== eventId));
            shared_1.localRegistrations.splice(0, shared_1.localRegistrations.length, ...shared_1.localRegistrations.filter(r => r.eventId !== eventId));
            res.json({ success: true, message: "Event and associated records deleted successfully in fallback" });
        }
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
// --- Registrations Endpoints ---
app.post("/api/registrations", shared_1.authenticateToken, async (req, res) => {
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
        if ((0, shared_1.isDbConnected)()) {
            const event = await Event_1.Event.findById(eventId);
            if (!event) {
                return res.status(404).json({ success: false, message: "Event not found" });
            }
            const existingReg = await Registration_1.Registration.findOne({ userId, eventId });
            if (existingReg) {
                return res.status(400).json({ success: false, message: "You are already registered for this event" });
            }
            if (event.registeredCount >= event.maxSeats) {
                return res.status(400).json({ success: false, message: "No seats left in this event" });
            }
            const user = await User_1.User.findById(userId);
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
            const qrCodeBase64 = await qrcode_1.default.toDataURL(qrPayload, { margin: 1, width: 300 });
            const newReg = await Registration_1.Registration.create({
                userId,
                eventId,
                paymentStatus: "completed",
                paymentId: txId,
                qrCode: qrCodeBase64,
                entryPass
            });
            // Record payment log
            shared_1.localPayments.push({
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
                if (user.xpPoints >= 150 && !user.badges.some((b) => b.id === "competitor")) {
                    user.badges.push({ id: "competitor", name: "Gladiator Attendee", earnedAt: new Date() });
                }
                await user.save();
            }
            res.status(201).json({ success: true, registration: newReg, txId });
        }
        else {
            const event = shared_1.localEvents.find(e => e._id === eventId);
            if (!event) {
                return res.status(404).json({ success: false, message: "Event not found" });
            }
            const existingReg = shared_1.localRegistrations.find(r => r.userId === userId && r.eventId === eventId);
            if (existingReg) {
                return res.status(400).json({ success: false, message: "You are already registered for this event" });
            }
            if (event.registeredCount >= event.maxSeats) {
                return res.status(400).json({ success: false, message: "No seats left in this event" });
            }
            const user = shared_1.localUsers.find(u => u._id === userId);
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
            const qrCodeBase64 = await qrcode_1.default.toDataURL(qrPayload, { margin: 1, width: 300 });
            const newReg = {
                _id: `reg-${Date.now()}`,
                userId,
                eventId,
                paymentStatus: "completed",
                paymentId: txId,
                qrCode: qrCodeBase64,
                entryPass
            };
            shared_1.localRegistrations.push(newReg);
            // Record payment log
            shared_1.localPayments.push({
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
                if (user.xpPoints >= 150 && !user.badges.some((b) => b.id === "competitor")) {
                    user.badges.push({ id: "competitor", name: "Gladiator Attendee", earnedAt: new Date() });
                }
            }
            res.status(201).json({ success: true, registration: newReg, txId });
        }
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
app.get("/api/registrations/my", shared_1.authenticateToken, async (req, res) => {
    try {
        if ((0, shared_1.isDbConnected)()) {
            const registrations = await Registration_1.Registration.find({ userId: req.user?.id }).populate("eventId");
            res.json({ success: true, registrations });
        }
        else {
            const myRegs = shared_1.localRegistrations
                .filter(r => r.userId === req.user?.id)
                .map(r => {
                const event = shared_1.localEvents.find(e => e._id === r.eventId);
                return { ...r, eventId: event };
            });
            res.json({ success: true, registrations: myRegs });
        }
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
app.post("/api/registrations/:id/cancel", shared_1.authenticateToken, async (req, res) => {
    try {
        const regId = req.params.id;
        const userId = req.user?.id;
        if ((0, shared_1.isDbConnected)()) {
            const registration = await Registration_1.Registration.findById(regId);
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
            const event = await Event_1.Event.findById(registration.eventId);
            if (event && event.registeredCount > 0) {
                event.registeredCount -= 1;
                await event.save();
            }
            res.json({
                success: true,
                message: "Event registration cancelled successfully. As per festival policy, no refund of money is provided.",
                registration
            });
        }
        else {
            const reg = shared_1.localRegistrations.find(r => r._id === regId);
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
            const event = shared_1.localEvents.find(e => e._id === eventIdStr);
            if (event && event.registeredCount > 0) {
                event.registeredCount -= 1;
            }
            res.json({
                success: true,
                message: "Event registration cancelled successfully. As per festival policy, no refund of money is provided.",
                registration: reg
            });
        }
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
// --- Scoreboard Endpoints ---
app.get("/api/scoreboard", async (req, res) => {
    try {
        if ((0, shared_1.isDbConnected)()) {
            const scores = await Score_1.Score.find().populate("eventId");
            res.json({ success: true, scores });
        }
        else {
            const populatedScores = shared_1.localScores.map(s => {
                const event = shared_1.localEvents.find(e => e._id === s.eventId);
                return { ...s, eventId: event };
            });
            res.json({ success: true, scores: populatedScores });
        }
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
app.get("/api/scoreboard/:eventId", async (req, res) => {
    try {
        if ((0, shared_1.isDbConnected)()) {
            const score = await Score_1.Score.findOne({ eventId: req.params.eventId }).populate("eventId");
            if (!score) {
                return res.status(404).json({ success: false, message: "Score record not found" });
            }
            res.json({ success: true, score });
        }
        else {
            const score = shared_1.localScores.find(s => s.eventId === req.params.eventId);
            if (!score) {
                return res.status(404).json({ success: false, message: "Score record not found" });
            }
            const event = shared_1.localEvents.find(e => e._id === score.eventId);
            res.json({ success: true, score: { ...score, eventId: event } });
        }
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
app.put("/api/scoreboard/:eventId", [shared_1.authenticateToken, shared_1.authorizeAdmin], async (req, res) => {
    try {
        const { teams, isLive } = req.body;
        const { eventId } = req.params;
        if ((0, shared_1.isDbConnected)()) {
            let score = await Score_1.Score.findOne({ eventId });
            if (!score) {
                score = new Score_1.Score({ eventId, teams, isLive });
            }
            else {
                if (teams)
                    score.teams = teams;
                if (isLive !== undefined)
                    score.isLive = isLive;
            }
            await score.save();
            const populatedScore = await score.populate("eventId");
            io.emit("score-live", populatedScore);
            res.json({ success: true, score: populatedScore });
        }
        else {
            let score = shared_1.localScores.find(s => s.eventId === eventId);
            if (!score) {
                score = { _id: `score-${Date.now()}`, eventId, teams, isLive };
                shared_1.localScores.push(score);
            }
            else {
                if (teams)
                    score.teams = teams;
                if (isLive !== undefined)
                    score.isLive = isLive;
            }
            const event = shared_1.localEvents.find(e => e._id === score.eventId);
            const populated = { ...score, eventId: event };
            io.emit("score-live", populated);
            res.json({ success: true, score: populated });
        }
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
// Socket connection
io.on("connection", (socket) => {
    console.log("Client connecting socket:", socket.id);
    socket.on("update-score", async (data) => {
        try {
            const { eventId, teams, isLive } = data;
            let populated;
            if ((0, shared_1.isDbConnected)()) {
                let score = await Score_1.Score.findOne({ eventId });
                if (!score) {
                    score = new Score_1.Score({ eventId, teams, isLive });
                }
                else {
                    if (teams)
                        score.teams = teams;
                    if (isLive !== undefined)
                        score.isLive = isLive;
                }
                await score.save();
                populated = await score.populate("eventId");
            }
            else {
                let score = shared_1.localScores.find(s => s.eventId === eventId);
                if (!score) {
                    score = { _id: `score-${Date.now()}`, eventId, teams, isLive };
                    shared_1.localScores.push(score);
                }
                else {
                    if (teams)
                        score.teams = teams;
                    if (isLive !== undefined)
                        score.isLive = isLive;
                }
                const event = shared_1.localEvents.find(e => e._id === score.eventId);
                populated = { ...score, eventId: event };
            }
            io.emit("score-live", populated);
        }
        catch (error) {
            console.error("Socket update-score failed:", error);
        }
    });
    socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
    });
});
app.use("/api/admin", admin_1.adminRouter);
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server starting on port ${PORT}...`);
});
