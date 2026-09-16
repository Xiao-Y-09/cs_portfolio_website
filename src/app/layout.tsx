import type { Metadata } from "next";
import { Outfit, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ParticleField from "@/components/ui/ParticleField";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { getProfile } from "@/lib/projects";
import { SITE_URL } from "@/lib/site";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export function generateMetadata(): Metadata {
  const profile = getProfile();
  const title = `${profile.name} — Portfolio`;
  const summary = `Projects, experiments, and technical work by ${profile.name}.`;
  const ogAlt = `${profile.name} — Computer Science portfolio`;
  return {
    title: {
      default: title,
      template: "%s — Portfolio",
    },
    description: `Projects, experiments, and technical work by ${profile.name} — ${profile.title}.`,
    metadataBase: new URL(SITE_URL),
    openGraph: {
      title,
      description: summary,
      url: SITE_URL,
      siteName: `${profile.name} Portfolio`,
      locale: "en_US",
      type: "website",
      // Set by hand: the card is a route handler at /og.png rather than
      // Next's opengraph-image convention, so nothing injects this for us.
      // See src/app/og.png/route.tsx for why.
      images: [
        { url: "/og.png", width: 1200, height: 630, alt: ogAlt },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: summary,
      images: [{ url: "/og.png", alt: ogAlt }],
    },
    robots: { index: true, follow: true },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const profile = getProfile();
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${plusJakartaSans.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        {/* [data-reveal] 的起始态是 opacity:0，靠 ScrollReveal 揭示。
            脚本没跑的话内容会永远隐藏，所以这里兜一层。 */}
        <noscript>
          <style>{`[data-reveal]{opacity:1 !important;transform:none !important}`}</style>
        </noscript>
      </head>
      <body>
        {/* 挂在 layout 而不是 PageWrapper：全站一个实例，路由切换时不会重挂、粒子不会重排 */}
        <ParticleField />
        <ScrollReveal />
        <Header />
        {children}
        <Footer name={profile.name} contact={profile.contact} />
      </body>
    </html>
  );
}
