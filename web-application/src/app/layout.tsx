import type { Metadata } from "next";
import { Abril_Fatface, Lato } from "next/font/google";
import "./globals.css";

// Serif font
const serif_font = Abril_Fatface({
  weight: "400",
  variable: "--font-serif",
  subsets: ["latin"],
});

// Sans-serif font 
const sans_Serif = Lato({
  weight: ['100', '300', '400', '700', '900'],
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Data Visualization",
  description: "Data visualization web application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${sans_Serif.variable} ${serif_font.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
