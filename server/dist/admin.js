"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRouter = void 0;
const express_1 = __importDefault(require("express"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("./models/User");
const shared_1 = require("./shared");
exports.adminRouter = express_1.default.Router();
// Admin Login Endpoint (Verifies credentials and 2FA OTP)
exports.adminRouter.post("/login", async (req, res) => {
    try {
        const { email, password, otp } = req.body;
        if (!email || !password || !otp) {
            return res.status(400).json({ success: false, message: "Email, password, and 2FA token are required" });
        }
        const normalizedEmail = email.trim().toLowerCase();
        // 2FA Verification (OTP must be "123456" as expected by the admin console/login component)
        if (otp !== "123456") {
            return res.status(401).json({ success: false, message: "Invalid 2FA token. Verification failed." });
        }
        if ((0, shared_1.isDbConnected)()) {
            const user = await User_1.User.findOne({ email: normalizedEmail }).select("+password");
            if (!user) {
                return res.status(401).json({ success: false, message: "Invalid email or password credentials" });
            }
            if (user.role !== "admin") {
                return res.status(403).json({ success: false, message: "Access denied: You do not have administrator privileges." });
            }
            const isMatch = await bcryptjs_1.default.compare(password, user.password || "");
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
            if (user.role !== "admin") {
                return res.status(403).json({ success: false, message: "Access denied: You do not have administrator privileges." });
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
// 1. User Management APIs
exports.adminRouter.get("/users", [shared_1.authenticateToken, shared_1.authorizeAdmin], (req, res) => {
    res.json({ success: true, users: shared_1.localUsers });
});
exports.adminRouter.put("/users/:id", [shared_1.authenticateToken, shared_1.authorizeAdmin], (req, res) => {
    const { id } = req.params;
    const { role, status } = req.body;
    const adminEmail = req.user?.email || "admin@macfast.org";
    const userIdx = shared_1.localUsers.findIndex(u => u._id === id);
    if (userIdx !== -1) {
        if (role)
            shared_1.localUsers[userIdx].role = role;
        if (status)
            shared_1.localUsers[userIdx].status = status; // e.g. "active", "suspended", "banned"
        shared_1.localAuditLogs.unshift({
            _id: `log-${Date.now()}`,
            admin: adminEmail,
            action: `Updated User status/role for ${shared_1.localUsers[userIdx].email} (Status: ${status || 'N/A'}, Role: ${role || 'N/A'})`,
            timestamp: new Date().toISOString()
        });
        return res.json({ success: true, user: shared_1.localUsers[userIdx] });
    }
    res.status(404).json({ success: false, message: "User not found" });
});
exports.adminRouter.delete("/users/:id", [shared_1.authenticateToken, shared_1.authorizeAdmin], (req, res) => {
    const { id } = req.params;
    const adminEmail = req.user?.email || "admin@macfast.org";
    const userIdx = shared_1.localUsers.findIndex(u => u._id === id);
    if (userIdx !== -1) {
        const deletedUser = shared_1.localUsers[userIdx];
        shared_1.localUsers.splice(userIdx, 1);
        shared_1.localAuditLogs.unshift({
            _id: `log-${Date.now()}`,
            admin: adminEmail,
            action: `Deleted User account: ${deletedUser.email}`,
            timestamp: new Date().toISOString()
        });
        return res.json({ success: true, message: "User deleted successfully" });
    }
    res.status(404).json({ success: false, message: "User not found" });
});
// Bulk User Seed API
exports.adminRouter.post("/users/bulk", [shared_1.authenticateToken, shared_1.authorizeAdmin], (req, res) => {
    const adminEmail = req.user?.email || "admin@macfast.org";
    const mockStudents = [
        { _id: "user-mock-1", name: "Anoop Varghese", email: "anoop@student.org", phone: "+91 94470 11111", college: "MACFAST", department: "Computer Applications", year: "MCA 1st Year", role: "student", status: "active", xpPoints: 80, badges: [] },
        { _id: "user-mock-2", name: "Merlin Mathew", email: "merlin@student.org", phone: "+91 94470 22222", college: "MACFAST", department: "Management", year: "MBA 2nd Year", role: "student", status: "active", xpPoints: 150, badges: [] },
        { _id: "user-mock-3", name: "Girish Kumar", email: "girish@student.org", phone: "+91 94470 33333", college: "Mar Baselios", department: "Biosciences", year: "MSc 1st Year", role: "student", status: "suspended", xpPoints: 0, badges: [] }
    ];
    mockStudents.forEach(student => {
        if (!shared_1.localUsers.some(u => u.email === student.email)) {
            shared_1.localUsers.push(student);
        }
    });
    shared_1.localAuditLogs.unshift({
        _id: `log-${Date.now()}`,
        admin: adminEmail,
        action: "Imported Bulk Mock Student accounts",
        timestamp: new Date().toISOString()
    });
    res.json({ success: true, message: "Bulk users imported successfully", users: shared_1.localUsers });
});
// 2. AR Navigation APIs
exports.adminRouter.get("/ar-navigation", [shared_1.authenticateToken, shared_1.authorizeAdmin], (req, res) => {
    res.json({ success: true, locations: shared_1.localARLocations });
});
exports.adminRouter.post("/ar-navigation", [shared_1.authenticateToken, shared_1.authorizeAdmin], (req, res) => {
    const { building, floor, room, type } = req.body;
    const adminEmail = req.user?.email || "admin@macfast.org";
    const newLoc = {
        _id: `ar-${Date.now()}`,
        building,
        floor,
        room,
        type: type || "POI",
        status: "active"
    };
    shared_1.localARLocations.push(newLoc);
    shared_1.localAuditLogs.unshift({
        _id: `log-${Date.now()}`,
        admin: adminEmail,
        action: `Created AR Location POI: ${building} - ${room}`,
        timestamp: new Date().toISOString()
    });
    res.json({ success: true, location: newLoc });
});
exports.adminRouter.delete("/ar-navigation/:id", [shared_1.authenticateToken, shared_1.authorizeAdmin], (req, res) => {
    const { id } = req.params;
    const adminEmail = req.user?.email || "admin@macfast.org";
    const idx = shared_1.localARLocations.findIndex(l => l._id === id);
    if (idx !== -1) {
        const deletedLoc = shared_1.localARLocations[idx];
        shared_1.localARLocations.splice(idx, 1);
        shared_1.localAuditLogs.unshift({
            _id: `log-${Date.now()}`,
            admin: adminEmail,
            action: `Deleted AR Location POI: ${deletedLoc.building} - ${deletedLoc.room}`,
            timestamp: new Date().toISOString()
        });
        return res.json({ success: true, message: "Location deleted successfully" });
    }
    res.status(404).json({ success: false, message: "Location not found" });
});
// 3. Volunteer APIs
exports.adminRouter.get("/volunteers", [shared_1.authenticateToken, shared_1.authorizeAdmin], (req, res) => {
    res.json({ success: true, volunteers: shared_1.localVolunteers });
});
exports.adminRouter.post("/volunteers", [shared_1.authenticateToken, shared_1.authorizeAdmin], (req, res) => {
    const { name, email, duty, shift } = req.body;
    const adminEmail = req.user?.email || "admin@macfast.org";
    const newVol = {
        _id: `vol-${Date.now()}`,
        name,
        email,
        duty,
        shift,
        status: "assigned"
    };
    shared_1.localVolunteers.push(newVol);
    shared_1.localAuditLogs.unshift({
        _id: `log-${Date.now()}`,
        admin: adminEmail,
        action: `Assigned Volunteer duty to ${name}`,
        timestamp: new Date().toISOString()
    });
    res.json({ success: true, volunteer: newVol });
});
// 4. Payment APIs
exports.adminRouter.get("/payments", [shared_1.authenticateToken, shared_1.authorizeAdmin], (req, res) => {
    res.json({ success: true, payments: shared_1.localPayments });
});
exports.adminRouter.post("/payments/refund/:id", [shared_1.authenticateToken, shared_1.authorizeAdmin], (req, res) => {
    const { id } = req.params;
    const adminEmail = req.user?.email || "admin@macfast.org";
    const idx = shared_1.localPayments.findIndex(p => p._id === id);
    if (idx !== -1) {
        shared_1.localPayments[idx].status = "refunded";
        shared_1.localAuditLogs.unshift({
            _id: `log-${Date.now()}`,
            admin: adminEmail,
            action: `Processed Refund for transaction ${shared_1.localPayments[idx].txId}`,
            timestamp: new Date().toISOString()
        });
        return res.json({ success: true, payment: shared_1.localPayments[idx] });
    }
    res.status(404).json({ success: false, message: "Transaction not found" });
});
// 5. Announcement APIs
exports.adminRouter.get("/announcements", (req, res) => {
    res.json({ success: true, announcements: shared_1.localAnnouncements });
});
exports.adminRouter.post("/announcements", [shared_1.authenticateToken, shared_1.authorizeAdmin], (req, res) => {
    const { title, message, type } = req.body;
    const adminEmail = req.user?.email || "admin@macfast.org";
    const newAnn = {
        _id: `ann-${Date.now()}`,
        title,
        message,
        type: type || "general",
        date: new Date().toISOString()
    };
    shared_1.localAnnouncements.push(newAnn);
    shared_1.localAuditLogs.unshift({
        _id: `log-${Date.now()}`,
        admin: adminEmail,
        action: `Broadcasted Announcement: ${title}`,
        timestamp: new Date().toISOString()
    });
    res.json({ success: true, announcement: newAnn });
});
// 6. Audit Logs APIs
exports.adminRouter.get("/logs", [shared_1.authenticateToken, shared_1.authorizeAdmin], (req, res) => {
    res.json({ success: true, logs: shared_1.localAuditLogs });
});
// 7. Mock Report Export API
exports.adminRouter.get("/reports/export", [shared_1.authenticateToken, shared_1.authorizeAdmin], (req, res) => {
    const { format, type } = req.query;
    res.json({
        success: true,
        message: `Export payload generated for ${type} in ${format} format`,
        payload: `MOCK_EXPORT_DATA_${type?.toString().toUpperCase()}_${Date.now()}`
    });
});
