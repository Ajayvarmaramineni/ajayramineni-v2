import type { Metadata } from "next";
import AboutClient from "./AboutClient";

export const metadata: Metadata = {
  title: "About",
  description:
    "MS Business Analytics candidate at WPI with 2+ years in business development and data strategy. Learn about Ajay's background, skills, and journey.",
  openGraph: {
    title: "About | Ajay Ramineni",
    description:
      "Analyst by training, founder by choice. MS Business Analytics @ WPI (4.0 GPA) and founder of DataStatz.",
    url: "https://ajayramineni.com/about",
    images: [{ url: "/images/Aj.jpg", width: 1200, height: 630, alt: "Ajay Ramineni" }],
  },
  twitter: {
    title: "About | Ajay Ramineni",
    description:
      "Analyst by training, founder by choice. MS Business Analytics @ WPI (4.0 GPA) and founder of DataStatz.",
    images: ["/images/Aj.jpg"],
  },
  alternates: { canonical: "https://ajayramineni.com/about" },
};

export default function AboutPage() {
  return <AboutClient />;
}
