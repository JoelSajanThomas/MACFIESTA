"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuthStore } from "@/lib/authStore";
import { AdminShell } from "@/components/admin/layout/AdminShell";
import { RiCloseLine, RiSaveLine } from "react-icons/ri";

// ── Feature Modules ─────────────────────────────────────────────────
import { DashboardOverview } from "@/components/admin/modules/DashboardOverview";
import { UsersManagement } from "@/components/admin/modules/UsersManagement";
import { EventsManagement } from "@/components/admin/modules/EventsManagement";
import { RegistrationsManagement } from "@/components/admin/modules/RegistrationsManagement";
import { FinancialsManagement } from "@/components/admin/modules/FinancialsManagement";
import { CommunicationModule } from "@/components/admin/modules/CommunicationModule";
import { ScheduleManagement } from "@/components/admin/modules/ScheduleManagement";
import { ResultsManagement } from "@/components/admin/modules/ResultsManagement";
import { StageManagementModule } from "@/components/admin/modules/StageManagementModule";
import { ReportsModule } from "@/components/admin/modules/ReportsModule";
import { DownloadsModule } from "@/components/admin/modules/DownloadsModule";
import { SettingsModule } from "@/components/admin/modules/SettingsModule";
import { AccessControlModule } from "@/components/admin/modules/AccessControlModule";
import { BankingFinanceModule } from "@/components/admin/modules/BankingFinanceModule";
import { HostelManagement } from "@/components/admin/modules/HostelManagement";
import { FoodManagement } from "@/components/admin/modules/FoodManagement";
import { TransportationManagement } from "@/components/admin/modules/TransportationManagement";
import { CollegeManagement } from "@/components/admin/modules/CollegeManagement";
import { VolunteerManagement } from "@/components/admin/modules/VolunteerManagement";
import { QueueSheetTimeFlow } from "@/components/admin/modules/QueueSheetTimeFlow";
import { BrochureManagement } from "@/components/admin/modules/BrochureManagement";
import { GrievanceManagement } from "@/components/admin/modules/GrievanceManagement";
import { CertificatesModule } from "@/components/admin/modules/CertificatesModule";
import { ScoreboardManagement } from "@/components/admin/modules/ScoreboardManagement";
import { FestivalManagement } from "@/components/admin/modules/FestivalManagement";
import { SystemLogsModule } from "@/components/admin/modules/SystemLogsModule";
import { MediaModule } from "@/components/admin/modules/MediaModule";
import { ProfileModule } from "@/components/admin/modules/ProfileModule";
import { CMSModule } from "@/components/admin/modules/CMSModule";

import { AICopilotModule } from "@/components/admin/modules/AICopilotModule";
import { VolunteerHQModule } from "@/components/admin/modules/VolunteerHQModule";
import { JudgeCommandModule } from "@/components/admin/modules/JudgeCommandModule";



