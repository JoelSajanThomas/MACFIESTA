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
  RiShieldFlashLine
} from "react-icons/ri";
import { BackgroundVideo } from "@/components/ui/BackgroundVideo";

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
    <div className="bg-[#05050A] min-h-screen pt-28 pb-20 text-white font-excon relative overflow-hidden">
      {/* Background Marvel Video Loop (Hardware-Accelerated, Smooth Zero-Lag) */}
      <BackgroundVideo
        src="/MARVEL/Video Project 4.mp4"
        fallbackSrc="/MARVEL/Video Project 7.mp4"
        opacity="opacity-80"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">

        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-arc-cyan/40 bg-arc-cyan/10 text-arc-cyan text-xs font-excon-bold font-bold tracking-[0.2em] uppercase shadow-[0_0_15px_rgba(0,212,255,0.25)]">
            <RiShieldFlashLine className="animate-pulse" />
            <span>S.H.I.E.L.D. HOSPITALITY & QUARTERS</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-white font-excon-black">
            <span className="shimmer-text">FESTIVAL</span>{" "}
            <span className="gradient-text-plasma">ACCOMMODATION</span>
          </h1>

          <p className="text-white/80 text-xs sm:text-sm leading-relaxed font-excon font-normal">
            Safe, comfortable, and affordable stay arrangements dedicated for both <span className="text-arc-cyan font-bold font-excon-bold">Male</span> and <span className="text-marvel-red font-bold font-excon-bold">Female</span> student delegates & teams participating in MACFIESTA.
          </p>
        </div>

        {/* Gender Selection Bar & Search Input */}
        <div className="glass p-4 md:p-6 rounded-2xl border border-arc-cyan/20 space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">

            {/* Gender Filter Tabs */}
            <div className="flex bg-white/5 p-1.5 rounded-xl border border-white/10 w-full md:w-auto">
              <button
                type="button"
                suppressHydrationWarning={true}
                onClick={() => setSelectedGender("all")}
                className={`flex-1 md:flex-initial px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer font-excon-bold ${selectedGender === "all"
                  ? "bg-metallic-gold text-black shadow-[0_0_15px_#FFD700]"
                  : "text-white/60 hover:text-white hover:bg-white/5"
                  }`}
              >
                <RiHotelBedLine className="text-base" />
                <span>All Hostels ({hostelsData.length})</span>
              </button>

              <button
                type="button"
                suppressHydrationWarning={true}
                onClick={() => setSelectedGender("male")}
                className={`flex-1 md:flex-initial px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer font-excon-bold ${selectedGender === "male"
                  ? "bg-arc-cyan text-black shadow-[0_0_15px_rgba(0,212,255,0.4)]"
                  : "text-white/60 hover:text-arc-cyan hover:bg-white/5"
                  }`}
              >
                <RiMenLine className="text-base" />
                <span>Male Stay ({hostelsData.filter(h => h.gender === "male").length})</span>
              </button>

              <button
                type="button"
                suppressHydrationWarning={true}
                onClick={() => setSelectedGender("female")}
                className={`flex-1 md:flex-initial px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer font-excon-bold ${selectedGender === "female"
                  ? "bg-marvel-red text-white shadow-[0_0_15px_#ED1D24]"
                  : "text-white/60 hover:text-marvel-red hover:bg-white/5"
                  }`}
              >
                <RiWomenLine className="text-base" />
                <span>Female Stay ({hostelsData.filter(h => h.gender === "female").length})</span>
              </button>
            </div>

            {/* Search Box */}
            <div className="relative w-full md:w-80">
              <RiSearch2Line className="absolute left-4 top-1/2 -translate-y-1/2 text-arc-cyan text-base" />
              <input
                type="text"
                suppressHydrationWarning={true}
                placeholder="Search hostel, amenity, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-white/30 focus:outline-none focus:border-arc-cyan transition-colors font-excon"
              />
            </div>
          </div>
        </div>

        {/* Hostels Grid Display */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
          {filteredHostels.map((hostel) => (
            <div
              key={hostel.id}
              className="marvel-card rounded-2xl border border-white/10 overflow-hidden flex flex-col justify-between group hover:border-arc-cyan/50 transition-all duration-300 shadow-xl"
            >
              {/* Top Card Banner Header */}
              <div className="p-4 sm:p-6 space-y-3 sm:space-y-4 border-b border-white/5 relative">

                {/* Gender Indicator Badge */}
                <div className="flex justify-between items-center">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border font-excon-bold ${hostel.gender === "male"
                      ? "bg-arc-cyan/10 text-arc-cyan border-arc-cyan/30"
                      : "bg-marvel-red/10 text-marvel-red border-marvel-red/30"
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

                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border font-excon-bold ${hostel.badgeColor}`}>
                    {hostel.availability}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg sm:text-xl font-black text-white group-hover:text-metallic-gold transition-colors duration-300 uppercase tracking-tight font-excon-black">
                    {hostel.name}
                  </h3>
                  <p className="text-xs text-metallic-gold font-bold uppercase tracking-wider mt-0.5 font-excon-bold">
                    {hostel.type}
                  </p>
                </div>

                <div className="flex items-start gap-2 text-xs text-white/70 font-excon">
                  <RiMapPinLine className="text-arc-cyan text-sm shrink-0 mt-0.5" />
                  <span>{hostel.location} • <strong className="text-white font-black font-excon-black">{hostel.distance}</strong></span>
                </div>
              </div>

              {/* Card Body & Amenities */}
              <div className="p-4 sm:p-6 space-y-4 sm:space-y-5 flex-1 font-excon">
                <p className="text-xs text-white/70 leading-relaxed">
                  {hostel.description}
                </p>

                {/* Tariff Pill */}
                <div className="bg-white/5 border border-white/10 p-3 sm:p-3.5 rounded-xl flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-white/50 tracking-wider font-excon-bold">Tariff Rate</span>
                  <span className="text-xs sm:text-sm font-black text-metallic-gold tracking-wide font-excon-black">{hostel.tariff}</span>
                </div>

                {/* Room Types */}
                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase font-bold text-white/50 tracking-widest block font-excon-bold">Available Occupancy</span>
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
                  <span className="text-[10px] uppercase font-bold text-white/50 tracking-widest block font-excon-bold">Facilities & Security</span>
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-white/70">
                    {hostel.amenities.map((amenity) => (
                      <div key={amenity} className="flex items-center gap-1.5">
                        <RiCheckLine className="text-metallic-gold shrink-0 text-xs" />
                        <span className="truncate">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Warden Contact Box */}
                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[9px] text-white/50 uppercase font-bold block font-excon-bold">In-Charge Warden</span>
                    <span className="font-bold text-white/90">{hostel.wardenName}</span>
                  </div>
                  <button
                    type="button"
                    suppressHydrationWarning={true}
                    onClick={() => handleWhatsAppBooking(hostel)}
                    className="p-2 rounded-xl bg-arc-cyan/10 border border-arc-cyan/30 text-arc-cyan hover:bg-arc-cyan hover:text-black transition-colors cursor-pointer"
                    title="Chat on WhatsApp"
                  >
                    <RiWhatsappLine className="text-base" />
                  </button>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-4 sm:p-6 pt-0">
                <button
                  type="button"
                  suppressHydrationWarning={true}
                  onClick={() => handleOpenBooking(hostel)}
                  className={`w-full py-2.5 sm:py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 cursor-pointer shadow-lg flex items-center justify-center gap-2 font-excon-black ${hostel.gender === "male"
                    ? "bg-arc-cyan hover:bg-white text-black shadow-[0_0_12px_#00D4FF]"
                    : "bg-marvel-red hover:bg-white hover:text-black text-white shadow-[0_0_12px_#ED1D24]"
                    }`}
                >
                  <RiCalendarCheckLine className="text-sm" />
                  <span>Reserve Stay Request</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Emergency Contacts & Helpline Section */}
        <div className="glass p-4 sm:p-8 rounded-2xl border border-arc-cyan/20 space-y-4 sm:space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <h2 className="text-xl font-black uppercase text-white font-excon-black">
                Hospitality & Emergency Helplines
              </h2>
              <p className="text-xs text-white/70 font-excon mt-1">
                24/7 dedicated fest coordinators for male and female accommodation inquiries.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-arc-cyan/10 border border-arc-cyan/30 rounded-full text-arc-cyan text-xs font-bold font-excon-bold">
              <span className="w-2 h-2 rounded-full bg-arc-cyan animate-pulse" />
              <span>Control Desk Active</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Male Convener */}
            <div className="marvel-card bg-white/5 border border-arc-cyan/20 p-5 rounded-2xl space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-arc-cyan/20 rounded-xl text-arc-cyan">
                  <RiMenLine className="text-xl" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-white uppercase font-excon-black">Male Accommodation Head</h4>
                  <span className="text-[10px] text-white/50 uppercase font-bold font-excon-bold">Gentlemen Hostels</span>
                </div>
              </div>
              <p className="text-xs text-white/70 font-excon">Prof. Alexander Varghese</p>
              <a
                href="tel:+919447012345"
                className="inline-flex items-center gap-2 text-xs font-bold text-arc-cyan hover:underline font-excon-bold"
              >
                <RiPhoneFill /> +91 94470 12345
              </a>
            </div>

            {/* Female Convener */}
            <div className="marvel-card bg-white/5 border border-marvel-red/20 p-5 rounded-2xl space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-marvel-red/20 rounded-xl text-marvel-red">
                  <RiWomenLine className="text-xl" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-white uppercase font-excon-black">Female Accommodation Head</h4>
                  <span className="text-[10px] text-white/50 uppercase font-bold font-excon-bold">Ladies Hostels</span>
                </div>
              </div>
              <p className="text-xs text-white/70 font-excon">Sr. Grace Mary</p>
              <a
                href="tel:+919446367890"
                className="inline-flex items-center gap-2 text-xs font-bold text-marvel-red hover:underline font-excon-bold"
              >
                <RiPhoneFill /> +91 94463 67890
              </a>
            </div>

            {/* General Control Desk */}
            <div className="marvel-card bg-white/5 border border-metallic-gold/20 p-5 rounded-2xl space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-metallic-gold/20 rounded-xl text-metallic-gold">
                  <RiShieldUserLine className="text-xl" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-white uppercase font-excon-black">MACFAST Fest Hospitality</h4>
                  <span className="text-[10px] text-white/50 uppercase font-bold font-excon-bold">General Enquiries</span>
                </div>
              </div>
              <p className="text-xs text-white/70 font-excon">Central Registration Desk</p>
              <a
                href="tel:+914692600000"
                className="inline-flex items-center gap-2 text-xs font-bold text-metallic-gold hover:underline font-excon-bold"
              >
                <RiPhoneFill /> +91 469 260 0000
              </a>
            </div>
          </div>
        </div>

        {/* Accommodation Rules & Instructions */}
        <div className="glass p-8 rounded-2xl border border-arc-cyan/20 space-y-6">
          <h2 className="text-xl font-black uppercase text-white flex items-center gap-2 font-excon-black">
            <RiInformationLine className="text-arc-cyan" />
            <span>Accommodation Guidelines & Rules</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-white/70 font-excon">
            <div className="flex gap-3 bg-white/5 p-4 rounded-xl border border-white/5">
              <span className="w-6 h-6 rounded-full bg-arc-cyan/20 text-arc-cyan font-bold flex items-center justify-center shrink-0 font-excon-bold">1</span>
              <div>
                <strong className="text-white block mb-0.5 font-excon-bold">Mandatory Identification</strong>
                All participants must produce a valid College ID card and Government ID proof (Aadhaar / Driving License) upon check-in.
              </div>
            </div>

            <div className="flex gap-3 bg-white/5 p-4 rounded-xl border border-white/5">
              <span className="w-6 h-6 rounded-full bg-arc-cyan/20 text-arc-cyan font-bold flex items-center justify-center shrink-0 font-excon-bold">2</span>
              <div>
                <strong className="text-white block mb-0.5 font-excon-bold">Check-In & Check-Out Timings</strong>
                Check-in opens at 07:00 AM on Sep 23, 2026. Check-out must be completed by 10:00 AM on the day following festival conclusion.
              </div>
            </div>

            <div className="flex gap-3 bg-white/5 p-4 rounded-xl border border-white/5">
              <span className="w-6 h-6 rounded-full bg-arc-cyan/20 text-arc-cyan font-bold flex items-center justify-center shrink-0 font-excon-bold">3</span>
              <div>
                <strong className="text-white block mb-0.5 font-excon-bold">Separate Male & Female Blocks</strong>
                Male and Female accommodation quarters are strictly segregated with individual warden supervision and security check posts.
              </div>
            </div>

            <div className="flex gap-3 bg-white/5 p-4 rounded-xl border border-white/5">
              <span className="w-6 h-6 rounded-full bg-arc-cyan/20 text-arc-cyan font-bold flex items-center justify-center shrink-0 font-excon-bold">4</span>
              <div>
                <strong className="text-white block mb-0.5 font-excon-bold">Campus Curfew</strong>
                Entry into hostels is permitted till 10:30 PM after evening cultural events. Special late passes can be requested via event coordinators.
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Booking Modal */}
      {isModalOpen && bookingHostel && (
        <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-strong border border-arc-cyan/30 w-full max-w-lg rounded-3xl p-6 md:p-8 space-y-6 max-h-[90vh] overflow-y-auto relative animate-scale-in">

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
                  <span className="text-[10px] text-metallic-gold uppercase font-bold tracking-widest font-excon-bold">Reserve Accommodation</span>
                  <h3 className="text-2xl font-black text-white uppercase tracking-tight font-excon-black mt-1">
                    {bookingHostel.name}
                  </h3>
                  <p className="text-xs text-white/70 mt-1 font-excon">
                    {bookingHostel.type} • {bookingHostel.tariff}
                  </p>
                </div>

                <div className="space-y-4 text-xs font-excon">
                  <div>
                    <label className="block text-white/80 font-semibold mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      suppressHydrationWarning={true}
                      placeholder="Enter your full name"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:border-arc-cyan focus:outline-none placeholder:text-white/30"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white/80 font-semibold mb-1">Gender</label>
                      <select
                        suppressHydrationWarning={true}
                        value={formData.gender}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                        className="w-full px-4 py-2.5 bg-[#0A0D1A] border border-white/10 rounded-xl text-white focus:border-arc-cyan focus:outline-none"
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
                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:border-arc-cyan focus:outline-none placeholder:text-white/30"
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
                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:border-arc-cyan focus:outline-none placeholder:text-white/30"
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
                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:border-arc-cyan focus:outline-none placeholder:text-white/30"
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
                        className="w-full px-4 py-2.5 bg-[#0A0D1A] border border-white/10 rounded-xl text-white focus:border-arc-cyan focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-white/80 font-semibold mb-1">Check-out Date</label>
                      <input
                        type="date"
                        suppressHydrationWarning={true}
                        value={formData.checkOutDate}
                        onChange={(e) => setFormData({ ...formData, checkOutDate: e.target.value })}
                        className="w-full px-4 py-2.5 bg-[#0A0D1A] border border-white/10 rounded-xl text-white focus:border-arc-cyan focus:outline-none"
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
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:border-arc-cyan focus:outline-none placeholder:text-white/30"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  suppressHydrationWarning={true}
                  className="w-full py-3.5 bg-arc-cyan hover:bg-white text-black font-black text-xs uppercase tracking-widest rounded-xl transition-all duration-300 cursor-pointer shadow-[0_0_15px_#00D4FF] font-excon-black"
                >
                  Submit Reservation Request
                </button>
              </form>
            ) : (
              <div className="text-center space-y-6 py-4 font-excon">
                <div className="w-16 h-16 bg-arc-cyan/20 text-arc-cyan rounded-full flex items-center justify-center mx-auto text-3xl border border-arc-cyan/40">
                  <RiCheckLine />
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-white uppercase tracking-tight font-excon-black">
                    Reservation Submitted!
                  </h3>
                  <p className="text-xs text-white/70">
                    Your accommodation request for <strong className="text-white font-excon-bold">{bookingHostel.name}</strong> has been logged.
                  </p>
                </div>

                <div className="bg-white/5 border border-white/10 p-4 rounded-xl text-left space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-white/50 uppercase font-bold text-[10px] font-excon-bold">Reference Booking ID</span>
                    <span className="font-excon-bold text-metallic-gold font-bold">{bookingId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50 uppercase font-bold text-[10px] font-excon-bold">Delegate</span>
                    <span className="text-white font-bold">{formData.fullName} ({formData.gender.toUpperCase()})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50 uppercase font-bold text-[10px] font-excon-bold">Warden Contact</span>
                    <span className="text-white">{bookingHostel.wardenPhone}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <button
                    type="button"
                    suppressHydrationWarning={true}
                    onClick={() => handleWhatsAppBooking(bookingHostel)}
                    className="w-full py-3 bg-arc-cyan text-black font-black text-xs uppercase tracking-widest rounded-xl hover:bg-white transition-colors flex items-center justify-center gap-2 cursor-pointer font-excon-black shadow-[0_0_12px_#00D4FF]"
                  >
                    <RiWhatsappLine className="text-base" />
                    <span>Send Request to Warden via WhatsApp</span>
                  </button>

                  <button
                    type="button"
                    suppressHydrationWarning={true}
                    onClick={() => setIsModalOpen(false)}
                    className="w-full py-2.5 bg-white/10 text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-white/20 transition-colors cursor-pointer font-excon-bold"
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
