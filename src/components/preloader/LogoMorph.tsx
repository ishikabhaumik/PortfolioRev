"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface LogoMorphProps {
  onComplete?: () => void;
}

/** Entire block begins exit fade at this time (ms from mount). */
const EXIT_START_MS = 2750;
/** Hard stop if exit animation / `animationend` never fires. */
const EXIT_FALLBACK_MS = 3740;

/** Latin spelling — explicit ASCII capital I + “shika” (English only). */
const ISHIKA_LATIN = `\u0049shika`;

/**
 * Ten distinct typographies (not ten copies of the same Latin letters).
 * Each line is “Ishika” in a different script or writing system.
 */
const ISHIKA_LANGUAGES = [
  { lang: "English", code: "en", text: ISHIKA_LATIN, dir: "ltr" as const },
  { lang: "Japanese", code: "ja", text: "イシカ", dir: "ltr" as const },
  { lang: "Korean", code: "ko", text: "이시카", dir: "ltr" as const },
  { lang: "Chinese", code: "zh-Hans", text: "伊希卡", dir: "ltr" as const },
  { lang: "Arabic", code: "ar", text: "إيشيكا", dir: "rtl" as const },
  { lang: "Russian", code: "ru", text: "Ишика", dir: "ltr" as const },
  { lang: "Greek", code: "el", text: "Ισίκα", dir: "ltr" as const },
  { lang: "Thai", code: "th", text: "อิชิกา", dir: "ltr" as const },
  { lang: "Hebrew", code: "he", text: "אישיקה", dir: "rtl" as const },
  { lang: "Bengali", code: "bn", text: "ইশিকা", dir: "ltr" as const },
] as const;

const NAME_STEP_MS = Math.floor(EXIT_START_MS / ISHIKA_LANGUAGES.length);

export default function LogoMorph({ onComplete }: LogoMorphProps) {
  const [exiting, setExiting] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [nameIndex, setNameIndex] = useState(0);
  const [loadPct, setLoadPct] = useState(0);
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

  useEffect(() => {
    const id = window.setInterval(() => {
      setNameIndex((i) =>
        i < ISHIKA_LANGUAGES.length - 1 ? i + 1 : i,
      );
    }, NAME_STEP_MS);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const start = performance.now();
    const DURATION_MS = EXIT_START_MS * 0.92;
    let rafId = 0;

    const loop = (now: number) => {
      const elapsed = now - start;
      const t = Math.min(1, elapsed / DURATION_MS);
      const pct = t >= 1 ? 100 : Math.floor(t * 100);
      setLoadPct(pct);
      if (t < 1) rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, []);

  const handleExitEnd = (e: React.AnimationEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) return;
    if (!exiting) return;
    if (e.animationName !== "preloadShellOut") return;
    finish();
  };

  if (hidden) return null;

  const current = ISHIKA_LANGUAGES[nameIndex];
  /** Only English uses Latin letters + per-glyph layout; all other entries use distinct scripts. */
  const isEnglishLatin = current.code === "en";

  return (
    <div
      className={`preload-shell fixed inset-0 z-[200] flex items-center justify-center bg-[#0e0e0e] px-8 pointer-events-none ${exiting ? "preload-shell--exit" : ""}`}
      onAnimationEnd={handleExitEnd}
      aria-hidden
    >
      <div className="preload-name-stage flex w-full max-w-[min(28rem,92vw)] flex-col items-center text-center">
        <div className="preload-name-block">
          <p
            key={current.lang}
            className={
              isEnglishLatin
                ? "preload-name-script preload-name-script--latin font-sans font-light text-[#ede8df] preload-name-enter"
                : "preload-name-script preload-name-script--i18n font-sans font-light text-[#ede8df] preload-name-enter"
            }
            lang={current.code}
            dir={current.dir}
            spellCheck={false}
          >
            {isEnglishLatin
              ? current.text.split("").map((ch, i) => (
                  <span
                    key={`${current.code}-${i}`}
                    className={
                      i === 0
                        ? "preload-name-letter inline-block font-semibold"
                        : "preload-name-letter inline-block font-light"
                    }
                  >
                    {ch}
                  </span>
                ))
              : current.text}
          </p>
          <p className="mt-2 font-montserrat text-[10px] font-light uppercase tracking-[0.35em] text-[#ede8df]/40">
            {current.lang}
          </p>
        </div>

        <div className="preload-counter mt-8 font-mono text-[11px] tabular-nums tracking-[0.4em] text-[#ede8df]/45 md:text-xs">
          {String(loadPct).padStart(3, "0")}
        </div>
      </div>
    </div>
  );
}
