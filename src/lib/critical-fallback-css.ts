/**
 * Embedded in `<RootLayout>` so base design tokens survive if `/_next/static/css/*` returns 404
 * (broken `.next` under sync tools, zombie dev tabs, interrupted compiles).
 * Processed Tailwind bundles still preferred when they load normally.
 */
export const CRITICAL_FALLBACK_CSS = `
:root {
  --ink: #0a0a0a;
  --surface: #101010;
  --elevated: #161616;
  --bone: #eceae4;
  --bone-dim: #9b9994;
  --ash: #6f6f6d;
  --line: #1b1b1b;
  --accent: #f5f2ec;
}

*, *::before, *::after {
  box-sizing: border-box;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

html {
  color-scheme: dark;
  background: var(--ink);
  color: var(--bone);
  text-rendering: geometricPrecision;
}

body {
  margin: 0;
  padding: 0;
  overflow-x: hidden;
  min-height: 100vh;
  background: var(--ink);
  color: var(--bone);
  font-family:
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    sans-serif;
  line-height: 1.5;
}

::selection {
  background: var(--bone);
  color: var(--ink);
}

.focus-ring:focus-visible,
:focus-visible {
  outline: 1px solid var(--bone);
  outline-offset: 4px;
}

button,
a {
  -webkit-tap-highlight-color: transparent;
}

.grain {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 1;
  opacity: 0.025;
  mix-blend-mode: overlay;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.95  0 0 0 0 0.95  0 0 0 0 0.95  0 0 0 0.9 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>");
}

.vignette::after {
  content: "";
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 1;
  background: radial-gradient(
    ellipse at center,
    transparent 60%,
    rgba(0, 0, 0, 0.2) 100%
  );
}

@media (hover: hover) and (pointer: fine) {
  html.has-cursor,
  html.has-cursor * {
    cursor: none !important;
  }
}
`;
