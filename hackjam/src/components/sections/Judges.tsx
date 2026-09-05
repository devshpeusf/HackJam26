"use client";

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { siteConfig, type Judge } from "@/config/site";
import SectionHeading from "@/components/ui/SectionHeading";

function JudgeCard({ judge, index }: { judge: Judge; index: number }) {
  const socials = Object.entries(judge.socials).filter(([, href]) => href);

  return (
    <article
      data-judge-card
      className="pixel-card pixel-card-hover group flex flex-col px-5 py-5 sm:px-6 sm:py-6"
      style={
        {
          "--pc-border": "var(--color-void-700)",
          "--pc-glow":
            "color-mix(in srgb, var(--color-accent-cyan) 22%, transparent)",
          "--pc-face":
            "color-mix(in srgb, var(--color-grass) 14%, var(--color-void-800))",
        } as React.CSSProperties
      }
    >
      <div className="mb-4 flex items-start justify-between gap-4">
        <span className="pixel-chip text-accent-cyan">
          JUDGE {String(index + 1).padStart(2, "0")}
        </span>
        <span className="pt-1 font-pixel text-[8px] tracking-[0.12em] text-star-white/35">
          {judge.tba ? "INBOUND" : "LANDED"}
        </span>
      </div>

      <div className="flex flex-col items-center gap-4 text-center">
        <div
          className="shrink-0 p-1 transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:-rotate-2 group-hover:scale-105"
          style={{
            boxShadow:
              "0 -3px 0 0 var(--color-accent-cyan), 0 3px 0 0 var(--color-void-700), -3px 0 0 0 var(--color-void-700), 3px 0 0 0 var(--color-accent-cyan)",
          }}
        >
          {judge.photo ? (
            <Image
              src={judge.photo}
              alt={judge.name}
              width={192}
              height={192}
              sizes="(min-width: 640px) 192px, 176px"
              className="crisp h-44 w-44 object-cover transition-[filter] duration-500 grayscale group-hover:grayscale-0 sm:h-48 sm:w-48"
            />
          ) : (
            <div className="relative flex h-44 w-44 flex-col items-center justify-center gap-3 overflow-hidden bg-void-700 sm:h-48 sm:w-48">
              <span
                aria-hidden
                className="absolute inset-0 opacity-[0.08]"
                style={{
                  backgroundImage:
                    "linear-gradient(var(--color-star-white) 1px, transparent 1px), linear-gradient(90deg, var(--color-star-white) 1px, transparent 1px)",
                  backgroundSize: "12px 12px",
                }}
              />
              <span className="relative font-pixel text-5xl text-accent-cyan/25 transition-colors duration-300 group-hover:text-accent-cyan">
                ?
              </span>
              <span className="relative font-pixel text-[8px] tracking-[0.22em] text-star-white/40">
                {judge.role.toUpperCase()}
              </span>
            </div>
          )}
        </div>

        <div className="min-w-0">
          <h3 className="font-pixel text-[10px] leading-[1.8] text-star-white sm:text-[11px]">
            {judge.name.toUpperCase()}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-accent-cyan">
            {judge.role}
          </p>
          <p className="mt-1 font-pixel text-[9px] uppercase leading-relaxed text-accent-magenta">
            JUDGING PANEL
          </p>
        </div>

        {socials.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-3">
            {socials.map(([network, href]) => (
              <a
                key={network}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="pixel-chip text-star-white/60 transition-colors hover:text-accent-magenta focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-star-white"
                aria-label={`${judge.name} ${network}`}
              >
                {network.toUpperCase()}
              </a>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

/**
 * Sunset zone (spec §6.6–6.7): judge landing cards over the warm band. A
 * pixel sun sinks behind the content as the section scrolls by.
 */
export default function Judges() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        const cards = Array.from(
          section.querySelectorAll<HTMLElement>("[data-judge-card-motion]"),
        );

        gsap.fromTo(
          "[data-sun]",
          { yPercent: -20 },
          {
            yPercent: 55,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
          },
        );

        gsap
          .timeline({
            defaults: { ease: "power4.out" },
            scrollTrigger: {
              trigger: section,
              start: "top 78%",
              once: true,
            },
          })
          .fromTo(
            "[data-judges-heading]",
            { y: 58, scale: 0.94, autoAlpha: 0 },
            { y: 0, scale: 1, autoAlpha: 1, duration: 0.86 },
          )
          .fromTo(
            cards,
            {
              y: 90,
              scale: 0.88,
              rotation: (i) => ((i % 3) - 1) * 2,
              autoAlpha: 0,
            },
            {
              y: 0,
              scale: 1,
              rotation: 0,
              autoAlpha: 1,
              duration: 0.9,
              stagger: 0.09,
              onComplete: () =>
                gsap.set(cards, { clearProps: "transform" }),
            },
            0.2,
          );
      }, section);

      return () => ctx.revert();
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      id="judges"
      ref={sectionRef}
      className="relative flex min-h-[82dvh] scroll-mt-14 flex-col items-center justify-center overflow-hidden px-4 py-20 sm:py-24"
    >
      {/* The setting pixel sun — behind the content, sinking on scroll */}
      <div
        data-sun
        aria-hidden
        className="absolute left-1/2 top-[30%] -z-10 h-64 w-64 -translate-x-1/2 will-change-transform sm:h-80 sm:w-80"
        style={{
          background:
            "radial-gradient(circle, #ffd9a0 0%, #e9743a 45%, rgba(233,116,58,0.4) 65%, transparent 72%)",
          imageRendering: "pixelated",
        }}
      />

      <div className="flex w-full flex-col items-center">
        <div data-judges-heading>
          <SectionHeading
            title="JUDGES"
            sub="The crew scoring your final descent. Panel announced soon."
            accent="var(--color-star-warm)"
            className="mb-14"
          />
        </div>

        <div
          className="grid w-full max-w-6xl grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3 sm:gap-8"
        >
          {siteConfig.judges.map((judge, i) => (
            <div
              key={`${judge.name}-${judge.role}`}
              data-judge-card-motion
              className="will-change-transform"
            >
              <JudgeCard judge={judge} index={i} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
