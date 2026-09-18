@AGENTS.md

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).

## Changelog

### 2026-09-17 — Official tracks, expanded crew, judges rail

- `src/config/site.ts` — `worlds` now carries the real HackJam 26 tracks in
  world order: Overall (Terran), Home Turf (Ringed), Off the Grid (Lunar).
  Stats stay flavor text. Seven new `team` entries (Brenda Seminario,
  Victoria Christoffel, Gerson Araujo Maciel Neto, Olumoroti Ojo-Akinkunmi,
  Jaden Rodriguez, Mariafernanda Belisario, Jonathan Glasgow); Jorge Arevalo
  is now "Judging Lead" with a photo. `judges` replaces the six TBA seats with
  the 11 confirmed judges — `role`, `photo`, and `socials.linkedin` are empty
  until they land, and the card hides each line when empty.
- `src/components/ui/ScrollRail.tsx` (new) — the snap-scroll rail with
  prev/next controls, extracted from `TeamStrip`'s reduced-motion branch so it
  lives once. `smooth` opts into smooth scrolling; reduced motion always jumps.
- `src/components/sections/Judges.tsx` — the 3-col grid is now a `ScrollRail`
  of fixed-width cards (272px / 296px at sm), since 11+ judges no longer fit a
  static grid. Swipe/trackpad scroll works natively.
- `public/team/` — five new 640px-wide `.webp` headshots (brenda, jaden,
  jorge, mariafernanda, olumoroti), converted from the originals with sharp.

### 2026-09-05 — Mobile layout + reduced-motion fixes

Three defects, all only reachable on a phone or with "reduce motion" on:

- `src/components/WorldsSection.tsx` — the planet pods were side-mounted at
  `-left-18 / -right-18` at every width below xl, which on a 390px viewport
  sliced roughly a third off each planet and stranded the track label in open
  space beside it. Below `sm` the pod now stacks: planet centered, label and a
  `TAP TO EXPAND` affordance underneath (touch has no hover, so the desktop
  `CLICK TO EXPAND` hint was never reachable there). Roll-in travel is capped
  at `min(900px, 92vw)` so phones get a roll from just offscreen rather than a
  900px lurch. `sm` and up are untouched.
- `src/components/transitions/LaunchReplay.tsx` — the cloud wall was sized in
  `vw` while its rows are spaced in `%` of viewport HEIGHT. On desktop a 62vw
  sprite is ~893px wide (425 tall) against ~190px rows, so it overlapped into a
  solid wall; on a phone the same sprite is ~242px wide (115 tall) against
  ~185px rows, so the wall came out full of holes and never reached past ~40%
  of the screen. The scroll-snap-to-top it exists to hide happened in plain
  sight. Width is now floored against vh (`max(Nvw, N*1.2vh)`), and the parting
  sweep measures `el.offsetWidth` instead of assuming a fixed multiple of
  viewport width, since a sprite can now be wider than the viewport.
- `src/components/ui/TeamStrip.tsx` (new) + `sections/MeetTheTeam.tsx` — the
  global `animation-duration: 0.01ms !important` reduced-motion rule froze the
  crew marquee dead inside its `overflow-hidden` box, leaving 15 of 17 members
  permanently unreachable. Under reduced motion the marquee is now swapped for
  a real scroll container with prev/next controls beneath it (edges disable at
  the ends, steps one card per press, `behavior: "auto"` so the control itself
  does not animate). Default motion behavior is unchanged.
- `src/app/globals.css` — `.hj-no-scrollbar` for the rail.

### 2026-07-02 — Tracks section rebuilt as "CHOOSE YOUR WORLD" (WebGL pixel planets)

Ported the "FOUR WORLDS" reference (`../planets.html`) into the tracks section:

- `src/lib/pixelPlanet.ts` — framework-agnostic WebGL2 engine. GLSL shaders
  (ocean, land, clouds, no-atmosphere, craters, lava, gas giant, ring) are
  copied **verbatim** from the reference — do not "improve" them. `Layer` (one
  WebGL2 context each) + `Planet` (2D-canvas compositor) classes, typed, with a
  `spin` param and `dispose()` (WEBGL_lose_context) on both. Exports all four
  `PLANET_DEFS`: 0 Terran, 1 Lunar, 2 Magma, 3 Ringed.
- `src/components/PixelPlanet.tsx` — replaced the old SVG placeholder with a
  client wrapper: builds layer + composite canvases in an effect, rAF render
  loop, pauses off-screen via IntersectionObserver. Cleanup MUST dispose the
  planet — each layer is its own WebGL context and browsers cap ~16.
- `src/components/WorldsSection.tsx` — replaced `sections/Tracks.tsx` (deleted)
  in `page.tsx`. Keeps the section heading; three 70vh scroll triggers with
  440px planet pods side-mounted on alternating edges (L/R/L), GSAP
  ScrollTrigger slide-in, pulsing ring, inner-side label, hover glow +
  "CLICK TO EXPAND", and a Framer Motion modal (bigger planet + stat grid,
  Escape/backdrop close).
- `src/config/site.ts` — new `WorldTrack` type + `siteConfig.worlds` (3
  placeholder tracks: Deep Mind→Terran, Cloud Nine→Ringed, Circuit World→Lunar;
  Magma unused). Swap names/blurbs/stats here when real track info lands. The
  old `tracks` array is kept but currently unused.
- `src/app/globals.css` — added `hj-ring-pulse` keyframe.
- Reduced motion: spin frozen, entrances skipped, modal animation zeroed.
