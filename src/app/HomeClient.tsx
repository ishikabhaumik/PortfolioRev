"use client";

import { useCallback, useState } from "react";
import dynamic from "next/dynamic";
import Hero from "@/components/sections/Hero";
import MeetMe from "@/components/sections/MeetMe";
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

const LogoMorph = dynamic(() => import("@/components/preloader/LogoMorph"), {
  ssr: false,
});

interface HomeClientProps {
  posts: BlogMeta[];
}

export default function HomeClient({ posts: _posts }: HomeClientProps) {
  const [revealed, setRevealed] = useState(false);
  const handleRevealed = useCallback(() => setRevealed(true), []);

  return (
    <>
      <LogoMorph onComplete={handleRevealed} />
      <FullscreenNav />

      <main>
        <Hero startReveal={revealed} />
        <MeetMe />
        <Work />
        <About />
        <Skills />
        <LeetCode />
        <Experience />
        <Personal />
        <Lessons />
        <Contact />
      </main>
    </>
  );
}
