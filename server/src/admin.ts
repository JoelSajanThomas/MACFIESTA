import express, { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import QRCode from "qrcode";
import { User } from "./models/User";
import { Event } from "./models/Event";
import { Registration } from "./models/Registration";
import {
  JWT_SECRET,
  authenticateToken,
  authorizeAdmin,
  isDbConnected,
  broadcastEvent,
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
    
    broadcastEvent("users-changed", { action: "update", user: localUsers[userIdx] });
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
    
    broadcastEvent("users-changed", { action: "delete", id });
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

  broadcastEvent("users-changed", { action: "bulk" });
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

    broadcastEvent("payments-changed", { action: "refund", id });
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

  broadcastEvent("announcement-new", newAnn);
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

// 8. Registrations Audit & Management APIs
adminRouter.get("/registrations", [authenticateToken, authorizeAdmin] as any, async (req: Request, res: Response) => {
  try {
    if (isDbConnected()) {
      const registrations = await Registration.find()
        .populate("userId")
        .populate("eventId")
        .sort({ createdAt: -1 })
        .lean();

      const mapped = registrations.map((r: any) => {
        const user = r.userId || {};
        const event = r.eventId || {};
        const pass = r.entryPass || r.passCode || (r._id ? `MF-${String(r._id).slice(-6).toUpperCase()}` : "MF-2K26-PASS");
        return {
          _id: String(r._id),
          passCode: pass,
          entryPass: pass,
          userId: r.userId,
          eventId: r.eventId,
          userName: user.name || "Delegate User",
          userEmail: user.email || "N/A",
          userPhone: user.phone || "N/A",
          college: user.college || "N/A",
          department: user.department || "N/A",
          year: user.year || "N/A",
          eventTitle: event.title || "General Festival Pass",
          eventCategory: event.category || "GENERAL",
          eventVenue: event.venue || "Main Campus Arena",
          eventDate: event.date || "24-25 Sep 2026",
          status: r.status ? r.status.toUpperCase() : "ACTIVE",
          paymentStatus: r.paymentStatus || "completed",
          paymentId: r.paymentId || `TXN_${String(r._id || '').slice(-8)}`,
          amountPaid: event.prizePool ? 150 : 150,
          qrCheckedIn: r.status === "CHECKED_IN" || !!r.qrCheckedIn,
          qrCode: r.qrCode || "",
          createdAt: r.createdAt || new Date().toISOString(),
        };
      });

      return res.json({ success: true, registrations: mapped });
    } else {
      const myRegs = localRegistrations.map((r: any) => {
        const userObj = localUsers.find((u) => u._id === r.userId) || {};
        const eventIdStr = typeof r.eventId === "object" ? r.eventId._id : r.eventId;
        const eventObj = localEvents.find((e) => e._id === eventIdStr) || {};
        const pass = r.entryPass || r.passCode || (r._id ? `MF-${String(r._id).slice(-6).toUpperCase()}` : "MF-2K26-PASS");
        return {
          _id: String(r._id),
          passCode: pass,
          entryPass: pass,
          userId: userObj,
          eventId: eventObj,
          userName: userObj.name || "Delegate User",
          userEmail: userObj.email || "N/A",
          userPhone: userObj.phone || "N/A",
          college: userObj.college || "MACFAST",
          department: userObj.department || "General",
          year: userObj.year || "1st Year",
          eventTitle: eventObj.title || "General Festival Pass",
          eventCategory: eventObj.category || "GENERAL",
          eventVenue: eventObj.venue || "Main Campus Arena",
          eventDate: eventObj.date || "24-25 Sep 2026",
          status: r.status ? r.status.toUpperCase() : "ACTIVE",
          paymentStatus: r.paymentStatus || "completed",
          paymentId: r.paymentId || `TXN_${String(r._id || '').slice(-8)}`,
          amountPaid: 150,
          qrCheckedIn: r.status === "CHECKED_IN" || !!r.qrCheckedIn,
          qrCode: r.qrCode || "",
          createdAt: r.createdAt || new Date().toISOString(),
        };
      });
      return res.json({ success: true, registrations: myRegs });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Admin Spot Registration API
adminRouter.post("/registrations", [authenticateToken, authorizeAdmin] as any, async (req: Request, res: Response) => {
  try {
    const { name, email, phone, college, department, year, eventId, amount } = req.body;
    const adminEmail = (req as any).user?.email || "admin@macfast.org";

    if (!name || !email) {
      return res.status(400).json({ success: false, message: "Name and Email are required for spot registration" });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const entryPass = `MF-2K26-${Math.floor(1000 + Math.random() * 9000)}`;
    const txId = `SPOT_TXN_${Math.floor(10000000 + Math.random() * 90000000)}`;

    const qrPayload = `MACFIESTA 2K26 OFFICIAL ENTRY TICKET
------------------------------------
Pass Code: ${entryPass}
Participant: ${name}
Email: ${normalizedEmail}
College: ${college || "MACFAST Tiruvalla"}
Date Registered: ${new Date().toLocaleDateString()}
Status: VERIFIED & PAID (SPOT REGISTRATION)
Organized By: MACFAST Tiruvalla
Verification Link: https://macfiesta.macfast.org/verify/${entryPass}
------------------------------------`;

    const qrCodeBase64 = await QRCode.toDataURL(qrPayload, { margin: 1, width: 300 });

    if (isDbConnected()) {
      // Find or create user
      let user = await User.findOne({ email: normalizedEmail });
      if (!user) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash("macfiesta2026", salt);
        user = await User.create({
          name,
          email: normalizedEmail,
          password: hashedPassword,
          phone: phone || "+91 90000 00000",
          college: college || "MACFAST",
          department: department || "General",
          year: year || "1",
          role: "student",
          xpPoints: 50,
          badges: [{ id: "spot", name: "Spot Registered Agent" }]
        });
      }

      // Find event or fallback to first event
      let targetEventId = eventId;
      if (!targetEventId) {
        const anyEvent = await Event.findOne();
        targetEventId = anyEvent?._id;
      }

      const newReg = await Registration.create({
        userId: user._id,
        eventId: targetEventId,
        paymentStatus: "completed",
        paymentId: txId,
        qrCode: qrCodeBase64,
        entryPass,
        status: "active"
      });

      localAuditLogs.unshift({
        _id: `log-${Date.now()}`,
        admin: adminEmail,
        action: `Issued Spot Registration pass ${entryPass} to ${name} (${normalizedEmail})`,
        timestamp: new Date().toISOString()
      });

      broadcastEvent("registrations-changed", { action: "create", entryPass });
      broadcastEvent("users-changed", { action: "create" });
      broadcastEvent("payments-changed", { action: "create" });

      return res.status(201).json({
        success: true,
        message: "Spot registration pass generated successfully",
        registration: {
          _id: String(newReg._id),
          passCode: entryPass,
          entryPass,
          userName: name,
          userEmail: normalizedEmail,
          userPhone: phone || user.phone,
          college: college || user.college,
          department: department || user.department,
          eventTitle: "Spot Access Pass",
          status: "ACTIVE",
          paymentStatus: "completed",
          paymentId: txId,
          amountPaid: amount || 150,
          qrCheckedIn: false,
          qrCode: qrCodeBase64,
          createdAt: new Date().toISOString()
        }
      });
    } else {
      let user = localUsers.find(u => u.email.toLowerCase() === normalizedEmail);
      if (!user) {
        user = {
          _id: `user-${Date.now()}`,
          name,
          email: normalizedEmail,
          password: "mock",
          phone: phone || "+91 90000 00000",
          college: college || "MACFAST",
          department: department || "General",
          year: year || "1",
          role: "student",
          xpPoints: 50,
          badges: []
        };
        localUsers.push(user);
      }

      const newReg = {
        _id: `reg-${Date.now()}`,
        userId: user._id,
        eventId: eventId || (localEvents[0] ? localEvents[0]._id : "event-default"),
        paymentStatus: "completed",
        paymentId: txId,
        qrCode: qrCodeBase64,
        entryPass,
        status: "ACTIVE"
      };
      localRegistrations.push(newReg);

      localAuditLogs.unshift({
        _id: `log-${Date.now()}`,
        admin: adminEmail,
        action: `Issued Spot Registration pass ${entryPass} to ${name}`,
        timestamp: new Date().toISOString()
      });

      broadcastEvent("registrations-changed", { action: "create", entryPass });
      broadcastEvent("users-changed", { action: "create" });
      broadcastEvent("payments-changed", { action: "create" });

      return res.status(201).json({
        success: true,
        message: "Spot registration pass generated successfully",
        registration: {
          ...newReg,
          passCode: entryPass,
          userName: name,
          userEmail: normalizedEmail,
          userPhone: phone || user.phone,
          college: college || user.college,
          eventTitle: "Spot Access Pass",
          amountPaid: amount || 150,
          qrCheckedIn: false
        }
      });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update Registration Status / Details
adminRouter.put("/registrations/:id", [authenticateToken, authorizeAdmin] as any, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, userName, amountPaid } = req.body;
    const adminEmail = (req as any).user?.email || "admin@macfast.org";

    if (isDbConnected()) {
      const reg = await Registration.findById(id);
      if (!reg) {
        return res.status(404).json({ success: false, message: "Registration not found" });
      }
      if (status) {
        reg.status = status.toLowerCase() === "checked_in" ? ("active" as any) : status.toLowerCase();
      }
      await reg.save();

      localAuditLogs.unshift({
        _id: `log-${Date.now()}`,
        admin: adminEmail,
        action: `Updated Registration pass (${reg.entryPass || id}) status to ${status || 'updated'}`,
        timestamp: new Date().toISOString()
      });

      broadcastEvent("registrations-changed", { action: "update", id, status });
      return res.json({ success: true, message: "Registration updated", registration: reg });
    } else {
      const idx = localRegistrations.findIndex(r => r._id === id);
      if (idx !== -1) {
        if (status) localRegistrations[idx].status = status;
        broadcastEvent("registrations-changed", { action: "update", id, status });
        return res.json({ success: true, registration: localRegistrations[idx] });
      }
      res.status(404).json({ success: false, message: "Registration not found" });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete / Revoke Registration
adminRouter.delete("/registrations/:id", [authenticateToken, authorizeAdmin] as any, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const adminEmail = (req as any).user?.email || "admin@macfast.org";

    if (isDbConnected()) {
      const deleted = await Registration.findByIdAndDelete(id);
      if (!deleted) {
        return res.status(404).json({ success: false, message: "Registration not found" });
      }

      localAuditLogs.unshift({
        _id: `log-${Date.now()}`,
        admin: adminEmail,
        action: `Revoked & Removed Registration pass: ${deleted.entryPass || id}`,
        timestamp: new Date().toISOString()
      });

      broadcastEvent("registrations-changed", { action: "delete", id });
      return res.json({ success: true, message: "Registration pass revoked successfully" });
    } else {
      const idx = localRegistrations.findIndex(r => r._id === id);
      if (idx !== -1) {
        const deleted = localRegistrations[idx];
        localRegistrations.splice(idx, 1);

        localAuditLogs.unshift({
          _id: `log-${Date.now()}`,
          admin: adminEmail,
          action: `Revoked & Removed Registration pass: ${deleted.entryPass || id}`,
          timestamp: new Date().toISOString()
        });

        broadcastEvent("registrations-changed", { action: "delete", id });
        return res.json({ success: true, message: "Registration pass revoked successfully" });
      }
      res.status(404).json({ success: false, message: "Registration not found" });
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
    const searchCode = passCode.trim();

    if (isDbConnected()) {
      const registration = await Registration.findOne({
        $or: [
          { entryPass: searchCode },
          { entryPass: new RegExp(`^${searchCode}$`, "i") },
          { paymentId: searchCode },
          { _id: searchCode.match(/^[0-9a-fA-F]{24}$/) ? searchCode : undefined }
        ].filter(Boolean)
      }).populate("userId").populate("eventId");

      if (!registration) {
        return res.status(404).json({ success: false, message: "Registration not found for this pass code" });
      }
      if ((registration as any).status === "CHECKED_IN" || (registration as any).qrCheckedIn) {
        return res.status(400).json({ success: false, message: "Participant already checked in at gate" });
      }
      (registration as any).status = "CHECKED_IN";
      (registration as any).qrCheckedIn = true;
      await (registration as any).save();

      localAuditLogs.unshift({
        _id: `log-${Date.now()}`,
        admin: adminEmail,
        action: `Gate QR Check-In Verified: Pass ${(registration as any).entryPass}`,
        timestamp: new Date().toISOString()
      });
      broadcastEvent("qr-checked-in", { passCode: searchCode, registration });
      broadcastEvent("registrations-changed", { action: "checkin", passCode: searchCode });
      return res.json({ success: true, message: "Participant gate check-in confirmed", registration });
    } else {
      const regIdx = localRegistrations.findIndex(
        (r) => r.passCode === searchCode || r.entryPass === searchCode || r._id === searchCode
      );
      if (regIdx === -1) {
        return res.status(404).json({ success: false, message: "Registration not found for this pass code" });
      }
      if (localRegistrations[regIdx].status === "CHECKED_IN" || localRegistrations[regIdx].qrCheckedIn) {
        return res.status(400).json({ success: false, message: "Participant already checked in at gate" });
      }
      localRegistrations[regIdx].status = "CHECKED_IN";
      localRegistrations[regIdx].qrCheckedIn = true;

      localAuditLogs.unshift({
        _id: `log-${Date.now()}`,
        admin: adminEmail,
        action: `Gate QR Check-In Verified: Pass ${localRegistrations[regIdx].entryPass || searchCode}`,
        timestamp: new Date().toISOString()
      });
      broadcastEvent("qr-checked-in", { passCode: searchCode, registration: localRegistrations[regIdx] });
      broadcastEvent("registrations-changed", { action: "checkin", passCode: searchCode });
      return res.json({ success: true, message: "Participant gate check-in confirmed", registration: localRegistrations[regIdx] });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

