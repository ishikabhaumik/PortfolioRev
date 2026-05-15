"use client";

import { useEffect, useRef } from "react";
import { gsap, Draggable } from "@/lib/gsap";
import SectionLabel from "@/components/ui/SectionLabel";

const experiments = [
  {
    title: "Shader Sonnet",
    tag: "GLSL",
    blurb: "A meditation on noise — fragment shader that paints itself.",
    gradient: "radial-gradient(ellipse at 30% 30%, #2a2a2a, #161616 60%, #0a0a0a 90%)",
  },
  {
    title: "Liquid Type",
    tag: "Three.js",
    blurb: "Letterforms that breathe with the cursor.",
    gradient: "linear-gradient(135deg, #1c1c1c, #0a0a0a)",
  },
  {
    title: "Magnetic Grid",
    tag: "GSAP",
    blurb: "A field of points that follows your attention.",
    gradient: "radial-gradient(circle at 50% 50%, #232323 0%, #131313 60%, #0a0a0a 100%)",
  },
  {
    title: "Ribbon Engine",
    tag: "Canvas",
    blurb: "Continuous flow lines guided by physics.",
    gradient: "linear-gradient(180deg, #1a1a1a, #0a0a0a)",
  },
  {
    title: "Refraction Study",
    tag: "WebGL",
    blurb: "Glass without geometry — a hand-tuned shader trick.",
    gradient: "radial-gradient(ellipse at 50% 0%, #262626, transparent 60%), linear-gradient(180deg, #161616, #0a0a0a)",
  },
  {
    title: "Sonic Wave",
    tag: "Web Audio",
    blurb: "Visualizing frequency as architecture.",
    gradient: "radial-gradient(circle at 80% 20%, #242424 0%, #121212 60%, #0a0a0a 100%)",
  },
];

export default function Playground() {
  const ref = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    const track = trackRef.current;
    if (!el || !track) return;

    const ctx = gsap.context(() => {
      const cards = el.querySelectorAll<HTMLElement>("[data-play-card]");
      cards.forEach((card, i) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "expo.out",
            delay: (i % 3) * 0.06,
            scrollTrigger: { trigger: card, start: "top 90%", once: true },
          }
        );
      });
    }, ref);

    const computeBounds = () => {
      const max = Math.min(0, el.clientWidth - track.scrollWidth);
      return { minX: max, maxX: 0 };
    };

    const instances = Draggable.create(track, {
      type: "x",
      edgeResistance: 0.85,
      bounds: computeBounds(),
      dragResistance: 0.05,
      cursor: "grab",
      activeCursor: "grabbing",
      allowNativeTouchScrolling: false,
    });
    const draggable = instances && instances[0];

    const onResize = () => {
      if (draggable) draggable.applyBounds(computeBounds());
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      if (draggable) draggable.kill();
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={ref}
      id="playground"
      className="relative overflow-hidden py-32 md:py-48"
    >
      <div className="px-6 md:px-12">
        <SectionLabel
          index="[07]"
          label="Playground"
          title="Experiments without a brief — drag to explore."
        />
      </div>

      <div className="relative">
        <div
          ref={trackRef}
          className="flex w-max cursor-grab gap-6 px-6 active:cursor-grabbing md:gap-10 md:px-12"
          data-cursor="drag"
        >
          {experiments.map((e, i) => (
            <article
              key={e.title}
              data-play-card
              data-cursor="drag"
              className="group relative flex h-[60vh] w-[78vw] max-w-[520px] flex-col justify-between overflow-hidden bg-elevated p-8 md:h-[68vh] md:w-[34vw] md:p-10"
              style={{ background: e.gradient }}
            >
              <div className="grain absolute inset-0 z-0 opacity-30" />
              <div className="pointer-events-none absolute inset-3 z-[1] border border-bone/10" />

              <div className="relative z-10 flex items-start justify-between font-mono text-[10px] uppercase tracking-[0.4em] text-bone/70">
                <span>{String(i + 1).padStart(2, "0")} / {String(experiments.length).padStart(2, "0")}</span>
                <span className="text-bone">{e.tag}</span>
              </div>

              <div className="relative z-10 flex flex-col gap-3">
                <h3 className="font-serif text-3xl font-light text-bone md:text-4xl">
                  {e.title}
                </h3>
                <p className="max-w-xs text-sm leading-relaxed text-bone/70">{e.blurb}</p>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="mt-10 flex items-center gap-4 px-6 font-mono text-[10px] uppercase tracking-[0.4em] text-bone/40 md:px-12">
        <span aria-hidden>←</span>
        <span>Drag horizontally</span>
        <span aria-hidden>→</span>
      </div>
    </section>
  );
}
