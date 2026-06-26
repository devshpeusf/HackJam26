import LoadingScreen from "@/components/LoadingScreen";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import MeetTheTeam from "@/components/sections/MeetTheTeam";
import FAQ from "@/components/sections/FAQ";
import Sponsors from "@/components/sections/Sponsors";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <LoadingScreen />
      {/* #0c3a2a (the image's bottom green) is the fallback so any minor overflow
          below the grass blends in instead of flashing white. */}
      <div className="relative w-full" style={{ backgroundColor: "#0c3a2a" }}>
        {/* In normal flow at w-full h-auto: always shows the WHOLE image scaled
            to the current screen width — full on mobile, full on desktop, never
            cropped, never zoomed past 1x. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/background/cascade_hq.webp"
          alt=""
          className="w-full h-auto block select-none pointer-events-none"
          style={{ imageRendering: "auto" }}
          loading="eager"
          fetchPriority="high"
        />
        {/* Overlay covers the exact same box; the six sections are flex children
            that split that height, so the Footer ends at the image bottom. */}
        <div className="absolute inset-0 z-10 flex flex-col">
          <Hero />
          <About />
          <MeetTheTeam />
          <FAQ />
          <Sponsors />
          <Footer />
        </div>
      </div>
    </>
  );
}
