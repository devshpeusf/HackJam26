"use client";

import { useState } from "react";
import { siteConfig } from "@/config/site";
import Reveal from "@/components/effects/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";

/** Pixel accordion inspired by a clean stacked FAQ layout. */
export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section
      id="faq"
      className="flex min-h-[70dvh] scroll-mt-14 flex-col items-center justify-center px-4 py-20 sm:py-24"
    >
      <Reveal className="flex w-full flex-col items-center">
        <SectionHeading
          title="FAQ"
          sub="Fast answers before launch day."
          accent="var(--color-logo-coral)"
          className="mb-14"
        />

        <div className="flex w-full max-w-4xl flex-col gap-4 sm:gap-5">
          {siteConfig.faq.map((item, i) => {
            const isOpen = open === i;
            const answerId = `faq-answer-${i}`;

            return (
              <div
                key={item.question}
                data-reveal
                className="bg-void-800/88 transition-colors duration-300 hover:bg-void-700/92"
                style={{
                  boxShadow: isOpen
                    ? "0 -4px 0 0 var(--color-logo-coral), 0 4px 0 0 var(--color-logo-coral), -4px 0 0 0 var(--color-logo-coral), 4px 0 0 0 var(--color-logo-coral)"
                    : "0 -4px 0 0 var(--color-void-700), 0 4px 0 0 var(--color-void-700), -4px 0 0 0 var(--color-void-700), 4px 0 0 0 var(--color-void-700)",
                }}
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  aria-controls={answerId}
                  className="flex min-h-18 w-full cursor-pointer items-center justify-between gap-6 px-5 py-5 text-left sm:min-h-22 sm:px-7"
                >
                  <span className="font-pixel text-[9px] leading-loose text-star-white sm:text-[11px]">
                    {item.question}
                  </span>
                  <span
                    aria-hidden
                    className={`shrink-0 font-pixel text-xl text-accent-cyan transition-transform duration-300 ${
                      isOpen ? "rotate-45" : "rotate-0"
                    }`}
                  >
                    +
                  </span>
                </button>
                <div
                  id={answerId}
                  className="grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                  style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-6 text-sm leading-7 text-star-white/70 sm:px-7 sm:pb-7">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
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
