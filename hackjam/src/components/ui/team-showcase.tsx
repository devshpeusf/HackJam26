"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export interface ShowcaseMember {
  name: string;
  role: string;
  photo: string;
  socials?: { linkedin?: string; twitter?: string; website?: string };
  /** Locked-slot placeholder styling until the member is confirmed. */
  tba?: boolean;
}

/* Redacted-name bar patterns (widths in px units of 6) — varied per row so
   the classified dossier reads with rhythm instead of six identical rows. */
const REDACTION = [
  [7, 4],
  [5, 2, 4],
  [8, 3],
  [4, 3, 5],
  [6, 2, 2],
  [9, 2],
];

/**
 * Pixel-themed team showcase: a staggered mosaic of character-select
 * slots on the left, a roster on the right. Hovering either side
 * highlights the matching pair. Confirmed members show their photo
 * (grayscale until active); `tba` members render as locked slots with a
 * "?" and a redacted name, arcade style. Accent color via `accent`.
 */
export default function TeamShowcase({
  members,
  accent = "var(--color-accent-cyan)",
}: {
  members: ShowcaseMember[];
  accent?: string;
}) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-12 px-2 select-none sm:px-4 xl:flex-row xl:justify-center xl:gap-24">
      {/* slot mosaic */}
      <div className="grid shrink-0 grid-cols-2 gap-4 sm:grid-cols-3">
        {members.map((member, i) => (
          <PhotoTile
            key={i}
            member={member}
            index={i}
            sizeClass="h-40 w-34 sm:h-52 sm:w-44 xl:h-60 xl:w-52"
            accent={accent}
            active={hovered === i}
            dimmed={hovered !== null && hovered !== i}
            onHover={(on) => setHovered(on ? i : null)}
          />
        ))}
      </div>

      {/* roster */}
      <div className="grid w-full max-w-2xl grid-cols-2 gap-x-5 gap-y-8 px-2 pt-2 sm:gap-x-10 sm:gap-y-9 xl:flex xl:w-auto xl:max-w-none xl:flex-col xl:gap-10 xl:px-0">
        {members.map((member, i) => (
          <RosterRow
            key={i}
            member={member}
            index={i}
            accent={accent}
            active={hovered === i}
            dimmed={hovered !== null && hovered !== i}
            onHover={(on) => setHovered(on ? i : null)}
          />
        ))}
      </div>
    </div>
  );
}

function PhotoTile({
  member,
  index,
  sizeClass,
  accent,
  active,
  dimmed,
  onHover,
}: {
  member: ShowcaseMember;
  index: number;
  sizeClass: string;
  accent: string;
  active: boolean;
  dimmed: boolean;
  onHover: (on: boolean) => void;
}) {
  const bracket = {
    background: active
      ? accent
      : "color-mix(in srgb, var(--color-star-white) 30%, transparent)",
    transition: "background .3s ease-out",
  } as const;

  return (
    <div
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      className={cn(
        "relative cursor-pointer overflow-hidden bg-void-deep/75 transition-opacity duration-400",
        sizeClass,
        dimmed ? "opacity-45" : "opacity-100",
      )}
      style={{
        boxShadow: active
          ? `0 -3px 0 0 ${accent}, 0 3px 0 0 ${accent}, -3px 0 0 0 ${accent}, 3px 0 0 0 ${accent}, 0 0 28px color-mix(in srgb, ${accent} 40%, transparent)`
          : "0 -3px 0 0 var(--color-void-700), 0 3px 0 0 var(--color-void-700), -3px 0 0 0 var(--color-void-700), 3px 0 0 0 var(--color-void-700)",
        transition: "box-shadow .3s ease-out, opacity .4s ease",
      }}
    >
      {member.photo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={member.photo}
          alt={member.name}
          className="crisp h-full w-full object-cover transition-[filter] duration-500"
          style={{
            filter: active
              ? "grayscale(0) brightness(1)"
              : "grayscale(1) brightness(0.75)",
          }}
        />
      ) : (
        <>
          {/* faint grid, like the card faces elsewhere on the site */}
          <div
            aria-hidden
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "linear-gradient(var(--color-star-white) 1px, transparent 1px), linear-gradient(90deg, var(--color-star-white) 1px, transparent 1px)",
              backgroundSize: "12px 12px",
            }}
          />
          {/* corner brackets — the site's "reserved bay" language */}
          <span aria-hidden className="absolute left-1.5 top-1.5 h-3 w-[3px]" style={bracket} />
          <span aria-hidden className="absolute left-1.5 top-1.5 h-[3px] w-3" style={bracket} />
          <span aria-hidden className="absolute right-1.5 top-1.5 h-3 w-[3px]" style={bracket} />
          <span aria-hidden className="absolute right-1.5 top-1.5 h-[3px] w-3" style={bracket} />
          <span aria-hidden className="absolute bottom-1.5 left-1.5 h-3 w-[3px]" style={bracket} />
          <span aria-hidden className="absolute bottom-1.5 left-1.5 h-[3px] w-3" style={bracket} />
          <span aria-hidden className="absolute bottom-1.5 right-1.5 h-3 w-[3px]" style={bracket} />
          <span aria-hidden className="absolute bottom-1.5 right-1.5 h-[3px] w-3" style={bracket} />

          <div className="flex h-full w-full flex-col items-center justify-center gap-5">
            <span
              className="font-pixel text-4xl transition-all duration-300 sm:text-6xl"
              style={{
                color: active ? accent : "var(--color-void-700)",
                textShadow: active
                  ? `0 0 14px color-mix(in srgb, ${accent} 60%, transparent)`
                  : "none",
              }}
            >
              ?
            </span>
            <span
              className="font-pixel text-[8px] tracking-[0.3em] transition-colors duration-300 sm:text-[10px]"
              style={{
                color: active
                  ? accent
                  : "color-mix(in srgb, var(--color-star-white) 30%, transparent)",
              }}
            >
              SEAT {String(index + 1).padStart(2, "0")}
            </span>
          </div>

          {/* CRT scanline wash */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.06]"
            style={{
              background:
                "repeating-linear-gradient(to bottom, var(--color-star-white) 0 1px, transparent 1px 3px)",
            }}
          />
        </>
      )}
    </div>
  );
}

