"use client";

import { useState, useEffect } from "react";

export interface FestivalSettings {
  name: string;
  edition: string;
  tagline: string;
  subtitle: string;
  motto: string;
  logoUrl: string;
  faviconUrl: string;
  homepageBanner: string;
  aboutText: string;
  contactEmail: string;
  contactPhone: string;
  venueAddress: string;
  registrationOpen: boolean;
  maintenanceMode: boolean;
  countdownEnabled: boolean;
  socialInstagram: string;
  socialYoutube: string;
  socialLinkedin: string;
}

export interface TimelineSettings {
  festStartDate: string;
  festEndDate: string;
  regOpenDate: string;
  regCloseDate: string;
  spotRegDate: string;
  resultPubDate: string;
  certificateDate: string;
  autoCloseRegistration: boolean;
  autoPublishResults: boolean;
}

export interface ThemeSettings {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  fontFamily: string;
  borderRadius: string;
  shadowIntensity: string;
  animationSpeed: string;
}

export interface HomepageSection {
  id: string;
  title: string;
  visible: boolean;
  order: number;
}

const DEFAULT_SETTINGS: FestivalSettings = {
  name: "MacFiesta",
  edition: "2K26",
  tagline: "Where Legends Rise",
  subtitle: "2026's Most Awaited Inter-Collegiate Fest!",
  motto: "United to Excel",
  logoUrl: "/logo.png",
  faviconUrl: "/favicon.ico",
  homepageBanner: "/fiesta_promo.mp4",
  aboutText: "MacFiesta is the premier national inter-collegiate festival hosted by MACFAST, bringing together thousands of delegates across technology, culture, and sports.",
  contactEmail: "macfiesta@macfast.org",
  contactPhone: "+91 94470 00000",
  venueAddress: "MACFAST Campus, Tiruvalla, Pathanamthitta, Kerala 689101",
  registrationOpen: true,
  maintenanceMode: false,
  countdownEnabled: true,
  socialInstagram: "https://instagram.com/macfiestaofficial",
  socialYoutube: "https://youtube.com/@macfiesta",
  socialLinkedin: "https://linkedin.com/company/macfast",
};

const DEFAULT_TIMELINE: TimelineSettings = {
  festStartDate: "2026-09-24T09:00:00",
  festEndDate: "2026-09-25T22:00:00",
  regOpenDate: "2026-08-01T00:00:00",
  regCloseDate: "2026-09-22T23:59:59",
  spotRegDate: "2026-09-24T08:00:00",
  resultPubDate: "2026-09-25T18:00:00",
  certificateDate: "2026-09-26T10:00:00",
  autoCloseRegistration: true,
  autoPublishResults: true,
};

const DEFAULT_THEME: ThemeSettings = {
  primaryColor: "#F5B301",
  secondaryColor: "#10B981",
  backgroundColor: "#09090b",
  fontFamily: "Inter",
  borderRadius: "16px",
  shadowIntensity: "medium",
  animationSpeed: "normal",
};

const DEFAULT_SECTIONS: HomepageSection[] = [
  { id: "hero", title: "Hero Banner", visible: true, order: 0 },
  { id: "featured_events", title: "Featured Events Grid", visible: true, order: 1 },
  { id: "countdown", title: "Festival Countdown", visible: true, order: 2 },
  { id: "about", title: "About Festival", visible: true, order: 3 },
  { id: "highlights", title: "Festival Highlights Ticker", visible: true, order: 4 },
  { id: "schedule_preview", title: "Schedule Preview", visible: true, order: 5 },
  { id: "sponsors", title: "Sponsors & Partners", visible: true, order: 6 },
  { id: "gallery", title: "Photo & Video Gallery", visible: true, order: 7 },
  { id: "guests", title: "Chief Guests & Speakers", visible: true, order: 8 },
  { id: "faq", title: "Frequently Asked Questions", visible: true, order: 9 },
  { id: "footer", title: "Footer Links & Info", visible: true, order: 10 },
];

let listeners: Array<() => void> = [];
let syncChannel: BroadcastChannel | null = null;

if (typeof window !== "undefined" && "BroadcastChannel" in window) {
  try {
    syncChannel = new BroadcastChannel("macfiesta_sync");
    syncChannel.onmessage = () => {
      notifyListeners();
    };
  } catch {}
}

