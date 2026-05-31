"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { createPortal } from "react-dom";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { lockScroll, unlockScroll } from "@/components/providers/SmoothScroll";
import { cn } from "@/lib/cn";

export const PROJECTS = [
  {
    slug: "safewalk",
    name: "SafeWalk",
    client: "HackHayward · Winner",
    year: "2026",
    description:
      "An AI safety companion for late-night walks with real-time location and agent orchestration.",
    detail:
      "An AI safety companion for late-night walks. Designed the agent architecture, integrated LLM reasoning with Google Maps and live location streams, and orchestrated multiple services into a low-latency pipeline with structured outputs. Won Best AI Depth & Integration at HackHayward 2026.",
    tags: ["AI Agent", "Mobile", "LLM"],
    accent: "#1a2e3a",
  },
  {
    slug: "waitwhat-ai",
    name: "WaitWhat.ai",
    client: "SB Hacks · Build",
    year: "2025",
    description:
      "An agentic LLM workflow that turns unstructured input into auditable, actionable insight.",
    detail:
      "An LLM-powered agentic workflow that turns unstructured input into auditable, actionable insight. Built with structured prompting, schema-conformant outputs, and validation passes designed for correctness at scale.",
    tags: ["LLM", "Agentic", "Python"],
    accent: "#2a1f3a",
  },
  {
    slug: "trending-tech-stack-analyzer",
    name: "Trending Tech Stack Analyzer",
    client: "Personal Project",
    year: "2024",
    description:
      "A full-stack pipeline that ingests datasets and surfaces structured tech trends on AWS.",
    detail:
      "A full-stack data pipeline and visualization platform that ingests, processes, and surfaces structured insights from large unstructured datasets. Built with React, Python, Spring Boot, and PostgreSQL — deployed on AWS (EC2, S3, Lambda) with CI/CD.",
    tags: ["React", "Python", "AWS"],
    accent: "#1a2a2e",
  },
  {
    slug: "gas-fee-resilientdb",
    name: "Gas-Fee Mechanism — ResilientDB",
    client: "Open Source Contribution",
    year: "2024",
    description:
      "Resource governance for a Byzantine Fault Tolerant distributed database in C++.",
    detail:
      "Designed and implemented a resource governance mechanism for a Byzantine Fault Tolerant distributed database in C++. Ensured transaction integrity and optimized concurrent performance under high-throughput load across a multi-node environment.",
    tags: ["C++", "BFT", "Distributed Systems"],
    accent: "#1e1a2e",
  },
] as const;

type Project = (typeof PROJECTS)[number];

const MAX_VISIBLE_OFFSET = 1; /* center + one each side = 3 cards */
const ACTIVE_Z_BOOST = 120;
const SIDE_Z_RECESS = 90;

type ArcMetrics = {
  radius: number;
  spread: number;
  scale: [number, number, number];
};

function getResponsiveValues(): ArcMetrics {
  const vw = typeof window !== "undefined" ? window.innerWidth : 1200;
  if (vw < 480) {
    return { radius: 340, spread: 20, scale: [1, 0.72, 0.54] };
  }
  if (vw < 768) {
    return { radius: 440, spread: 24, scale: [1, 0.74, 0.56] };
  }
  if (vw < 1200) {
    return { radius: 540, spread: 28, scale: [1, 0.76, 0.58] };
  }
  return { radius: 620, spread: 32, scale: [1, 0.78, 0.6] };
}

/** Shortest path around the ring — prevents cards stacking on linear offset. */
function getWrappedOffset(i: number, activeIndex: number, total: number): number {
  let offset = i - activeIndex;
  if (offset > total / 2) offset -= total;
  if (offset < -total / 2) offset += total;
  return offset;
}

