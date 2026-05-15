"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import SectionLabel from "@/components/ui/SectionLabel";

const categories: { title: string; items: string[] }[] = [
  {
    title: "Languages",
    items: ["TypeScript", "JavaScript", "Python", "Java", "SQL", "C++"],
  },
  {
    title: "Frontend",
    items: ["React", "Next.js", "React Native", "Tailwind CSS", "GSAP", "Component Architecture"],
  },
  {
    title: "Backend & APIs",
    items: ["Node.js", "FastAPI", "Spring Boot", "REST", "GraphQL", "PostgreSQL", "Redis"],
  },
  {
    title: "AI & Agents",
    items: [
      "LLM APIs",
      "Agentic Workflows",
      "RAG",
      "Prompt Engineering",
      "Tool Calling",
      "Structured Outputs",
      "Evals",
    ],
  },
  {
    title: "Cloud & Infra",
    items: ["AWS (EC2, S3, Lambda)", "Docker", "Kubernetes", "CI/CD", "Vercel"],
  },
];

export default function Skills() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      const rows = el.querySelectorAll<HTMLElement>("[data-skill-row]");
      rows.forEach((row) => {
        const title = row.querySelector("[data-skill-title]");
        const items = row.querySelectorAll("[data-skill-item]");
        const line = row.querySelector("[data-skill-line]");

        gsap.set(title, { yPercent: 110 });
        gsap.set(items, { opacity: 0, y: 16 });
        if (line) gsap.set(line, { scaleX: 0, transformOrigin: "left" });

        ScrollTrigger.create({
          trigger: row,
          start: "top 80%",
          once: true,
          onEnter: () => {
            const tl = gsap.timeline();
            tl.to(title, { yPercent: 0, duration: 1.2, ease: "expo.out" });
            if (line) tl.to(line, { scaleX: 1, duration: 1.1, ease: "expo.inOut" }, "-=0.9");
            tl.to(items, { opacity: 1, y: 0, duration: 0.9, ease: "expo.out", stagger: 0.05 }, "-=0.7");
          },
        });
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={ref}
      id="skills"
      className="relative px-6 py-32 md:px-12 md:py-48"
    >
      <SectionLabel
        index="[03]"
        label="Capabilities"
        title="A composer's toolkit."
      />

      <div className="flex flex-col">
        {categories.map((cat, i) => (
          <div
            key={cat.title}
            data-skill-row
            className="grid grid-cols-1 gap-6 border-b border-line py-8 md:grid-cols-12 md:items-center md:py-12"
          >
            <div className="flex items-center gap-6 md:col-span-4">
              <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-bone/45">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="overflow-hidden">
                <h3
                  data-skill-title
                  className="font-serif text-3xl font-light text-bone md:text-5xl"
                >
                  {cat.title}
                </h3>
              </div>
            </div>

            <div className="hidden md:col-span-1 md:block">
              <div data-skill-line className="h-px w-full bg-bone/25" />
            </div>

            <ul className="flex flex-wrap gap-x-3 gap-y-2 md:col-span-7 md:justify-end">
              {cat.items.map((item) => (
                <li
                  key={item}
                  data-skill-item
                  className="rounded-full border border-bone/15 px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-bone/75 transition-colors duration-300 hover:border-bone/60 hover:text-bone"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
