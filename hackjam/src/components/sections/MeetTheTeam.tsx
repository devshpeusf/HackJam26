import { siteConfig } from "@/config/site";
import Reveal from "@/components/effects/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";

function initials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("");
}

/** Grass zone (spec §6.8): we've landed — the organizers, on the ground. */
export default function MeetTheTeam() {
  return (
    <section
      className="pixel-section-rail flex min-h-[100dvh] flex-col items-center justify-center px-4 py-32"
      style={{ "--rail-color": "var(--color-accent-cyan)" } as React.CSSProperties}
    >
      <Reveal className="flex w-full flex-col items-center">
        <SectionHeading
          title="MEET THE TEAM"
          sub="Touchdown. These are the humans who built the descent."
          accent="var(--color-accent-cyan)"
          className="mb-14"
        />

        <div className="grid w-full max-w-5xl grid-cols-1 gap-7 md:grid-cols-3">
          {siteConfig.team.map((member, i) => (
            <div
              key={member.name}
              data-reveal
              className="pixel-card pixel-card-hover group flex min-h-92 flex-col px-6 py-7"
              style={
                {
                  "--pc-glow":
                    "color-mix(in srgb, var(--color-accent-cyan) 22%, transparent)",
                  "--pc-border":
                    i === 1
                      ? "color-mix(in srgb, var(--color-accent-cyan) 52%, var(--color-void-700))"
                      : "var(--color-void-700)",
                  "--pc-face":
                    "color-mix(in srgb, var(--color-grass) 14%, var(--color-void-800))",
                } as React.CSSProperties
              }
            >
              <div className="mb-6 flex items-start justify-between">
                <span className="pixel-chip text-accent-cyan">
                  CREW {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-pixel text-[8px] text-star-white/35">LANDED</span>
              </div>
              <div className="flex items-center gap-5">
                <div
                  className="shrink-0 p-1 transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:-rotate-2 group-hover:scale-105"
                  style={{
                    boxShadow:
                      "0 -3px 0 0 var(--color-accent-cyan), 0 3px 0 0 var(--color-void-700), -3px 0 0 0 var(--color-void-700), 3px 0 0 0 var(--color-accent-cyan)",
                  }}
                >
                  {member.photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={member.photo}
                      alt={member.name}
                      className="crisp h-24 w-24 object-cover"
                    />
                  ) : (
                    <div className="flex h-24 w-24 items-center justify-center bg-void-700 font-pixel text-sm text-nebula-core">
                      {initials(member.name)}
                    </div>
                  )}
                </div>
                <div className="min-w-0 text-left">
                  <span className="block font-pixel text-[10px] leading-relaxed text-star-white">
                    {member.name.toUpperCase()}
                  </span>
                  <span className="mt-2 block text-xs leading-relaxed text-accent-cyan">
                    {member.role}
                  </span>
                </div>
              </div>
              <div className="mt-auto flex flex-wrap gap-3 pt-8">
                {Object.entries(member.socials).map(([network, href]) =>
                  href ? (
                    <a
                      key={network}
                      href={href}
                      className="pixel-chip text-star-white/70 transition-colors hover:text-accent-magenta"
                      aria-label={`${member.name} ${network}`}
                    >
                      {network.toUpperCase()}
                    </a>
                  ) : null,
                )}
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