/** Per-card 3D placement: rotateY first, then translateZ along local axis. */
function getCardPosition(
  i: number,
  activeIndex: number,
  total: number,
  radius: number,
  spread: number,
  scaleSteps: readonly [number, number, number],
) {
  const offset = getWrappedOffset(i, activeIndex, total);
  const absOffset = Math.abs(offset);
  const visible = absOffset <= MAX_VISIBLE_OFFSET;
  const angle = offset * spread;
  const scaleVal =
    absOffset === 0 ? scaleSteps[0] : absOffset === 1 ? scaleSteps[1] : scaleSteps[2];
  const z =
    offset === 0
      ? radius + ACTIVE_Z_BOOST
      : Math.max(radius - absOffset * SIDE_Z_RECESS, radius * 0.45);

  return {
    offset,
    angle,
    scale: scaleVal,
    z,
    visible,
    opacity: visible ? 1 : 0,
    /* Active card must paint above side cards to prevent bleed-through */
    zIndex: offset === 0 ? 40 : visible ? 12 - absOffset * 4 : 0,
    pointerEvents: (visible ? "auto" : "none") as "none" | "auto",
    visibility: (visible ? "visible" : "hidden") as "visible" | "hidden",
    isActive: offset === 0,
    transform: visible
      ? `rotateY(${angle}deg) translateZ(${z}px)`
      : "rotateY(0deg) translateZ(0px)",
  };
}

function firstSentence(text: string): string {
  const match = text.match(/^[^.!?]+[.!?]?/);
  return match ? match[0].trim() : text;
}

function ArcCardVisual({ accent, slug }: { accent: string; slug: string }) {
  const filterId = `arcNoise-${slug}`;
  const gradId = `arcBandFade-${slug}`;

  return (
    <div className="arc-card__visual" style={{ ["--arc-accent" as string]: accent }}>
      <svg
        className="arc-card__pattern"
        viewBox="0 0 240 360"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden
      >
        <defs>
          <filter id={filterId}>
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.85"
              numOctaves="3"
              stitchTiles="stitch"
            />
            <feColorMatrix values="0 0 0 0 0.92  0 0 0 0 0.92  0 0 0 0 0.92  0 0 0 0.35 0" />
          </filter>
          <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--arc-accent)" stopOpacity="0.55" />
            <stop offset="100%" stopColor="var(--arc-accent)" stopOpacity="0.15" />
          </linearGradient>
        </defs>
        <rect width="240" height="360" fill={`url(#${gradId})`} />
        <rect width="240" height="360" filter={`url(#${filterId})`} opacity="0.45" />
        <path
          d="M0 280 Q60 250 120 270 T240 255 L240 360 L0 360 Z"
          fill="var(--arc-accent)"
          opacity="0.25"
        />
      </svg>
    </div>
  );
}

