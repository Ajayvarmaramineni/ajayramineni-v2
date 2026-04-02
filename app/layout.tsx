import type { Metadata } from "next";
import { Inter, Barlow_Condensed, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import CursorRing from "@/components/ui/CursorRing";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const barlow = Barlow_Condensed({
  subsets: ["latin"],
  variable: "--font-barlow",
  weight: ["400", "600", "700", "800", "900"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  weight: ["400", "500"],
  display: "swap",
});

const BASE_URL = "https://ajayramineni.com";
const OG_IMAGE = "/images/Aj.jpg";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Ajay Ramineni — Data Strategist & ML Enthusiast",
    template: "%s | Ajay Ramineni",
  },
  description:
    "MS Business Analytics @ WPI · Data Strategist · ML Engineer · Turning raw data into decisions that matter.",
  keywords: [
    "Ajay Ramineni",
    "Data Analytics",
    "Machine Learning",
    "Business Intelligence",
    "Power BI",
    "Python",
    "WPI",
    "Business Analyst",
    "DataStatz",
  ],
  authors: [{ name: "Ajay Ramineni", url: BASE_URL }],
  creator: "Ajay Ramineni",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    title: "Ajay Ramineni — Data Strategist & ML Enthusiast",
    description:
      "MS Business Analytics @ WPI · Turning raw data into decisions that matter.",
    siteName: "Ajay Ramineni",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "Ajay Ramineni" }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@withloveeajay",
    creator: "@withloveeajay",
    title: "Ajay Ramineni — Data Strategist & ML Enthusiast",
    description: "MS Business Analytics @ WPI · Data Strategist · ML Engineer",
    images: [OG_IMAGE],
  },
  icons: {
    icon: "/icon.svg",
    apple: "/images/Aj.jpg",
  },
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${barlow.variable} ${jetbrains.variable}`}
    >
      <head>
        {/* Google Analytics 4 */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-X1WMTDN4TH"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-X1WMTDN4TH');
            `,
          }}
        />
      </head>
      <body className="bg-[#080808] text-[#f8f8f8] antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "Person",
                name: "Ajay Ramineni",
                url: BASE_URL,
                image: `${BASE_URL}/images/Aj.jpg`,
                sameAs: [
                  "https://linkedin.com/in/ajayramineni2808",
                  "https://github.com/ajayvarmaramineni",
                  "https://twitter.com/withloveeajay",
                ],
                jobTitle: "Data & Business Analyst",
                worksFor: {
                  "@type": "Organization",
                  name: "DataStatz",
                  url: "https://datastatz.com",
                },
                alumniOf: {
                  "@type": "CollegeOrUniversity",
                  name: "Worcester Polytechnic Institute",
                  url: "https://www.wpi.edu",
                },
              },
              {
                "@context": "https://schema.org",
                "@type": "WebSite",
                name: "Ajay Ramineni",
                url: BASE_URL,
                description:
                  "Portfolio of Ajay Ramineni — Data Strategist, ML Engineer, and Founder of DataStatz.",
              },
            ]),
          }}
        />
        <CursorRing />
        <div className="noise-overlay" />
        <Nav />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
