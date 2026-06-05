import type { Metadata } from "next";
import { Cinzel, Inter } from "next/font/google";
import "./globals.css";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Bete Nway — Ethiopian Orthodox Art Exhibition",
  description: "A premium digital exhibition platform preserving sacred Ethiopian Orthodox art through visual storytelling and cultural showcasing.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cinzel.variable} ${inter.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-luxury-dark text-parchment selection:bg-orthodox-gold selection:text-luxury-dark font-sans">
        {children}
      </body>
    </html>
  );
}

