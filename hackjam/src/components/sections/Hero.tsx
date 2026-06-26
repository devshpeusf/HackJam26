import { siteConfig } from "@/config/site";

export default function Hero() {
  return (
    <section className="flex-1 min-h-0 flex flex-col items-center justify-center px-6 text-center text-white">
      <div className="bg-black/40 backdrop-blur-sm rounded-2xl px-10 py-12 flex flex-col items-center gap-6">
        <h1 className="text-6xl font-bold tracking-tight">{siteConfig.name}</h1>
        <p className="text-xl text-white/80 max-w-xl">{siteConfig.tagline}</p>
        <a
          href={siteConfig.registrationUrl}
          className="inline-block rounded-lg bg-indigo-500 px-8 py-3 font-semibold text-white hover:bg-indigo-400 transition-colors"
        >
          Register Now
        </a>
      </div>
    </section>
  );
}
