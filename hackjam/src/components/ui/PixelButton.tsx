import { cn } from "@/lib/utils";

type Variant = "magenta" | "cyan" | "violet" | "outline";
type Size = "sm" | "md" | "lg";

/* Solid variants fill AND border with the same accent, which is what gives
   the site's buttons their notched-corner sprite look: the four box-shadows
   square off each corner. "outline" borders in currentColor instead, so a
   caller can pick any palette color with a text- class, exactly the way the
   old .pixel-button worked in the FAQ. */
const ACCENT: Record<Variant, string> = {
  magenta: "var(--color-accent-magenta)",
  cyan: "var(--color-accent-cyan)",
  violet: "var(--color-accent-violet)",
  outline: "currentColor",
};

const SIZE: Record<Size, string> = {
  sm: "px-5 py-2.5 text-[10px]",
  md: "px-7 py-3.5 text-xs",
  lg: "px-10 py-5 text-sm",
};

type Props = {
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
  /** Renders an <a>. */
  href?: string;
  /** target=_blank + rel on the anchor. */
  external?: boolean;
  /** The registration CTA's idle glow pulse. Magenta only. */
  pulse?: boolean;
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

/**
 * The site's one button.
 *
 * Replaces three separate implementations that had drifted apart: the
 * .hj-pixel-btn class (navbar), the .pixel-button class (FAQ), and hand
 * written inline boxShadow strings (hero, launch replay). They disagreed on
 * hover (lift vs scale), on glow radius, and on whether the border color was
 * a token or a hardcoded hex.
 *
 * Hover lifts and brightens, press pushes down into its own shadow, which is
 * the arcade-cabinet feel the rest of the site is going for. Reduced motion
 * keeps the color feedback and drops the movement, since globals.css zeroes
 * transition-duration globally and an untreated transform would snap.
 */
export default function PixelButton({
  children,
  variant = "magenta",
  size = "md",
  href,
  external,
  pulse,
  className,
  ...props
}: Props) {
  const accent = ACCENT[variant];
  const solid = variant !== "outline";

  const style: React.CSSProperties = {
    background: solid ? accent : "var(--color-void-deep)",
    ...(solid ? { color: "var(--color-void-deep)" } : null),
    boxShadow: [
      `0 -4px 0 0 ${accent}`,
      `0 4px 0 0 ${accent}`,
      `-4px 0 0 0 ${accent}`,
      `4px 0 0 0 ${accent}`,
      props.disabled
        ? null
        : `0 0 28px 0 color-mix(in srgb, ${accent} 34%, transparent)`,
    ]
      .filter(Boolean)
      .join(", "),
  };

  const classes = cn(
    "inline-flex items-center justify-center",
    "cursor-pointer touch-manipulation select-none",
    "font-pixel uppercase leading-none tracking-[0.12em]",
    "transition-[transform,filter] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]",
    // Tailwind v4 gates hover behind (hover: hover), so a tap never leaves a
    // touch device stuck in the hover state.
    "hover:-translate-y-[3px] hover:brightness-110",
    "active:translate-y-[3px] active:brightness-95",
    "motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:active:translate-y-0",
    "focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-star-white",
    "disabled:pointer-events-none disabled:opacity-40",
    pulse && "hj-cta-pulse",
    SIZE[size],
    className,
  );

  if (href) {
    const anchorProps = props as unknown as React.AnchorHTMLAttributes<HTMLAnchorElement>;
    return (
      <a
        {...anchorProps}
        href={href}
        className={classes}
        style={style}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : null)}
      >
        {children}
      </a>
    );
  }

  return (
    <button type="button" {...props} className={classes} style={style}>
      {children}
    </button>
  );
}
