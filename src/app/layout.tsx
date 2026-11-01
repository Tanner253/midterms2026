import type { Metadata, Viewport } from "next";
import { Archivo_Narrow, Big_Shoulders, IBM_Plex_Mono, Permanent_Marker, Public_Sans } from "next/font/google";
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import Splash from "@/components/Splash";
import { SITE } from "@/config/site";
import { DEMO } from "@/lib/market";
import { MarketProvider } from "@/lib/market-context";
import { share } from "@/lib/og";
import { ENTERED_SCRIPT } from "@/lib/splash";
import "./globals.css";

const head = Big_Shoulders({ weight: ["800", "900"], subsets: ["latin"], variable: "--ff-head" });
const narrow = Archivo_Narrow({ weight: ["500", "600", "700"], subsets: ["latin"], variable: "--ff-narrow" });
const body = Public_Sans({ subsets: ["latin"], variable: "--ff-body" });
const mono = IBM_Plex_Mono({ weight: ["500", "700"], subsets: ["latin"], variable: "--ff-mono" });
const hand = Permanent_Marker({ weight: "400", subsets: ["latin"], variable: "--ff-hand" });

const description = `The 2026 midterms on-chain. One memecoin per candidate in the 12 biggest races, all feeding $${SITE.ticker}. Exclusively on pump.fun.`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: `${SITE.name} | $${SITE.ticker}`, template: `%s | ${SITE.name}` },
  description,
  ...share(`${SITE.name} | $${SITE.ticker}`, description),
};

export const viewport: Viewport = { themeColor: "#f2f4ee", colorScheme: "light" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: ENTERED_SCRIPT }} />
      </head>
      <body className={`${head.variable} ${narrow.variable} ${body.variable} ${mono.variable} ${hand.variable} font-sans antialiased`}>
        <MarketProvider>
          {DEMO && (
            <div className="bg-mark px-4 py-1.5 text-center font-narrow text-sm font-bold uppercase tracking-[0.16em] text-paper">
              Preview mode · demo numbers, not real market data
            </div>
          )}
          <Nav />
          <main className="pb-16">{children}</main>
          <Footer />
          <Splash />
        </MarketProvider>
      </body>
    </html>
  );
}
