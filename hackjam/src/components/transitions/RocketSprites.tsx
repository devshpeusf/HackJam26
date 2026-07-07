/* Pixel-art sprites for the launch set-pieces, drawn against a Saturn-V
   night-launch reference: tall white rocket with navy bands and a checker
   marking, a rust lattice launch tower, stepped periwinkle cumulus smoke,
   and an Apollo-style re-entry capsule (used by RocketDescent). Every color
   is a globals.css token. Grids use "." for transparent; edit rows to
   reshape a sprite — the renderer sizes itself from the grid. */

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

/* Apollo-style re-entry capsule (heat shield down), cyan porthole, plasma
   glow trailing off the shield. Used by RocketDescent — the ship coming
   DOWN is the counterpart of the Saturn V going up. */
const CAPSULE_COLORS: PixelColors = {
  ...HULL,
  W: "var(--color-accent-cyan)",
  E: "var(--color-sunset-orange)",
  F: "var(--color-star-warm)",
};

const CAPSULE_BODY_ROWS = [
  "....OOOOO....",
  "...OwwwLBO...",
  "..OwwwwLLBO..",
  "..OwWWwwLBO..",
  ".OwwWWwwLLBO.",
  ".OwwwwwwLLBO.",
  "OwwwwwwwLLLBO",
  "OBBBBBBBBBBBO",
] as const;

const CAPSULE_PLASMA_ROWS = [
  ".OEEEEEEEEEO.",
  "..FEEFFEEF...",
  "...F..F..F...",
] as const;

export function PixelCapsule({ size = 110 }: { size?: number }) {
  const plasmaHeight = (size * CAPSULE_PLASMA_ROWS.length) / 13;
  return (
    <div className="relative" style={{ width: size }}>
      <PixelGrid rows={CAPSULE_BODY_ROWS} colors={CAPSULE_COLORS} width={size} />
      <div
        style={{
          transformOrigin: "center top",
          animation: "hj-flame 0.3s steps(2) infinite",
          marginTop: -1,
          height: plasmaHeight,
        }}
      >
        <PixelGrid rows={CAPSULE_PLASMA_ROWS} colors={CAPSULE_COLORS} width={size} />
      </div>
    </div>
  );
}
