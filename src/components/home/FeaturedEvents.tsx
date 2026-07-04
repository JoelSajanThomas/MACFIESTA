"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { RiArrowRightLine, RiTrophyLine, RiMapPinLine, RiTimeLine } from "react-icons/ri";

const featured = [
  {
    title: "Urumi Gaming",
    category: "gaming",
    prize: "₹30,000",
    venue: "Main Hall / Esports Arena",
    time: "Day 1, 11:00 AM",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop",
    link: "/events/urumi-gaming",
    color: "from-festival-purple to-festival-pink",
  },
  {
    title: "Dusk 'N Dawn Concert",
    category: "cultural",
    prize: "Pro Show",
    venue: "Main Stage Area",
    time: "Day 2, 6:00 PM",
    image: "https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=800&auto=format&fit=crop",
    link: "/events/dusk-n-dawn",
    color: "from-festival-pink to-festival-orange",
  },
  {
    title: "Byte & Code Hackathon",
    category: "technical",
    prize: "₹25,000",
    venue: "Computer Labs",
    time: "Day 1, 10:00 AM",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=800&auto=format&fit=crop",
    link: "/events/byte-and-code",
    color: "from-festival-cyan to-festival-blue",
  },
];

export function FeaturedEvents() {
  return (
    <section className="relative bg-festival-dark section-padding border-t border-white/5 overflow-hidden">
      {/* Background neon blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] rounded-full bg-festival-gold/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-festival-gold text-xs font-bold tracking-[0.2em] uppercase"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Spotlight
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="section-title text-white"
            >
              Featured <span className="gradient-text-festival">Events</span>
            </motion.h2>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Link
              href="/events"
              className="btn-outline text-xs px-6 py-3 flex items-center gap-2 tracking-widest uppercase hover:bg-festival-gold/10"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              View All 26 Events
              <RiArrowRightLine />
            </Link>
          </motion.div>
        </div>

        {/* Featured cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featured.map((item, idx) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="glass-card group overflow-hidden rounded-2xl flex flex-col justify-between h-[450px] relative border border-white/10"
            >
              {/* Event Cover Image */}
              <div className="relative h-1/2 w-full overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-festival-dark-card to-transparent z-10" />
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                
                {/* Category Badge */}
                <div className="absolute top-4 left-4 z-20">
                  <span className="px-3 py-1 text-[10px] font-bold tracking-widest uppercase rounded-full bg-black/50 text-festival-gold border border-festival-gold/30" style={{ fontFamily: "var(--font-heading)" }}>
                    {item.category}
                  </span>
                </div>
              </div>

              {/* Event Details */}
              <div className="p-6 flex-grow flex flex-col justify-between bg-festival-dark-card relative z-20">
                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-white group-hover:text-festival-gold transition-colors duration-300" style={{ fontFamily: "var(--font-heading)" }}>
                    {item.title}
                  </h3>
                  
                  <div className="space-y-2 text-sm text-white/50">
                    <div className="flex items-center gap-2">
                      <RiTrophyLine className="text-festival-gold text-base" />
                      <span>Prize: <strong className="text-white">{item.prize}</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <RiMapPinLine className="text-festival-cyan text-base" />
                      <span className="truncate">{item.venue}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <RiTimeLine className="text-festival-pink className-base" />
                      <span>{item.time}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                  <Link href={item.link} className="text-xs font-bold text-festival-gold hover:text-white transition-colors tracking-widest uppercase flex items-center gap-1" style={{ fontFamily: "var(--font-heading)" }}>
                    Event Details
                    <RiArrowRightLine />
                  </Link>
                  <Link href="/signup" className="text-xs font-bold text-white bg-festival-purple px-4 py-2 rounded-full hover:bg-festival-purple-light transition-all uppercase tracking-widest" style={{ fontFamily: "var(--font-heading)" }}>
                    Register
                  </Link>
                </div>
              </div>

              {/* Bottom decorative color border line */}
              <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${item.color} transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300`} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
