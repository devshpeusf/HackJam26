"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import ArcadeStartScreen, { type IntroPhase } from "./ArcadeStartScreen";
import MlhTrustBadge from "@/components/MlhTrustBadge";
import {
  BACKDROP_SRC,
  CABINET_AR,
  CABINET_SRC,
  INTRO_IMAGES,
  SCREEN_RECT,
  WIDTH_FOR_SCREEN_FILL,
} from "./cabinet";

type Phase = IntroPhase | "done";

/** Not "any key": bare modifiers and Tab must stay usable for navigation. */
const IGNORED_KEYS = new Set([
  "Tab",
  "Shift",
  "Control",
  "Alt",
  "Meta",
  "CapsLock",
  "NumLock",
  "ScrollLock",
  "ContextMenu",
  "OS",
]);

/** Floor on the boot phase so a warm cache doesn't flash the loading bar. */
const MIN_BOOT_MS = 650;
const FLIGHT = 1.15;

const pct = (n: number) => `${n * 100}%`;

/**
 * Retro arcade intro gate (replaces the old scroll-scrubbed LoadingScreen).
 *
 * The cabinet PNG's screen is an alpha-cut hole, so the layers stack as
 * backdrop (z-90) → #site-root (z-95) → cabinet (z-100): the real page shows
 * *through* the hole. Until launch the site is hidden by CSS and the hole
 * shows a self-contained attract screen instead.
 *
 * On keypress or click the camera flies into the screen — both intro layers
 * scale up from the hole's centre while #site-root, which starts scaled and
 * clipped to the hole, expands to fill the viewport.
 */
