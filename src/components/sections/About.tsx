"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import SplitText from "@/components/ui/SplitText";
import SectionLabel from "@/components/ui/SectionLabel";

const facts = [
  { k: "Based", v: "Davis, California" },
  { k: "Focus", v: "AI · Full-Stack · Product" },
  { k: "Years", v: "04" },
  { k: "Status", v: "Open — Summer '26" },
];

export default function About() {
  const ref = useRef<HTMLElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!portraitRef.current) return;
    const ctx = gsap.context(() => {
      gsap.to(portraitRef.current, {
        yPercent: -12,
        ease: "none",
        scrollTrigger: {
          trigger: portraitRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={ref}
      id="about"
      className="relative px-6 py-32 md:px-12 md:py-48"
    >
      <SectionLabel
        index="[02]"
        label="About"
        title="A software engineer blending systems thinking with design sensibility, building agentic AI and polished product experiences."
        subtitle="Software engineer who enjoys building reliable products end to end, from APIs and backend services to the interfaces people use every day. I care about clear architecture, solid performance, and shipping work that stays maintainable as it grows."
      />

      <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-16">
        {/* Left: pull quote */}
        <div className="md:col-span-7">
          <blockquote className="font-serif text-3xl font-light leading-snug text-bone md:text-5xl md:leading-[1.05]">
            <SplitText
              text="I treat software like cinema —"
              by="word"
              stagger={0.06}
              className="block"
            />
            <span className="block italic text-bone">
              <SplitText
                text="every interaction deserves intention."
                by="word"
                stagger={0.06}
                inViewDelay={0.4}
              />
            </span>
          </blockquote>

          <div className="mt-14 grid grid-cols-2 gap-8 border-t border-line pt-10">
            {facts.map((f) => (
              <div key={f.k} className="flex flex-col gap-1">
                <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-bone/40">
                  {f.k}
                </span>
                <span className="font-serif text-xl text-bone">{f.v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: portrait + paragraphs */}
        <div className="flex flex-col gap-10 md:col-span-5">
          <div className="relative aspect-[4/5] w-full overflow-hidden bg-elevated">
            <div
              ref={portraitRef}
              className="absolute inset-0 will-change-transform"
            >
              <img
                src="/portrait.png"
                alt="Ishika Bhaumik"
                className="h-full w-full object-cover object-top"
              />
            </div>
            <div className="absolute inset-0 mix-blend-overlay opacity-10 grain" />
            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
              <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-bone/60">
                New York — 2025
              </span>
            </div>
            <div className="pointer-events-none absolute inset-3 border border-bone/10" />
          </div>

          <div className="space-y-5 text-base leading-relaxed text-bone/75">
            <p>
              I&apos;m Ishika, a software engineer and designer currently finishing my M.S. in Computer
              Science at University of California, Davis. Previously at Novartis, I built and shipped
              full-stack applications serving 4,000+ users and developed automation systems that reduced
              reporting time by 96%.
            </p>
            <p>
              Today, I&apos;m focused on agentic AI: building LLM-powered systems with structured outputs,
              RAG pipelines, and tool orchestration, paired with interfaces that feel intuitive, polished,
              and human. My latest project, SafeWalk, won Best AI Depth &amp; Integration at HackHayward
              2026.
            </p>
            <p>
              I care deeply about both the system and the experience — not just making things work, but
              making them feel seamless to use.
            </p>
            <p>
              Open to full-time software engineering roles starting Summer 2026. If you&apos;re building
              thoughtful AI-native products and value engineers who care about product craftsmanship as
              much as technical depth, I&apos;d love to connect.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
