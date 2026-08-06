/* ============================================
   MacFiesta 2K25 — Constants & Configuration
   ============================================ */

/** Festival configuration — change these for each year */
export const FESTIVAL_CONFIG = {
  name: "MacFiesta",
  year: "2K26",
  fullYear: "2026",
  tagline: "Where Legends Rise",
  subtitle: "2026's Most Awaited Fest!",
  motto: "United to Excel",
  college: "MACFAST",
  collegeFull: "Mar Athanasios College for Advanced Studies, Tiruvalla",
  /** Target date for countdown timer (ISO string) — update as needed */
  festivalDate: new Date("2026-09-24T09:00:00+05:30"),
  festivalEndDate: new Date("2026-09-25T22:00:00+05:30"),
  registrationFee: 150,
  lunchFee: 200,
  totalEvents: 26,
  logoUrl: "/logo.png",
} as const;

/** Navigation items */
export const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Events", href: "/events" },
  { label: "Schedule", href: "/schedule" },
  { label: "Gallery", href: "/gallery" },
  { label: "Scoreboard", href: "/scoreboard" },
  { label: "Results", href: "/results" },
  { label: "Accommodation", href: "/accommodation" },
  { label: "Contact", href: "/contact" },
] as const;

/** Event categories */
export const EVENT_CATEGORIES = [
  { id: "general", label: "General Events", color: "#EAB308" },
  { id: "technical", label: "Technical Events", color: "#06B6D4" },
  { id: "cultural", label: "Cultural Events", color: "#EC4899" },
  { id: "gaming", label: "Gaming Events", color: "#7C3AED" },
  { id: "sports", label: "Sports Events", color: "#F97316" },
] as const;

/** Event participation types */
export const EVENT_TYPES = [
  { id: "solo", label: "Solo", description: "Unleash your individual power", icon: "🎯" },
  { id: "duo", label: "Duo", description: "Partner up for double the impact", icon: "🤝" },
  { id: "trio", label: "Trio", description: "Three minds, one mission", icon: "🔱" },
  { id: "squad", label: "Squad", description: "Four warriors, unstoppable force", icon: "⚔️" },
  { id: "group", label: "Group", description: "Unite your team for glory", icon: "🏆" },
] as const;

/** Sponsor tiers */
export const SPONSOR_TIERS = [
  { id: "platinum", label: "Platinum Partners", color: "#E5E7EB" },
  { id: "gold", label: "Gold Partners", color: "#EAB308" },
  { id: "silver", label: "Silver Partners", color: "#94A3B8" },
  { id: "community", label: "Community Partners", color: "#06B6D4" },
] as const;

/** Social media links */
export const SOCIAL_LINKS = [
  { platform: "instagram", url: "https://www.instagram.com/macfiestaofficial", label: "Instagram" },
  { platform: "youtube", url: "https://youtube.com/@macfiesta", label: "YouTube" },
  { platform: "linkedin", url: "https://linkedin.com/company/macfast", label: "LinkedIn" },
  { platform: "twitter", url: "https://twitter.com/macfiesta", label: "Twitter" },
] as const;

/** API base URL */
export const API_BASE_URL =
  typeof window !== "undefined"
    ? (process.env.NEXT_PUBLIC_API_URL || `http://${window.location.hostname}:5000/api`)
    : (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api");

/** Socket.io URL */
export const SOCKET_URL =
  typeof window !== "undefined"
    ? (process.env.NEXT_PUBLIC_SOCKET_URL || `http://${window.location.hostname}:5000`)
    : (process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000");
