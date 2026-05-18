"use client";

import { forwardRef, useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { cn } from "@/lib/cn";

type Props = {
  children: React.ReactNode;
  className?: string;
  strength?: number;
  as?: "button" | "a";
  href?: string;
  /** Only used when `as` is `"button"`. Defaults to `"button"` so forms must opt into `"submit"`. */
  buttonType?: React.ButtonHTMLAttributes<HTMLButtonElement>["type"];
  disabled?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  ariaLabel?: string;
  /** Only applied when `as` is `"a"`. */
  target?: React.HTMLAttributeAnchorTarget;
  rel?: string;
};

const MagneticButton = forwardRef<HTMLElement, Props>(function MagneticButton(
  { children, className, strength = 0.35, as = "button", href, buttonType = "button", disabled, onClick, ariaLabel, target, rel },
  ref
) {
  const elRef = useRef<HTMLElement | null>(null);
  const innerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = elRef.current;
    const inner = innerRef.current;
    if (!el || !inner) return;

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);
      gsap.to(el, { x: x * strength, y: y * strength, duration: 0.6, ease: "expo.out" });
      gsap.to(inner, { x: x * strength * 0.5, y: y * strength * 0.5, duration: 0.6, ease: "expo.out" });
    };
    const onLeave = () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.8, ease: "elastic.out(1, 0.5)" });
      gsap.to(inner, { x: 0, y: 0, duration: 0.8, ease: "elastic.out(1, 0.5)" });
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [strength]);

  const setRef = (node: HTMLElement | null) => {
    elRef.current = node;
    if (typeof ref === "function") ref(node as HTMLElement);
    else if (ref) (ref as React.MutableRefObject<HTMLElement | null>).current = node;
  };

  const baseClass = cn(
    "inline-flex items-center justify-center will-change-transform",
    className
  );

  if (as === "a") {
    return (
      <a
        ref={setRef as any}
        href={href}
        target={target}
        rel={rel}
        aria-label={ariaLabel}
        className={baseClass}
        data-cursor="open"
        onClick={onClick}
      >
        <span ref={innerRef} className="inline-flex items-center will-change-transform">
          {children}
        </span>
      </a>
    );
  }

  return (
    <button
      ref={setRef as any}
      aria-label={ariaLabel}
      className={baseClass}
      data-cursor="open"
      onClick={onClick}
      type={buttonType}
      disabled={disabled}
    >
      <span ref={innerRef} className="inline-flex items-center will-change-transform">
        {children}
      </span>
    </button>
  );
});

export default MagneticButton;
