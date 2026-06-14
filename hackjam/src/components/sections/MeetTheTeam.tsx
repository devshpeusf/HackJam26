import { siteConfig } from "@/config/site";

export default function MeetTheTeam() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-violet-950 text-white px-6">
      <h2 className="text-4xl font-bold mb-12">Meet the Team</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl w-full">
        {siteConfig.team.map((member) => (
          <div
            key={member.name}
            className="flex flex-col items-center gap-3 bg-violet-900/50 rounded-xl p-6"
          >
            <div className="h-20 w-20 rounded-full bg-violet-700 flex items-center justify-center text-2xl font-bold">
              {member.name[0]}
            </div>
            <p className="font-semibold text-lg">{member.name}</p>
            <p className="text-violet-300 text-sm">{member.role}</p>
            <div className="flex gap-3 text-violet-400 text-sm">
              {member.socials.github && <a href={member.socials.github}>GitHub</a>}
              {member.socials.linkedin && <a href={member.socials.linkedin}>LinkedIn</a>}
              {member.socials.twitter && <a href={member.socials.twitter}>Twitter</a>}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
