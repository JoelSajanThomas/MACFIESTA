"use client";

import { useFestivalControl } from "@/lib/festivalStore";
import { HeroSection } from "@/components/hero/HeroSection";
import { AboutFestival } from "@/components/home/AboutFestival";
import { FeaturedEvents } from "@/components/home/FeaturedEvents";
import { InfinityChallenge } from "@/components/home/InfinityChallenge";
import { MarvelTimeline } from "@/components/home/MarvelTimeline";
import { SchedulePreview } from "@/components/home/SchedulePreview";
import { SponsorsSection } from "@/components/home/SponsorsSection";
import { GalleryPreview } from "@/components/home/GalleryPreview";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { RegistrationCTA } from "@/components/home/RegistrationCTA";

export default function Home() {
  const { sections } = useFestivalControl();

  const sortedSections = [...sections]
    .filter((s) => s.visible)
    .sort((a, b) => a.order - b.order);

  const sectionMap: Record<string, React.ReactNode> = {
    hero: <HeroSection key="hero" />,
    about: <AboutFestival key="about" />,
    infinity: <InfinityChallenge key="infinity" />,
    featured_events: <FeaturedEvents key="featured_events" />,
    timeline: <MarvelTimeline key="timeline" />,
    schedule_preview: <SchedulePreview key="schedule_preview" />,
    sponsors: <SponsorsSection key="sponsors" />,
    gallery: <GalleryPreview key="gallery" />,
    testimonials: <TestimonialsSection key="testimonials" />,
    cta: <RegistrationCTA key="cta" />,
  };

  return (
    <div className="relative w-full bg-[#05050A] overflow-hidden font-mono">
      {/* Ambient Marvelverse Glow Background */}
      <div className="absolute top-0 left-0 right-0 h-[100vh] bg-gradient-to-b from-marvel-red/10 via-arc-cyan/5 to-transparent pointer-events-none z-0" />

      {sortedSections.map((sec) => sectionMap[sec.id] || null)}
    </div>
  );
}

