"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { siteConfig } from "@/config/site";

const LINKS = [
  { label: "ABOUT", href: "#about" },
  { label: "TRACKS", href: "#tracks" },
  { label: "FAQS", href: "#faq" },
  { label: "SPONSORS", href: "#sponsors" },
] as const;

/**
 * Fixed top bar: logo left, section links centered, APPLY as the highlighted
 * action. Fully transparent; visible over the hero, fades and slides away as
 * you scroll down, and returns the moment you scroll up — anywhere on the
 * page. Collapses to a pixel hamburger + full-screen overlay on small
 * screens.
 */
export default function Navbar() {
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      // Down past the hero's top stretch → hide; any upward scroll → show.
      if (y > lastY && y > 80) setHidden(true);
      else if (y < lastY) setHidden(false);
      lastY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Menu overlay: Escape closes, body scroll locks while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <nav
        aria-label="Primary"
        className={`fixed inset-x-0 top-0 z-40 transition-[transform,opacity] duration-300 ease-out ${
          hidden ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100"
        }`}
      >
        <div className="relative mx-auto flex h-14 max-w-7xl items-center px-4 sm:px-6">
          {/* logo */}
          <a href="#top" aria-label="HackJam — back to top" className="shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/gifs/hackjam_logo.gif"
              alt=""
              className="crisp h-7 w-auto"
            />
          </a>

          {/* centered links (desktop) */}
          <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-7 md:flex lg:gap-10">
            {LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="font-pixel text-[11px] tracking-[0.18em] text-star-white/70 transition-colors hover:text-star-white"
              >
                {l.label}
              </a>
            ))}
            <a
              href={siteConfig.registrationUrl}
              className="bg-accent-magenta px-4 py-2 font-pixel text-[11px] tracking-[0.12em] text-void-deep transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:scale-105"
              style={{
                boxShadow:
                  "0 -3px 0 0 #ff2e97, 0 3px 0 0 #ff2e97, -3px 0 0 0 #ff2e97, 3px 0 0 0 #ff2e97",
              }}
            >
              APPLY
            </a>
          </div>

          {/* hamburger (mobile) */}
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="ml-auto flex h-9 w-9 cursor-pointer flex-col items-center justify-center gap-1.5 bg-void-deep/70 md:hidden"
            style={{
              boxShadow:
                "0 -3px 0 0 var(--color-void-700), 0 3px 0 0 var(--color-void-700), -3px 0 0 0 var(--color-void-700), 3px 0 0 0 var(--color-void-700)",
            }}
          >
            {[0, 1, 2].map((i) => (
              <span key={i} className="block h-0.5 w-4 bg-star-white" />
            ))}
          </button>
        </div>
      </nav>

      {/* mobile overlay menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.25 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-9 bg-void-deep/95 backdrop-blur-[6px] md:hidden"
          >
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 grid h-9 w-9 cursor-pointer place-items-center font-pixel text-sm text-star-white/60 hover:text-star-white"
            >
              ✕
            </button>
            {LINKS.map((l, i) => (
              <motion.a
                key={l.label}
                href={l.href}
                onClick={() => setOpen(false)}
                initial={{ opacity: 0, y: reduced ? 0 : 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: reduced ? 0 : 0.06 * i, duration: 0.3 }}
                className="font-pixel text-sm tracking-[0.2em] text-star-white/80 transition-colors hover:text-star-white"
              >
                {l.label}
              </motion.a>
            ))}
            <motion.a
              href={siteConfig.registrationUrl}
              onClick={() => setOpen(false)}
              initial={{ opacity: 0, y: reduced ? 0 : 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: reduced ? 0 : 0.06 * LINKS.length, duration: 0.3 }}
              className="mt-2 bg-accent-magenta px-7 py-3.5 font-pixel text-xs text-void-deep"
              style={{
                boxShadow:
                  "0 -4px 0 0 #ff2e97, 0 4px 0 0 #ff2e97, -4px 0 0 0 #ff2e97, 4px 0 0 0 #ff2e97",
              }}
            >
              APPLY
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
