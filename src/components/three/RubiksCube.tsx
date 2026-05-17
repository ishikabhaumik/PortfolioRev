"use client";

import { cn } from "@/lib/cn";

interface RubiksCubeProps {
  /** Edge length of the cube in pixels. Drives all 3D math. */
  size?: number;
  className?: string;
  /**
   * If true, omit the depth-glow halo and ground shadow. Used by the
   * mirror-reflection instance below the cube so those layers don't
   * get duplicated underneath.
   */
  bare?: boolean;
}

/**
 * Hollow glass Rubik's-cube hero piece.
 *
 *   .cube-perspective    (perspective + halo + ground shadow)
 *     ├─ .cube-depth-glow   (600×600 radial halo, behind cube)
 *     ├─ .cube-ground-shadow (blurred dark ellipse below cube)
 *     └─ .cube-bob          (gentle 6s translateY breathe)
 *         └─ .cube-spin     (continuous 18s linear rotateY auto-spin)
 *             └─ .cube-tilt (corner-down balance: rotateX(35.26°) rotateZ(45°))
 *                 └─ .cube-shape (preserve-3d, holds 6 faces × 9 tiles)
 *
 * Each wrapper owns one transform layer so the corner tilt, the auto-spin,
 * and the bob never override each other. The cube auto-rotates without
 * cursor or click input.
 */

const SYMBOL_LABELS = new Set([
  "♩",
  "♪",
  "♫",
  "♭",
  "◦",
  "—",
  "~",
  "◎",
  "...",
  "∞",
  "↗️",
  "∘",
]);

const CITY_LABELS = new Set([
  "Seattle",
  "New York",
  "Chicago",
  "Philadelphia",
  "Dallas",
  "Santa Barbara",
]);

export default function RubiksCube({
  size = 360,
  className,
  bare = false,
}: RubiksCubeProps) {
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

  const half = size / 2;

  const faceBase: React.CSSProperties = {
    width: size,
    height: size,
    top: 0,
    left: 0,
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
      {!bare && (
        <>
          {/* Soft halo of depth behind the cube. */}
          <div className="cube-depth-glow" />

          {/* Faint blurred ground shadow — scales with the cube and sits below
              its corner-down bottom vertex so the cube feels grounded. */}
          <div
            className="cube-ground-shadow"
            style={{
              top: `calc(100% + ${Math.round(size * 0.32)}px)`,
              width: `${Math.round(size * 0.7)}px`,
              height: `${Math.round(size * 0.08)}px`,
            }}
          />
        </>
      )}

      <div className="cube-bob" style={{ width: size, height: size }}>
        <div className="cube-spin" style={{ width: size, height: size }}>
          <div className="cube-tilt" style={{ width: size, height: size }}>
            <div className="cube-shape" style={{ width: size, height: size }}>
              {faces.map((face) => (
                <div key={face.key} className="cube-face" style={face.style}>
                  {faceLabels[face.key].map((label, i) => {
                    const isSymbol = SYMBOL_LABELS.has(label);
                    const isCity = CITY_LABELS.has(label);
                    return (
                      <div
                        key={i}
                        className="cube-cell flex items-center justify-center px-1"
                      >
                        <span
                          className={cn(
                            "select-none break-words text-center font-mono text-[12px] leading-[1.15] md:text-[14px]",
                            // +15% brightness: words 0.80 → 0.92,
                            // symbols 0.72 → 0.83. Symbols still recede.
                            isSymbol ? "text-bone/[0.83]" : "text-bone/[0.92]",
                            // Cities get more deliberate spacing.
                            isCity ? "tracking-[0.1em]" : "tracking-[0.02em]"
                          )}
                        >
                          {label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
