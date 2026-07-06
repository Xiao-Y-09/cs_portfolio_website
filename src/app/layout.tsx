import type { Metadata } from "next";
import { Outfit, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getProfile } from "@/lib/projects";

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
  return {
    title: {
      default: title,
      template: "%s — Portfolio",
    },
    description: `CS 作品集 — Projects, experiments, and technical work by ${profile.name}.`,
    metadataBase: new URL("https://your-domain.vercel.app"),
    openGraph: {
      title,
      description: "CS 作品集",
      url: "https://your-domain.vercel.app",
      siteName: `${profile.name} Portfolio`,
      locale: "zh_CN",
      type: "website",
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
      lang="zh-CN"
      className={`${outfit.variable} ${plusJakartaSans.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        <Header />
        {children}
        <Footer name={profile.name} contact={profile.contact} />
      </body>
    </html>
  );
}
