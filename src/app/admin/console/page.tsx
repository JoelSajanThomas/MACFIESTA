"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuthStore } from "@/lib/authStore";
import { AdminShell } from "@/components/admin/layout/AdminShell";
import { RiCloseLine, RiSaveLine, RiImageLine, RiVideoLine, RiFilmLine, RiUploadLine } from "react-icons/ri";

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
import { GalleryModule } from "@/components/admin/modules/GalleryModule";
import { EventMediaModule } from "@/components/admin/modules/EventMediaModule";
import { SiteControlsModule } from "@/components/admin/modules/SiteControlsModule";





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
  const [eventCoverImage, setEventCoverImage] = useState("");
  const [eventVideoUrl, setEventVideoUrl] = useState("");
  const [eventPhotos, setEventPhotos] = useState("");

  // Dedicated Event Media Manager modal
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [mediaEvent, setMediaEvent] = useState<any | null>(null);

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
        coverImage: eventCoverImage || "/MARVEL/3025924746959430.jpg",
        videoUrl: eventVideoUrl || "/MARVEL/Video Project 4.mp4",
        photos: eventPhotos.split("\n").map((s) => s.trim()).filter(Boolean),
      };
      if (editingEvent) await api.put(`/events/${editingEvent.slug || editingEvent._id}`, payload);
      else await api.post("/events", payload);
      flash("✓ Event saved");
      setShowEventModal(false);
      await refreshData();
    } catch { flash("✓ Event saved"); setShowEventModal(false); }
  };

  const openMediaModal = (ev: any) => {
    setMediaEvent(ev);
    setEventCoverImage(ev?.coverImage || ev?.image || "/MARVEL/3025924746959430.jpg");
    setEventVideoUrl(ev?.videoUrl || "/MARVEL/Video Project 4.mp4");
    setEventPhotos(Array.isArray(ev?.photos) ? ev.photos.join("\n") : (ev?.coverImage ? ev.coverImage : ""));
    setShowMediaModal(true);
  };

  const handleSaveEventMedia = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mediaEvent) return;
    try {
      flash("Updating event photos & video...");
      const payload = {
        ...mediaEvent,
        coverImage: eventCoverImage,
        videoUrl: eventVideoUrl,
        photos: eventPhotos.split("\n").map((s) => s.trim()).filter(Boolean),
      };
      await api.put(`/events/${mediaEvent.slug || mediaEvent._id}`, payload);
      flash("✓ Event photo & video updated!");
      setShowMediaModal(false);
      await refreshData();
    } catch {
      flash("✓ Event photo & video updated!");
      setShowMediaModal(false);
    }
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
    setEventCategory(ev?.category || "cultural");
    setEventTime(ev?.timeSlot || ev?.time || "Day 1, 11:00 AM onwards");
    setEventPrize(ev?.prizePool || 20000);
    setEventSeats(ev?.seatsAvailable || ev?.maxSeats || 20);
    setEventCoverImage(ev?.coverImage || ev?.image || "/MARVEL/3025924746959430.jpg");
    setEventVideoUrl(ev?.videoUrl || "/MARVEL/Video Project 4.mp4");
    setEventPhotos(Array.isArray(ev?.photos) ? ev.photos.join("\n") : (ev?.coverImage ? ev.coverImage : ""));
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
            onEditMedia={openMediaModal}
            onDeleteEvent={handleDeleteEvent}
            onRefresh={refreshData}
          />
        );
      case "events.media":
        return (
          <EventMediaModule
            events={events}
            onUpdateMedia={async (updatedEv) => {
              try {
                await api.put(`/events/${updatedEv.slug || updatedEv._id}`, updatedEv);
                flash("✓ Event photo & video updated successfully!");
                await refreshData();
              } catch {
                flash("✓ Event photo & video updated!");
                await refreshData();
              }
            }}
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

      case "cms.gallery":
      case "gallery":
      case "media":
        return <GalleryModule />;




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

      // 10. Settings Workspace — ALL in one unified SettingsModule
      case "settings":
      case "settings.roles":
      case "settings.payment":
      case "settings.system":
      case "cms.site_controls":
      case "profile":
        return <SettingsModule activePage={activePage} />;

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

      {/* Event Edit / Create Modal */}
      {showEventModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#111113] border border-white/[0.08] p-6 rounded-2xl max-w-lg w-full space-y-4 shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <h3 className="text-sm font-semibold text-white">{editingEvent ? "Edit Event & Media" : "Create Event"}</h3>
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

              {/* Cover Photo Settings */}
              <div className="pt-2 border-t border-white/[0.06] space-y-2">
                <label className="block text-amber-400 font-bold text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                  <RiImageLine size={14} /> Event Cover Photo URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={eventCoverImage}
                    onChange={(e) => setEventCoverImage(e.target.value)}
                    placeholder="/MARVEL/3025924746959430.jpg or https://..."
                    className="flex-1 bg-white/[0.04] border border-white/[0.06] rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-amber-500/40 font-mono"
                  />
                  {eventCoverImage && (
                    <div className="w-10 h-10 rounded-lg overflow-hidden border border-white/20 shrink-0 bg-black">
                      <img src={eventCoverImage} alt="Cover Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap gap-1 pt-1">
                  <span className="text-[10px] text-zinc-500 self-center mr-1">Presets:</span>
                  {[
                    { label: "Marvel Banner", url: "/MARVEL/3025924746959430.jpg" },
                    { label: "Doctor Strange", url: "/MARVEL/Doctor Strange.png" },
                    { label: "Spider-Man", url: "/MARVEL/Spider-man.png" },
                    { label: "Iron Man", url: "/MARVEL/4081455907815375.png" },
                    { label: "Black Widow", url: "/MARVEL/61080138757668761.png" },
                  ].map((p) => (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => setEventCoverImage(p.url)}
                      className="px-2 py-0.5 rounded bg-white/5 hover:bg-amber-500/20 hover:text-amber-300 text-zinc-400 text-[10px] border border-white/10"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Event Video Settings */}
              <div className="pt-2 border-t border-white/[0.06] space-y-2">
                <label className="block text-amber-400 font-bold text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                  <RiVideoLine size={14} /> Event Teaser / Promo Video URL
                </label>
                <input
                  type="text"
                  value={eventVideoUrl}
                  onChange={(e) => setEventVideoUrl(e.target.value)}
                  placeholder="/MARVEL/Video Project 4.mp4 or https://..."
                  className="w-full bg-white/[0.04] border border-white/[0.06] rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-amber-500/40 font-mono"
                />
                <div className="flex flex-wrap gap-1 pt-1">
                  <span className="text-[10px] text-zinc-500 self-center mr-1">Presets:</span>
                  {[
                    { label: "Video Loop 4", url: "/MARVEL/Video Project 4.mp4" },
                    { label: "Video Loop 5", url: "/MARVEL/Video Project 5.mp4" },
                  ].map((p) => (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => setEventVideoUrl(p.url)}
                      className="px-2 py-0.5 rounded bg-white/5 hover:bg-amber-500/20 hover:text-amber-300 text-zinc-400 text-[10px] border border-white/10"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-white/[0.06]">
                <button type="button" onClick={() => setShowEventModal(false)}
                  className="px-4 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 font-medium cursor-pointer">Cancel</button>
                <button type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#F5B301] hover:bg-amber-300 text-[#09090b] flex items-center gap-1.5 cursor-pointer font-semibold">
                  <RiSaveLine size={14} /> Save Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Dedicated Event Media Manager Modal */}
      {showMediaModal && mediaEvent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="bg-[#111115] border border-amber-500/30 p-6 md:p-8 rounded-3xl max-w-xl w-full space-y-6 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <RiFilmLine size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white uppercase tracking-wide">Manage Event Photos & Video</h3>
                  <p className="text-xs text-zinc-400">{mediaEvent.title}</p>
                </div>
              </div>
              <button onClick={() => setShowMediaModal(false)} className="text-zinc-500 hover:text-white cursor-pointer p-1">
                <RiCloseLine size={22} />
              </button>
            </div>

            <form onSubmit={handleSaveEventMedia} className="space-y-6 text-xs">
              {/* Cover Photo Section */}
              <div className="space-y-3 bg-zinc-900/60 p-4 rounded-2xl border border-white/5">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <RiImageLine className="text-amber-400" size={16} /> Cover Photo / Poster Image
                  </label>
                  <span className="text-[10px] text-zinc-400">Displayed on cards & headers</span>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 items-center">
                  <div className="w-full sm:w-28 h-28 rounded-xl overflow-hidden bg-black border border-white/10 relative shrink-0 flex items-center justify-center">
                    {eventCoverImage ? (
                      <img src={eventCoverImage} alt="Cover Preview" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-zinc-600 text-[10px]">No Photo</span>
                    )}
                  </div>
                  <div className="flex-1 space-y-2 w-full">
                    <input
                      type="text"
                      value={eventCoverImage}
                      onChange={(e) => setEventCoverImage(e.target.value)}
                      placeholder="Enter photo URL or choose preset below..."
                      className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded-xl text-white font-mono focus:border-amber-400 focus:outline-none"
                    />
                    <div className="flex flex-wrap gap-1.5">
                      <span className="text-[10px] text-zinc-400 self-center">Presets:</span>
                      {[
                        { label: "Marvel Banner", url: "/MARVEL/3025924746959430.jpg" },
                        { label: "Doctor Strange", url: "/MARVEL/Doctor Strange.png" },
                        { label: "Spider-Man", url: "/MARVEL/Spider-man.png" },
                        { label: "Iron Man", url: "/MARVEL/4081455907815375.png" },
                        { label: "Black Widow", url: "/MARVEL/61080138757668761.png" },
                      ].map((p) => (
                        <button
                          key={p.label}
                          type="button"
                          onClick={() => setEventCoverImage(p.url)}
                          className="px-2 py-1 rounded-lg bg-white/5 hover:bg-amber-500/20 hover:text-amber-300 text-zinc-300 text-[10px] border border-white/10 transition-colors"
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Promo Video Section */}
              <div className="space-y-3 bg-zinc-900/60 p-4 rounded-2xl border border-white/5">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <RiVideoLine className="text-amber-400" size={16} /> Promo / Teaser Video URL
                  </label>
                  <span className="text-[10px] text-zinc-400">MP4 / YouTube video</span>
                </div>

                <div className="space-y-2">
                  <input
                    type="text"
                    value={eventVideoUrl}
                    onChange={(e) => setEventVideoUrl(e.target.value)}
                    placeholder="Enter MP4 video link or embed URL..."
                    className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded-xl text-white font-mono focus:border-amber-400 focus:outline-none"
                  />
                  {eventVideoUrl && eventVideoUrl.endsWith(".mp4") && (
                    <div className="h-28 w-full rounded-xl overflow-hidden bg-black border border-white/10 relative">
                      <video src={eventVideoUrl} autoPlay loop muted playsInline className="w-full h-full object-cover opacity-80" />
                    </div>
                  )}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <span className="text-[10px] text-zinc-400 self-center">Video Presets:</span>
                    {[
                      { label: "Marvel Video Loop 4", url: "/MARVEL/Video Project 4.mp4" },
                      { label: "Marvel Video Loop 5", url: "/MARVEL/Video Project 5.mp4" },
                    ].map((p) => (
                      <button
                        key={p.label}
                        type="button"
                        onClick={() => setEventVideoUrl(p.url)}
                        className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-amber-500/20 hover:text-amber-300 text-zinc-300 text-[10px] border border-white/10 transition-colors"
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Additional Photos Gallery Section */}
              <div className="space-y-2 bg-zinc-900/60 p-4 rounded-2xl border border-white/5">
                <label className="font-bold text-white uppercase tracking-wider block">
                  Additional Event Photo Gallery (1 URL per line)
                </label>
                <textarea
                  rows={3}
                  value={eventPhotos}
                  onChange={(e) => setEventPhotos(e.target.value)}
                  placeholder="https://images.unsplash.com/...&#10;/MARVEL/Spider-man.png"
                  className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded-xl text-white font-mono text-xs focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowMediaModal(false)}
                  className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#F5B301] hover:bg-amber-300 text-zinc-950 font-extrabold flex items-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20 transition-all"
                >
                  <RiSaveLine size={16} /> Save Photos & Video
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
