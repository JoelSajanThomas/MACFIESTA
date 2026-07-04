"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  RiArrowLeftLine, 
  RiHammerLine, 
  RiMailSendLine,
  RiTimeLine,
  RiListCheck2
} from "react-icons/ri";

const termsSections = [
  {
    id: "acceptance",
    title: "1. Acceptance of Terms",
    content: (
      <>
        <p>
          By accessing, registering, or participating in the <strong>MACFIESTA 2K26</strong> multi-fest, you agree to comply with 
          and be bound by these Terms & Conditions, all applicable laws, and college regulations. 
        </p>
        <p className="mt-3">
          If you do not accept these terms in their entirety, you are not authorized to use the platform, create a participant profile, 
          or enroll in any technical or cultural competitions.
        </p>
      </>
    )
  },
  {
    id: "eligibility",
    title: "2. User Eligibility",
    content: (
      <>
        <p>To register and participate in MACFIESTA, you must meet the following criteria:</p>
        <ul className="list-disc pl-5 mt-2.5 space-y-2">
          <li>Be an actively enrolled student at a recognized higher education institution (UG/PG college or university).</li>
          <li>Possess a valid college identity card and a request/consent letter if required by your department.</li>
          <li>Provide authentic, accurate personal and academic credentials during signup.</li>
        </ul>
      </>
    )
  },
  {
    id: "registration",
    title: "3. Account Registration",
    content: (
      <>
        <p>
          Accessing restricted features and event registries requires account signup. You are solely responsible for:
        </p>
        <ul className="list-disc pl-5 mt-2.5 space-y-2">
          <li>Maintaining the confidentiality of your account credentials and password.</li>
          <li>All activities occurring under your authenticated session dashboard.</li>
          <li>Promptly notifying event administrators of any unauthorized security breaches.</li>
        </ul>
      </>
    )
  },
  {
    id: "participation-rules",
    title: "4. Event Participation Rules",
    content: (
      <>
        <p>
          Each competition (e.g., Hackathons, Coding Rounds, Gaming tournaments, Choreography, Band events) has specific 
          guidelines, evaluation metrics, and team sizing rules published on the respective event detail pages.
        </p>
        <p className="mt-3">
          Participants must adhere strictly to these schedules and instructions. Decisions of judges and event coordinators are final 
          and binding in all matters, including evaluations and score tallies.
        </p>
      </>
    )
  },
  {
    id: "conduct",
    title: "5. Code of Conduct",
    content: (
      <>
        <p>MACFIESTA promotes mutual respect, healthy competition, and integrity. Participants must not:</p>
        <ul className="list-disc pl-5 mt-2.5 space-y-2">
          <li>Engage in harassment, discrimination, verbal abuse, or aggressive behavior toward others.</li>
          <li>Practice academic dishonesty, plagiarism, or use unauthorized code snippets/templates in competitive tracks.</li>
          <li>Disrupt event schedules, tamper with college infrastructure, or damage assets.</li>
        </ul>
        <p className="mt-3">
          Violations of this Code of Conduct will result in immediate disqualification, expulsion from the college campus, 
          and reporting to respective college authorities.
        </p>
      </>
    )
  },
  {
    id: "intellectual-property",
    title: "6. Intellectual Property",
    content: (
      <>
        <p>
          All graphics, user interfaces, 3D scenes, branding, codebases, animations, and logos on the MACFIESTA web application 
          are the exclusive intellectual property of MACFAST and the development team. 
        </p>
        <p className="mt-3">
          Any project code, design assets, or media submitted by participants during competitions remain their property. However, 
          by submitting, you grant MACFIESTA a non-exclusive license to display, archive, and publish submissions for publicity, 
          gallery showcases, and academic record tracking.
        </p>
      </>
    )
  },
  {
    id: "prohibited",
    title: "7. Prohibited Activities",
    content: (
      <>
        <p>You may not use the web application or platform to:</p>
        <ul className="list-disc pl-5 mt-2.5 space-y-2">
          <li>Attempt unauthorized access to other participant dashboards or database endpoints.</li>
          <li>Inject malicious payloads, scripts, SQL sequences, or deploy DDOS actions.</li>
          <li>Spam contact forms, scoreboards, or registration rosters with mock transactions.</li>
          <li>Bypass security checks, rate limits, or headers on the API nodes.</li>
        </ul>
      </>
    )
  },
  {
    id: "payment-refund",
    title: "8. Payment & Refund Policy",
    content: (
      <>
        <p>
          Where registration passes involve payment:
        </p>
        <ul className="list-disc pl-5 mt-2.5 space-y-2">
          <li>All registration fees and entry transactions are final and non-refundable.</li>
          <li>Payments must be completed through the secure portal payment gateway using verified accounts.</li>
          <li>Rosters will only reflect active entries once banking networks confirm success status.</li>
        </ul>
      </>
    )
  },
  {
    id: "liability",
    title: "9. Limitation of Liability",
    content: (
      <>
        <p>
          MACFIESTA, MACFAST college, coordinators, and the development team will not be held liable for:
        </p>
        <ul className="list-disc pl-5 mt-2.5 space-y-2">
          <li>Any direct, indirect, incidental, or consequential damages resulting from platform downtime, server load errors, or WebSocket connection drops.</li>
          <li>Losses or injury incurred during participation in physical campus events.</li>
          <li>Errors in scoreboard calculations, scheduling shifts, or registration roster listings.</li>
        </ul>
      </>
    )
  },
  {
    id: "privacy-ref",
    title: "10. Privacy Reference",
    content: (
      <>
        <p>
          Your use of this application is also governed by our <Link href="/privacy-policy" className="text-festival-gold underline font-bold hover:text-festival-gold-light transition-colors">Privacy Policy</Link>, 
          which details how we collect, store, and manage your data. Please read it to understand our data security practices.
        </p>
      </>
    )
  },
  {
    id: "changes",
    title: "11. Changes to Terms",
    content: (
      <>
        <p>
          We reserve the right to modify these Terms & Conditions at any time. Changes take effect immediately upon being posted to 
          this URL. Continued use of the platform following updates represents your binding agreement to the amended terms.
        </p>
      </>
    )
  },
  {
    id: "contact",
    title: "12. Contact Information",
    content: (
      <>
        <p>
          For queries, feedback, or disputes relating to these Terms & Conditions, please contact the festival coordinators:
        </p>
        <div className="mt-4 p-4.5 bg-white/5 border border-white/10 rounded-2xl space-y-2 text-sm">
          <p><strong>Email:</strong> info@macfiesta.macfast.org</p>
          <p><strong>College Office:</strong> MACFAST, Tiruvalla, Kerala, India - 689101</p>
          <p><strong>Hotline:</strong> +91 469 260 0000</p>
        </div>
      </>
    )
  }
];

