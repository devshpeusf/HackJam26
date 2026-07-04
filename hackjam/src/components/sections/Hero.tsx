import { siteConfig } from "@/config/site";

export default function Hero() {
  return (
    <section className="relative flex min-h-[100dvh] flex-col items-center justify-center px-4 py-24 text-center">
      {/* MLH trust badge — replace with the official season badge embed */}
      <a
        href={siteConfig.mlh.siteUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute right-4 top-0 z-10 bg-void-800 px-3 pb-3 pt-4 font-pixel text-[8px] leading-relaxed text-star-white sm:right-10"
        style={{ borderBottom: "4px solid #ff2e97" }}
      >
        MLH
        <br />
        MEMBER
        <br />
        EVENT
      </a>

      <div className="flex flex-col items-center gap-8">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/gifs/hackjam_logo.gif"
          alt={siteConfig.name}
          className="crisp w-[24rem] max-w-full sm:w-[40rem] lg:w-[48rem]"
          style={{
            animation: "hj-float 5s ease-in-out infinite",
          }}
        />

        <p className="max-w-xl text-base text-star-white/85 sm:text-lg">
          {siteConfig.tagline}
        </p>

        <p className="font-pixel text-[10px] leading-relaxed text-nebula-core sm:text-xs">
          {siteConfig.eventDate} &middot; {siteConfig.venue}
          <br />
          <span className="text-star-white/70">{siteConfig.mlh.label}</span>
        </p>

        <a
          href={siteConfig.registrationUrl}
          className="mt-2 inline-block bg-accent-magenta px-8 py-4 font-pixel text-xs text-void-deep transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:scale-105 active:scale-[0.98]"
          style={{
            boxShadow:
              "0 -4px 0 0 #ff2e97, 0 4px 0 0 #ff2e97, -4px 0 0 0 #ff2e97, 4px 0 0 0 #ff2e97",
          }}
        >
          REGISTER NOW
        </a>
      </div>

      <p
        className="absolute bottom-8 left-1/2 -translate-x-1/2 font-pixel text-[8px] text-star-white/60"
        style={{ animation: "hj-bounce-down 2s ease-in-out infinite" }}
      >
        SCROLL TO BEGIN THE DESCENT &darr;
      </p>
    </section>
  );
}
