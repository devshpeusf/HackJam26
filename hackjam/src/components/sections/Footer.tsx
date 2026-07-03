import { siteConfig } from "@/config/site";

/** Ground level (spec §6.11): close + MLH compliance requirements. */
export default function Footer() {
  return (
    <footer className="flex flex-col items-center gap-10 px-4 pb-12 pt-24 text-center">
      <a
        href={siteConfig.registrationUrl}
        className="inline-block bg-accent-magenta px-8 py-4 font-pixel text-xs text-void-deep transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:scale-105"
        style={{
          boxShadow:
            "0 -4px 0 0 #ff2e97, 0 4px 0 0 #ff2e97, -4px 0 0 0 #ff2e97, 4px 0 0 0 #ff2e97, 0 0 28px rgba(255,46,151,0.5)",
        }}
      >
        APPLY NOW
      </a>

      <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs">
        <a
          href={siteConfig.mlh.codeOfConductUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-star-white/70 underline-offset-4 transition-colors hover:text-accent-cyan hover:underline"
        >
          MLH Code of Conduct
        </a>
        <a
          href={siteConfig.socials.instagram}
          className="text-star-white/70 underline-offset-4 transition-colors hover:text-accent-cyan hover:underline"
        >
          Instagram
        </a>
        <a
          href={siteConfig.socials.discord}
          className="text-star-white/70 underline-offset-4 transition-colors hover:text-accent-cyan hover:underline"
        >
          Discord
        </a>
        <a
          href={siteConfig.socials.linkedin}
          className="text-star-white/70 underline-offset-4 transition-colors hover:text-accent-cyan hover:underline"
        >
          LinkedIn
        </a>
      </div>

      <div className="flex flex-col gap-2">
        <p className="font-pixel text-[8px] text-star-white/60">
          {siteConfig.mlh.label.toUpperCase()}
        </p>
        <p className="text-xs text-star-white/50">
          Built with care by SHPE at the University of South Florida.
        </p>
        <p className="text-[10px] text-star-white/40">
          &copy; {new Date().getFullYear()} HackJam. The HackJam name, logo,
          and mascot are protected marks.
        </p>
      </div>
    </footer>
  );
}
