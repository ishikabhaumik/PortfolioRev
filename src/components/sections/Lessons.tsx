"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import SectionLabel from "@/components/ui/SectionLabel";
import Highlight from "@/components/ui/Highlight";

interface Lesson {
  index: string;
  title: string;
  body: string;
}

const lessonBodies: Record<string, React.ReactNode> = {
  "01": (
    <>
      Some of the most meaningful opportunities in my life started from simply being{" "}
      <Highlight>curious</Highlight> enough to explore something new. I&apos;ve learned that growth
      rarely comes from already knowing the answer — it comes from staying open long enough to discover
      one.
    </>
  ),
  "02": (
    <>
      The projects I&apos;m proudest of were never built in one perfect attempt. They were shaped
      through iteration, frustration, refinement, and patience.{" "}
      <Highlight>Good work takes time to become simple.</Highlight>
    </>
  ),
  "03": (
    <>
      Building software taught me that technology alone is never enough. The best systems are the ones
      that understand <Highlight>people</Highlight>, reduce friction, and make someone feel considered
      on the other side of the screen.
    </>
  ),
  "04": (
    <>
      Some of my best ideas arrived away from the laptop — through conversations, books, long walks,
      sports, and moments of stillness. I&apos;ve learned that creating meaningful work also means
      making space to <Highlight>actually live</Highlight>.
    </>
  ),
};
const lessons: Lesson[] = [
  { index: "01", title: "Stay Curious", body: "" },
  { index: "02", title: "Build Slowly", body: "" },
  { index: "03", title: "Work With People", body: "" },
  { index: "04", title: "Touch Grass", body: "" },
];

export default function Lessons() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const cards = el.querySelectorAll<HTMLElement>("[data-lesson-card]");
      cards.forEach((card, i) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 32 },
          {
            opacity: 1,
            y: 0,
            duration: 1.1,
            ease: "expo.out",
            delay: (i % 2) * 0.08,
            scrollTrigger: { trigger: card, start: "top 88%", once: true },
          }
        );
      });
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={ref}
      id="lessons"
      className="relative px-6 py-32 md:px-12 md:py-48"
    >
      <SectionLabel
        index="[07]"
        label="Lessons Learnt"
        title={
          <>
            What the work has <Highlight>quietly taught</Highlight> me.
          </>
        }
        subtitle={
          <>
            A few principles I keep returning to — across <Highlight>projects</Highlight>, people, and
            the years between.
          </>
        }
      />

      <div className="grid grid-cols-1 gap-px bg-line md:grid-cols-2">
        {lessons.map((l) => (
          <article
            key={l.index}
            data-lesson-card
            className="group relative flex flex-col gap-6 bg-ink p-8 transition-colors duration-700 hover:bg-elevated md:p-12"
          >
            <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.4em] text-bone/45">
              <span>[{l.index}]</span>
              <span className="block h-px w-16 bg-bone/20 transition-[width] duration-700 ease-elegant group-hover:w-24" />
            </div>

            <h3 className="font-serif text-3xl font-light leading-tight text-bone transition-transform duration-700 ease-elegant group-hover:translate-x-1 md:text-4xl">
              {l.index === "01" ? (
                <>
                  Stay <Highlight>Curious</Highlight>
                </>
              ) : l.index === "02" ? (
                <>
                  Build <Highlight>Slowly</Highlight>
                </>
              ) : l.index === "03" ? (
                <>
                  Work With <Highlight>People</Highlight>
                </>
              ) : (
                <>
                  Touch <Highlight>Grass</Highlight>
                </>
              )}
            </h3>

            <p className="max-w-md text-base leading-relaxed text-bone/70">
              {lessonBodies[l.index]}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
