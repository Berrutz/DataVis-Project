import Hero from "./_components/Hero";
import HomepageNavbar from "./_components/HomepageNavbar";

export default function Home() {
  return (
    <main >
      <div className="absolute w-[150px] sm:w-[240px] aspect-square bg-red-300 left-[10%] top-[10%] z-[-200] rounded-full blur-[80px] opacity-40" />
      <div className="absolute w-[150px] sm:w-[240px] aspect-square bg-blue-600 right-[10%] top-[10%] z-[-200] rounded-full blur-[80px] opacity-40" />
      <div className="absolute w-[150px] sm:w-[240px] aspect-square bg-purple-400 left-[50%] -translate-x-1/2 top-[30%] z-[-200] rounded-full blur-[80px] opacity-40" />

      <HomepageNavbar />
      <Hero />

      <section id="who-are-we" className="h-screen flex items-center justify-center bg-red-50">
        <h1 className="text-6xl font-medium font-serif">Who are we</h1>
      </section>
      <section id="assignments" className="h-screen flex items-center justify-center bg-blue-50">
        <h1 className="text-6xl font-medium font-serif">Assignments</h1>
      </section>
      <section id="final-project" className="h-screen flex items-center justify-center bg-cyan-50">
        <h1 className="text-6xl font-medium font-serif">Final Project</h1>
      </section>
      <section id="technological-stack" className="h-screen flex items-center justify-center bg-orange-50">
        <h1 className="text-6xl font-medium font-serif">Technological Stack</h1>
      </section>
    </main>
  );
}
