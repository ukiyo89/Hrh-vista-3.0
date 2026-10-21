"use client";

import { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotionPreference } from "@/lib/useReducedMotionPreference";

/** Keep scroll geometry in sync after the intro and responsive scene changes.
 * Each scene owns its own transforms, including the hero's exit timeline.
 */
export function HomeMotion() {
  const reduced = useReducedMotionPreference();
  useEffect(() => {
    if (reduced) return;
    const main = document.querySelector("#main-content");
    if (!main) return;
    let frame = 0;
    const refresh = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => ScrollTrigger.refresh());
    };
    window.addEventListener("hr-vista:entered", refresh);
    // Refresh when fonts or decoded scene media change the document geometry.
    const observer = new ResizeObserver(refresh);
    observer.observe(main);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener("hr-vista:entered", refresh);
    };
  }, [reduced]);
  return null;
}
