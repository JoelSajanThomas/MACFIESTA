"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  RiUserHeartLine,
  RiTimeLine,
  RiCheckDoubleLine,
  RiTaskLine,
  RiShieldFlashLine,
  RiQrCodeLine,
  RiAlertLine,
  RiFolderDownloadLine,
  RiBuilding2Line,
  RiPlayLine,
  RiCheckboxCircleLine,
  RiFileTextLine,
  RiLogoutBoxRLine,
  RiSparklingLine,
  RiSendPlaneLine,
  RiLock2Line,
  RiUser3Line,
} from "react-icons/ri";
import { useVolunteerControl, VolunteerTask } from "@/lib/volunteerStore";

export default function VolunteerDashboardPage() {
  const router = useRouter();
  const [volunteerId, setVolunteerId] = useState("v-101");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const savedId = localStorage.getItem("macfiesta_active_volunteer_id");
      if (savedId) setVolunteerId(savedId);
    }
  }, []);

  const {
    currentVolunteer,
    assignedTasks,
    currentVenueStatus,
    issues,
    sharedFiles,
    updateTaskStatus,
    toggleChecklistItem,
    updateVenueOperationalStatus,
    reportNewIssue,
    toggleClockDuty,
  } = useVolunteerControl(volunteerId);

  const [activeTab, setActiveTab] = useState<"tasks" | "venue" | "verify" | "issues" | "files" | "profile">("tasks");
  const [taskNotes, setTaskNotes] = useState<Record<string, string>>({});
  const [proofUrls, setProofUrls] = useState<Record<string, string>>({});

  // Issue Reporting Form State
  const [issueCategory, setIssueCategory] = useState<"TECHNICAL" | "VENUE" | "MEDICAL" | "EMERGENCY" | "REGISTRATION">("TECHNICAL");
  const [issueLocation, setIssueLocation] = useState("");
  const [issueDesc, setIssueDesc] = useState("");
  const [issueMsg, setIssueMsg] = useState("");

  // QR verification simulator
  const [qrCodeInput, setQrCodeInput] = useState("");
  const [verifiedPass, setVerifiedPass] = useState<any | null>(null);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("macfiesta_active_volunteer_id");
      localStorage.removeItem("macfiesta_volunteer_auth");
    }
    router.replace("/volunteer/login");
  };

  const handleIssueSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!issueDesc || !issueLocation) return;
    reportNewIssue(issueCategory, issueLocation, issueDesc);
    setIssueMsg("✓ Emergency alert dispatched to Admin Command HQ!");
    setIssueLocation("");
    setIssueDesc("");
    setTimeout(() => setIssueMsg(""), 3500);
  };

  const handleSimulateQrScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!qrCodeInput) return;
    setVerifiedPass({
      name: "Rohan Varghese",
      college: "CET Trivandrum",
      event: currentVolunteer.assignedEventName || "Byte & Code Hackathon",
      regCode: qrCodeInput.toUpperCase(),
      status: "VERIFIED & ISSUED PASS",
      time: new Date().toLocaleTimeString(),
    });
    setQrCodeInput("");
  };

  if (!mounted) return null;

  const totalTasks = assignedTasks.length;
  const completedTasks = assignedTasks.filter((t) => t.status === "COMPLETED").length;
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const permissions = currentVolunteer.permissions;

  return (
    <div className="bg-[#05050A] min-h-screen text-white font-mono relative overflow-hidden pb-16">
      {/* Background Glow Orbs */}
      <div className="absolute top-0 right-0 w-[500px] h-[300px] bg-marvel-red/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[250px] bg-arc-cyan/10 rounded-full blur-[120px] pointer-events-none" />

      {/* TOP VOLUNTEER NAVIGATION HEADER */}
      <header className="sticky top-0 z-50 bg-[#0A0D1A]/90 backdrop-blur-xl border-b border-arc-cyan/30 px-4 sm:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-marvel-red to-rose-700 flex items-center justify-center text-white font-black text-sm shadow-[0_0_15px_#ED1D24]">
            <RiUserHeartLine />
          </div>
          <div>
            <div className="text-xs font-black text-white uppercase tracking-tight flex items-center gap-2" style={{ fontFamily: "var(--font-heading)" }}>
              <span>MacFiesta Volunteer HQ</span>
              <span className="px-2 py-0.5 rounded bg-arc-cyan/20 text-arc-cyan text-[9px] font-bold">
                {currentVolunteer.volunteerCode}
              </span>
            </div>
            <p className="text-[10px] text-white/50">{currentVolunteer.name} • {currentVolunteer.department}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleClockDuty}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-all ${
              currentVolunteer.status === "CHECKED_IN"
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                : "bg-amber-500/20 text-amber-400 border border-amber-500/40"
            }`}
          >
            <RiTimeLine className="animate-pulse" />
            <span>{currentVolunteer.status === "CHECKED_IN" ? "DUTY: CHECKED IN" : "DUTY: OFF CLOCK"}</span>
          </button>

          <button
            onClick={handleLogout}
            className="p-2 rounded-xl bg-white/5 hover:bg-marvel-red/20 text-white/60 hover:text-marvel-red border border-white/10 transition-colors cursor-pointer"
            title="Log Out Volunteer"
          >
            <RiLogoutBoxRLine className="text-base" />
          </button>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8 relative z-10">
        {/* HERO DUTY SUMMARY CARD */}
        <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-black/90 via-[#0A0D1A] to-[#05050A] border-2 border-arc-cyan/40 shadow-[0_0_40px_rgba(0,212,255,0.15)] flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-marvel-red/10 border border-marvel-red/30 text-marvel-red text-[10px] font-bold uppercase tracking-widest">
              <RiShieldFlashLine className="animate-pulse" />
              <span>DUTY ASSIGNMENT • {currentVolunteer.assignedEventName || "General Fest Operations"}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
              Welcome Agent <span className="marvel-bang-comic-gradient font-black">{currentVolunteer.name}</span>
            </h1>
            <p className="text-xs text-white/70 leading-relaxed">
              Assigned Venue: <span className="text-arc-cyan font-bold">{currentVolunteer.assignedVenue}</span> | Shift: <span className="text-metallic-gold font-bold">{currentVolunteer.shiftHours}</span>
            </p>
          </div>

          {/* Progress Tracker Card */}
          <div className="p-5 bg-black/60 border border-white/10 rounded-2xl min-w-[240px] space-y-2 text-xs">
            <div className="flex justify-between items-center text-white/70">
              <span>Task Progress</span>
              <span className="font-bold text-arc-cyan">{completedTasks} / {totalTasks} Done</span>
            </div>
            <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-arc-cyan to-marvel-red transition-all duration-500" style={{ width: `${progressPercent}%` }} />
            </div>
            <div className="text-right text-[10px] text-metallic-gold font-bold">{progressPercent}% Completed</div>
          </div>
        </div>

        {/* TAB NAVIGATION RAIL */}
        <div className="flex bg-black/60 p-1.5 rounded-2xl border border-white/10 overflow-x-auto scrollbar-none gap-1">
          {[
            { id: "tasks", label: `Assigned Tasks (${assignedTasks.length})`, icon: RiTaskLine, reqPerm: true },
            { id: "venue", label: "Live Venue Status", icon: RiBuilding2Line, reqPerm: permissions.canUpdateVenueStatus },
            { id: "verify", label: "QR Check-in Pass", icon: RiQrCodeLine, reqPerm: permissions.canVerifyRegistrations },
            { id: "issues", label: `Issue Reports (${issues.length})`, icon: RiAlertLine, reqPerm: permissions.canReportIssues },
            { id: "files", label: `Shared Files (${sharedFiles.length})`, icon: RiFolderDownloadLine, reqPerm: permissions.canDownloadFiles },
            { id: "profile", label: "My Profile", icon: RiUser3Line, reqPerm: true },
          ].filter((t) => t.reqPerm).map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                  isActive
                    ? "bg-marvel-red text-white shadow-[0_0_15px_#ED1D24]"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
                style={{ fontFamily: "var(--font-heading)" }}
              >
                <Icon />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB CONTENTS */}

        {/* 1. ASSIGNED TASKS & INTERACTIVE CHECKLISTS */}
        {activeTab === "tasks" && (
          <div className="space-y-6">
            <h2 className="text-lg font-black text-white uppercase tracking-wider flex items-center gap-2" style={{ fontFamily: "var(--font-heading)" }}>
              <RiTaskLine className="text-arc-cyan" />
              <span>Assigned Duty Tasks & Checklists</span>
            </h2>

            {assignedTasks.length === 0 ? (
              <div className="p-8 text-center bg-black/40 border border-white/10 rounded-3xl text-white/50 text-xs">
                No active tasks assigned yet by Admin Command HQ.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {assignedTasks.map((t) => (
                  <div key={t.id} className="marvel-card p-6 rounded-3xl border border-arc-cyan/30 bg-[#0A0D1A] space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                            t.priority === "URGENT" ? "bg-red-500 text-white" : t.priority === "HIGH" ? "bg-amber-500 text-black" : "bg-arc-cyan/20 text-arc-cyan"
                          }`}>
                            {t.priority} PRIORITY
                          </span>
                          <span className="text-[10px] text-white/50 font-bold">Deadline: {t.deadline}</span>
                        </div>
                        <h3 className="text-base font-bold text-white uppercase tracking-wide mt-1">{t.title}</h3>
                      </div>

                      {/* Status Buttons */}
                      <div className="flex items-center gap-2">
                        {t.status === "PENDING" && (
                          <button
                            onClick={() => updateTaskStatus(t.id, "STARTED")}
                            className="px-4 py-2 bg-arc-cyan text-black font-bold text-xs rounded-xl hover:bg-white transition-colors cursor-pointer flex items-center gap-1"
                          >
                            <RiPlayLine />
                            <span>Mark Started</span>
                          </button>
                        )}
                        {t.status !== "COMPLETED" && (
                          <button
                            onClick={() => updateTaskStatus(t.id, "COMPLETED")}
                            className="px-4 py-2 bg-emerald-500 text-black font-bold text-xs rounded-xl hover:bg-white transition-colors cursor-pointer flex items-center gap-1 shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                          >
                            <RiCheckboxCircleLine />
                            <span>Mark Completed</span>
                          </button>
                        )}
                        {t.status === "COMPLETED" && (
                          <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/40 flex items-center gap-1">
                            <RiCheckDoubleLine />
                            <span>COMPLETED</span>
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-white/70">{t.description}</p>

                    {/* Interactive Checklist */}
                    {t.checklist && t.checklist.length > 0 && (
                      <div className="p-4 bg-black/60 border border-white/10 rounded-2xl space-y-2 text-xs">
                        <h4 className="font-bold text-metallic-gold uppercase tracking-wider text-[11px]">Task Verification Checklist</h4>
                        <div className="space-y-1.5">
                          {t.checklist.map((c) => (
                            <label key={c.id} className="flex items-center gap-2 cursor-pointer text-white/80 hover:text-white">
                              <input
                                type="checkbox"
                                checked={c.completed}
                                onChange={() => toggleChecklistItem(t.id, c.id)}
                                className="accent-marvel-red w-4 h-4 cursor-pointer"
                              />
                              <span className={c.completed ? "line-through text-white/40" : ""}>{c.text}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Notes & Proof Image */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
                      <div>
                        <label className="block text-white/60 font-bold mb-1">Add Volunteer Operational Notes</label>
                        <input
                          type="text"
                          placeholder="e.g. All cables verified, mic battery replaced."
                          value={taskNotes[t.id] ?? (t.notes || "")}
                          onChange={(e) => setTaskNotes({ ...taskNotes, [t.id]: e.target.value })}
                          onBlur={() => updateTaskStatus(t.id, t.status, taskNotes[t.id])}
                          className="w-full px-3.5 py-2 bg-black/60 border border-white/10 rounded-xl text-white focus:border-arc-cyan focus:outline-none"
                        />
                      </div>

                      {permissions.canUploadProof && (
                        <div>
                          <label className="block text-white/60 font-bold mb-1">Upload Proof Photo URL</label>
                          <input
                            type="text"
                            placeholder="https://images.unsplash.com/photo-..."
                            value={proofUrls[t.id] ?? (t.proofImageUrl || "")}
                            onChange={(e) => setProofUrls({ ...proofUrls, [t.id]: e.target.value })}
                            onBlur={() => updateTaskStatus(t.id, t.status, t.notes, proofUrls[t.id])}
                            className="w-full px-3.5 py-2 bg-black/60 border border-white/10 rounded-xl text-white focus:border-arc-cyan focus:outline-none"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 2. LIVE VENUE STATUS MANAGER */}
        {activeTab === "venue" && permissions.canUpdateVenueStatus && (
          <div className="marvel-card p-6 md:p-8 rounded-3xl border border-arc-cyan/30 bg-[#0A0D1A] space-y-6">
            <h2 className="text-lg font-black text-white uppercase tracking-wider flex items-center gap-2" style={{ fontFamily: "var(--font-heading)" }}>
              <RiBuilding2Line className="text-arc-cyan" />
              <span>Live Venue Operational Controls • {currentVenueStatus.venueName}</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
              <div>
                <label className="block text-white/70 font-bold mb-2">Auditorium Seating Capacity Status</label>
                <select
                  value={currentVenueStatus.seatingStatus}
                  onChange={(e) => updateVenueOperationalStatus(currentVenueStatus.eventId, { seatingStatus: e.target.value as any })}
                  className="w-full px-4 py-3 bg-black/60 border border-white/10 rounded-xl text-white focus:border-arc-cyan focus:outline-none"
                >
                  <option value="SEATS_AVAILABLE">Seats Available</option>
                  <option value="NEAR_FULL">Near Capacity (90%+)</option>
                  <option value="HOUSEFULL">Housefull (Entry Paused)</option>
                </select>
              </div>

              <div>
                <label className="block text-white/70 font-bold mb-2">Registration Desk Status</label>
                <select
                  value={currentVenueStatus.regDeskStatus}
                  onChange={(e) => updateVenueOperationalStatus(currentVenueStatus.eventId, { regDeskStatus: e.target.value as any })}
                  className="w-full px-4 py-3 bg-black/60 border border-white/10 rounded-xl text-white focus:border-arc-cyan focus:outline-none"
                >
                  <option value="DESK_OPEN">Registration Desk Open</option>
                  <option value="BUSY">Desk Busy / Heavy Queue</option>
                  <option value="CLOSED">Desk Temporarily Closed</option>
                </select>
              </div>

              <div>
                <label className="block text-white/70 font-bold mb-2">Stage & Audio Readiness</label>
                <select
                  value={currentVenueStatus.stageReadiness}
                  onChange={(e) => updateVenueOperationalStatus(currentVenueStatus.eventId, { stageReadiness: e.target.value as any })}
                  className="w-full px-4 py-3 bg-black/60 border border-white/10 rounded-xl text-white focus:border-arc-cyan focus:outline-none"
                >
                  <option value="READY">Stage Ready for Presentation</option>
                  <option value="SOUND_CHECK">Sound Check in Progress</option>
                  <option value="DELAYED">Technical Delay</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div>
                <label className="block text-white/70 font-bold mb-2">Live Audience Attendance Count</label>
                <input
                  type="number"
                  value={currentVenueStatus.attendanceCount}
                  onChange={(e) => updateVenueOperationalStatus(currentVenueStatus.eventId, { attendanceCount: Number(e.target.value) })}
                  className="w-full px-4 py-3 bg-black/60 border border-white/10 rounded-xl text-white focus:border-arc-cyan focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-white/70 font-bold mb-2">Queue Count Outside Venue</label>
                <input
                  type="number"
                  value={currentVenueStatus.liveQueueCount}
                  onChange={(e) => updateVenueOperationalStatus(currentVenueStatus.eventId, { liveQueueCount: Number(e.target.value) })}
                  className="w-full px-4 py-3 bg-black/60 border border-white/10 rounded-xl text-white focus:border-arc-cyan focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* 3. QR PARTICIPANT CHECK-IN PASS */}
        {activeTab === "verify" && permissions.canVerifyRegistrations && (
          <div className="marvel-card p-6 md:p-8 rounded-3xl border border-arc-cyan/30 bg-[#0A0D1A] space-y-6">
            <h2 className="text-lg font-black text-white uppercase tracking-wider flex items-center gap-2" style={{ fontFamily: "var(--font-heading)" }}>
              <RiQrCodeLine className="text-arc-cyan" />
              <span>Participant Ticket & QR Verification Desk</span>
            </h2>

            <form onSubmit={handleSimulateQrScan} className="flex flex-col sm:flex-row gap-3 text-xs">
              <input
                type="text"
                placeholder="Scan or Type Ticket QR Pass Code (e.g. MF-8829)"
                value={qrCodeInput}
                onChange={(e) => setQrCodeInput(e.target.value)}
                className="px-4 py-3 bg-black/60 border border-white/10 rounded-xl text-white flex-1 focus:border-arc-cyan focus:outline-none"
              />
              <button type="submit" className="px-6 py-3 bg-arc-cyan text-black font-bold uppercase rounded-xl hover:bg-white transition-colors cursor-pointer">
                Verify Delegate QR
              </button>
            </form>

            {verifiedPass && (
              <div className="p-6 bg-emerald-500/10 border-2 border-emerald-500/50 rounded-2xl space-y-3 text-xs animate-fadeIn">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <RiCheckDoubleLine className="text-xl" />
                  <span>VALIDATED DELEGATE PASS</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-white">
                  <div>
                    <span className="text-white/40 block text-[10px]">Delegate Name</span>
                    <span className="font-bold">{verifiedPass.name}</span>
                  </div>
                  <div>
                    <span className="text-white/40 block text-[10px]">College</span>
                    <span className="font-bold">{verifiedPass.college}</span>
                  </div>
                  <div>
                    <span className="text-white/40 block text-[10px]">Registered Event</span>
                    <span className="font-bold text-arc-cyan">{verifiedPass.event}</span>
                  </div>
                  <div>
                    <span className="text-white/40 block text-[10px]">Verification Time</span>
                    <span className="font-bold text-metallic-gold">{verifiedPass.time}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 4. EMERGENCY & ISSUE REPORTING */}
        {activeTab === "issues" && permissions.canReportIssues && (
          <div className="marvel-card p-6 md:p-8 rounded-3xl border border-arc-cyan/30 bg-[#0A0D1A] space-y-6">
            <h2 className="text-lg font-black text-white uppercase tracking-wider flex items-center gap-2" style={{ fontFamily: "var(--font-heading)" }}>
              <RiAlertLine className="text-marvel-red animate-pulse" />
              <span>Report Issue or Emergency to Admin Command HQ</span>
            </h2>

            {issueMsg && (
              <div className="p-3 bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 text-xs font-bold rounded-xl flex items-center gap-2">
                <RiCheckDoubleLine />
                <span>{issueMsg}</span>
              </div>
            )}

            <form onSubmit={handleIssueSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/70 font-bold mb-1">Issue Category</label>
                  <select
                    value={issueCategory}
                    onChange={(e) => setIssueCategory(e.target.value as any)}
                    className="w-full px-4 py-3 bg-black/60 border border-white/10 rounded-xl text-white focus:border-arc-cyan focus:outline-none"
                  >
                    <option value="TECHNICAL">Technical & Audio/Visual Failure</option>
                    <option value="VENUE">Venue Overcrowding / Facilities</option>
                    <option value="MEDICAL">Medical Emergency Assistance</option>
                    <option value="EMERGENCY">Security Alert</option>
                    <option value="REGISTRATION">Registration Dispute</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white/70 font-bold mb-1">Exact Location / Venue</label>
                  <input
                    type="text"
                    placeholder="e.g. Lab 3 Entrance Desk"
                    value={issueLocation}
                    onChange={(e) => setIssueLocation(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-black/60 border border-white/10 rounded-xl text-white focus:border-arc-cyan focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/70 font-bold mb-1">Issue Description & Action Required</label>
                <textarea
                  rows={3}
                  placeholder="Describe the issue concisely..."
                  value={issueDesc}
                  onChange={(e) => setIssueDesc(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-black/60 border border-white/10 rounded-xl text-white focus:border-arc-cyan focus:outline-none"
                />
              </div>

              <button type="submit" className="btn-primary py-3 px-6 text-xs uppercase font-bold flex items-center gap-2 cursor-pointer shadow-[0_0_20px_#ED1D24]">
                <RiSendPlaneLine />
                <span>Dispatch Emergency Incident Report</span>
              </button>
            </form>

            <div className="pt-4 border-t border-white/10 space-y-3">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Submitted Incident Reports Log</h3>
              <div className="space-y-2 text-xs">
                {issues.map((i) => (
                  <div key={i.id} className="p-4 bg-black/40 border border-white/10 rounded-2xl flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-marvel-red/20 text-marvel-red text-[9px] font-bold">{i.category}</span>
                        <span className="font-bold text-white">{i.location}</span>
                      </div>
                      <p className="text-white/60 mt-1">{i.description}</p>
                    </div>
                    <span className="text-[10px] text-arc-cyan font-bold">{i.timestamp}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 5. SHARED FILES */}
        {activeTab === "files" && permissions.canDownloadFiles && (
          <div className="marvel-card p-6 md:p-8 rounded-3xl border border-arc-cyan/30 bg-[#0A0D1A] space-y-6">
            <h2 className="text-lg font-black text-white uppercase tracking-wider flex items-center gap-2" style={{ fontFamily: "var(--font-heading)" }}>
              <RiFolderDownloadLine className="text-arc-cyan" />
              <span>Official Festival Documents & Venue Maps</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              {sharedFiles.map((f) => (
                <div key={f.id} className="p-5 bg-black/40 border border-white/10 rounded-2xl space-y-3">
                  <div className="px-2.5 py-0.5 rounded bg-metallic-gold/15 text-metallic-gold font-bold text-[9px] uppercase inline-block">
                    {f.category}
                  </div>
                  <div className="font-bold text-white text-sm">{f.title}</div>
                  <div className="flex items-center justify-between text-white/50 text-[10px]">
                    <span>Size: {f.fileSize}</span>
                    <a href="#" className="text-arc-cyan font-bold hover:underline flex items-center gap-1">
                      <RiFolderDownloadLine />
                      <span>Download</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. VOLUNTEER PROFILE EDITOR */}
        {activeTab === "profile" && (
          <div className="marvel-card p-6 md:p-8 rounded-3xl border border-arc-cyan/30 bg-[#0A0D1A] space-y-6 max-w-2xl mx-auto">
            <h2 className="text-lg font-black text-white uppercase tracking-wider flex items-center gap-2" style={{ fontFamily: "var(--font-heading)" }}>
              <RiUser3Line className="text-arc-cyan" />
              <span>Volunteer Profile & Security Settings</span>
            </h2>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4 p-4 bg-black/60 border border-white/10 rounded-2xl">
                <div>
                  <span className="text-white/40 block text-[10px] uppercase font-bold">Volunteer ID Code</span>
                  <span className="font-bold text-arc-cyan">{currentVolunteer.volunteerCode}</span>
                </div>
                <div>
                  <span className="text-white/40 block text-[10px] uppercase font-bold">Assigned Role</span>
                  <span className="font-bold text-metallic-gold">Duty Operations Agent</span>
                </div>
              </div>

              <div>
                <label className="block text-white/70 font-bold mb-1">Full Name</label>
                <input
                  type="text"
                  value={currentVolunteer.name}
                  disabled
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white/60 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-white/70 font-bold mb-1">Contact Phone Number</label>
                <input
                  type="text"
                  defaultValue={currentVolunteer.phone}
                  className="w-full px-4 py-3 bg-black/60 border border-white/10 rounded-xl text-white focus:border-arc-cyan focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
