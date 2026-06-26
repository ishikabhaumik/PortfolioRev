"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import SplitText from "@/components/ui/SplitText";
import SectionLabel from "@/components/ui/SectionLabel";
import Highlight from "@/components/ui/Highlight";

const facts = [
  { k: "Based", v: "Davis, California" },
  { k: "Focus", v: "AI · Full-Stack · Product", highlight: true },
  { k: "Years", v: "04" },
  { k: "Status", v: "Open — Summer '26", highlight: true },
] as const;

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
        title={
          <>
            A software engineer blending systems thinking with design sensibility, building{" "}
            <Highlight>agentic AI</Highlight> and polished product experiences.
          </>
        }
        subtitle={
          <>
            Software engineer who enjoys building reliable products end to end — from APIs and
            backend services to the interfaces people use every day. I care about{" "}
            <Highlight>clear architecture</Highlight>, solid performance, and shipping work that
            stays maintainable as it grows.
          </>
        }
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
              every interaction deserves <Highlight>intention</Highlight>.
            </span>
          </blockquote>

          <div className="mt-14 grid grid-cols-2 gap-8 border-t border-line pt-10">
            {facts.map((f) => (
              <div key={f.k} className="flex flex-col gap-1">
                <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-bone/40">
                  {f.k}
                </span>
                <span className="font-serif text-xl text-bone">
                  {"highlight" in f && f.highlight ? <Highlight>{f.v}</Highlight> : f.v}
                </span>
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
              I&apos;m Ishika, a software engineer and designer finishing my{" "}
              <Highlight>M.S. in Computer Science</Highlight> at UC Davis. Previously at{" "}
              <Highlight>Novartis</Highlight>, one of the largest multinational pharmaceutical and
              healthcare corporations in the world, I built full-stack systems serving{" "}
              <Highlight>4,000+ users</Highlight> and created automation that reduced reporting time by{" "}
              <Highlight>96%</Highlight>.
            </p>
            <p>
              I care deeply about building software that feels thoughtful to use — not just technically
              strong systems, but products that feel intuitive, polished, and human. Lately, that&apos;s
              meant building AI-native experiences with <Highlight>LLMs</Highlight>,{" "}
              <Highlight>RAG pipelines</Highlight>, and <Highlight>agentic workflows</Highlight>. My
              latest project, <Highlight>SafeWalk</Highlight>, won{" "}
              <Highlight>Best AI Depth &amp; Integration at HackHayward 2026</Highlight>.
            </p>
            <p>
              Open to full-time software engineering roles starting{" "}
              <Highlight>Summer 2026</Highlight>.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
