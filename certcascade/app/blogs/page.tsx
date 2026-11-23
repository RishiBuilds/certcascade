import type { Metadata } from "next";
import Container from "@/components/shared/Container";

export const metadata: Metadata = {
  title: "Blog",
  description: "Articles and updates from CertCascade.",
};

export default function BlogsPage() {
  return (
    <main className="flex-1 py-16 md:py-24">
      <Container>
        <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          Blog
        </h1>
        <p className="mt-4 text-base text-(--text-gray)">
          No posts yet. Check back soon.
        </p>
      </Container>
    </main>
  );
}
