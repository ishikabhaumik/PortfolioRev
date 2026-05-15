"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";

declare global {
  // eslint-disable-next-line no-var
  var __lenis: Lenis | undefined;
}

export function lockScroll() {
  if (typeof window !== "undefined" && window.__lenis) window.__lenis.stop();
}

export function unlockScroll() {
  if (typeof window !== "undefined" && window.__lenis) window.__lenis.start();
}

export default function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      // Very slow, cinematic scroll: long glide trail and short travel per wheel tick
      lerp: 0.035,
      smoothWheel: true,
      wheelMultiplier: 0.55,
      touchMultiplier: 1,
      syncTouch: true,
      syncTouchLerp: 0.045,
      autoRaf: false,
    });

    window.__lenis = lenis;

    function raf(time: number) {
      lenis.raf(time * 1000);
    }

    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    lenis.on("scroll", ScrollTrigger.update);

    // Re-measure once after fonts and images settle so anchor scrolls and
    // ScrollTrigger offsets match the final layout.
    const refresh = () => ScrollTrigger.refresh();
    const settled = window.setTimeout(refresh, 250);
    window.addEventListener("load", refresh);
    if (typeof document !== "undefined" && "fonts" in document) {
      document.fonts?.ready?.then(refresh).catch(() => {});
    }

    return () => {
      window.clearTimeout(settled);
      window.removeEventListener("load", refresh);
      gsap.ticker.remove(raf);
      lenis.destroy();
      window.__lenis = undefined;
    };
  }, []);

  return null;
}
