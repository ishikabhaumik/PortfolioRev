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
  const cubeFloatRef = useRef<HTMLDivElement>(null);
  const [cubeSize, setCubeSize] = useState(294);

  // Cube scales with viewport. All factors and the cap are another 20%
  // smaller than the previous values.
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const next = Math.min(w * 0.416, h * 0.384, 358);
      setCubeSize(Math.max(166, Math.round(next)));
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Slow, smooth, pseudo-random drift around the hero center.
  // Two non-harmonic sine waves per axis combine into motion whose
  // overall path doesn't repeat for a long time — looks random,
  // but is mathematically continuous so it never jitters.
  useEffect(() => {
    const el = cubeFloatRef.current;
    if (!el) return;
    const start = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const t = now - start;
      // Drift radius — kept within hero bounds across viewport sizes.
      const xRange = window.innerWidth * 0.22;
      const yRange = window.innerHeight * 0.16;

      // Coprime periods → looks random. 50% faster than before.
      const xRaw =
        Math.sin(t / 8000) * 0.7 + Math.sin(t / 12000 + 1.3) * 0.4;
      const yRaw =
        Math.cos(t / 10000) * 0.7 + Math.sin(t / 14000 + 0.7) * 0.4;

      const x = (xRaw / 1.1) * xRange;
      const y = (yRaw / 1.1) * yRange;

      el.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
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

      {/* Auto-rotating Rubik's-cube hero piece. Three nested wrappers:
          - Floating wrapper (cubeFloatRef): RAF-driven sine drift around
            the hero center — owns its own transform.
          - GSAP wrapper (cubeRef): handles the entrance reveal.
          - RubiksCube: spin + tilt + bob layers internally.
          Each layer owns one transform so they never collide. */}
      <div
        ref={cubeFloatRef}
        className="pointer-events-none absolute left-1/2 top-1/2 z-[5]"
        style={{ transform: "translate(-50%, -50%)" }}
      >
        <div ref={cubeRef}>
          <RubiksCube size={cubeSize} />
        </div>

        {/* Mirror reflection — flipped, blurred, and faded out downward
            on a non-flipped parent so the mask gradient is in screen space. */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-0"
          style={{
            top: `calc(100% + ${Math.round(cubeSize * 0.32)}px)`,
            width: cubeSize,
            height: cubeSize,
            WebkitMaskImage:
              "linear-gradient(to bottom, rgba(0,0,0,0.07), transparent)",
            maskImage:
              "linear-gradient(to bottom, rgba(0,0,0,0.07), transparent)",
          }}
        >
          <div
            style={{
              transform: "scaleY(-1)",
              opacity: 0.07,
              filter: "blur(4px)",
            }}
          >
            <RubiksCube size={cubeSize} bare />
          </div>
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
