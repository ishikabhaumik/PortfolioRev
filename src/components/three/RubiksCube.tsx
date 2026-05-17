"use client";

import { useEffect, useRef } from "react";

interface RubiksCubeProps {
  /** Edge length of the cube in pixels. Drives all 3D math. */
  size?: number;
  className?: string;
}

/**
 * 3D Rubik's-cube-style hero element.
 *
 * Layout: a perspective wrapper holds two stacked transform wrappers so the
 * vertical "bob" animation and the cursor-driven rotation never fight for the
 * `transform` property.
 *
 *   .cube-perspective  (perspective)
 *     └ .cube-bob         (translateY keyframes)
 *         └ .cube-rotation  (rotateX/rotateY from cursor)
 *             └ .cube-shape   (the 6 faces, preserve-3d)
 *
 * On touch devices, CSS swaps the cursor mapping for a slow auto-rotation.
 */
export default function RubiksCube({ size = 360, className }: RubiksCubeProps) {
  const rotationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Skip on touch devices — CSS handles the auto-rotation fallback.
    const isCoarse =
      typeof window !== "undefined" &&
      window.matchMedia("(hover: none), (pointer: coarse)").matches;
    if (isCoarse) return;

    const el = rotationRef.current;
    if (!el) return;

    const apply = (rx: number, ry: number) => {
      el.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
    };

    const onMove = (e: MouseEvent) => {
      const x = e.clientX / window.innerWidth; // 0 → 1
      const y = e.clientY / window.innerHeight; // 0 → 1
      // Wider swing so the cube clearly responds to cursor movement.
      // Mouse X across viewport → rotateY in [-55, +55]
      // Mouse Y across viewport → rotateX in [+35, -35]
      apply(35 - y * 70, -55 + x * 110);
    };

    // Smoothly return to the resting pose when the cursor leaves the page.
    const onLeave = () => apply(15, -20);

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  const half = size / 2;

  const faceBase: React.CSSProperties = {
    width: size,
    height: size,
    top: 0,
    left: 0,
  };

  // 9 labels per face — read left-to-right, top-to-bottom across the
  // 3×3 grid. Order matches the spec the labels were authored against.
  const faceLabels: Record<string, string[]> = {
    top: ["Seattle", "dusk", "verse", "steep", "wandering", "—", "margins", "still", "bitter"],
    left: ["layover", "New York", "draft", "solitude", "♩", "roam", "espresso", "unnamed", "longing"],
    front: ["window seat", "stanza", "Chicago", "◦", "ritual", "fog", "between", "restless", "pour"],
    right: ["departure", "~", "annotate", "Philadelphia", "crema", "ache", "passage", "...", "map"],
    bottom: ["notebook", "arrival", "♪", "grounds", "Dallas", "unwritten", "linger", "third wave", "revise"],
    back: ["suitcase", "∞", "breathe", "overcast", "line break", "Santa Barbara", "steep", "somewhere", "silence"],
  };

  // Each face is positioned by translating its center half the cube edge
  // outward along the appropriate axis, then rotated to face out.
  // 6 faces × 9 tiles = 54 hollow glass tiles.
  const faces: { key: string; style: React.CSSProperties }[] = [
    { key: "front", style: { ...faceBase, transform: `translateZ(${half}px)` } },
    { key: "right", style: { ...faceBase, transform: `rotateY(90deg) translateZ(${half}px)` } },
    { key: "top", style: { ...faceBase, transform: `rotateX(90deg) translateZ(${half}px)` } },
    { key: "back", style: { ...faceBase, transform: `rotateY(180deg) translateZ(${half}px)` } },
    { key: "left", style: { ...faceBase, transform: `rotateY(-90deg) translateZ(${half}px)` } },
    { key: "bottom", style: { ...faceBase, transform: `rotateX(-90deg) translateZ(${half}px)` } },
  ];

  return (
    <div
      className={`cube-perspective pointer-events-none ${className ?? ""}`}
      style={{ width: size, height: size }}
      aria-hidden
    >
      <div className="cube-bob" style={{ width: size, height: size }}>
        <div
          ref={rotationRef}
          className="cube-rotation"
          style={{ width: size, height: size }}
        >
          <div
            className="cube-shape"
            style={{ width: size, height: size }}
          >
            {faces.map((face) => (
              <div key={face.key} className="cube-face" style={face.style}>
                {faceLabels[face.key].map((label, i) => (
                  <div
                    key={i}
                    className="cube-cell flex items-center justify-center px-1"
                  >
                    <span className="select-none break-words text-center font-mono text-[12px] leading-[1.15] tracking-[0.02em] text-bone/80 md:text-[14px]">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
