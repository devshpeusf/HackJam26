const stats = [
  { value: "24", label: "HOURS" },
  { value: "FREE", label: "TO ATTEND" },
  { value: "1–4", label: "PER TEAM" },
];

export default function About() {
  return (
    <section
      id="about"
      className="mt-16 flex min-h-[100dvh] scroll-mt-14 flex-col items-center justify-center px-4 py-32 sm:mt-48"
    >
      <div className="grid w-full max-w-7xl items-start gap-12 px-2 py-10 sm:px-6 lg:grid-cols-[0.95fr_1.15fr] lg:gap-16 xl:max-w-[88rem]">
        <div className="relative flex min-h-72 items-start justify-center px-6 pb-10 pt-36 sm:pt-40">
          <div
            aria-hidden
            className="absolute h-80 w-80 rounded-full border border-accent-cyan/15 sm:h-96 sm:w-96"
            style={{ animation: "hj-ring-pulse 4s ease-in-out infinite" }}
          />
          <div
            aria-hidden
            className="absolute h-60 w-60 rotate-12 rounded-full border border-nebula-core/18 sm:h-72 sm:w-72"
          />
          <div
            className="relative z-10 w-56 sm:w-72"
            style={{ animation: "hj-float 6s ease-in-out infinite" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/gifs/Earth.gif" alt="" className="crisp w-full" />
            {/* mascot levitating above the planet, on its own float cycle */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/mascot/hackjam-mascot-levitate.gif"
              alt=""
              className="crisp absolute -top-42 left-1/2 z-10 w-24  -translate-x-1/2 sm:-top-40 sm:w-32"
              style={{ animation: "hj-float 4s ease-in-out 0.8s infinite" }}
            />
          </div>
        </div>

        <div className="flex flex-col text-left">
          <span className="pixel-chip mb-5 w-fit text-accent-cyan">MISSION BRIEF</span>
          <h2 className="font-pixel text-lg leading-relaxed text-nebula-core sm:text-2xl">
            WHAT IS HACKJAM?
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-8 text-star-white/84">
            HackJam is a 24-hour hackathon organized by SHPE at the University of
            South Florida, bringing together students from across the region to
            build innovative projects, attend workshops, and connect with
            industry sponsors.
          </p>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-star-white/64">
            First-time hackers and seasoned builders work side by side, with the
            room, food, mentors, and launch window handled for you.
          </p>

          <div className="mt-9 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {stats.map((s, i) => (
              <div
                key={s.label}
                className="relative bg-void-deep/65 px-5 py-5"
                style={{
                  boxShadow:
                    "0 -3px 0 0 var(--color-void-700), 0 3px 0 0 var(--color-void-700), -3px 0 0 0 var(--color-void-700), 3px 0 0 0 var(--color-void-700)",
                }}
              >
                <span className="absolute right-3 top-3 font-pixel text-[7px] text-star-white/24">
                  0{i + 1}
                </span>
                <span className="block font-pixel text-base text-accent-cyan sm:text-lg">
                  {s.value}
                </span>
                <span className="mt-3 block font-pixel text-[8px] leading-relaxed text-star-white/58">
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
