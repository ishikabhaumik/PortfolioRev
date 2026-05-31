"use client";

import { useCallback } from "react";
import SectionLabel from "@/components/ui/SectionLabel";
import ProjectArcCarousel from "@/components/sections/ProjectArcCarousel";

export default function Work() {
  const scrollToContact = useCallback(() => {
    const lenis = typeof window !== "undefined" ? window.__lenis : undefined;
    if (lenis) {
      lenis.scrollTo("#contact", { offset: -20, duration: 1.6 });
    } else {
      document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  return (
    <section id="work" className="projects-section relative">
      <SectionLabel
        className="section-intro"
        index="[01]"
        label="Selected Work"
        title="Few recent projects."
        subtitle="A small, deliberate book of work. Cards emerge as you scroll in — then use the arrows to browse."
      />

      <ProjectArcCarousel />

      <div className="mt-16 flex justify-end font-mono text-[10px] uppercase tracking-[0.4em] text-bone/40">
        <button
          type="button"
          onClick={scrollToContact}
          data-cursor="open"
          className="group inline-flex items-center gap-2 transition-colors duration-500 hover:text-bone"
        >
          <span aria-hidden>↳</span>
          <span className="relative">
            More on request
            <span className="absolute -bottom-1 left-0 block h-px w-0 bg-bone transition-[width] duration-700 ease-elegant group-hover:w-full" />
          </span>
        </button>
      </div>
    </section>
  );
}
