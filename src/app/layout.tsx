import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ScrollReveal from "@/components/ui/ScrollReveal";
import CursorGlow from "@/components/ui/CursorGlow";
import { getProfile } from "@/lib/projects";
import { SITE_URL } from "@/lib/site";

// 全站一款等宽字体。标题 / 正文 / 等宽三个变量都在 design-tokens.css 里
// 指向它，想换回分开的字体只改那三行。不是可变字体，字重要逐个列：
// 站内实际用到 400（正文）、600（卡片标题）、700（各级标题）。
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-plex-mono",
  display: "swap",
});

// 移动端浏览器地址栏的着色。meta 标签读不了 CSS 变量，这里镜像 --bg。
export const viewport: Viewport = {
  themeColor: "#d6d6d6",
};

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
      className={plexMono.variable}
    >
      <head>
        {/* [data-reveal] 的起始态是 opacity:0，靠 ScrollReveal 揭示。
            脚本没跑的话内容会永远隐藏，所以这里兜一层。 */}
        <noscript>
          <style>{`[data-reveal]{opacity:1 !important;transform:none !important}`}</style>
        </noscript>
      </head>
      <body>
        {/* 挂在 layout 而不是 PageWrapper：全站一个实例，路由切换时不会重挂 */}
        <CursorGlow />
        <ScrollReveal />
        <Header />
        {children}
        <Footer name={profile.name} contact={profile.contact} />
      </body>
    </html>
  );
}