export default function TermsConditionsPage() {
  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#030712] via-[#050d26] to-[#010204] text-white/90 selection:bg-festival-gold selection:text-black">
      {/* Background glow meshes */}
      <div className="absolute top-10 left-10 w-[400px] h-[400px] bg-festival-gold/5 blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute bottom-20 right-10 w-[400px] h-[400px] bg-festival-purple/5 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        
        {/* Navigation & Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 border-b border-white/5 pb-8">
          <div>
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-festival-gold hover:text-festival-gold-light transition-colors mb-4 focus:outline-none focus:ring-1 focus:ring-festival-gold/50 rounded-lg px-2 py-1"
            >
              <RiArrowLeftLine className="text-sm" />
              <span>Back to home</span>
            </Link>
            <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-wider" style={{ fontFamily: "var(--font-heading)" }}>
              <span className="gradient-text-gold neon-gold">Terms &</span> Conditions
            </h1>
          </div>
          
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4.5 py-3 rounded-2xl text-xs sm:text-sm">
            <RiTimeLine className="text-festival-gold text-lg shrink-0" />
            <div className="text-white/60">
              <p className="font-bold text-white/80">Last Updated</p>
              <p className="font-medium text-[11px] text-white/40">July 04, 2026</p>
            </div>
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Quick Nav Outline (Desktop Left) */}
          <aside className="lg:col-span-4 sticky top-28 hidden lg:block space-y-6">
            <div className="glass p-6 rounded-3xl border border-white/5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-festival-gold flex items-center gap-2 border-b border-white/5 pb-3">
                <RiListCheck2 className="text-base" />
                <span>Document Outline</span>
              </h3>
              <nav className="flex flex-col space-y-2">
                {termsSections.map((sec) => (
                  <button
                    key={sec.id}
                    onClick={() => handleScrollTo(sec.id)}
                    className="text-left text-xs text-white/50 hover:text-festival-gold hover:translate-x-1.5 transition-all duration-300 font-medium py-1 focus:outline-none focus:text-festival-gold"
                  >
                    {sec.title}
                  </button>
                ))}
              </nav>
            </div>

            <div className="bg-festival-gold/5 border border-festival-gold/20 p-5 rounded-3xl text-xs space-y-2">
              <h4 className="font-bold text-festival-gold uppercase tracking-wider flex items-center gap-1.5">
                <RiHammerLine className="text-sm" />
                Legal Framework
              </h4>
              <p className="text-white/60 leading-relaxed font-medium">
                These rules govern participation across all technical & cultural tracks, scoring pipelines, and access privileges during MACFIESTA.
              </p>
            </div>
          </aside>

          {/* Main Legal Content */}
          <main className="lg:col-span-8 space-y-6 max-w-[900px]">
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="glass p-6 sm:p-10 rounded-3xl border border-white/5 space-y-10 shadow-2xl"
            >
              {termsSections.map((sec) => (
                <section 
                  key={sec.id} 
                  id={sec.id} 
                  className="space-y-4 scroll-mt-28 border-b border-white/5 last:border-0 pb-8 last:pb-0"
                >
                  <h2 
                    className="text-lg sm:text-xl font-bold uppercase tracking-wider text-festival-gold inline-block relative pb-1 border-b border-festival-gold/20" 
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {sec.title}
                  </h2>
                  <div className="text-sm sm:text-base text-white/70 leading-relaxed font-medium">
                    {sec.content}
                  </div>
                </section>
              ))}
            </motion.div>
          </main>

        </div>

        {/* Floating Helpline Accent */}
        <div className="mt-16 text-center border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-xs text-white/40 font-medium">
            Have questions regarding these terms? Reach out directly.
          </p>
          <a
            href="mailto:info@macfiesta.macfast.org"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-festival-gold/5 hover:bg-festival-gold/10 border border-festival-gold/20 hover:border-festival-gold/40 rounded-xl text-xs font-bold text-festival-gold tracking-widest uppercase transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-festival-gold/50"
          >
            <RiMailSendLine className="text-base" />
            <span>Send Email Support</span>
          </a>
        </div>

      </div>
    </div>
  );
}
