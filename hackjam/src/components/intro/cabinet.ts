/**
 * Arcade cabinet artwork geometry.
 *
 * Measured off public/intro/arcade-cabinet.webp (1024x781): the screen is
 * already an alpha-cut hole at x 294..727, y 148..522 (434x375), 98.8% of its
 * bounding box, so a plain rect tracks it accurately.
 *
 * SCREEN_RECT is expressed as fractions of the cabinet box, and the screen
 * element is positioned with those percentages inside a wrapper that
 * shrink-wraps the cabinet image. The screen therefore stays welded to the
 * artwork at every viewport size with no JS layout measurement — only the
 * zoom-through reads a rect, once, at trigger time.
 */

/** Cabinet PNG intrinsic aspect ratio (width / height) — 1024/781. */
export const CABINET_AR = 1024 / 781;

/** The cabinet's screen hole, as fractions (0-1) of the cabinet box. */
export const SCREEN_RECT = {
  left: 294 / 1024,
  top: 148 / 781,
  width: 434 / 1024,
  height: 375 / 781,
} as const;

/**
 * The cabinet is landscape (AR ~1.31), so plain "contain" sizing leaves it
 * tiny and marooned on a portrait phone — constrained by width, with dead
 * backdrop above and below. On narrow viewports we instead scale it up until
 * the screen fills SCREEN_FILL of the container width, letting the outer body
 * crop off the sides. Landscape viewports still fit by height.
 */
export const SCREEN_FILL = 0.88;

/** Width multiplier (relative to the container) that achieves SCREEN_FILL. */
export const WIDTH_FOR_SCREEN_FILL = SCREEN_FILL / SCREEN_RECT.width;

export const CABINET_SRC = "/intro/arcade-cabinet.webp";
export const BACKDROP_SRC = "/intro/intro-backdrop.webp";

/** Both layers are preloaded before the gate becomes interactive. */
export const INTRO_IMAGES = [BACKDROP_SRC, CABINET_SRC] as const;
