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
const mongoose_1 = __importDefault(require("mongoose"));
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
app.use((0, helmet_1.default)());
app.use(express_1.default.json());
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 mins
    max: 200, // Limit IP calls
    message: "Rate limit threshold reached. Please retry in 15 mins."
});
app.use("/api/", limiter);
// Helper constants
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkeymacfiesta2026";
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({ success: false, message: "Access token missing" });
    }
    jsonwebtoken_1.default.verify(token, JWT_SECRET, (err, decoded) => {
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
const authorizeAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({ success: false, message: "Forbidden: Admin access level required" });
    }
    next();
};
// Check if database is active
const isDbConnected = () => mongoose_1.default.connection.readyState === 1;
// --- Local In-Memory Fallback Database ---
let localUsers = [
    {
        _id: "admin-id-default",
        name: "Admin User",
        email: "admin@macfast.org",
        password: bcryptjs_1.default.hashSync("admin123", 10),
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
        password: bcryptjs_1.default.hashSync("student123", 10),
        phone: "+91 94470 99999",
        college: "MACFAST Tiruvalla",
        department: "Computer Applications",
        year: "MCA 2nd Year",
        role: "student",
        xpPoints: 120,
        badges: [{ id: "newcomer", name: "Festival Pioneer" }]
    }
];
let localEvents = [
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
let localRegistrations = [];
let localScores = [
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
app.get("/api/health", (req, res) => {
    res.json({ status: "online", time: new Date(), mode: isDbConnected() ? "db" : "fallback" });
});
// --- Auth Endpoints ---
app.post("/api/auth/register", async (req, res) => {
    try {
        const { name, email, password, phone, college, department, year } = req.body;
        if (!name || !email || !password || !phone || !college || !department || !year) {
            return res.status(400).json({ success: false, message: "All registration fields are required" });
        }
        if (isDbConnected()) {
            const existingUser = await User_1.User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ success: false, message: "User with this email already exists" });
            }
            const salt = await bcryptjs_1.default.genSalt(10);
            const hashedPassword = await bcryptjs_1.default.hash(password, salt);
            const newUser = await User_1.User.create({
                name,
                email,
                password: hashedPassword,
                phone,
                college,
                department,
                year,
                role: "student",
                xpPoints: 50,
                badges: [{ id: "newcomer", name: "Festival Pioneer" }]
            });
            const token = jsonwebtoken_1.default.sign({ id: newUser._id, email: newUser.email, role: newUser.role }, JWT_SECRET, {
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
            const existingUser = localUsers.find(u => u.email === email);
            if (existingUser) {
                return res.status(400).json({ success: false, message: "User with this email already exists" });
            }
            const salt = await bcryptjs_1.default.genSalt(10);
            const hashedPassword = await bcryptjs_1.default.hash(password, salt);
            const newUser = {
                _id: `user-${Date.now()}`,
                name,
                email,
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
            const token = jsonwebtoken_1.default.sign({ id: newUser._id, email: newUser.email, role: newUser.role }, JWT_SECRET, {
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
        if (isDbConnected()) {
            const user = await User_1.User.findOne({ email }).select("+password");
            if (!user) {
                return res.status(401).json({ success: false, message: "Invalid email or password credentials" });
            }
            const isMatch = await bcryptjs_1.default.compare(password, user.password || "");
            if (!isMatch) {
                return res.status(401).json({ success: false, message: "Invalid email or password credentials" });
            }
            const token = jsonwebtoken_1.default.sign({ id: user._id, email: user.email, role: user.role }, JWT_SECRET, {
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
            const user = localUsers.find(u => u.email === email);
            if (!user) {
                return res.status(401).json({ success: false, message: "Invalid email or password credentials" });
            }
            // Hardcode plain check bypass for seeded admin user testing
            const isMatch = (password === "admin123" && email === "admin@macfast.org") || await bcryptjs_1.default.compare(password, user.password || "");
            if (!isMatch) {
                return res.status(401).json({ success: false, message: "Invalid email or password credentials" });
            }
            const token = jsonwebtoken_1.default.sign({ id: user._id, email: user.email, role: user.role }, JWT_SECRET, {
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
app.get("/api/auth/me", authenticateToken, async (req, res) => {
    try {
        if (isDbConnected()) {
            const user = await User_1.User.findById(req.user?.id);
            if (!user) {
                return res.status(404).json({ success: false, message: "User not found" });
            }
            res.json({ success: true, user });
        }
        else {
            const user = localUsers.find(u => u._id === req.user?.id);
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
// --- Events Endpoints ---
app.get("/api/events", async (req, res) => {
    try {
        if (isDbConnected()) {
            const events = await Event_1.Event.find();
            res.json({ success: true, events });
        }
        else {
            res.json({ success: true, events: localEvents });
        }
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
app.get("/api/events/:slug", async (req, res) => {
    try {
        if (isDbConnected()) {
            const event = await Event_1.Event.findOne({ slug: req.params.slug });
            if (!event) {
                return res.status(404).json({ success: false, message: "Event not found" });
            }
            res.json({ success: true, event });
        }
        else {
            const event = localEvents.find(e => e.slug === req.params.slug);
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
app.post("/api/events", [authenticateToken, authorizeAdmin], async (req, res) => {
    try {
        const { title, slug, description, rules, coverImage, date, time, venue, category, type, prizePool, maxSeats, coordinator } = req.body;
        if (isDbConnected()) {
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
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
app.put("/api/events/:slug", [authenticateToken, authorizeAdmin], async (req, res) => {
    try {
        if (isDbConnected()) {
            const updatedEvent = await Event_1.Event.findOneAndUpdate({ slug: req.params.slug }, req.body, { new: true });
            if (!updatedEvent) {
                return res.status(404).json({ success: false, message: "Event not found to update" });
            }
            res.json({ success: true, event: updatedEvent });
        }
        else {
            const idx = localEvents.findIndex(e => e.slug === req.params.slug);
            if (idx === -1) {
                return res.status(404).json({ success: false, message: "Event not found to update" });
            }
            localEvents[idx] = { ...localEvents[idx], ...req.body };
            res.json({ success: true, event: localEvents[idx] });
        }
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
app.delete("/api/events/:slug", [authenticateToken, authorizeAdmin], async (req, res) => {
    try {
        if (isDbConnected()) {
            const deletedEvent = await Event_1.Event.findOneAndDelete({ slug: req.params.slug });
            if (!deletedEvent) {
                return res.status(404).json({ success: false, message: "Event not found to delete" });
            }
            await Score_1.Score.deleteOne({ eventId: deletedEvent._id });
            await Registration_1.Registration.deleteMany({ eventId: deletedEvent._id });
            res.json({ success: true, message: "Event and associated records deleted successfully" });
        }
        else {
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
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
// --- Registrations Endpoints ---
app.post("/api/registrations", authenticateToken, async (req, res) => {
    try {
        const { eventId } = req.body;
        const userId = req.user?.id;
        if (!eventId) {
            return res.status(400).json({ success: false, message: "Event ID is required" });
        }
        if (isDbConnected()) {
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
            const entryPass = `MF-2K26-${Math.floor(1000 + Math.random() * 9000)}`;
            const qrPayload = JSON.stringify({
                userId,
                eventId,
                pass: entryPass,
                date: new Date()
            });
            const qrCodeBase64 = await qrcode_1.default.toDataURL(qrPayload);
            const newReg = await Registration_1.Registration.create({
                userId,
                eventId,
                paymentStatus: "completed",
                qrCode: qrCodeBase64,
                entryPass
            });
            event.registeredCount += 1;
            await event.save();
            const user = await User_1.User.findById(userId);
            if (user) {
                user.xpPoints += 100;
                if (user.xpPoints >= 150 && !user.badges.some((b) => b.id === "competitor")) {
                    user.badges.push({ id: "competitor", name: "Gladiator Attendee", earnedAt: new Date() });
                }
                await user.save();
            }
            res.status(201).json({ success: true, registration: newReg });
        }
        else {
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
            const qrCodeBase64 = await qrcode_1.default.toDataURL(qrPayload);
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
                if (user.xpPoints >= 150 && !user.badges.some((b) => b.id === "competitor")) {
                    user.badges.push({ id: "competitor", name: "Gladiator Attendee", earnedAt: new Date() });
                }
            }
            res.status(201).json({ success: true, registration: newReg });
        }
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
app.get("/api/registrations/my", authenticateToken, async (req, res) => {
    try {
        if (isDbConnected()) {
            const registrations = await Registration_1.Registration.find({ userId: req.user?.id }).populate("eventId");
            res.json({ success: true, registrations });
        }
        else {
            const myRegs = localRegistrations
                .filter(r => r.userId === req.user?.id)
                .map(r => {
                const event = localEvents.find(e => e._id === r.eventId);
                return { ...r, eventId: event };
            });
            res.json({ success: true, registrations: myRegs });
        }
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
// --- Scoreboard Endpoints ---
app.get("/api/scoreboard", async (req, res) => {
    try {
        if (isDbConnected()) {
            const scores = await Score_1.Score.find().populate("eventId");
            res.json({ success: true, scores });
        }
        else {
            const populatedScores = localScores.map(s => {
                const event = localEvents.find(e => e._id === s.eventId);
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
        if (isDbConnected()) {
            const score = await Score_1.Score.findOne({ eventId: req.params.eventId }).populate("eventId");
            if (!score) {
                return res.status(404).json({ success: false, message: "Score record not found" });
            }
            res.json({ success: true, score });
        }
        else {
            const score = localScores.find(s => s.eventId === req.params.eventId);
            if (!score) {
                return res.status(404).json({ success: false, message: "Score record not found" });
            }
            const event = localEvents.find(e => e._id === score.eventId);
            res.json({ success: true, score: { ...score, eventId: event } });
        }
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
app.put("/api/scoreboard/:eventId", [authenticateToken, authorizeAdmin], async (req, res) => {
    try {
        const { teams, isLive } = req.body;
        const { eventId } = req.params;
        if (isDbConnected()) {
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
            let score = localScores.find(s => s.eventId === eventId);
            if (!score) {
                score = { _id: `score-${Date.now()}`, eventId, teams, isLive };
                localScores.push(score);
            }
            else {
                if (teams)
                    score.teams = teams;
                if (isLive !== undefined)
                    score.isLive = isLive;
            }
            const event = localEvents.find(e => e._id === score.eventId);
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
            if (isDbConnected()) {
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
                let score = localScores.find(s => s.eventId === eventId);
                if (!score) {
                    score = { _id: `score-${Date.now()}`, eventId, teams, isLive };
                    localScores.push(score);
                }
                else {
                    if (teams)
                        score.teams = teams;
                    if (isLive !== undefined)
                        score.isLive = isLive;
                }
                const event = localEvents.find(e => e._id === score.eventId);
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
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server starting on port ${PORT}...`);
});
