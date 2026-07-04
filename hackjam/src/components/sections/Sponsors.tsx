"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { siteConfig } from "@/config/site";
import Reveal from "@/components/effects/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";

/* Empty logo slot: pixel corner brackets around a recessed well — reads as
   a reserved bay instead of a dashed placeholder box. */
function LogoSlot({ accent }: { accent: string }) {
  const corner = { background: accent, opacity: 0.8 } as const;
  return (
    <div className="relative flex h-22 w-full items-center justify-center bg-void-deep/70">
      <span aria-hidden className="absolute left-1 top-1 h-2 w-[3px]" style={corner} />
      <span aria-hidden className="absolute left-1 top-1 h-[3px] w-2" style={corner} />
      <span aria-hidden className="absolute right-1 top-1 h-2 w-[3px]" style={corner} />
      <span aria-hidden className="absolute right-1 top-1 h-[3px] w-2" style={corner} />
      <span aria-hidden className="absolute bottom-1 left-1 h-2 w-[3px]" style={corner} />
      <span aria-hidden className="absolute bottom-1 left-1 h-[3px] w-2" style={corner} />
      <span aria-hidden className="absolute bottom-1 right-1 h-2 w-[3px]" style={corner} />
      <span aria-hidden className="absolute bottom-1 right-1 h-[3px] w-2" style={corner} />
      <span className="font-pixel text-[8px] tracking-wider text-star-white/40">
        RESERVED BAY
      </span>
    </div>
  );
}

function SponsorCard({
  tier,
  logo,
  name,
  url,
  index,
}: {
  tier: "gold" | "silver";
  logo: string;
  name: string;
  url: string;
  index: number;
}) {
  const gold = tier === "gold";
  const accent = gold ? "var(--color-star-warm)" : "var(--color-star-white)";
  return (
    <a
      data-reveal
      href={url}
      aria-label={name}
      className={`pixel-card pixel-card-hover group flex flex-col gap-4 p-5 ${
        gold ? "min-h-52 justify-between sm:min-h-60" : "min-h-40 justify-center"
      }`}
      style={
        {
          "--pc-border": gold
            ? "color-mix(in srgb, var(--color-star-warm) 45%, var(--color-void-700))"
            : "var(--color-void-700)",
          "--pc-glow": gold
            ? "color-mix(in srgb, var(--color-star-warm) 30%, transparent)"
            : "color-mix(in srgb, var(--color-star-white) 18%, transparent)",
          "--pc-face": gold
            ? "color-mix(in srgb, var(--color-logo-rose) 18%, var(--color-void-800))"
            : "color-mix(in srgb, var(--color-void-800) 88%, var(--color-sky-zone))",
        } as React.CSSProperties
      }
    >
      <div className="flex items-center justify-between gap-3">
        <span
          className="pixel-chip"
          style={{ color: gold ? "var(--color-star-warm)" : "var(--color-star-white)" }}
        >
          {tier.toUpperCase()}
        </span>
        <span className="font-pixel text-[8px] text-star-white/35">
          SLOT {String(index + 1).padStart(2, "0")}
        </span>
      </div>
      {logo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={logo}
          alt={name}
          className="crisp mx-auto h-20 max-w-full object-contain transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-105"
        />
      ) : (
        <LogoSlot accent={accent} />
      )}
      {gold && (
        <div className="grid grid-cols-8 gap-1" aria-hidden>
          {Array.from({ length: 8 }).map((_, i) => (
            <span
              key={i}
              className="h-1"
              style={{
                background:
                  i % 2 === 0
                    ? "var(--color-star-warm)"
                    : "color-mix(in srgb, var(--color-star-warm) 25%, transparent)",
              }}
            />
          ))}
        </div>
      )}
    </a>
  );
}

/**
 * Sunset zone (spec §6.6–6.7): sponsor bays over the warm band. A pixel
 * sun sinks behind the grid as the section scrolls by.
 */
export default function Sponsors() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const section = sectionRef.current;
      if (!section) return;
      const q = gsap.utils.selector(section);
      const tween = gsap.fromTo(
        q("[data-sun]"),
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
      return () => tween.scrollTrigger?.kill();
    });
    return () => mm.revert();
  }, []);

  const gold = siteConfig.sponsors.filter((s) => s.tier === "gold");
  const silver = siteConfig.sponsors.filter((s) => s.tier === "silver");

  return (
    <section
      ref={sectionRef}
      className="pixel-section-rail relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden px-4 py-32"
      style={{ "--rail-color": "var(--color-star-warm)" } as React.CSSProperties}
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

      <Reveal className="flex w-full flex-col items-center">
        <SectionHeading
          title="SPONSORS"
          sub="The people making the descent possible. Want your logo here?"
          accent="var(--color-star-warm)"
          className="mb-14"
        />

        <div className="flex w-full max-w-5xl flex-col gap-8">
          <div className="grid grid-cols-1 gap-7 md:grid-cols-[1.15fr_0.85fr_1.15fr]">
            {gold.map((s, i) => (
              <SponsorCard
                key={i}
                tier="gold"
                logo={s.logo}
                name={s.name}
                url={s.url}
                index={i}
              />
            ))}
          </div>
          <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
            {silver.map((s, i) => (
              <SponsorCard
                key={i}
                tier="silver"
                logo={s.logo}
                name={s.name}
                url={s.url}
                index={i}
              />
            ))}
          </div>
        </div>

        <a
          data-reveal
          href="mailto:sponsors@hackjam.dev"
          className="pixel-button mt-14 px-6 py-4 font-pixel text-[10px] text-star-warm"
        >
          BECOME A SPONSOR
        </a>
      </Reveal>
    </section>
  );
}
