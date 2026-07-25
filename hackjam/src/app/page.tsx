import IntroGate from "@/components/intro/IntroGate";
import AltitudeHUD from "@/components/AltitudeHUD";
import Navbar from "@/components/Navbar";
import CascadeBackground from "@/components/background/CascadeBackground";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import WorldsSection from "@/components/WorldsSection";
import RocketDescent from "@/components/sections/RocketDescent";
import Judges from "@/components/sections/Judges";
import MeetTheTeam from "@/components/sections/MeetTheTeam";
import FAQ from "@/components/sections/FAQ";
import Footer from "@/components/sections/Footer";

/* The descent (spec §6): outer space → nebula → atmosphere → sunset → grass.
   CascadeBackground paints one continuous gradient behind every section —
   sections only bring their foreground. */
export default function Home() {
  return (
    <>
      {/* One transformable root so the whole site can fly out of the cabinet
          screen as a unit. IntroGate sits after it and layers by z-index. */}
      <div id="site-root">
        <Navbar />
        <main id="top" className="relative w-full max-w-full overflow-x-clip">
          <CascadeBackground />
          <Hero />
          <About />
          <WorldsSection />
          <RocketDescent />
          <Judges />
          <MeetTheTeam />
          <FAQ />
          <Footer />
          <AltitudeHUD />
        </main>
      </div>
      <IntroGate />
    </>
  );
}
