"use client";

import { useState } from "react";
import { siteConfig } from "@/config/site";
import Reveal from "@/components/effects/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";

/** Grass zone (spec §6.9): pixel-styled accordion. */
export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section
      className="pixel-section-rail flex min-h-[80dvh] flex-col items-center justify-center px-4 py-32"
      style={{ "--rail-color": "var(--color-logo-coral)" } as React.CSSProperties}
    >
      <Reveal className="flex w-full flex-col items-center">
        <SectionHeading
          title="FAQ"
          sub="Fast answers before launch day."
          accent="var(--color-logo-coral)"
          className="mb-14"
        />

        <div className="grid w-full max-w-5xl grid-cols-1 gap-5 lg:grid-cols-[0.8fr_1.2fr]">
          <div data-reveal className="pixel-card hidden min-h-88 p-7 lg:block">
            <div className="font-pixel text-[10px] leading-loose text-star-white/70">
              TRANSMISSION LOG
            </div>
            <div className="mt-8 grid grid-cols-7 gap-1" aria-hidden>
              {Array.from({ length: 49 }).map((_, i) => (
                <span
                  key={i}
                  className="aspect-square"
                  style={{
                    background:
                      i % 8 === 0 || i % 13 === 0
                        ? "var(--color-logo-coral)"
                        : "color-mix(in srgb, var(--color-star-white) 12%, transparent)",
                  }}
                />
              ))}
            </div>
            <p className="mt-8 text-sm leading-relaxed text-star-white/62">
              Still need help? Message the organizers and we&apos;ll route you to
              the right station.
            </p>
          </div>

          <div className="flex flex-col gap-5">
            {siteConfig.faq.map((item, i) => {
              const isOpen = open === i;
              return (
                <div
                  key={i}
                  data-reveal
                  className="pixel-card"
                  style={
                    {
                      "--pc-border": isOpen
                        ? "color-mix(in srgb, var(--color-logo-coral) 52%, var(--color-void-700))"
                        : "var(--color-void-700)",
                      "--pc-glow":
                        "color-mix(in srgb, var(--color-logo-coral) 18%, transparent)",
                      "--pc-face":
                        "color-mix(in srgb, var(--color-void-800) 86%, var(--color-logo-rose))",
                    } as React.CSSProperties
                  }
                >
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="flex w-full cursor-pointer items-center justify-between gap-4 px-6 py-5 text-left"
                  >
                    <span className="flex items-center gap-4">
                      <span className="font-pixel text-[8px] text-logo-coral">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="font-pixel text-[10px] leading-relaxed text-star-white sm:text-xs">
                        {item.question}
                      </span>
                    </span>
                    <span
                      aria-hidden
                      className="grid h-6 w-6 shrink-0 place-items-center bg-void-deep font-pixel text-xs text-logo-coral"
                    >
                      {isOpen ? "-" : "+"}
                    </span>
                  </button>
                  <div
                    className="grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
                    style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                  >
                    <div className="overflow-hidden">
                      <p className="max-w-2xl px-6 pb-6 pl-[4.5rem] text-sm leading-relaxed text-star-white/75 max-sm:pl-6">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <a
          data-reveal
          href="mailto:team@hackjam.dev"
          className="pixel-button mt-12 px-6 py-4 font-pixel text-[10px] text-logo-coral"
        >
          ASK A QUESTION
        </a>
      </Reveal>
    </section>
  );
}
