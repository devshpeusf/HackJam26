import LoadingScreen from "@/components/LoadingScreen";
import CascadeBackground from "@/components/background/CascadeBackground";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import WorldsSection from "@/components/WorldsSection";
import RocketDescent from "@/components/sections/RocketDescent";
import Sponsors from "@/components/sections/Sponsors";
import MeetTheTeam from "@/components/sections/MeetTheTeam";
import FAQ from "@/components/sections/FAQ";
import Footer from "@/components/sections/Footer";

/* The descent (spec §6): outer space → nebula → atmosphere → sunset → grass.
   CascadeBackground paints one continuous gradient behind every section —
   sections only bring their foreground. */
export default function Home() {
  return (
    <>
      <LoadingScreen />
      <main className="relative w-full max-w-full overflow-x-clip">
        <CascadeBackground />
        <Hero />
        <About />
        <WorldsSection />
        <RocketDescent />
        <Sponsors />
        <MeetTheTeam />
        <FAQ />
        <Footer />
      </main>
    </>
  );
}
