"use client";

import dynamic from "next/dynamic";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import SplitText from "@/components/ui/SplitText";

const ParticleField = dynamic(() => import("@/components/three/ParticleField"), {
  ssr: false,
});

const RubiksCube = dynamic(() => import("@/components/three/RubiksCube"), {
  ssr: false,
});

interface HeroProps {
  startReveal: boolean;
}

// useLayoutEffect throws SSR warnings in some setups; pick the right one
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export default function Hero({ startReveal }: HeroProps) {
  const rootRef = useRef<HTMLElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const cubeRef = useRef<HTMLDivElement>(null);
  const [cubeSize, setCubeSize] = useState(460);

  // Cube scales with viewport so it stays prominent without overflowing.
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      // Use the smaller of width/height bounds so the cube always fits
      // inside the hero, then cap at a generous max for big monitors.
      const next = Math.min(w * 0.65, h * 0.6, 560);
      setCubeSize(Math.max(260, Math.round(next)));
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Sync initial hidden state BEFORE the first paint so no flash occurs
  useIsomorphicLayoutEffect(() => {
    if (!rootRef.current) return;
    const metas = metaRef.current?.querySelectorAll("[data-meta]") ?? [];
    gsap.set(subtitleRef.current, { opacity: 0, y: 14 });
    gsap.set(metas, { opacity: 0, y: 8 });
    gsap.set(lineRef.current, { scaleY: 0, transformOrigin: "top" });
    gsap.set(scrollHintRef.current, { opacity: 0 });
    gsap.set(cubeRef.current, { opacity: 0, y: 24 });
  }, []);

  useEffect(() => {
    if (!startReveal) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 1.4 });

      tl.to(subtitleRef.current, {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: "expo.out",
      });
      tl.to(
        metaRef.current?.querySelectorAll("[data-meta]") ?? [],
        { opacity: 1, y: 0, duration: 0.9, ease: "expo.out", stagger: 0.1 },
        "-=0.8"
      );
      tl.to(
        lineRef.current,
        { scaleY: 1, duration: 1.0, ease: "expo.inOut" },
        "-=0.6"
      );
      tl.to(
        scrollHintRef.current,
        { opacity: 1, duration: 0.8 },
        "-=0.4"
      );
      tl.to(
        cubeRef.current,
        { opacity: 1, y: 0, duration: 1.4, ease: "expo.out" },
        "-=1.4"
      );
    }, rootRef);

    return () => ctx.revert();
  }, [startReveal]);

  return (
    <section
      ref={rootRef}
      className="relative h-[100svh] w-full overflow-hidden"
      id="hero"
    >
      {/* WebGL canvas */}
      <div className="absolute inset-0 z-0">
        <ParticleField />
      </div>

      {/* Interactive Rubik's-cube hero piece — centered focal point.
          Outer wrapper handles centering via CSS transforms.
          Inner wrapper (cubeRef) is what GSAP animates, so the two
          transform stacks never fight. */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 z-[5] -translate-x-1/2 -translate-y-1/2">
        <div ref={cubeRef}>
          <RubiksCube size={cubeSize} />
        </div>
      </div>

      {/* Hero content overlay */}
      <div className="relative z-10 flex h-full flex-col justify-between px-6 pb-12 pt-28 md:px-12 md:pb-16 md:pt-32">
        {/* Top meta row */}
        <div ref={metaRef} className="flex w-full items-start justify-between text-[10px] uppercase tracking-[0.4em] text-bone/55 md:text-xs">
          <div data-meta className="max-w-[18ch] leading-relaxed">
            <span className="text-bone">[01]</span> Portfolio
          </div>
          <div data-meta className="hidden md:block max-w-[22ch] text-right leading-relaxed">
            Davis, California
            <br />
            UC Davis · MSCS &apos;26
          </div>
        </div>

        {/* Center display name */}
        <div className="flex flex-col">
          <div className="flex flex-col">
            <SplitText
              text="ISHIKA"
              as="h1"
              autoPlay={startReveal}
              trigger={false}
              stagger={0.045}
              duration={1.4}
              inViewDelay={0.2}
              className="font-serif text-display-xl font-light text-bone"
            />
            <SplitText
              text="BHAUMIK"
              as="h1"
              autoPlay={startReveal}
              trigger={false}
              stagger={0.045}
              duration={1.4}
              inViewDelay={0.6}
              className="-mt-2 self-end pr-2 font-serif italic text-display-xl font-light text-bone/85 md:-mt-6 md:pr-12"
            />
          </div>

          <div
            ref={subtitleRef}
            className="mt-8 flex flex-col gap-3 md:mt-10 md:flex-row md:items-end md:justify-between"
          >
            <div className="flex items-center gap-4 text-bone/80">
              <span className="block h-px w-10 bg-bone" />
              <span className="font-mono text-xs uppercase tracking-[0.35em]">
                Software Developer
              </span>
            </div>
            <p className="max-w-md font-serif text-lg italic leading-snug text-bone/70 md:text-xl">
              I build software people stop to look at — at the seam of design, engineering, and AI.
            </p>
          </div>
        </div>

        {/* Scroll hint */}
        <div ref={scrollHintRef} className="flex items-end justify-between">
          <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.4em] text-bone/55">
            <div
              ref={lineRef}
              className="h-12 w-px origin-top bg-bone/60"
            />
            <span>Scroll</span>
          </div>
          <div className="hidden font-mono text-[10px] uppercase tracking-[0.4em] text-bone/40 md:block">
            © 2026 · All rights reserved
          </div>
        </div>
      </div>

      {/* Subtle bottom fade for legibility */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-40 bg-gradient-to-t from-ink to-transparent" />
    </section>
  );
}
