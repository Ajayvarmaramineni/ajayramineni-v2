import type { Metadata } from "next";
import "./globals.css";
import KeepAlive from "@/components/KeepAlive";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { JsonLd } from "./home-metadata";

const BASE_URL = "https://datastatz.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),

  title: {
    default:  "DataStatz - Instant Data Analysis for Students",
    template: "%s | DataStatz",
  },

  description:
    "Upload a CSV or Excel file and get automatic EDA, data cleaning diagnostics, " +
    "scope assessment, and plain-English insights in under 10 seconds. " +
    "Free statistical analysis tool for students and researchers.",

  keywords: [
    "data analysis", "EDA", "exploratory data analysis", "statistics",
    "CSV analysis", "Excel analysis", "data cleaning", "student data tool",
    "free data analysis", "statistical analysis online", "DataStatz",
    "data insights", "hypothesis testing", "correlation analysis",
    "data science tool", "research analysis", "university data tool",
  ],

  authors:  [{ name: "DataStatz", url: BASE_URL }],
  creator:  "DataStatz",
  publisher: "DataStatz",

  alternates: {
    canonical: BASE_URL,
  },

  icons: {
    icon:     "/icon.svg",
    shortcut: "/icon.svg",
    apple:    "/icon.svg",
  },

  openGraph: {
    type:        "website",
    url:         BASE_URL,
    siteName:    "DataStatz",
    title:       "DataStatz - Instant Data Analysis for Students",
    description:
      "Upload any CSV or Excel file and get a full statistical analysis in seconds. " +
      "EDA, cleaning diagnostics, scope assessment, and plain-English insights. Free.",
    images: [
      {
        url:    "/og-image.png",
        width:  1200,
        height: 630,
        alt:    "DataStatz - Instant Data Analysis",
      },
    ],
    locale: "en_US",
  },

  twitter: {
    card:        "summary_large_image",
    title:       "DataStatz - Instant Data Analysis for Students",
    description:
      "Upload a CSV or Excel file and get automatic EDA, cleaning diagnostics, " +
      "scope assessment, and plain-English insights in under 10 seconds.",
    images:      ["/og-image.png"],
    creator:     "@datastatz",
  },

  robots: {
    index:               true,
    follow:              true,
    googleBot: {
      index:             true,
      follow:            true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet":       -1,
    },
  },

  verification: {
    // Add your Google Search Console verification token here after setup:
    // google: "YOUR_GOOGLE_VERIFICATION_TOKEN",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#0a0f1e] text-slate-100 antialiased">
        <JsonLd />
        <KeepAlive />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
