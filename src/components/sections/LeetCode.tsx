"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import SectionLabel from "@/components/ui/SectionLabel";
import SplitText from "@/components/ui/SplitText";

const stats: { label: string; value: string }[] = [
  { label: "Cadence", value: "Daily" },
  { label: "Focus", value: "Algorithms · Data Structures" },
  { label: "Languages", value: "Python · C++ · Java" },
  { label: "Patterns", value: "DP · Graphs · Trees" },
];

export default function LeetCode() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const items = el.querySelectorAll<HTMLElement>("[data-stat]");
      gsap.fromTo(
        items,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "expo.out",
          stagger: 0.08,
          scrollTrigger: { trigger: el, start: "top 80%", once: true },
        }
      );

      const cta = el.querySelector<HTMLElement>("[data-cta]");
      if (cta) {
        gsap.fromTo(
          cta,
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "expo.out",
            scrollTrigger: { trigger: cta, start: "top 90%", once: true },
          }
        );
      }
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={ref}
      id="practice"
      className="relative px-6 py-32 md:px-12 md:py-48"
    >
      <SectionLabel
        index="[04]"
        label="Practice"
        title="Problem solving, as a daily ritual."
        subtitle="The quiet discipline behind the shipped work — staying sharp on algorithms, data structures, and the small joy of an elegant solution."
      />

      <div className="grid grid-cols-1 gap-16 md:grid-cols-12 md:gap-16">
        {/* Left: pull quote */}
        <div className="md:col-span-7">
          <blockquote className="font-serif text-4xl font-light leading-snug text-bone md:text-6xl md:leading-[1.05]">
            <SplitText
              text="I love"
              by="word"
              stagger={0.06}
              className="block"
            />
            <span className="block italic text-bone">
              <SplitText
                text="a good puzzle."
                by="word"
                stagger={0.06}
                inViewDelay={0.3}
              />
            </span>
          </blockquote>

          <p className="mt-10 max-w-xl text-base leading-relaxed text-bone/70">
            LeetCode is where I keep the thinking muscles warm — outside of features
            and product work. Daily reps on patterns, edge cases, and elegant
            simplifications that quietly carry over to every system I build.
          </p>

          <div className="mt-10" data-cta>
            <a
              href="https://leetcode.com/u/ishikabhaumik/"
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="open"
              className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full border border-bone px-7 py-3 font-mono text-[11px] uppercase tracking-[0.35em] text-bone transition-colors duration-700 hover:text-ink"
            >
              <span className="relative z-10">View LeetCode Profile</span>
              <span aria-hidden className="relative z-10">↗</span>
              <span className="absolute inset-0 -z-0 origin-bottom scale-y-0 bg-bone transition-transform duration-700 ease-elegant group-hover:scale-y-100" />
            </a>
          </div>
        </div>

        {/* Right: stats grid */}
        <div className="md:col-span-5">
          <div className="grid grid-cols-2 gap-8 border-t border-line pt-10">
            {stats.map((s) => (
              <div key={s.label} data-stat className="flex flex-col gap-2">
                <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-bone/40">
                  {s.label}
                </span>
                <span className="font-serif text-xl text-bone md:text-2xl">
                  {s.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
