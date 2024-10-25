import Hero from "./_components/Hero";
import HomepageNavbar from "./_components/HomepageNavbar";

export default function Home() {
  return (
    <main className="h-[300vh]">
      <HomepageNavbar />
      <Hero /> 
    </main>
  );
}
