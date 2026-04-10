import type { Metadata } from "next";
import ContactClient from "./ContactClient";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Ajay Ramineni — open to data analytics, business intelligence, and ML roles.",
};

export default function ContactPage() {
  return <ContactClient />;
}
