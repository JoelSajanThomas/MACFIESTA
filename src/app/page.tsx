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
  return (
    <div className="relative w-full bg-[#05050A] overflow-hidden">
      {/* Ambient Marvelverse Glow Background */}
      <div className="absolute top-0 left-0 right-0 h-[100vh] bg-gradient-to-b from-marvel-red/10 via-arc-cyan/5 to-transparent pointer-events-none z-0" />

      {/* Sections composing the Marvelverse Home Experience */}
      <HeroSection />
      <AboutFestival />
      <FeaturedEvents />
      <InfinityChallenge />
      <MarvelTimeline />
      <SchedulePreview />
      <SponsorsSection />
      <GalleryPreview />
      <TestimonialsSection />
      <RegistrationCTA />
    </div>
  );
}
