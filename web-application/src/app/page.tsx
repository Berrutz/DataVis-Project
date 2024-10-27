import HeroSection from "./_components/hero-section";
import HomepageNavbar from "./_components/homepage-nav";
import WhoWeAreSection from "./_components/who-we-are-section";
import AssignmentsSection from "./_components/assignments-section";
import FinalProjectSection from "./_components/final-project-section";
import TechnologicalStachSection from "./_components/technological-stack-section";
import ActiveSectionContextProvider from "@/context/active-section-context-provider";

export default function Home() {
  return (
    <ActiveSectionContextProvider>
      <main >
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
