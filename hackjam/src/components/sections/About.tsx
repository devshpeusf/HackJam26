export default function About() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-6 py-20 text-center text-white">
      <div className="bg-black/40 backdrop-blur-sm rounded-2xl px-10 py-12 max-w-2xl">
        <h2 className="text-4xl font-bold mb-6">About HackJam</h2>
        <p className="text-white/80 text-lg leading-relaxed">
          HackJam is a 24-hour hackathon organized by SHPE, bringing together
          students from across the region to build innovative projects, attend
          workshops, and connect with industry sponsors. Whether you&apos;re a
          first-time hacker or a seasoned builder, HackJam is the place for you.
        </p>
      </div>
    </section>
  );
}
