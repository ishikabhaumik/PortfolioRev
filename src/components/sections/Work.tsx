"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import SectionLabel from "@/components/ui/SectionLabel";
import Highlight from "@/components/ui/Highlight";
import { cn } from "@/lib/cn";

interface Project {
  index: string;
  title: string;
  client: string;
  clientHighlight?: string;
  category: string;
  categoryHighlight?: string;
  year: string;
  gradient: string;
  description: string;
}

const projects: Project[] = [
  {
    index: "01",
    title: "SafeWalk",
    client: "HackHayward 2026 · Winner",
    clientHighlight: "Winner",
    category: "AI Agent · Mobile · Real-time",
    categoryHighlight: "AI Agent",
    year: "'26",
    gradient:
      "radial-gradient(ellipse at 30% 30%, #2a2a2a 0%, #161616 35%, #0a0a0a 80%)",
    description:
      "An AI safety companion for late-night walks. Designed the agent architecture, integrated LLM reasoning with Google Maps and live location streams, and orchestrated multiple services into a low-latency pipeline with structured outputs. Won Best AI Depth & Integration at HackHayward 2026.",
  },
  {
    index: "02",
    title: "WaitWhat.ai",
    client: "SB Hacks · Build",
    category: "LLM Workflow · Agentic",
    categoryHighlight: "Agentic",
    year: "'25",
    gradient: "linear-gradient(160deg, #1d1d1d 0%, #0a0a0a 70%)",
    description:
      "An LLM-powered agentic workflow that turns unstructured input into auditable, actionable insight. Built with structured prompting, schema-conformant outputs, and validation passes designed for correctness at scale.",
  },
  {
    index: "03",
    title: "Trending Tech Stack Analyzer",
    client: "Personal Project",
    category: "Full-Stack · Data Pipeline · AWS",
    categoryHighlight: "AWS",
    year: "'24",
    gradient:
      "radial-gradient(ellipse at 80% 70%, #232323 0%, #121212 40%, #0a0a0a 90%)",
    description:
      "A full-stack data pipeline and visualization platform that ingests, processes, and surfaces structured insights from large unstructured datasets. Built with React, Python, Spring Boot, and PostgreSQL — deployed on AWS (EC2, S3, Lambda) with CI/CD.",
  },
  {
    index: "04",
    title: "Gas-Fee Mechanism, ResilientDB",
    client: "Open Source Contribution",
    category: "Distributed Systems · BFT",
    categoryHighlight: "BFT",
    year: "'24",
    gradient:
      "radial-gradient(ellipse at 20% 30%, #262626 0%, #131313 40%, #0a0a0a 90%)",
    description:
      "Designed and implemented a resource governance mechanism for a Byzantine Fault Tolerant distributed database in C++. Ensured transaction integrity and optimized concurrent performance under high-throughput load across a multi-node environment.",
  },
];

function renderWithHighlight(text: string, highlight?: string) {
  if (!highlight || !text.includes(highlight)) {
    return text;
  }
  const [before, after] = text.split(highlight);
  return (
    <>
      {before}
      <Highlight>{highlight}</Highlight>
      {after}
    </>
  );
}

function renderClient(client: string, highlight?: string) {
  return renderWithHighlight(client, highlight);
}

function renderProjectDescription(project: Project) {
  switch (project.title) {
    case "SafeWalk":
      return (
        <>
          An AI safety companion for late-night walks. Designed the agent architecture, integrated LLM
          reasoning with Google Maps and live location streams, and orchestrated multiple services into
          a low-latency pipeline with structured outputs. Won{" "}
          <Highlight>Best AI Depth &amp; Integration at HackHayward 2026</Highlight>.
        </>
      );
    case "WaitWhat.ai":
      return (
        <>
          An <Highlight>LLM-powered agentic workflow</Highlight> that turns unstructured input into
          auditable, actionable insight. Built with structured prompting, schema-conformant outputs,
          and validation passes designed for <Highlight>correctness at scale</Highlight>.
        </>
      );
    case "Trending Tech Stack Analyzer":
      return (
        <>
          A full-stack data pipeline and visualization platform that ingests, processes, and surfaces
          structured insights from large unstructured datasets. Built with React, Python, Spring Boot,
          and PostgreSQL — deployed on <Highlight>AWS (EC2, S3, Lambda)</Highlight> with CI/CD.
        </>
      );
    case "Gas-Fee Mechanism, ResilientDB":
      return (
        <>
          Designed and implemented a resource governance mechanism for a{" "}
          <Highlight>Byzantine Fault Tolerant</Highlight> distributed database in C++. Ensured transaction
          integrity and optimized concurrent performance under <Highlight>high-throughput</Highlight> load
          across a multi-node environment.
        </>
      );
    default:
      return project.description;
  }
}

