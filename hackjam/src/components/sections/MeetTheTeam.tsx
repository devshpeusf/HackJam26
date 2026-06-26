import { siteConfig } from "@/config/site";

export default function MeetTheTeam() {
  return (
    <section className="flex-1 min-h-0 flex flex-col items-center justify-center px-6 text-white">
      <div className="bg-black/40 backdrop-blur-sm rounded-2xl px-10 py-12 max-w-3xl w-full">
        <h2 className="text-4xl font-bold mb-10 text-center">Meet the Team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {siteConfig.team.map((member) => (
            <div
              key={member.name}
              className="flex flex-col items-center gap-3 bg-white/10 rounded-xl p-6"
            >
              <div className="h-20 w-20 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold">
                {member.name[0]}
              </div>
              <p className="font-semibold text-lg">{member.name}</p>
              <p className="text-white/60 text-sm">{member.role}</p>
              <div className="flex gap-3 text-white/50 text-sm">
                {member.socials.github && <a href={member.socials.github} className="hover:text-white transition-colors">GitHub</a>}
                {member.socials.linkedin && <a href={member.socials.linkedin} className="hover:text-white transition-colors">LinkedIn</a>}
                {member.socials.twitter && <a href={member.socials.twitter} className="hover:text-white transition-colors">Twitter</a>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
