import type { Metadata } from "next";
import PortfolioClient from "./PortfolioClient";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "ML pipelines, BI dashboards, and data strategy projects by Ajay Ramineni. Built with Python, SQL, Power BI, and Next.js.",
  openGraph: {
    title: "Portfolio | Ajay Ramineni",
    description:
      "ML pipelines, BI dashboards, and data strategy projects by Ajay Ramineni.",
    url: "https://ajayramineni.com/portfolio",
    images: [{ url: "/images/Aj.jpg", width: 1200, height: 630, alt: "Ajay Ramineni Portfolio" }],
  },
  twitter: {
    title: "Portfolio | Ajay Ramineni",
    description:
      "ML pipelines, BI dashboards, and data strategy projects by Ajay Ramineni.",
    images: ["/images/Aj.jpg"],
  },
  alternates: { canonical: "https://ajayramineni.com/portfolio" },
};

export default function PortfolioPage() {
  return <PortfolioClient />;
}
