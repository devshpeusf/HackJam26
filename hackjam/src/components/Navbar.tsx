"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { siteConfig } from "@/config/site";

const LINKS = [
  { label: "ABOUT", href: "#about" },
  { label: "TRACKS", href: "#tracks" },
  { label: "SPONSORS", href: "#sponsors" },
  { label: "FAQS", href: "#faq" },
] as const;

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={className}
      aria-hidden="true"
    >
      <rect x="2.5" y="2.5" width="19" height="19" rx="5" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="17.3" cy="6.7" r="1.3" fill="currentColor" stroke="none" />
    </svg>
  );
}

function DiscordIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z" />
    </svg>
  );
}

/** Hanging banner placeholder — swap for the official MLH season badge. */
function TempMlhBanner() {
  return (
    <div
      className="flex h-[124px] w-[72px] flex-col items-center justify-start gap-1 self-start bg-void-800 pt-5 text-center font-pixel text-[9px] leading-relaxed text-star-white"
      style={{
        clipPath: "polygon(0 0, 100% 0, 100% 100%, 50% 88%, 0 100%)",
        borderInline: "3px solid rgba(255,255,255,0.25)",
      }}
    >
      TEMP
      <br />
      MLH
    </div>
  );
}

/**
 * Fixed top bar, HackUSF-style alignment: logo left, everything else in one
 * right-aligned row — section links, IG + Discord, APPLY NOW, and the MLH
 * banner hanging flush from the top edge. Hidden during the intro gate,
 * slides in once the gate scrolls away, then stays visible. Collapses to a
 * pixel hamburger + full-screen overlay on small screens.
 */
export default function Navbar() {
  const [hidden, setHidden] = useState(true);
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    // Hidden during the intro gate; revealed once its scrub finishes
    // (LoadingScreen's ScrollTrigger ends half a viewport in) and stays up,
    // gaining its backdrop at the same mark so content under it stays legible.
    const onScroll = () => {
      const y = window.scrollY;
      const pastGate = y >= window.innerHeight * 0.5;
      setHidden(!pastGate);
      setSolid(pastGate);
    };
    onScroll();
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
        className={`fixed inset-x-0 top-0 z-40 transition-[transform,opacity,background-color,box-shadow] duration-300 ease-out ${
          hidden ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100"
        } ${
          solid
            ? "bg-void-deep/80 shadow-[0_3px_0_0_var(--color-void-700)] backdrop-blur-[3px]"
            : ""
        }`}
      >
        <div className="flex h-18 w-full items-center justify-end px-5 sm:px-8">
          {/* logo */}
          <a
            href="#top"
            aria-label="HackJam — back to top"
            className="relative mr-auto h-full w-[8rem] shrink-0 overflow-visible sm:w-[10rem]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo/hackjam26-triangle.png"
              alt=""
              className="crisp absolute left-0 top-5 h-24 w-auto sm:top-4 sm:h-28"
            />
          </a>

          {/* right-aligned row (desktop) */}
          <div className="hidden h-full items-center gap-6 md:flex lg:gap-8">
            {LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="hj-nav-link font-pixel text-[11px] tracking-[0.18em] text-star-white/70"
              >
                {l.label}
              </a>
            ))}
            <a
              href={siteConfig.socials.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-star-white/70 transition-colors hover:text-accent-cyan"
            >
              <InstagramIcon className="h-5 w-5" />
            </a>
            <a
              href={siteConfig.socials.discord}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Discord"
              className="text-star-white/70 transition-colors hover:text-accent-cyan"
            >
              <DiscordIcon className="h-5 w-5" />
            </a>
            <a
              href={siteConfig.registrationUrl}
              className="hj-pixel-btn px-4 py-2 font-pixel text-[11px] tracking-[0.12em]"
            >
              APPLY NOW
            </a>
            <TempMlhBanner />
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
                className="hj-nav-link font-pixel text-sm tracking-[0.2em] text-star-white/80"
              >
                {l.label}
              </motion.a>
            ))}
            <motion.div
              initial={{ opacity: 0, y: reduced ? 0 : 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: reduced ? 0 : 0.06 * LINKS.length,
                duration: 0.3,
              }}
              className="flex items-center gap-8"
            >
              <a
                href={siteConfig.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                onClick={() => setOpen(false)}
                className="text-star-white/80 hover:text-star-white"
              >
                <InstagramIcon className="h-6 w-6" />
              </a>
              <a
                href={siteConfig.socials.discord}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Discord"
                onClick={() => setOpen(false)}
                className="text-star-white/80 hover:text-star-white"
              >
                <DiscordIcon className="h-6 w-6" />
              </a>
            </motion.div>
            <motion.a
              href={siteConfig.registrationUrl}
              onClick={() => setOpen(false)}
              initial={{ opacity: 0, y: reduced ? 0 : 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: reduced ? 0 : 0.06 * (LINKS.length + 1),
                duration: 0.3,
              }}
              className="hj-pixel-btn mt-2 px-7 py-3.5 font-pixel text-xs"
            >
              APPLY NOW
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
