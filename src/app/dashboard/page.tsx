"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  RiQrCodeLine,
  RiTimeLine,
  RiAwardLine,
  RiHistoryLine,
  RiUserSettingsLine,
  RiDownloadLine,
  RiCloseLine,
  RiCheckLine,
  RiShieldCheckLine,
  RiInformationLine,
  RiFlashlightLine,
  RiShieldFlashLine,
  RiRobot2Line
} from "react-icons/ri";
import { useAuthStore } from "@/lib/authStore";
import { downloadEventTicketPDF, generateQRCodeDataUrl } from "@/lib/ticketGenerator";

import { getSocket } from "@/lib/socket";

export default function DashboardPage() {
  const router = useRouter();
  const { user, token, registrations, cancelRegistration, fetchProfile, fetchRegistrations, isInitialized } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [selectedReg, setSelectedReg] = useState<any | null>(null);
  const [activeQrCodeUrl, setActiveQrCodeUrl] = useState<string>("");
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [generatingTicketId, setGeneratingTicketId] = useState<string | null>(null);

  // Cancellation Modal States
  const [cancellingReg, setCancellingReg] = useState<any | null>(null);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelMsg, setCancelMsg] = useState<{ text: string; isError: boolean } | null>(null);

  const activeRegistrations = registrations.filter((r) => r.status !== "cancelled");
  const cancelledRegistrations = registrations.filter((r) => r.status === "cancelled");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (token) {
      fetchProfile();
      fetchRegistrations();

      const socket = getSocket();
      const handleSync = () => {
        fetchProfile();
        fetchRegistrations();
      };

      socket.on("registrations-changed", handleSync);
      socket.on("qr-checked-in", handleSync);
      socket.on("users-changed", handleSync);

      return () => {
        socket.off("registrations-changed", handleSync);
        socket.off("qr-checked-in", handleSync);
        socket.off("users-changed", handleSync);
      };
    }
  }, [token, fetchProfile, fetchRegistrations]);

  useEffect(() => {
    if (mounted && isInitialized && !token) {
      router.replace("/signin");
    }
  }, [mounted, isInitialized, token, router]);

  const handleDownloadTicket = async (reg: any) => {
    const event = typeof reg.eventId === "object" ? reg.eventId : null;
    if (!event || !user) return;
    setGeneratingTicketId(reg._id);
    await downloadEventTicketPDF(reg, event, user);
    setGeneratingTicketId(null);
  };

  const handleInspectQrDetails = async (reg: any) => {
    const event = typeof reg.eventId === "object" ? reg.eventId : null;
    if (!event || !user) return;
    setSelectedReg(reg);
    const qrUrl = await generateQRCodeDataUrl(reg, event, user);
    setActiveQrCodeUrl(qrUrl);
    setIsQrModalOpen(true);
  };

  const handleOpenCancelModal = (reg: any) => {
    setCancellingReg(reg);
    setCancelMsg(null);
    setIsCancelModalOpen(true);
  };

  const handleConfirmCancelRegistration = async () => {
    if (!cancellingReg) return;
    setIsCancelling(true);
    setCancelMsg(null);
    const res = await cancelRegistration(cancellingReg._id);
    setIsCancelling(false);

    if (res.success) {
      setCancelMsg({
        text: res.message || "Registration cancelled successfully. No refund provided per policy.",
        isError: false
      });
      setTimeout(() => {
        setIsCancelModalOpen(false);
        setCancellingReg(null);
        setCancelMsg(null);
      }, 1800);
    } else {
      setCancelMsg({
        text: res.message || "Failed to cancel registration.",
        isError: true
      });
    }
  };

  if (!mounted || !isInitialized || !user) {
    return (
      <div className="bg-[#05050A] min-h-screen pt-28 flex items-center justify-center font-mono">
        <div className="text-arc-cyan text-sm font-bold uppercase tracking-widest animate-pulse flex items-center gap-2">
          <RiRobot2Line className="text-xl" />
          <span>J.A.R.V.I.S. Loading Agent HUD...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#05050A] min-h-screen pt-28 pb-16 text-white font-mono">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

        {/* Avengers Identity Card Header */}
        <div className="marvel-card p-6 md:p-8 rounded-3xl border border-arc-cyan/40 bg-gradient-to-r from-[#0F1424] via-[#05050A] to-[#140810] flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-[0_0_35px_rgba(0,212,255,0.15)]">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-marvel-red/10 border border-marvel-red/40 text-marvel-red text-[10px] font-bold rounded-full uppercase tracking-wider">
              <RiShieldFlashLine className="animate-pulse" />
              <span>S.H.I.E.L.D. AGENT IDENTITY CARD • CLEARANCE LEVEL 10</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-wider" style={{ fontFamily: "var(--font-heading)" }}>
              AGENT <span className="gradient-text-gold neon-gold">{user.name.toUpperCase()}</span>
            </h1>
            <p className="text-white/60 text-xs">
              Institution: <strong className="text-white">{user.college}</strong> • Email: <strong className="text-arc-cyan">{user.email}</strong>
            </p>
          </div>

          <div className="flex gap-4 items-center bg-black/60 border border-white/10 p-4 rounded-2xl">
            <div className="text-right">
              <span className="block text-[10px] text-white/40 uppercase font-black">Hero Power Level</span>
              <span className="text-metallic-gold text-lg font-black">{user.xpPoints || 1250} XP</span>
            </div>
            <div className="w-12 h-12 rounded-full bg-arc-cyan/20 border border-arc-cyan/50 flex items-center justify-center text-arc-cyan text-xl shadow-[0_0_15px_#00D4FF]">
              🦸
            </div>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Left - main content widgets */}
          <div className="lg:col-span-8 space-y-8">
            {/* Registered events list */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-arc-cyan uppercase tracking-wider flex items-center gap-2" style={{ fontFamily: "var(--font-heading)" }}>
                <RiAwardLine className="text-arc-cyan" />
                Active Assigned Missions ({activeRegistrations.length})
              </h2>

              {activeRegistrations.length === 0 ? (
                <div className="marvel-card p-8 rounded-2xl border border-white/10 text-center text-white/40 text-xs space-y-3">
                  <p>No active MCU missions assigned to your agent profile.</p>
                  <div>
                    <Link href="/events" className="btn-primary text-xs px-5 py-2.5 shadow-[0_0_15px_#ED1D24]">
                      Explore Missions
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {activeRegistrations.map((reg) => {
                    const event = typeof reg.eventId === "object" ? (reg.eventId as any) : null;
                    if (!event) return null;
                    const isGenerating = generatingTicketId === reg._id;
                    return (
                      <div key={reg._id} className="marvel-card p-6 rounded-2xl border border-arc-cyan/20 space-y-4 hover:border-arc-cyan transition-all duration-300 flex flex-col justify-between shadow-xl">
                        <div>
                          <div className="flex justify-between items-start">
                            <span className="px-2.5 py-0.5 rounded bg-marvel-red/20 border border-marvel-red/40 text-[9px] uppercase tracking-widest text-marvel-red font-bold">
                              {event.category || event.type}
                            </span>
                            <span className="text-[10px] font-mono text-arc-cyan font-bold bg-arc-cyan/10 px-2 py-0.5 rounded border border-arc-cyan/30">
                              {reg.entryPass}
                            </span>
                          </div>
                          <h3 className="text-base font-bold text-white mt-2 truncate uppercase" style={{ fontFamily: "var(--font-heading)" }}>
                            {event.title}
                          </h3>
                        </div>

                        <div className="space-y-2 text-xs text-white/60 border-t border-white/10 pt-3">
                          <div className="flex justify-between">
                            <span>Date:</span>
                            <span className="font-semibold text-white">{event.date}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Time:</span>
                            <span className="font-semibold text-white">{event.time}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Sector:</span>
                            <span className="font-semibold text-arc-cyan truncate max-w-[150px]">{event.venue}</span>
                          </div>
                        </div>

                        {/* Ticket Download, QR Inspect & Cancel Event Actions */}
                        <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => handleDownloadTicket(reg)}
                              disabled={isGenerating}
                              className="flex-1 py-2 px-3 rounded-xl bg-arc-cyan text-black text-xs font-bold uppercase tracking-wider hover:bg-white transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-[0_0_10px_#00D4FF]"
                              style={{ fontFamily: "var(--font-heading)" }}
                            >
                              <RiDownloadLine />
                              <span>{isGenerating ? "Generating..." : "Download Pass"}</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleInspectQrDetails(reg)}
                              className="py-2 px-3 rounded-xl bg-white/5 hover:bg-white/15 text-white/80 hover:text-white border border-white/10 text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
                              title="Inspect QR Code Details"
                            >
                              <RiQrCodeLine className="text-base text-arc-cyan" />
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleOpenCancelModal(reg)}
                            className="w-full py-1.5 px-3 rounded-xl bg-marvel-red/10 hover:bg-marvel-red/20 text-marvel-red border border-marvel-red/30 text-[10px] font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <RiCloseLine className="text-sm" />
                            <span>Cancel Registration (No Refund)</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Cancelled Registrations Section (if any) */}
            {cancelledRegistrations.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-white/10">
                <h2 className="text-lg font-bold text-marvel-red uppercase tracking-wider flex items-center gap-2" style={{ fontFamily: "var(--font-heading)" }}>
                  <RiCloseLine className="text-marvel-red" />
                  Aborted Registrations ({cancelledRegistrations.length})
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 opacity-75">
                  {cancelledRegistrations.map((reg) => {
                    const event = typeof reg.eventId === "object" ? (reg.eventId as any) : null;
                    return (
                      <div key={reg._id} className="marvel-card p-5 rounded-2xl border border-marvel-red/30 bg-marvel-red/5 space-y-3">
                        <div className="flex justify-between items-start">
                          <span className="px-2 py-0.5 rounded bg-marvel-red/20 text-marvel-red border border-marvel-red/40 text-[9px] font-bold uppercase tracking-widest">
                            ABORTED (NO REFUND)
                          </span>
                          <span className="text-[10px] font-mono text-white/40">{reg.entryPass}</span>
                        </div>

                        <div>
                          <h3 className="text-base font-bold text-white line-through text-white/60">
                            {event?.title || "Event Registration"}
                          </h3>
                          <p className="text-[10px] text-marvel-red/80 mt-1">
                            {reg.cancellationPolicyNotice || "Cancelled by participant without refund of money per event policy."}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* S.H.I.E.L.D. Badges */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-metallic-gold uppercase tracking-wider flex items-center gap-2" style={{ fontFamily: "var(--font-heading)" }}>
                <RiHistoryLine className="text-metallic-gold" />
                S.H.I.E.L.D. Honor Badges ({user.badges?.length || 0})
              </h2>

              <div className="marvel-card p-6 rounded-2xl border border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4">
                {user.badges && user.badges.length > 0 ? (
                  user.badges.map((badge: any, i: number) => (
                    <div key={i} className="p-4 bg-white/5 border border-white/10 rounded-xl text-center space-y-2">
                      <div className="text-3xl text-metallic-gold">🛡️</div>
                      <span className="block text-xs font-bold text-white uppercase tracking-wider" style={{ fontFamily: "var(--font-heading)" }}>{badge.name}</span>
                    </div>
                  ))
                ) : (
                  <div className="col-span-4 text-center text-white/40 text-xs">No hero badges unlocked yet. Complete missions to earn S.H.I.E.L.D. honors.</div>
                )}
              </div>
            </div>
          </div>

          {/* Right - QR entry pass sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {activeRegistrations.length > 0 ? (
              <div className="stark-panel p-6 md:p-8 rounded-2xl border border-arc-cyan/40 text-center space-y-6 shadow-2xl relative">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-white uppercase tracking-wider flex items-center justify-center gap-2" style={{ fontFamily: "var(--font-heading)" }}>
                    <RiQrCodeLine className="text-arc-cyan" />
                    S.H.I.E.L.D. QR Agent Pass
                  </h3>
                  <p className="text-[10px] text-white/50">
                    Present at Avengers Headquarters security checkpoints
                  </p>
                </div>

                {/* QR Code */}
                <div className="p-4 bg-white rounded-2xl w-52 h-52 mx-auto flex items-center justify-center border border-white/10 shadow-[0_0_20px_#00D4FF] relative group cursor-pointer" onClick={() => handleInspectQrDetails(activeRegistrations[0])}>
                  <div className="relative w-full h-full">
                    <Image
                      src={activeRegistrations[0].qrCode}
                      alt="Agent Pass QR Verification Code"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>

                <div className="text-xs text-white/60 space-y-2 border-t border-white/10 pt-4">
                  <div className="flex justify-between">
                    <span>Agent Pass ID:</span>
                    <span className="font-semibold text-arc-cyan uppercase tracking-wider">{activeRegistrations[0].entryPass}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Security Clearance:</span>
                    <span className="font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                      <RiShieldCheckLine /> LEVEL 10 ACTIVE
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleDownloadTicket(activeRegistrations[0])}
                  className="w-full py-3 bg-arc-cyan text-black hover:bg-white font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all shadow-[0_0_15px_#00D4FF] flex items-center justify-center gap-2 cursor-pointer"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  <RiDownloadLine className="text-base" />
                  <span>Download S.H.I.E.L.D. Ticket PDF</span>
                </button>
              </div>
            ) : (
              <div className="marvel-card p-6 md:p-8 rounded-2xl border border-white/10 text-center space-y-4">
                <div className="text-4xl text-white/30">🛡️</div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">No Active Agent Pass</h3>
                <p className="text-xs text-white/50">Enroll in a mission to generate your verified S.H.I.E.L.D. agent pass code.</p>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* QR Inspector Modal */}
      {isQrModalOpen && selectedReg && (
        <div className="fixed inset-0 z-[200] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-strong border border-arc-cyan/40 w-full max-w-md rounded-3xl p-6 space-y-6 relative animate-scale-in">
            
            <button
              type="button"
              onClick={() => setIsQrModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer"
            >
              <RiCloseLine size={20} />
            </button>

            <div className="text-center space-y-1">
              <span className="text-[10px] text-arc-cyan uppercase font-bold tracking-widest">S.H.I.E.L.D. QR Inspector</span>
              <h3 className="text-xl font-black text-white uppercase" style={{ fontFamily: "var(--font-heading)" }}>
                {typeof selectedReg.eventId === "object" ? selectedReg.eventId.title : "Mission Pass"}
              </h3>
              <p className="text-xs text-emerald-400 font-bold flex items-center justify-center gap-1">
                <RiShieldCheckLine /> Clearance Verified
              </p>
            </div>

            <div className="p-4 bg-white rounded-2xl w-48 h-48 mx-auto flex items-center justify-center shadow-2xl relative">
              {activeQrCodeUrl ? (
                <img
                  src={activeQrCodeUrl}
                  alt="Scannable Entry QR Code"
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="text-xs text-black/50">Generating QR...</div>
              )}
            </div>

            <div className="bg-black/60 border border-white/10 p-4 rounded-2xl space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-white/50">Agent Name:</span>
                <span className="text-white font-bold">{user.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Institution:</span>
                <span className="text-white truncate max-w-[180px]">{user.college}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleDownloadTicket(selectedReg)}
              className="w-full py-3 bg-arc-cyan hover:bg-white text-black font-black text-xs uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_15px_#00D4FF]"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              <RiDownloadLine className="text-base" />
              <span>Download Agent Pass PDF</span>
            </button>

          </div>
        </div>
      )}

      {/* Cancellation Modal */}
      {isCancelModalOpen && cancellingReg && (
        <div className="fixed inset-0 z-[200] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-strong border border-marvel-red/40 w-full max-w-lg rounded-3xl p-6 sm:p-8 space-y-6 relative animate-scale-in shadow-2xl font-mono">

            <button
              type="button"
              onClick={() => {
                if (!isCancelling) {
                  setIsCancelModalOpen(false);
                  setCancellingReg(null);
                }
              }}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              disabled={isCancelling}
            >
              <RiCloseLine size={20} />
            </button>

            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-full bg-marvel-red/20 border border-marvel-red/40 text-marvel-red flex items-center justify-center mx-auto text-2xl">
                <RiInformationLine />
              </div>
              <h3 className="text-xl font-black text-white uppercase tracking-wider" style={{ fontFamily: "var(--font-heading)" }}>
                Cancel Mission Registration
              </h3>
              <p className="text-xs font-semibold text-marvel-red">
                {typeof cancellingReg.eventId === "object" ? cancellingReg.eventId.title : "Mission Registration"}
              </p>
            </div>

            <div className="bg-marvel-red/10 border border-marvel-red/30 rounded-2xl p-4 space-y-2 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-marvel-red uppercase tracking-wide">
                <RiInformationLine className="text-base" />
                <span>Non-Refundable Policy Notice</span>
              </div>
              <p className="text-white/80 leading-relaxed">
                Confirm aborting your mission assignment?
              </p>
              <p className="text-marvel-red font-semibold bg-marvel-red/20 p-2.5 rounded-xl border border-marvel-red/40">
                ⚠️ <strong>Note:</strong> Per S.H.I.E.L.D. policy, <strong>NO REFUND OF MONEY</strong> is issued upon cancellation.
              </p>
            </div>

            {cancelMsg && (
              <div className={`p-3.5 rounded-xl text-xs font-bold text-center border ${cancelMsg.isError ? "bg-marvel-red/20 text-marvel-red border-marvel-red/40" : "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"}`}>
                {cancelMsg.text}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsCancelModalOpen(false);
                  setCancellingReg(null);
                }}
                disabled={isCancelling}
                className="flex-1 py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
              >
                Keep Mission
              </button>

              <button
                type="button"
                onClick={handleConfirmCancelRegistration}
                disabled={isCancelling}
                className="flex-1 py-3 px-4 rounded-xl bg-marvel-red hover:bg-white hover:text-black text-white font-black text-xs uppercase tracking-widest transition-all cursor-pointer shadow-[0_0_15px_#ED1D24] flex items-center justify-center gap-2"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {isCancelling ? (
                  <span>Processing...</span>
                ) : (
                  <>
                    <RiCloseLine className="text-base" />
                    <span>Confirm Abort (No Refund)</span>
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
