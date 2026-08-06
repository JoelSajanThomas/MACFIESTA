"use client";

import Link from "next/link";
import Image from "next/image";
import {
  RiInstagramFill,
  RiYoutubeFill,
  RiLinkedinBoxFill,
  RiTwitterXFill,
  RiMapPinLine,
  RiPhoneLine,
  RiMailLine,
  RiArrowUpLine,
  RiShieldCheckLine,
  RiFlashlightLine,
} from "react-icons/ri";
import { usePathname } from "next/navigation";
import { SOCIAL_LINKS } from "@/lib/constants";
import { useFestivalControl } from "@/lib/festivalStore";

const portals = [
  { label: "Participant Portal", href: "/dashboard" },
  { label: "Command Console", href: "/admin" },
  { label: "Mission Control", href: "/admin/console" },
  { label: "Volunteer HQ", href: "/volunteers" },
  { label: "Judge Command", href: "/judges" },
];

const resources = [
  { label: "Mission Brochure", href: "/brochure" },
  { label: "Jarvis FAQ", href: "/faq" },
  { label: "Protocol Rulebook", href: "/rules" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Comms Support", href: "/contact" },
];

const socialIcons: Record<string, React.ComponentType<{ size?: number }>> = {
  instagram: RiInstagramFill,
  youtube: RiYoutubeFill,
  linkedin: RiLinkedinBoxFill,
  twitter: RiTwitterXFill,
};

export function Footer() {
  const { settings } = useFestivalControl();
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer
      className="relative bg-gradient-to-b from-[#05050A] via-[#0A0D1A] to-[#020205] border-t border-arc-cyan/20 overflow-hidden z-10 text-white"
      role="contentinfo"
      aria-label="Main Footer"
    >
      {/* Background Arc Reactor & Quantum Glow */}
      <div
        className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-marvel-red/10 blur-[130px] pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-10 right-10 w-[350px] h-[350px] rounded-full bg-arc-cyan/10 blur-[110px] pointer-events-none"
        aria-hidden="true"
      />

      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-marvel-red via-arc-cyan to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-8 pb-12 border-b border-white/10">

          {/* Brand & Arc Reactor Core Column */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-6">
            <Link
              href="/"
              className="flex items-center gap-3 group focus:outline-none"
              aria-label="MACFIESTA Home Link"
            >
              <div className="relative w-11 h-11 flex items-center justify-center">
                <Image
                  src={settings.logoUrl || "/logo.png"}
                  alt={`${settings.name} Logo`}
                  width={44}
                  height={44}
                  className="object-contain group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div>
                <h3 className="text-xl font-black tracking-widest uppercase flex items-center gap-1" style={{ fontFamily: "var(--font-heading)" }}>
                  <span className="gradient-text-gold neon-gold">{settings.name.slice(0, 3).toUpperCase()}</span>
                  <span className="text-white">{settings.name.slice(3).toUpperCase() || "FIESTA"}</span>
                </h3>
                <p className="text-[9px] text-arc-cyan tracking-[0.25em] uppercase font-mono font-bold">
                  MARVELVERSE • {settings.edition}
                </p>
              </div>
            </Link>

            <p className="text-xs text-white/60 leading-relaxed max-w-sm font-mono">
              Avengers Headquarters Tactical Command Center. Host venue: {settings.venueAddress}. Connect your suit, assemble your team, and conquer missions.
            </p>

            <div className="flex gap-3 justify-center md:justify-start">
              {SOCIAL_LINKS.map((link) => {
                const Icon = socialIcons[link.platform];
                const targetUrl = link.platform === "instagram" ? settings.socialInstagram || link.url :
                                  link.platform === "youtube" ? settings.socialYoutube || link.url :
                                  link.platform === "linkedin" ? settings.socialLinkedin || link.url : link.url;
                return (
                  <a
                    key={link.platform}
                    href={targetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-white/5 border border-arc-cyan/20 rounded-xl text-white/60 hover:text-arc-cyan hover:border-arc-cyan hover:bg-arc-cyan/10 hover:shadow-[0_0_15px_#00D4FF] transition-all duration-300 hover:scale-110"
                    aria-label={`Follow ${settings.name} on ${link.label}`}
                  >
                    <Icon size={18} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* S.H.I.E.L.D. Portals & Resources Column */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-6">
            <h4
              className="text-xs font-bold text-arc-cyan uppercase tracking-[0.25em] relative pb-2 font-mono flex items-center gap-2"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              <RiFlashlightLine /> S.H.I.E.L.D. Portals & Protocols
            </h4>
            <div className="grid grid-cols-2 gap-x-8 gap-y-3 w-full justify-items-center md:justify-items-start">
              <div className="space-y-3 text-left">
                <p className="text-[9px] text-white/40 uppercase font-mono font-black tracking-wider">Portals</p>
                <ul className="space-y-2.5">
                  {portals.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="inline-block text-xs text-white/70 hover:text-arc-cyan transition-all duration-300 relative pb-0.5"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-3 text-left">
                <p className="text-[9px] text-white/40 uppercase font-mono font-black tracking-wider">Resources</p>
                <ul className="space-y-2.5">
                  {resources.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="inline-block text-xs text-white/70 hover:text-arc-cyan transition-all duration-300 relative pb-0.5"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Stark Comms & Security Badge Column */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-6">
            <h4
              className="text-xs font-bold text-marvel-red uppercase tracking-[0.25em] relative pb-2 font-mono"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Stark Communications
            </h4>

            <div className="glass p-4 rounded-2xl border border-arc-cyan/20 space-y-3 w-full max-w-[300px] text-left">
              <div className="flex gap-2.5 items-start">
                <RiMapPinLine className="text-arc-cyan text-base mt-0.5 shrink-0" />
                <span className="text-xs text-white/70 leading-relaxed font-mono">
                  {settings.venueAddress}
                </span>
              </div>
              <div className="flex gap-2.5 items-center">
                <RiPhoneLine className="text-marvel-red text-base shrink-0" />
                <a
                  href={`tel:${settings.contactPhone}`}
                  className="text-xs text-white/70 hover:text-white transition-colors font-mono"
                >
                  {settings.contactPhone}
                </a>
              </div>
              <div className="flex gap-2.5 items-center">
                <RiMailLine className="text-metallic-gold text-base shrink-0" />
                <a
                  href={`mailto:${settings.contactEmail}`}
                  className="text-xs text-white/70 hover:text-white transition-colors font-mono"
                >
                  {settings.contactEmail}
                </a>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-marvel-red/10 border border-marvel-red/40 rounded-full select-none shadow-[0_0_15px_rgba(237,29,36,0.2)]">
              <RiShieldCheckLine className="text-marvel-red animate-pulse text-sm" />
              <span className="text-[10px] text-marvel-red font-bold tracking-widest uppercase font-mono">
                S.H.I.E.L.D. Security Level 10 Active
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="pt-8 grid grid-cols-1 md:grid-cols-3 gap-6 items-center text-center md:text-left justify-items-center md:justify-items-stretch">
          <div className="text-xs text-white/40 font-mono md:text-left">
            © {new Date().getFullYear()} {settings.name.toUpperCase()} MARVELVERSE. All rights reserved.
          </div>

          <div className="flex gap-6 justify-center text-xs text-white/50 font-mono">
            <Link href="/privacy" className="hover:text-arc-cyan transition-colors">
              Privacy Protocol
            </Link>
            <Link href="/rules" className="hover:text-arc-cyan transition-colors">
              Mission Directives
            </Link>
          </div>

          <div className="flex items-center gap-4 justify-center md:justify-end w-full max-w-[280px] md:max-w-none">
            <span className="text-[11px] text-white/40 tracking-wider font-mono select-none">
              Engineered by <span className="text-metallic-gold font-bold uppercase tracking-wider">Joel Sajan Thomas & Joel Zacharia</span>
            </span>

            <button
              onClick={scrollToTop}
              type="button"
              suppressHydrationWarning={true}
              className="p-2.5 bg-arc-cyan/10 border border-arc-cyan/40 rounded-full text-arc-cyan hover:bg-arc-cyan hover:text-black transition-all duration-300 shadow-[0_0_15px_rgba(0,212,255,0.3)] cursor-pointer"
              aria-label="Scroll back to top of the page"
            >
              <RiArrowUpLine size={16} />
            </button>

          </div>
        </div>
      </div>
    </footer>
  );
}

