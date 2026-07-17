"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound, useRouter } from "next/navigation";
import { RiTrophyLine, RiMapPinLine, RiTimeLine, RiContactsLine, RiShieldLine } from "react-icons/ri";
import { api } from "@/lib/api";
import { useAuthStore } from "@/lib/authStore";
import { Event } from "@/types";

export default function EventDetailClient({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const { user, registrations, registerForEvent } = useAuthStore();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [msg, setMsg] = useState({ text: "", isError: false });

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
      <div className="bg-festival-dark min-h-screen pt-28 flex items-center justify-center">
        <div className="text-white text-sm font-bold uppercase tracking-widest animate-pulse">Loading Arena Details...</div>
      </div>
    );
  }

  if (!event) {
    notFound();
  }

  const isRegistered = registrations.some((r) => r.eventId === event._id || (typeof r.eventId === "object" && (r.eventId as any)?._id === event._id));
  const isFull = event.registeredCount >= event.maxSeats;

  const handleRegister = async () => {
    if (!user) {
      router.push("/signin");
      return;
    }
    setRegistering(true);
    setMsg({ text: "", isError: false });
    const res = await registerForEvent(event._id);
    setRegistering(false);
    if (res.success) {
      setMsg({ text: "Registration Successful! Pass created in your dashboard.", isError: false });
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } else {
      setMsg({ text: res.message || "Failed to register.", isError: true });
    }
  };

  return (
    <div className="bg-festival-dark min-h-screen pt-28 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

        {/* Banner with cover */}
        <div className="relative h-64 md:h-[400px] w-full rounded-3xl overflow-hidden border border-white/5 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-t from-festival-dark via-festival-dark/50 to-transparent z-10" />
          {event.coverImage && (
            <Image
              src={event.coverImage}
              alt={event.title}
              fill
              className="object-cover"
              priority
            />
          )}
          <div className="absolute bottom-6 left-6 md:left-12 z-20 space-y-2">
            <span className="px-3.5 py-1.5 text-xs font-bold tracking-widest uppercase rounded-full bg-festival-gold text-festival-dark" style={{ fontFamily: "var(--font-heading)" }}>
              {event.category}
            </span>
            <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
              {event.title}
            </h1>
          </div>
        </div>

        {/* Content columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Left main details */}
          <div className="lg:col-span-8 space-y-8">
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white uppercase tracking-wider" style={{ fontFamily: "var(--font-heading)" }}>
                About the Event
              </h2>
              <p className="text-white/60 leading-relaxed">
                {event.description}
              </p>
            </div>

            {/* Rules Accordion */}
            {event.rules && event.rules.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-white uppercase tracking-wider flex items-center gap-2" style={{ fontFamily: "var(--font-heading)" }}>
                  <RiShieldLine className="text-festival-gold" />
                  Rules & Guidelines
                </h2>
                <ul className="space-y-3 pl-5 list-disc text-white/60 text-sm">
                  {event.rules.map((rule: string, i: number) => (
                    <li key={i}>{rule}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Right sidebar panel */}
          <div className="lg:col-span-4 space-y-6">
            <div className="glass p-6 md:p-8 rounded-2xl border border-white/5 space-y-6">
              <h3 className="text-lg font-bold text-white uppercase tracking-wider" style={{ fontFamily: "var(--font-heading)" }}>
                Event Details
              </h3>

              <div className="space-y-4 text-sm text-white/70">
                <div className="flex items-center gap-3">
                  <RiTrophyLine className="text-festival-gold text-xl" />
                  <div>
                    <span className="block text-xs text-white/40">Prize Pool</span>
                    <span className="font-bold text-white">₹{event.prizePool.toLocaleString("en-IN")}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <RiMapPinLine className="text-festival-cyan text-xl" />
                  <div>
                    <span className="block text-xs text-white/40">Venue</span>
                    <span className="font-medium text-white">{event.venue}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <RiTimeLine className="text-festival-pink text-xl" />
                  <div>
                    <span className="block text-xs text-white/40">Date & Time</span>
                    <span className="font-medium text-white">{event.time}</span>
                  </div>
                </div>

                {event.coordinator && (
                  <div className="flex items-center gap-3">
                    <RiContactsLine className="text-festival-purple text-xl" />
                    <div>
                      <span className="block text-xs text-white/40">Coordinator</span>
                      <span className="font-medium text-white">{event.coordinator.name} ({event.coordinator.phone})</span>
                    </div>
                  </div>
                )}
              </div>

              {msg.text && (
                <div className={`p-3 text-xs rounded-xl text-center border ${msg.isError ? "bg-festival-pink/15 border-festival-pink/30 text-festival-pink" : "bg-festival-cyan/15 border-festival-cyan/30 text-festival-cyan"
                  }`}>
                  {msg.text}
                </div>
              )}

              <div className="pt-4 border-t border-white/5 space-y-4">
                <div className="flex justify-between items-center text-xs text-white/40 font-bold uppercase tracking-wider" style={{ fontFamily: "var(--font-heading)" }}>
                  <span>Seats Available:</span>
                  <span className="text-festival-gold font-black">{event.maxSeats - event.registeredCount} Slots</span>
                </div>

                {isRegistered ? (
                  <Link href="/dashboard" className="btn-outline w-full text-center flex justify-center py-3.5 border-festival-cyan text-festival-cyan">
                    <span>Already Registered — View Pass</span>
                  </Link>
                ) : isFull ? (
                  <button disabled className="btn-outline w-full text-center flex justify-center py-3.5 border-white/10 text-white/40 cursor-not-allowed">
                    <span>Arena Full</span>
                  </button>
                ) : (
                  <button
                    onClick={handleRegister}
                    disabled={registering}
                    className="btn-primary w-full text-center flex justify-center py-3.5 cursor-pointer"
                  >
                    <span>{registering ? "Processing..." : user ? "Register Event" : "Login to Register"}</span>
                  </button>
                )}
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
