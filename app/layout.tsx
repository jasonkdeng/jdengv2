import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { InteractiveGridBackground } from "@/components/interactive-grid-background";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Jason Deng | Portfolio",
  description: "Minimal personal portfolio of Jason Deng",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}>
        <InteractiveGridBackground />
        <div className="relative z-10 mx-auto w-full max-w-[720px] px-6 pt-14 pb-24 text-left sm:px-8 sm:pt-16 sm:pb-28">
          <SiteHeader />
          <div className="mt-5 space-y-4 sm:mt-4 sm:space-y-4">{children}</div>
        </div>
      </body>
    </html>
  );
}
