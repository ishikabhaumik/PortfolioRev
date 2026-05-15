import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllPosts, getPostBySlug } from "@/lib/blog";

interface PostPageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: PostPageProps) {
  const post = getPostBySlug(params.slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
  };
}

const mdxComponents = {
  h1: (props: any) => (
    <h1 className="mt-12 mb-6 font-serif text-4xl font-light text-bone md:text-5xl" {...props} />
  ),
  h2: (props: any) => (
    <h2 className="mt-16 mb-4 font-serif text-3xl font-light text-bone md:text-4xl" {...props} />
  ),
  h3: (props: any) => (
    <h3 className="mt-10 mb-3 font-serif text-2xl font-light text-bone" {...props} />
  ),
  p: (props: any) => (
    <p className="my-6 text-lg leading-relaxed text-bone/80" {...props} />
  ),
  a: (props: any) => (
    <a
      className="text-bone underline decoration-bone/40 underline-offset-4 transition-colors hover:decoration-bone"
      data-cursor="open"
      {...props}
    />
  ),
  blockquote: (props: any) => (
    <blockquote
      className="my-10 border-l-2 border-bone/40 pl-6 font-serif text-2xl italic leading-snug text-bone/85 md:text-3xl"
      {...props}
    />
  ),
  ul: (props: any) => (
    <ul className="my-6 ml-6 list-disc space-y-2 text-bone/80 marker:text-bone/50" {...props} />
  ),
  ol: (props: any) => (
    <ol className="my-6 ml-6 list-decimal space-y-2 text-bone/80 marker:text-bone/50" {...props} />
  ),
  code: (props: any) => (
    <code
      className="rounded bg-elevated px-1.5 py-0.5 font-mono text-sm text-bone"
      {...props}
    />
  ),
  pre: (props: any) => (
    <pre
      className="my-8 overflow-x-auto rounded-lg border border-line bg-elevated p-6 font-mono text-sm text-bone/85"
      {...props}
    />
  ),
  hr: () => <div className="hairline my-12" />,
};

export default function PostPage({ params }: PostPageProps) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();

  return (
    <main className="mx-auto min-h-screen max-w-3xl px-6 pt-32 pb-32 md:px-8 md:pt-40">
      <Link
        href="/blog"
        data-cursor="open"
        className="mb-16 inline-flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.4em] text-bone/60 hover:text-bone"
      >
        ← All field notes
      </Link>

      <div className="mb-8 flex flex-wrap items-center gap-6 font-mono text-[10px] uppercase tracking-[0.4em] text-bone/45">
        <span className="text-bone">{post.category}</span>
        <span>{post.date}</span>
        <span>{post.readingTime}</span>
      </div>

      <h1 className="mb-12 font-serif text-4xl font-light leading-[1.1] text-bone md:text-6xl">
        {post.title}
      </h1>

      <article className="prose-invert">
        <MDXRemote source={post.content} components={mdxComponents} />
      </article>

      <div className="hairline my-20" />

      <Link
        href="/"
        data-cursor="open"
        className="inline-flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.4em] text-bone/60 hover:text-bone"
      >
        ← Back to portfolio
      </Link>
    </main>
  );
}
