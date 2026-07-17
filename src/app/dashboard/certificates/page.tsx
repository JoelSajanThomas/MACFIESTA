"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { RiAwardLine, RiDownloadLine, RiArrowLeftLine } from "react-icons/ri";
import { jsPDF } from "jspdf";
import QRCode from "qrcode";

const certificates = [
  { event: "Byte & Code Hackathon", role: "First Place Winner", code: "CERT-MF-BC-098", date: "16 Nov 2025" }
];

export default function CertificatesPage() {
  const downloadCertificatePDF = async (cert: typeof certificates[0]) => {
    try {
      const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4"
      });

      const pageWidth = 297;
      const pageHeight = 210;

      // elegant dark slate background
      doc.setFillColor(15, 23, 42);
      doc.rect(0, 0, pageWidth, pageHeight, "F");

      // outer gold border
      doc.setDrawColor(234, 179, 8);
      doc.setLineWidth(1.5);
      doc.rect(10, 10, pageWidth - 20, pageHeight - 20);

      // inner gold border
      doc.setDrawColor(234, 179, 8);
      doc.setLineWidth(0.5);
      doc.rect(12, 12, pageWidth - 24, pageHeight - 24);

      // corner boxes
      doc.setFillColor(234, 179, 8);
      doc.rect(9, 9, 6, 6, "F");
      doc.rect(pageWidth - 15, 9, 6, 6, "F");
      doc.rect(9, pageHeight - 15, 6, 6, "F");
      doc.rect(pageWidth - 15, pageHeight - 15, 6, 6, "F");

      // branding
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(26);
      doc.text("MACFIESTA 2K26", pageWidth / 2, 35, { align: "center" });

      doc.setTextColor(234, 179, 8);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.text("ANNUAL NATIONAL INTERCOLLEGIATE FESTIVAL • TIRUVALLA", pageWidth / 2, 42, { align: "center" });

      doc.setDrawColor(255, 255, 255);
      doc.setLineWidth(0.2);
      doc.line(80, 48, pageWidth - 80, 48);

      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.text("CERTIFICATE OF ACHIEVEMENT", pageWidth / 2, 62, { align: "center" });

      doc.setTextColor(156, 163, 175);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.text("This is proudly presented to", pageWidth / 2, 76, { align: "center" });

      const localUser = typeof window !== "undefined" ? localStorage.getItem("macfiesta_user") : null;
      const studentName = localUser ? JSON.parse(localUser).name : "Joel Shaji";

      doc.setTextColor(234, 179, 8);
      doc.setFont("times", "italic");
      doc.setFontSize(24);
      doc.text(studentName, pageWidth / 2, 90, { align: "center" });

      doc.setTextColor(156, 163, 175);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.text("for securing the position of", pageWidth / 2, 102, { align: "center" });

      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(15);
      doc.text(cert.role, pageWidth / 2, 112, { align: "center" });

      doc.setTextColor(156, 163, 175);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text(`in the ${cert.event} competition held on ${cert.date}`, pageWidth / 2, 122, { align: "center" });

      // validation QR
      const qrPayload = JSON.stringify({
        event: cert.event,
        role: cert.role,
        code: cert.code,
        recipient: studentName,
        authority: "MACFAST Tiruvalla"
      });
      const qrCodeDataUrl = await QRCode.toDataURL(qrPayload, { margin: 1, width: 100 });
      doc.addImage(qrCodeDataUrl, "PNG", 30, 140, 30, 30);

      doc.setTextColor(156, 163, 175);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(6);
      doc.text(`VERIFICATION ID: ${cert.code}`, 30, 174);

      // signature
      doc.setDrawColor(255, 255, 255);
      doc.setLineWidth(0.2);
      doc.line(180, 155, 250, 155);

      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.text("Dr. Cherian J. Kottayil", 215, 161, { align: "center" });

      doc.setTextColor(156, 163, 175);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.text("Principal, MACFAST", 215, 166, { align: "center" });

      doc.save(`MacFiesta_${cert.event.replace(/\s+/g, "_")}_Certificate.pdf`);
    } catch (error) {
      console.error("Certificate PDF generation failed", error);
      alert("Failed to download certificate PDF. Please try again.");
    }
  };
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
                onClick={() => downloadCertificatePDF(cert)}
                className="btn-primary flex items-center gap-2 px-6 py-3 text-xs tracking-widest cursor-pointer"
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
