"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import SectionLabel from "@/components/ui/SectionLabel";
import Highlight from "@/components/ui/Highlight";
import { cn } from "@/lib/cn";

interface ResearchProject {
  title: string;
  context: string;
  period: string;
  location: string;
  tags: string[];
}

const projects: ResearchProject[] = [
  {
    title: "MIDRC Chest CT Image Quality",
    context: "UC Davis · Graduate Research",
    period: "Sep 2024 — Present",
    location: "Davis, CA",
    tags: ["Medical Imaging", "Physics-Informed ML", "MIDRC", "Image Quality", "CT"],
  },
  {
    title: "COVID-19 Mortality Rate Evolution",
    context: "Independent Research",
    period: "Research Project",
    location: "Remote",
    tags: ["FFT", "Machine Learning", "Epidemiology", "Public Health", "Data Analysis"],
  },
];

export default function Research() {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState<number>(-1);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      const rows = el.querySelectorAll<HTMLElement>("[data-research-row]");
      rows.forEach((row, i) => {
        gsap.fromTo(
          row,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "expo.out",
            scrollTrigger: { trigger: row, start: "top 85%", once: true },
            delay: i * 0.05,
          },
        );
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} id="research" className="relative px-6 py-32 md:px-12 md:py-48">
      <SectionLabel
        index="[05]"
        label="Research"
        title={
          <>
            Questions answered with <Highlight>data and models</Highlight>.
          </>
        }
        subtitle={
          <>
            Graduate and independent research — from <Highlight>medical imaging</Highlight> quality to
            population-scale epidemiology.
          </>
        }
      />

      <ol className="flex flex-col border-t border-line">
        {projects.map((p, i) => {
          const isOpen = active === i;
          return (
            <li key={p.title} data-research-row className="border-b border-line">
              <button
                type="button"
                onClick={() => setActive(isOpen ? -1 : i)}
                className="group flex w-full items-start justify-between gap-6 py-6 text-left md:py-8"
                data-cursor="open"
                aria-expanded={isOpen}
              >
                <div className="flex flex-1 flex-col gap-2 md:flex-row md:items-baseline md:gap-8">
                  <span className="w-16 font-mono text-[10px] uppercase tracking-[0.4em] text-bone/45">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-serif text-2xl text-bone transition-transform duration-700 ease-elegant group-hover:translate-x-2 md:text-3xl md:leading-tight">
                    <Highlight>{p.title}</Highlight>
                  </span>
                  <span className="font-mono text-xs uppercase tracking-[0.3em] text-bone/50 md:ml-auto md:pr-8">
                    {p.context}
                  </span>
                </div>
                <div className="flex shrink-0 items-baseline gap-6">
                  <span className="font-mono text-xs uppercase tracking-[0.3em] text-bone/60">
                    {p.period}
                  </span>
                  <span
                    className={cn(
                      "block h-3 w-3 rounded-full border border-bone/60 transition-all duration-500",
                      isOpen ? "bg-bone scale-100" : "bg-transparent scale-75",
                    )}
                  />
                </div>
              </button>

              <div
                className={cn(
                  "grid transition-[grid-template-rows,opacity] duration-700 ease-elegant",
                  isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                )}
                aria-hidden={!isOpen}
              >
                <div className="overflow-hidden">
                  <div className="grid grid-cols-1 gap-6 pb-10 pl-0 pt-2 md:grid-cols-12 md:pl-24">
                    <p className="md:col-span-7 text-base leading-relaxed text-bone/75">
                      {i === 0 ? (
                        <>
                          Designed a <Highlight>physics-informed, metadata-driven ML framework</Highlight> to
                          predict image quality metrics across the{" "}
                          <Highlight>MIDRC chest CT database</Highlight>. Leveraged multi-institutional phantom
                          data to map scan parameters to quantitative IQ measures, enabling{" "}
                          <Highlight>IQ-based cohort selection</Highlight> for AI-driven medical imaging
                          algorithms.
                        </>
                      ) : (
                        <>
                          Analyzed COVID-19 mortality data using an{" "}
                          <Highlight>FFT-driven machine learning approach</Highlight> to study how mortality rates
                          evolved across countries and surface insights tied to biological and socio-economic
                          drivers. Showed that COVID-19 mortality is closely linked to factors including{" "}
                          <Highlight>population density</Highlight>, <Highlight>GDP per capita</Highlight>,{" "}
                          <Highlight>global health index</Highlight>, and population above 65; environmental
                          factors such as <Highlight>PM2.5 air pollution</Highlight>; and dietary habits including
                          meat, alcohol, dairy, and sugar consumption per capita.
                        </>
                      )}
                    </p>
                    <div className="md:col-span-3 md:col-start-9 flex flex-col gap-3">
                      <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-bone/40">
                        Location
                      </span>
                      <span className="font-serif text-lg text-bone">{p.location}</span>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {p.tags.map((t) => (
                          <span
                            key={t}
                            className="rounded-full border border-bone/15 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-bone/70"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
