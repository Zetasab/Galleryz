import type { Metadata } from "next";
import { Space_Grotesk, Geist_Mono } from "next/font/google";
import { Nav } from "@/components/nav";
import { InfoMenu } from "@/components/info-menu";
import { VisitTracker } from "@/components/visit-tracker";
import { Toaster } from "@/components/ui/sonner";
import { SplashScreen } from "@/components/splash-screen";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const title = "Galleryz - Galería de imágenes";
const description =
  "Una galería de imágenes y videos minimalista, con búsqueda, colecciones y favoritos, impulsada por la API de Pexels.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  applicationName: "Galleryz",
  appleWebApp: {
    capable: true,
    title: "Galleryz",
    statusBarStyle: "black-translucent",
  },
  openGraph: {
    title,
    description,
    url: "/",
    siteName: "Galleryz",
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SplashScreen />
        <Nav />
        {children}
        <InfoMenu />
        <VisitTracker />
        <Toaster position="bottom-left" />
      </body>
    </html>
  );
}
