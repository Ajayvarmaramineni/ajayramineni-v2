import type { Metadata } from "next";
import PhotographyClient from "./PhotographyClient";

export const metadata: Metadata = {
  title: "Lens",
  description:
    "Photography and cinematography work by Ajay Ramineni — street, portrait, and cinematic frames.",
  openGraph: {
    title: "Lens | Ajay Ramineni",
    description:
      "Street, portrait, and cinematic photography by Ajay Ramineni.",
    url: "https://ajayramineni.com/photography",
    images: [{ url: "/images/hero.jpeg", width: 1200, height: 630, alt: "Photography by Ajay Ramineni" }],
  },
  twitter: {
    title: "Lens | Ajay Ramineni",
    description: "Street, portrait, and cinematic photography by Ajay Ramineni.",
    images: ["/images/hero.jpeg"],
  },
  alternates: { canonical: "https://ajayramineni.com/photography" },
};

export default function PhotographyPage() {
  return <PhotographyClient />;
}
