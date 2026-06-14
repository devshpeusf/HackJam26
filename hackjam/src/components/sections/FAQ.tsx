import { siteConfig } from "@/config/site";

export default function FAQ() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-teal-950 text-white px-6">
      <h2 className="text-4xl font-bold mb-12">FAQ</h2>
      <div className="flex flex-col gap-6 max-w-2xl w-full">
        {siteConfig.faq.map((item) => (
          <div key={item.question} className="bg-teal-900/50 rounded-xl p-6">
            <p className="font-semibold text-lg mb-2">{item.question}</p>
            <p className="text-teal-300">{item.answer}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
