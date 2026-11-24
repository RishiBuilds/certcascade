"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { HiOutlineChevronDown } from "react-icons/hi";
import { BsGithub } from "react-icons/bs";

const faqCategories = [
  {
    category: "Getting started",
    faqs: [
      {
        q: "What is CertCascade?",
        a: "CertCascade is a free tool that generates certificates, report cards, and ID cards in bulk. Upload a PNG or JPG template, add your data as a CSV, place each column on the design, and download every document in one ZIP file.",
      },
      {
        q: "Do I need to create an account?",
        a: "No. There is no sign-up. Open the site and start generating.",
      },
      {
        q: "Is CertCascade really free?",
        a: "Yes. There is no subscription and no payment. The only limit is a 5 MB size for each CSV file.",
      },
      {
        q: "Which devices and browsers does it work on?",
        a: "CertCascade runs in your browser, so there is nothing to install. The editor uses drag and drop with a mouse, so a desktop or laptop works best.",
      },
    ],
  },
  {
    category: "Templates and data",
    faqs: [
      {
        q: "Which file formats can I use as a template?",
        a: "PNG and JPG. SVG and PDF templates are not supported yet. If your design is a PDF or a slide, export it as a PNG or JPG first.",
      },
      {
        q: "How do I prepare my CSV file?",
        a: "Create a spreadsheet with one column per field, for example Name, Course, and Date. Put the column names in the first row, give every column a unique name, and export the sheet as a CSV. Each row after the header makes one document.",
      },
      {
        q: "How many rows can my CSV have?",
        a: "There is no fixed row limit, but the CSV file must be under 5 MB. Documents are rendered on your own device, so very large batches can take longer on slower computers.",
      },
      {
        q: "Can I enter data without uploading a file?",
        a: "Yes. Choose Paste CSV text and enter your data with the column names on the first row. Put values that contain commas in double quotes.",
      },
      {
        q: "Why was my CSV rejected?",
        a: "Check that the file ends in .csv, is under 5 MB, has a header row, has unique column names, and has at least one row of data. The message under the upload box tells you which of these failed.",
      },
    ],
  },
  {
    category: "Fields and styling",
    faqs: [
      {
        q: "How do I place text on my template?",
        a: "After you add data, click a column name to place it on the template, then drag it into position on the preview. You can also type exact horizontal and vertical positions in the style panel.",
      },
      {
        q: "Can I change the font, size, and color?",
        a: "Yes. For each field you can set the font, size, and color, and turn bold, italic, or underline on or off.",
      },
      {
        q: "Which fonts are available?",
        a: "Playfair Display, Cormorant Garamond, Great Vibes, Dancing Script, Montserrat, Poppins, Georgia, Times New Roman, and Arial. Uploading your own fonts is not supported yet.",
      },
      {
        q: "Can I add text that is the same on every document?",
        a: "Not directly yet, because every field is linked to a CSV column. As a workaround, add a column with the same value on every row.",
      },
      {
        q: "Can I add photos or QR codes?",
        a: "Not yet. CertCascade places text only.",
      },
    ],
  },
  {
    category: "Generating and downloading",
    faqs: [
      {
        q: "What do I get when I generate?",
        a: "Each document is saved as an image in the same format as your template (PNG or JPG), and all of them are bundled into one ZIP file.",
      },
      {
        q: "Will the quality match my template?",
        a: "Documents are rendered at your template's original pixel size, so a high-resolution template gives high-resolution output.",
      },
      {
        q: "Is my data uploaded to a server?",
        a: "No. Your template, your data, and the generated documents are processed in your browser and are never uploaded. The page does load its fonts from Google Fonts, but your files stay on your device.",
      },
      {
        q: "Can I preview a document before generating everything?",
        a: "Yes. The editor shows a live preview. Use the previous and next buttons to check other rows, and open the data table to fix any value before you generate.",
      },
    ],
  },
  {
    category: "Open source",
    faqs: [
      {
        q: "Is CertCascade open source?",
        a: "Yes. The source code is on GitHub at RishiBuilds/certcascade, where you can read it, report issues, and contribute.",
      },
      {
        q: "How can I contribute?",
        a: "Open an issue or a pull request on GitHub. Bug fixes, new features, documentation, and design improvements are all welcome.",
      },
      {
        q: "I found a bug. Where do I report it?",
        a: "Open an issue on the GitHub repository. Include the steps to reproduce it, your browser, and, if you can, a sample CSV with any private data removed.",
      },
    ],
  },
];

const structuredData = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqCategories.flatMap((category) =>
    category.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    }))
  ),
}).replace(/</g, "\\u003c");

