"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import SectionLabel from "@/components/ui/SectionLabel";
import { cn } from "@/lib/cn";

interface Role {
  company: string;
  role: string;
  period: string;
  location: string;
  description: string;
  tags: string[];
}

const roles: Role[] = [
  {
    company: "UC Davis",
    role: "Graduate Student Researcher",
    period: "Sep 2024 — Jun 2026",
    location: "Davis, CA",
    description:
      "Designed a metadata-driven framework to predict image quality metrics across the MIDRC chest CT database. Leveraged multi-institutional phantom data to map scan parameters to quantitative IQ measures, enabling image-quality–based cohort selection and enhancing the IQ-dependent assessment capabilities of AI-driven medical imaging algorithms.",
    tags: ["Medical Imaging", "AI", "Machine Learning", "Image Quality", "Research"],
  },
  {
    company: "UC Davis",
    role: "M.S. Computer Science · Teaching Assistant",
    period: "Sep 2024 — Jun 2026",
    location: "Davis, CA",
    description:
      "Pursuing my Master's in Computer Science with a focus on AI systems, distributed computing, and product engineering. Mentor students as a TA through coding labs, debugging workshops, and code reviews — translating production engineering instincts to the classroom.",
    tags: ["AI Systems", "Distributed Computing", "Teaching"],
  },
  {
    company: "Novartis",
    role: "Associate Software Engineer",
    period: "Aug 2022 — Aug 2024",
    location: "Hyderabad, India",
    description:
      "Owned full-stack features end-to-end in React, TypeScript, Java, and REST APIs — from architecture through deployment — for applications serving 4,000+ users. Cut system latency by 30% via systematic profiling, designed third-party API integrations that eliminated manual workflows, and earned a company Best Innovation award for an automation pipeline that reduced reporting time by 96%.",
    tags: ["React", "TypeScript", "Java", "REST APIs", "Production"],
  },
  {
    company: "Novartis",
    role: "Software Engineering Intern",
    period: "Jan 2022 — Jun 2022",
    location: "Hyderabad, India",
    description:
      "Contributed to production full-stack features using React, Java, and Spring Boot. Implemented and tested REST endpoints shipped to real users. Participated in code reviews and Agile sprints, building habits around reliability, testing, and iterative delivery.",
    tags: ["React", "Spring Boot", "Agile"],
  },
  {
    company: "HighRadius Technologies",
    role: "Software Engineering Intern",
    period: "Jun 2021 — Dec 2021",
    location: "Hyderabad, India",
    description:
      "Built React-based dashboards for financial data workflows integrated with Snowflake and SQL pipelines, supporting analytics for 50+ users. Optimized backend queries and data processing pipelines, cutting latency by 50%.",
    tags: ["React", "Snowflake", "SQL", "Data Pipelines"],
  },
];

export default function Experience() {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState<number>(-1);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      const rows = el.querySelectorAll<HTMLElement>("[data-role-row]");
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
          }
        );
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} id="experience" className="relative px-6 py-32 md:px-12 md:py-48">
      <SectionLabel
        index="[05]"
        label="Trajectory"
        title="Built Over Time."
        subtitle="Software, design, and systems thinking — evolving together."
      />

      <ol className="flex flex-col border-t border-line">
        {roles.map((r, i) => {
          const isOpen = active === i;
          return (
            <li
              key={`${r.company}-${i}`}
              data-role-row
              className="border-b border-line"
            >
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
                  <span className="font-serif text-2xl text-bone transition-transform duration-700 ease-elegant group-hover:translate-x-2 md:text-4xl">
                    {r.company}
                  </span>
                  <span className="font-mono text-xs uppercase tracking-[0.3em] text-bone/50 md:ml-auto md:pr-8">
                    {r.role}
                  </span>
                </div>
                <div className="flex shrink-0 items-baseline gap-6">
                  <span className="font-mono text-xs uppercase tracking-[0.3em] text-bone/60">
                    {r.period}
                  </span>
                  <span
                    className={cn(
                      "block h-3 w-3 rounded-full border border-bone/60 transition-all duration-500",
                      isOpen ? "bg-bone scale-100" : "bg-transparent scale-75"
                    )}
                  />
                </div>
              </button>

              <div
                className={cn(
                  "grid transition-[grid-template-rows,opacity] duration-700 ease-elegant",
                  isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                )}
                aria-hidden={!isOpen}
              >
                <div className="overflow-hidden">
                  <div className="grid grid-cols-1 gap-6 pb-10 pl-0 pt-2 md:grid-cols-12 md:pl-24">
                    <p className="md:col-span-7 text-base leading-relaxed text-bone/75">
                      {r.description}
                    </p>
                    <div className="md:col-span-3 md:col-start-9 flex flex-col gap-3">
                      <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-bone/40">
                        Location
                      </span>
                      <span className="font-serif text-lg text-bone">{r.location}</span>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {r.tags.map((t) => (
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
