import { siteConfig } from "@/config/site";
import Reveal from "@/components/effects/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { Marquee } from "@/components/ui/marquee";

function initials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("");
}

type Member = (typeof siteConfig.team)[number];

/* Pixel crew card — same design language as the rest of the site:
   pixel-card chrome, cyan-cornered portrait. The whole card links to the
   member's LinkedIn profile. */
function TeamCard({ member, index }: { member: Member; index: number }) {
  return (
    <a
      href={member.linkedin}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${member.name} on LinkedIn`}
      className="pixel-card group flex w-56 shrink-0 flex-col px-4 py-5 transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-1 sm:w-64 sm:px-5 sm:py-6"
      style={
        {
          "--pc-glow":
            "color-mix(in srgb, var(--color-accent-cyan) 22%, transparent)",
          "--pc-border": "var(--color-void-700)",
          "--pc-face":
            "color-mix(in srgb, var(--color-grass) 14%, var(--color-void-800))",
        } as React.CSSProperties
      }
    >
      <div className="mb-4 flex items-start justify-between sm:mb-5">
        <span className="pixel-chip text-accent-cyan">
          CREW {String(index + 1).padStart(2, "0")}
        </span>
        <span className="font-pixel text-[8px] text-star-white/35">LANDED</span>
      </div>
      <div className="flex flex-col items-center gap-4 text-center">
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
              className="crisp h-24 w-24 object-cover sm:h-28 sm:w-28"
            />
          ) : (
            <div className="flex h-24 w-24 items-center justify-center bg-void-700 font-pixel text-sm text-nebula-core sm:h-28 sm:w-28 sm:text-base">
              {initials(member.name)}
            </div>
          )}
        </div>
        <div className="min-w-0">
          <span className="block font-pixel text-[10px] leading-relaxed text-star-white">
            {member.name.toUpperCase()}
          </span>
          <span className="mt-2 block text-xs leading-relaxed text-accent-cyan">
            {member.role}
          </span>
          <span className="mt-1 block font-pixel text-[10px] uppercase leading-relaxed text-accent-magenta">
            {member.team}
          </span>
        </div>
      </div>
    </a>
  );
}

/**
 * Grass zone (spec §6.8): we've landed — the organizers, on the ground.
 * Full-width auto-scrolling marquee: the crew cards drift by on their own
 * (independent of the user's scroll), pausing on hover. The edges fade via
 * a mask so cards slide in and out of nothing over the cascade gradient.
 */
/* Second row starts from a rotated offset so the two rows never line up
   on the same crew member at the same time. */
const ROW_TWO_OFFSET = Math.floor(siteConfig.team.length / 2);
const rowTwo = [
  ...siteConfig.team.slice(ROW_TWO_OFFSET),
  ...siteConfig.team.slice(0, ROW_TWO_OFFSET),
];

export default function MeetTheTeam() {
  return (
    <section id="team" className="flex min-h-[82dvh] w-full scroll-mt-14 flex-col items-center justify-center overflow-hidden pt-36 pb-36 sm:pt-48 sm:pb-48">
      <Reveal className="flex w-full flex-col items-center">
        <SectionHeading
          title="MEET THE TEAM"
          sub="These are the humans who made the descent to make HackJam26 possible."
          accent="var(--color-accent-cyan)"
          className="mb-10 px-4 sm:mb-14"
          subClassName="max-w-xl font-pixel text-xs sm:text-sm"
        />

        <div
          data-reveal
          className="flex w-full flex-col gap-5 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)] sm:gap-7"
        >
          {/* Two stacked rows drifting opposite ways; both keep moving
              until the cursor lands on them (pauseOnHover). */}
          <Marquee pauseOnHover className="[--duration:30s] [--gap:2rem] sm:[--gap:2.5rem]">
            {siteConfig.team.map((member, i) => (
              <TeamCard key={member.name} member={member} index={i} />
            ))}
          </Marquee>
          <Marquee
            pauseOnHover
            reverse
            className="[--duration:30s] [--gap:2rem] sm:[--gap:2.5rem]"
          >
            {rowTwo.map((member, i) => (
              <TeamCard
                key={member.name}
                member={member}
                index={(i + ROW_TWO_OFFSET) % siteConfig.team.length}
              />
            ))}
          </Marquee>
        </div>
      </Reveal>
    </section>
  );
}
