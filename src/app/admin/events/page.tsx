"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  RiAddLine, 
  RiEditLine, 
  RiDeleteBin7Line, 
  RiArrowLeftLine, 
  RiCloseLine, 
  RiSaveLine 
} from "react-icons/ri";
import { api } from "@/lib/api";
import { Event } from "@/types";

export default function AdminEventsCRUDPage() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  // Form Fields
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [rules, setRules] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [date, setDate] = useState("15 Nov 2025");
  const [time, setTime] = useState("");
  const [venue, setVenue] = useState("");
  const [category, setCategory] = useState<any>("gaming");
  const [type, setType] = useState<any>("squad");
  const [prizePool, setPrizePool] = useState(0);
  const [maxSeats, setMaxSeats] = useState(20);
  const [coordName, setCoordName] = useState("");
  const [coordPhone, setCoordPhone] = useState("");
  const [coordEmail, setCoordEmail] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const loadEvents = async () => {
    try {
      const res = await api.get("/events");
      if (res.data && res.data.success) {
        setEvents(res.data.events);
      }
    } catch (err) {
      console.error("Failed to load events in admin CRUD", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Redirect if not admin
    const token = localStorage.getItem("macfiesta_token");
    const localUser = localStorage.getItem("macfiesta_user");
    if (!token || !localUser) {
      router.push("/signin");
      return;
    }
    const u = JSON.parse(localUser);
    if (u.role !== "admin") {
      router.push("/signin");
      return;
    }
    loadEvents();
  }, [router]);

  const handleDelete = async (eventSlug: string, eventTitle: string) => {
    if (confirm(`Are you sure you want to delete "${eventTitle}"? This will erase all registrations and scores.`)) {
      try {
        const res = await api.delete(`/events/${eventSlug}`);
        if (res.data.success) {
          setEvents(events.filter((e) => e.slug !== eventSlug));
        }
      } catch (err: any) {
        alert(err.response?.data?.message || "Delete failed");
      }
    }
  };

  const handleOpenCreateModal = () => {
    setEditingEvent(null);
    setTitle("");
    setSlug("");
    setDescription("");
    setRules("");
    setCoverImage("https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop");
    setDate("15 Nov 2025");
    setTime("Day 1, 11:00 AM onwards");
    setVenue("");
    setCategory("gaming");
    setType("squad");
    setPrizePool(20000);
    setMaxSeats(15);
    setCoordName("");
    setCoordPhone("");
    setCoordEmail("");
    setErrorMsg("");
    setShowModal(true);
  };

  const handleOpenEditModal = (evt: Event) => {
    setEditingEvent(evt);
    setTitle(evt.title);
    setSlug(evt.slug);
    setDescription(evt.description);
    setRules(evt.rules?.join("\n") || "");
    setCoverImage(evt.coverImage);
    setDate(evt.date);
    setTime(evt.time);
    setVenue(evt.venue);
    setCategory(evt.category);
    setType(evt.type);
    setPrizePool(evt.prizePool);
    setMaxSeats(evt.maxSeats);
    setCoordName(evt.coordinator?.name || "");
    setCoordPhone(evt.coordinator?.phone || "");
    setCoordEmail(evt.coordinator?.email || "");
    setErrorMsg("");
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const payload = {
      title,
      slug,
      description,
      rules: rules.split("\n").filter((r) => r.trim() !== ""),
      coverImage,
      date,
      time,
      venue,
      category,
      type,
      prizePool: Number(prizePool),
      maxSeats: Number(maxSeats),
      coordinator: {
        name: coordName,
        phone: coordPhone,
        email: coordEmail
      }
    };

    try {
      if (editingEvent) {
        // Update Event
        const res = await api.put(`/events/${editingEvent.slug}`, payload);
        if (res.data.success) {
          setShowModal(false);
          loadEvents();
        }
      } else {
        // Create Event
        const res = await api.post("/events", payload);
        if (res.data.success) {
          setShowModal(false);
          loadEvents();
        }
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || "Failed to save event parameters.");
    }
  };

  return (
    <div className="bg-festival-dark min-h-screen pt-28 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Back Link */}
        <Link href="/admin" className="inline-flex items-center gap-1.5 text-xs text-white/50 hover:text-white uppercase font-bold tracking-wider" style={{ fontFamily: "var(--font-heading)" }}>
          <RiArrowLeftLine />
          <span>Back to Console</span>
        </Link>

        {/* Header */}
        <div className="flex justify-between items-center border-b border-white/5 pb-6">
          <div className="space-y-1">
            <h1 className="text-3xl md:text-4xl font-black text-white uppercase tracking-wider" style={{ fontFamily: "var(--font-heading)" }}>
              Manage <span className="gradient-text-gold">Events</span>
            </h1>
            <p className="text-white/50 text-sm">
              Configure details, change rule sets, and monitor registrations capacities.
            </p>
          </div>

          <button
            onClick={handleOpenCreateModal}
            className="btn-primary flex items-center gap-1.5 text-xs px-5 py-2.5 cursor-pointer"
          >
            <RiAddLine />
            <span>New Event</span>
          </button>
        </div>

        {/* Events List */}
        {loading ? (
          <div className="text-center text-white/40 text-xs py-6 uppercase tracking-widest animate-pulse">Loading event settings...</div>
        ) : events.length === 0 ? (
          <div className="text-center text-white/40 text-xs py-6">No events found in database. Add some events to start.</div>
        ) : (
          <div className="space-y-4">
            {events.map((e) => (
              <div key={e._id} className="glass p-5 rounded-2xl border border-white/5 flex items-center justify-between gap-4">
                <div className="space-y-1 text-left">
                  <span className="block font-bold text-white text-base">{e.title}</span>
                  <div className="flex flex-wrap gap-4 text-xs text-white/40">
                    <span>Category: <strong className="text-white/60 capitalize">{e.category}</strong></span>
                    <span>Slots: <strong className="text-white/60">{e.registeredCount} / {e.maxSeats}</strong></span>
                    <span>Prize: <strong className="text-white/60">₹{e.prizePool.toLocaleString("en-IN")}</strong></span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleOpenEditModal(e)}
                    className="p-2.5 rounded-lg bg-white/5 hover:bg-festival-gold/20 text-white/70 hover:text-festival-gold border border-white/5 hover:border-festival-gold/30 transition-all text-sm cursor-pointer"
                    aria-label={`Edit ${e.title}`}
                  >
                    <RiEditLine />
                  </button>
                  <button
                    onClick={() => handleDelete(e.slug, e.title)}
                    className="p-2.5 rounded-lg bg-white/5 hover:bg-festival-pink/20 text-white/70 hover:text-festival-pink border border-white/5 hover:border-festival-pink/30 transition-all text-sm cursor-pointer"
                    aria-label={`Delete ${e.title}`}
                  >
                    <RiDeleteBin7Line />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Editor Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="glass w-full max-w-2xl rounded-3xl border border-white/10 shadow-2xl p-6 md:p-8 space-y-6 relative my-8">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white cursor-pointer"
            >
              <RiCloseLine size={20} />
            </button>

            <div className="text-left space-y-1">
              <h3 className="text-lg font-bold text-white uppercase tracking-wider" style={{ fontFamily: "var(--font-heading)" }}>
                {editingEvent ? "Modify Event Parameters" : "Create New Event Arena"}
              </h3>
              <p className="text-xs text-white/40">Adjust parameters for public view</p>
            </div>

            {errorMsg && (
              <div className="p-3 bg-festival-pink/15 border border-festival-pink/30 text-festival-pink text-xs rounded-xl text-center">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-left max-h-[50vh] overflow-y-auto pr-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-white/40 mb-1.5">Event Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Gaming Arena"
                    className="w-full px-3.5 py-2 bg-white/5 border border-white/10 rounded-xl focus:border-festival-gold/50 focus:outline-none text-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-white/40 mb-1.5">URL Slug</label>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="gaming-arena"
                    disabled={!!editingEvent}
                    className="w-full px-3.5 py-2 bg-white/5 border border-white/10 rounded-xl focus:border-festival-gold/50 focus:outline-none text-white text-xs disabled:opacity-40"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-white/40 mb-1.5">Description</label>
                <textarea
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter details about this competition..."
                  rows={3}
                  className="w-full px-3.5 py-2 bg-white/5 border border-white/10 rounded-xl focus:border-festival-gold/50 focus:outline-none text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-white/40 mb-1.5">Rules & Guidelines (One per line)</label>
                <textarea
                  value={rules}
                  onChange={(e) => setRules(e.target.value)}
                  placeholder="Rule 1&#10;Rule 2&#10;Rule 3..."
                  rows={4}
                  className="w-full px-3.5 py-2 bg-white/5 border border-white/10 rounded-xl focus:border-festival-gold/50 focus:outline-none text-white text-xs font-mono"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-white/40 mb-1.5">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs"
                  >
                    <option value="gaming" className="bg-zinc-950">Gaming</option>
                    <option value="technical" className="bg-zinc-950">Technical</option>
                    <option value="cultural" className="bg-zinc-950">Cultural</option>
                    <option value="general" className="bg-zinc-950">General</option>
                    <option value="sports" className="bg-zinc-950">Sports</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-white/40 mb-1.5">Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs"
                  >
                    <option value="solo" className="bg-zinc-950">Solo</option>
                    <option value="duo" className="bg-zinc-950">Duo</option>
                    <option value="trio" className="bg-zinc-950">Trio</option>
                    <option value="squad" className="bg-zinc-950">Squad</option>
                    <option value="group" className="bg-zinc-950">Group</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-white/40 mb-1.5">Cover Image URL</label>
                  <input
                    type="text"
                    required
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                    className="w-full px-3.5 py-2 bg-white/5 border border-white/10 rounded-xl focus:border-festival-gold/50 focus:outline-none text-white text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-white/40 mb-1.5">Date</label>
                  <input
                    type="text"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3.5 py-2 bg-white/5 border border-white/10 rounded-xl focus:border-festival-gold/50 focus:outline-none text-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-white/40 mb-1.5">Reporting Time</label>
                  <input
                    type="text"
                    required
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-3.5 py-2 bg-white/5 border border-white/10 rounded-xl focus:border-festival-gold/50 focus:outline-none text-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-white/40 mb-1.5">Prize Pool (₹)</label>
                  <input
                    type="number"
                    required
                    value={prizePool}
                    onChange={(e) => setPrizePool(Number(e.target.value))}
                    className="w-full px-3.5 py-2 bg-white/5 border border-white/10 rounded-xl focus:border-festival-gold/50 focus:outline-none text-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-white/40 mb-1.5">Max Seats</label>
                  <input
                    type="number"
                    required
                    value={maxSeats}
                    onChange={(e) => setMaxSeats(Number(e.target.value))}
                    className="w-full px-3.5 py-2 bg-white/5 border border-white/10 rounded-xl focus:border-festival-gold/50 focus:outline-none text-white text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-white/40 mb-1.5">Coordinator Name</label>
                  <input
                    type="text"
                    required
                    value={coordName}
                    onChange={(e) => setCoordName(e.target.value)}
                    placeholder="Staff/Student name"
                    className="w-full px-3.5 py-2 bg-white/5 border border-white/10 rounded-xl focus:border-festival-gold/50 focus:outline-none text-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-white/40 mb-1.5">Coordinator Phone</label>
                  <input
                    type="text"
                    required
                    value={coordPhone}
                    onChange={(e) => setCoordPhone(e.target.value)}
                    placeholder="+91..."
                    className="w-full px-3.5 py-2 bg-white/5 border border-white/10 rounded-xl focus:border-festival-gold/50 focus:outline-none text-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-white/40 mb-1.5">Coordinator Email</label>
                  <input
                    type="email"
                    required
                    value={coordEmail}
                    onChange={(e) => setCoordEmail(e.target.value)}
                    placeholder="email@macfast.org"
                    className="w-full px-3.5 py-2 bg-white/5 border border-white/10 rounded-xl focus:border-festival-gold/50 focus:outline-none text-white text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-white/40 mb-1.5">Venue Location</label>
                <input
                  type="text"
                  required
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  placeholder="Main Auditorium, Lab 3..."
                  className="w-full px-3.5 py-2 bg-white/5 border border-white/10 rounded-xl focus:border-festival-gold/50 focus:outline-none text-white text-xs"
                />
              </div>

              <div className="pt-4 border-t border-white/5 flex justify-end">
                <button
                  type="submit"
                  className="btn-primary flex items-center gap-2 px-6 py-3 text-xs font-bold uppercase tracking-widest cursor-pointer"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  <RiSaveLine />
                  <span>{editingEvent ? "Apply Changes" : "Create Arena"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
