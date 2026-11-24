import type { Metadata } from "next";
import FaqsPageContent from "@/components/FaqsPage/FaqsPageContent";

export const metadata: Metadata = {
  title: "FAQs",
  description:
    "Answers to common questions about CertCascade: templates, CSV files, fonts, privacy, and downloading your certificates as a ZIP.",
};

export default function FAQsPage() {
  return <FaqsPageContent />;
}
