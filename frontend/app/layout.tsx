import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Caveat } from "next/font/google";
import "./globals.css";
import {
  siteMetadata,
  personJsonLd,
  websiteJsonLd,
  siteNavigationJsonLd, jsonLdHtml } from "@/lib/seo/metadata";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { MotionProvider } from "@/app/_components/providers/motion-config";
import { SmoothScroll } from "@/app/_components/providers/smooth-scroll";
import { ContactDrawerProvider } from "@/app/_components/contact/contact-drawer";
import { ChatWidget } from "@/app/_components/chat/chat-widget";
import { EasterEggs } from "@/app/_components/ui/easter-eggs";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = siteMetadata;

export const viewport: Viewport = {
  themeColor: "#f6f4ee",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="light"
      className={`${geistSans.variable} ${geistMono.variable} ${caveat.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-void text-fg">
        <noscript>
          <style>{`[style*="opacity:0"],[style*="opacity: 0"]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-elevated focus:px-4 focus:py-2 focus:text-fg"
        >
          Skip to content
        </a>
        <EasterEggs />

        <MotionProvider>
          <SmoothScroll>
            <ContactDrawerProvider>
              {children}
              <ChatWidget />
            </ContactDrawerProvider>
          </SmoothScroll>
        </MotionProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdHtml(personJsonLd()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdHtml(websiteJsonLd()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: jsonLdHtml(siteNavigationJsonLd()),
          }}
        />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
