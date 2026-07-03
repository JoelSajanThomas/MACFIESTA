"use client";

import { motion } from "framer-motion";
import { RiAwardLine, RiGroupLine, RiFlashlightLine, RiMagicLine } from "react-icons/ri";

const stats = [
  { icon: RiAwardLine, value: "26+", label: "Exciting Events", color: "text-festival-gold" },
  { icon: RiGroupLine, value: "5000+", label: "Footfalls Expected", color: "text-festival-purple" },
  { icon: RiFlashlightLine, value: "₹2L+", label: "Prize Pool", color: "text-festival-cyan" },
  { icon: RiMagicLine, value: "10+", label: "Pro-Shows", color: "text-festival-pink" },
];

export function AboutFestival() {
  return (
    <section className="relative bg-festival-dark section-padding overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/10 w-96 h-96 rounded-full bg-festival-purple/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/10 w-96 h-96 rounded-full bg-festival-gold/10 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Left Text content */}
          <div className="lg:col-span-6 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-festival-gold text-xs font-bold tracking-[0.2em] uppercase"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              The Legacy
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="section-title text-white"
            >
              Where Legends <br />
              <span className="gradient-text-gold neon-gold">Rise & Excel</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-white/60 leading-relaxed text-base"
            >
              Mar Athanasios College for Advanced Studies Tiruvalla (MACFAST) presents MacFiesta, a national level multi-fest combining cultural extravaganzas, technical coding challenges, business case studies, food technology events, and futuristic gaming arenas.
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-white/60 leading-relaxed text-base"
            >
              Over the course of two action-packed days, the brightest minds from universities across the nation gather to compete, learn, collaborate, and push the boundaries of skill and creativity.
            </motion.p>
          </div>

          {/* Right Stats grid */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-4 md:gap-6">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="glass-card p-6 md:p-8 rounded-2xl border border-white/5 text-center flex flex-col items-center justify-center space-y-4 shadow-xl"
                >
                  <div className={`p-4 rounded-full bg-white/5 ${stat.color} text-2xl md:text-3xl`}>
                    <Icon />
                  </div>
                  <div className="space-y-1">
                    <span className="block text-3xl md:text-4xl font-extrabold text-white" style={{ fontFamily: "var(--font-heading)" }}>
                      {stat.value}
                    </span>
                    <span className="block text-xs md:text-sm text-white/50 font-medium">
                      {stat.label}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
