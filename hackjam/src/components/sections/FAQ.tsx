"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { siteConfig } from "@/config/site";
import SectionHeading from "@/components/ui/SectionHeading";
import PixelButton from "@/components/ui/PixelButton";

/** FAQ accordion dressed in the same landing-card chrome as the crew cards. */
export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        const cards = Array.from(
          section.querySelectorAll<HTMLElement>("[data-faq-card-motion]"),
        );
        const cta = section.querySelector<HTMLElement>("[data-faq-cta]");
        const timeline = gsap.timeline({
          defaults: { ease: "power4.out" },
          scrollTrigger: {
            trigger: section,
            start: "top 78%",
            once: true,
          },
        });

        timeline
          .fromTo(
            "[data-faq-heading]",
            { y: 58, scale: 0.94, autoAlpha: 0 },
            { y: 0, scale: 1, autoAlpha: 1, duration: 0.86 },
          )
          .fromTo(
            cards,
            {
              x: (i) => (i % 2 === 0 ? -76 : 76),
              y: 20,
              rotation: (i) => (i % 2 === 0 ? -1.2 : 1.2),
              autoAlpha: 0,
            },
            {
              x: 0,
              y: 0,
              rotation: 0,
              autoAlpha: 1,
              duration: 0.82,
              stagger: 0.1,
              onComplete: () =>
                gsap.set(cards, { clearProps: "transform" }),
            },
            0.18,
          )
          .fromTo(
            cta,
            { y: 30, autoAlpha: 0 },
            {
              y: 0,
              autoAlpha: 1,
              duration: 0.62,
              onComplete: () => {
                if (cta) gsap.set(cta, { clearProps: "transform" });
              },
            },
            "-=0.34",
          );
      }, section);

      return () => ctx.revert();
    });

    return () => mm.revert();
  }, []);

  useLayoutEffect(() => {
    if (
      open === null ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const answer = sectionRef.current?.querySelector<HTMLElement>(
      `[data-faq-card="${open}"] [data-faq-answer]`,
    );
    if (!answer) return;

    const tween = gsap.fromTo(
      answer,
      { y: -12, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.48, ease: "power4.out", delay: 0.06 },
    );
    return () => {
      tween.revert();
    };
  }, [open]);

  return (
    <section
      ref={sectionRef}
      id="faq"
      className="flex min-h-[70dvh] scroll-mt-14 flex-col items-center justify-center px-4 py-20 sm:py-24"
    >
      <div className="flex w-full flex-col items-center">
        <div data-faq-heading>
          <SectionHeading
            title="FAQ"
            sub="Fast answers before launch day."
            accent="var(--color-accent-cyan)"
            className="mb-14"
          />
        </div>

        <div className="flex w-full max-w-5xl flex-col gap-6 sm:gap-7">
          {siteConfig.faq.map((item, i) => {
            const isOpen = open === i;
            const answerId = `faq-answer-${i}`;

            return (
              <div
                key={item.question}
                data-faq-card-motion
                className="will-change-transform"
              >
                <div
                  data-faq-card={i}
                  className="pixel-card pixel-card-hover group"
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
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    aria-controls={answerId}
                    className="flex w-full cursor-pointer flex-col gap-6 px-5 pt-5 pb-6 text-left focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-star-white sm:px-7 sm:pt-6 sm:pb-7"
                  >
                    <span className="flex w-full items-start justify-between gap-6">
                      <span className="pixel-chip text-accent-cyan">
                        Q {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="pt-1 font-pixel text-[8px] tracking-[0.12em] text-star-white/35">
                        {isOpen ? "FILE OPEN" : "STANDBY"}
                      </span>
                    </span>

                    <span className="flex w-full items-center justify-between gap-6">
                      <span className="font-pixel text-[10px] leading-[1.9] text-star-white sm:text-[12px]">
                        {item.question.toUpperCase()}
                      </span>
                      <span
                        aria-hidden
                        className={`shrink-0 font-pixel text-xl text-accent-magenta transition-transform duration-300 ${
                          isOpen ? "rotate-45" : "rotate-0"
                        }`}
                      >
                        +
                      </span>
                    </span>
                  </button>
                  <div
                    id={answerId}
                    className="grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                    style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                  >
                    <div className="overflow-hidden">
                      <div data-faq-answer className="px-5 pb-7 sm:px-7 sm:pb-8">
                        <div
                          aria-hidden
                          className="mb-6 h-[3px] w-full bg-void-700"
                        >
                          <span className="block h-full w-20 bg-accent-cyan" />
                        </div>
                        <p className="max-w-[70ch] text-sm leading-7 text-star-white/70 sm:text-base sm:leading-8">
                          {item.answer}
                        </p>
                        <span className="mt-5 block font-pixel text-[8px] tracking-[0.2em] text-accent-magenta">
                          MISSION CONTROL
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <PixelButton
          data-faq-cta
          href="mailto:team@hackjam.dev"
          variant="outline"
          size="md"
          className="mt-14 text-accent-magenta"
        >
          Ask a Question
        </PixelButton>
      </div>
    </section>
  );
}
