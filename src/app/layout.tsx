import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import Script from "next/script";

const title =
  "Free AI Content Idea Generator 2025 | TikTok, Instagram, YouTube | TrendSpark AI";
const description =
  "Generate unlimited, brand-new content ideas for TikTok, Instagram, YouTube, and more with TrendSpark AI. Our free, offline multi-tool includes a hashtag generator and caption templates to supercharge your social media presence.";

export const metadata: Metadata = {
  title: title,
  description: description,
  keywords: [
    "AI content generator",
    "content idea generator",
    "TikTok ideas",
    "Instagram ideas",
    "YouTube ideas",
    "social media ideas",
    "free content ideas",
    "TrendSpark AI",
    "hashtag generator",
    "caption templates",
  ],
  openGraph: {
    title: title,
    description: description,
    type: "website",
    url: "https://trendspark.ai",
    images: [
      {
        url: "https://trendsparkai.work/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "TrendSpark AI - Content Idea Generator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: title,
    description: description,
    images: ["https://trendsparkai.work/twitter-image.jpg"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "TrendSpark AI",
  description: description,
  applicationCategory: "BusinessApplication",
  operatingSystem: "Any",
  browserRequirements: "Requires a modern web browser.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-body antialiased">
        {children}

        <Script src="https://www.effectivegatecpm.com/ifh827nw?key=dc52fbe50ae6cfd56dee1359b404d16b" strategy="afterInteractive" />
        <Script src="//pl28147903.effectivegatecpm.com/f2/ab/80/f2ab80d78dcc7119f86ed7a01d34d4e6.js" strategy="afterInteractive" />
        <Script src="//pl28094365.effectivegatecpm.com/6eaa19d8a6824496a6dfeea489379494/invoke.js" strategy="afterInteractive" data-cfasync="false" async />
        <div id="container-6eaa19d8a6824496a6dfeea489379494" className="my-12 text-center" />
        
        <Toaster />
      </body>
    </html>
  );
}
