import type { Metadata } from "next";
import { Press_Start_2P, Space_Mono } from "next/font/google";
import "./globals.css";

const pressStart = Press_Start_2P({
  variable: "--font-press-start",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "HackJam",
  description:
    "A scroll-driven descent through space. HackJam — a 12-hour hackathon by SHPE USF. An MLH Member Event.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${pressStart.variable} ${spaceMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/*
          Preload the above-fold hero GIF so the browser fetches it as soon as
          the HTML is parsed — before the JS bundle runs. This is the single
          biggest LCP win available for a GIF-based hero.
        */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="preload"
          as="image"
          href="/gifs/HackJam26_black_levitate.gif"
          fetchPriority="high"
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
