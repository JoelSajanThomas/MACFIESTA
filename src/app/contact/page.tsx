"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { RiMailSendLine, RiPhoneLine, RiMapPin2Line, RiQuestionLine } from "react-icons/ri";

const faqs = [
  { q: "Who can participate in MacFiesta events?", a: "Any active college student (UG or PG) with a valid college ID card can participate in MacFiesta cultural or technical challenges." },
  { q: "Is registration fee refundable?", a: "No, once registration passes or individual event slots are booked, fees are non-refundable." },
  { q: "Will accommodation be provided?", a: "Accommodation can be selected and configured on the student portal after sign-in. Additional charges apply." },
];

export default function ContactPage() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Thank you for reaching out! Your query has been logged.`);
    setEmail("");
    setMsg("");
  };

  return (
    <div className="bg-festival-dark min-h-screen pt-28 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-wider text-white" style={{ fontFamily: "var(--font-heading)" }}>
            Contact <span className="gradient-text-gold neon-gold">Us</span>
          </h1>
          <p className="text-white/60 text-sm md:text-base">
            Reach out to our organizing team or browse the list of frequently answered questions.
          </p>
        </div>

        {/* Form and info */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Form */}
          <div className="lg:col-span-7">
            <form onSubmit={handleSubmit} className="glass p-6 md:p-8 rounded-2xl border border-white/5 space-y-6 shadow-xl">
              <h3 className="text-lg font-bold text-white uppercase tracking-wider" style={{ fontFamily: "var(--font-heading)" }}>
                Send us a message
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs uppercase font-bold tracking-wider text-white/50 mb-2" style={{ fontFamily: "var(--font-heading)" }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@college.edu"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-festival-gold/50 focus:outline-none text-white text-sm"
                    suppressHydrationWarning
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase font-bold tracking-wider text-white/50 mb-2" style={{ fontFamily: "var(--font-heading)" }}>
                    Your Message
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={msg}
                    onChange={(e) => setMsg(e.target.value)}
                    placeholder="Write your query here..."
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-festival-gold/50 focus:outline-none text-white text-sm"
                    suppressHydrationWarning
                  />
                </div>
              </div>

              <button type="submit" className="btn-primary w-full justify-center flex py-3.5 gap-2" suppressHydrationWarning>
                <RiMailSendLine />
                <span>Send Query</span>
              </button>
            </form>
          </div>

          {/* Info & Map */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass p-6 md:p-8 rounded-2xl border border-white/5 space-y-6">
              <h3 className="text-lg font-bold text-white uppercase tracking-wider" style={{ fontFamily: "var(--font-heading)" }}>
                Contact Points
              </h3>

              <div className="space-y-4 text-sm text-white/70">
                <div className="flex items-center gap-3">
                  <RiPhoneLine className="text-festival-gold text-lg" />
                  <span>General Helpdesk: +91 469 273 0300</span>
                </div>
                <div className="flex items-center gap-3">
                  <RiPhoneLine className="text-festival-purple text-lg" />
                  <span>Registrations Head: +91 94473 12345</span>
                </div>
                <div className="flex items-center gap-3">
                  <RiMapPin2Line className="text-festival-cyan text-lg" />
                  <span>MACFAST, Kuttapuzha P.O., Tiruvalla</span>
                </div>
              </div>
            </div>

            {/* Google Map Mockup */}
            <div className="glass h-48 rounded-2xl border border-white/5 overflow-hidden relative flex items-center justify-center text-white/30 text-xs font-bold uppercase tracking-wider bg-white/1" style={{ fontFamily: "var(--font-heading)" }}>
              <span>Map coordinates: 9.3879° N, 76.5684° E</span>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <div className="text-festival-gold text-xs font-bold tracking-[0.2em] uppercase" style={{ fontFamily: "var(--font-heading)" }}>
              Troubleshoot
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-wider" style={{ fontFamily: "var(--font-heading)" }}>
              Frequently Asked <span className="gradient-text-gold">Questions</span>
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="glass p-6 rounded-2xl border border-white/5 space-y-2">
                <h4 className="font-bold text-white text-base flex items-center gap-2">
                  <RiQuestionLine className="text-festival-gold" />
                  {faq.q}
                </h4>
                <p className="text-white/60 text-sm pl-6 leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
