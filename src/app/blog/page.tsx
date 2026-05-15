import Link from "next/link";
import { getAllPosts } from "@/lib/blog";

export const metadata = {
  title: "Field Notes",
  description: "Essays on craft, motion, and the in-between by Ishika Bhaumik.",
};

export default function BlogIndex() {
  const posts = getAllPosts();
  return (
    <main className="min-h-screen px-6 pt-32 pb-24 md:px-12 md:pt-40">
      <Link
        href="/"
        data-cursor="open"
        className="mb-16 inline-flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.4em] text-bone/60 hover:text-bone"
      >
        ← Back to portfolio
      </Link>

      <div className="mb-16 flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.4em] text-bone/55">
        <span>[05]</span>
        <span className="block h-px w-16 bg-bone/30" />
        <span>Field Notes</span>
      </div>

      <h1 className="mb-20 max-w-3xl font-serif text-display-md font-light text-bone">
        Essays on craft, motion, and the in-between.
      </h1>

      <div className="flex flex-col border-t border-line">
        {posts.length === 0 && (
          <p className="py-16 text-bone/50">No essays yet — first piece on its way.</p>
        )}
        {posts.map((post, i) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            data-cursor="open"
            className="group flex flex-col gap-4 border-b border-line py-10 md:flex-row md:items-baseline md:gap-10"
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-bone/55">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="flex-1">
              <h2 className="font-serif text-3xl font-light text-bone transition-transform duration-500 ease-elegant group-hover:translate-x-2 md:text-5xl">
                {post.title}
              </h2>
              <p className="mt-3 max-w-xl text-bone/65">{post.excerpt}</p>
            </div>
            <div className="flex shrink-0 flex-col gap-1 md:items-end md:text-right">
              <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-bone/45">
                {post.date}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-bone/60">
                {post.readingTime}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
