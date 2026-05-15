"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

interface LogoMorphProps {
  onComplete?: () => void;
}

const FIRST = "Ishika";
const LAST = "Bhaumik";

export default function LogoMorph({ onComplete }: LogoMorphProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const topPanelRef = useRef<HTMLDivElement>(null);
  const bottomPanelRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);
  const firstNameRef = useRef<HTMLDivElement>(null);
  const lastNameRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const onCompleteRef = useRef(onComplete);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (hidden) return;

    const ctx = gsap.context(() => {
      const firstLetters = firstNameRef.current?.querySelectorAll("span") ?? [];
      const lastLetters = lastNameRef.current?.querySelectorAll("span") ?? [];
      const allLetters = [...firstLetters, ...lastLetters];

      gsap.set(allLetters, { y: 60, opacity: 0 });
      gsap.set(lineRef.current, { scaleX: 0, transformOrigin: "left center" });
      gsap.set(counterRef.current, { opacity: 0 });

      const tl = gsap.timeline({
        onComplete: () => {
          setHidden(true);
          onCompleteRef.current?.();
        },
      });

      // Counter from 0 to 100
      const counterObj = { v: 0 };
      tl.to(
        counterObj,
        {
          v: 100,
          duration: 1.8,
          ease: "power2.inOut",
          onUpdate: () => {
            if (counterRef.current) {
              counterRef.current.textContent = String(Math.floor(counterObj.v)).padStart(3, "0");
            }
          },
        },
        0
      );

      // Counter fade in
      tl.to(counterRef.current, { opacity: 1, duration: 0.3, ease: "power2.out" }, 0);

      // First name letters stagger in
      tl.to(
        firstLetters,
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "expo.out",
          stagger: 0.06,
        },
        0.2
      );

      // Last name letters stagger in slightly after
      tl.to(
        lastLetters,
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "expo.out",
          stagger: 0.06,
        },
        0.55
      );

      // Divider line draws in
      tl.to(
        lineRef.current,
        {
          scaleX: 1,
          duration: 0.6,
          ease: "expo.inOut",
        },
        0.5
      );

      // Everything fades out
      tl.to(
        [firstNameRef.current, lastNameRef.current, lineRef.current, counterRef.current],
        {
          opacity: 0,
          y: -16,
          duration: 0.55,
          ease: "power3.in",
          stagger: 0.05,
        },
        2.2
      );

      // Curtain split — top up, bottom down
      tl.to(
        topPanelRef.current,
        { yPercent: -100, duration: 1.1, ease: "expo.inOut" },
        2.7
      );
      tl.to(
        bottomPanelRef.current,
        { yPercent: 100, duration: 1.1, ease: "expo.inOut" },
        2.7
      );
    }, wrapperRef);

    return () => ctx.revert();
  }, [hidden]);

  if (hidden) return null;

  return (
    <div
      ref={wrapperRef}
      className="fixed inset-0 z-[200] pointer-events-none"
      aria-hidden
    >
      {/* Split curtain panels */}
      <div ref={topPanelRef} className="absolute inset-x-0 top-0 h-1/2 bg-ink" />
      <div ref={bottomPanelRef} className="absolute inset-x-0 bottom-0 h-1/2 bg-ink" />

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
        {/* First name */}
        <div
          ref={firstNameRef}
          className="flex overflow-hidden"
          aria-label={FIRST}
        >
          {FIRST.split("").map((ch, i) => (
            <span
              key={i}
              className="inline-block font-serif text-5xl md:text-7xl tracking-widest text-bone"
            >
              {ch}
            </span>
          ))}
        </div>

        {/* Thin divider line */}
        <div
          ref={lineRef}
          className="w-40 md:w-56 h-px bg-bone/40"
        />

        {/* Last name */}
        <div
          ref={lastNameRef}
          className="flex overflow-hidden"
          aria-label={LAST}
        >
          {LAST.split("").map((ch, i) => (
            <span
              key={i}
              className="inline-block font-serif text-5xl md:text-7xl tracking-widest text-bone"
            >
              {ch}
            </span>
          ))}
        </div>

        {/* Counter */}
        <div
          ref={counterRef}
          className="mt-6 font-mono text-xs tracking-[0.5em] text-bone/50 uppercase"
        >
          000
        </div>
      </div>
    </div>
  );
}
