"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface LogoMorphProps {
  onComplete?: () => void;
}

/** Entire block begins exit fade at this time (ms from mount). */
const EXIT_START_MS = 2500;
/** Hard stop if exit animation / `animationend` never fires. */
const EXIT_FALLBACK_MS = 3400;

export default function LogoMorph({ onComplete }: LogoMorphProps) {
  const [exiting, setExiting] = useState(false);
  const [hidden, setHidden] = useState(false);
  const onCompleteRef = useRef(onComplete);
  const finishedRef = useRef(false);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const finish = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    setHidden(true);
    onCompleteRef.current?.();
  }, []);

  useEffect(() => {
    const tExit = window.setTimeout(() => setExiting(true), EXIT_START_MS);
    const tFallback = window.setTimeout(() => finish(), EXIT_FALLBACK_MS);
    return () => {
      window.clearTimeout(tExit);
      window.clearTimeout(tFallback);
    };
  }, [finish]);

  const handleExitEnd = (e: React.AnimationEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) return;
    if (!exiting) return;
    if (e.animationName !== "preloadShellOut") return;
    finish();
  };

  if (hidden) return null;

  return (
    <div
      className={`preload-shell fixed inset-0 z-[200] flex items-center justify-center bg-[#0e0e0e] px-8 pointer-events-none ${exiting ? "preload-shell--exit" : ""}`}
      onAnimationEnd={handleExitEnd}
      aria-hidden
    >
      <div className="w-full max-w-[min(22rem,88vw)]">
        <div className="preload-monogram-row">
          <span
            className="preload-i-char font-serif text-[168px] font-light leading-none tracking-[-0.02em]"
            aria-hidden
          >
            I
          </span>
          <div className="preload-lines flex flex-col gap-0.5 font-montserrat text-[12px] font-light uppercase leading-tight tracking-[0.4em] text-[#ede8df]">
            <span>SHIKA</span>
            <span className="font-extralight text-[#777777]">BHAUMIK</span>
          </div>
        </div>
        <div className="preload-rule" aria-hidden />
        <p className="preload-tag font-montserrat text-[12px] font-light uppercase tracking-[0.4em]">
          Coding · writing · music
        </p>
      </div>
    </div>
  );
}
