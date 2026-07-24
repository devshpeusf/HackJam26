import { cn } from "@/lib/utils";

/* Shared section heading: pixel title, three-square ornament in the
   section's accent color, optional sub line. Keeps every section's header
   rhythm identical so the page reads as one system. */
export default function SectionHeading({
  title,
  eyebrow,
  sub,
  accent = "var(--color-accent-cyan)",
  className,
  subClassName,
}: {
  title: string;
  /** Optional pixel-font kicker rendered between the ornament and the sub line. */
  eyebrow?: string;
  sub?: string;
  accent?: string;
  className?: string;
  /** Override the sub line's size/width (defaults to text-sm max-w-md). */
  subClassName?: string;
}) {
  return (
    <div className={`flex flex-col items-center gap-5 text-center ${className ?? ""}`}>
      <h2
        data-reveal
        className="font-pixel text-2xl leading-relaxed text-star-white sm:text-4xl"
      >
        {title}
      </h2>
      <div data-reveal aria-hidden className="flex items-center gap-2">
        <span className="h-1 w-1" style={{ background: accent, opacity: 0.5 }} />
        <span className="h-1.5 w-1.5" style={{ background: accent }} />
        <span className="h-1 w-1" style={{ background: accent, opacity: 0.5 }} />
      </div>
      {eyebrow && (
        <span
          data-reveal
          className="font-pixel text-base leading-relaxed sm:text-lg"
          style={{ color: accent }}
        >
          {eyebrow}
        </span>
      )}
      {sub && (
        <p
          data-reveal
          className={cn(
            "max-w-md text-sm leading-relaxed text-star-white/75",
            subClassName,
          )}
        >
          {sub}
        </p>
      )}
    </div>
  );
}
