import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { BackgroundLayer } from "@/components/background-layer";
import { SiteFooter } from "@/components/site-footer";
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
  title: "Jason Deng",
  description: "Personal Portfolio of Jason Deng",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}>
        <BackgroundLayer />
        <div className="relative z-10 mx-auto w-full max-w-[720px] px-6 pt-14 pb-24 text-left sm:px-8 sm:pt-16 sm:pb-28">
          <SiteHeader />
          <div className="mt-5 space-y-4 sm:mt-4 sm:space-y-4">{children}</div>
          <div className="mt-4 sm:mt-6">
            <SiteFooter />
          </div>
        </div>
        <Analytics />
      </body>
    </html>
  );
}
