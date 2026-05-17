"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "@/lib/gsap";
import { cn } from "@/lib/cn";
import { lockScroll, unlockScroll } from "@/components/providers/SmoothScroll";

const links: { label: string; meta: string; href: string }[] = [
  { label: "Index", meta: "00 — Home", href: "#hero" },
  { label: "Work", meta: "01 — Selected Projects", href: "#work" },
  { label: "About", meta: "02 — The Designer", href: "#about" },
  { label: "Practice", meta: "03 — Problem Solving", href: "#practice" },
  { label: "Personal", meta: "04 — Off the Clock", href: "#personal" },
  { label: "Lessons", meta: "05 — What I've Learnt", href: "#lessons" },
  { label: "Contact", meta: "06 — Let's Talk", href: "#contact" },
];

export default function FullscreenNav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLUListElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const el = overlayRef.current;
    if (!el) return;

    const items = linksRef.current?.querySelectorAll("[data-nav-line]") ?? [];
    const metas = el.querySelectorAll("[data-nav-meta]");

    gsap.set(el, { autoAlpha: 0 });
    gsap.set(items, { yPercent: 110 });
    gsap.set(metas, { opacity: 0, y: 10 });
  }, []);

  useEffect(() => {
    const el = overlayRef.current;
    if (!el) return;
    const items = linksRef.current?.querySelectorAll("[data-nav-line]") ?? [];
    const metas = el.querySelectorAll("[data-nav-meta]");

    if (tlRef.current) tlRef.current.kill();

    if (open) {
      lockScroll();
      const tl = gsap.timeline();
      tl.to(el, { autoAlpha: 1, duration: 0.5, ease: "power2.out" });
      tl.to(items, { yPercent: 0, duration: 1.1, ease: "expo.out", stagger: 0.07 }, "-=0.2");
      tl.to(metas, { opacity: 1, y: 0, duration: 0.6, ease: "expo.out", stagger: 0.05 }, "-=0.7");
      tlRef.current = tl;
    } else {
      unlockScroll();
      const tl = gsap.timeline();
      tl.to(metas, { opacity: 0, y: 10, duration: 0.3, ease: "power2.in", stagger: 0.03 });
      tl.to(items, { yPercent: 110, duration: 0.6, ease: "power3.in", stagger: 0.03 }, "-=0.2");
      tl.to(el, { autoAlpha: 0, duration: 0.3, ease: "power2.in" }, "-=0.2");
      tlRef.current = tl;
    }
  }, [open]);

  const handleLink = (href: string) => {
    setOpen(false);
    setTimeout(() => {
      const lenis = typeof window !== "undefined" ? window.__lenis : undefined;
      if (lenis) {
        lenis.scrollTo(href, { offset: -20, duration: 1.6 });
      } else {
        const target = document.querySelector(href);
        target?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 700);
  };

  return (
    <>
      {/* Top bar */}
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-[90] flex items-center justify-between px-6 py-5 transition-colors duration-500 md:px-12",
          scrolled && !open && "backdrop-blur-md bg-ink/40"
        )}
      >
        <Link
          href="#hero"
          className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.4em] text-bone"
          data-cursor="open"
        >
          <span>Ishika Bhaumik</span>
        </Link>

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="group relative flex items-center gap-3 font-mono text-xs uppercase tracking-[0.4em] text-bone"
          data-cursor="open"
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          <span className="relative h-3 w-6">
            <span
              className={cn(
                "absolute left-0 top-1 block h-px w-full bg-bone transition-transform duration-500 ease-elegant",
                open && "translate-y-[5px] rotate-45"
              )}
            />
            <span
              className={cn(
                "absolute left-0 bottom-1 block h-px w-full bg-bone transition-transform duration-500 ease-elegant",
                open && "-translate-y-[5px] -rotate-45"
              )}
            />
          </span>
          <span className="w-12 text-left">{open ? "Close" : "Menu"}</span>
        </button>
      </header>

      {/* Overlay */}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-[80] bg-ink"
        aria-hidden={!open}
        style={{ opacity: 0, visibility: "hidden" }}
      >
        <div className="grain absolute inset-0 z-[1]" />

        {/* Decorative hairlines */}
        <div className="absolute left-6 right-6 top-24 h-px bg-bone/15 md:left-12 md:right-12" />
        <div className="absolute left-6 right-6 bottom-24 h-px bg-bone/15 md:left-12 md:right-12" />

        <div className="relative z-10 flex h-full flex-col px-6 pt-32 pb-28 md:px-12 md:pt-36">
          <div className="mb-12 flex justify-between font-mono text-[10px] uppercase tracking-[0.4em] text-bone/50">
            <span data-nav-meta>Navigation</span>
            <span data-nav-meta>07 Sections</span>
          </div>

          <ul ref={linksRef} className="flex flex-1 flex-col justify-center gap-2 md:gap-1">
            {links.map((l, i) => (
              <li key={l.href} className="overflow-hidden">
                <a
                  href={l.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleLink(l.href);
                  }}
                  data-nav-line
                  data-cursor="open"
                  className="group flex items-baseline justify-between border-b border-bone/10 py-3 transition-colors duration-500 hover:border-bone/50"
                >
                  <span className="flex items-baseline gap-6 md:gap-10">
                    <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-bone/40">
                      {String(i).padStart(2, "0")}
                    </span>
                    <span className="font-serif text-5xl font-light leading-none text-bone transition-transform duration-700 ease-elegant group-hover:translate-x-3 md:text-7xl">
                      {l.label}
                    </span>
                  </span>
                  <span className="hidden font-mono text-[10px] uppercase tracking-[0.4em] text-bone/40 md:inline">
                    {l.meta}
                  </span>
                </a>
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="flex flex-col gap-1 font-mono text-[10px] uppercase tracking-[0.4em] text-bone/50">
              <span data-nav-meta>bhaumikiman26@gmail.com</span>
              <span data-nav-meta>Open to roles · Summer 2026</span>
            </div>
            <div className="flex gap-6 font-mono text-[10px] uppercase tracking-[0.4em] text-bone/50">
              <a
                data-nav-meta
                data-cursor="open"
                href="https://linkedin.com/in/ishika-bhaumik"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-bone transition"
              >
                LinkedIn
              </a>
              <a
                data-nav-meta
                data-cursor="open"
                href="https://github.com/ishikabhaumik"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-bone transition"
              >
                Github
              </a>
              <a
                data-nav-meta
                data-cursor="open"
                href="mailto:bhaumikiman26@gmail.com"
                className="hover:text-bone transition"
              >
                Email
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
