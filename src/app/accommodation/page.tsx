"use client";

import { useState } from "react";
import {
  RiHotelBedLine,
  RiMenLine,
  RiWomenLine,
  RiShieldUserLine,
  RiPhoneFill,
  RiWhatsappLine,
  RiMapPinLine,
  RiCheckLine,
  RiInformationLine,
  RiSearch2Line,
  RiCalendarCheckLine,
  RiCloseLine,
  RiSparklingLine
} from "react-icons/ri";

type AccommodationHostel = {
  id: string;
  name: string;
  gender: "male" | "female";
  type: string;
  location: string;
  distance: string;
  roomTypes: string[];
  tariff: string;
  amenities: string[];
  wardenName: string;
  wardenPhone: string;
  availability: "Available" | "Fast Filling" | "Limited";
  badgeColor: string;
  description: string;
};

const hostelsData: AccommodationHostel[] = [
  // MALE ACCOMMODATION
  {
    id: "st-thomas",
    name: "St. Thomas Mens Hostel",
    gender: "male",
    type: "Campus Mens Hostel",
    location: "MACFAST Main Campus Block A",
    distance: "2 min walk to Fest Arena",
    roomTypes: ["4-Sharing Dormitory", "Twin Sharing Rooms"],
    tariff: "₹250 / night per head",
    amenities: ["Free Wi-Fi", "24/7 Security & CCTV", "Hot Water", "Filter Drinking Water", "Power Backup", "Mess Breakfast Included"],
    wardenName: "Prof. Alexander Varghese",
    wardenPhone: "+91 94470 12345",
    availability: "Available",
    badgeColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    description: "Spacious on-campus mens hostel equipped with study tables, high-speed Wi-Fi, and round-the-clock fest security."
  },

  // FEMALE ACCOMMODATION
  {
    id: "st-teresa",
    name: "St. Teresa Ladies Hostel",
    gender: "female",
    type: "Campus Ladies Hostel",
    location: "Campus Block C (Secured Ladies Wing)",
    distance: "2 min walk to Fest Arena",
    roomTypes: ["Twin Sharing", "Triple Sharing Rooms"],
    tariff: "₹250 / night per head",
    amenities: ["Female Warden & 24/7 Security Guard", "CCTV Surveillance", "Free Wi-Fi", "Hot Water", "First Aid Desk", "Mess Breakfast Included"],
    wardenName: "Sr. Grace Mary",
    wardenPhone: "+91 94463 67890",
    availability: "Available",
    badgeColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    description: "Exclusive secure ladies hostel inside MACFAST campus with female wardens, biometric entry, and clean dining facilities."
  },
  {
    id: "st-alphonsa",
    name: "St. Alphonsa Ladies Hostel",
    gender: "female",
    type: "Campus Annex Ladies Hostel",
    location: "South Gate Residency Wing",
    distance: "3 min walk to Fest Arena",
    roomTypes: ["4-Sharing Spacious Rooms", "Dormitory Hall"],
    tariff: "₹200 / night per head",
    amenities: ["Female Warden On-Duty", "Hot Water", "Free Wi-Fi", "Common Lounge", "Mess Meals", "Emergency Support"],
    wardenName: "Ms. Anitha John",
    wardenPhone: "+91 98472 11223",
    availability: "Available",
    badgeColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    description: "Comfortable and safe ladies hostel featuring attached washrooms, cozy beds, and dedicated festival support staff."
  }
];

