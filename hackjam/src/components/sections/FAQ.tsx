"use client";

import { useState } from "react";
import { siteConfig } from "@/config/site";
import Reveal from "@/components/effects/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";

/** Grass zone (spec §6.9): mission-control terminal accordion.
    Aesthetic only — same open/close behavior, no command input. */
export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section
      id="faq"
      className="pixel-section-rail flex min-h-[80dvh] scroll-mt-14 flex-col items-center justify-center px-4 py-32"
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
          {/* Side terminal: system status */}
          <div data-reveal className="terminal-window hidden min-h-88 lg:block">
            <div className="terminal-bar">
              <span className="terminal-dot bg-logo-coral" />
              <span className="terminal-dot bg-star-warm" />
              <span className="terminal-dot bg-accent-cyan" />
              <span className="ml-2 font-pixel text-[8px] tracking-[0.15em] text-star-white/50">
                MISSION-CTL
              </span>
            </div>
            <div className="p-6 text-xs leading-loose">
              <p className="text-star-white/45"># system status</p>
              {(
                [
                  ["uptime", "24:00:00"],
                  ["hackers", "INBOUND"],
                  ["mentors", "ONLINE"],
                  ["coffee", "UNLIMITED"],
                  ["vibes", "NOMINAL"],
                ] as const
              ).map(([k, v]) => (
                <p key={k}>
                  <span className="text-accent-cyan">&gt;</span>{" "}
                  <span className="text-star-white/70">{k}</span>{" "}
                  <span className="text-logo-coral">{v}</span>
                </p>
              ))}
              <p className="mt-6 text-star-white/45">
                # Still need help? Message the organizers and we&apos;ll route
                you to the right station.
              </p>
              <p className="mt-4">
                <span className="text-accent-cyan">hackjam@mission-ctl</span>
                <span className="text-star-white/70">:~$</span>{" "}
                <span className="terminal-cursor" aria-hidden />
              </p>
            </div>
          </div>

          {/* Main terminal: the FAQ accordion */}
          <div data-reveal className="terminal-window">
            <div className="terminal-bar">
              <span className="terminal-dot bg-logo-coral" />
              <span className="terminal-dot bg-star-warm" />
              <span className="terminal-dot bg-accent-cyan" />
              <span className="ml-2 font-pixel text-[8px] tracking-[0.15em] text-star-white/50">
                HACKJAM@MISSION-CTL: ~/FAQ
              </span>
            </div>
            <div className="flex flex-col p-4 sm:p-6">
              {siteConfig.faq.map((item, i) => {
                const isOpen = open === i;
                return (
                  <div key={i}>
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      className="flex w-full cursor-pointer items-start justify-between gap-4 px-2 py-3.5 text-left transition-colors hover:bg-star-white/4"
                    >
                      <span className="text-xs leading-relaxed sm:text-sm">
                        <span className="text-accent-cyan">$</span>{" "}
                        <span className="text-star-white/50">
                          faq --read {String(i + 1).padStart(2, "0")}
                        </span>{" "}
                        <span className="font-bold text-star-white">
                          &quot;{item.question}&quot;
                        </span>
                      </span>
                      <span
                        aria-hidden
                        className="mt-0.5 shrink-0 text-xs text-logo-coral"
                      >
                        {isOpen ? "[-]" : "[+]"}
                      </span>
                    </button>
                    <div
                      className="grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
                      style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                    >
                      <div className="overflow-hidden">
                        <p className="px-2 pb-4 pl-6 text-xs leading-relaxed sm:text-sm">
                          <span className="text-logo-coral">&gt;</span>{" "}
                          <span className="text-star-white/75">
                            {item.answer}
                          </span>
                        </p>
                      </div>
                    </div>
                    {i < siteConfig.faq.length - 1 && (
                      <div className="mx-2 border-t border-dashed border-star-white/10" />
                    )}
                  </div>
                );
              })}
              <p className="mt-2 px-2 text-xs sm:text-sm">
                <span className="text-accent-cyan">hackjam@mission-ctl</span>
                <span className="text-star-white/70">:~/faq$</span>{" "}
                <span className="terminal-cursor" aria-hidden />
              </p>
            </div>
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
