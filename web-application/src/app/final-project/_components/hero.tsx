import { H1, H2 } from '@/components/headings';

export default function HeroFinalProject() {
  return (
    <section className="mb-6 sm:mb-12">
      <div className="flex justify-center items-center mt-12 text-pretty">
        <div className="flex flex-col gap-10 items-center lg:w-3/5">
          <h1 className="font-serif text-2xl font-bold text-center sm:text-4xl md:text-5xl xs:text-3xl">
            What's the digitalization level of EU countries?
          </h1>
          <h2 className="text-2xl font-semibold text-center sm:text-3xl">
            An analyses by <a className="text-primary">Inc</a>Apache group
          </h2>
        </div>
      </div>
    </section>
  );
}
