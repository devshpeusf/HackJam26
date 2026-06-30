import { siteConfig } from "@/config/site";

export default function Sponsors() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-6 py-20 text-white">
      <div className="bg-black/40 backdrop-blur-sm rounded-2xl px-10 py-12 max-w-2xl w-full">
        <h2 className="text-4xl font-bold mb-10 text-center">Our Sponsors</h2>
        <div className="flex flex-wrap gap-6 justify-center">
          {siteConfig.sponsors.map((sponsor) => (
            <a
              key={sponsor.name}
              href={sponsor.url}
              className="flex items-center justify-center h-28 w-52 rounded-xl bg-white/10 border border-white/20 hover:border-white/50 transition-colors"
            >
              {sponsor.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={sponsor.logo} alt={sponsor.name} className="max-h-16 max-w-full" />
              ) : (
                <span className="font-semibold text-white/80">{sponsor.name}</span>
              )}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
