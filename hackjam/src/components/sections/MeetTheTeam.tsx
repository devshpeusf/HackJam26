import { siteConfig } from "@/config/site";

function initials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("");
}

/** Grass zone (spec §6.8): we've landed — the organizers, on the ground. */
export default function MeetTheTeam() {
  return (
    <section className="flex min-h-[100dvh] flex-col items-center justify-center px-4 py-32">
      <h2 className="mb-4 text-center font-pixel text-base text-star-white sm:text-lg">
        MEET THE TEAM
      </h2>
      <p className="mb-16 max-w-md text-center text-sm text-star-white/80">
        Touchdown. These are the humans who built the descent.
      </p>

      <div className="grid max-w-4xl grid-cols-1 gap-10 sm:grid-cols-3">
        {siteConfig.team.map((member) => (
          <div
            key={member.name}
            className="flex flex-col items-center gap-4 bg-void-800/90 px-6 py-8 text-center"
            style={{
              boxShadow:
                "0 -4px 0 0 #1a1530, 0 4px 0 0 #1a1530, -4px 0 0 0 #1a1530, 4px 0 0 0 #1a1530",
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
            <span className="font-pixel text-[10px] text-star-white">
              {member.name.toUpperCase()}
            </span>
            <span className="text-xs text-accent-cyan">{member.role}</span>
            <div className="flex gap-4 text-xs">
              {member.socials.github && (
                <a
                  href={member.socials.github}
                  className="text-star-white/60 underline-offset-4 transition-colors hover:text-accent-magenta hover:underline"
                >
                  GitHub
                </a>
              )}
              {member.socials.linkedin && (
                <a
                  href={member.socials.linkedin}
                  className="text-star-white/60 underline-offset-4 transition-colors hover:text-accent-magenta hover:underline"
                >
                  LinkedIn
                </a>
              )}
              {member.socials.twitter && (
                <a
                  href={member.socials.twitter}
                  className="text-star-white/60 underline-offset-4 transition-colors hover:text-accent-magenta hover:underline"
                >
                  Twitter
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
