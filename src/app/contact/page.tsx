"use client";

import { useState } from "react";
import Image from "next/image";
import { RiMailSendLine, RiPhoneLine, RiMapPin2Line, RiQuestionLine, RiShieldFlashLine } from "react-icons/ri";

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
    <div className="bg-[#05050A] min-h-screen pt-28 pb-16 text-white font-excon relative overflow-hidden">
      {/* Background Marvel peakpx.png Wallpaper (Fit Screen) */}
      <div className="absolute inset-0 z-0 opacity-85 pointer-events-none">
        <Image
          src="/MARVEL/peakpx.png"
          alt="Contact Page Marvel Background"
          fill
          priority
          className="object-cover object-center filter brightness-110 contrast-125"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#05050A]/40 via-[#05050A]/65 to-[#05050A]/95 z-[1]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_45%,rgba(5,5,10,0.85)_95%)] z-[1]" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 relative z-10">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-arc-cyan/40 bg-arc-cyan/10 text-arc-cyan text-xs font-excon-bold font-bold tracking-[0.2em] uppercase shadow-[0_0_15px_rgba(0,212,255,0.25)]">
            <RiShieldFlashLine className="animate-pulse" />
            <span>S.H.I.E.L.D. COMMUNICATIONS DESK</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-white font-excon-black">
            <span className="shimmer-text">CONTACT</span>{" "}
            <span className="gradient-text-plasma">US</span>
          </h1>

          <p className="text-white/80 text-xs sm:text-sm leading-relaxed font-excon font-normal">
            Reach out to our organizing team or browse the list of frequently answered questions.
          </p>
        </div>

        {/* Form and info */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Form */}
          <div className="lg:col-span-7">
            <form onSubmit={handleSubmit} className="glass p-6 md:p-8 rounded-2xl border border-arc-cyan/20 space-y-6 shadow-xl">
              <h3 className="text-lg font-black text-white uppercase tracking-tight font-excon-black">
                Send us a message
              </h3>
              
              <div className="space-y-4 font-excon">
                <div>
                  <label className="block text-xs uppercase font-bold tracking-wider text-white/50 mb-2 font-excon-bold">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@college.edu"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-arc-cyan focus:outline-none text-white text-sm placeholder:text-white/30 transition-all font-excon"
                    suppressHydrationWarning
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase font-bold tracking-wider text-white/50 mb-2 font-excon-bold">
                    Your Message
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={msg}
                    onChange={(e) => setMsg(e.target.value)}
                    placeholder="Write your query here..."
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-arc-cyan focus:outline-none text-white text-sm placeholder:text-white/30 transition-all font-excon"
                    suppressHydrationWarning
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-arc-cyan hover:bg-white text-black font-black text-xs uppercase tracking-[0.15em] rounded-xl transition-all duration-300 cursor-pointer shadow-[0_0_15px_#00D4FF] font-excon-black flex items-center justify-center gap-2"
                suppressHydrationWarning
              >
                <RiMailSendLine className="text-base" />
                <span>Send Query</span>
              </button>
            </form>
          </div>

          {/* Info & Map */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass p-6 md:p-8 rounded-2xl border border-arc-cyan/20 space-y-6 shadow-xl">
              <h3 className="text-lg font-black text-white uppercase tracking-tight font-excon-black">
                Contact Points
              </h3>

              <div className="space-y-4 text-sm text-white/70 font-excon">
                <div className="flex items-center gap-3">
                  <RiPhoneLine className="text-metallic-gold text-lg shrink-0" />
                  <span>General Helpdesk: <strong className="text-white font-bold font-excon-bold">+91 469 273 0300</strong></span>
                </div>
                <div className="flex items-center gap-3">
                  <RiPhoneLine className="text-arc-cyan text-lg shrink-0" />
                  <span>Registrations Head: <strong className="text-white font-bold font-excon-bold">+91 94473 12345</strong></span>
                </div>
                <div className="flex items-center gap-3">
                  <RiMapPin2Line className="text-marvel-red text-lg shrink-0" />
                  <span>MACFAST, Kuttapuzha P.O., Tiruvalla</span>
                </div>
              </div>
            </div>

            {/* Google Map Mockup */}
            <div className="glass h-48 rounded-2xl border border-arc-cyan/20 overflow-hidden relative flex items-center justify-center text-white/40 text-xs font-bold uppercase tracking-wider bg-white/5 font-excon-bold">
              <span>Map coordinates: 9.3879° N, 76.5684° E</span>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div className="space-y-8">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-arc-cyan/40 bg-arc-cyan/10 text-arc-cyan text-xs font-excon-bold font-bold tracking-[0.2em] uppercase">
              <RiQuestionLine />
              <span>TROUBLESHOOT & FAQS</span>
            </div>
            <h2 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tight font-excon-black">
              <span className="shimmer-text">FREQUENTLY ASKED</span>{" "}
              <span className="gradient-text-plasma">QUESTIONS</span>
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="marvel-card p-6 rounded-2xl border border-arc-cyan/20 hover:border-arc-cyan transition-all space-y-2 shadow-lg">
                <h4 className="font-bold text-white text-base flex items-center gap-2 font-excon-bold">
                  <RiQuestionLine className="text-arc-cyan text-lg shrink-0" />
                  <span>{faq.q}</span>
                </h4>
                <p className="text-white/70 text-xs sm:text-sm pl-7 leading-relaxed font-excon">
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