export default function Work() {
  const ref = useRef<HTMLElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);
  const [selected, setSelected] = useState<Project | null>(null);

  const openModal = useCallback((p: Project) => {
    setSelected(p);
  }, []);

  const closeModal = useCallback(() => {
    setSelected(null);
  }, []);

  const scrollToContact = useCallback(() => {
    const lenis = typeof window !== "undefined" ? window.__lenis : undefined;
    if (lenis) {
      lenis.scrollTo("#contact", { offset: -20, duration: 1.6 });
    } else {
      document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  useEffect(() => {
    const el = modalRef.current;
    if (!el) return;
    if (selected) {
      gsap.fromTo(el, { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: "expo.out" });
    } else {
      gsap.to(el, { autoAlpha: 0, y: 20, duration: 0.3, ease: "power2.in" });
    }
  }, [selected]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeModal]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const items = el.querySelectorAll<HTMLElement>("[data-work-row]");
      items.forEach((row) => {
        const title = row.querySelector("[data-work-title]");
        gsap.set(title, { yPercent: 110 });
        ScrollTrigger.create({
          trigger: row,
          start: "top 90%",
          once: true,
          onEnter: () => {
            gsap.to(title, { yPercent: 0, duration: 1.2, ease: "expo.out" });
          },
        });
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} id="work" className="relative px-6 py-32 md:px-12 md:py-48">
      <SectionLabel
        index="[01]"
        label="Selected Work"
        title={
          <>
            Few recent <Highlight>projects</Highlight>.
          </>
        }
        subtitle={
          <>
            A small, deliberate book of work. Hover a title to preview — click to open the{" "}
            <Highlight>case study</Highlight>.
          </>
        }
      />

      <ol className="relative z-10 flex flex-col border-t border-line">
        {projects.map((p, i) => (
          <li
            key={p.title}
            data-work-row
            className={cn(
              "border-b border-line transition-colors duration-700",
              active === i ? "border-bone/40" : "",
            )}
            onMouseEnter={() => setActive(i)}
            onMouseLeave={() => setActive(null)}
          >
            <button
              type="button"
              onClick={() => openModal(p)}
              data-cursor="view"
              className="group flex w-full flex-col gap-4 py-6 text-left md:flex-row md:items-baseline md:gap-10 md:py-10"
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-bone/50">
                {p.index}
              </span>

              <div className="flex-1 overflow-hidden">
                <h3
                  data-work-title
                  className="font-serif text-5xl font-light text-bone transition-[color,letter-spacing] duration-700 ease-elegant md:text-7xl"
                >
                  <span
                    className={cn(
                      "inline-block transition-transform duration-700 ease-elegant",
                      active === i ? "translate-x-4 italic" : "",
                    )}
                  >
                    {p.clientHighlight ? (
                      <Highlight>{p.title}</Highlight>
                    ) : (
                      p.title
                    )}
                  </span>
                </h3>
              </div>

              <div className="flex flex-col items-start gap-1 md:items-end md:text-right">
                <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-bone/50">
                  {renderWithHighlight(p.category, p.categoryHighlight)}
                </span>
                <span className="font-serif text-base italic text-bone/70">
                  {renderClient(p.client, p.clientHighlight)}
                </span>
              </div>
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-bone/40 md:w-12 md:text-right">
                {p.year}
              </span>
            </button>

            <div className="relative mb-6 block aspect-[3/2] w-full overflow-hidden md:hidden">
              <div className="absolute inset-0" style={{ background: p.gradient }} />
              <div className="grain absolute inset-0 opacity-30" />
            </div>
          </li>
        ))}
      </ol>

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

      {selected && (
        <div
          className="fixed inset-0 z-[150] flex items-end justify-center p-4 md:items-center"
          onClick={closeModal}
        >
          <div className="absolute inset-0 bg-ink/80 backdrop-blur-sm" />

          <div
            ref={modalRef}
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 w-full max-w-2xl overflow-hidden bg-elevated"
            style={{ opacity: 0 }}
          >
            <div className="relative h-48 w-full md:h-64" style={{ background: selected.gradient }}>
              <div className="absolute inset-0 grain opacity-40" />
              <div className="pointer-events-none absolute inset-3 border border-bone/10" />
              <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
                <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-bone/60">
                  {selected.categoryHighlight
                    ? renderWithHighlight(selected.category, selected.categoryHighlight)
                    : selected.category}
                </span>
                <span className="font-serif italic text-bone/70">{selected.year}</span>
              </div>
            </div>

            <div className="flex flex-col gap-6 p-6 md:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-serif text-3xl font-light text-bone md:text-4xl">
                    {selected.title}
                  </h2>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.4em] text-bone/50">
                    {renderClient(selected.client, selected.clientHighlight)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={closeModal}
                  className="mt-1 font-mono text-[10px] uppercase tracking-[0.4em] text-bone/50 transition-colors hover:text-bone"
                  aria-label="Close"
                >
                  ✕ Close
                </button>
              </div>

              <p className="text-base leading-relaxed text-bone/75">
                {renderProjectDescription(selected)}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