export default function AccommodationPage() {
  const [selectedGender, setSelectedGender] = useState<"all" | "male" | "female">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Booking modal form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingHostel, setBookingHostel] = useState<AccommodationHostel | null>(null);
  const [formData, setFormData] = useState({
    fullName: "",
    gender: "male",
    email: "",
    phone: "",
    college: "",
    personsCount: "1",
    checkInDate: "2026-09-23",
    checkOutDate: "2026-09-25",
    specialRequest: ""
  });
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [bookingId, setBookingId] = useState("");

  const filteredHostels = hostelsData.filter((h) => {
    const matchesGender = selectedGender === "all" || h.gender === selectedGender;
    const matchesSearch =
      h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.amenities.some(a => a.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesGender && matchesSearch;
  });

  const handleOpenBooking = (hostel: AccommodationHostel) => {
    setBookingHostel(hostel);
    setFormData((prev) => ({ ...prev, gender: hostel.gender }));
    setBookingConfirmed(false);
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const generatedId = "MAC-ACC-" + Math.floor(100000 + Math.random() * 900000);
    setBookingId(generatedId);
    setBookingConfirmed(true);
  };

  const handleWhatsAppBooking = (hostel: AccommodationHostel) => {
    const message = `Hello, I want to inquire/book accommodation for MACFIESTA 2K26.\nHostel: ${hostel.name}\nGender: ${hostel.gender.toUpperCase()}\nTariff: ${hostel.tariff}`;
    const url = `https://wa.me/${hostel.wardenPhone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="bg-[#05050A] min-h-screen pt-28 pb-20 text-white font-mono relative overflow-hidden">
      {/* Background Marvel Video Project 7.mp4 Loop (High Visibility) */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-80">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          onPause={(e) => e.currentTarget.play()}
          onEnded={(e) => e.currentTarget.play()}
          className="w-full h-full object-cover object-center filter brightness-110 contrast-115"

        >
          <source src="/MARVEL/Video Project 7.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-[#05050A]/40 via-[#05050A]/60 to-[#05050A]/90" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">


        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-festival-gold/10 border border-festival-gold/30 text-festival-gold text-xs font-bold uppercase tracking-widest">
            <RiSparklingLine className="text-sm" />
            <span>MacFiesta 2K26 Hospitality</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-wider text-white" style={{ fontFamily: "var(--font-heading)" }}>
            Festival <span className="gradient-text-gold neon-gold">Accommodation</span>
          </h1>

          <p className="text-white/70 text-sm md:text-base leading-relaxed">
            Safe, comfortable, and affordable stay arrangements dedicated for both <span className="text-cyan-400 font-bold">Male</span> and <span className="text-pink-400 font-bold">Female</span> student delegates & teams participating in MACFIESTA.
          </p>
        </div>

        {/* Gender Selection Bar & Search Input */}
        <div className="glass p-4 md:p-6 rounded-3xl border border-white/10 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">

          {/* Gender Filter Tabs */}
          <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/10 w-full md:w-auto">
            <button
              type="button"
              suppressHydrationWarning={true}
              onClick={() => setSelectedGender("all")}
              className={`flex-1 md:flex-initial px-6 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${selectedGender === "all"
                ? "bg-festival-gold text-festival-dark shadow-[0_0_15px_rgba(234,179,8,0.4)]"
                : "text-white/70 hover:text-white hover:bg-white/5"
                }`}
              style={{ fontFamily: "var(--font-heading)" }}
            >
              <RiHotelBedLine className="text-base" />
              <span>All Hostels ({hostelsData.length})</span>
            </button>

            <button
              type="button"
              suppressHydrationWarning={true}
              onClick={() => setSelectedGender("male")}
              className={`flex-1 md:flex-initial px-6 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${selectedGender === "male"
                ? "bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                : "text-white/70 hover:text-cyan-400 hover:bg-white/5"
                }`}
              style={{ fontFamily: "var(--font-heading)" }}
            >
              <RiMenLine className="text-base" />
              <span>Male Stay ({hostelsData.filter(h => h.gender === "male").length})</span>
            </button>

            <button
              type="button"
              suppressHydrationWarning={true}
              onClick={() => setSelectedGender("female")}
              className={`flex-1 md:flex-initial px-6 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${selectedGender === "female"
                ? "bg-pink-500 text-white shadow-[0_0_15px_rgba(236,72,153,0.4)]"
                : "text-white/70 hover:text-pink-400 hover:bg-white/5"
                }`}
              style={{ fontFamily: "var(--font-heading)" }}
            >
              <RiWomenLine className="text-base" />
              <span>Female Stay ({hostelsData.filter(h => h.gender === "female").length})</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <RiSearch2Line className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 text-base" />
            <input
              type="text"
              suppressHydrationWarning={true}
              placeholder="Search hostel, amenity, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-2xl text-xs text-white placeholder-white/40 focus:outline-none focus:border-festival-gold/50 transition-colors"
            />
          </div>
        </div>

        {/* Accommodation Hostel Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredHostels.map((hostel) => (
            <div
              key={hostel.id}
              className={`glass rounded-3xl border transition-all duration-300 hover:scale-[1.02] flex flex-col justify-between overflow-hidden shadow-xl ${hostel.gender === "male"
                ? "hover:border-cyan-500/40 border-white/10"
                : "hover:border-pink-500/40 border-white/10"
                }`}
            >
              {/* Top Card Banner Header */}
              <div className="p-6 space-y-4 border-b border-white/5 relative">

                {/* Gender Indicator Badge */}
                <div className="flex justify-between items-center">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${hostel.gender === "male"
                      ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/30"
                      : "bg-pink-500/10 text-pink-400 border-pink-500/30"
                      }`}
                  >
                    {hostel.gender === "male" ? (
                      <>
                        <RiMenLine className="text-xs" /> Male Accommodation
                      </>
                    ) : (
                      <>
                        <RiWomenLine className="text-xs" /> Female Accommodation
                      </>
                    )}
                  </span>

                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${hostel.badgeColor}`}>
                    {hostel.availability}
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-extrabold text-white" style={{ fontFamily: "var(--font-heading)" }}>
                    {hostel.name}
                  </h3>
                  <p className="text-xs text-festival-gold font-semibold uppercase tracking-wider mt-0.5">
                    {hostel.type}
                  </p>
                </div>

                <div className="flex items-start gap-2 text-xs text-white/70">
                  <RiMapPinLine className="text-festival-gold text-sm shrink-0 mt-0.5" />
                  <span>{hostel.location} • <strong className="text-white">{hostel.distance}</strong></span>
                </div>
              </div>

              {/* Card Body & Amenities */}
              <div className="p-6 space-y-5 flex-1">
                <p className="text-xs text-white/60 leading-relaxed">
                  {hostel.description}
                </p>

                {/* Tariff Pill */}
                <div className="bg-white/5 border border-white/10 p-3.5 rounded-2xl flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-white/50 tracking-wider">Tariff Rate</span>
                  <span className="text-sm font-black text-festival-gold tracking-wide">{hostel.tariff}</span>
                </div>

                {/* Room Types */}
                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase font-bold text-white/40 tracking-widest block">Available Occupancy</span>
                  <div className="flex flex-wrap gap-1.5">
                    {hostel.roomTypes.map((rt) => (
                      <span key={rt} className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] text-white/80 font-medium">
                        {rt}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Key Amenities */}
                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-bold text-white/40 tracking-widest block">Facilities & Security</span>
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-white/70">
                    {hostel.amenities.map((amenity) => (
                      <div key={amenity} className="flex items-center gap-1.5">
                        <RiCheckLine className="text-festival-gold shrink-0 text-xs" />
                        <span className="truncate">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Warden Contact Box */}
                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[9px] text-white/40 uppercase font-bold block">In-Charge Warden</span>
                    <span className="font-bold text-white/90">{hostel.wardenName}</span>
                  </div>
                  <button
                    type="button"
                    suppressHydrationWarning={true}
                    onClick={() => handleWhatsAppBooking(hostel)}
                    className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500 hover:text-black transition-colors cursor-pointer"
                    title="Chat on WhatsApp"
                  >
                    <RiWhatsappLine className="text-base" />
                  </button>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-6 pt-0">
                <button
                  type="button"
                  suppressHydrationWarning={true}
                  onClick={() => handleOpenBooking(hostel)}
                  className={`w-full py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all duration-300 cursor-pointer shadow-lg flex items-center justify-center gap-2 ${hostel.gender === "male"
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black"
                    : "bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-400 hover:to-rose-500 text-white"
                    }`}
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  <RiCalendarCheckLine className="text-sm" />
                  <span>Reserve Stay Request</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Emergency Contacts & Helpline Section */}
        <div className="glass p-8 rounded-3xl border border-white/10 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <h2 className="text-xl font-bold uppercase text-white" style={{ fontFamily: "var(--font-heading)" }}>
                Hospitality & Emergency Helplines
              </h2>
              <p className="text-xs text-white/60">
                24/7 dedicated fest coordinators for male and female accommodation inquiries.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-emerald-400 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Control Desk Active</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Male Convener */}
            <div className="bg-white/5 border border-cyan-500/20 p-5 rounded-2xl space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-cyan-500/20 rounded-xl text-cyan-400">
                  <RiMenLine className="text-xl" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Male Accommodation Head</h4>
                  <span className="text-[10px] text-white/40 uppercase font-bold">Gentlemen Hostels</span>
                </div>
              </div>
              <p className="text-xs text-white/70">Prof. Alexander Varghese</p>
              <a
                href="tel:+919447012345"
                className="inline-flex items-center gap-2 text-xs font-bold text-cyan-400 hover:underline"
              >
                <RiPhoneFill /> +91 94470 12345
              </a>
            </div>

            {/* Female Convener */}
            <div className="bg-white/5 border border-pink-500/20 p-5 rounded-2xl space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-pink-500/20 rounded-xl text-pink-400">
                  <RiWomenLine className="text-xl" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Female Accommodation Head</h4>
                  <span className="text-[10px] text-white/40 uppercase font-bold">Ladies Hostels</span>
                </div>
              </div>
              <p className="text-xs text-white/70">Sr. Grace Mary</p>
              <a
                href="tel:+919446367890"
                className="inline-flex items-center gap-2 text-xs font-bold text-pink-400 hover:underline"
              >
                <RiPhoneFill /> +91 94463 67890
              </a>
            </div>

            {/* General Control Desk */}
            <div className="bg-white/5 border border-festival-gold/20 p-5 rounded-2xl space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-festival-gold/20 rounded-xl text-festival-gold">
                  <RiShieldUserLine className="text-xl" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">MACFAST Fest Hospitality</h4>
                  <span className="text-[10px] text-white/40 uppercase font-bold">General Enquiries</span>
                </div>
              </div>
              <p className="text-xs text-white/70">Central Registration Desk</p>
              <a
                href="tel:+914692600000"
                className="inline-flex items-center gap-2 text-xs font-bold text-festival-gold hover:underline"
              >
                <RiPhoneFill /> +91 469 260 0000
              </a>
            </div>
          </div>
        </div>

        {/* Accommodation Rules & Instructions */}
        <div className="glass p-8 rounded-3xl border border-white/10 space-y-6">
          <h2 className="text-xl font-bold uppercase text-white flex items-center gap-2" style={{ fontFamily: "var(--font-heading)" }}>
            <RiInformationLine className="text-festival-gold" />
            <span>Accommodation Guidelines & Rules</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-white/70">
            <div className="flex gap-3 bg-white/5 p-4 rounded-2xl border border-white/5">
              <span className="w-6 h-6 rounded-full bg-festival-gold/20 text-festival-gold font-bold flex items-center justify-center shrink-0">1</span>
              <div>
                <strong className="text-white block mb-0.5">Mandatory Identification</strong>
                All participants must produce a valid College ID card and Government ID proof (Aadhaar / Driving License) upon check-in.
              </div>
            </div>

            <div className="flex gap-3 bg-white/5 p-4 rounded-2xl border border-white/5">
              <span className="w-6 h-6 rounded-full bg-festival-gold/20 text-festival-gold font-bold flex items-center justify-center shrink-0">2</span>
              <div>
                <strong className="text-white block mb-0.5">Check-In & Check-Out Timings</strong>
                Check-in opens at 07:00 AM on Sep 23, 2026. Check-out must be completed by 10:00 AM on the day following festival conclusion.
              </div>
            </div>

            <div className="flex gap-3 bg-white/5 p-4 rounded-2xl border border-white/5">
              <span className="w-6 h-6 rounded-full bg-festival-gold/20 text-festival-gold font-bold flex items-center justify-center shrink-0">3</span>
              <div>
                <strong className="text-white block mb-0.5">Separate Male & Female Blocks</strong>
                Male and Female accommodation quarters are strictly segregated with individual warden supervision and security check posts.
              </div>
            </div>

            <div className="flex gap-3 bg-white/5 p-4 rounded-2xl border border-white/5">
              <span className="w-6 h-6 rounded-full bg-festival-gold/20 text-festival-gold font-bold flex items-center justify-center shrink-0">4</span>
              <div>
                <strong className="text-white block mb-0.5">Campus Curfew</strong>
                Entry into hostels is permitted till 10:30 PM after evening cultural events. Special late passes can be requested via event coordinators.
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Booking Modal */}
      {isModalOpen && bookingHostel && (
        <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-strong border border-white/20 w-full max-w-lg rounded-3xl p-6 md:p-8 space-y-6 max-h-[90vh] overflow-y-auto relative animate-scale-in">

            <button
              type="button"
              suppressHydrationWarning={true}
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer"
            >
              <RiCloseLine size={20} />
            </button>

            {!bookingConfirmed ? (
              <form onSubmit={handleFormSubmit} className="space-y-5">
                <div>
                  <span className="text-[10px] text-festival-gold uppercase font-bold tracking-widest">Reserve Accommodation</span>
                  <h3 className="text-2xl font-black text-white" style={{ fontFamily: "var(--font-heading)" }}>
                    {bookingHostel.name}
                  </h3>
                  <p className="text-xs text-white/60 mt-1">
                    {bookingHostel.type} • {bookingHostel.tariff}
                  </p>
                </div>

                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block text-white/80 font-semibold mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      suppressHydrationWarning={true}
                      placeholder="Enter your full name"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:border-festival-gold focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white/80 font-semibold mb-1">Gender</label>
                      <select
                        suppressHydrationWarning={true}
                        value={formData.gender}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                        className="w-full px-4 py-2.5 bg-festival-dark border border-white/10 rounded-xl text-white focus:border-festival-gold focus:outline-none"
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-white/80 font-semibold mb-1">No. of Guests</label>
                      <input
                        type="number"
                        min="1"
                        max="20"
                        suppressHydrationWarning={true}
                        value={formData.personsCount}
                        onChange={(e) => setFormData({ ...formData, personsCount: e.target.value })}
                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:border-festival-gold focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white/80 font-semibold mb-1">Mobile Number</label>
                      <input
                        type="tel"
                        required
                        suppressHydrationWarning={true}
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:border-festival-gold focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-white/80 font-semibold mb-1">College Name</label>
                      <input
                        type="text"
                        required
                        suppressHydrationWarning={true}
                        placeholder="Your college / university"
                        value={formData.college}
                        onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:border-festival-gold focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white/80 font-semibold mb-1">Check-in Date</label>
                      <input
                        type="date"
                        suppressHydrationWarning={true}
                        value={formData.checkInDate}
                        onChange={(e) => setFormData({ ...formData, checkInDate: e.target.value })}
                        className="w-full px-4 py-2.5 bg-festival-dark border border-white/10 rounded-xl text-white focus:border-festival-gold focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-white/80 font-semibold mb-1">Check-out Date</label>
                      <input
                        type="date"
                        suppressHydrationWarning={true}
                        value={formData.checkOutDate}
                        onChange={(e) => setFormData({ ...formData, checkOutDate: e.target.value })}
                        className="w-full px-4 py-2.5 bg-festival-dark border border-white/10 rounded-xl text-white focus:border-festival-gold focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-white/80 font-semibold mb-1">Special Notes / Team Details</label>
                    <textarea
                      rows={2}
                      suppressHydrationWarning={true}
                      placeholder="e.g. Arriving late at night, food preferences..."
                      value={formData.specialRequest}
                      onChange={(e) => setFormData({ ...formData, specialRequest: e.target.value })}
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:border-festival-gold focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  suppressHydrationWarning={true}
                  className="w-full py-3.5 bg-festival-gold hover:bg-white text-festival-dark font-black text-xs uppercase tracking-widest rounded-2xl transition-all duration-300 cursor-pointer shadow-lg"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Submit Reservation Request
                </button>
              </form>
            ) : (
              <div className="text-center space-y-6 py-4">
                <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto text-3xl border border-emerald-500/40">
                  <RiCheckLine />
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-white" style={{ fontFamily: "var(--font-heading)" }}>
                    Reservation Submitted!
                  </h3>
                  <p className="text-xs text-white/70">
                    Your accommodation request for <strong className="text-white">{bookingHostel.name}</strong> has been logged.
                  </p>
                </div>

                <div className="bg-white/5 border border-white/10 p-4 rounded-2xl text-left space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-white/50 uppercase font-bold text-[10px]">Reference Booking ID</span>
                    <span className="font-mono text-festival-gold font-bold">{bookingId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50 uppercase font-bold text-[10px]">Delegate</span>
                    <span className="text-white font-bold">{formData.fullName} ({formData.gender.toUpperCase()})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50 uppercase font-bold text-[10px]">Warden Contact</span>
                    <span className="text-white">{bookingHostel.wardenPhone}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <button
                    type="button"
                    suppressHydrationWarning={true}
                    onClick={() => handleWhatsAppBooking(bookingHostel)}
                    className="w-full py-3 bg-emerald-500 text-black font-bold text-xs uppercase tracking-widest rounded-2xl hover:bg-emerald-400 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <RiWhatsappLine className="text-base" />
                    <span>Send Request to Warden via WhatsApp</span>
                  </button>

                  <button
                    type="button"
                    suppressHydrationWarning={true}
                    onClick={() => setIsModalOpen(false)}
                    className="w-full py-2.5 bg-white/10 text-white font-bold text-xs uppercase tracking-widest rounded-2xl hover:bg-white/20 transition-colors cursor-pointer"
                  >
                    Done
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
