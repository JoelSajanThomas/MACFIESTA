"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { RiAwardLine, RiDownloadLine, RiArrowLeftLine } from "react-icons/ri";

const certificates = [
  { event: "Byte & Code Hackathon", role: "First Place Winner", code: "CERT-MF-BC-098", date: "16 Nov 2025" }
];

export default function CertificatesPage() {
  return (
    <div className="bg-festival-dark min-h-screen pt-28 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Back Link */}
        <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-xs text-white/50 hover:text-white uppercase font-bold tracking-wider" style={{ fontFamily: "var(--font-heading)" }}>
          <RiArrowLeftLine />
          <span>Back to Dashboard</span>
        </Link>

        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-black text-white uppercase tracking-wider" style={{ fontFamily: "var(--font-heading)" }}>
            Verified <span className="gradient-text-gold">Certificates</span>
          </h1>
          <p className="text-white/50 text-sm">
            Download your verified winner or participation certificates with QR code verification tags.
          </p>
        </div>

        {/* List */}
        <div className="space-y-6">
          {certificates.map((cert) => (
            <motion.div
              key={cert.code}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass p-6 rounded-2xl border border-white/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-white/10 transition-all"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-festival-gold text-xs font-bold uppercase tracking-wider" style={{ fontFamily: "var(--font-heading)" }}>
                  <RiAwardLine />
                  <span>{cert.event}</span>
                </div>
                <h3 className="text-lg font-bold text-white uppercase" style={{ fontFamily: "var(--font-heading)" }}>
                  {cert.role}
                </h3>
                <div className="flex gap-4 text-xs text-white/40">
                  <span>Verification Hash: <strong className="text-white/60">{cert.code}</strong></span>
                  <span>Issued: {cert.date}</span>
                </div>
              </div>

              <button
                onClick={() => alert(`Generating high-resolution printable PDF...`)}
                className="btn-primary flex items-center gap-2 px-6 py-3 text-xs tracking-widest"
              >
                <RiDownloadLine />
                <span>Download PDF</span>
              </button>
            </motion.div>
          ))}

          {certificates.length === 0 && (
            <div className="text-center py-12 text-white/40">
              No certificates issued yet. Awards are verified within 24 hours of event completion.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
