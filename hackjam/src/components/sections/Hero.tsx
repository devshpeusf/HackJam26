import { siteConfig } from "@/config/site";

export default function Hero() {
  return (
    <section className="relative flex min-h-[100dvh] flex-col items-center justify-start px-4 pb-20 pt-24 text-center sm:pt-28">
      <div className="flex flex-col items-center gap-8">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo/hackjam26-words.png"
          alt={siteConfig.name}
          className="crisp w-[min(92vw,64rem)] max-w-full"
          style={{
            animation: "hj-float 5s ease-in-out infinite",
          }}
        />

        <p className="font-pixel text-[12px] leading-relaxed text-nebula-core sm:text-[16px]">
          {siteConfig.eventDate} &middot; {siteConfig.venue}
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
