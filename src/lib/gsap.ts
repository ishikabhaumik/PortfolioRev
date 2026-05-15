"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Draggable } from "gsap/Draggable";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, Draggable);
  gsap.defaults({
    ease: "expo.out",
    duration: 1,
  });
}

export { gsap, ScrollTrigger, Draggable };
