import type { Metadata } from 'next';
import { Playfair_Display, Raleway } from 'next/font/google';
import './globals.css';

// Serif font
const serif_font = Playfair_Display({
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-serif',
  subsets: ['latin']
});

// Sans-serif font
const sans_Serif = Raleway({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-sans',
  subsets: ['latin']
});

export const metadata: Metadata = {
  title: 'IncApache - Data Visualization',
  description: 'Data visualization web application for IncApache group'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${sans_Serif.variable}\t${serif_font.variable}`}>
        {children}
        <footer className="mt-auto pt-16">
          <div className="flex justify-evenly p-6 bg-primary text-primary-foreground">
            <div className="w-full">
              <div className="w-fit">
                <h1 className="font-serif font-bold text-lg/3">IncApache</h1>
                <h2 className="font-serif text-xs/3 text-end">Group</h2>
              </div>
            </div>
            <p className="w-full text-end text-base/4">
              <span className="font-semibold">University of Genova</span>
              <br /> project for Data Visualization Exam
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
