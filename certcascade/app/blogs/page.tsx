import type { Metadata } from "next";
import Link from "next/link";
import { HiOutlineDocumentText } from "react-icons/hi";
import Container from "@/components/shared/Container";

export const metadata: Metadata = {
  title: "Blog",
  description: "Articles and updates from CertCascade.",
};

export default function BlogsPage() {
  return (
    <main className="flex flex-1 flex-col">
      <section
        aria-labelledby="blog-heading"
        className="border-b border-gray-200 bg-white py-16 text-center md:py-20"
      >
        <Container className="max-w-2xl">
          <h1
            id="blog-heading"
            className="text-balance text-4xl font-extrabold text-gray-900 sm:text-5xl"
          >
            Blog
          </h1>
          <p className="mt-5 text-base leading-relaxed text-(--text-gray) sm:text-lg">
            Guides and updates on making certificates, report cards, and IDs in
            bulk.
          </p>
        </Container>
      </section>

      <section className="flex flex-1 items-center bg-(--bg) py-16 md:py-24">
        <Container>
          <div className="mx-auto max-w-lg rounded-2xl border border-gray-200 bg-white px-8 py-12 text-center shadow-sm">
            <span
              aria-hidden="true"
              className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-orange-50 text-(--brand-orange-ink)"
            >
              <HiOutlineDocumentText className="h-6 w-6" />
            </span>
            <h2 className="mt-5 text-xl font-bold text-gray-900">
              No posts yet
            </h2>
            <p className="mt-2 text-base leading-relaxed text-(--text-gray)">
              We haven&apos;t published any articles yet. Check back soon, or
              start generating your documents right away.
            </p>
            <Link
              href="/"
              className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl bg-(--brand-orange-ink) px-6 py-3 text-sm font-semibold text-white outline-none transition-[filter] duration-200 hover:brightness-110 focus-visible:ring-4 focus-visible:ring-(--brand-orange)/40"
            >
              Back to home
            </Link>
          </div>
        </Container>
      </section>
    </main>
  );
}
