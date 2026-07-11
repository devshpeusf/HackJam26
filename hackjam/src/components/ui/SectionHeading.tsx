/* Shared section heading: pixel title, three-square ornament in the
   section's accent color, optional sub line. Keeps every section's header
   rhythm identical so the page reads as one system. */
export default function SectionHeading({
  title,
  sub,
  accent = "var(--color-accent-cyan)",
  className,
}: {
  title: string;
  sub?: string;
  accent?: string;
  className?: string;
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
      {sub && (
        <p data-reveal className="max-w-md text-sm leading-relaxed text-star-white/75">
          {sub}
        </p>
      )}
    </div>
  );
}
