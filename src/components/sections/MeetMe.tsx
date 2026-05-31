"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import SectionLabel from "@/components/ui/SectionLabel";

const MEET_VIDEO_SRC = "/Main%20Sequence-4.mp4";

export default function MeetMe() {
  const ref = useRef<HTMLElement>(null);
  const videoWrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  /* Always begin at 0:00 on full page load / bfcache restore */
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const resetToStart = () => {
      video.pause();
      video.currentTime = 0;
    };

    resetToStart();

    const onPageShow = (e: PageTransitionEvent) => {
      if (e.persisted) resetToStart();
    };

    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, []);

  useEffect(() => {
    const el = ref.current;
    const videoWrap = videoWrapRef.current;
    const video = videoRef.current;
    if (!el || !videoWrap || !video) return;

    const ctx = gsap.context(() => {
      gsap.set(videoWrap, { opacity: 0, y: 32 });
      ScrollTrigger.create({
        trigger: videoWrap,
        start: "top 88%",
        once: true,
        onEnter: () => {
          video.currentTime = 0;
          void video.play();

          gsap.to(videoWrap, {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: "expo.out",
          });
        },
      });
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={ref}
      id="meet"
      className="relative px-6 py-24 md:px-12 md:py-36"
    >
      <SectionLabel
        index="[—]"
        label="Meet Me"
        title="A quick hello."
        subtitle="A short clip — the person behind the portfolio."
      />

      <div
        ref={videoWrapRef}
        className="relative mx-auto aspect-video w-full max-w-5xl overflow-hidden bg-elevated"
      >
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          src={MEET_VIDEO_SRC}
          muted
          loop
          playsInline
          controls
          preload="auto"
          aria-label="Meet Ishika Bhaumik"
        />
        <div className="pointer-events-none absolute inset-0 mix-blend-overlay opacity-10 grain" />
        <div className="pointer-events-none absolute inset-3 border border-bone/10" />
      </div>
    </section>
  );
}
