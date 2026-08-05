"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { siteConfig } from "@/config/site";
import MlhTrustBadge from "@/components/MlhTrustBadge";

const LINKS = [
  { label: "ABOUT", href: "#about" },
  { label: "TRACKS", href: "#tracks" },
  { label: "SPONSORS", href: "#sponsors" },
  { label: "JUDGES", href: "#judges" },
  { label: "TEAM", href: "#team" },
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

/**
 * Fixed top bar, HackUSF-style alignment: logo left, everything else in one
 * right-aligned row — section links, IG + Discord, APPLY NOW, and the MLH
 * banner hanging flush from the top edge. Hidden during the intro gate;
 * past it, stays pinned on screen regardless of scroll direction.
 * Collapses to a pixel hamburger + full-screen overlay on small screens.
 */
export default function Navbar() {
  const [hidden, setHidden] = useState(true);
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");
  const lockedTarget = useRef<string | null>(null);
  const lockTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reduced = useReducedMotion();

  const selectSection = (href: string) => {
    setActive(href);
    lockedTarget.current = href;
    if (lockTimer.current) clearTimeout(lockTimer.current);
    lockTimer.current = setTimeout(() => {
      lockedTarget.current = null;
      lockTimer.current = null;
    }, 2500);
  };

  useEffect(() => {
    // The intro gate owns the reveal — this used to key off scroll position,
    // which only worked because the old LoadingScreen padded the page with a
    // 150vh runway. Once the gate hands off, the bar stays visible and solid
    // for the rest of the page, matching the old post-runway appearance.
    const reveal = () => {
      setHidden(false);
      setSolid(true);
    };
    // No attribute at all means no gate is mounted — don't hide forever.
    const state = document.documentElement.dataset.intro;
    if (state === undefined || state === "done") {
      reveal();
      return;
    }
    window.addEventListener("hj:intro-done", reveal);
    return () => window.removeEventListener("hj:intro-done", reveal);
  }, []);

  // Scroll spy: the section crossing a band around the upper third of the
  // viewport becomes the active nav link.
  useEffect(() => {
    const sections = LINKS.map((l) =>
      document.querySelector<HTMLElement>(l.href),
    ).filter((s): s is HTMLElement => s !== null);
    if (sections.length === 0) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const href = `#${entry.target.id}`;
          if (lockedTarget.current && lockedTarget.current !== href) continue;
          setActive(href);
          if (lockedTarget.current === href) {
            lockedTarget.current = null;
            if (lockTimer.current) clearTimeout(lockTimer.current);
            lockTimer.current = null;
          }
        }
      },
      { rootMargin: "-30% 0px -55% 0px" },
    );
    sections.forEach((s) => io.observe(s));
    return () => {
      io.disconnect();
      if (lockTimer.current) clearTimeout(lockTimer.current);
    };
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
        className={`fixed inset-x-0 top-0 z-40 will-change-transform ${
          reduced
            ? ""
            : "transition-[transform,opacity] duration-300 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]"
        } ${
          hidden
            ? "pointer-events-none -translate-y-full opacity-0"
            : "translate-y-0 opacity-100"
        } ${solid ? "hj-navbar-solid" : ""}`}
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
              src="/logo/hackjam26-triangle.webp"
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
                onClick={() => selectSection(l.href)}
                aria-current={active === l.href ? "true" : undefined}
                className={`hj-nav-link font-pixel text-[12px] tracking-[0.18em] ${
                  active === l.href
                    ? "hj-nav-link-active"
                    : "text-star-white/70"
                }`}
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
              target="_blank"
              rel="noopener noreferrer"
              className="hj-pixel-btn px-4 py-2 font-pixel text-[12px] tracking-[0.12em]"
            >
              APPLY NOW
            </a>
            <MlhTrustBadge id="mlh-trust-badge" />
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
                onClick={() => {
                  selectSection(l.href);
                  setOpen(false);
                }}
                initial={{ opacity: 0, y: reduced ? 0 : 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: reduced ? 0 : 0.06 * i, duration: 0.3 }}
                className="hj-nav-link font-pixel text-[16px] tracking-[0.2em] text-star-white/80"
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
              target="_blank"
              rel="noopener noreferrer"
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
