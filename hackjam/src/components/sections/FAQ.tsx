import { siteConfig } from "@/config/site";

export default function FAQ() {
  return (
    <section className="flex-1 min-h-0 flex flex-col items-center justify-center px-6 text-white">
      <div className="bg-black/40 backdrop-blur-sm rounded-2xl px-10 py-12 max-w-2xl w-full">
        <h2 className="text-4xl font-bold mb-10 text-center">FAQ</h2>
        <div className="flex flex-col gap-5">
          {siteConfig.faq.map((item) => (
            <div key={item.question} className="bg-white/10 rounded-xl p-6">
              <p className="font-semibold text-lg mb-2">{item.question}</p>
              <p className="text-white/70">{item.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
