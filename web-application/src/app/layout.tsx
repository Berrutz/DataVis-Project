import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";

// // Serif font
// const serif_font = Abril_Fatface({
//   weight: "400",
//   variable: "--font-serif",
//   subsets: ["latin"],
// });
//
// // Sans-serif font 
// const sans_Serif = Lato({
//   weight: ["100", "300", "400", "700", "900"],
//   variable: "--font-sans",
//   subsets: ["latin"],
// });

// Serif font
const serif_font = Space_Grotesk({
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-serif",
  subsets: ["latin"],
});

// Sans-serif font 
const sans_Serif = Inter({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "IncApache - Data Visualization",
  description: "Data visualization web application for IncApache group",
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
        <ThemeProvider
          attribute="class"
          enableSystem
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
