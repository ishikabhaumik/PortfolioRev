"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import SectionLabel from "@/components/ui/SectionLabel";
import { type BlogMeta } from "@/lib/blog";

interface BlogProps {
  posts: BlogMeta[];
}

export default function Blog({ posts }: BlogProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      const cards = el.querySelectorAll<HTMLElement>("[data-blog-card]");
      cards.forEach((card, i) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 32 },
          {
            opacity: 1,
            y: 0,
            duration: 1.1,
            ease: "expo.out",
            scrollTrigger: { trigger: card, start: "top 88%", once: true },
            delay: (i % 2) * 0.1,
          }
        );
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} id="blog" className="relative px-6 py-32 md:px-12 md:py-48">
      <SectionLabel
        index="[06]"
        label="Field Notes"
        title="Essays on craft, motion, and the in-between."
        subtitle="Occasional writing on the practice of building thoughtful, expressive web experiences."
      />

      <div className="grid grid-cols-1 gap-px bg-line md:grid-cols-2">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            data-blog-card
            data-cursor="open"
            className="group relative flex flex-col gap-6 bg-ink p-8 transition-colors duration-700 hover:bg-elevated md:p-10"
          >
            <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.4em] text-bone/40">
              <span>{post.date}</span>
              <span className="text-bone/70">{post.readingTime}</span>
            </div>

            <h3 className="font-serif text-3xl font-light leading-tight text-bone md:text-4xl">
              <span className="bg-gradient-to-r from-bone to-bone bg-[length:0%_1px] bg-left-bottom bg-no-repeat pb-1 transition-[background-size] duration-700 ease-elegant group-hover:bg-[length:100%_1px]">
                {post.title}
              </span>
            </h3>

            <p className="max-w-md text-bone/65 leading-relaxed">{post.excerpt}</p>

            <div className="mt-auto flex items-center justify-between pt-6">
              <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-bone/50">
                {post.category}
              </span>
              <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.4em] text-bone opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                Read essay
                <span aria-hidden>→</span>
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
