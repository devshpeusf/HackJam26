import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import MeetTheTeam from "@/components/sections/MeetTheTeam";
import FAQ from "@/components/sections/FAQ";
import Sponsors from "@/components/sections/Sponsors";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <MeetTheTeam />
      <FAQ />
      <Sponsors />
      <Footer />
    </main>
  );
}
