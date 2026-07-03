const stats = [
  { value: "24", label: "HOURS" },
  { value: "FREE", label: "TO ATTEND" },
  { value: "1–4", label: "PER TEAM" },
];

export default function About() {
  return (
    <section className="flex min-h-[100dvh] flex-col items-center justify-center px-4 py-32">
      <div className="pixel-panel max-w-2xl px-8 py-12 text-center sm:px-12">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/gifs/Earth.gif"
          alt=""
          className="crisp mx-auto mb-8 w-28"
          style={{ animation: "hj-float 6s ease-in-out infinite" }}
        />
        <h2 className="mb-8 font-pixel text-base text-nebula-core sm:text-lg">
          WHAT IS HACKJAM?
        </h2>
        <p className="text-base leading-relaxed text-star-white/85">
          HackJam is a 24-hour hackathon organized by SHPE at the University of
          South Florida, bringing together students from across the region to
          build innovative projects, attend workshops, and connect with
          industry sponsors. Whether you&apos;re a first-time hacker or a
          seasoned builder, HackJam is the place for you.
        </p>
        <div className="mt-10 grid grid-cols-3 gap-6">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col gap-2">
              <span className="font-pixel text-sm text-accent-cyan sm:text-base">
                {s.value}
              </span>
              <span className="font-pixel text-[8px] text-star-white/60">
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
