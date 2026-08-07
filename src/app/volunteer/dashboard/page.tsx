"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  RiUserHeartLine,
  RiShieldFlashLine,
  RiCheckDoubleLine,
  RiTimeLine,
  RiQrCodeLine,
  RiTaskLine,
  RiFileDownloadLine,
  RiAlertLine,
  RiLogoutBoxRLine,
  RiBuilding2Line,
  RiSparklingLine,
  RiCheckLine,
  RiAddLine,
  RiCloseLine,
  RiInformationLine,
  RiShieldUserLine,
  RiFocus2Line,
} from "react-icons/ri";
import {
  useVolunteerControl,
  VolunteerTask,
  SharedVolunteerFile,
} from "@/lib/volunteerStore";

export default function VolunteerDashboardPage() {
  const router = useRouter();

  const {
    currentVolunteer,
    assignedTasks,
    currentVenueStatus,
    sharedFiles,
    updateTaskStatus,
    toggleChecklistItem,
    updateVenueOperationalStatus,
    reportNewIssue,
    toggleClockDuty,
  } = useVolunteerControl();

  const [activeTab, setActiveTab] = useState<"overview" | "tasks" | "venue" | "scanner" | "files" | "incident">("overview");
  const [statusMsg, setStatusMsg] = useState("");

  // Scanner simulation
  const [scanCode, setScanCode] = useState("");
  const [scanResult, setScanResult] = useState<{ name: string; college: string; event: string; status: string } | null>(null);

  // Incident form
  const [issueCat, setIssueCat] = useState<"TECHNICAL" | "VENUE" | "MEDICAL" | "EMERGENCY">("TECHNICAL");
  const [issueLoc, setIssueLoc] = useState("");
  const [issueDesc, setIssueDesc] = useState("");

  const triggerToast = (msg: string) => {
    setStatusMsg(msg);
    setTimeout(() => setStatusMsg(""), 3500);
  };

  const handleScanVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scanCode) return;
    setScanResult({
      name: "Rahul Nair",
      college: "CET Trivandrum",
      event: currentVolunteer?.assignedEventName || "Byte & Code Hackathon",
      status: "VERIFIED_VALID",
    });
    triggerToast("✓ QR Ticket Verified Successfully!");
  };

  const handleReportIssue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!issueLoc || !issueDesc) return;
    reportNewIssue(issueCat, issueLoc, issueDesc);
    setIssueLoc("");
    setIssueDesc("");
    triggerToast("✓ Emergency Incident Reported to Command HQ!");
  };

  if (!currentVolunteer) {
    return (
      <div className="bg-[#05050A] min-h-screen flex items-center justify-center font-mono">
        <div className="text-white/40 text-xs font-bold uppercase tracking-widest animate-pulse">
          Loading Volunteer Operations Hub...
        </div>
      </div>
    );
  }

  const completedTasksCount = assignedTasks.filter((t) => t.status === "COMPLETED").length;
  const progressPercent = assignedTasks.length > 0 ? Math.round((completedTasksCount / assignedTasks.length) * 100) : 100;

  return (
    <div className="bg-[#05050A] min-h-screen text-white font-mono flex flex-col justify-between relative overflow-hidden select-none">
      {/* Background Glows */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-30">
        <Image
          src="/MARVEL/3025924746959430.jpg"
          alt="Marvel Background"
          fill
          priority
          className="object-cover object-center filter brightness-110 contrast-125 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#05050A]/90 via-[#05050A]/95 to-[#05050A] z-10" />
      </div>

      {/* TOP HEADER NAV */}
      <header className="relative z-20 px-6 lg:px-12 py-5 border-b border-white/10 bg-black/60 backdrop-blur-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-marvel-red to-rose-700 flex items-center justify-center font-black text-white text-base shadow-[0_0_20px_#ED1D24]">
            VOL
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-black text-white uppercase tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
                {currentVolunteer.name}
              </span>
              <span className="px-2 py-0.5 rounded bg-arc-cyan/20 border border-arc-cyan/40 text-arc-cyan text-[10px] font-bold">
                {currentVolunteer.volunteerCode}
              </span>
            </div>
            <span className="text-[10px] text-white/50 block font-mono">
              {currentVolunteer.department} • {currentVolunteer.assignedVenue}
            </span>
          </div>
        </div>

        {/* Action Controls & Clock In Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleClockDuty}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all duration-300 flex items-center gap-2 cursor-pointer ${
              currentVolunteer.status === "CHECKED_IN"
                ? "bg-emerald-500/20 border border-emerald-500/60 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)] animate-pulse"
                : "bg-white/10 border border-white/20 text-white/60 hover:text-white"
            }`}
          >
            <RiTimeLine />
            <span>{currentVolunteer.status === "CHECKED_IN" ? "● ON DUTY (CHECKED IN)" : "○ OFF DUTY (STANDBY)"}</span>
          </button>

          <Link
            href="/volunteer/login"
            className="p-2.5 rounded-xl bg-white/5 hover:bg-marvel-red/20 border border-white/10 hover:border-marvel-red text-white/70 hover:text-marvel-red transition-colors cursor-pointer"
            title="Log Out Session"
          >
            <RiLogoutBoxRLine className="text-base" />
          </Link>
        </div>
      </header>

      {/* TOAST FEEDBACK ALERT */}
      {statusMsg && (
        <div className="fixed top-20 right-6 z-50 px-5 py-3 bg-emerald-500/90 border border-emerald-400 text-black text-xs font-bold rounded-2xl shadow-[0_0_25px_rgba(16,185,129,0.5)] animate-bounce flex items-center gap-2">
          <RiCheckDoubleLine className="text-lg" />
          <span>{statusMsg}</span>
        </div>
      )}

      {/* MAIN DASHBOARD CONTAINER */}
      <main className="relative z-20 flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* HERO STATUS BANNER */}
        <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-black/90 via-[#0A0D1A] to-[#05050A] border-2 border-arc-cyan/30 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-[0_0_40px_rgba(0,212,255,0.15)]">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-marvel-red/10 border border-marvel-red/30 text-marvel-red text-[10px] font-bold uppercase tracking-widest">
              <RiShieldFlashLine className="animate-pulse" />
              <span>TACTICAL GROUND COMMAND DIRECTIVE</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
              Duty Operations <span className="marvel-bang-comic-gradient font-black">Dashboard</span>
            </h1>
            <p className="text-xs text-white/60">
              Shift: {currentVolunteer.shiftHours} | Assigned Event: {currentVolunteer.assignedEventName || "General Operations"}
            </p>
          </div>

          {/* Progress Bar Gauge */}
          <div className="w-full md:w-64 p-4 bg-black/60 border border-white/10 rounded-2xl space-y-2">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-white/60 uppercase">Task Completion</span>
              <span className="text-arc-cyan">{progressPercent}%</span>
            </div>
            <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-marvel-red to-arc-cyan rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="text-[10px] text-white/40 text-right">
              {completedTasksCount} of {assignedTasks.length} duties finished
            </div>
          </div>
        </div>

        {/* NAVIGATION SUB-TAB RAIL */}
        <div className="flex bg-black/60 p-1.5 rounded-2xl border border-white/10 overflow-x-auto scrollbar-none gap-1">
          {[
            { id: "overview", label: "Overview & Duties", icon: RiTaskLine },
            { id: "tasks", label: `Checklists (${assignedTasks.length})`, icon: RiCheckDoubleLine },
            { id: "scanner", label: "QR Ticket Scanner", icon: RiQrCodeLine },
            { id: "venue", label: "Venue Status Live", icon: RiBuilding2Line },
            { id: "files", label: "Shared Resources", icon: RiFileDownloadLine },
            { id: "incident", label: "Report Emergency", icon: RiAlertLine },
          ].map((tab) => {
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

        {/* 1. OVERVIEW & DUTIES TAB */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 space-y-6">
              <div className="marvel-card p-6 rounded-3xl border border-arc-cyan/30 bg-[#0A0D1A] space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2" style={{ fontFamily: "var(--font-heading)" }}>
                  <RiTaskLine className="text-marvel-red" />
                  <span>Assigned Duty Checklist</span>
                </h3>

                <div className="space-y-3">
                  {assignedTasks.length === 0 ? (
                    <p className="text-xs text-white/40">No duties currently assigned to your roster.</p>
                  ) : (
                    assignedTasks.map((t: VolunteerTask) => (
                      <div
                        key={t.id}
                        className={`p-4 rounded-2xl border transition-all space-y-2 ${
                          t.status === "COMPLETED"
                            ? "bg-emerald-500/10 border-emerald-500/40 text-white/70"
                            : "bg-black/40 border-white/10 text-white"
                        }`}
                      >
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-sm text-white">{t.title}</span>
                          <span className="px-2 py-0.5 rounded bg-marvel-red/20 text-marvel-red text-[9px] font-bold uppercase">
                            {t.priority}
                          </span>
                        </div>
                        <p className="text-xs text-white/60">{t.description}</p>
                        <div className="flex items-center justify-between pt-2 border-t border-white/10 text-[10px]">
                          <span className="text-arc-cyan font-bold">Deadline: {t.deadline}</span>
                          <button
                            onClick={() => updateTaskStatus(t.id, t.status === "COMPLETED" ? "PENDING" : "COMPLETED")}
                            className={`px-3 py-1 rounded-lg font-bold uppercase transition-colors cursor-pointer ${
                              t.status === "COMPLETED"
                                ? "bg-emerald-500 text-black"
                                : "bg-white/10 hover:bg-white/20 text-white"
                            }`}
                          >
                            {t.status === "COMPLETED" ? "✓ Done" : "Mark Finished"}
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar Live Status */}
            <div className="lg:col-span-5 space-y-6">
              <div className="marvel-card p-6 rounded-3xl border border-arc-cyan/30 bg-[#0A0D1A] space-y-4">
                <h3 className="text-sm font-bold text-metallic-gold uppercase tracking-wider flex items-center gap-2">
                  <RiBuilding2Line />
                  <span>Venue Operational Readiness</span>
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between items-center p-3 bg-black/40 border border-white/10 rounded-xl">
                    <span className="text-white/60">Seating Status</span>
                    <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                      {currentVenueStatus.seatingStatus}
                    </span>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-black/40 border border-white/10 rounded-xl">
                    <span className="text-white/60">Registration Gate</span>
                    <span className="px-2.5 py-0.5 rounded bg-arc-cyan/20 text-arc-cyan font-bold">
                      {currentVenueStatus.regDeskStatus}
                    </span>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-black/40 border border-white/10 rounded-xl">
                    <span className="text-white/60">Live Queue Count</span>
                    <span className="font-bold text-white text-sm">{currentVenueStatus.liveQueueCount} Delegates</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. QR TICKET SCANNER TAB */}
        {activeTab === "scanner" && (
          <div className="marvel-card p-6 md:p-8 rounded-3xl border border-arc-cyan/30 bg-[#0A0D1A] space-y-6 max-w-2xl mx-auto">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-marvel-red to-rose-700 mx-auto flex items-center justify-center shadow-[0_0_20px_#ED1D24]">
                <RiQrCodeLine className="text-2xl text-white" />
              </div>
              <h3 className="text-xl font-black text-white uppercase" style={{ fontFamily: "var(--font-heading)" }}>
                Delegate Ticket QR Verification
              </h3>
              <p className="text-xs text-white/60">Scan delegate wristband pass code to verify event access.</p>
            </div>

            <form onSubmit={handleScanVerify} className="space-y-4 text-xs">
              <div>
                <label className="block text-white/70 font-bold mb-1">Passcode / Pass Code</label>
                <input
                  type="text"
                  placeholder="e.g. MF-2K26-9021"
                  value={scanCode}
                  onChange={(e) => setScanCode(e.target.value)}
                  className="w-full px-4 py-3 bg-black/60 border border-white/10 rounded-xl text-white focus:border-arc-cyan focus:outline-none"
                />
              </div>

              <button type="submit" className="w-full btn-primary py-3.5 text-xs font-bold uppercase cursor-pointer shadow-[0_0_20px_#ED1D24]">
                Verify Pass Credentials
              </button>
            </form>

            {scanResult && (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/40 rounded-2xl space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-white text-sm">{scanResult.name}</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500 text-black font-bold uppercase text-[9px]">
                    {scanResult.status}
                  </span>
                </div>
                <div className="text-white/60">College: {scanResult.college}</div>
                <div className="text-arc-cyan font-bold">Event: {scanResult.event}</div>
              </div>
            )}
          </div>
        )}

        {/* 3. REPORT EMERGENCY TAB */}
        {activeTab === "incident" && (
          <div className="marvel-card p-6 md:p-8 rounded-3xl border border-marvel-red/40 bg-[#0A0D1A] space-y-6 max-w-2xl mx-auto">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-marvel-red/20 border border-marvel-red/50 mx-auto flex items-center justify-center shadow-[0_0_20px_#ED1D24]">
                <RiAlertLine className="text-2xl text-marvel-red animate-pulse" />
              </div>
              <h3 className="text-xl font-black text-white uppercase" style={{ fontFamily: "var(--font-heading)" }}>
                Emergency Incident Dispatch Form
              </h3>
              <p className="text-xs text-white/60">Directly dispatch urgent issues to Super Admin Command HQ.</p>
            </div>

            <form onSubmit={handleReportIssue} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/70 font-bold mb-1">Issue Category</label>
                  <select
                    value={issueCat}
                    onChange={(e) => setIssueCat(e.target.value as any)}
                    className="w-full px-4 py-3 bg-black/60 border border-white/10 rounded-xl text-white focus:border-arc-cyan focus:outline-none"
                  >
                    <option value="TECHNICAL">Technical & Power</option>
                    <option value="VENUE">Venue / Seating Overcrowd</option>
                    <option value="MEDICAL">Medical Emergency</option>
                    <option value="EMERGENCY">Security Incident</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white/70 font-bold mb-1">Exact Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Auditorium Gate 2"
                    value={issueLoc}
                    onChange={(e) => setIssueLoc(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-black/60 border border-white/10 rounded-xl text-white focus:border-arc-cyan focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/70 font-bold mb-1">Detailed Description</label>
                <textarea
                  rows={3}
                  placeholder="Describe the situation..."
                  value={issueDesc}
                  onChange={(e) => setIssueDesc(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-black/60 border border-white/10 rounded-xl text-white focus:border-arc-cyan focus:outline-none"
                />
              </div>

              <button type="submit" className="w-full btn-primary py-3.5 text-xs font-bold uppercase cursor-pointer shadow-[0_0_25px_#ED1D24]">
                Dispatch Incident Report
              </button>
            </form>
          </div>
        )}

      </main>

      {/* FOOTER */}
      <footer className="relative z-20 border-t border-white/10 px-6 py-4 text-[11px] text-white/50 flex flex-col sm:flex-row items-center justify-between gap-2 bg-black/80">
        <div>
          © 2026 <span className="text-white font-bold">MacFiesta Pro</span> Volunteer Portal.
        </div>
        <div className="text-arc-cyan font-bold">v4.8.2-VOLUNTEER</div>
      </footer>
    </div>
  );
}
