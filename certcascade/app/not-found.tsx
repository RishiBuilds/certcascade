import type { Metadata } from "next";
import Link from "next/link";
import { BsArrowLeft } from "react-icons/bs";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

const focusRing =
  "outline-none focus-visible:ring-4 focus-visible:ring-(--brand-orange)/40";

export default function NotFound() {
  return (
    <main className="flex flex-1 items-center justify-center bg-white px-6 py-16 md:py-24">
      <div className="mx-auto max-w-lg text-center">
        <div
          aria-hidden="true"
          className="relative mx-auto mb-12 w-60 sm:w-72"
        >
          <div className="absolute inset-0 translate-x-3 translate-y-3 rotate-[3deg] rounded-2xl border border-gray-200 bg-white" />
          <div className="absolute inset-0 translate-x-1.5 translate-y-1.5 rotate-[1.5deg] rounded-2xl border border-gray-200 bg-white" />
          <div className="relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-(--brand-orange) bg-orange-50/50 px-6 py-10 shadow-sm">
            <span className="text-7xl font-extrabold leading-none text-(--brand-orange-ink) sm:text-8xl">
              404
            </span>
            <span className="mt-3 rounded-full bg-white px-3 py-1 text-xs font-medium text-(--text-gray)">
              Page not found
            </span>
          </div>
        </div>

        <h1 className="text-balance text-3xl font-extrabold text-gray-900 sm:text-4xl">
          This page isn&apos;t here
        </h1>
        <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-(--text-gray)">
          The link may be broken, or the page may have moved. Head back home
          to generate your documents, or check the FAQs for help.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-(--brand-orange-ink) px-6 py-3 text-sm font-semibold text-white transition-[filter] duration-200 hover:brightness-110 ${focusRing}`}
          >
            <BsArrowLeft aria-hidden="true" className="h-4 w-4" />
            Back to home
          </Link>
          <Link
            href="/faqs"
            className={`inline-flex min-h-11 items-center justify-center rounded-xl border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-900 transition-colors duration-200 hover:bg-gray-50 ${focusRing}`}
          >
            Read the FAQs
          </Link>
        </div>
      </div>
    </main>
  );
}