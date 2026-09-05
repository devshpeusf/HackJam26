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

  // Boot: real progress from the two critical cabinet images. Fonts use
  // display:swap, so waiting for every font file here only delays the start
  // prompt without preventing a usable first render.
  useEffect(() => {
    let cancelled = false;

    const tasks: Promise<unknown>[] = INTRO_IMAGES.map((src) => {
      const img = new Image();
      img.src = src;
      // A missing asset must never wedge the gate at the loading bar.
      return img.decode().catch(() => undefined);
    });
    let settled = 0;
    tasks.forEach((task) => {
      void task.finally(() => {
        if (cancelled) return;
        settled += 1;
        setProgress(settled / tasks.length);
      });
    });

    // Do not hold visitors behind an artificial timer. On a warm browser
    // cache this moves straight to the start prompt; on a cold load it still
    // waits for the cabinet artwork and fonts that the intro actually needs.
    void Promise.allSettled(tasks).then(() => {
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

    const originX = r.left + r.width / 2;
    const originY = r.top + r.height / 2;
    // Grow the hole to cover the viewport, about its own centre.
    const cameraScale = Math.max(vw / r.width, vh / r.height);
    const flight = { progress: 0 };

    gsap.set([backdrop, cabinet], {
      transformOrigin: `${originX}px ${originY}px`,
    });

    // Cabinet scale and the site's reveal are both derived from the same
    // progress value every frame, instead of running as two independently
    // tweened properties. Two separate linear tweens only agree at the two
    // endpoints they were set up for — the site's on-screen edge is its own
    // scale times its clip-path inset (so it moves quadratically in
    // progress) while the cabinet's hole edge moves linearly, and the two
    // drift apart for most of the flight, flashing a gap at the seam. Driving
    // both from one shared progress value keeps them locked together at
    // every instant, not just at 0 and 1.
    const seam = 2; // px of overlap so rounding error never peeks through
    const syncFlight = () => {
      const p = flight.progress;
      const cabinetScale = 1 + (cameraScale - 1) * p;

      const reveal = {
        left: Math.max(0, (r.left - seam) * (1 - p)),
        top: Math.max(0, (r.top - seam) * (1 - p)),
        right: Math.min(vw, r.right + seam + (vw - r.right - seam) * p),
        bottom: Math.min(vh, r.bottom + seam + (vh - r.bottom - seam) * p),
      };

      const revealWidth = reveal.right - reveal.left;
      const revealHeight = reveal.bottom - reveal.top;
      // Slight overscan fades to an exact 1:1 page at the end of the flight.
      const pageScale =
        Math.max(revealWidth / vw, revealHeight / vh) * (1 + 0.003 * (1 - p));
      const pageX = (reveal.left + reveal.right - vw * pageScale) / 2;
      const pageY = (reveal.top + reveal.bottom - vh * pageScale) / 2;
      const clip = {
        top: (reveal.top - pageY) / pageScale,
        right: vw - (reveal.right - pageX) / pageScale,
        bottom: vh - (reveal.bottom - pageY) / pageScale,
        left: (reveal.left - pageX) / pageScale,
      };

      gsap.set([backdrop, cabinet], { scale: cabinetScale });
      gsap.set(site, {
        x: pageX,
        y: pageY,
        scale: pageScale,
        clipPath: `inset(${clip.top}px ${clip.right}px ${clip.bottom}px ${clip.left}px)`,
      });
    };

    gsap.set(site, {
      transformOrigin: "0 0",
      willChange: "transform,clip-path",
    });
    syncFlight();

    gsap
      .timeline({ onComplete: finish })
      // Reveal the site behind the hole.
      .to(contentRef.current, { autoAlpha: 0, duration: 0.28, ease: "power2.in" }, 0)
      .to(fillRef.current, { autoAlpha: 0, duration: 0.32, ease: "power2.in" }, 0.12)
      .to(
        flight,
        {
          progress: 1,
          duration: FLIGHT,
          ease: "power3.inOut",
          onUpdate: syncFlight,
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
          decoding="async"
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
            decoding="async"
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
