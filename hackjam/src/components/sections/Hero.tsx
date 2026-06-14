import { siteConfig } from "@/config/site";

export default function Hero() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-indigo-950 text-white px-6 text-center">
      <h1 className="text-6xl font-bold tracking-tight mb-4">{siteConfig.name}</h1>
      <p className="text-xl text-indigo-300 max-w-xl">{siteConfig.tagline}</p>
      <a
        href={siteConfig.registrationUrl}
        className="mt-8 inline-block rounded-lg bg-indigo-500 px-8 py-3 font-semibold text-white hover:bg-indigo-400 transition-colors"
      >
        Register Now
      </a>
    </section>
  );
}
