import {
  Bebas_Neue,
  Cormorant_Garamond,
  DM_Mono,
  DM_Sans,
  Montserrat,
} from "next/font/google";

/** Thin sans — loading nameplate stacks (Cormorant I + Montserrat lines) */
export const fontMontserrat = Montserrat({
  subsets: ["latin"],
  weight: ["200", "300"],
  variable: "--font-montserrat",
  display: "swap",
});

/** Condensed uppercase display — preloader block letters */
export const fontBlock = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-block",
  display: "swap",
});

export const fontSerif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

export const fontSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-sans",
  display: "swap",
});

export const fontMono = DM_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-mono",
  display: "swap",
});