const focusRing =
  "outline-none focus-visible:ring-2 focus-visible:ring-(--brand-orange)/50";

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const buttonId = `${id}-button`;
  const panelId = `${id}-panel`;

  return (
    <div className="border-b border-gray-200 last:border-0">
      <h3 className="text-base">
        <button
          type="button"
          id={buttonId}
          onClick={() => setOpen((prev) => !prev)}
          aria-expanded={open}
          aria-controls={panelId}
          className={`flex w-full cursor-pointer items-center justify-between gap-4 rounded-lg py-5 text-left text-base font-semibold text-gray-900 transition-colors duration-200 hover:text-(--brand-orange-ink) ${focusRing}`}
        >
          <span>{q}</span>
          <HiOutlineChevronDown
            aria-hidden="true"
            className={`h-5 w-5 shrink-0 text-(--text-gray) transition-transform duration-300 ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>
      </h3>

      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        aria-hidden={!open}
        className={`grid transition-[grid-template-rows] duration-300 ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <p className="pb-5 text-base leading-relaxed text-(--text-gray)">
            {a}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function FaqsPageContent() {
  const [activeCategory, setActiveCategory] = useState(
    faqCategories[0].category
  );

  const current =
    faqCategories.find((c) => c.category === activeCategory) ??
    faqCategories[0];

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: structuredData }}
      />

      <section
        aria-labelledby="faq-heading"
        className="border-b border-gray-200 bg-white px-6 py-16 text-center md:py-20"
      >
        <div className="mx-auto max-w-2xl">
          <h1
            id="faq-heading"
            className="text-balance text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl"
          >
            Frequently asked questions
          </h1>
          <p className="mt-5 text-base leading-relaxed text-(--text-gray) sm:text-lg">
            Everything you need to know about CertCascade. Can&apos;t find an
            answer?{" "}
            <a
              href="mailto:rishi.chaurasia.dev@gmail.com"
              className="font-semibold text-(--brand-orange-ink) underline underline-offset-4 hover:opacity-80"
            >
              Email us.
            </a>
          </p>
        </div>
      </section>

      <section className="bg-(--bg) px-6 py-14 md:py-16">
        <div className="mx-auto flex max-w-5xl flex-col gap-8 lg:flex-row lg:gap-10">
          <nav aria-label="FAQ categories" className="shrink-0 lg:w-60">
            <ul className="-mx-6 flex gap-2 overflow-x-auto px-6 pb-1 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0 lg:pb-0 lg:sticky lg:top-24">
              {faqCategories.map((cat) => {
                const active = activeCategory === cat.category;

                return (
                  <li key={cat.category} className="shrink-0 lg:shrink">
                    <button
                      type="button"
                      onClick={() => setActiveCategory(cat.category)}
                      aria-pressed={active}
                      className={`w-full cursor-pointer whitespace-nowrap rounded-xl px-4 py-2.5 text-left text-sm font-semibold transition-colors duration-200 lg:whitespace-normal ${focusRing} ${
                        active
                          ? "bg-(--brand-orange-ink) text-white"
                          : "bg-white text-(--text-gray) hover:bg-gray-100 hover:text-gray-900"
                      }`}
                    >
                      {cat.category}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="min-w-0 flex-1 rounded-2xl border border-gray-200 bg-white px-6 shadow-sm">
            <h2 className="border-b border-gray-200 py-5 text-lg font-bold text-gray-900">
              {current.category}
            </h2>
            {current.faqs.map((faq) => (
              <FaqItem key={`${current.category}-${faq.q}`} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>

      <section
        aria-labelledby="questions-heading"
        className="border-t border-gray-200 bg-white px-6 py-16 text-center"
      >
        <div className="mx-auto max-w-xl">
          <h2
            id="questions-heading"
            className="text-balance text-2xl font-bold tracking-tight text-gray-900"
          >
            Still have questions?
          </h2>
          <p className="mb-8 mt-3 text-base leading-relaxed text-(--text-gray)">
            Send an email, or open an issue on GitHub if you ran into a bug or
            have an idea.
          </p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="mailto:rishi.chaurasia.dev@gmail.com"
              className="inline-flex items-center gap-2 rounded-xl bg-(--brand-orange-ink) px-6 py-3 text-sm font-semibold text-white outline-none transition-[filter] duration-200 hover:brightness-110 focus-visible:ring-4 focus-visible:ring-(--brand-orange)/40"
            >
              Email us
            </a>
            <a
              href="https://github.com/RishiBuilds/certcascade/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-(--primary) px-6 py-3 text-sm font-semibold text-white outline-none transition-colors duration-200 hover:bg-gray-800 focus-visible:ring-4 focus-visible:ring-gray-900/30"
            >
              <BsGithub aria-hidden="true" className="h-4 w-4" />
              Open an issue
            </a>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="cta-heading"
        className="bg-(--primary) px-6 py-16 text-center"
      >
        <div className="mx-auto max-w-xl">
          <h2
            id="cta-heading"
            className="text-balance text-2xl font-bold tracking-tight text-white"
          >
            Ready to get started?
          </h2>
          <p className="mb-8 mt-3 text-base text-white/70">
            No sign-up and no cost. Generate your first batch of documents in
            under a minute.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-(--brand-orange) px-6 py-3 text-sm font-semibold text-gray-900 outline-none transition-[filter] duration-200 hover:brightness-105 focus-visible:ring-4 focus-visible:ring-white/40"
          >
            Try CertCascade free
          </Link>
        </div>
      </section>
    </main>
  );
}