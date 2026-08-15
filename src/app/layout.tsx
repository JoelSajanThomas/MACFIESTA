import type { Metadata } from "next";
import localFont from "next/font/local";
import { Anton, Space_Grotesk, Inter, Orbitron, Bebas_Neue, Rajdhani, Syne } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { LoadingScreen } from "@/components/layout/LoadingScreen";
import { CursorGlow } from "@/components/ui/CursorGlow";
import { SmoothScrollProvider } from "@/providers/SmoothScrollProvider";
import { MaintenanceGuard } from "@/components/layout/MaintenanceGuard";
import { ParticleBackground } from "@/components/ui/ParticleBackground";
import { JarvisAssistant } from "@/components/ui/JarvisAssistant";
import { LoadingProvider } from "@/providers/LoadingProvider";
import { PageGate } from "@/components/layout/PageGate";

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const excon = localFont({
  src: [
    {
      path: "../../public/Fonts/WEB/fonts/Excon-Thin.woff2",
      weight: "100",
      style: "normal",
    },
    {
      path: "../../public/Fonts/WEB/fonts/Excon-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/Fonts/WEB/fonts/Excon-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/Fonts/WEB/fonts/Excon-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/Fonts/WEB/fonts/Excon-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/Fonts/WEB/fonts/Excon-Black.woff2",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-excon",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  variable: "--font-bebas",
  display: "swap",
  weight: "400",
});

const rajdhani = Rajdhani({
  subsets: ["latin"],
  variable: "--font-rajdhani",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://macfiesta.macfast.org"),
  title: {
    default: "MACFIESTA MARVELVERSE 2K26 — Every Hero Has A Mission | MACFAST",
    template: "%s | MACFIESTA MARVELVERSE 2K26",
  },
  description:
    "MACFIESTA: MARVELVERSE — The premier national inter-collegiate Marvel Cinematic Universe cultural and technical festival at MACFAST, Tiruvalla. 26+ missions, gaming arena, pro show, coding tournaments, and superhero challenges.",
  keywords: [
    "MacFiesta",
    "Marvelverse",
    "Avengers Tower",
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
  authors: [{ name: "MacFiesta Marvelverse Team", url: "https://macfiesta.macfast.org" }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://macfiesta.macfast.org",
    siteName: "MACFIESTA MARVELVERSE 2K26",
    title: "MACFIESTA MARVELVERSE 2K26 — Every Hero Has A Mission",
    description:
      "The ultimate Avengers Headquarters digital experience! 26+ missions, gaming arena, coding sprint, and cultural performances.",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "MacFiesta Marvelverse Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MACFIESTA MARVELVERSE 2K26 — Every Hero Has A Mission",
    description:
      "Join the Avengers Command Center at MACFAST Tiruvalla! 26+ high-tech missions await.",
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning={true}>
      <body
        className={`${anton.variable} ${spaceGrotesk.variable} ${excon.variable} ${inter.variable} ${orbitron.variable} ${bebasNeue.variable} ${rajdhani.variable} ${syne.variable} antialiased noise-overlay font-space text-white`}
        suppressHydrationWarning={true}
      >
        <LoadingProvider>
          <LoadingScreen />
          <CursorGlow />
          <ParticleBackground />
          <JarvisAssistant />
          <a href="#main-content" className="skip-link">
            Skip to main content
          </a>
          <MaintenanceGuard>
            <SmoothScrollProvider>
              <PageGate>
                <Navbar />
                <main id="main-content">{children}</main>
                <Footer />
              </PageGate>
            </SmoothScrollProvider>
          </MaintenanceGuard>
        </LoadingProvider>
      </body>
    </html>
  );
}
