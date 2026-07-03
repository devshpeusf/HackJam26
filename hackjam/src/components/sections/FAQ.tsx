"use client";

import { useState } from "react";
import { siteConfig } from "@/config/site";

/** Grass zone (spec §6.9): pixel-styled accordion. */
export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="flex min-h-[80dvh] flex-col items-center justify-center px-4 py-32">
      <h2 className="mb-14 text-center font-pixel text-base text-star-white sm:text-lg">
        FAQ
      </h2>

      <div className="flex w-full max-w-2xl flex-col gap-6">
        {siteConfig.faq.map((item, i) => {
          const isOpen = open === i;
          return (
            <div
              key={i}
              className="bg-void-800/90"
              style={{
                boxShadow:
                  "0 -4px 0 0 #1a1530, 0 4px 0 0 #1a1530, -4px 0 0 0 #1a1530, 4px 0 0 0 #1a1530",
              }}
            >
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="flex w-full cursor-pointer items-center justify-between gap-4 px-6 py-5 text-left"
              >
                <span className="font-pixel text-[10px] leading-relaxed text-star-white sm:text-xs">
                  {item.question}
                </span>
                <span
                  aria-hidden
                  className="shrink-0 font-pixel text-xs text-accent-magenta"
                >
                  {isOpen ? "-" : "+"}
                </span>
              </button>
              <div
                className="grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
                style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
              >
                <div className="overflow-hidden">
                  <p className="px-6 pb-6 text-sm leading-relaxed text-star-white/75">
                    {item.answer}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