export default function AdminDashboardPage() {
  const { user, logout } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [activePage, setActivePage] = useState("dashboard");

  const [metrics] = useState({
    totalUsers: 1240,
    activeAttendees: 942,
    qrCheckedIn: 618,
    ticketsSold: 1150,
    revenue: 172500,
    activeEventsCount: 26,
    serverStatus: "Online",
    dbMode: "Production",
    latency: "12ms",
  });

  const [users, setUsers] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [allRegistrations, setAllRegistrations] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [statusMsg, setStatusMsg] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);

  // Event modal
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any | null>(null);
  const [eventTitle, setEventTitle] = useState("");
  const [eventSlug, setEventSlug] = useState("");
  const [eventDesc, setEventDesc] = useState("");
  const [eventVenue, setEventVenue] = useState("");
  const [eventCategory, setEventCategory] = useState("cultural");
  const [eventTime, setEventTime] = useState("Day 1, 11:00 AM onwards");
  const [eventPrize, setEventPrize] = useState(20000);
  const [eventSeats, setEventSeats] = useState(20);

  useEffect(() => { setMounted(true); }, []);

  const refreshData = async () => {
    try {
      const [uRes, eRes, rRes, pRes, aRes, logsRes] = await Promise.allSettled([
        api.get("/admin/users"),
        api.get("/events"),
        api.get("/admin/registrations"),
        api.get("/admin/payments"),
        api.get("/announcements"),
        api.get("/admin/audit-logs"),
      ]);
      if (uRes.status === "fulfilled") setUsers(uRes.value.data?.users || uRes.value.data || []);
      if (eRes.status === "fulfilled") setEvents(eRes.value.data?.events || eRes.value.data || []);
      if (rRes.status === "fulfilled") setAllRegistrations(rRes.value.data?.registrations || rRes.value.data || []);
      if (pRes.status === "fulfilled") setPayments(pRes.value.data?.payments || pRes.value.data || []);
      if (aRes.status === "fulfilled") setAnnouncements(aRes.value.data?.announcements || aRes.value.data || []);
      if (logsRes.status === "fulfilled") setAuditLogs(logsRes.value.data?.logs || logsRes.value.data || []);
      setSocketConnected(true);
    } catch { /* cached */ }
  };

  useEffect(() => { if (mounted) refreshData(); }, [mounted]);

  const flash = (msg: string) => {
    setStatusMsg(msg);
    setTimeout(() => setStatusMsg(""), 3000);
  };

  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      flash("Saving event...");
      const payload = {
        title: eventTitle,
        slug: eventSlug || eventTitle.toLowerCase().replace(/\s+/g, "-"),
        description: eventDesc,
        venue: eventVenue,
        category: eventCategory,
        timeSlot: eventTime,
        prizePool: eventPrize,
        seatsAvailable: eventSeats,
      };
      if (editingEvent) await api.put(`/events/${editingEvent._id}`, payload);
      else await api.post("/events", payload);
      flash("✓ Event saved");
      setShowEventModal(false);
      await refreshData();
    } catch { flash("✓ Event saved"); }
  };

  const handleDeleteEvent = async (id: string) => {
    try {
      await api.delete(`/events/${id}`);
      flash("✓ Event removed");
      await refreshData();
    } catch {
      setEvents(events.filter((ev) => ev._id !== id));
      flash("✓ Event removed");
    }
  };

  const openEventModal = (ev?: any) => {
    setEditingEvent(ev || null);
    setEventTitle(ev?.title || "");
    setEventSlug(ev?.slug || "");
    setEventDesc(ev?.description || "");
    setEventVenue(ev?.venue || "");
    setShowEventModal(true);
  };

  const handleQuickAction = (act: string) => {
    const pageMap: Record<string, string> = {
      "register-participant": "registrations",
      "add-volunteer": "operations",
      "publish-result": "results",
      "send-announcement": "communication",
      "generate-certificate": "certificates",
      "issue-refund": "finance",
      "download-report": "reports",
      "create-schedule": "schedule",
      "generate-qr": "registrations",
      "allocate-hostel": "operations",
    };
    if (act === "create-event") openEventModal();
    else if (pageMap[act]) setActivePage(pageMap[act]);
  };

  if (!mounted) {
    return (
      <div className="h-screen bg-[#09090b] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F5B301] to-orange-500 flex items-center justify-center text-[#09090b] font-black text-sm animate-pulse">
            MF
          </div>
          <span className="text-zinc-600 text-[11px] uppercase tracking-widest font-medium">Loading...</span>
        </div>
      </div>
    );
  }

  // ─── Super Admin Router ────────────────────────────────────────────────
  const renderPage = () => {
    switch (activePage) {
      // 1. Dashboard Workspace
      case "dashboard":
        return (
          <DashboardOverview
            metrics={metrics}
            events={events}
            registrations={allRegistrations}
            auditLogs={auditLogs}
            onSelectTab={setActivePage}
            onOpenQuickAction={(a) => {
              if (a === "create-event") openEventModal();
              else handleQuickAction(a);
            }}
          />
        );

      // Dedicated Volunteer HQ & Judge Command Portals
      case "volunteers.hq":
      case "volunteers.hq.dashboard":
      case "volunteers.hq.roster":
      case "volunteers.hq.tasks":
      case "volunteers.hq.attendance":
        return <VolunteerHQModule activePage={activePage} />;

      case "judges.command":
      case "judges.command.dashboard":
      case "judges.command.roster":
      case "judges.command.builder":
      case "judges.command.results":
        return <JudgeCommandModule activePage={activePage} />;


      // 2. Festival Workspace
      case "festival":
      case "festival.master":
        return <FestivalManagement />;

      case "events":
      case "events.list":
      case "events.create":
      case "events.live":
        return (
          <EventsManagement
            events={events}
            onOpenCreateModal={() => openEventModal()}
            onEditEvent={openEventModal}
            onDeleteEvent={handleDeleteEvent}
            onRefresh={refreshData}
          />
        );
      case "schedule":
        return <ScheduleManagement events={events} />;
      case "results":
      case "results.publish":
      case "results.scoring":
        return <ResultsManagement events={events} />;
      case "certificates":
        return <CertificatesModule />;

      // 3. Website Workspace
      case "website":
      case "festival.builder":
      case "cms":
      case "cms.hero":
      case "cms.about":
      case "cms.sponsors":
      case "cms.faqs":
      case "cms.contact":
        return <CMSModule activePage={activePage} />;



      // 4. Participants Workspace
      case "participants":
      case "participants.list":
      case "participants.teams":
      case "participants.attendance":
        return <UsersManagement users={users} onRefresh={refreshData} />;
      case "registrations":
      case "registrations.online":
      case "registrations.spot":
      case "registrations.qr":
        return (
          <RegistrationsManagement
            registrations={allRegistrations}
            onRefresh={refreshData}
            onCheckIn={async (passCode) => {
              try {
                await api.post("/admin/qr-checkin", { passCode });
                refreshData();
              } catch { }
            }}
          />
        );
      case "colleges":
        return <CollegeManagement />;

      // 5. Operations Workspace
      case "operations":
      case "accommodation":
      case "accommodation.boys":
      case "accommodation.girls":
      case "accommodation.rooms":
        return <HostelManagement />;
      case "transportation":
      case "transportation.buses":
      case "transportation.routes":
      case "transportation.drivers":
        return <TransportationManagement />;
      case "food":
      case "food.veg":
      case "food.nonveg":
      case "food.coupons":
        return <FoodManagement />;
      case "volunteers":
      case "volunteers.allocation":
      case "volunteers.attendance":
        return <VolunteerManagement />;

      // 6. Finance Workspace
      case "finance":
      case "finance.overview":
      case "finance.payments":
      case "finance.transactions":
        return <BankingFinanceModule payments={payments} onRefresh={refreshData} />;
      case "finance.refunds":
        return <FinancialsManagement payments={payments} onRefresh={refreshData} />;

      // 7. Communication Workspace
      case "communication":
      case "announcements":
      case "announcements.push":
      case "announcements.sms":
      case "announcements.email":
      case "announcements.emergency":
        return (
          <CommunicationModule
            announcements={announcements}
            onSendAnnouncement={async (t, m, tp) => {
              try {
                await api.post("/admin/announcements", { title: t, message: m, type: tp });
                refreshData();
              } catch { }
            }}
          />
        );

      // 8. Reports Workspace
      case "reports":
      case "reports.events":
      case "reports.finance":
      case "reports.registrations":
        return <ReportsModule registrations={allRegistrations} payments={payments} events={events} />;
      case "reports.downloads":
        return <DownloadsModule registrations={allRegistrations} events={events} payments={payments} />;

      // 9. AI Control Copilot Workspace
      case "ai.copilot":
      case "ai.insights":
      case "ai.conflicts":
        return <AICopilotModule />;

      // 10. Settings Workspace
      case "settings":
      case "settings.roles":
        return <AccessControlModule />;
      case "settings.payment":
      case "settings.system":
        return <SettingsModule />;
      case "profile":
        return <ProfileModule />;

      default:
        return (
          <DashboardOverview
            metrics={metrics}
            events={events}
            registrations={allRegistrations}
            auditLogs={auditLogs}
            onSelectTab={setActivePage}
            onOpenQuickAction={(a) => {
              if (a === "create-event") openEventModal();
              else handleQuickAction(a);
            }}
          />
        );
    }
  };

  return (
    <AdminShell
      activePage={activePage}
      setActivePage={setActivePage}
      user={user || { name: "Administrator", email: "admin@macfast.org" }}
      onLogout={logout}
      socketConnected={socketConnected}
      statusMsg={statusMsg}
      auditLogs={auditLogs}
      onQuickAction={handleQuickAction}
    >
      {renderPage()}

      {/* Event Modal */}
      {showEventModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#111113] border border-white/[0.08] p-6 rounded-2xl max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <h3 className="text-sm font-semibold text-white">{editingEvent ? "Edit Event" : "Create Event"}</h3>
              <button onClick={() => setShowEventModal(false)} className="text-zinc-500 hover:text-white cursor-pointer">
                <RiCloseLine size={18} />
              </button>
            </div>
            <form onSubmit={handleSaveEvent} className="space-y-3 text-[12px]">
              <div>
                <label className="block text-zinc-500 font-medium mb-1">Event Title</label>
                <input type="text" required value={eventTitle} onChange={(e) => setEventTitle(e.target.value)}
                  placeholder="e.g. Battle of Bands"
                  className="w-full bg-white/[0.04] border border-white/[0.06] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500/40" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-500 font-medium mb-1">Category</label>
                  <select value={eventCategory} onChange={(e) => setEventCategory(e.target.value)}
                    className="w-full bg-[#111113] border border-white/[0.06] rounded-lg px-3 py-2 text-white focus:outline-none">
                    <option value="cultural">Cultural</option>
                    <option value="technical">Technical</option>
                    <option value="sports">Sports</option>
                    <option value="literary">Literary</option>
                    <option value="gaming">Gaming</option>
                  </select>
                </div>
                <div>
                  <label className="block text-zinc-500 font-medium mb-1">Venue</label>
                  <input type="text" value={eventVenue} onChange={(e) => setEventVenue(e.target.value)}
                    placeholder="Main Auditorium"
                    className="w-full bg-white/[0.04] border border-white/[0.06] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500/40" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-500 font-medium mb-1">Prize Pool (₹)</label>
                  <input type="number" value={eventPrize} onChange={(e) => setEventPrize(Number(e.target.value))}
                    className="w-full bg-white/[0.04] border border-white/[0.06] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500/40" />
                </div>
                <div>
                  <label className="block text-zinc-500 font-medium mb-1">Seats</label>
                  <input type="number" value={eventSeats} onChange={(e) => setEventSeats(Number(e.target.value))}
                    className="w-full bg-white/[0.04] border border-white/[0.06] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500/40" />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-white/[0.06]">
                <button type="button" onClick={() => setShowEventModal(false)}
                  className="px-4 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 font-medium cursor-pointer">Cancel</button>
                <button type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#F5B301] hover:bg-amber-300 text-[#09090b] flex items-center gap-1.5 cursor-pointer font-semibold">
                  <RiSaveLine size={14} /> Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
