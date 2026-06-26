"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { cn } from "@/lib/cn";

interface SectionLabelProps {
  index: string;
  label: string;
  title: ReactNode;
  subtitle?: ReactNode;
  align?: "left" | "right";
  className?: string;
}

export default function SectionLabel({
  index,
  label,
  title,
  subtitle,
  align = "left",
  className,
}: SectionLabelProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      const items = el.querySelectorAll("[data-anim]");
      gsap.set(items, { opacity: 0, y: 24 });
      const line = el.querySelector("[data-line]");
      if (line) gsap.set(line, { scaleX: 0, transformOrigin: "left" });

      ScrollTrigger.create({
        trigger: el,
        start: "top 75%",
        once: true,
        onEnter: () => {
          const tl = gsap.timeline();
          tl.to(items, { opacity: 1, y: 0, duration: 1, ease: "expo.out", stagger: 0.12 });
          if (line) tl.to(line, { scaleX: 1, duration: 1.2, ease: "expo.inOut" }, "-=0.7");
        },
      });
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        "mb-14 flex flex-col gap-6 md:mb-20",
        align === "right" && "md:items-end md:text-right",
        className
      )}
    >
      <div className="flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.4em] text-bone/55">
        <span data-anim>{index}</span>
        <span data-line className="h-px w-16 bg-bone/30" />
        <span data-anim>{label}</span>
      </div>
      <h2 data-anim className="font-serif text-display-md font-light text-bone md:max-w-3xl">
        {title}
      </h2>
      {subtitle && (
        <p data-anim className="max-w-xl font-sans text-base leading-relaxed text-bone/60">
          {subtitle}
        </p>
      )}
    </div>
  );
}
