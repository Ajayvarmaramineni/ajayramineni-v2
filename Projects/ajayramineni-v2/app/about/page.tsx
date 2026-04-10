import type { Metadata } from "next";
import AboutClient from "./AboutClient";

export const metadata: Metadata = {
  title: "About",
  description:
    "MS Business Analytics candidate at WPI with 2+ years in business development and data strategy. Learn about Ajay's background, skills, and journey.",
};

export default function AboutPage() {
  return <AboutClient />;
}
