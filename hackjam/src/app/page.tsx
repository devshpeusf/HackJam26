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
      {/* Sections now flow naturally down the page. The background is pure CSS,
          defined on `body` in globals.css (search for "site background"). */}
      <main className="relative w-full flex flex-col">
        <Hero />
        <About />
        <MeetTheTeam />
        <FAQ />
        <Sponsors />
        <Footer />
      </main>
    </>
  );
}
