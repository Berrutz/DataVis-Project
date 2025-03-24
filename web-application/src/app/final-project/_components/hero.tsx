import { H1, H2 } from '@/components/headings';

export default function HeroFinalProject() {
  return (
    <section>
      <div className="flex justify-center items-center mt-12">
        <div className="flex flex-col gap-10 items-center lg:w-3/5">
          <h1 className="font-serif text-center text-2xl font-bold xs:text-3xl sm:text-4xl md:text-5xl">
            What's the digitalization level of EU countries?
          </h1>
          <h2 className="text-center text-2xl font-semibold sm:text-3xl">
            An analyses by <a className="text-primary">Inc</a>Apache group
          </h2>
        </div>
      </div>
    </section>
  );
}
