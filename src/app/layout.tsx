import type { Metadata } from "next";
import { Inter, Outfit, Orbitron } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { LoadingScreen } from "@/components/layout/LoadingScreen";
import { CursorGlow } from "@/components/ui/CursorGlow";
import { SmoothScrollProvider } from "@/providers/SmoothScrollProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://macfiesta.macfast.org"),
  title: {
    default: "MacFiesta 2K26 — Where Legends Rise | MACFAST Tiruvalla",
    template: "%s | MacFiesta 2K26",
  },
  description:
    "MacFiesta 2K26 — The most awaited college cultural and technical festival of MACFAST, Tiruvalla. 26+ exciting events, gaming tournaments, cultural performances, and more. Register now!",
  keywords: [
    "MacFiesta",
    "MACFAST",
    "college fest",
    "cultural festival",
    "technical fest",
    "Tiruvalla",
    "Kerala",
    "college events",
    "2026",
    "gaming",
    "hackathon",
  ],
  authors: [{ name: "MacFiesta Team", url: "https://macfiesta.macfast.org" }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://macfiesta.macfast.org",
    siteName: "MacFiesta 2K26",
    title: "MacFiesta 2K26 — Where Legends Rise",
    description:
      "The most awaited college cultural and technical festival of MACFAST, Tiruvalla. 26+ events, gaming, coding, cultural performances, and more!",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "MacFiesta 2K26 Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MacFiesta 2K26 — Where Legends Rise",
    description:
      "Join the most exciting college fest at MACFAST Tiruvalla! 26+ events await.",
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  other: {
    "Cache-Control": "no-store, no-cache, must-revalidate",
    "Pragma": "no-cache",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${outfit.variable} ${orbitron.variable} antialiased noise-overlay`}
      >
        <LoadingScreen />
        <CursorGlow />
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <SmoothScrollProvider>
          <Navbar />
          <main id="main-content">{children}</main>
          <Footer />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
