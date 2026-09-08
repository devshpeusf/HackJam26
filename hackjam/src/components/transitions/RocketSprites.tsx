"use client";

import { useEffect, useRef } from "react";

/* Pixel-art sprites for the launch set-pieces, drawn against a Saturn-V
   night-launch reference: tall white rocket with navy bands and a checker
   marking, a rust lattice launch tower, stepped periwinkle cumulus smoke,
   and a parachute-descent capsule (used by RocketDescent). The rocket/plume/
   smoke sprites are hand-authored row grids — every color there is a
   globals.css token, "." is transparent, and the renderer sizes itself from
   the grid. The capsule is procedural instead (too much per-pixel curvature
   and shading for a hand-authored grid) — see drawCapsuleSprite below. */

type PixelColors = Record<string, string>;

function PixelGrid({
  rows,
  colors,
  width,
  className,
  style,
}: {
  rows: readonly string[];
  colors: PixelColors;
  width: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const cols = Math.max(...rows.map((r) => r.length));
  return (
    <svg
      width={width}
      height={(width * rows.length) / cols}
      viewBox={`0 0 ${cols} ${rows.length}`}
      shapeRendering="crispEdges"
      aria-hidden
      className={className}
      style={style}
    >
      {rows.flatMap((row, y) =>
        [...row].map((ch, x) =>
          ch === "." || !colors[ch] ? null : (
            <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={colors[ch]} />
          ),
        ),
      )}
    </svg>
  );
}

const HULL: PixelColors = {
  O: "var(--color-hull-outline)",
  w: "var(--color-star-white)",
  L: "var(--color-hull-highlight)",
  B: "var(--color-hull-base)",
  N: "var(--color-canopy)",
};

/* Saturn-V profile, 15×28: escape-tower spike → tapered nose → banded
   stages with a checker marking and side stripes → flared fins → engine
   skirt with three nozzle stubs. Flame is a separate element
   (data-launch-plume) so it can stretch independently during liftoff. */
const ROCKET_ROWS = [
  ".......O.......",
  ".......O.......",
  "......OwO......",
  "......OwO......",
  ".......O.......",
  "......OOO......",
  ".....OwwLO.....",
  ".....OwwLO.....",
  "....OwwwLBO....",
  "....ONNNNNO....",
  "....OwwwLBO....",
  "....OwwwLBO....",
  "....OwwwLBO....",
  "...OwwwwwLBO...",
  "...ONNNNNNNO...",
  "...OwwwwwLBO...",
  "...OwwNNwLBO...",
  "...OwwNNwLBO...",
  "...OwwwwwLBO...",
  "...ONwwwwwNO...",
  "...ONwwwwwNO...",
  "...ONwwwwwNO...",
  "...OwwwwwLBO...",
  "..OOwwwwwLBOO..",
  ".OwOwwwwwLBOwO.",
  "OwwOwwwwwLBOwwO",
  "OOOONNNNNNNOOOO",
  "....O..O..O....",
] as const;

export const ROCKET_ASPECT = ROCKET_ROWS.length / 15;

export function PixelRocket({ size = 96 }: { size?: number }) {
  return <PixelGrid rows={ROCKET_ROWS} colors={HULL} width={size} />;
}

const PLUME_COLORS: PixelColors = {
  F: "var(--color-star-warm)",
  E: "var(--color-sunset-orange)",
  R: "var(--color-logo-coral)",
};

const PLUME_ROWS = [
  "...FFF...",
  "..FFFFF..",
  "..FEFEF..",
  ".FFEEEFF.",
  ".FEEEEEFF",
  "FFEEEEEFF",
  ".FEEEEEFF",
  ".REEEERF.",
  "..REEER..",
  "..REER...",
  "...RR....",
  "....R....",
] as const;

export function PixelExhaustPlume({ width = 22 }: { width?: number }) {
  return <PixelGrid rows={PLUME_ROWS} colors={PLUME_COLORS} width={width} />;
}

/* Stepped cumulus smoke puffs — light tops, mid body, dark shadowed base.
   Two silhouettes so a cluster doesn't read as one stamped shape. */
const SMOKE: PixelColors = {
  l: "var(--color-smoke-light)",
  m: "var(--color-smoke-mid)",
  d: "var(--color-smoke-dark)",
};

const CLOUD_A = [
  "..........llll............",
  ".......llllllll...........",
  "......llllllllll..lll.....",
  "..lll.lllllllllllllllll...",
  ".llllllllmmllllllllllll...",
  "llllmmmmmmmmmllllmmllllll.",
  "lmmmmmmmmmmmmmmmmmmmmlllll",
  "mmmmmmdddmmmmmmmmmmmmmmmm.",
  "mmmdddddddddmmmddddmmmmmm.",
  "dddddddddddddddddddddddd..",
] as const;

const CLOUD_B = [
  ".....lll..........",
  "...llllllll.......",
  "..llllllllll.lll..",
  ".lllllmmllllllll..",
  "llmmmmmmmmmmllllll",
  "mmmmmdddmmmmmmmmm.",
  "mdddddddddddddddd.",
] as const;

export function PixelSmokeCloud({
  width = 160,
  variant = "a",
  flip = false,
}: {
  width?: number;
  variant?: "a" | "b";
  flip?: boolean;
}) {
  return (
    <PixelGrid
      rows={variant === "a" ? CLOUD_A : CLOUD_B}
      colors={SMOKE}
      width={width}
      style={flip ? { transform: "scaleX(-1)" } : undefined}
    />
  );
}

/* Parachute-descent capsule (heat shield down, tri-chute canopy above):
   an ablative dome + tapered hull with a cyan porthole and docking collar,
   three canopies (two side, one centred on top) each with gore-striped
   fabric, a scalloped skirt, and shroud lines running down to the hull.
   Used by RocketDescent — the ship coming DOWN under canopy is the
   counterpart of the Saturn V going up under thrust. */
const CAPSULE_W = 48;
const CAPSULE_H = 56;

const CAPSULE_PALETTE = {
  bg: "#0a0912",
  star: "#241f33",
  hull: ["#f2ead9", "#c6bda9", "#8d8574", "#4d4740", "#221e1c"],
  window: "#8fe3f2",
  chute: ["#e8503a", "#f2ead9"],
} as const;

type CapsulePx = (x: number, y: number, color: string) => void;
type CanopyDef = readonly [dx: number, r: number, topY: number];

function drawChutes(
  px: CapsulePx,
  P: typeof CAPSULE_PALETTE,
  cx: number,
  noseY: number,
  defs: readonly CanopyDef[],
) {
  defs.forEach(([dx, r, topY]) => {
    const ox = cx + dx;
    const h = Math.max(4, Math.round(r * 0.85));
    const band = Math.max(2, Math.round(r / 2.6)); // gore stripe width
    let skirtHw = r;

    for (let dy = 0; dy <= h; dy++) {
      const f = dy / h;
      const hw = Math.round(r * Math.sqrt(Math.max(0, 1 - (1 - f) * (1 - f))));
      if (hw < 1) continue;
      skirtHw = hw;
      for (let x = ox - hw; x <= ox + hw; x++) {
        const gore = Math.floor((x - ox + 120) / band) % 2;
        const u = Math.abs(x - ox) / hw;
        let c: string = gore === 0 ? P.chute[0] : P.chute[1];
        if (u > 0.86) c = P.hull[3]; // edge falloff
        if (dy === h && (x - ox + 120) % band < 1) c = P.hull[4]; // scalloped skirt
        px(x, topY + dy, c);
      }
      px(ox - hw, topY + dy, P.hull[4]);
      px(ox + hw, topY + dy, P.hull[4]);
    }
    px(ox, topY, P.hull[4]); // apex vent

    const ay = topY + h + 1;
    const span = Math.max(1, noseY - ay);
    [-1, -0.5, 0.5, 1].forEach((k) => {
      // shroud lines
      const ex = ox + Math.round(skirtHw * k);
      for (let i = 0; i <= span; i++) {
        const x = Math.round(ex + (cx - ex) * (i / span));
        px(x, ay + i, i > span - 2 ? P.hull[3] : P.hull[2]);
      }
    });
  });
}

/** Capsule body + ablative heat shield. Returns the shield's height. */
function drawCapsuleBody(
  px: CapsulePx,
  P: typeof CAPSULE_PALETTE,
  cx: number,
  noseY: number,
  baseY: number,
  halfTop: number,
  halfBase: number,
) {
  const span = baseY - noseY;
  for (let y = noseY; y <= baseY; y++) {
    const t = (y - noseY) / span;
    const hw = Math.round(
      halfTop + (halfBase - halfTop) * t * t * 0.55 + (halfBase - halfTop) * t * 0.45,
    );
    for (let x = cx - hw; x <= cx + hw; x++) {
      const u = (x - (cx - hw)) / (2 * hw || 1);
      px(
        x,
        y,
        u < 0.1
          ? P.hull[3]
          : u < 0.2
            ? P.hull[0]
            : u < 0.58
              ? P.hull[1]
              : u < 0.86
                ? P.hull[2]
                : P.hull[3],
      );
    }
    px(cx - hw, y, P.hull[4]);
    px(cx + hw, y, P.hull[4]);
    if (t > 0.42 && t < 0.48) for (let x = cx - hw + 1; x < cx + hw; x++) px(x, y, P.hull[3]);
    if (t > 0.76 && t < 0.81) for (let x = cx - hw + 1; x < cx + hw; x++) px(x, y, P.hull[2]);
  }

  for (let y = noseY; y < noseY + Math.max(2, Math.round(span * 0.09)); y++)
    for (let x = cx - halfTop; x <= cx + halfTop; x++)
      px(x, y, (x + y) % 3 === 0 ? P.hull[2] : P.hull[3]); // docking collar

  const ww = Math.max(3, Math.round(halfBase * 0.42));
  const wh = Math.max(2, Math.round(ww * 0.62));
  const wy = noseY + Math.round(span * 0.28);
  const wx = cx - Math.round(ww / 2) - Math.round(halfBase * 0.18);
  for (let y = wy - 1; y <= wy + wh; y++)
    for (let x = wx - 1; x <= wx + ww; x++) px(x, y, P.hull[4]);
  for (let y = wy; y < wy + wh; y++) for (let x = wx; x < wx + ww; x++) px(x, y, P.window);
  px(wx, wy, P.hull[0]);

  for (let x = cx - halfBase + 1; x <= cx + halfBase - 1; x++) {
    px(x, baseY - 1, P.hull[0]);
    px(x, baseY, P.hull[4]);
  }

  const shieldH = Math.max(3, Math.round(halfBase * 0.6)); // ablative dome
  for (let i = 1; i <= shieldH; i++) {
    const frac = i / shieldH;
    const hw = Math.round(halfBase * Math.sqrt(Math.max(0, 1 - frac * frac * 0.92)));
    for (let x = cx - hw; x <= cx + hw; x++) {
      const u = Math.abs(x - cx) / (hw || 1);
      px(x, baseY + i, (x + i) % 4 === 0 ? P.hull[4] : u < 0.6 ? P.hull[3] : P.hull[4]);
    }
  }
  return shieldH;
}

function drawCapsuleSprite(ctx: CanvasRenderingContext2D) {
  const P = CAPSULE_PALETTE;
  const px: CapsulePx = (x, y, color) => {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, 1, 1);
  };

  const cx = Math.round(CAPSULE_W / 2);
  const baseY = CAPSULE_H - Math.round(CAPSULE_H * 0.16);
  const halfBase = Math.round(CAPSULE_W * 0.2);
  const halfTop = Math.max(2, Math.round(halfBase * 0.37));
  const noseY = baseY - Math.max(6, Math.round(halfBase * 1.35));

  const r = Math.round(halfBase * 0.8);
  const top = Math.round(noseY * 0.22);
  drawChutes(px, P, cx, noseY, [
    [-Math.round(r * 1.9), r, top + 2], // left canopy
    [Math.round(r * 1.9), r, top + 2], // right canopy
    [0, r, top], // centre canopy, drawn last
  ]);

  drawCapsuleBody(px, P, cx, noseY, baseY, halfTop, halfBase);
}

export function PixelCapsule({ size = 110 }: { size?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, CAPSULE_W, CAPSULE_H);
    drawCapsuleSprite(ctx);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={CAPSULE_W}
      height={CAPSULE_H}
      aria-hidden
      style={{
        width: size,
        height: (size * CAPSULE_H) / CAPSULE_W,
        imageRendering: "pixelated",
        display: "block",
      }}
    />
  );
}
