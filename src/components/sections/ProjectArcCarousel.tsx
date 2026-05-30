"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
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

const SWIPE_THRESHOLD = 50;
const CLICK_MOVE_THRESHOLD = 8;
const WHEEL_ADVANCE = 160;
const WHEEL_COOLDOWN_MS = 1800;
const MAX_VISIBLE_OFFSET = 2; /* all 4 projects visible on the arc */
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
  const dragRef = useRef({
    active: false,
    startX: 0,
    startY: 0,
    moved: false,
    cardIndex: null as number | null,
    capturing: false,
  });
  const wheelLockRef = useRef(false);
  const entryDoneRef = useRef(false);

  const [activeIndex, setActiveIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
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

  const goPrev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);
  const goNext = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);

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

  /* Scroll-entry fan — useLayoutEffect so card refs exist before setup */
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    let ctx: gsap.Context | undefined;
    let cancelled = false;

    const setup = () => {
      if (cancelled) return;

      const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];
      if (!cards.length) {
        requestAnimationFrame(setup);
        return;
      }

      ctx = gsap.context(() => {
        gsap.set(cards, { rotateY: 0, z: 0, opacity: 0, scale: 0.92 });

        ScrollTrigger.create({
          trigger: root,
          start: "top 85%",
          once: true,
          onEnter: () => {
            if (entryDoneRef.current) return;
            entryDoneRef.current = true;

            const metrics = getResponsiveValues();

            const order = cards
              .map((_, i) => ({
                i,
                dist: Math.abs(getWrappedOffset(i, 0, cards.length)),
              }))
              .filter(({ i }) =>
                getCardPosition(
                  i,
                  0,
                  cards.length,
                  metrics.radius,
                  metrics.spread,
                  metrics.scale,
                ).visible,
              )
              .sort((a, b) => a.dist - b.dist);

            const tl = gsap.timeline({
              onComplete: () => {
                entryDoneRef.current = true;
                setRevealed(true);
              },
            });

            order.forEach(({ i }, staggerIndex) => {
              const pos = getCardPosition(
                i,
                0,
                cards.length,
                metrics.radius,
                metrics.spread,
                metrics.scale,
              );
              tl.to(
                cards[i],
                {
                  rotateY: pos.angle,
                  z: pos.z,
                  opacity: pos.opacity,
                  scale: pos.scale,
                  duration: 1,
                  ease: "power3.out",
                },
                staggerIndex * 0.08,
              );
            });
          },
        });
      }, root);
    };

    setup();

    /* Fallback if section is already in view or ScrollTrigger misses */
    const fallback = window.setTimeout(() => {
      if (!entryDoneRef.current) {
        entryDoneRef.current = true;
        setRevealed(true);
      }
    }, 1200);

    return () => {
      cancelled = true;
      window.clearTimeout(fallback);
      ctx?.revert();
    };
  }, []);

  /* Hand control back to React after reveal — must run after setRevealed re-render */
  useEffect(() => {
    if (!revealed) return;
    const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];
    if (!cards.length) return;
    gsap.set(cards, { clearProps: "all" });
  }, [revealed]);

  const wheelAccumRef = useRef(0);

  /* Scroll / wheel — accumulated delta for smooth, slower steps */
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    const onWheel = (e: WheelEvent) => {
      if (!revealed || selectedProject) return;
      const delta =
        Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      if (Math.abs(delta) < 2) return;

      e.preventDefault();
      e.stopPropagation();

      if (wheelLockRef.current) return;

      wheelAccumRef.current += delta;
      if (Math.abs(wheelAccumRef.current) < WHEEL_ADVANCE) return;

      const direction = wheelAccumRef.current > 0 ? 1 : -1;
      wheelLockRef.current = true;
      wheelAccumRef.current = 0;
      window.setTimeout(() => {
        wheelLockRef.current = false;
      }, WHEEL_COOLDOWN_MS);

      if (direction > 0) goNext();
      else goPrev();
    };

    scene.addEventListener("wheel", onWheel, { passive: false });
    return () => scene.removeEventListener("wheel", onWheel);
  }, [goNext, goPrev, revealed, selectedProject]);

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

  const onPointerDown = (e: React.PointerEvent) => {
    if (!revealed || selectedProject) return;

    const card = (e.target as HTMLElement).closest<HTMLElement>("[data-index]");
    const cardIndex = card ? Number(card.dataset.index) : NaN;

    dragRef.current = {
      active: true,
      startX: e.clientX,
      startY: e.clientY,
      moved: false,
      cardIndex: Number.isNaN(cardIndex) ? null : cardIndex,
      capturing: false,
    };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current.active) return;

    const deltaX = e.clientX - dragRef.current.startX;
    const deltaY = e.clientY - dragRef.current.startY;

    if (
      !dragRef.current.moved &&
      (Math.abs(deltaX) > CLICK_MOVE_THRESHOLD ||
        Math.abs(deltaY) > CLICK_MOVE_THRESHOLD)
    ) {
      dragRef.current.moved = true;
      sceneRef.current?.setPointerCapture(e.pointerId);
      dragRef.current.capturing = true;
    }
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (!dragRef.current.active) return;

    const { moved, startX, startY, cardIndex, capturing } = dragRef.current;
    dragRef.current.active = false;

    if (capturing && sceneRef.current?.hasPointerCapture(e.pointerId)) {
      sceneRef.current.releasePointerCapture(e.pointerId);
    }
    dragRef.current.capturing = false;

    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;
    const delta =
      Math.abs(deltaX) >= Math.abs(deltaY) ? deltaX : deltaY;

    if (Math.abs(delta) >= SWIPE_THRESHOLD) {
      if (delta > 0) goPrev();
      else goNext();
    } else if (!moved && cardIndex !== null) {
      openProject(cardIndex);
    }
  };

  const onCardActivate = (index: number) => {
    if (!revealed || selectedProject) return;
    openProject(index);
  };

  return (
    <div
      ref={rootRef}
      className={cn("arc-carousel", revealed && "arc-carousel--revealed")}
      tabIndex={0}
      aria-roledescription="carousel"
      aria-label="Selected projects"
    >
      <div
        ref={sceneRef}
        className="arc-carousel__viewport arc-scene"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={() => {
          dragRef.current.active = false;
          dragRef.current.capturing = false;
        }}
      >
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
            const showCard = !revealed || pos.visible;

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
                aria-hidden={!pos.visible}
                tabIndex={revealed && pos.visible ? 0 : -1}
                data-cursor="view"
                className={cn(
                  "arc-card",
                  isActive && "arc-card--active active",
                  isActive && pulse && "arc-card--pulse",
                  !revealed && "arc-card--pre-reveal",
                  revealed && !pos.visible && "arc-card--hidden",
                )}
                style={{
                  transform: pos.visible ? pos.transform : undefined,
                  scale: showCard ? (revealed ? pos.scale : undefined) : 0.01,
                  opacity: showCard ? (revealed ? pos.opacity : undefined) : 0,
                  visibility: showCard ? pos.visibility : "hidden",
                  pointerEvents: revealed && pos.visible ? pos.pointerEvents : "none",
                  zIndex: pos.zIndex,
                }}
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
            onClick={() => goTo(i)}
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