export function getFestivalSettings(): FestivalSettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const saved = localStorage.getItem("macfiesta_control_settings");
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveFestivalSettings(settings: Partial<FestivalSettings>) {
  const current = getFestivalSettings();
  const updated = { ...current, ...settings };
  try {
    localStorage.setItem("macfiesta_control_settings", JSON.stringify(updated));
  } catch {}
  notifyListeners();
  return updated;
}

export function getTimelineSettings(): TimelineSettings {
  if (typeof window === "undefined") return DEFAULT_TIMELINE;
  try {
    const saved = localStorage.getItem("macfiesta_control_timeline");
    return saved ? JSON.parse(saved) : DEFAULT_TIMELINE;
  } catch {
    return DEFAULT_TIMELINE;
  }
}

export function saveTimelineSettings(timeline: Partial<TimelineSettings>) {
  const current = getTimelineSettings();
  const updated = { ...current, ...timeline };
  try {
    localStorage.setItem("macfiesta_control_timeline", JSON.stringify(updated));
  } catch {}
  notifyListeners();
  return updated;
}

export function getThemeSettings(): ThemeSettings {
  if (typeof window === "undefined") return DEFAULT_THEME;
  try {
    const saved = localStorage.getItem("macfiesta_control_theme");
    return saved ? JSON.parse(saved) : DEFAULT_THEME;
  } catch {
    return DEFAULT_THEME;
  }
}

export function saveThemeSettings(theme: Partial<ThemeSettings>) {
  const current = getThemeSettings();
  const updated = { ...current, ...theme };
  try {
    localStorage.setItem("macfiesta_control_theme", JSON.stringify(updated));
  } catch {}
  notifyListeners();
  return updated;
}

export function getHomepageSections(): HomepageSection[] {
  if (typeof window === "undefined") return DEFAULT_SECTIONS;
  try {
    const saved = localStorage.getItem("macfiesta_homepage_sections");
    return saved ? JSON.parse(saved) : DEFAULT_SECTIONS;
  } catch {
    return DEFAULT_SECTIONS;
  }
}

export function saveHomepageSections(sections: HomepageSection[]) {
  try {
    localStorage.setItem("macfiesta_homepage_sections", JSON.stringify(sections));
  } catch {}
  notifyListeners();
  return sections;
}

function notifyListeners() {
  listeners.forEach((l) => l());
  if (syncChannel) {
    try {
      syncChannel.postMessage("updated");
    } catch {}
  }
}

export function useFestivalControl() {
  const [settings, setSettingsState] = useState<FestivalSettings>(DEFAULT_SETTINGS);
  const [timeline, setTimelineState] = useState<TimelineSettings>(DEFAULT_TIMELINE);
  const [theme, setThemeState] = useState<ThemeSettings>(DEFAULT_THEME);
  const [sections, setSectionsState] = useState<HomepageSection[]>(DEFAULT_SECTIONS);

  useEffect(() => {
    // Sync settings from localStorage once mounted on client to avoid SSR hydration mismatch
    setSettingsState(getFestivalSettings());
    setTimelineState(getTimelineSettings());
    setThemeState(getThemeSettings());
    setSectionsState(getHomepageSections());

    const handleChange = () => {
      setSettingsState(getFestivalSettings());
      setTimelineState(getTimelineSettings());
      setThemeState(getThemeSettings());
      setSectionsState(getHomepageSections());
    };

    listeners.push(handleChange);

    const handleStorageEvent = (e: StorageEvent) => {
      if (e.key && e.key.startsWith("macfiesta_")) {
        handleChange();
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("storage", handleStorageEvent);
    }

    return () => {
      listeners = listeners.filter((l) => l !== handleChange);
      if (typeof window !== "undefined") {
        window.removeEventListener("storage", handleStorageEvent);
      }
    };
  }, []);

  const updateSettings = (partial: Partial<FestivalSettings>) => saveFestivalSettings(partial);
  const updateTimeline = (partial: Partial<TimelineSettings>) => saveTimelineSettings(partial);
  const updateTheme = (partial: Partial<ThemeSettings>) => saveThemeSettings(partial);
  const updateSections = (sec: HomepageSection[]) => saveHomepageSections(sec);

  return {
    settings,
    timeline,
    theme,
    sections,
    updateSettings,
    updateTimeline,
    updateTheme,
    updateSections,
  };
}

