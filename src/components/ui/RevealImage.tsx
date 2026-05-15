"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { cn } from "@/lib/cn";

interface RevealImageProps {
  src?: string;
  alt?: string;
  className?: string;
  imageClassName?: string;
  parallax?: number;
  children?: React.ReactNode;
}

export default function RevealImage({
  src,
  alt = "",
  className,
  imageClassName,
  parallax = 0,
  children,
}: RevealImageProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const inner = innerRef.current;
    const imgEl = imgRef.current;
    if (!wrapper || !inner || !imgEl) return;

    const ctx = gsap.context(() => {
      gsap.set(inner, { clipPath: "inset(0 0 100% 0)" });
      gsap.set(imgEl, { scale: 1.25 });

      ScrollTrigger.create({
        trigger: wrapper,
        start: "top 85%",
        once: true,
        onEnter: () => {
          const tl = gsap.timeline();
          tl.to(inner, { clipPath: "inset(0 0 0% 0)", duration: 1.4, ease: "expo.out" });
          tl.to(imgEl, { scale: 1, duration: 1.6, ease: "expo.out" }, "-=1.2");
        },
      });

      if (parallax !== 0) {
        gsap.to(imgEl, {
          yPercent: parallax,
          ease: "none",
          scrollTrigger: {
            trigger: wrapper,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      }
    }, wrapperRef);

    return () => ctx.revert();
  }, [parallax]);

  return (
    <div ref={wrapperRef} className={cn("relative overflow-hidden", className)}>
      <div ref={innerRef} className="absolute inset-0">
        <div
          ref={imgRef}
          className={cn(
            "absolute inset-0 bg-cover bg-center will-change-transform",
            imageClassName
          )}
          style={src ? { backgroundImage: `url(${src})` } : undefined}
          role="img"
          aria-label={alt}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
