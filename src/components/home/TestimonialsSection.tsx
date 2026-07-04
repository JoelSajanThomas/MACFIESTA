"use client";

import { motion } from "framer-motion";
import { RiDoubleQuotesR, RiStarFill } from "react-icons/ri";

const testimonials = [
  {
    quote: "MacFiesta 2K24 was absolute fire! The gaming arena structure and stage lighting rivaled major esports setups.",
    name: "Adarsh Sen",
    college: "CET Trivandrum",
    rating: 5,
  },
  {
    quote: "Outstanding organizational structure. From registration QR passes to schedule timelines, everything was extremely seamless.",
    name: "Sneha Nair",
    college: "TKM Kollam",
    rating: 5,
  },
  {
    quote: "The concert show was legendary. I have never seen a college fest crowd so packed and energized!",
    name: "Rohan Mathew",
    college: "Sacred Heart Thevara",
    rating: 5,
  },
];

export function TestimonialsSection() {
  return (
    <section className="relative bg-festival-dark section-padding border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="text-center space-y-4 mb-16">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-festival-gold text-xs font-bold tracking-[0.2em] uppercase"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Attendee Buzz
          </motion.div>
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="section-title text-white"
          >
            What They <span className="gradient-text-gold neon-gold">Say</span>
          </motion.h2>
        </div>

        {/* Responsive grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="glass-card p-8 rounded-2xl border border-white/5 flex flex-col justify-between relative shadow-xl min-h-[250px]"
            >
              <div className="absolute top-6 right-8 text-white/5 text-5xl pointer-events-none">
                <RiDoubleQuotesR />
              </div>

              <div className="space-y-4">
                <div className="flex gap-1 text-festival-gold text-sm">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <RiStarFill key={i} />
                  ))}
                </div>
                <p className="text-white/70 leading-relaxed text-sm italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              <div className="pt-6 border-t border-white/5 mt-6">
                <span className="block font-bold text-white text-sm" style={{ fontFamily: "var(--font-heading)" }}>
                  {t.name}
                </span>
                <span className="block text-xs text-white/40 mt-0.5">
                  {t.college}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
