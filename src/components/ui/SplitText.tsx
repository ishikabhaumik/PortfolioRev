"use client";

import { forwardRef, useEffect, useMemo, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { cn } from "@/lib/cn";

interface SplitTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  text: string;
  as?: keyof JSX.IntrinsicElements;
  by?: "char" | "word";
  className?: string;
  inViewDelay?: number;
  stagger?: number;
  duration?: number;
  start?: string;
  trigger?: boolean;
  autoPlay?: boolean;
}

const SplitText = forwardRef<HTMLSpanElement, SplitTextProps>(function SplitText(
  {
    text,
    as: Tag = "span",
    by = "char",
    className,
    inViewDelay = 0,
    stagger = 0.022,
    duration = 1.1,
    start = "top 80%",
    trigger = true,
    autoPlay = false,
    ...rest
  },
  ref
) {
  const containerRef = useRef<HTMLElement | null>(null);
  const items = useMemo(() => {
    if (by === "word") return text.split(" ");
    return Array.from(text);
  }, [text, by]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const targets = el.querySelectorAll<HTMLElement>("[data-split-inner]");
    gsap.set(targets, { yPercent: 110 });

    const play = () =>
      gsap.to(targets, {
        yPercent: 0,
        duration,
        ease: "expo.out",
        stagger,
        delay: inViewDelay,
      });

    if (autoPlay) {
      const t = play();
      return () => {
        t.kill();
      };
    }

    if (!trigger) return;

    const st = ScrollTrigger.create({
      trigger: el,
      start,
      once: true,
      onEnter: () => play(),
    });

    return () => {
      st.kill();
    };
  }, [text, autoPlay, trigger, inViewDelay, stagger, duration, start]);

  // assign ref using callback
  const setRef = (node: HTMLElement | null) => {
    containerRef.current = node;
    if (typeof ref === "function") ref(node as HTMLSpanElement);
    else if (ref) (ref as React.MutableRefObject<HTMLSpanElement | null>).current = node as HTMLSpanElement;
  };

  const Component = Tag as any;

  return (
    <Component ref={setRef} className={cn("inline-block", className)} aria-label={text} {...rest}>
      {items.map((item, i) => (
        <span
          key={i}
          aria-hidden
          className="mask-reveal"
          style={{ whiteSpace: by === "word" ? "normal" : "pre" }}
        >
          <span data-split-inner>{item === " " ? "\u00A0" : item}</span>
          {by === "word" && i < items.length - 1 ? "\u00A0" : ""}
        </span>
      ))}
    </Component>
  );
});

export default SplitText;