function ProjectDetailModal({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    lockScroll();
    return () => unlockScroll();
  }, []);

  useLayoutEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    gsap.fromTo(
      panel,
      { autoAlpha: 0, y: 40 },
      { autoAlpha: 1, y: 0, duration: 0.5, ease: "expo.out" },
    );
  }, [project.slug]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return createPortal(
    <div
      className="arc-project-modal"
      role="presentation"
      onClick={onClose}
    >
      <div className="arc-project-modal__backdrop" aria-hidden />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`arc-modal-title-${project.slug}`}
        className="arc-project-modal__panel"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="arc-project-modal__visual">
          <ArcCardVisual accent={project.accent} slug={`modal-${project.slug}`} />
          <div className="arc-project-modal__visual-meta">
            <span className="arc-project-modal__visual-tags">
              {project.tags.join(" · ")}
            </span>
            <span className="arc-project-modal__visual-year">{project.year}</span>
          </div>
        </div>

        <div className="arc-project-modal__body">
          <div className="arc-project-modal__head">
            <div>
              <h2
                id={`arc-modal-title-${project.slug}`}
                className="arc-project-modal__title"
              >
                {project.name}
              </h2>
              <p className="arc-project-modal__client">{project.client}</p>
            </div>
            <button
              type="button"
              className="arc-project-modal__close"
              onClick={onClose}
              aria-label="Close project details"
            >
              ✕ Close
            </button>
          </div>

          <p className="arc-project-modal__detail">{project.detail}</p>

          <div className="arc-project-modal__tags">
            {project.tags.map((tag) => (
              <span key={tag} className="arc-card__tag">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}

export default function ProjectArcCarousel() {
  const rootRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const entryDoneRef = useRef(false);

  const [activeIndex, setActiveIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [navReady, setNavReady] = useState(false);
  const [pulse, setPulse] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [announcement, setAnnouncement] = useState<string>(PROJECTS[0].name);
  const [arcMetrics, setArcMetrics] = useState(getResponsiveValues);

  const count = PROJECTS.length;

  useEffect(() => {
    const onResize = () => setArcMetrics(getResponsiveValues());
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const goTo = useCallback(
    (index: number) => {
      const next = ((index % count) + count) % count;
      setActiveIndex((prev) => {
        if (next !== prev) {
          setPulse(true);
          setAnnouncement(PROJECTS[next].name);
          window.setTimeout(() => setPulse(false), 400);
        }
        return next;
      });
    },
    [count],
  );

  const goPrev = useCallback(() => {
    if (!revealed) return;
    goTo(activeIndex - 1);
  }, [activeIndex, goTo, revealed]);

  const goNext = useCallback(() => {
    if (!revealed) return;
    goTo(activeIndex + 1);
  }, [activeIndex, goTo, revealed]);

  const openProject = useCallback((index: number) => {
    setActiveIndex((prev) => {
      const next = ((index % count) + count) % count;
      if (next !== prev) {
        setPulse(true);
        setAnnouncement(PROJECTS[next].name);
        window.setTimeout(() => setPulse(false), 400);
      }
      return next;
    });
    setSelectedProject(PROJECTS[index]);
  }, [count]);

  const closeProject = useCallback(() => setSelectedProject(null), []);

  const playEntryAnimation = useCallback(() => {
    if (entryDoneRef.current) return;

    const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];
    if (cards.length < count) return;

    entryDoneRef.current = true;
    const metrics = getResponsiveValues();

    const order = cards
      .map((_, i) => ({
        i,
        dist: Math.abs(getWrappedOffset(i, 0, count)),
      }))
      .filter(({ i }) =>
        getCardPosition(i, 0, count, metrics.radius, metrics.spread, metrics.scale).visible,
      )
      .sort((a, b) => a.dist - b.dist);

    cards.forEach((_, i) => {
      const pos = getCardPosition(i, 0, count, metrics.radius, metrics.spread, metrics.scale);
      if (!pos.visible) {
        gsap.set(cards[i], { opacity: 0, visibility: "hidden", pointerEvents: "none" });
      }
    });

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.killTweensOf(cards);
        flushSync(() => setRevealed(true));
      },
    });

    order.forEach(({ i }, staggerIndex) => {
      const pos = getCardPosition(i, 0, count, metrics.radius, metrics.spread, metrics.scale);
      tl.fromTo(
        cards[i],
        {
          opacity: 0,
          rotateY: 0,
          z: -200,
          scale: 0.65,
          visibility: "visible",
          pointerEvents: "none",
        },
        {
          rotateY: pos.angle,
          z: pos.z,
          scale: pos.scale,
          opacity: 1,
          pointerEvents: "auto",
          duration: 1.15,
          ease: "power3.out",
          force3D: true,
        },
        staggerIndex * 0.12,
      );
    });
  }, [count]);

  /* Scroll-entry fan — cards emerge when section enters view */
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    let ctx: gsap.Context | undefined;
    let cancelled = false;

    const setup = () => {
      if (cancelled) return;

      const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];
      if (cards.length < count) {
        requestAnimationFrame(setup);
        return;
      }

      ctx = gsap.context(() => {
        gsap.set(cards, { opacity: 0, rotateY: 0, z: -200, scale: 0.65, visibility: "hidden" });

        ScrollTrigger.create({
          trigger: root,
          start: "top 85%",
          once: true,
          onEnter: () => playEntryAnimation(),
        });

        ScrollTrigger.refresh();
      }, root);
    };

    setup();

    const fallback = window.setTimeout(() => {
      if (entryDoneRef.current) return;
      if (ScrollTrigger.isInViewport(root, 0.15)) {
        playEntryAnimation();
      }
    }, 1600);

    return () => {
      cancelled = true;
      window.clearTimeout(fallback);
      ctx?.revert();
    };
  }, [playEntryAnimation]);

  /* Enable arc transitions only after entry settles — avoids collapse on handoff */
  useLayoutEffect(() => {
    if (!revealed) return;
    const frame = requestAnimationFrame(() => setNavReady(true));
    return () => {
      cancelAnimationFrame(frame);
      setNavReady(false);
    };
  }, [revealed]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const onKey = (e: KeyboardEvent) => {
      if (selectedProject) return;
      if (!revealed) return;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goNext();
      }
    };

    root.addEventListener("keydown", onKey);
    return () => root.removeEventListener("keydown", onKey);
  }, [goPrev, goNext, revealed, selectedProject]);

  const onCardActivate = (index: number) => {
    if (!revealed || selectedProject) return;
    openProject(index);
  };

  return (
    <div
      ref={rootRef}
      className={cn(
        "arc-carousel",
        revealed && "arc-carousel--revealed",
        navReady && "arc-carousel--nav-ready",
      )}
      tabIndex={0}
      aria-roledescription="carousel"
      aria-label="Selected projects"
    >
      <button
        type="button"
        className="arc-carousel__arrow arc-carousel__arrow--prev"
        aria-label="Previous project"
        onClick={goPrev}
        disabled={!revealed || !!selectedProject}
      >
        ←
      </button>

      <div ref={sceneRef} className="arc-carousel__viewport arc-scene">
        <div ref={ringRef} className="arc-carousel__ring arc-ring">
          {PROJECTS.map((project, i) => {
            const pos = getCardPosition(
              i,
              activeIndex,
              count,
              arcMetrics.radius,
              arcMetrics.spread,
              arcMetrics.scale,
            );
            const isActive = pos.isActive;

            return (
              <div
                key={project.slug}
                data-index={i}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                role="group"
                aria-roledescription="slide"
                aria-label={`${project.name}, ${i + 1} of ${count}`}
                aria-hidden={revealed ? !pos.visible : false}
                tabIndex={revealed && pos.visible ? 0 : -1}
                data-cursor="view"
                className={cn(
                  "arc-card",
                  isActive && revealed && "arc-card--active active",
                  isActive && pulse && "arc-card--pulse",
                  !revealed && "arc-card--pre-reveal",
                  revealed && !pos.visible && "arc-card--hidden",
                )}
                style={
                  revealed
                    ? {
                        transform: `rotateY(${pos.angle}deg) translateZ(${pos.z}px)`,
                        scale: pos.visible ? pos.scale : 0.01,
                        opacity: pos.visible ? 1 : 0,
                        visibility: pos.visible ? "visible" : "hidden",
                        pointerEvents: pos.visible ? pos.pointerEvents : "none",
                        zIndex: pos.zIndex,
                      }
                    : undefined
                }
                onClick={() => onCardActivate(i)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onCardActivate(i);
                  }
                }}
              >
                <div className="arc-card__inner">
                  <ArcCardVisual accent={project.accent} slug={project.slug} />

                  <div className="arc-card__body">
                    <div className="arc-card__header">
                      <span className="arc-card__name">{project.name}</span>
                      <span className="arc-card__year">{project.year}</span>
                    </div>

                    <p className="arc-card__client">{project.client}</p>

                    <p className="arc-card__desc">{firstSentence(project.description)}</p>

                    <div className="arc-card__tags">
                      {project.tags.map((tag) => (
                        <span key={tag} className="arc-card__tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <button
        type="button"
        className="arc-carousel__arrow arc-carousel__arrow--next"
        aria-label="Next project"
        onClick={goNext}
        disabled={!revealed || !!selectedProject}
      >
        →
      </button>

      <div className="arc-carousel__dots" role="tablist" aria-label="Project slides">
        {PROJECTS.map((project, i) => (
          <button
            key={project.slug}
            type="button"
            role="tab"
            aria-selected={i === activeIndex}
            aria-label={`Go to ${project.name}`}
            className={cn(
              "arc-carousel__dot",
              i === activeIndex && "arc-carousel__dot--active",
            )}
            onClick={() => revealed && goTo(i)}
            disabled={!revealed}
          />
        ))}
      </div>

      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {announcement}
      </p>

      {selectedProject && (
        <ProjectDetailModal project={selectedProject} onClose={closeProject} />
      )}
    </div>
  );
}
