"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

type CursorMode = "default" | "view" | "drag" | "open" | "text";

export default function ContextCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<CursorMode>("default");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    // Disable on touch devices
    const isTouch = window.matchMedia("(hover: none)").matches;
    if (isTouch) return;

    document.documentElement.classList.add("has-cursor");

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const current = { x: target.x, y: target.y };
    const dot = { x: target.x, y: target.y };

    let rafId = 0;
    const render = () => {
      current.x += (target.x - current.x) * 0.18;
      current.y += (target.y - current.y) * 0.18;
      dot.x += (target.x - dot.x) * 0.55;
      dot.y += (target.y - dot.y) * 0.55;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${current.x}px, ${current.y}px, 0) translate(-50%, -50%)`;
      }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${dot.x}px, ${dot.y}px, 0) translate(-50%, -50%)`;
      }
      rafId = requestAnimationFrame(render);
    };
    rafId = requestAnimationFrame(render);

    const onMove = (e: MouseEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      if (!visible) setVisible(true);
    };

    const onEnter = () => setVisible(true);
    const onLeave = () => setVisible(false);

    const resolveMode = (el: HTMLElement | null): CursorMode => {
      if (!el) return "default";
      const node = el.closest<HTMLElement>("[data-cursor]");
      if (!node) return "default";
      const v = node.dataset.cursor as CursorMode | undefined;
      return v ?? "default";
    };

    const onOver = (e: MouseEvent) => {
      const next = resolveMode(e.target as HTMLElement);
      setMode((prev) => (prev === next ? prev : next));
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    document.addEventListener("mouseenter", onEnter);
    document.addEventListener("mouseleave", onLeave);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseenter", onEnter);
      document.removeEventListener("mouseleave", onLeave);
      document.documentElement.classList.remove("has-cursor");
    };
  }, [visible]);

  const label = mode === "view" ? "View" : mode === "drag" ? "Drag" : mode === "open" ? "Open" : "";

  const expanded = mode !== "default" && mode !== "text";

  return (
    <>
      <div
        ref={cursorRef}
        aria-hidden
        className={cn(
          "pointer-events-none fixed left-0 top-0 z-[100] flex items-center justify-center rounded-full transition-[width,height,background,border-color] duration-500 ease-elegant",
          "border border-bone/70",
          expanded ? "h-24 w-24 bg-bone/10 backdrop-blur-sm" : "h-9 w-9 bg-transparent",
          mode === "text" && "h-12 w-px rounded-none bg-bone border-none",
          !visible && "opacity-0"
        )}
        style={{ mixBlendMode: mode === "default" ? "difference" : "normal" }}
      >
        <span
          className={cn(
            "font-mono text-[10px] uppercase tracking-widest text-bone transition-opacity duration-300",
            expanded ? "opacity-100" : "opacity-0"
          )}
        >
          {label}
        </span>
      </div>
      <div
        ref={dotRef}
        aria-hidden
        className={cn(
          "pointer-events-none fixed left-0 top-0 z-[101] h-1 w-1 rounded-full bg-bone transition-opacity duration-300",
          !visible && "opacity-0",
          expanded && "opacity-0"
        )}
      />
    </>
  );
}
