import type { Metadata } from "next";
import ReviewsPageContent from "@/components/ReviewsPage/ReviewsPageContent";

export const metadata: Metadata = {
  title: "Reviews",
  description:
    "What teachers, event teams, and organisations say about using CertCascade to generate certificates, report cards, and IDs in bulk.",
};

export default function ReviewsPage() {
  return <ReviewsPageContent />;
}