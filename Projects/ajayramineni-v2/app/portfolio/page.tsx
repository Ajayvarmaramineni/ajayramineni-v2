import type { Metadata } from "next";
import PortfolioClient from "./PortfolioClient";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "ML pipelines, BI dashboards, and data strategy projects by Ajay Ramineni.",
};

export default function PortfolioPage() {
  return <PortfolioClient />;
}
