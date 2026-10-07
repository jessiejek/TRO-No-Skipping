import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { event } from "@/lib/event";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// JJQR - AI (Oct 7, 2026) — absolute base so og:image / twitter:image URLs resolve for link previews.
const siteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "https://amors-birthday-serve.vercel.app";

// JJQR - AI (Oct 7, 2026)
const siteTitle = `${event.celebrantShort}'s Pickleball Birthday`;
const siteDescription = `${event.activity} for ${event.celebrant}. ${event.partyDate} at ${event.venue}.`;
// JJQR - AI (Oct 7, 2026)
const ogImage = {
  url: "/og-click2.png",
  width: 1200,
  height: 630,
  alt: "Amor's Pickleball Birthday",
};

export const metadata: Metadata = {
  // JJQR - AI (Oct 7, 2026)
  metadataBase: new URL(siteUrl), // JJQR - AI (Oct 7, 2026)
  title: siteTitle, // JJQR - AI (Oct 7, 2026)
  description: siteDescription, // JJQR - AI (Oct 7, 2026)
  applicationName: event.brandName,
  // JJQR - AI (Oct 7, 2026) — static link-preview image at public/og-click2.png.
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    siteName: event.brandName,
    type: "website",
    images: [ogImage], // JJQR - AI (Oct 7, 2026)
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: [ogImage], // JJQR - AI (Oct 7, 2026)
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#86efac",
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="court-bg flex min-h-full min-h-dvh flex-col text-green-900">
        {children}
      </body>
    </html>
  );
}
