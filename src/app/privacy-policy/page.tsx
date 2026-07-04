"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  RiArrowLeftLine, 
  RiShieldLine, 
  RiMailSendLine,
  RiTimeLine,
  RiListCheck2
} from "react-icons/ri";

const policySections = [
  {
    id: "introduction",
    title: "1. Introduction",
    content: (
      <>
        <p>
          Welcome to <strong>MACFIESTA 2K26</strong>. We are committed to protecting the privacy and security of your personal data. 
          This Privacy Policy explains how we collect, use, store, and share your information when you register for, access, or participate 
          in the MACFIESTA national-level technical and cultural festival, whether via our web application, mobile app, or event portals.
        </p>
        <p className="mt-3">
          By registering for an account, purchasing a pass, or interacting with our services, you consent to the practices described 
          in this Privacy Policy. If you do not agree, please do not use our services or submit personal information.
        </p>
      </>
    )
  },
  {
    id: "info-collect",
    title: "2. Information We Collect",
    content: (
      <>
        <p>We collect information directly from you when you register, make a purchase, or communicate with us. This includes:</p>
        <ul className="list-disc pl-5 mt-2.5 space-y-2">
          <li><strong>Identity Data:</strong> Full name, gender, college name, student registration/roll number, branch, and semester.</li>
          <li><strong>Contact Data:</strong> Email address, mobile phone number, and physical mailing address (where applicable).</li>
          <li><strong>Account Credentials:</strong> Username, password, and secure auth session tokens.</li>
          <li><strong>Transaction Data:</strong> Event registration passes purchased, transaction identifiers, status of payments, and receipts.</li>
          <li><strong>Technical Data:</strong> Device IP addresses, browser agent, operating system, and WebSocket handshake data.</li>
        </ul>
      </>
    )
  },
  {
    id: "how-use",
    title: "3. How We Use Information",
    content: (
      <>
        <p>We use the collected information for purposes necessary to run the festival and secure your experience:</p>
        <ul className="list-disc pl-5 mt-2.5 space-y-2">
          <li>Facilitating event registration, ticket verification, and certificate generation.</li>
          <li>Validating student credentials and managing individual participant profiles.</li>
          <li>Processing payments and tracking scoreboards or team scores.</li>
          <li>Sending critical updates, schedules, guidelines, and transaction receipts.</li>
          <li>Improving app performance, securing APIs, and detecting unauthorized access.</li>
        </ul>
      </>
    )
  },
  {
    id: "cookies",
    title: "4. Cookies & Analytics",
    content: (
      <>
        <p>
          We use browser storage (cookies, session storage, and local storage) to keep you authenticated, store your preferences, 
          and track application performance. 
        </p>
        <p className="mt-3">
          We may gather anonymous usage data (e.g., page views, interaction duration, search queries) to analyze traffic patterns and 
          optimize our interactive 3D elements and schedule views. You can manage your cookie preferences in your browser settings, 
          but disabling cookies may impact your logged-in session functionality.
        </p>
      </>
    )
  },
  {
    id: "event-data",
    title: "5. Event Registration Data",
    content: (
      <>
        <p>
          When you register for specific events (e.g., Coding, Gaming, Web Design, Dance, Music), your name, team name, and college 
          affiliation are made public on the event scoreboard, scheduler, and winners list. 
        </p>
        <p className="mt-3">
          This visibility is necessary to host fair competitions and allow participants and coordinators to verify standings. 
          Judges and event leads also receive roster details for evaluation and attendance coordination.
        </p>
      </>
    )
  },
  {
    id: "security",
    title: "6. Account Security",
    content: (
      <>
        <p>
          We implement robust cybersecurity protocols to protect your credentials and data. Password information is hashed using 
          bcrypt, and tokenized authorization handles active sessions.
        </p>
        <p className="mt-3">
          While we strive to secure our systems, no transmission over the Internet is 100% secure. We encourage you to use 
          a strong, unique password for your MACFIESTA account and immediately notify us of any suspicious activity.
        </p>
      </>
    )
  },
  {
    id: "third-party",
    title: "7. Third-Party Services",
    content: (
      <>
        <p>
          We use third-party services to host our platform, send messages, and process payments. These include:
        </p>
        <ul className="list-disc pl-5 mt-2.5 space-y-2">
          <li><strong>Database & Cloud Hosting:</strong> Mongoose/MongoDB, Vercel, and Cloudinary.</li>
          <li><strong>Payment Gateways:</strong> UPI integration frameworks and banking endpoints.</li>
          <li><strong>Notification Delivery:</strong> Secure SMTP/Nodemailer and communication gateways.</li>
        </ul>
        <p className="mt-3">
          These third parties are only provided data necessary to perform their specialized tasks and are governed by their respective 
          privacy rules.
        </p>
      </>
    )
  },
  {
    id: "data-retention",
    title: "8. Data Retention",
    content: (
      <>
        <p>
          We retain your information only as long as is necessary to fulfill the purposes for which it was collected, including 
          the duration of the MACFIESTA 2K26 festival, auditing requirements, and administrative post-fest feedback processing. 
        </p>
        <p className="mt-3">
          Event rosters, certificate records, and winning scoreboard entries may be retained as historical archives on our site.
        </p>
      </>
    )
  },
  {
    id: "user-rights",
    title: "9. User Rights",
    content: (
      <>
        <p>Depending on your location and student guidelines, you have several rights regarding your data:</p>
        <ul className="list-disc pl-5 mt-2.5 space-y-2">
          <li><strong>Access:</strong> The right to view the personal information we hold about you via your user dashboard.</li>
          <li><strong>Rectification:</strong> The right to correct inaccurate or outdated profile information.</li>
          <li><strong>Erasure:</strong> The right to request account deletion (subject to verification and status of ongoing events).</li>
          <li><strong>Restriction:</strong> The right to request limitation of data processing for audit purposes.</li>
        </ul>
      </>
    )
  },
  {
    id: "contact",
    title: "10. Contact Information",
    content: (
      <>
        <p>
          If you have questions about this Privacy Policy, your data handling, or wish to exercise your user rights, please contact 
          our technical coordinator:
        </p>
        <div className="mt-4 p-4.5 bg-white/5 border border-white/10 rounded-2xl space-y-2 text-sm">
          <p><strong>Email:</strong> info@macfiesta.macfast.org</p>
          <p><strong>Address:</strong> MACFAST, Tiruvalla, Kerala, India - 689101</p>
          <p><strong>Hotline:</strong> +91 469 260 0000</p>
        </div>
      </>
    )
  }
];

export default function PrivacyPolicyPage() {
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
              <span className="gradient-text-gold neon-gold">Privacy</span> Policy
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
                {policySections.map((sec) => (
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
                <RiShieldLine className="text-sm" />
                Secure Portal
              </h4>
              <p className="text-white/60 leading-relaxed font-medium">
                This document is maintained securely on our network nodes. All personal records collected are governed strictly by higher college authorization rules.
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
              {policySections.map((sec) => (
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
            Have questions regarding this policy? Reach out directly.
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
