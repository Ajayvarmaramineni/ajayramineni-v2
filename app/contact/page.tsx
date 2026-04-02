import type { Metadata } from "next";
import ContactClient from "./ContactClient";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Ajay Ramineni — open to data analytics, business intelligence, and ML roles.",
  openGraph: {
    title: "Contact | Ajay Ramineni",
    description:
      "Have a project or opportunity in mind? Reach out to Ajay Ramineni.",
    url: "https://ajayramineni.com/contact",
    images: [{ url: "/images/Aj.jpg", width: 1200, height: 630, alt: "Ajay Ramineni" }],
  },
  twitter: {
    title: "Contact | Ajay Ramineni",
    description: "Have a project or opportunity in mind? Reach out to Ajay.",
    images: ["/images/Aj.jpg"],
  },
  alternates: { canonical: "https://ajayramineni.com/contact" },
};

export default function ContactPage() {
  return <ContactClient />;
}
