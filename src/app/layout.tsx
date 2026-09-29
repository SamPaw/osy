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
  themeColor: "#fbfbfd",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "Page Replacement Algorithms — FIFO vs LRU | PlateSight OS",
  description:
    "An Apple-inspired interactive educational experience for Operating Systems. Explore FIFO and LRU page replacement algorithms, physical memory dynamics, and Belady's anomaly.",
  authors: [{ name: "PlateSight" }],
  metadataBase: new URL("https://os.platesight.in"),
  openGraph: {
    title: "Page Replacement Algorithms — FIFO vs LRU | PlateSight OS",
    description:
      "When memory runs out, which page should leave? An interactive exploration of FIFO and LRU.",
    url: "https://os.platesight.in",
    siteName: "PlateSight OS",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Page Replacement Algorithms — FIFO vs LRU | PlateSight OS",
    description:
      "When memory runs out, which page should leave? An interactive exploration of FIFO and LRU.",
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
      <body className="min-h-full bg-[#fbfbfd] text-[#1d1d1f] selection:bg-[#0071e3]/15 selection:text-[#0071e3]">
        {children}
      </body>
    </html>
  );
}
