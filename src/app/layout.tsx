import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";

import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const siteName = "mapcn";
const creator = "https://github.com/AnmolSaini16";
const siteDescription =
  "A collection of beautifully designed, accessible, and customizable map components. Built on MapLibre GL. Styled with Tailwind CSS. Works with shadcn/ui.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "mapcn - Beautiful maps made simple",
    template: "%s - mapcn",
  },
  description: siteDescription,
  keywords: [
    "react map",
    "next.js map",
    "maplibre",
    "map components",
    "shadcn map",
    "tailwind map",
    "react map library",
    "typescript map",
    "interactive maps",
    "map markers",
    "map controls",
  ],
  authors: [
    { name: "Anmoldeep Singh", url: "https://github.com/AnmolSaini16" },
  ],
  creator: "Anmoldeep Singh",
  publisher: "mapcn",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: siteName,
    title: "mapcn - Beautiful maps made simple",
    description: siteDescription,
    images: [
      {
        url: "/banner.png",
        width: 1200,
        height: 630,
        alt: "mapcn - Beautiful maps, made simple",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "mapcn - Beautiful maps made simple",
    description: siteDescription,
    creator: creator,
    images: ["/banner.png"],
  },
  alternates: {
    canonical: siteUrl,
  },
  category: "technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans antialiased min-h-screen flex flex-col">
        <ThemeProvider>
          <div className="flex-1">{children}</div>
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
