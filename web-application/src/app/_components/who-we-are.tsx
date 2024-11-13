import Container from '@/components/container';
import { getStaticFile } from '@/utils/general';
import Image from 'next/image';
import SectionTitle from './section-title';

type WhoWeAreTypeData = {
  imageUri: string;
  name: string;
  content: string;
};

const whoWeAreData: WhoWeAreTypeData[] = [
  {
    imageUri: getStaticFile('/who-we-are/spongebob.png'),
    name: 'Alex Valle',
    content:
      'IncApache CEO, he works at the Krusty Krab this is just a hobby for him. group"I hate him"(COO of IncApache group). Whos don\'t like Spongebob?'
  },
  {
    imageUri: getStaticFile('/who-we-are/squiddi.png'),
    name: 'Diego Chiola',
    content:
      'The COO of IncApace Group, like Spongebob works at Krusty Krab, he works on the project against his will because of Spongebob'
  },
  {
    imageUri: getStaticFile('/who-we-are/patrik.png'),
    name: 'Gabriele Berruti',
    content:
      'The Commercial Director of IncApace Group, nobody knows why he works on the project, not even him. He is a friend of Spongebob'
  }
];

export default function WhoWeAre() {
  return (
    <section className="relative mt-32 scroll-mt-24" id="who-we-are">
      <Container className="p-3">
        <div className="flex flex-col flex-wrap gap-6 justify-center items-center md:flex-row">
          {whoWeAreData.map((value, index) => (
            <div
              key={index}
              className="p-6 rounded-2xl transition-all ease-in-out hover:shadow-xl max-w-[350px] bg-card hover:scale-[1.03]"
            >
              <div className="inline-flex gap-6 items-center text-xl font-semibold">
                <Image
                  src={value.imageUri}
                  width={100}
                  height={100}
                  alt="Profile image"
                  className="object-cover rounded-full border size-[60px] bg-background"
                />{' '}
                <h2>{value.name}</h2>
              </div>
              <p className="mt-3 text-pretty">{value.content}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
