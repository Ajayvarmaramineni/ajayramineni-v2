import type { Metadata } from "next";

export const metadata: Metadata = {
  title:       "Privacy Policy",
  description:
    "DataStatz privacy policy. Learn how we collect, use, and protect your data " +
    "when you use our free statistical analysis platform.",
  alternates: {
    canonical: "https://datastatz.com/privacy",
  },
  openGraph: {
    title:       "Privacy Policy - DataStatz",
    description: "DataStatz privacy policy and data practices.",
    url:         "https://datastatz.com/privacy",
  },
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
