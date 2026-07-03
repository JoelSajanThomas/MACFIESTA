import { HeroSection } from "@/components/hero/HeroSection";
import { AboutFestival } from "@/components/home/AboutFestival";
import { FeaturedEvents } from "@/components/home/FeaturedEvents";
import { SchedulePreview } from "@/components/home/SchedulePreview";
import { SponsorsSection } from "@/components/home/SponsorsSection";
import { GalleryPreview } from "@/components/home/GalleryPreview";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { RegistrationCTA } from "@/components/home/RegistrationCTA";

export default function Home() {
  return (
    <div className="relative w-full bg-festival-dark">
      {/* Dynamic Ambient Background Glow */}
      <div className="absolute top-0 left-0 right-0 h-[100vh] bg-gradient-to-b from-festival-purple/10 to-transparent pointer-events-none z-0" />
      
      {/* Sections composing the Home Experience */}
      <HeroSection />
      <AboutFestival />
      <FeaturedEvents />
      <SchedulePreview />
      <SponsorsSection />
      <GalleryPreview />
      <TestimonialsSection />
      <RegistrationCTA />
    </div>
  );
}
