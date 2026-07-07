"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

/**
 * Scroll-reveal wrapper: children marked [data-reveal] rise + fade in
 * (staggered) the first time the wrapper enters the viewport. Children
 * stay server-rendered; this only animates them. Reduced motion renders
 * everything static — elements are never hidden in that branch.
 */
export default function Reveal({
  children,
  className,
  stagger = 0.08,
  start = "top 80%",
}: {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  start?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const el = ref.current;
      if (!el) return;
      const targets = el.querySelectorAll("[data-reveal]");
      gsap.fromTo(
        targets.length ? targets : el,
        { y: 28, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.8,
          ease: "power3.out",
          stagger,
          scrollTrigger: { trigger: el, start, once: true },
        },
      );
    });
    return () => mm.revert();
  }, [stagger, start]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
