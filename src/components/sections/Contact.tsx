"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import SplitText from "@/components/ui/SplitText";
import MagneticButton from "@/components/ui/MagneticButton";

const RESUME_URL = "https://ishikabhaumik.github.io/Resume.pdf";

const socials = [
  { label: "LinkedIn", href: "https://linkedin.com/in/ishika-bhaumik" },
  { label: "Github", href: "https://github.com/ishikabhaumik" },
  { label: "Email", href: "mailto:bhaumikiman26@gmail.com" },
];

export default function Contact() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      const items = el.querySelectorAll<HTMLElement>("[data-c-anim]");
      gsap.fromTo(
        items,
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 1.1,
          ease: "expo.out",
          stagger: 0.08,
          scrollTrigger: { trigger: el, start: "top 75%", once: true },
        }
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={ref}
      id="contact"
      className="relative overflow-hidden px-6 pt-24 pb-16 md:px-12 md:pt-40 md:pb-20"
    >
      <div className="mb-16 flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.4em] text-bone/55">
        <span data-c-anim>[08]</span>
        <span data-c-anim className="block h-px w-16 bg-bone/30" />
        <span data-c-anim>Contact</span>
      </div>

      <div className="grid grid-cols-1 gap-16 md:grid-cols-12 md:gap-12">
        {/* Left: statement + Gmail */}
        <div className="md:col-span-7">
          <h2 className="font-serif text-display-lg font-light leading-[0.95] text-bone">
            <SplitText text="Let's build" by="word" stagger={0.06} className="block" />
            <SplitText
              text="something"
              by="word"
              stagger={0.06}
              inViewDelay={0.2}
              className="block self-end pl-8 italic text-bone/90 md:pl-24"
            />
            <SplitText
              text="worth staring at."
              by="word"
              stagger={0.06}
              inViewDelay={0.45}
              className="block italic"
            />
          </h2>

          <div className="mt-12 flex flex-col gap-2 md:mt-16">
            <span data-c-anim className="font-mono text-[10px] uppercase tracking-[0.4em] text-bone/40">
              Direct line
            </span>
            <MagneticButton
              as="a"
              href="mailto:bhaumikiman26@gmail.com"
              className="self-start font-serif text-3xl text-bone underline decoration-bone/40 decoration-1 underline-offset-8 transition-colors hover:decoration-bone md:text-5xl"
            >
              bhaumikiman26@gmail.com
            </MagneticButton>
          </div>
        </div>

        {/* Right: resume */}
        <div className="flex flex-col gap-6 md:col-span-5 md:justify-end md:pt-4">
          <span data-c-anim className="font-mono text-[10px] uppercase tracking-[0.4em] text-bone/40">
            Résumé
          </span>
          <p data-c-anim className="max-w-md font-serif text-xl leading-snug text-bone/65 md:text-2xl">
            PDF overview of experience and projects — opens in a new tab.
          </p>
          <div data-c-anim className="pt-2">
            <MagneticButton
              as="a"
              href={RESUME_URL}
              target="_blank"
              rel="noopener noreferrer"
              ariaLabel="Download résumé as PDF"
              className="group relative inline-flex overflow-hidden rounded-full border border-bone px-7 py-3 font-mono text-[11px] uppercase tracking-[0.35em] text-bone transition-colors duration-700 hover:text-ink"
            >
              <span className="relative z-10">Download résumé</span>
              <span className="absolute inset-0 -z-0 origin-bottom scale-y-0 bg-bone transition-transform duration-700 ease-elegant group-hover:scale-y-100" />
            </MagneticButton>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-24 flex flex-col gap-6 border-t border-line pt-8 font-mono text-[10px] uppercase tracking-[0.4em] text-bone/45 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <span>Ishika Bhaumik · © 2026</span>
        </div>
        <div className="flex flex-wrap gap-6">
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              {...(s.href.startsWith("mailto:")
                ? {}
                : { target: "_blank", rel: "noopener noreferrer" })}
              data-cursor="open"
              className="transition-colors hover:text-bone"
            >
              {s.label} ↗
            </a>
          ))}
        </div>
        <div>Designed &amp; built in California</div>
      </div>
    </section>
  );
}
