import { cn } from "@/lib/utils";

interface MarqueeProps extends React.ComponentPropsWithoutRef<"div"> {
  className?: string;
  /** Reverse the scroll direction. */
  reverse?: boolean;
  /** Pause the marquee while hovered. */
  pauseOnHover?: boolean;
  children: React.ReactNode;
  /** Scroll vertically instead of horizontally. */
  vertical?: boolean;
  /** How many copies of the children to chain (keeps the loop seamless). */
  repeat?: number;
}

/**
 * Infinite auto-scrolling marquee (shadcn/magicui-style). Speed and gap are
 * driven by the `--duration` and `--gap` CSS vars; override them via
 * className (e.g. `[--duration:30s] [--gap:1.5rem]`). Honors reduced
 * motion by pausing the animation.
 */
export function Marquee({
  className,
  reverse = false,
  pauseOnHover = false,
  children,
  vertical = false,
  repeat = 4,
  ...props
}: MarqueeProps) {
  return (
    <div
      {...props}
      className={cn(
        "group flex [gap:var(--gap)] overflow-hidden p-2 [--duration:40s] [--gap:1rem]",
        vertical ? "flex-col" : "flex-row",
        className,
      )}
    >
      {Array.from({ length: repeat }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "flex shrink-0 justify-around [gap:var(--gap)] motion-reduce:[animation-play-state:paused]",
            vertical ? "animate-marquee-vertical flex-col" : "animate-marquee flex-row",
            pauseOnHover && "group-hover:[animation-play-state:paused]",
            reverse && "[animation-direction:reverse]",
          )}
        >
          {children}
        </div>
      ))}
    </div>
  );
}
