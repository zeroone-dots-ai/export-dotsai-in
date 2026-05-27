import type { Metadata, Viewport } from "next";
import { DM_Sans, Instrument_Serif, Space_Mono } from "next/font/google";
import { brand } from "@/lib/brand";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
  weight: ["400", "500", "600", "700"],
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  display: "swap",
  weight: "400",
  variable: "--font-instrument-serif",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "700"],
  variable: "--font-space-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL(`https://${brand.domain}`),
  title: {
    default: `${brand.name} — ${brand.tagline}`,
    template: `%s · ${brand.name}`,
  },
  description: brand.longTagline,
  applicationName: brand.name,
  authors: [{ name: brand.parent, url: "https://dotsai.in" }],
  keywords: [
    "import export India",
    "IEC registration",
    "HS code calculator",
    "export documentation",
    "DGFT compliance",
    "AD Code registration",
    "RCMC certificate",
    "export buyer discovery",
    "EXIM SaaS India",
    "MSME exporter platform",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: `https://${brand.domain}`,
    siteName: brand.name,
    title: `${brand.name} — ${brand.tagline}`,
    description: brand.longTagline,
  },
  twitter: {
    card: "summary_large_image",
    title: `${brand.name} — ${brand.tagline}`,
    description: brand.longTagline,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: brand.colors.paper,
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${instrumentSerif.variable} ${spaceMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-paper text-ink antialiased">{children}</body>
    </html>
  );
}
