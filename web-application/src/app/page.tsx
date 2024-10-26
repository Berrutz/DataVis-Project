import HeroSection from "./_components/hero-section";
import HomepageNavbar from "./_components/homepage-nav";
import ActiveSectionContextProvider from "./context/active-section-context-provider";
import WhoWeAreSection from "./_components/who-we-are-section";
import AssignmentsSection from "./_components/assignments-section";
import FinalProjectSection from "./_components/final-project-section";
import TechnologicalStachSection from "./_components/technological-stack-section";

export default function Home() {
  return (
    <ActiveSectionContextProvider>
      <main >
        <div className="absolute w-[150px] sm:w-[240px] aspect-square bg-red-300 left-[10%] top-[10%] z-[-200] rounded-full blur-[80px] opacity-40" />
        <div className="absolute w-[150px] sm:w-[240px] aspect-square bg-blue-600 right-[10%] top-[10%] z-[-200] rounded-full blur-[80px] opacity-40" />
        <div className="absolute w-[150px] sm:w-[240px] aspect-square bg-purple-400 left-[50%] -translate-x-1/2 top-[30%] z-[-200] rounded-full blur-[80px] opacity-40" />

        <HomepageNavbar />

        <HeroSection />
        <WhoWeAreSection />
        <AssignmentsSection />
        <FinalProjectSection />
        <TechnologicalStachSection />
      </main>
    </ActiveSectionContextProvider>
  );
}
