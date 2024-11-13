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
      </body>
    </html>
  );
}
