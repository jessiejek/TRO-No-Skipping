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

export const metadata: Metadata = {
  title: `${event.brandName} — ${event.celebrant}'s birthday`,
  description: `${event.activity} for ${event.celebrant}. ${event.partyDate} at ${event.venue}.`,
  applicationName: event.brandName,
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
