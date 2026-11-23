import type { Metadata } from "next";
import Container from "@/components/shared/Container";

export const metadata: Metadata = {
  title: "FAQs",
  description: "Frequently asked questions about CertCascade.",
};

export default function FAQsPage() {
  return (
    <main className="flex-1 py-16 md:py-24">
      <Container>
        <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          Frequently asked questions
        </h1>
        <p className="mt-4 text-base text-(--text-gray)">
          This page is coming soon. In the meantime, feel free to reach out at{" "}
          <a
            href="mailto:rishi.chaurasia.dev@gmail.com"
            className="font-medium text-(--brand-orange-ink) underline underline-offset-2 hover:opacity-80"
          >
            rishi.chaurasia.dev@gmail.com
          </a>
          .
        </p>
      </Container>
    </main>
  );
}
