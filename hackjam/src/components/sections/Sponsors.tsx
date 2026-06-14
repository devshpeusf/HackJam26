import { siteConfig } from "@/config/site";

export default function Sponsors() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-amber-950 text-white px-6">
      <h2 className="text-4xl font-bold mb-12">Our Sponsors</h2>
      <div className="flex flex-wrap gap-8 justify-center max-w-2xl">
        {siteConfig.sponsors.map((sponsor) => (
          <a
            key={sponsor.name}
            href={sponsor.url}
            className="flex items-center justify-center h-28 w-52 rounded-xl bg-amber-900/50 border border-amber-800 hover:border-amber-500 transition-colors"
          >
            {sponsor.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={sponsor.logo} alt={sponsor.name} className="max-h-16 max-w-full" />
            ) : (
              <span className="font-semibold text-amber-300">{sponsor.name}</span>
            )}
          </a>
        ))}
      </div>
    </section>
  );
}
