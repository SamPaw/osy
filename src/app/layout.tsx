import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#090a0f",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "Page Replacement Algorithms — FIFO vs LRU | PlateSight OS",
  description:
    "Interactive smart whiteboard presentation and real-time visual simulator for Operating Systems: FIFO and LRU page replacement algorithms, Belady's anomaly, and live comparative analysis.",
  keywords: [
    "Operating Systems",
    "Page Replacement Algorithms",
    "FIFO",
    "LRU",
    "Belady's Anomaly",
    "Virtual Memory",
    "PlateSight",
    "Interactive Simulator",
  ],
  authors: [{ name: "PlateSight" }],
  metadataBase: new URL("https://os.platesight.in"),
  openGraph: {
    title: "FIFO vs LRU Page Replacement Algorithms | PlateSight OS",
    description:
      "Interactive smart whiteboard presentation and real-time visual simulator for Operating Systems.",
    url: "https://os.platesight.in",
    siteName: "PlateSight OS",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FIFO vs LRU Page Replacement Algorithms | PlateSight OS",
    description:
      "Interactive smart whiteboard presentation and real-time visual simulator for Operating Systems.",
  },
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
      <body className="min-h-full bg-[#090a0f] text-gray-100 selection:bg-indigo-500/30 selection:text-white">
        {children}
      </body>
    </html>
  );
}
