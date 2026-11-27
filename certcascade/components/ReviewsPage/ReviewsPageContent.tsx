"use client";

import { useState } from "react";
import { BsGithub, BsStar, BsStarFill, BsStarHalf } from "react-icons/bs";
import { HiOutlineChatAlt2 } from "react-icons/hi";
import Container from "@/components/shared/Container";
import { reviews, type Review } from "@/data/reviews";

const FEEDBACK_EMAIL = "rishi.chaurasia.dev@gmail.com";
const REPO_URL = "https://github.com/RishiBuilds/certcascade";

const feedbackHref = `mailto:${FEEDBACK_EMAIL}?subject=${encodeURIComponent(
  "My CertCascade review"
)}&body=${encodeURIComponent(
  [
    "Name:",
    "Role (for example teacher, event organiser, HR):",
    "City:",
    "What did you use CertCascade for?",
    "How did it go?",
    "Rating out of 5 (optional):",
    "",
    "I agree that CertCascade may publish this review on its website.",
  ].join("\n")
)}`;

const focusRing =
  "outline-none focus-visible:ring-2 focus-visible:ring-(--brand-orange)/50";

function StarRating({ rating }: { rating: number }) {
  return (
    <div
      role="img"
      aria-label={`Rated ${rating} out of 5`}
      className="flex gap-0.5 text-(--brand-orange)"
    >
      {[1, 2, 3, 4, 5].map((i) => {
        if (rating >= i) return <BsStarFill key={i} aria-hidden="true" className="h-4 w-4" />;
        if (rating >= i - 0.5) return <BsStarHalf key={i} aria-hidden="true" className="h-4 w-4" />;
        return <BsStar key={i} aria-hidden="true" className="h-4 w-4" />;
      })}
    </div>
  );
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <li className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow duration-200 hover:shadow-md">
      {(review.rating !== undefined || review.category) && (
        <div className="flex items-center justify-between gap-3">
          {review.rating !== undefined ? (
            <StarRating rating={review.rating} />
          ) : (
            <span />
          )}
          {review.category && (
            <span className="rounded-full bg-orange-50 px-2.5 py-0.5 text-xs font-semibold text-(--brand-orange-ink)">
              {review.category}
            </span>
          )}
        </div>
      )}

      <blockquote className="flex-1 text-base leading-relaxed text-gray-700">
        &ldquo;{review.text}&rdquo;
      </blockquote>

      <div className="flex items-center gap-3">
        <div
          aria-hidden="true"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100 text-sm font-bold text-(--brand-orange-ink)"
        >
          {initials(review.name)}
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900">{review.name}</p>
          <p className="text-xs text-(--text-gray)">
            {review.city ? `${review.role}, ${review.city}` : review.role}
          </p>
        </div>
      </div>
    </li>
  );
}

export default function ReviewsPageContent() {
  const [active, setActive] = useState("All");

  const categories = [
    "All",
    ...Array.from(
      new Set(reviews.map((r) => r.category).filter((c): c is string => !!c))
    ),
  ];

  const filtered =
    active === "All" ? reviews : reviews.filter((r) => r.category === active);

  const rated = reviews.filter((r) => r.rating !== undefined);
  const showStats = rated.length >= 3;
  const average = showStats
    ? rated.reduce((sum, r) => sum + (r.rating ?? 0), 0) / rated.length
    : 0;

  return (
    <main>
      <section
        aria-labelledby="reviews-heading"
        className="border-b border-gray-200 bg-white py-16 text-center md:py-20"
      >
        <Container className="max-w-2xl">
          <h1
            id="reviews-heading"
            className="text-balance text-4xl font-extrabold text-gray-900 sm:text-5xl"
          >
            What people are saying
          </h1>
          <p className="mt-5 text-base leading-relaxed text-(--text-gray) sm:text-lg">
            Feedback from teachers, event teams, and organisations who have used
            CertCascade.
          </p>

          {showStats && (
            <div className="mt-8 flex items-center justify-center gap-6">
              <div>
                <p className="text-4xl font-extrabold text-gray-900">
                  {average.toFixed(1)}
                </p>
                <div className="mt-1 flex justify-center">
                  <StarRating rating={Math.round(average * 2) / 2} />
                </div>
                <p className="mt-1 text-xs text-(--text-gray)">Average rating</p>
              </div>
              <div className="h-12 w-px bg-gray-200" aria-hidden="true" />
              <div>
                <p className="text-4xl font-extrabold text-gray-900">
                  {reviews.length}
                </p>
                <p className="mt-1 text-xs text-(--text-gray)">
                  {reviews.length === 1 ? "Review" : "Reviews"}
                </p>
              </div>
            </div>
          )}
        </Container>
      </section>

      <section className="bg-(--bg) py-16 md:py-24">
        <Container>
          {reviews.length === 0 ? (
            <div className="mx-auto max-w-lg rounded-2xl border border-gray-200 bg-white px-8 py-12 text-center shadow-sm">
              <span
                aria-hidden="true"
                className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-orange-50 text-(--brand-orange-ink)"
              >
                <HiOutlineChatAlt2 className="h-6 w-6" />
              </span>
              <h2 className="mt-5 text-xl font-bold text-gray-900">
                No reviews yet
              </h2>
              <p className="mt-2 text-base leading-relaxed text-(--text-gray)">
                CertCascade is new. If you have used it for certificates, report
                cards, or IDs, tell us how it went and we will add your review
                here, with your permission.
              </p>
              <a
                href={feedbackHref}
                className={`mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-(--brand-orange-ink) px-6 py-3 text-sm font-semibold text-white transition-[filter] duration-200 hover:brightness-110 ${focusRing}`}
              >
                Share your feedback
              </a>
            </div>
          ) : (
            <>
              {categories.length > 2 && (
                <div
                  role="group"
                  aria-label="Filter reviews"
                  className="mb-10 flex flex-wrap justify-center gap-2"
                >
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setActive(cat)}
                      aria-pressed={active === cat}
                      className={`min-h-10 cursor-pointer rounded-full px-4 py-1.5 text-sm font-semibold transition-colors duration-200 ${focusRing} ${
                        active === cat
                          ? "bg-(--brand-orange-ink) text-white"
                          : "bg-white text-(--text-gray) hover:bg-gray-100 hover:text-gray-900"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}

              <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((review, i) => (
                  <ReviewCard key={`${review.name}-${i}`} review={review} />
                ))}
              </ul>
            </>
          )}
        </Container>
      </section>

      <section
        aria-labelledby="share-heading"
        className="bg-(--primary) py-16 text-center md:py-20"
      >
        <Container className="max-w-xl">
          <BsGithub aria-hidden="true" className="mx-auto mb-4 h-10 w-10 text-white" />
          <h2
            id="share-heading"
            className="text-balance text-3xl font-bold text-white"
          >
            Used CertCascade?
          </h2>
          <p className="mb-8 mt-3 text-base leading-relaxed text-white/70">
            Share your experience, or star the project on GitHub so others can
            find it.
          </p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href={feedbackHref}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-(--brand-orange) px-6 py-3 text-sm font-semibold text-gray-900 outline-none transition-[filter] duration-200 hover:brightness-105 focus-visible:ring-4 focus-visible:ring-white/40"
            >
              Share your feedback
            </a>
            <a
              href={REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-white/10 px-6 py-3 text-sm font-semibold text-white outline-none transition-colors duration-200 hover:bg-white/20 focus-visible:ring-4 focus-visible:ring-white/40"
            >
              <BsGithub aria-hidden="true" className="h-4 w-4" />
              Star on GitHub
            </a>
          </div>
        </Container>
      </section>
    </main>
  );
}