import type { Metadata } from "next";
import PhotographyClient from "./PhotographyClient";

export const metadata: Metadata = {
  title: "Lens",
  description:
    "Photography and cinematography work by Ajay Ramineni — street, portrait, and cinematic frames.",
};

export default function PhotographyPage() {
  return <PhotographyClient />;
}
