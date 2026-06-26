"use client";

import { useCallback, useEffect, useState } from "react";
import LogoMorph from "@/components/preloader/LogoMorph";
import Hero from "@/components/sections/Hero";
import FullscreenNav from "@/components/nav/FullscreenNav";
import About from "@/components/sections/About";
import Skills from "@/components/sections/Skills";
import LeetCode from "@/components/sections/LeetCode";
import Experience from "@/components/sections/Experience";
import Work from "@/components/sections/Work";
import Personal from "@/components/sections/Personal";
import Lessons from "@/components/sections/Lessons";
import Contact from "@/components/sections/Contact";
import { type BlogMeta } from "@/lib/blog";
import { cn } from "@/lib/cn";

interface HomeClientProps {
  posts: BlogMeta[];
}

export default function HomeClient({ posts: _posts }: HomeClientProps) {
  const [revealed, setRevealed] = useState(false);
  const handleRevealed = useCallback(() => setRevealed(true), []);

  useEffect(() => {
    if (revealed) {
      document.documentElement.classList.remove("preload-pending");
    }
  }, [revealed]);

  return (
    <>
      <LogoMorph onComplete={handleRevealed} />

      <div
        id="site-content"
        className={cn(!revealed && "site-shell--preloading")}
        aria-hidden={!revealed}
      >
        <FullscreenNav />

        <main>
          <Hero startReveal={revealed} />
          <Work />
          <About />
          <Skills />
          <LeetCode />
          <Experience />
          <Personal />
          <Lessons />
          <Contact />
        </main>
      </div>
    </>
  );
}
