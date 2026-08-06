"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound, useRouter } from "next/navigation";
import {
  RiTrophyLine,
  RiMapPinLine,
  RiTimeLine,
  RiContactsLine,
  RiShieldLine,
  RiBankCardLine,
  RiCheckLine,
  RiCloseLine,
  RiLockLine,
  RiDownloadLine,
  RiBankLine,
  RiSmartphoneLine,
  RiShieldCheckLine,
  RiRobot2Line,
  RiFlashlightLine,
} from "react-icons/ri";
import { api } from "@/lib/api";
import { useAuthStore } from "@/lib/authStore";
import { Event } from "@/types";
import { downloadEventTicketPDF } from "@/lib/ticketGenerator";

export default function EventDetailClient({ slug }: { slug: string }) {
  const router = useRouter();

  const { user, registrations, registerForEvent } = useAuthStore();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [msg, setMsg] = useState({ text: "", isError: false });

  // Payment Modal States
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card" | "netbanking">("upi");
  const [upiId, setUpiId] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [paymentStep, setPaymentStep] = useState<"checkout" | "processing" | "success">("checkout");
  const [completedTxId, setCompletedTxId] = useState("");
  const [createdRegistration, setCreatedRegistration] = useState<any | null>(null);

  const entryFee = 250;

  useEffect(() => {
    async function loadEvent() {
      try {
        const res = await api.get(`/events/${slug}`);
        if (res.data && res.data.success) {
          setEvent(res.data.event);
        }
      } catch (err) {
        console.error("Failed to load event details", err);
      } finally {
        setLoading(false);
      }
    }
    loadEvent();
  }, [slug]);

  if (loading) {
    return (
      <div className="bg-[#05050A] min-h-screen pt-28 flex items-center justify-center font-mono">
        <div className="text-arc-cyan text-sm font-bold uppercase tracking-widest animate-pulse flex items-center gap-2">
          <RiRobot2Line className="text-xl" />
          <span>J.A.R.V.I.S. Loading Mission Briefing...</span>
        </div>
      </div>
    );
  }

  if (!event) {
    notFound();
  }

  const isRegistered = registrations.some(
    (r) =>
      r.status !== "cancelled" &&
      (r.eventId === event._id || (typeof r.eventId === "object" && (r.eventId as any)?._id === event._id))
  );
  const isFull = event.registeredCount >= event.maxSeats;

  const handleOpenCheckout = () => {
    if (!user) {
      router.push("/signin");
      return;
    }
    setUpiId(`${user.email.split("@")[0]}@okaxis`);
    setCardNumber("4532 •••• •••• 8892");
    setPaymentStep("checkout");
    setIsPaymentModalOpen(true);
  };

  const handleProcessPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentStep("processing");
    setRegistering(true);

    const generatedTxId = `TXN_MF2K26_${Math.floor(10000000 + Math.random() * 90000000)}`;

    setTimeout(async () => {
      const res = await registerForEvent(event._id, {
        paymentId: generatedTxId,
        paymentMethod: paymentMethod.toUpperCase(),
        amount: entryFee
      });
      setRegistering(false);

      if (res.success) {
        setCompletedTxId(res.txId || generatedTxId);
        setCreatedRegistration(res.registration);
        setPaymentStep("success");
      } else {
        setPaymentStep("checkout");
        setMsg({ text: res.message || "Mission registration verification failed.", isError: true });
        setIsPaymentModalOpen(false);
      }
    }, 1200);
  };

  const handleDownloadTicketFromModal = async () => {
    if (createdRegistration && event && user) {
      await downloadEventTicketPDF(createdRegistration, event, user);
    }
  };

  return (
    <div className="bg-[#05050A] min-h-screen pt-28 pb-16 text-white font-mono relative overflow-hidden">
      {/* Background Marvel Video Loop (High Visibility) */}
      <div className="absolute inset-0 z-0 overflow-hidden opacity-75 pointer-events-none">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover filter brightness-110 contrast-115 scale-105"
        >
          <source src="/MARVEL/Video Project 5.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-[#05050A]/40 via-[#05050A]/60 to-[#05050A]/90" />
      </div>


      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">


        {/* Mission Header Banner */}
        <div className="relative h-72 md:h-[420px] w-full rounded-3xl overflow-hidden border border-arc-cyan/30 shadow-[0_0_50px_rgba(0,0,0,0.9)]">
          <div className="absolute inset-0 bg-gradient-to-t from-[#05050A] via-[#05050A]/60 to-transparent z-10" />
          {event.coverImage && (
            <Image
              src={event.coverImage}
              alt={event.title}
              fill
              className="object-cover opacity-80"
              priority
            />
          )}
          <div className="absolute bottom-6 left-6 md:left-12 z-20 space-y-2">
            <div className="flex gap-2">
              <span className="px-3.5 py-1.5 text-[10px] font-bold tracking-widest uppercase rounded-full bg-marvel-red text-white shadow-[0_0_15px_#ED1D24]">
                🦸 MCU BRIEFING • {event.category}
              </span>
              <span className="px-3 py-1.5 text-[10px] font-bold tracking-widest uppercase rounded-full bg-black/80 text-arc-cyan border border-arc-cyan/40">
                LEVEL: ALPHA
              </span>
            </div>
            <h1 className="text-3xl md:text-6xl font-black text-white uppercase tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
              {event.title}
            </h1>
          </div>
        </div>

        {/* Content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Left main details */}
          <div className="lg:col-span-8 space-y-8">
            <div className="marvel-card p-6 md:p-8 rounded-2xl border border-white/10 space-y-4">
              <h2 className="text-xl font-bold text-arc-cyan uppercase tracking-wider flex items-center gap-2" style={{ fontFamily: "var(--font-heading)" }}>
                <RiFlashlightLine /> Mission Directives
              </h2>
              <p className="text-white/70 leading-relaxed text-sm">
                {event.description}
              </p>
            </div>

            {/* Rules Accordion */}
            {event.rules && event.rules.length > 0 && (
              <div className="marvel-card p-6 md:p-8 rounded-2xl border border-white/10 space-y-4">
                <h2 className="text-xl font-bold text-metallic-gold uppercase tracking-wider flex items-center gap-2" style={{ fontFamily: "var(--font-heading)" }}>
                  <RiShieldLine className="text-metallic-gold" />
                  S.H.I.E.L.D. Protocol Rules & Guidelines
                </h2>
                <ul className="space-y-3 pl-5 list-disc text-white/70 text-xs leading-relaxed">
                  {event.rules.map((rule: string, i: number) => (
                    <li key={i}>{rule}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Right sidebar panel */}
          <div className="lg:col-span-4 space-y-6">
            <div className="stark-panel p-6 md:p-8 rounded-2xl border border-arc-cyan/30 space-y-6">
              <h3 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2" style={{ fontFamily: "var(--font-heading)" }}>
                <RiShieldCheckLine className="text-arc-cyan" /> Mission Intelligence
              </h3>

              <div className="space-y-4 text-xs text-white/70">
                <div className="flex items-center gap-3">
                  <RiTrophyLine className="text-metallic-gold text-xl" />
                  <div>
                    <span className="block text-[10px] text-white/40 uppercase">Bounty Reward Pool</span>
                    <span className="font-bold text-white text-sm">₹{event.prizePool.toLocaleString("en-IN")}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <RiMapPinLine className="text-arc-cyan text-xl" />
                  <div>
                    <span className="block text-[10px] text-white/40 uppercase">HQ Venue</span>
                    <span className="font-medium text-white">{event.venue}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <RiTimeLine className="text-marvel-red text-xl" />
                  <div>
                    <span className="block text-[10px] text-white/40 uppercase">Date & Time</span>
                    <span className="font-medium text-white">{event.time}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <RiLockLine className="text-emerald-400 text-xl" />
                  <div>
                    <span className="block text-[10px] text-white/40 uppercase">Entry Clearance Fee</span>
                    <span className="font-bold text-emerald-400">₹{entryFee} (Payment Clearance Required)</span>
                  </div>
                </div>

                {event.coordinator && (
                  <div className="flex items-center gap-3">
                    <RiContactsLine className="text-vibranium-purple text-xl" />
                    <div>
                      <span className="block text-[10px] text-white/40 uppercase">Mission Lead</span>
                      <span className="font-medium text-white">{event.coordinator.name} ({event.coordinator.phone})</span>
                    </div>
                  </div>
                )}
              </div>

              {msg.text && (
                <div className={`p-3 text-xs rounded-xl text-center border ${msg.isError ? "bg-marvel-red/20 border-marvel-red/40 text-marvel-red" : "bg-arc-cyan/20 border-arc-cyan/40 text-arc-cyan"
                  }`}>
                  {msg.text}
                </div>
              )}

              <div className="pt-4 border-t border-white/10 space-y-4">
                <div className="flex justify-between items-center text-xs text-white/50 font-bold uppercase tracking-wider">
                  <span>Slots Open:</span>
                  <span className="text-metallic-gold font-black">{event.maxSeats - event.registeredCount} Slots Left</span>
                </div>

                {isRegistered ? (
                  <Link href="/dashboard" className="btn-outline w-full text-center flex justify-center py-3.5 border-arc-cyan text-arc-cyan">
                    <span>Mission Assigned — View Agent Pass</span>
                  </Link>
                ) : isFull ? (
                  <button disabled className="btn-outline w-full text-center flex justify-center py-3.5 border-white/10 text-white/40 cursor-not-allowed">
                    <span>Mission Full</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    suppressHydrationWarning={true}
                    onClick={handleOpenCheckout}
                    className="btn-primary w-full text-center flex justify-center py-3.5 cursor-pointer shadow-[0_0_20px_#ED1D24]"
                  >
                    <span>{user ? `Pay ₹${entryFee} & Join Mission` : "Agent Login to Join"}</span>
                  </button>
                )}
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Jarvis AI Guided Payment Gateway Modal */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-[200] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-strong border border-arc-cyan/40 w-full max-w-lg rounded-3xl p-6 md:p-8 space-y-6 relative animate-scale-in">

            <button
              type="button"
              suppressHydrationWarning={true}
              onClick={() => setIsPaymentModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer"
            >
              <RiCloseLine size={20} />
            </button>

            {paymentStep === "checkout" && (
              <form onSubmit={handleProcessPayment} className="space-y-6 font-mono">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-arc-cyan/10 border border-arc-cyan/30 rounded-full text-arc-cyan text-[10px] font-bold uppercase tracking-wider mb-2">
                    <RiRobot2Line /> J.A.R.V.I.S. GUIDED MISSION CLEARANCE
                  </div>
                  <h3 className="text-xl font-black text-white uppercase" style={{ fontFamily: "var(--font-heading)" }}>
                    Mission Registration & Clearance
                  </h3>
                  <p className="text-xs text-white/60 mt-1">
                    Complete your ₹{entryFee} entry clearance to generate your official S.H.I.E.L.D. agent pass.
                  </p>
                </div>

                {/* Order Summary */}
                <div className="bg-black/60 border border-white/10 p-4 rounded-2xl space-y-2 text-xs">
                  <div className="flex justify-between border-b border-white/10 pb-2">
                    <span className="text-white/50">Target Mission:</span>
                    <span className="font-bold text-white">{event.title}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/10 pb-2">
                    <span className="text-white/50">Agent Name:</span>
                    <span className="text-white">{user?.name} ({user?.college})</span>
                  </div>
                  <div className="flex justify-between text-sm pt-1">
                    <span className="font-bold text-white">Clearance Fee:</span>
                    <span className="font-black text-metallic-gold">₹{entryFee}</span>
                  </div>
                </div>

                {/* Payment Method Selector */}
                <div className="space-y-3">
                  <label className="block text-xs font-bold text-white/80 uppercase tracking-wider">
                    Select Payment Gateway Method
                  </label>

                  <div className="grid grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("upi")}
                      className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-2 cursor-pointer transition-all ${paymentMethod === "upi"
                        ? "bg-arc-cyan/20 border-arc-cyan text-arc-cyan shadow-[0_0_15px_#00D4FF]"
                        : "bg-white/5 border-white/10 text-white/60 hover:text-white"
                        }`}
                    >
                      <RiSmartphoneLine className="text-xl" />
                      <span>UPI / GPay</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod("card")}
                      className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-2 cursor-pointer transition-all ${paymentMethod === "card"
                        ? "bg-arc-cyan/20 border-arc-cyan text-arc-cyan shadow-[0_0_15px_#00D4FF]"
                        : "bg-white/5 border-white/10 text-white/60 hover:text-white"
                        }`}
                    >
                      <RiBankCardLine className="text-xl" />
                      <span>Stark Card</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod("netbanking")}
                      className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-2 cursor-pointer transition-all ${paymentMethod === "netbanking"
                        ? "bg-arc-cyan/20 border-arc-cyan text-arc-cyan shadow-[0_0_15px_#00D4FF]"
                        : "bg-white/5 border-white/10 text-white/60 hover:text-white"
                        }`}
                    >
                      <RiBankLine className="text-xl" />
                      <span>Netbanking</span>
                    </button>
                  </div>
                </div>

                {paymentMethod === "upi" && (
                  <div className="space-y-2">
                    <label className="block text-xs text-white/70">Virtual Payment Address (UPI ID)</label>
                    <input
                      type="text"
                      required
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white/5 border border-arc-cyan/30 rounded-xl text-white text-xs focus:border-arc-cyan focus:outline-none"
                    />
                  </div>
                )}

                {paymentMethod === "card" && (
                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block text-white/70 mb-1">Card Number</label>
                      <input
                        type="text"
                        required
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:border-arc-cyan focus:outline-none font-mono"
                      />
                    </div>
                  </div>
                )}

                {paymentMethod === "netbanking" && (
                  <div className="space-y-2 text-xs">
                    <label className="block text-white/70">Select Bank</label>
                    <select
                      className="w-full px-4 py-2.5 bg-[#05050A] border border-white/10 rounded-xl text-white focus:border-arc-cyan focus:outline-none"
                    >
                      <option value="sbi">State Bank of India (SBI)</option>
                      <option value="hdfc">HDFC Bank</option>
                      <option value="icici">ICICI Bank</option>
                    </select>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3.5 bg-marvel-red hover:bg-white hover:text-black text-white font-black text-xs uppercase tracking-widest rounded-2xl transition-all duration-300 cursor-pointer shadow-[0_0_20px_#ED1D24] flex items-center justify-center gap-2"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  <RiLockLine />
                  <span>Authorize ₹{entryFee} & Join Mission</span>
                </button>
              </form>
            )}

            {paymentStep === "processing" && (
              <div className="py-12 text-center space-y-4 font-mono">
                <div className="w-16 h-16 border-4 border-arc-cyan border-t-transparent rounded-full animate-spin mx-auto shadow-[0_0_20px_#00D4FF]" />
                <h4 className="text-xl font-bold text-white uppercase" style={{ fontFamily: "var(--font-heading)" }}>
                  J.A.R.V.I.S. Verifying Clearance...
                </h4>
                <p className="text-xs text-white/60">
                  Connecting to bank gateway endpoint & issuing S.H.I.E.L.D. mission pass.
                </p>
              </div>
            )}

            {paymentStep === "success" && (
              <div className="text-center space-y-6 py-4 font-mono">
                <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto text-3xl border border-emerald-500/40 shadow-[0_0_20px_#10B981]">
                  <RiCheckLine />
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-white uppercase" style={{ fontFamily: "var(--font-heading)" }}>
                    MISSION ASSIGNED & CLEARED!
                  </h3>
                  <p className="text-xs text-white/70">
                    Agent registration of <strong className="text-emerald-400">₹{entryFee}</strong> for <strong className="text-white">{event.title}</strong> is verified.
                  </p>
                </div>

                <div className="bg-black/60 border border-arc-cyan/30 p-4 rounded-2xl text-left space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-white/50 uppercase font-bold text-[10px]">Payment Reference ID</span>
                    <span className="font-mono text-emerald-400 font-bold">{completedTxId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50 uppercase font-bold text-[10px]">Agent Pass Code</span>
                    <span className="font-mono text-metallic-gold font-bold">{createdRegistration?.entryPass}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <button
                    type="button"
                    onClick={handleDownloadTicketFromModal}
                    className="w-full py-3 bg-arc-cyan hover:bg-white text-black font-extrabold text-xs uppercase tracking-widest rounded-2xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_15px_#00D4FF]"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    <RiDownloadLine className="text-base" />
                    <span>Download Official S.H.I.E.L.D. Mission Pass (PDF)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => router.push("/dashboard")}
                    className="w-full py-2.5 bg-white/10 text-white font-bold text-xs uppercase tracking-widest rounded-2xl hover:bg-white/20 transition-colors cursor-pointer"
                  >
                    Return to Agent HUD
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}
