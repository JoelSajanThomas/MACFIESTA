"use client";

import { motion } from "framer-motion";
import { SPONSOR_TIERS } from "@/lib/constants";
import { RiShakeHandsLine } from "react-icons/ri";

const sponsorsList = [
  { name: "Apex Tech Labs", tier: "platinum", logo: "🤝", desc: "Digital Infrastructure Partner providing global esports servers." },
  { name: "Zenith Holdings", tier: "platinum", logo: "⭐", desc: "Corporate Venture backing tech hackathon prize structures." },
  { name: "Pinnacle Foods Ltd", tier: "gold", logo: "🏆", desc: "Official catering provider offering multi-cuisine spreads." },
  { name: "Nova Media Group", tier: "gold", logo: "💎", desc: "Streaming partner broadcasting events live globally." },
  { name: "Vanguard Studios", tier: "silver", logo: "🎨", desc: "Official graphics design and stage visual supplier." },
  { name: "Electro Charge", tier: "silver", logo: "⚡", desc: "Providing dynamic power backup and solar arrays." },
  { name: "Community Tech Hub", tier: "community", logo: "🌐", desc: "Local tech network driving volunteer outreach programs." }
];

export default function SponsorsPage() {
  return (
    <div className="bg-festival-dark min-h-screen pt-28 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-wider text-white" style={{ fontFamily: "var(--font-heading)" }}>
            Our <span className="gradient-text-gold neon-gold">Sponsors</span>
          </h1>
          <p className="text-white/60 text-sm md:text-base">
            Collaborating with leading national and regional organizations to power MacFiesta 2K25.
          </p>
        </div>

        {/* Tier Lists */}
        {SPONSOR_TIERS.map((tierGroup) => {
          const tierSponsors = sponsorsList.filter((s) => s.tier === tierGroup.id);
          if (tierSponsors.length === 0) return null;

          return (
            <div key={tierGroup.id} className="space-y-6">
              <div className="flex items-center gap-3 border-b border-white/5 pb-3">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: tierGroup.color }} />
                <h2 className="text-xl font-bold uppercase tracking-wider text-white" style={{ fontFamily: "var(--font-heading)" }}>
                  {tierGroup.label}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tierSponsors.map((sponsor, idx) => (
                  <motion.div
                    key={sponsor.name}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.05 }}
                    className="glass-card p-6 rounded-2xl border border-white/5 space-y-4 flex flex-col justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-4xl p-3 bg-white/5 rounded-xl">{sponsor.logo}</span>
                      <div>
                        <h3 className="font-bold text-white uppercase text-base" style={{ fontFamily: "var(--font-heading)" }}>
                          {sponsor.name}
                        </h3>
                        <span className="text-[10px] uppercase font-bold tracking-widest text-festival-gold" style={{ fontFamily: "var(--font-heading)" }}>
                          {sponsor.tier} Partner
                        </span>
                      </div>
                    </div>
                    <p className="text-white/50 text-xs leading-relaxed">
                      {sponsor.desc}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          );
        })}

        {/* Invite CTA Banner */}
        <div className="glass p-8 rounded-3xl border border-white/5 text-center max-w-3xl mx-auto space-y-6">
          <div className="text-3xl text-festival-gold p-3 bg-white/5 rounded-full w-fit mx-auto">
            <RiShakeHandsLine />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-white uppercase tracking-wider" style={{ fontFamily: "var(--font-heading)" }}>
              Become a Sponsor
            </h3>
            <p className="text-white/60 text-sm max-w-lg mx-auto leading-relaxed">
              Exhibit your brand before 5000+ college students, tech leaders, and cultural enthusiasts. Connect with our sponsorship team.
            </p>
          </div>
          <button
            onClick={() => alert("Please send partnership query to info@macfiesta.macfast.org")}
            className="btn-primary"
          >
            <span>Partner With Us</span>
          </button>
        </div>

      </div>
    </div>
  );
}
