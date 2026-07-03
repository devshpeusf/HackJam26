import type { Track } from "@/config/site";

/* Deterministic PRNG — planet terrain must be identical on server and
   client to avoid hydration mismatches. */
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const GRID = 20;

/**
 * Placeholder pixel-art planet drawn in code. When real sprites are
 * exported from deep-fold.itch.io/pixel-planet-generator, set
 * `track.sprite` in site.ts and this component swaps to the image.
 */
export default function PixelPlanet({
  track,
  seed,
  size = 144,
}: {
  track: Track;
  seed: number;
  size?: number;
}) {
  if (track.sprite) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={track.sprite}
        alt=""
        width={size}
        height={size}
        className="crisp select-none"
        draggable={false}
      />
    );
  }

  const { base, shade, highlight } = track.palette;
  const rand = mulberry32(seed * 7919 + 13);
  const c = (GRID - 1) / 2;
  const r = GRID / 2 - 1.2;

  const cells: { x: number; y: number; fill: string }[] = [];
  for (let y = 0; y < GRID; y++) {
    for (let x = 0; x < GRID; x++) {
      const dx = x - c;
      const dy = y - c;
      if (dx * dx + dy * dy > r * r) continue;
      // Light from the top-left: diagonal position picks the band.
      const diag = dx + dy;
      let fill = base;
      if (diag > r * 0.65) fill = shade;
      else if (diag < -r * 0.75) fill = highlight;
      // Deterministic terrain speckles.
      const n = rand();
      if (n > 0.86) fill = shade;
      else if (n < 0.08) fill = highlight;
      cells.push({ x, y, fill });
    }
  }

  // Optional flat ring crossing the planet (drawn only where it clears
  // the disc or passes in front of the lower half).
  const ring: { x: number; y: number; fill: string }[] = [];
  if (track.ring) {
    for (let x = -4; x < GRID + 4; x++) {
      const y = Math.round(c + (x - c) * 0.28);
      const dx = x - c;
      const dy = y - c;
      const inside = dx * dx + dy * dy <= r * r;
      if (!inside || y > c) {
        ring.push({ x, y, fill: highlight });
        ring.push({ x, y: y + 1, fill: shade });
      }
    }
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox={`-4 -4 ${GRID + 8} ${GRID + 8}`}
      shapeRendering="crispEdges"
      aria-hidden
      className="select-none"
    >
      {cells.map((p, i) => (
        <rect key={i} x={p.x} y={p.y} width={1} height={1} fill={p.fill} />
      ))}
      {ring.map((p, i) => (
        <rect key={`r${i}`} x={p.x} y={p.y} width={1} height={1} fill={p.fill} />
      ))}
    </svg>
  );
}
