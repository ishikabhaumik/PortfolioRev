"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import SectionLabel from "@/components/ui/SectionLabel";
import SplitText from "@/components/ui/SplitText";
import Highlight from "@/components/ui/Highlight";

const pursuits: { title: string; blurb: string; label: string }[] = [
  {
    label: "Someday",
    title: "TED Talk",
    blurb: "I aspire to give a TED Talk someday.",
  },
  {
    label: "Where I stay",
    title: "California",
    blurb: "I live in Cali.",
  },
  {
    label: "Passions",
    title: "Tech & Music",
    blurb: "I love coding and music.",
  },
  {
    label: "Movement & Food",
    title: "Tennis & Cooking",
    blurb: "Playing tennis and cooking.",
  },
  {
    label: "Writing & Speaking",
    title: "Words",
    blurb: "Poetry, creative writing, and public speaking.",
  },
  {
    label: "Reading & Ideas",
    title: "Books & Discourse",
    blurb: "I like reading books and intellectual discussions.",
  },
  {
    label: "Wanderlust",
    title: "Travelling",
    blurb: "New cities, new perspectives — the work always comes back richer.",
  },
  {
    label: "On the road",
    title: "Driving",
    blurb: "Long drives are where my best thinking quietly happens.",
  },
  {
    label: "Morning ritual",
    title: "Brewing My Own Coffee",
    blurb: "A slow, deliberate ritual — beans, water, patience.",
  },
  {
    label: "Come as you are",
    title: "Dancing and Gyming",
    blurb: "The fastest way to reset and feel like myself again.",
  },
  {
    label: "Play",
    title: "Gaming",
    blurb: "Worlds, mechanics, and the joy of figuring things out.",
  },
];

const places: string[] = [
  "Building What's Next",
  "Building What's Next",
  "Building What's Next",
  "Building What's Next",
  "Building What's Next",
  "Building What's Next",
  "Building What's Next",
  "Building What's Next",
];

export default function Personal() {
  const ref = useRef<HTMLElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const rows = el.querySelectorAll<HTMLElement>("[data-pursuit]");
      rows.forEach((row, i) => {
        gsap.fromTo(
          row,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "expo.out",
            delay: (i % 2) * 0.06,
            scrollTrigger: { trigger: row, start: "top 88%", once: true },
          }
        );
      });

      // Slow marquee for the travel strip
      const marquee = marqueeRef.current;
      if (marquee) {
        const distance = marquee.scrollWidth / 2;
        gsap.to(marquee, {
          x: -distance,
          duration: 40,
          ease: "none",
          repeat: -1,
        });
      }
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={ref}
      id="personal"
      className="relative px-6 py-32 md:px-12 md:py-48"
    >
      <SectionLabel
        index="[07]"
        label="Off the clock"
        title={
          <>
            What keeps the work <Highlight>honest</Highlight>.
          </>
        }
        subtitle="The hours away from the keyboard that quietly inform everything that I create."
      />

      <div className="grid grid-cols-1 gap-16 md:grid-cols-12 md:gap-16">
        {/* Left: photo + pull quote */}
        <div className="md:col-span-5 flex flex-col gap-8">
          <div className="relative aspect-[3/4] w-full overflow-hidden">
            <img
              src="/portrait-2.png"
              alt="Ishika in Davis, California"
              className="h-full w-full object-cover object-center"
            />
            <div className="pointer-events-none absolute inset-3 border border-bone/10" />
            <div className="absolute bottom-4 left-4">
              <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-white drop-shadow-[0_1px_8px_rgba(0,0,0,0.85)]">
                Davis · March 2026
              </span>
            </div>
          </div>

          <blockquote className="font-serif text-3xl font-light leading-snug text-bone md:text-4xl md:leading-[1.15]">
            <SplitText
              text="A good engineer reads,"
              by="word"
              stagger={0.06}
              className="block"
            />
            <SplitText
              text="cooks, plays,"
              by="word"
              stagger={0.06}
              inViewDelay={0.25}
              className="block italic"
            />
            <span className="block">
              and <Highlight>stays curious</Highlight>.
            </span>
          </blockquote>

          <p className="max-w-sm text-base leading-relaxed text-bone/65">
            I care deeply about <Highlight>craftsmanship</Highlight>, both in software and in life. The
            details we notice, the pace we move at, and the experiences we absorb inevitably become part
            of what we build.
          </p>
        </div>

        {/* Right: pursuits list */}
        <ol className="md:col-span-7 md:col-start-7 flex flex-col">
          {pursuits.map((p, i) => (
            <li
              key={p.title}
              data-pursuit
              className="group grid grid-cols-12 items-baseline gap-4 border-b border-line py-6 md:py-7"
            >
              <span className="col-span-3 font-mono text-[10px] uppercase tracking-[0.4em] text-bone/40">
                {p.label}
              </span>
              <h3 className="col-span-9 md:col-span-4 font-serif text-2xl font-light text-bone transition-transform duration-500 ease-elegant group-hover:translate-x-2 md:text-3xl">
                {p.title}
              </h3>
              <p className="col-span-12 col-start-4 md:col-span-5 md:col-start-8 font-serif text-base italic leading-snug text-bone/60 md:text-lg">
                {p.title === "TED Talk" ? (
                  <>
                    I aspire to give a <Highlight>TED Talk</Highlight> someday.
                  </>
                ) : p.title === "Tech & Music" ? (
                  <>
                    I love <Highlight>coding</Highlight> and <Highlight>music</Highlight>.
                  </>
                ) : (
                  p.blurb
                )}
              </p>
            </li>
          ))}
        </ol>
      </div>

      {/* Travel marquee */}
      <div className="mt-24 md:mt-32">
        <div className="mb-8 flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.4em] text-bone/45">
          <span>Always</span>
          <span className="block h-px w-16 bg-bone/25" />
          <span>Building <Highlight>What&apos;s Next</Highlight></span>
        </div>

        <div className="relative -mx-6 overflow-hidden md:-mx-12">
          {/* Edge fades */}
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-ink to-transparent md:w-40" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-ink to-transparent md:w-40" />

          <div
            ref={marqueeRef}
            className="flex w-max gap-12 whitespace-nowrap px-6 md:gap-20 md:px-12"
            aria-hidden
          >
            {[...places, ...places].map((place, i) => (
              <span
                key={i}
                className="font-serif text-4xl font-light leading-none text-bone/85 md:text-6xl"
              >
                <span className="mr-3 align-top font-mono text-xs uppercase tracking-[0.3em] text-bone/35 md:text-sm">
                  ✶
                </span>
                {place}
              </span>
            ))}
          </div>

          <ul className="sr-only">
            {places.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