export default function IntroGate() {
  const [phase, setPhase] = useState<Phase>("boot");
  const [progress, setProgress] = useState(0);

  const backdropRef = useRef<HTMLDivElement>(null);
  const cabinetRef = useRef<HTMLDivElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const mlhRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const phaseRef = useRef<Phase>("boot");

  const advance = useCallback((next: Phase) => {
    phaseRef.current = next;
    setPhase(next);
  }, []);

  // Lock the real scroller (html, not body). Locking body would make it a
  // scroll container — breaking every position:sticky set-piece — and wouldn't
  // even work, since html { overflow-x: hidden } stops overflow propagation.
  useLayoutEffect(() => {
    const html = document.documentElement;
    html.dataset.intro = "active";
    const site = document.getElementById("site-root");
    if (site) site.inert = true;

    const prevRestoration = history.scrollRestoration;
    history.scrollRestoration = "manual";

    return () => {
      history.scrollRestoration = prevRestoration;
      // Idempotent with finish(); guarantees we can never leave the page locked.
      html.dataset.intro = "done";
      if (site) site.inert = false;
    };
  }, []);

  // Boot: real progress from image decode + font readiness.
  useEffect(() => {
    let cancelled = false;

    const tasks: Promise<unknown>[] = INTRO_IMAGES.map((src) => {
      const img = new Image();
      img.src = src;
      // A missing asset must never wedge the gate at the loading bar.
      return img.decode().catch(() => undefined);
    });
    if (document.fonts?.ready) tasks.push(document.fonts.ready);

    let settled = 0;
    tasks.forEach((task) => {
      void task.finally(() => {
        if (cancelled) return;
        settled += 1;
        setProgress(settled / tasks.length);
      });
    });

    const floor = new Promise((r) => setTimeout(r, MIN_BOOT_MS));
    void Promise.all([Promise.allSettled(tasks), floor]).then(() => {
      if (cancelled) return;
      setProgress(1);
      advance("ready");
    });

    return () => {
      cancelled = true;
    };
  }, [advance]);

  useEffect(() => {
    if (phase === "ready") buttonRef.current?.focus();
  }, [phase]);

  const finish = useCallback(() => {
    const html = document.documentElement;
    const site = document.getElementById("site-root");

    if (site) {
      // An identity clip-path is NOT none — it would keep creating a
      // containing block for every fixed descendant. Clear it explicitly.
      gsap.set(site, {
        clearProps: "transform,transformOrigin,clipPath,willChange",
      });
      site.style.height = "";
      site.style.overflow = "";
      site.style.flex = "";
      site.style.position = "";
      site.style.zIndex = "";
      site.inert = false;
    }

    // Unlock before refreshing, so ScrollTrigger never caches locked or
    // height-clamped measurements.
    html.dataset.intro = "done";
    advance("done");
    window.dispatchEvent(new CustomEvent("hj:intro-done"));
    ScrollTrigger.refresh();
  }, [advance]);

  const launch = useCallback(() => {
    if (phaseRef.current !== "ready") return;
    advance("launching");
    document.documentElement.dataset.intro = "launching";

    const backdrop = backdropRef.current;
    const cabinet = cabinetRef.current;
    const screen = screenRef.current;
    const site = document.getElementById("site-root");
    if (!backdrop || !cabinet || !screen || !site) {
      finish();
      return;
    }

    // scroll-behavior: smooth is set globally, so a plain scrollTo would
    // animate and the geometry below would be read mid-scroll.
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.to([backdrop, cabinet], {
        autoAlpha: 0,
        duration: 0.2,
        onComplete: finish,
      });
      return;
    }

    const r = screen.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // Clamp the site to one viewport for the flight. This makes its border box
    // exactly vw x vh (so pixel clip insets are viewport coords), anchors its
    // fixed descendants correctly, and keeps the composited layer to one
    // screen instead of the full ~10000px document.
    site.style.height = "100svh";
    site.style.overflow = "clip"; // clip, not hidden — hidden would scroll-container it
    site.style.flex = "0 0 auto"; // body is a column flexbox
    site.style.position = "relative";
    site.style.zIndex = "95"; // between backdrop (90) and cabinet (100)

    // Cover the hole, then clip to it. A hair of over-scale avoids a
    // sub-pixel seam of backdrop at the edges.
    const scale = Math.max(r.width / vw, r.height / vh) * 1.003;
    const x = r.left + (r.width - vw * scale) / 2;
    const y = r.top + (r.height - vh * scale) / 2;

    // clip-path resolves in the element's own untransformed space, so the clip
    // rect is the preimage of the hole under the transform.
    const clip = {
      top: (r.top - y) / scale,
      right: vw - (r.right - x) / scale,
      bottom: vh - (r.bottom - y) / scale,
      left: (r.left - x) / scale,
    };

    gsap.set(site, {
      transformOrigin: "0 0",
      x,
      y,
      scale,
      clipPath: `inset(${clip.top}px ${clip.right}px ${clip.bottom}px ${clip.left}px)`,
      willChange: "transform",
    });

    // Grow the hole to cover the viewport, about its own centre.
    const cameraScale = Math.max(vw / r.width, vh / r.height);
    const originX = r.left + r.width / 2;
    const originY = r.top + r.height / 2;

    gsap
      .timeline({ onComplete: finish })
      // Reveal the site behind the hole.
      .to(contentRef.current, { autoAlpha: 0, duration: 0.28, ease: "power2.in" }, 0)
      .to(fillRef.current, { autoAlpha: 0, duration: 0.32, ease: "power2.in" }, 0.12)
      // Both intro layers share one tween so the bezel can never drift from
      // the content it frames.
      .to(
        [backdrop, cabinet],
        {
          scale: cameraScale,
          transformOrigin: `${originX}px ${originY}px`,
          duration: FLIGHT,
          ease: "power3.inOut",
        },
        0.18,
      )
      .to(
        site,
        {
          x: 0,
          y: 0,
          scale: 1,
          clipPath: "inset(0px 0px 0px 0px)",
          duration: FLIGHT,
          ease: "power3.inOut",
        },
        0.18,
      )
      .to(
        [backdrop, cabinet, mlhRef.current],
        { autoAlpha: 0, duration: 0.45 },
        0.18 + FLIGHT * 0.6,
      );
  }, [advance, finish]);

  useEffect(() => {
    if (phase !== "ready") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.repeat || e.metaKey || e.ctrlKey || e.altKey) return;
      if (IGNORED_KEYS.has(e.key)) return;
      e.preventDefault();
      launch();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, launch]);

  if (phase === "done") return null;

  const live = phase === "ready";
  const hideBroken = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.style.visibility = "hidden";
  };

  return (
    <>
      {/* Backdrop — behind the site, so the site shows through the screen hole */}
      <div
        ref={backdropRef}
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[90] overflow-hidden bg-void-deep"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={BACKDROP_SRC}
          alt=""
          onError={hideBroken}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>

      {/* MLH compliance badge — required on the landing view, so it rides
          above the gate too. No id here: the navbar owns #mlh-trust-badge. */}
      <div
        ref={mlhRef}
        className="fixed right-3 top-0 z-[101] w-[104px] sm:right-6 sm:w-[140px]"
      >
        <MlhTrustBadge className="block w-full" />
      </div>

      {/* Cabinet — in front of the site; its screen is an alpha-cut hole */}
      <div
        ref={cabinetRef}
        role="dialog"
        aria-modal="true"
        aria-label="HackJam intro"
        onClick={live ? launch : undefined}
        className={`fixed inset-0 z-[100] grid place-items-center overflow-hidden ${
          live ? "" : "pointer-events-none"
        }`}
      >
        {/* Wrapper carries the cabinet's exact aspect ratio, so SCREEN_RECT
            percentages resolve against the rendered artwork with no
            letterboxing to drift against. Width takes whichever is smaller:
            fitting the viewport height (landscape), or the width that makes
            the screen fill SCREEN_FILL of the container (portrait, where the
            cabinet body crops off the sides rather than shrinking to nothing).
            100% (not 100vw) avoids the reserved scrollbar gutter; svh (not
            dvh) keeps geometry stable while the iOS URL bar animates. */}
        <div
          className="relative"
          style={{
            aspectRatio: `${CABINET_AR}`,
            width: `min(calc(100svh * ${CABINET_AR}), calc(100% * ${WIDTH_FOR_SCREEN_FILL}))`,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={CABINET_SRC}
            alt=""
            aria-hidden
            onError={hideBroken}
            className="absolute inset-0 block h-full w-full"
          />

          <div
            ref={screenRef}
            className="hj-screen absolute overflow-hidden"
            style={{
              left: pct(SCREEN_RECT.left),
              top: pct(SCREEN_RECT.top),
              width: pct(SCREEN_RECT.width),
              height: pct(SCREEN_RECT.height),
            }}
          >
            <div ref={fillRef} className="absolute inset-0 bg-void-deep" />
            <div ref={contentRef} className="relative h-full w-full">
              <ArcadeStartScreen
                phase={phase}
                progress={progress}
                onStart={launch}
                buttonRef={buttonRef}
              />
            </div>
            <div aria-hidden className="hj-crt pointer-events-none absolute inset-0" />
          </div>
        </div>
      </div>
    </>
  );
}
