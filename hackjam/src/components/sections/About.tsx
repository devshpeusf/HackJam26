"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

const stats = [
  { value: "24", label: "HOURS" },
  { value: "FREE", label: "TO ATTEND" },
  { value: "1–4", label: "PER TEAM" },
];

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        const timeline = gsap.timeline({
          defaults: { ease: "power4.out" },
          scrollTrigger: {
            trigger: section,
            start: "top 72%",
            once: true,
          },
        });

        timeline
          .fromTo(
            "[data-about-illustration]",
            { x: -160, scale: 0.82, rotation: -5, autoAlpha: 0 },
            { x: 0, scale: 1, rotation: 0, autoAlpha: 1, duration: 1 },
          )
          .fromTo(
            "[data-about-copy]",
            { x: 72, autoAlpha: 0 },
            {
              x: 0,
              autoAlpha: 1,
              duration: 0.72,
              stagger: 0.1,
            },
            0.18,
          )
          .fromTo(
            "[data-about-stat]",
            { y: 48, scale: 0.94, autoAlpha: 0 },
            {
              y: 0,
              scale: 1,
              autoAlpha: 1,
              duration: 0.64,
              stagger: 0.1,
            },
            0.54,
          );
      }, section);

      return () => ctx.revert();
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="mt-16 flex min-h-[88dvh] scroll-mt-14 flex-col items-center justify-center px-4 py-20 sm:mt-36 sm:py-24"
    >
      <div className="mx-auto grid w-full max-w-[82rem] items-center gap-12 px-4 py-10 sm:px-8 lg:-translate-x-[6vw] lg:grid-cols-[0.9fr_1.1fr] lg:gap-8">
        {/* Both halves anchor toward the centerline so the pair reads as
            one tight, symmetric composition */}
        <div className="relative flex min-h-72 items-start justify-center px-6 pb-10 pt-32 sm:pt-40 lg:-translate-x-16 lg:justify-end lg:px-0 xl:-translate-x-24">
          <div data-about-illustration>
            <div
              className="relative z-10 w-56 sm:w-72"
              style={{ animation: "hj-float 6s ease-in-out infinite" }}
            >
            {/* orbit rings — inset + negative margin keeps them concentric
                with the planet (and floating with it) without transforms,
                which the pulse animation would otherwise clobber */}
            <div
              aria-hidden
              className="absolute inset-0 -m-12 rounded-full border border-accent-cyan/15"
              style={{ animation: "hj-ring-pulse 4s ease-in-out infinite" }}
            />
            <div
              aria-hidden
              className="absolute inset-0 -m-2 rounded-full border border-nebula-core/18"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/gifs/Earth.gif" alt="" className="crisp w-full" />
            {/* mascot riding the planet — flame scraping the top edge */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/mascot/hackjam-mascot-levitate.gif"
                alt=""
                className="crisp absolute -top-28 left-1/2 z-10 w-24 -translate-x-1/2 sm:-top-38 sm:w-32"
                style={{ animation: "hj-float 4s ease-in-out 0.8s infinite" }}
              />
            </div>
          </div>
        </div>

        <div className="flex w-full max-w-2xl flex-col text-left lg:justify-self-start">
          <span data-about-copy className="pixel-chip mb-5 w-fit text-accent-cyan">MISSION BRIEF</span>
          <h2 data-about-copy className="font-pixel text-2xl leading-relaxed text-nebula-core sm:text-4xl">
            WHAT IS HACKJAM?
          </h2>
          <p data-about-copy className="mt-6 max-w-2xl text-base leading-8 text-star-white/84">
            HackJam is a 24-hour hackathon organized by SHPE at the University of
            South Florida, bringing together students from across the region to
            build innovative projects, attend workshops, and connect with
            industry sponsors.
          </p>
          <p data-about-copy className="mt-4 max-w-2xl text-sm leading-7 text-star-white/64">
            First-time hackers and seasoned builders work side by side, with the
            room, food, mentors, and launch window handled for you.
          </p>

          <div className="mt-9 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {stats.map((s, i) => (
              <div
                key={s.label}
                data-about-stat
                className="relative bg-void-deep/65 px-5 py-5"
                style={{
                  boxShadow:
                    "0 -3px 0 0 var(--color-void-700), 0 3px 0 0 var(--color-void-700), -3px 0 0 0 var(--color-void-700), 3px 0 0 0 var(--color-void-700)",
                }}
              >
                <span className="absolute right-3 top-3 font-pixel text-[7px] text-star-white/24">
                  0{i + 1}
                </span>
                <span className="block font-pixel text-base text-accent-cyan sm:text-lg">
                  {s.value}
                </span>
                <span className="mt-3 block font-pixel text-[8px] leading-relaxed text-star-white/58">
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
