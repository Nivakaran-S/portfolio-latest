import type { Metadata, Viewport } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import { siteMetadata, personJsonLd } from "@/lib/seo/metadata";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { SmoothScrollProvider } from "@/app/_components/providers/smooth-scroll-provider";
import { MotionProvider } from "@/app/_components/providers/motion-config";
import { ContactDrawerProvider } from "@/app/_components/contact/contact-drawer";
import { ChatWidget } from "@/app/_components/chat/chat-widget";
import { EasterEggs } from "@/app/_components/ui/easter-eggs";

// Skill typography: single-family Inter precision system
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = siteMetadata;

export const viewport: Viewport = {
  themeColor: "#0a0a0c",
  colorScheme: "dark",
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
      data-theme="dark"
      className={`${inter.variable} ${geistMono.variable} h-full antialiased`}
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

        {/* Persistent across route changes. Each page mounts its own
            StoryBackdrop (ember/forge/ink); /about owns FaceRotation. */}
        <EasterEggs />

        <SmoothScrollProvider>
          <MotionProvider>
            <ContactDrawerProvider>
              {children}
              <ChatWidget />
            </ContactDrawerProvider>
          </MotionProvider>
        </SmoothScrollProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd()) }}
        />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
