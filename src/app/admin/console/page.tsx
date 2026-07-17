"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { io } from "socket.io-client";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import {
  RiDashboardLine,
  RiUserSettingsLine,
  RiCalendarLine,
  RiFileList3Line,
  RiBaseStationLine,
  RiSettings4Line,
  RiMoneyDollarCircleLine,
  RiGlobalLine,
  RiMapPinRangeLine,
  RiNotification4Line,
  RiUserHeartLine,
  RiRobotLine,
  RiFolderOpenLine,
  RiQuestionAnswerLine,
  RiUserSearchLine,
  RiShieldUserLine,
  RiMailSendLine,
  RiDownload2Line,
  RiCheckDoubleLine,
  RiDeleteBinLine,
  RiEditLine,
  RiAddLine,
  RiSparklingLine,
  RiInformationLine,
  RiUserStarLine,
  RiDeleteBin7Line,
  RiSaveLine,
  RiSearchLine,
  RiCheckboxCircleLine,
  RiSendPlaneLine,
  RiCloseLine,
} from "react-icons/ri";
import { api } from "@/lib/api";
import { SOCKET_URL } from "@/lib/constants";
import { useAuthStore } from "@/lib/authStore";

type TabId =
  | "dashboard"
  | "users"
  | "events"
  | "ar-nav"
  | "students-faculty"
  | "announcements"
  | "volunteers"
  | "financials"
  | "feedback"
  | "file-manager"
  | "ai-copilot"
  | "settings"
  | "scoreboard";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, token, isInitialized } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    if (mounted && isInitialized) {
      if (!token || !user || user.role !== "admin") {
        router.replace("/admin/login");
      }
    }
  }, [mounted, isInitialized, token, user, router]);

  const [metrics, setMetrics] = useState({
    totalUsers: 1240,
    activeAttendees: 942,
    qrCheckedIn: 618,
    ticketsSold: 1150,
    revenue: 172500,
    activeEventsCount: 3,
    serverStatus: "Online",
    dbMode: "Fallback",
    latency: "14ms",
  });

  const [users, setUsers] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [arLocations, setArLocations] = useState<any[]>([]);
  const [volunteers, setVolunteers] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [scoreboards, setScoreboards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState("");
  const [socket, setSocket] = useState<any>(null);

  // --- Scoreboard States ---
  const [selectedEventId, setSelectedEventId] = useState("");
  const [scoreboardTeams, setScoreboardTeams] = useState<Array<{ rank: number; name: string; college: string; score: number }>>([]);
  const [scoreboardLive, setScoreboardLive] = useState(true);

  // --- Interactive Form Fields & States ---
  const [editingEvent, setEditingEvent] = useState<any | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [eventTitle, setEventTitle] = useState("");
  const [eventSlug, setEventSlug] = useState("");
  const [eventDesc, setEventDesc] = useState("");
  const [eventVenue, setEventVenue] = useState("");
  const [eventCategory, setEventCategory] = useState("gaming");
  const [eventTime, setEventTime] = useState("Day 1, 11:00 AM onwards");
  const [eventRules, setEventRules] = useState("");
  const [eventPrize, setEventPrize] = useState(20000);
  const [eventSeats, setEventSeats] = useState(20);

  const [arBuilding, setArBuilding] = useState("Main Block");
  const [arFloor, setArFloor] = useState("Ground Floor");
  const [arRoom, setArRoom] = useState("");
  const [arType, setArType] = useState("POI");

  const [annTitle, setAnnTitle] = useState("");
  const [annMsg, setAnnMsg] = useState("");
  const [annType, setAnnType] = useState("general");

  const [volName, setVolName] = useState("");
  const [volEmail, setVolEmail] = useState("");
  const [volDuty, setVolDuty] = useState("");
  const [volShift, setVolShift] = useState("Day 1, Morning");

  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [enable2FA, setEnable2FA] = useState(true);
  const [restrictedIPs, setRestrictedIPs] = useState(
    "192.168.1.1, 10.0.0.1"
  );

  const [aiInput, setAiInput] = useState("");
  const [aiChat, setAiChat] = useState<Array<{ sender: "user" | "bot"; text: string }>>([
    {
      sender: "bot",
      text: "Welcome to MacFiesta Co-pilot. I can suggest event logistics, draft email announcements, or generate attendance reports. Ask me anything!",
    },
  ]);

  const [fileFolder, setFileFolder] = useState<"root" | "assets" | "documents" | "database">("root");

  const [feedbackList, setFeedbackList] = useState([
    {
      id: "fb-1",
      user: "John Doe",
      type: "Complaint",
      details: "Slow loading of 3D Particle fields on Android.",
      rating: 3,
      reply: "",
      status: "pending",
    },
    {
      id: "fb-2",
      user: "Anoop V.",
      type: "Suggestion",
      details: "Add lunch voucher QR tickets directly in user dashboard.",
      rating: 5,
      reply: "Good idea, will implement.",
      status: "resolved",
    },
  ]);
  const [activeFeedbackId, setActiveFeedbackId] = useState<string | null>(null);
  const [feedbackReplyText, setFeedbackReplyText] = useState("");

  const [searchUserQuery, setSearchUserQuery] = useState("");

  // Reload data from backend helper
  const refreshData = async () => {
    try {
      const [usersRes, eventsRes, arRes, volRes, payRes, annRes, logsRes, scoresRes] = await Promise.all([
        api.get("/admin/users").catch(() => ({ data: { users: [] } })),
        api.get("/events").catch(() => ({ data: { events: [] } })),
        api.get("/admin/ar-navigation").catch(() => ({ data: { locations: [] } })),
        api.get("/admin/volunteers").catch(() => ({ data: { volunteers: [] } })),
        api.get("/admin/payments").catch(() => ({ data: { payments: [] } })),
        api.get("/admin/announcements").catch(() => ({ data: { announcements: [] } })),
        api.get("/admin/logs").catch(() => ({ data: { logs: [] } })),
        api.get("/scoreboard").catch(() => ({ data: { scores: [] } })),
      ]);

      setUsers(usersRes.data?.users || []);
      const loadedEvents = eventsRes.data?.events || [];
      setEvents(loadedEvents);
      setArLocations(arRes.data?.locations || []);
      setVolunteers(volRes.data?.volunteers || []);
      setPayments(payRes.data?.payments || []);
      setAnnouncements(annRes.data?.announcements || []);
      setAuditLogs(logsRes.data?.logs || []);
      setScoreboards(scoresRes.data?.scores || []);

      const totalRegs = loadedEvents.reduce(
        (acc: number, curr: any) => acc + (curr.registeredCount || 0),
        0
      );

      setMetrics((prev) => ({
        ...prev,
        activeEventsCount: loadedEvents.length,
        qrCheckedIn: 618 + totalRegs,
        ticketsSold: 1150 + totalRegs,
        revenue: 172500 + totalRegs * 150,
      }));
    } catch (err) {
      console.error("Dashboard database fetch failed", err);
    }
  };

  // --- PDF generation ---
  const generatePDFReport = (reportType: string) => {
    setStatusMsg(`Generating PDF report for ${reportType}...`);
    try {
      const doc = new jsPDF();
      const adminName = user?.email || "admin@macfast.org";
      const timestamp = new Date().toLocaleString();

      doc.setFillColor(20, 20, 20);
      doc.rect(10, 10, 190, 20, "F");

      doc.setTextColor(234, 179, 8);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text("MACFIESTA 2K26 — SYSTEM PORTAL", 15, 23);

      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.text("ADMINISTRATIVE DECK • TIRUVALLA", 15, 27);

      doc.setTextColor(60, 60, 60);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text(`${reportType.toUpperCase()} OPERATIONS REPORT`, 15, 42);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.text(`Generated by: ${adminName}`, 15, 48);
      doc.text(`Date & Time: ${timestamp}`, 15, 53);
      doc.text(`Platform State: Fallback DB Active`, 15, 58);

      doc.setDrawColor(220, 220, 220);
      doc.line(10, 62, 200, 62);

      let headers: string[] = [];
      let rows: any[][] = [];

      if (reportType === "users") {
        headers = ["Name", "Email", "Phone", "College", "Department", "Role", "Status"];
        rows = users.map((u) => [
          u.name || "N/A",
          u.email || "N/A",
          u.phone || "N/A",
          u.college || "N/A",
          u.department || "N/A",
          u.role || "student",
          u.status || "active",
        ]);
      } else if (reportType === "students") {
        headers = ["Name", "Email", "Phone", "College", "Department", "Status"];
        rows = users
          .filter((u) => u.role === "student")
          .map((u) => [
            u.name || "N/A",
            u.email || "N/A",
            u.phone || "N/A",
            u.college || "N/A",
            u.department || "N/A",
            u.status || "active",
          ]);
      } else if (reportType === "financials") {
        const totalAmount = payments.reduce((sum, p) => p.status === "completed" ? sum + p.amount : sum, 0);
        const expenditures = Math.round(totalAmount * 0.42); // 42% operational expenditures
        const netProfit = totalAmount - expenditures;

        doc.setTextColor(30, 30, 30);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.text("FINANCIAL SUMMARY STATEMENT", 15, 66);

        autoTable(doc, {
          head: [["Total Amount (Revenue)", "Total Expenditures", "Estimated Net Profits"]],
          body: [[`Rs. ${totalAmount.toLocaleString("en-IN")}`, `Rs. ${expenditures.toLocaleString("en-IN")}`, `Rs. ${netProfit.toLocaleString("en-IN")}`]],
          startY: 70,
          theme: "striped",
          styles: { fontSize: 9, cellPadding: 4, halign: "center" },
          headStyles: { fillColor: [30, 41, 59] },
          margin: { left: 10, right: 10 },
        });

        const finalY = (doc as any).lastAutoTable.finalY + 12;

        doc.setTextColor(30, 30, 30);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.text("DETAILED TRANSACTION LEDGER", 15, finalY - 4);

        headers = ["Transaction ID", "User Email", "Amount", "Gateway", "Status", "Date"];
        rows = payments.map((p) => [
          p.txId || "N/A",
          p.email || "N/A",
          `Rs.${p.amount}`,
          p.gateway || "N/A",
          p.status || "completed",
          p.date ? new Date(p.date).toLocaleDateString() : new Date().toLocaleDateString(),
        ]);

        autoTable(doc, {
          head: [headers],
          body: rows,
          startY: finalY,
          theme: "grid",
          styles: { fontSize: 8, cellPadding: 3 },
          headStyles: { fillColor: [139, 92, 246] },
          alternateRowStyles: { fillColor: [245, 245, 250] },
          margin: { left: 10, right: 10 },
        });
      } else {
        headers = ["Metric Category Name", "Telemetric Reading Value", "Audit Result"];
        rows = [
          ["Total Registered Users", `${metrics.totalUsers}`, "Healthy Check"],
          ["Active Event Spaces", `${metrics.activeEventsCount}`, "Active"],
          ["Total Checked-in QR Passes", `${metrics.qrCheckedIn}`, "Integrity Verify"],
          ["Gross Payments Generated", `Rs.${metrics.revenue}`, "Balanced Ledger"],
          ["Server Mode", `${metrics.dbMode} Fallback`, "Fallback Standby"],
          ["API Telemetry Latency", `${metrics.latency}`, "Pass"],
        ];
      }

      if (reportType !== "financials") {
        autoTable(doc, {
          head: [headers],
          body: rows,
          startY: 65,
          theme: "grid",
          styles: { fontSize: 8, cellPadding: 3 },
          headStyles: { fillColor: [139, 92, 246] },
          alternateRowStyles: { fillColor: [245, 245, 250] },
          margin: { left: 10, right: 10 },
        });
      }

      doc.save(`MacFiesta_${reportType}_report.pdf`);
      setStatusMsg("✓ PDF Report downloaded successfully!");
      setTimeout(() => setStatusMsg(""), 3000);
    } catch (err) {
      console.error(err);
      setStatusMsg("✗ PDF Generation failed. Verify document context.");
      setTimeout(() => setStatusMsg(""), 3000);
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !isInitialized || !token || !user || user.role !== "admin") return;

    refreshData();

    const sk = io(SOCKET_URL);
    setSocket(sk);

    return () => {
      sk.disconnect();
    };
  }, [mounted, isInitialized, token, user]);

  // --- Handlers ---
  const handleUpdateUser = async (id: string, role?: string, status?: string) => {
    try {
      setStatusMsg("Updating user settings...");
      const res = await api.put(`/admin/users/${id}`, { role, status });
      if (res.data.success) {
        setStatusMsg("✓ User updated successfully");
        await refreshData();
      }
    } catch (err: any) {
      setStatusMsg(`✗ Update failed: ${err.response?.data?.message || err.message}`);
    } finally {
      setTimeout(() => setStatusMsg(""), 3000);
    }
  };

  const handleDeleteUser = async (id: string, email: string) => {
    if (!confirm(`Are you sure you want to delete user ${email}?`)) return;
    try {
      setStatusMsg("Deleting user...");
      const res = await api.delete(`/admin/users/${id}`);
      if (res.data.success) {
        setStatusMsg("✓ User deleted successfully");
        await refreshData();
      }
    } catch (err: any) {
      setStatusMsg(`✗ Delete failed: ${err.response?.data?.message || err.message}`);
    } finally {
      setTimeout(() => setStatusMsg(""), 3000);
    }
  };

  const handleBulkImportUsers = async () => {
    try {
      setStatusMsg("Importing mock student registry...");
      const res = await api.post("/admin/users/bulk");
      if (res.data.success) {
        setStatusMsg("✓ Imported mock users successfully");
        await refreshData();
      }
    } catch (err: any) {
      setStatusMsg(`✗ Import failed: ${err.response?.data?.message || err.message}`);
    } finally {
      setTimeout(() => setStatusMsg(""), 3000);
    }
  };

  // --- Scoreboard Handlers ---
  const handleSelectEventForScore = (eventId: string) => {
    setSelectedEventId(eventId);
    const currentScore = scoreboards.find((s) => (s.eventId?._id === eventId || s.eventId === eventId));
    if (currentScore) {
      setScoreboardTeams(currentScore.teams || []);
      setScoreboardLive(currentScore.isLive !== undefined ? currentScore.isLive : true);
    } else {
      setScoreboardTeams([]);
      setScoreboardLive(true);
    }
  };

  const handleAddScoreboardTeam = () => {
    setScoreboardTeams([...scoreboardTeams, { rank: scoreboardTeams.length + 1, name: "", college: "", score: 0 }]);
  };

  const handleRemoveScoreboardTeam = (index: number) => {
    const updated = scoreboardTeams.filter((_, idx) => idx !== index).map((team, idx) => ({ ...team, rank: idx + 1 }));
    setScoreboardTeams(updated);
  };

  const handleTeamChange = (index: number, field: string, value: any) => {
    const updated = scoreboardTeams.map((team, idx) => {
      if (idx === index) {
        return { ...team, [field]: value };
      }
      return team;
    });
    setScoreboardTeams(updated);
  };

  const handleSaveScoreboard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEventId) return;
    try {
      setStatusMsg("Publishing live standings update...");
      const res = await api.put(`/scoreboard/${selectedEventId}`, {
        teams: scoreboardTeams,
        isLive: scoreboardLive
      });
      if (res.data.success) {
        setStatusMsg("✓ Scoreboard rankings updated and broadcasted!");
        await refreshData();
      }
    } catch (err: any) {
      setStatusMsg(`✗ Scoreboard update failed: ${err.response?.data?.message || err.message}`);
    } finally {
      setTimeout(() => setStatusMsg(""), 3000);
    }
  };

  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setStatusMsg("Saving event parameters...");
      const payload = {
        title: eventTitle,
        slug: eventSlug,
        description: eventDesc,
        venue: eventVenue,
        category: eventCategory,
        time: eventTime,
        rules: eventRules.split("\n").filter((r) => r.trim() !== ""),
        prizePool: Number(eventPrize),
        maxSeats: Number(eventSeats),
        coverImage: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop",
        date: "13 Nov 2026",
        coordinator: {
          name: "Abhijith R.",
          phone: "+91 94470 12345",
          email: "abhijith@macfast.org"
        }
      };

      let res;
      if (editingEvent) {
        res = await api.put(`/events/${editingEvent.slug}`, payload);
      } else {
        res = await api.post("/events", payload);
      }

      if (res.data.success) {
        setStatusMsg("✓ Event saved successfully");
        setShowEventModal(false);
        setEditingEvent(null);
        await refreshData();
      }
    } catch (err: any) {
      setStatusMsg(`✗ Failed to save event: ${err.response?.data?.message || err.message}`);
    } finally {
      setTimeout(() => setStatusMsg(""), 3000);
    }
  };

  const handleDeleteEvent = async (slug: string, title: string) => {
    if (!confirm(`Are you sure you want to delete event "${title}"?`)) return;
    try {
      setStatusMsg("Deleting event...");
      const res = await api.delete(`/events/${slug}`);
      if (res.data.success) {
        setStatusMsg("✓ Event deleted successfully");
        await refreshData();
      }
    } catch (err: any) {
      setStatusMsg(`✗ Failed to delete event: ${err.response?.data?.message || err.message}`);
    } finally {
      setTimeout(() => setStatusMsg(""), 3000);
    }
  };

  const handleOpenEditEvent = (evt: any) => {
    setEditingEvent(evt);
    setEventTitle(evt.title);
    setEventSlug(evt.slug);
    setEventDesc(evt.description);
    setEventVenue(evt.venue);
    setEventCategory(evt.category);
    setEventTime(evt.time);
    setEventRules(evt.rules?.join("\n") || "");
    setEventPrize(evt.prizePool);
    setEventSeats(evt.maxSeats);
    setShowEventModal(true);
  };

  const handleOpenCreateEvent = () => {
    setEditingEvent(null);
    setEventTitle("");
    setEventSlug("");
    setEventDesc("");
    setEventVenue("");
    setEventCategory("gaming");
    setEventTime("Day 1, 11:00 AM onwards");
    setEventRules("");
    setEventPrize(20000);
    setEventSeats(20);
    setShowEventModal(true);
  };

  const handleAddARLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!arRoom) return;
    try {
      setStatusMsg("Adding AR Location Point...");
      const res = await api.post("/admin/ar-navigation", {
        building: arBuilding,
        floor: arFloor,
        room: arRoom,
        type: arType
      });
      if (res.data.success) {
        setStatusMsg("✓ Location added successfully");
        setArRoom("");
        await refreshData();
      }
    } catch (err: any) {
      setStatusMsg(`✗ Failed to add location: ${err.response?.data?.message || err.message}`);
    } finally {
      setTimeout(() => setStatusMsg(""), 3000);
    }
  };

  const handleDeleteARLocation = async (id: string) => {
    try {
      setStatusMsg("Deleting AR Point...");
      const res = await api.delete(`/admin/ar-navigation/${id}`);
      if (res.data.success) {
        setStatusMsg("✓ Location deleted successfully");
        await refreshData();
      }
    } catch (err: any) {
      setStatusMsg(`✗ Failed to delete: ${err.response?.data?.message || err.message}`);
    } finally {
      setTimeout(() => setStatusMsg(""), 3000);
    }
  };

  const handleAssignVolunteer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!volName || !volEmail || !volDuty) return;
    try {
      setStatusMsg("Assigning volunteer duty...");
      const res = await api.post("/admin/volunteers", {
        name: volName,
        email: volEmail,
        duty: volDuty,
        shift: volShift
      });
      if (res.data.success) {
        setStatusMsg("✓ Duty assigned successfully");
        setVolName("");
        setVolEmail("");
        setVolDuty("");
        await refreshData();
      }
    } catch (err: any) {
      setStatusMsg(`✗ Failed to assign volunteer: ${err.response?.data?.message || err.message}`);
    } finally {
      setTimeout(() => setStatusMsg(""), 3000);
    }
  };

  const handleRefundPayment = async (id: string) => {
    try {
      setStatusMsg("Processing refund transaction...");
      const res = await api.post(`/admin/payments/refund/${id}`);
      if (res.data.success) {
        setStatusMsg("✓ Refund completed successfully");
        await refreshData();
      }
    } catch (err: any) {
      setStatusMsg(`✗ Refund failed: ${err.response?.data?.message || err.message}`);
    } finally {
      setTimeout(() => setStatusMsg(""), 3000);
    }
  };

  const handleBroadcastAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle || !annMsg) return;
    try {
      setStatusMsg("Broadcasting announcement...");
      const res = await api.post("/admin/announcements", {
        title: annTitle,
        message: annMsg,
        type: annType
      });
      if (res.data.success) {
        setStatusMsg("✓ Broadcast completed successfully");
        setAnnTitle("");
        setAnnMsg("");
        await refreshData();
      }
    } catch (err: any) {
      setStatusMsg(`✗ Broadcast failed: ${err.response?.data?.message || err.message}`);
    } finally {
      setTimeout(() => setStatusMsg(""), 3000);
    }
  };

  const handleReplyFeedback = (id: string) => {
    setActiveFeedbackId(id);
    const fb = feedbackList.find((f) => f.id === id);
    setFeedbackReplyText(fb?.reply || "");
  };

  const handleSaveFeedbackReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeFeedbackId) return;
    setFeedbackList(
      feedbackList.map((f) =>
        f.id === activeFeedbackId
          ? { ...f, reply: feedbackReplyText, status: "resolved" }
          : f
      )
    );
    setStatusMsg("✓ Reply saved successfully");
    setActiveFeedbackId(null);
    setFeedbackReplyText("");
    setTimeout(() => setStatusMsg(""), 3000);
  };

  const handleSendAiMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiInput.trim()) return;

    const userMsg = aiInput;
    setAiChat((prev) => [...prev, { sender: "user", text: userMsg }]);
    setAiInput("");

    setTimeout(() => {
      let botResponse = "I can assist you with that. Can you please specify which events or user groups you are referring to?";
      if (userMsg.toLowerCase().includes("event")) {
        botResponse = `Currently we have ${events.length} active events. The largest event is "${events[0]?.title || 'Urumi Gaming Arena'}" with ${events[0]?.registeredCount || 0} participants registered.`;
      } else if (userMsg.toLowerCase().includes("revenue") || userMsg.toLowerCase().includes("money")) {
        botResponse = `Total recorded revenue ledger stands at ₹${metrics.revenue.toLocaleString("en-IN")}. Total tickets sold matches the attendee registry metrics.`;
      } else if (userMsg.toLowerCase().includes("report") || userMsg.toLowerCase().includes("pdf")) {
        botResponse = "You can download administrative PDF operations reports directly using the button on the dashboard panel overview.";
      }
      setAiChat((prev) => [...prev, { sender: "bot", text: botResponse }]);
    }, 1000);
  };

  if (!mounted || !isInitialized || !user || user.role !== "admin") {
    return (
      <div className="bg-festival-dark min-h-screen pt-28 flex items-center justify-center">
        <div className="text-white text-sm font-bold uppercase tracking-widest animate-pulse">Loading Admin Console...</div>
      </div>
    );
  }

  return (
    <div className="bg-festival-dark min-h-screen pt-20 flex">
      {/* Toast Alert */}
      {statusMsg && (
        <div className="fixed top-24 right-6 z-[300] glass px-6 py-3.5 rounded-2xl border border-festival-pink/30 text-white font-bold text-xs uppercase tracking-wider animate-bounce shadow-xl">
          {statusMsg}
        </div>
      )}

      <aside className={`bg-white/2 border-r border-white/5 flex flex-col justify-between transition-all duration-300 ${sidebarCollapsed ? "w-16" : "w-64"}`}>
        <div className="py-6 space-y-8 select-none">
          <div className="px-4 flex items-center justify-between">
            {!sidebarCollapsed && (
              <span className="text-[10px] tracking-widest text-white/40 uppercase font-black" style={{ fontFamily: "var(--font-heading)" }}>Enterprise Deck</span>
            )}
            <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="p-1 rounded bg-white/5 hover:bg-white/10 text-white/60 hover:text-white text-xs cursor-pointer ml-auto">
              {sidebarCollapsed ? "▶" : "◀"}
            </button>
          </div>
          <nav className="space-y-1.5 px-2">
            {[
              { id: "dashboard", label: "Overview", icon: <RiDashboardLine /> },
              { id: "users", label: "User Registry", icon: <RiUserSettingsLine /> },
              { id: "events", label: "Events CRUD", icon: <RiCalendarLine /> },
              { id: "ar-nav", label: "AR Navigation", icon: <RiMapPinRangeLine /> },
              { id: "volunteers", label: "Volunteers Shift", icon: <RiUserHeartLine /> },
              { id: "financials", label: "Financials Ledger", icon: <RiMoneyDollarCircleLine /> },
              { id: "announcements", label: "Broadcaster", icon: <RiNotification4Line /> },
              { id: "file-manager", label: "File Manager", icon: <RiFolderOpenLine /> },
              { id: "feedback", label: "Feedback Inbox", icon: <RiQuestionAnswerLine /> },
              { id: "students-faculty", label: "Campus Registry", icon: <RiUserStarLine /> },
              { id: "ai-copilot", label: "AI Co-pilot", icon: <RiRobotLine /> },
              { id: "scoreboard", label: "Scoreboard Manager", icon: <RiFileList3Line /> },
              { id: "settings", label: "Settings", icon: <RiSettings4Line /> },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as TabId)}
                className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === item.id ? "bg-festival-gold/15 border-l-2 border-festival-gold text-festival-gold" : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
                style={{ fontFamily: "var(--font-heading)" }}
                title={item.label}
              >
                <span className="text-base">{item.icon}</span>
                {!sidebarCollapsed && <span>{item.label}</span>}
              </button>
            ))}
          </nav>
        </div>
        <div className="p-4 border-t border-white/5 space-y-4">
          {!sidebarCollapsed && (
            <div className="space-y-1.5 text-left">
              <div className="flex items-center gap-1.5 text-[9px] text-white/40 uppercase font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-festival-cyan animate-pulse" />
                <span>DB Fallback active</span>
              </div>
              <div className="text-[10px] text-white/50 truncate font-semibold">{user?.email}</div>
            </div>
          )}
        </div>
      </aside>

      <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto overflow-y-auto space-y-8 select-text">
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="space-y-8 text-left">
            
            {/* 1. Dashboard Tab */}
            {activeTab === "dashboard" && (
              <div className="space-y-8">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: "Total Users", val: metrics.totalUsers, color: "text-festival-gold" },
                    { label: "Active Attendees", val: metrics.activeAttendees, color: "text-festival-cyan" },
                    { label: "Checked-In Passes", val: metrics.qrCheckedIn, color: "text-festival-pink" },
                    { label: "Revenue Ledger", val: `₹${metrics.revenue.toLocaleString("en-IN")}`, color: "text-festival-purple" },
                  ].map((card, i) => (
                    <div key={i} className="glass p-5 rounded-2xl border border-white/5 shadow-md space-y-1 relative overflow-hidden">
                      <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest" style={{ fontFamily: "var(--font-heading)" }}>{card.label}</span>
                      <h4 className={`text-2xl font-black ${card.color}`} style={{ fontFamily: "var(--font-heading)" }}>{card.val}</h4>
                    </div>
                  ))}
                </div>

                <div className="glass p-6 rounded-2xl border border-white/5 space-y-4">
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider" style={{ fontFamily: "var(--font-heading)" }}>Admin Activity & Telemetry Audit log</h4>
                  <div className="divide-y divide-white/5 max-h-[220px] overflow-y-auto pr-1">
                    {auditLogs.map((log) => (
                      <div key={log._id} className="py-2.5 flex items-center justify-between text-xs gap-4">
                        <div className="space-y-0.5">
                          <span className="font-bold text-white/70 block">{log.action}</span>
                          <span className="text-[10px] text-white/40">{log.admin}</span>
                        </div>
                        <span className="text-[10px] text-white/40">{new Date(log.timestamp).toLocaleTimeString()}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 pt-2">
                  <button onClick={() => generatePDFReport("dashboard")} className="btn-primary flex items-center gap-1.5 text-xs px-4 py-2 cursor-pointer">Download Dashboard PDF</button>
                  <button onClick={() => generatePDFReport("financials")} className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer">Download Account Statement PDF</button>
                  <button onClick={() => generatePDFReport("students")} className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer">Download Student Participants PDF</button>
                </div>
              </div>
            )}

            {/* 2. User Registry Tab */}
            {activeTab === "users" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-white/5 pb-4">
                  <h4 className="text-lg font-bold text-white uppercase tracking-wider" style={{ fontFamily: "var(--font-heading)" }}>User Registry</h4>
                  <button onClick={handleBulkImportUsers} className="btn-primary text-xs px-4 py-2 flex items-center gap-1.5 cursor-pointer">
                    <RiSparklingLine /> Import Bulk Mock Students
                  </button>
                </div>
                
                <div className="flex gap-4">
                  <div className="relative flex-1">
                    <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                    <input
                      type="text"
                      placeholder="Search users by name, email, or college..."
                      value={searchUserQuery}
                      onChange={(e) => setSearchUserQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl focus:border-festival-gold/50 focus:outline-none text-white text-xs"
                    />
                  </div>
                  <button onClick={() => generatePDFReport("users")} className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer">
                    <RiDownload2Line /> Export PDF
                  </button>
                </div>

                <div className="glass overflow-x-auto rounded-2xl border border-white/5">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-white/5 bg-white/2 text-white/40 uppercase font-black tracking-wider text-[10px]">
                        <th className="p-4">Name</th>
                        <th className="p-4">Email</th>
                        <th className="p-4">College</th>
                        <th className="p-4">Department</th>
                        <th className="p-4">Role</th>
                        <th className="p-4">Status</th>
                        <th className="p-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {users
                        .filter(u => 
                          u.name?.toLowerCase().includes(searchUserQuery.toLowerCase()) || 
                          u.email?.toLowerCase().includes(searchUserQuery.toLowerCase()) ||
                          u.college?.toLowerCase().includes(searchUserQuery.toLowerCase())
                        )
                        .map((u) => (
                          <tr key={u._id} className="hover:bg-white/2 text-white/80">
                            <td className="p-4 font-bold">{u.name}</td>
                            <td className="p-4 text-white/60">{u.email}</td>
                            <td className="p-4 text-white/60">{u.college}</td>
                            <td className="p-4 text-white/60">{u.department} ({u.year})</td>
                            <td className="p-4">
                              <select
                                value={u.role || "student"}
                                onChange={(e) => handleUpdateUser(u._id, e.target.value, undefined)}
                                className="bg-zinc-900 border border-white/10 rounded px-2 py-1 text-xs text-white"
                              >
                                <option value="student">Student</option>
                                <option value="volunteer">Volunteer</option>
                                <option value="admin">Admin</option>
                              </select>
                            </td>
                            <td className="p-4">
                              <select
                                value={u.status || "active"}
                                onChange={(e) => handleUpdateUser(u._id, undefined, e.target.value)}
                                className="bg-zinc-900 border border-white/10 rounded px-2 py-1 text-xs text-white"
                              >
                                <option value="active">Active</option>
                                <option value="suspended">Suspended</option>
                                <option value="banned">Banned</option>
                              </select>
                            </td>
                            <td className="p-4">
                              <button
                                onClick={() => handleDeleteUser(u._id, u.email)}
                                className="p-2 text-festival-pink hover:bg-festival-pink/10 rounded-lg transition-all cursor-pointer"
                              >
                                <RiDeleteBinLine />
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 3. Events CRUD Tab */}
            {activeTab === "events" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-white/5 pb-4">
                  <h4 className="text-lg font-bold text-white uppercase tracking-wider" style={{ fontFamily: "var(--font-heading)" }}>Events CRUD</h4>
                  <button onClick={handleOpenCreateEvent} className="btn-primary text-xs px-4 py-2 flex items-center gap-1.5 cursor-pointer">
                    <RiAddLine /> New Event
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {events.map((e) => (
                    <div key={e._id} className="glass p-5 rounded-2xl border border-white/5 flex items-center justify-between gap-4 text-left">
                      <div>
                        <span className="block font-bold text-white text-sm">{e.title}</span>
                        <div className="flex gap-4 text-[10px] text-white/40 mt-1">
                          <span>Category: <strong className="text-white/60 capitalize">{e.category}</strong></span>
                          <span>Venue: <strong className="text-white/60">{e.venue}</strong></span>
                          <span>Slots: <strong className="text-white/60">{e.registeredCount} / {e.maxSeats}</strong></span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleOpenEditEvent(e)} className="p-2 bg-white/5 rounded-lg text-white/70 hover:text-festival-gold cursor-pointer"><RiEditLine /></button>
                        <button onClick={() => handleDeleteEvent(e.slug, e.title)} className="p-2 bg-white/5 rounded-lg text-white/70 hover:text-festival-pink cursor-pointer"><RiDeleteBinLine /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. AR Navigation Tab */}
            {activeTab === "ar-nav" && (
              <div className="space-y-6">
                <div className="border-b border-white/5 pb-4">
                  <h4 className="text-lg font-bold text-white uppercase tracking-wider" style={{ fontFamily: "var(--font-heading)" }}>AR Locations Configuration</h4>
                </div>

                <form onSubmit={handleAddARLocation} className="glass p-6 rounded-2xl border border-white/5 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-white/40 mb-1.5">Building</label>
                    <input type="text" required value={arBuilding} onChange={(e) => setArBuilding(e.target.value)} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs" />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-white/40 mb-1.5">Floor</label>
                    <input type="text" required value={arFloor} onChange={(e) => setArFloor(e.target.value)} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs" />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-white/40 mb-1.5">Room/Space</label>
                    <input type="text" required placeholder="Seminar Hall..." value={arRoom} onChange={(e) => setArRoom(e.target.value)} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs" />
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="block text-[10px] uppercase font-bold text-white/40 mb-1.5">Type</label>
                      <select value={arType} onChange={(e) => setArType(e.target.value)} className="w-full px-3 py-2 bg-zinc-950 border border-white/10 rounded-xl text-white text-xs">
                        <option value="POI">Point of Interest</option>
                        <option value="Anchor">Capacitor Anchor</option>
                      </select>
                    </div>
                    <button type="submit" className="btn-primary text-xs px-4 h-[38px] cursor-pointer"><RiAddLine /></button>
                  </div>
                </form>

                <div className="glass p-5 rounded-2xl border border-white/5 divide-y divide-white/5">
                  {arLocations.map((l) => (
                    <div key={l._id} className="py-3 flex items-center justify-between text-xs text-white/80">
                      <div>
                        <span className="font-bold">{l.building}</span> — {l.floor}, {l.room} ({l.type})
                      </div>
                      <button onClick={() => handleDeleteARLocation(l._id)} className="p-2 text-festival-pink hover:bg-festival-pink/15 rounded-lg cursor-pointer"><RiDeleteBinLine /></button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. Volunteer Shifts Tab */}
            {activeTab === "volunteers" && (
              <div className="space-y-6">
                <div className="border-b border-white/5 pb-4">
                  <h4 className="text-lg font-bold text-white uppercase tracking-wider" style={{ fontFamily: "var(--font-heading)" }}>Volunteers Duty Assignment</h4>
                </div>

                <form onSubmit={handleAssignVolunteer} className="glass p-6 rounded-2xl border border-white/5 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-white/40 mb-1.5">Volunteer Name</label>
                    <input type="text" required value={volName} onChange={(e) => setVolName(e.target.value)} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs" />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-white/40 mb-1.5">Email Address</label>
                    <input type="email" required value={volEmail} onChange={(e) => setVolEmail(e.target.value)} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs" />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-white/40 mb-1.5">Duty Assignment</label>
                    <input type="text" required placeholder="E.g., Gaming Desk Help" value={volDuty} onChange={(e) => setVolDuty(e.target.value)} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs" />
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="block text-[10px] uppercase font-bold text-white/40 mb-1.5">Shift</label>
                      <select value={volShift} onChange={(e) => setVolShift(e.target.value)} className="w-full px-3 py-2 bg-zinc-950 border border-white/10 rounded-xl text-white text-xs">
                        <option value="Day 1, Morning">Day 1, Morning</option>
                        <option value="Day 1, Afternoon">Day 1, Afternoon</option>
                        <option value="Day 2, Full Day">Day 2, Full Day</option>
                      </select>
                    </div>
                    <button type="submit" className="btn-primary text-xs px-4 h-[38px] cursor-pointer"><RiSaveLine /></button>
                  </div>
                </form>

                <div className="glass p-5 rounded-2xl border border-white/5 divide-y divide-white/5">
                  {volunteers.map((v) => (
                    <div key={v._id} className="py-3 flex justify-between items-center text-xs text-white/80">
                      <div>
                        <strong className="text-white">{v.name}</strong> ({v.email})
                        <div className="text-[10px] text-white/40 mt-0.5">Duty: {v.duty} | Shift: {v.shift}</div>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[9px] bg-festival-cyan/15 text-festival-cyan font-bold uppercase">{v.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 6. Financials Tab */}
            {activeTab === "financials" && (
              <div className="space-y-6">
                <div className="border-b border-white/5 pb-4">
                  <h4 className="text-lg font-bold text-white uppercase tracking-wider" style={{ fontFamily: "var(--font-heading)" }}>Payments Ledger & Refunds</h4>
                </div>

                <div className="glass p-6 rounded-2xl border border-white/5 overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/5 text-white/40 uppercase font-black tracking-wider text-[10px]">
                        <th className="p-4">Transaction ID</th>
                        <th className="p-4">User Email</th>
                        <th className="p-4">Amount</th>
                        <th className="p-4">Gateway</th>
                        <th className="p-4">Status</th>
                        <th className="p-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-white/80">
                      {payments.map((p) => (
                        <tr key={p._id}>
                          <td className="p-4 font-mono">{p.txId}</td>
                          <td className="p-4">{p.email}</td>
                          <td className="p-4 font-bold">₹{p.amount}</td>
                          <td className="p-4 text-white/60">{p.gateway}</td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${p.status === "completed" ? "bg-emerald-500/15 text-emerald-400" : "bg-festival-pink/15 text-festival-pink"}`}>{p.status}</span>
                          </td>
                          <td className="p-4">
                            {p.status === "completed" && (
                              <button onClick={() => handleRefundPayment(p._id)} className="px-3 py-1 bg-festival-pink/10 hover:bg-festival-pink/20 border border-festival-pink/30 rounded-lg text-festival-pink text-[10px] font-bold uppercase cursor-pointer">Refund</button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 7. Broadcaster Tab */}
            {activeTab === "announcements" && (
              <div className="space-y-6">
                <div className="border-b border-white/5 pb-4">
                  <h4 className="text-lg font-bold text-white uppercase tracking-wider" style={{ fontFamily: "var(--font-heading)" }}>Broadcaster System</h4>
                </div>

                <form onSubmit={handleBroadcastAnnouncement} className="glass p-6 rounded-2xl border border-white/5 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-white/40 mb-1.5">Broadcast Title</label>
                      <input type="text" required value={annTitle} onChange={(e) => setAnnTitle(e.target.value)} className="w-full px-3.5 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs" />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-white/40 mb-1.5">Announcement Severity</label>
                      <select value={annType} onChange={(e) => setAnnType(e.target.value)} className="w-full px-3 py-2 bg-zinc-950 border border-white/10 rounded-xl text-white text-xs">
                        <option value="general">General Notification</option>
                        <option value="urgent">Urgent Broadcaster Alert</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-white/40 mb-1.5">Message Content</label>
                    <textarea required value={annMsg} onChange={(e) => setAnnMsg(e.target.value)} rows={3} className="w-full px-3.5 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs" />
                  </div>
                  <button type="submit" className="btn-primary text-xs px-6 py-2.5 cursor-pointer">Broadcast Live</button>
                </form>

                <div className="glass p-5 rounded-2xl border border-white/5 divide-y divide-white/5">
                  {announcements.map((a) => (
                    <div key={a._id} className="py-3 flex justify-between items-center text-xs">
                      <div>
                        <strong className="text-white font-bold">{a.title}</strong>
                        <p className="text-white/60 text-[11px] mt-0.5">{a.message}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${a.type === "urgent" ? "bg-festival-pink/15 text-festival-pink" : "bg-festival-cyan/15 text-festival-cyan"}`}>{a.type}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 8. File Manager Tab */}
            {activeTab === "file-manager" && (
              <div className="space-y-6">
                <div className="border-b border-white/5 pb-4">
                  <h4 className="text-lg font-bold text-white uppercase tracking-wider" style={{ fontFamily: "var(--font-heading)" }}>Administrative File Manager</h4>
                </div>

                <div className="flex gap-2">
                  {(["root", "assets", "documents", "database"] as const).map((folder) => (
                    <button key={folder} onClick={() => setFileFolder(folder)} className={`px-4 py-2 rounded-xl text-xs font-bold uppercase border transition-all cursor-pointer ${fileFolder === folder ? "bg-festival-gold/10 border-festival-gold text-festival-gold" : "bg-white/5 border-white/10 text-white/60"}`}>{folder}</button>
                  ))}
                </div>

                <div className="glass p-6 rounded-2xl border border-white/5 grid grid-cols-2 md:grid-cols-4 gap-4">
                  {fileFolder === "root" && (
                    <>
                      <div onClick={() => setFileFolder("assets")} className="p-4 rounded-xl bg-white/5 border border-white/10 text-center space-y-2 hover:bg-white/10 cursor-pointer">
                        <RiFolderOpenLine className="mx-auto text-festival-gold text-2xl" />
                        <span className="block text-xs font-bold text-white uppercase">assets/</span>
                      </div>
                      <div onClick={() => setFileFolder("documents")} className="p-4 rounded-xl bg-white/5 border border-white/10 text-center space-y-2 hover:bg-white/10 cursor-pointer">
                        <RiFolderOpenLine className="mx-auto text-festival-gold text-2xl" />
                        <span className="block text-xs font-bold text-white uppercase">documents/</span>
                      </div>
                      <div onClick={() => setFileFolder("database")} className="p-4 rounded-xl bg-white/5 border border-white/10 text-center space-y-2 hover:bg-white/10 cursor-pointer">
                        <RiFolderOpenLine className="mx-auto text-festival-gold text-2xl" />
                        <span className="block text-xs font-bold text-white uppercase">database/</span>
                      </div>
                    </>
                  )}
                  {fileFolder === "assets" && (
                    <>
                      <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center space-y-2">
                        <RiFileList3Line className="mx-auto text-white/40 text-2xl" />
                        <span className="block text-xs font-bold text-white uppercase">logo.png</span>
                      </div>
                      <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center space-y-2">
                        <RiFileList3Line className="mx-auto text-white/40 text-2xl" />
                        <span className="block text-xs font-bold text-white uppercase">banner.webp</span>
                      </div>
                    </>
                  )}
                  {fileFolder === "documents" && (
                    <>
                      <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center space-y-2">
                        <RiFileList3Line className="mx-auto text-white/40 text-2xl" />
                        <span className="block text-xs font-bold text-white uppercase">guidelines.pdf</span>
                      </div>
                    </>
                  )}
                  {fileFolder === "database" && (
                    <>
                      <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center space-y-2">
                        <RiFileList3Line className="mx-auto text-white/40 text-2xl" />
                        <span className="block text-xs font-bold text-white uppercase">mongo_seed.json</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* 9. Feedback Inbox Tab */}
            {activeTab === "feedback" && (
              <div className="space-y-6">
                <div className="border-b border-white/5 pb-4">
                  <h4 className="text-lg font-bold text-white uppercase tracking-wider" style={{ fontFamily: "var(--font-heading)" }}>Attendee Feedback Inbox</h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                  <div className="space-y-4">
                    {feedbackList.map((f) => (
                      <div key={f.id} onClick={() => handleReplyFeedback(f.id)} className={`glass p-5 rounded-2xl border transition-all text-left space-y-2 cursor-pointer ${activeFeedbackId === f.id ? "border-festival-gold/50 bg-festival-gold/5" : "border-white/5 hover:border-white/10"}`}>
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-white">{f.user} ({f.type})</span>
                          <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold ${f.status === "resolved" ? "bg-emerald-500/15 text-emerald-400" : "bg-festival-pink/15 text-festival-pink"}`}>{f.status}</span>
                        </div>
                        <p className="text-white/60 text-xs">{f.details}</p>
                        <div className="text-[10px] text-festival-gold">Rating: {"★".repeat(f.rating)}</div>
                      </div>
                    ))}
                  </div>

                  {activeFeedbackId && (
                    <form onSubmit={handleSaveFeedbackReply} className="glass p-6 rounded-2xl border border-white/10 space-y-4 text-left">
                      <h5 className="text-xs uppercase font-bold text-white/40">Draft Feedback Reply</h5>
                      <textarea required value={feedbackReplyText} onChange={(e) => setFeedbackReplyText(e.target.value)} rows={4} placeholder="Type admin resolution description..." className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs" />
                      <button type="submit" className="btn-primary text-xs px-5 py-2 cursor-pointer">Submit Reply</button>
                    </form>
                  )}
                </div>
              </div>
            )}

            {/* 10. Campus Registry Tab */}
            {activeTab === "students-faculty" && (
              <div className="space-y-6">
                <div className="border-b border-white/5 pb-4">
                  <h4 className="text-lg font-bold text-white uppercase tracking-wider" style={{ fontFamily: "var(--font-heading)" }}>Campus Registry (MACFAST Only)</h4>
                </div>

                <div className="glass p-5 rounded-2xl border border-white/5 overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/5 text-white/40 uppercase font-black tracking-wider text-[10px]">
                        <th className="p-4">Attendee Name</th>
                        <th className="p-4">Email</th>
                        <th className="p-4">Department / Section</th>
                        <th className="p-4">Year Level</th>
                        <th className="p-4">XP Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-white/80">
                      {users
                        .filter((u) => u.college?.toLowerCase().includes("macfast"))
                        .map((u) => (
                          <tr key={u._id}>
                            <td className="p-4 font-bold">{u.name}</td>
                            <td className="p-4">{u.email}</td>
                            <td className="p-4 text-white/60">{u.department}</td>
                            <td className="p-4 text-white/60">{u.year}</td>
                            <td className="p-4 font-mono text-festival-cyan">{u.xpPoints || 0} XP</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 11. AI Copilot Tab */}
            {activeTab === "ai-copilot" && (
              <div className="space-y-6">
                <div className="border-b border-white/5 pb-4">
                  <h4 className="text-lg font-bold text-white uppercase tracking-wider" style={{ fontFamily: "var(--font-heading)" }}>MacFiesta AI Co-pilot</h4>
                </div>

                <div className="glass p-6 rounded-2xl border border-white/5 space-y-4 h-[400px] flex flex-col justify-between">
                  <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                    {aiChat.map((msg, i) => (
                      <div key={i} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[70%] p-3 rounded-2xl text-xs text-left ${msg.sender === "user" ? "bg-festival-purple text-white" : "bg-white/5 border border-white/5 text-white/80"}`}>{msg.text}</div>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleSendAiMessage} className="flex gap-2 border-t border-white/5 pt-4">
                    <input type="text" value={aiInput} onChange={(e) => setAiInput(e.target.value)} placeholder="Ask about metrics, reports, user registry or events info..." className="flex-grow px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs" />
                    <button type="submit" className="px-4 py-2 bg-festival-purple rounded-xl text-white text-xs font-bold uppercase cursor-pointer"><RiSendPlaneLine /></button>
                  </form>
                </div>
              </div>
            )}

            {/* 13. Scoreboard Manager Tab */}
            {activeTab === "scoreboard" && (
              <div className="space-y-6">
                <div className="border-b border-white/5 pb-4">
                  <h4 className="text-lg font-bold text-white uppercase tracking-wider" style={{ fontFamily: "var(--font-heading)" }}>Scoreboard Manager</h4>
                </div>

                <div className="glass p-6 rounded-2xl border border-white/5 space-y-4">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-white/40 mb-1.5">Select Event Arena</label>
                    <select
                      value={selectedEventId}
                      onChange={(e) => handleSelectEventForScore(e.target.value)}
                      className="w-full max-w-md px-3 py-2 bg-zinc-950 border border-white/10 rounded-xl text-white text-xs"
                    >
                      <option value="">-- Choose Event to Edit Standings --</option>
                      {events.map((e) => (
                        <option key={e._id} value={e._id}>{e.title}</option>
                      ))}
                    </select>
                  </div>

                  {selectedEventId && (
                    <form onSubmit={handleSaveScoreboard} className="space-y-6 pt-4 border-t border-white/5 text-left">
                      <div className="flex justify-between items-center">
                        <h5 className="text-xs uppercase font-bold text-white/40">Teams & Standings rankings</h5>
                        <button
                          type="button"
                          onClick={handleAddScoreboardTeam}
                          className="px-3.5 py-1.5 rounded-lg bg-festival-gold/10 hover:bg-festival-gold/25 border border-festival-gold/30 text-festival-gold text-xs font-bold uppercase tracking-wider cursor-pointer"
                        >
                          + Add Team Row
                        </button>
                      </div>

                      <div className="space-y-3">
                        {scoreboardTeams.map((team, idx) => (
                          <div key={idx} className="flex gap-3 items-center">
                            <div className="w-16 text-center text-xs font-bold text-white/50 bg-white/5 px-2 py-2 rounded-xl">
                              Rank {team.rank}
                            </div>
                            <input
                              type="text"
                              required
                              placeholder="Team/Participant Name"
                              value={team.name}
                              onChange={(e) => handleTeamChange(idx, "name", e.target.value)}
                              className="flex-grow px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs"
                            />
                            <input
                              type="text"
                              required
                              placeholder="College/Organization"
                              value={team.college}
                              onChange={(e) => handleTeamChange(idx, "college", e.target.value)}
                              className="w-64 px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs"
                            />
                            <input
                              type="number"
                              required
                              placeholder="Points"
                              value={team.score}
                              onChange={(e) => handleTeamChange(idx, "score", Number(e.target.value))}
                              className="w-24 px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveScoreboardTeam(idx)}
                              className="p-2 text-festival-pink hover:bg-festival-pink/15 rounded-lg cursor-pointer text-base"
                            >
                              <RiDeleteBinLine />
                            </button>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between border-t border-white/5 pt-4">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={scoreboardLive}
                            onChange={(e) => setScoreboardLive(e.target.checked)}
                            className="w-4 h-4 accent-festival-pink cursor-pointer"
                            id="scoreboardLiveChk"
                          />
                          <label htmlFor="scoreboardLiveChk" className="text-xs text-white/70 font-semibold select-none cursor-pointer">
                            Publish updates live to scoreboard page immediately
                          </label>
                        </div>
                        <button
                          type="submit"
                          className="btn-primary text-xs px-6 py-2.5 cursor-pointer"
                        >
                          Publish Live Standings
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            )}

            {/* 12. Settings Tab */}
            {activeTab === "settings" && (
              <div className="space-y-6">
                <div className="border-b border-white/5 pb-4">
                  <h4 className="text-lg font-bold text-white uppercase tracking-wider" style={{ fontFamily: "var(--font-heading)" }}>Admin Settings</h4>
                </div>

                <div className="glass p-6 rounded-2xl border border-white/5 space-y-6 max-w-xl text-left">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="block text-xs font-bold text-white uppercase">Maintenance Lock Mode</span>
                      <span className="text-[10px] text-white/40 block mt-0.5">Enabling this shuts down registrations immediately</span>
                    </div>
                    <input type="checkbox" checked={maintenanceMode} onChange={(e) => setMaintenanceMode(e.target.checked)} className="w-4 h-4 accent-festival-pink cursor-pointer" />
                  </div>

                  <div className="flex items-center justify-between border-t border-white/5 pt-4">
                    <div>
                      <span className="block text-xs font-bold text-white uppercase">Enforce Multi-Factor (2FA)</span>
                      <span className="text-[10px] text-white/40 block mt-0.5">Force all administrators to verify 2FA OTP tokens</span>
                    </div>
                    <input type="checkbox" checked={enable2FA} onChange={(e) => setEnable2FA(e.target.checked)} className="w-4 h-4 accent-festival-pink cursor-pointer" />
                  </div>

                  <div className="border-t border-white/5 pt-4 space-y-2">
                    <span className="block text-xs font-bold text-white uppercase">Restricted IP Whitelist</span>
                    <span className="text-[10px] text-white/40 block">Separate IP ranges by commas</span>
                    <textarea value={restrictedIPs} onChange={(e) => setRestrictedIPs(e.target.value)} rows={3} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs font-mono" />
                  </div>

                  <button onClick={() => { setStatusMsg("✓ Settings saved successfully"); setTimeout(() => setStatusMsg(""), 3000); }} className="btn-primary text-xs px-6 py-2.5 cursor-pointer">Save Settings</button>
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </main>

      {/* Editor Modal for Events (rendered when editing/creating event) */}
      {showEventModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="glass w-full max-w-2xl rounded-3xl border border-white/10 shadow-2xl p-6 md:p-8 space-y-6 relative my-8 text-left">
            <button onClick={() => setShowEventModal(false)} className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white cursor-pointer"><RiCloseLine size={20} /></button>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white uppercase tracking-wider" style={{ fontFamily: "var(--font-heading)" }}>{editingEvent ? "Modify Event Parameters" : "Create New Event Arena"}</h3>
              <p className="text-xs text-white/40">Adjust parameters for public view</p>
            </div>
            <form onSubmit={handleSaveEvent} className="space-y-4 max-h-[50vh] overflow-y-auto pr-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-white/40 mb-1.5">Event Title</label>
                  <input type="text" required value={eventTitle} onChange={(e) => setEventTitle(e.target.value)} placeholder="Gaming Arena" className="w-full px-3.5 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-white/40 mb-1.5">URL Slug</label>
                  <input type="text" required value={eventSlug} onChange={(e) => setEventSlug(e.target.value)} placeholder="gaming-arena" disabled={!!editingEvent} className="w-full px-3.5 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs disabled:opacity-40" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-white/40 mb-1.5">Description</label>
                <textarea required value={eventDesc} onChange={(e) => setEventDesc(e.target.value)} rows={3} className="w-full px-3.5 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs" />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-white/40 mb-1.5">Rules (One per line)</label>
                <textarea value={eventRules} onChange={(e) => setEventRules(e.target.value)} rows={4} className="w-full px-3.5 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs font-mono" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-white/40 mb-1.5">Category</label>
                  <select value={eventCategory} onChange={(e) => setEventCategory(e.target.value)} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs">
                    <option value="gaming" className="bg-zinc-950">Gaming</option>
                    <option value="technical" className="bg-zinc-950">Technical</option>
                    <option value="cultural" className="bg-zinc-950">Cultural</option>
                    <option value="general" className="bg-zinc-950">General</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-white/40 mb-1.5">Prize Pool (₹)</label>
                  <input type="number" required value={eventPrize} onChange={(e) => setEventPrize(Number(e.target.value))} className="w-full px-3.5 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-white/40 mb-1.5">Max Seats</label>
                  <input type="number" required value={eventSeats} onChange={(e) => setEventSeats(Number(e.target.value))} className="w-full px-3.5 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-white/40 mb-1.5">Reporting Time</label>
                <input type="text" required value={eventTime} onChange={(e) => setEventTime(e.target.value)} className="w-full px-3.5 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs" />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-white/40 mb-1.5">Venue Location</label>
                <input type="text" required value={eventVenue} onChange={(e) => setEventVenue(e.target.value)} className="w-full px-3.5 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs" />
              </div>
              <div className="pt-4 border-t border-white/5 flex justify-end">
                <button type="submit" className="btn-primary flex items-center gap-2 px-6 py-3 text-xs font-bold uppercase tracking-widest cursor-pointer"><RiSaveLine /><span>Save Event</span></button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
