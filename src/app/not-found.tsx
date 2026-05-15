import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center px-6">
      <div className="flex flex-col items-center gap-8 text-center">
        <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-bone/55">
          [404] · Not found
        </span>
        <h1 className="font-serif text-display-md font-light text-bone">
          The page you&apos;re looking for
          <br />
          <span className="italic">isn&apos;t here.</span>
        </h1>
        <Link
          href="/"
          data-cursor="open"
          className="font-mono text-xs uppercase tracking-[0.3em] text-bone underline decoration-bone/40 underline-offset-8 hover:decoration-bone"
        >
          ← Return home
        </Link>
      </div>
    </main>
  );
}
