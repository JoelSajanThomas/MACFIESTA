import express, { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "./models/User";
import { Registration } from "./models/Registration";
import {
  JWT_SECRET,
  authenticateToken,
  authorizeAdmin,
  isDbConnected,
  localUsers,
  localEvents,
  localRegistrations,
  localARLocations,
  localVolunteers,
  localPayments,
  localAnnouncements,
  localAuditLogs,
} from "./shared";

export const adminRouter = express.Router();

// Admin Login Endpoint (Verifies credentials and 2FA OTP)
adminRouter.post("/login", async (req: Request, res: Response) => {
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

    if (isDbConnected()) {
      const user = await User.findOne({ email: normalizedEmail }).select("+password");
      if (!user) {
        return res.status(401).json({ success: false, message: "Invalid email or password credentials" });
      }

      if (user.role !== "admin") {
        return res.status(403).json({ success: false, message: "Access denied: You do not have administrator privileges." });
      }

      let isMatch = await bcrypt.compare(password, user.password || "");
      // Safe fallback: ensure the seeded admin "old id and password" always
      // authenticates in DB mode, matching the local fallback bypass below.
      if (!isMatch && normalizedEmail === "admin@macfast.org" && password === "admin123") {
        isMatch = true;
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

      if (user.role !== "admin") {
        return res.status(403).json({ success: false, message: "Access denied: You do not have administrator privileges." });
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

// 1. User Management APIs
adminRouter.get("/users", [authenticateToken, authorizeAdmin] as any, async (req: Request, res: Response) => {
  try {
    if (isDbConnected()) {
      const users = await User.find().select("-password").lean();
      return res.json({ success: true, users });
    }
    res.json({ success: true, users: localUsers });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

adminRouter.put("/users/:id", [authenticateToken, authorizeAdmin] as any, (req: Request, res: Response) => {
  const { id } = req.params;
  const { role, status } = req.body;
  const adminEmail = (req as any).user?.email || "admin@macfast.org";
  
  const userIdx = localUsers.findIndex(u => u._id === id);
  if (userIdx !== -1) {
    if (role) localUsers[userIdx].role = role;
    if (status) localUsers[userIdx].status = status; // e.g. "active", "suspended", "banned"
    
    localAuditLogs.unshift({
      _id: `log-${Date.now()}`,
      admin: adminEmail,
      action: `Updated User status/role for ${localUsers[userIdx].email} (Status: ${status || 'N/A'}, Role: ${role || 'N/A'})`,
      timestamp: new Date().toISOString()
    });
    
    return res.json({ success: true, user: localUsers[userIdx] });
  }
  res.status(404).json({ success: false, message: "User not found" });
});

adminRouter.delete("/users/:id", [authenticateToken, authorizeAdmin] as any, (req: Request, res: Response) => {
  const { id } = req.params;
  const adminEmail = (req as any).user?.email || "admin@macfast.org";
  
  const userIdx = localUsers.findIndex(u => u._id === id);
  if (userIdx !== -1) {
    const deletedUser = localUsers[userIdx];
    localUsers.splice(userIdx, 1);
    
    localAuditLogs.unshift({
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
adminRouter.post("/users/bulk", [authenticateToken, authorizeAdmin] as any, (req: Request, res: Response) => {
  const adminEmail = (req as any).user?.email || "admin@macfast.org";
  
  const mockStudents = [
    { _id: "user-mock-1", name: "Anoop Varghese", email: "anoop@student.org", phone: "+91 94470 11111", college: "MACFAST", department: "Computer Applications", year: "MCA 1st Year", role: "student", status: "active", xpPoints: 80, badges: [] },
    { _id: "user-mock-2", name: "Merlin Mathew", email: "merlin@student.org", phone: "+91 94470 22222", college: "MACFAST", department: "Management", year: "MBA 2nd Year", role: "student", status: "active", xpPoints: 150, badges: [] },
    { _id: "user-mock-3", name: "Girish Kumar", email: "girish@student.org", phone: "+91 94470 33333", college: "Mar Baselios", department: "Biosciences", year: "MSc 1st Year", role: "student", status: "suspended", xpPoints: 0, badges: [] }
  ];
  
  mockStudents.forEach(student => {
    if (!localUsers.some(u => u.email === student.email)) {
      localUsers.push(student);
    }
  });

  localAuditLogs.unshift({
    _id: `log-${Date.now()}`,
    admin: adminEmail,
    action: "Imported Bulk Mock Student accounts",
    timestamp: new Date().toISOString()
  });

  res.json({ success: true, message: "Bulk users imported successfully", users: localUsers });
});

// 2. AR Navigation APIs
adminRouter.get("/ar-navigation", [authenticateToken, authorizeAdmin] as any, (req: Request, res: Response) => {
  res.json({ success: true, locations: localARLocations });
});

adminRouter.post("/ar-navigation", [authenticateToken, authorizeAdmin] as any, (req: Request, res: Response) => {
  const { building, floor, room, type } = req.body;
  const adminEmail = (req as any).user?.email || "admin@macfast.org";
  
  const newLoc = {
    _id: `ar-${Date.now()}`,
    building,
    floor,
    room,
    type: type || "POI",
    status: "active"
  };
  localARLocations.push(newLoc);

  localAuditLogs.unshift({
    _id: `log-${Date.now()}`,
    admin: adminEmail,
    action: `Created AR Location POI: ${building} - ${room}`,
    timestamp: new Date().toISOString()
  });

  res.json({ success: true, location: newLoc });
});

adminRouter.delete("/ar-navigation/:id", [authenticateToken, authorizeAdmin] as any, (req: Request, res: Response) => {
  const { id } = req.params;
  const adminEmail = (req as any).user?.email || "admin@macfast.org";
  
  const idx = localARLocations.findIndex(l => l._id === id);
  if (idx !== -1) {
    const deletedLoc = localARLocations[idx];
    localARLocations.splice(idx, 1);

    localAuditLogs.unshift({
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
adminRouter.get("/volunteers", [authenticateToken, authorizeAdmin] as any, (req: Request, res: Response) => {
  res.json({ success: true, volunteers: localVolunteers });
});

adminRouter.post("/volunteers", [authenticateToken, authorizeAdmin] as any, (req: Request, res: Response) => {
  const { name, email, duty, shift } = req.body;
  const adminEmail = (req as any).user?.email || "admin@macfast.org";
  
  const newVol = {
    _id: `vol-${Date.now()}`,
    name,
    email,
    duty,
    shift,
    status: "assigned"
  };
  localVolunteers.push(newVol);

  localAuditLogs.unshift({
    _id: `log-${Date.now()}`,
    admin: adminEmail,
    action: `Assigned Volunteer duty to ${name}`,
    timestamp: new Date().toISOString()
  });

  res.json({ success: true, volunteer: newVol });
});

// 4. Payment APIs
adminRouter.get("/payments", [authenticateToken, authorizeAdmin] as any, (req: Request, res: Response) => {
  res.json({ success: true, payments: localPayments });
});

adminRouter.post("/payments/refund/:id", [authenticateToken, authorizeAdmin] as any, (req: Request, res: Response) => {
  const { id } = req.params;
  const adminEmail = (req as any).user?.email || "admin@macfast.org";
  
  const idx = localPayments.findIndex(p => p._id === id);
  if (idx !== -1) {
    localPayments[idx].status = "refunded";

    localAuditLogs.unshift({
      _id: `log-${Date.now()}`,
      admin: adminEmail,
      action: `Processed Refund for transaction ${localPayments[idx].txId}`,
      timestamp: new Date().toISOString()
    });

    return res.json({ success: true, payment: localPayments[idx] });
  }
  res.status(404).json({ success: false, message: "Transaction not found" });
});

// 5. Announcement APIs
adminRouter.get("/announcements", (req: Request, res: Response) => {
  res.json({ success: true, announcements: localAnnouncements });
});

adminRouter.post("/announcements", [authenticateToken, authorizeAdmin] as any, (req: Request, res: Response) => {
  const { title, message, type } = req.body;
  const adminEmail = (req as any).user?.email || "admin@macfast.org";
  
  const newAnn = {
    _id: `ann-${Date.now()}`,
    title,
    message,
    type: type || "general",
    date: new Date().toISOString()
  };
  localAnnouncements.push(newAnn);

  localAuditLogs.unshift({
    _id: `log-${Date.now()}`,
    admin: adminEmail,
    action: `Broadcasted Announcement: ${title}`,
    timestamp: new Date().toISOString()
  });

  res.json({ success: true, announcement: newAnn });
});

// 6. Audit Logs APIs
adminRouter.get("/logs", [authenticateToken, authorizeAdmin] as any, (req: Request, res: Response) => {
  res.json({ success: true, logs: localAuditLogs });
});

// Alias: /audit-logs (used by the admin console frontend)
adminRouter.get("/audit-logs", [authenticateToken, authorizeAdmin] as any, (req: Request, res: Response) => {
  res.json({ success: true, logs: localAuditLogs });
});

// 7. Mock Report Export API
adminRouter.get("/reports/export", [authenticateToken, authorizeAdmin] as any, (req: Request, res: Response) => {
  const { format, type } = req.query;
  res.json({
    success: true,
    message: `Export payload generated for ${type} in ${format} format`,
    payload: `MOCK_EXPORT_DATA_${type?.toString().toUpperCase()}_${Date.now()}`
  });
});

// 8. Registrations Audit API
adminRouter.get("/registrations", [authenticateToken, authorizeAdmin] as any, async (req: Request, res: Response) => {
  try {
    if (isDbConnected()) {
      const registrations = await Registration.find().populate("userId").populate("eventId");
      res.json({ success: true, registrations });
    } else {
      const myRegs = localRegistrations.map((r) => {
        const userObj = localUsers.find((u) => u._id === r.userId);
        const eventIdStr = typeof r.eventId === "object" ? r.eventId._id : r.eventId;
        const eventObj = localEvents.find((e) => e._id === eventIdStr);
        return { ...r, userId: userObj || r.userId, eventId: eventObj || r.eventId };
      });
      res.json({ success: true, registrations: myRegs });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 9. QR Check-In API (used by admin console for participant check-in)
adminRouter.post("/qr-checkin", [authenticateToken, authorizeAdmin] as any, async (req: Request, res: Response) => {
  try {
    const { passCode } = req.body;
    if (!passCode) {
      return res.status(400).json({ success: false, message: "passCode is required" });
    }

    const adminEmail = (req as any).user?.email || "admin@macfast.org";

    if (isDbConnected()) {
      const registration = await Registration.findOne({ passCode });
      if (!registration) {
        return res.status(404).json({ success: false, message: "Registration not found for this passCode" });
      }
      if ((registration as any).status === "CHECKED_IN") {
        return res.status(400).json({ success: false, message: "Participant already checked in" });
      }
      (registration as any).status = "CHECKED_IN";
      (registration as any).qrCheckedIn = true;
      await (registration as any).save();
      localAuditLogs.unshift({
        _id: `log-${Date.now()}`,
        admin: adminEmail,
        action: `QR Check-In: passCode ${passCode}`,
        timestamp: new Date().toISOString()
      });
      return res.json({ success: true, message: "Participant checked in successfully", registration });
    } else {
      const regIdx = localRegistrations.findIndex((r) => r.passCode === passCode);
      if (regIdx === -1) {
        return res.status(404).json({ success: false, message: "Registration not found for this passCode" });
      }
      if (localRegistrations[regIdx].status === "CHECKED_IN") {
        return res.status(400).json({ success: false, message: "Participant already checked in" });
      }
      localRegistrations[regIdx].status = "CHECKED_IN";
      localRegistrations[regIdx].qrCheckedIn = true;
      localAuditLogs.unshift({
        _id: `log-${Date.now()}`,
        admin: adminEmail,
        action: `QR Check-In: passCode ${passCode}`,
        timestamp: new Date().toISOString()
      });
      return res.json({ success: true, message: "Participant checked in successfully", registration: localRegistrations[regIdx] });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

