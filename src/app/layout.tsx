import type { Metadata, Viewport } from "next";
import { fontSerif, fontSans, fontMono } from "@/lib/fonts";
import SmoothScroll from "@/components/providers/SmoothScroll";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://ishikabhaumik.com"),
  title: {
    default: "Ishika Bhaumik — Designer & Developer",
    template: "%s — Ishika Bhaumik",
  },
  description:
    "Portfolio of Ishika Bhaumik — software engineer & designer building agentic AI systems and editorial interfaces. M.S. Computer Science, UC Davis.",
  openGraph: {
    title: "Ishika Bhaumik — Designer & Developer",
    description:
      "Software engineer & designer building agentic AI systems and editorial interfaces.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ishika Bhaumik — Designer & Developer",
  },
};

export const viewport: Viewport = {
  themeColor: "#0A0A0A",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${fontSerif.variable} ${fontSans.variable} ${fontMono.variable}`}
    >
      <body className="bg-ink text-bone font-sans antialiased vignette">
        <SmoothScroll />
        <div className="grain" aria-hidden />
        {children}
      </body>
    </html>
  );
}