function RosterRow({
  member,
  index,
  accent,
  active,
  dimmed,
  onHover,
}: {
  member: ShowcaseMember;
  index: number;
  accent: string;
  active: boolean;
  dimmed: boolean;
  onHover: (on: boolean) => void;
}) {
  const socials = Object.entries(member.socials ?? {}).filter(
    ([, href]) => href,
  );

  return (
    <div
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      className={cn(
        "cursor-pointer transition-opacity duration-300",
        dimmed ? "opacity-40" : "opacity-100",
      )}
    >
      <div className="flex items-center gap-3">
        {/* pixel marker — widens and lights up when active */}
        <span
          className="h-3 shrink-0 transition-all duration-300"
          style={{
            width: active ? 30 : 18,
            background: active
              ? accent
              : "color-mix(in srgb, var(--color-star-white) 25%, transparent)",
          }}
        />

        {member.tba ? (
          /* redacted name — classified until the panel decrypts */
          <span
            className="flex items-center gap-1.5"
            role="img"
            aria-label="Name to be announced"
          >
            {(REDACTION[index % REDACTION.length] ?? [6, 3]).map((w, j) => (
              <span
                key={j}
                className="h-3.5 transition-colors duration-300 sm:h-4"
                style={{
                  width: w * 9,
                  background: active
                    ? `color-mix(in srgb, ${accent} 55%, transparent)`
                    : "color-mix(in srgb, var(--color-star-white) 30%, transparent)",
                }}
              />
            ))}
          </span>
        ) : (
          <span
            className={cn(
              "font-pixel text-[13px] tracking-[0.12em] transition-colors duration-300 sm:text-[16px]",
              active ? "text-star-white" : "text-star-white/75",
            )}
          >
            {member.name.toUpperCase()}
          </span>
        )}

        {socials.length > 0 && (
          <div
            className={cn(
              "ml-1 flex items-center gap-2 transition-all duration-200",
              active
                ? "translate-x-0 opacity-100"
                : "pointer-events-none -translate-x-2 opacity-0",
            )}
          >
            {socials.map(([network, href]) => (
              <a
                key={network}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="pixel-chip text-star-white/70 transition-colors hover:text-accent-magenta"
                aria-label={`${member.name} ${network}`}
              >
                {network.toUpperCase()}
              </a>
            ))}
          </div>
        )}
      </div>

      <p
        className="mt-3 flex items-center gap-2 pl-[42px] font-pixel text-[9px] tracking-[0.25em] uppercase transition-colors duration-300 sm:text-[11px]"
        style={{
          color: active
            ? accent
            : "color-mix(in srgb, var(--color-star-white) 40%, transparent)",
        }}
      >
        {member.role.toUpperCase()}
        {member.tba && (
          <span
            aria-hidden
            className="inline-block h-2.5 w-2"
            style={{
              background: active
                ? accent
                : "color-mix(in srgb, var(--color-star-white) 35%, transparent)",
              animation: "hj-cursor-blink 1.1s steps(1) infinite",
            }}
          />
        )}
      </p>
    </div>
  );
}
