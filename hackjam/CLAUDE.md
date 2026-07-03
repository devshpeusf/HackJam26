@AGENTS.md

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).

## Changelog

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
