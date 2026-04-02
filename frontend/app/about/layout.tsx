import type { Metadata } from "next";

export const metadata: Metadata = {
  title:       "About DataStatz",
  description:
    "DataStatz is a free data analysis tool built for students and researchers. " +
    "Upload a CSV or Excel file and get instant EDA, cleaning diagnostics, " +
    "scope assessment, and plain-English insights.",
  alternates: {
    canonical: "https://datastatz.com/about",
  },
  openGraph: {
    title:       "About DataStatz",
    description: "The story behind DataStatz - affordable instant data analysis for students.",
    url:         "https://datastatz.com/about",
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
