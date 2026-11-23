"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { GoUpload } from "react-icons/go";
import { BsGithub, BsStarFill } from "react-icons/bs";
import {
  MdOutlinePeople,
  MdOutlineEventNote,
  MdOutlineSportsScore,
} from "react-icons/md";
import { PiChalkboardTeacherLight, PiCertificateLight } from "react-icons/pi";
import { TbBuildingCommunity, TbHeartHandshake, TbBarbell } from "react-icons/tb";
import {
  LuBriefcase,
  LuGraduationCap,
  LuGift,
  LuShieldCheck,
  LuFileArchive,
  LuImage,
} from "react-icons/lu";
import Container from "@/components/shared/Container";
import { CertificateInterface } from "@/types/types";

interface HomePageProps {
  onCertificateChange: (cert: CertificateInterface) => void;
}

const ACCEPTED_TYPES = ["image/jpeg", "image/png"];

const audiences = [
  { name: "HR Managers", icon: <LuBriefcase className="h-4 w-4" aria-hidden="true" /> },
  { name: "School Teachers", icon: <PiChalkboardTeacherLight className="h-4 w-4" aria-hidden="true" /> },
  { name: "Principals", icon: <TbBuildingCommunity className="h-4 w-4" aria-hidden="true" /> },
  { name: "College Committees", icon: <LuGraduationCap className="h-4 w-4" aria-hidden="true" /> },
  { name: "Course Creators", icon: <PiCertificateLight className="h-4 w-4" aria-hidden="true" /> },
  { name: "Event Organisers", icon: <MdOutlineEventNote className="h-4 w-4" aria-hidden="true" /> },
  { name: "Training Teams", icon: <TbBarbell className="h-4 w-4" aria-hidden="true" /> },
  { name: "NGO Coordinators", icon: <TbHeartHandshake className="h-4 w-4" aria-hidden="true" /> },
  { name: "Bootcamp Mentors", icon: <MdOutlinePeople className="h-4 w-4" aria-hidden="true" /> },
  { name: "Sports Coaches", icon: <MdOutlineSportsScore className="h-4 w-4" aria-hidden="true" /> },
];

const steps = [
  {
    title: "Upload your template",
    body: "Add a PNG or JPG of your certificate, report card, or ID design.",
  },
  {
    title: "Add your data",
    body: "Upload a CSV or paste it in. Each row becomes one document.",
  },
  {
    title: "Place your fields",
    body: "Click a column, drag it into position, and style the text.",
  },
  {
    title: "Generate and download",
    body: "Every row is rendered onto your template and downloaded instantly.",
  },
];

const features = [
  {
    icon: <LuGift className="h-5 w-5" aria-hidden="true" />,
    title: "Free, no sign-up",
    body: "Open the page and start. There is no account to create and nothing to pay.",
  },
  {
    icon: <LuShieldCheck className="h-5 w-5" aria-hidden="true" />,
    title: "Private by design",
    body: "Your template and data are processed in your browser and never uploaded.",
  },
  {
    icon: <LuImage className="h-5 w-5" aria-hidden="true" />,
    title: "Works with your design",
    body: "Bring any PNG or JPG. Certificates, report cards, IDs, and more.",
  },
  {
    icon: <LuFileArchive className="h-5 w-5" aria-hidden="true" />,
    title: "Everything in one download",
    body: "One certificate downloads as an image. Hundreds bundle into a ZIP automatically.",
  },
];

const focusRing = "outline-none focus-visible:ring-2 focus-visible:ring-(--brand-orange)/40";

export default function HomePage({ onCertificateChange }: HomePageProps) {
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File | undefined) => {
    if (!file) return;
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError("That file isn't supported. Upload a PNG or JPG.");
      return;
    }
    setError(null);
    onCertificateChange({
      name: file.name,
      size: file.size,
      type: file.type,
      url: URL.createObjectURL(file),
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    processFile(e.target.files?.[0]);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setDragging(false);
    processFile(e.dataTransfer.files?.[0]);
  };

  return (
    <main>
      <section
        aria-labelledby="hero-heading"
        className="py-16 md:py-24"
      >
        <Container className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="text-center lg:text-left">
            <p className="inline-flex items-center rounded-full border border-orange-200 bg-orange-50 px-3.5 py-1 text-xs font-medium text-(--brand-orange-ink)">
              Free to use · No sign-up required
            </p>

            <h1
              id="hero-heading"
              className="mt-5 text-balance text-4xl font-extrabold leading-[1.1] text-gray-900 sm:text-5xl lg:text-6xl"
            >
              Generate documents{" "}
              <span className="whitespace-nowrap underline decoration-(--brand-orange) decoration-4 underline-offset-8">
                in bulk
              </span>
              , in seconds.
            </h1>

            <p className="mx-auto mt-6 max-w-lg text-base leading-relaxed text-(--text-gray) lg:mx-0 lg:text-lg">
              Create hundreds of personalised certificates, student ID cards, and
              report cards from your own template and a CSV file. Map fields,
              generate, and download everything in one go.
            </p>
          </div>

          <div className="relative mx-auto w-full max-w-md">
            <div
              aria-hidden="true"
              className="absolute inset-0 translate-x-3 translate-y-3 rotate-[2.5deg] rounded-2xl border border-gray-200 bg-white"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 translate-x-1.5 translate-y-1.5 rotate-[1.2deg] rounded-2xl border border-gray-200 bg-white"
            />

            <input
              ref={inputRef}
              type="file"
              name="certificate"
              id="certificate"
              accept="image/jpeg,image/png"
              onChange={handleFileChange}
              className="peer sr-only"
            />

            <label
              htmlFor="certificate"
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              className={`relative flex cursor-pointer select-none flex-col items-center justify-center gap-5 rounded-2xl border-2 border-dashed px-8 py-14 text-center shadow-sm transition-colors duration-150 peer-focus-visible:ring-4 peer-focus-visible:ring-(--brand-orange)/30 ${
                dragging
                  ? "border-(--brand-orange) bg-orange-50"
                  : "border-gray-300 bg-white hover:border-(--brand-orange) hover:bg-orange-50/40"
              }`}
            >
              <span
                className={`flex h-14 w-14 items-center justify-center rounded-full transition-colors duration-150 ${
                  dragging
                    ? "bg-(--brand-orange) text-white"
                    : "bg-orange-50 text-(--brand-orange)"
                }`}
              >
                <GoUpload aria-hidden="true" className="h-6 w-6" />
              </span>

              <div>
                <p className="text-base font-semibold text-gray-900">
                  {dragging ? "Drop it here" : "Drop your template here"}
                </p>
                <p className="mt-1 text-sm text-(--text-gray)">
                  or{" "}
                  <span className="font-semibold text-(--brand-orange-ink) underline underline-offset-2">
                    browse files
                  </span>
                </p>
              </div>

              <p className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-(--text-gray)">
                PNG or JPG
              </p>
            </label>

            {error && (
              <p
                role="alert"
                className="relative mt-4 text-center text-sm font-medium text-red-600"
              >
                {error}
              </p>
            )}
          </div>
        </Container>
      </section>

      <section aria-label="Who uses CertCascade" className="border-y border-gray-200">
        <div className="mx-auto flex max-w-6xl items-stretch">
          <p className="hidden w-56 shrink-0 items-center border-r border-gray-200 px-6 py-5 text-xs leading-snug text-(--text-gray) sm:flex">
            Built for schools, colleges, event teams, and professionals
          </p>
          <div className="relative flex-1 overflow-hidden py-5">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-linear-to-r from-white to-transparent"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-linear-to-l from-white to-transparent"
            />
            <div className="flex w-max animate-marquee motion-reduce:animate-none hover:[animation-play-state:paused]">
              {[0, 1].map((copy) => (
                <ul
                  key={copy}
                  aria-hidden={copy === 1 ? true : undefined}
                  className="flex shrink-0 items-center"
                >
                  {audiences.map((audience) => (
                    <li
                      key={audience.name}
                      className="flex shrink-0 items-center gap-2 pr-10 text-(--text-gray)"
                    >
                      {audience.icon}
                      <span className="whitespace-nowrap text-sm font-medium text-gray-800">
                        {audience.name}
                      </span>
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        id="how-it-works"
        aria-labelledby="how-heading"
        className="py-16 md:py-24"
      >
        <Container>
          <h2
            id="how-heading"
            className="max-w-xl text-balance text-3xl font-extrabold text-gray-900 sm:text-4xl"
          >
            From one design to a full batch in four steps
          </h2>

          <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <li
                key={step.title}
                className="flex flex-col rounded-2xl border border-gray-200 bg-white p-6"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-50 text-sm font-bold text-(--brand-orange)">
                  {index + 1}
                </span>
                <h3 className="mt-4 text-base font-semibold text-gray-900">
                  {step.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-(--text-gray)">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section
        aria-labelledby="why-heading"
        className="border-t border-gray-200 bg-gray-50 py-16 md:py-24"
      >
        <Container>
          <h2
            id="why-heading"
            className="max-w-sm text-balance text-3xl font-extrabold text-gray-900 sm:text-4xl"
          >
            Simple on purpose
          </h2>

          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <li
                key={feature.title}
                className="rounded-2xl border border-gray-200 bg-white p-6"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50 text-(--brand-orange)">
                  {feature.icon}
                </span>
                <h3 className="mt-4 text-base font-semibold text-gray-900">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-(--text-gray)">
                  {feature.body}
                </p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section
        aria-labelledby="oss-heading"
        className="bg-(--bg) py-16 text-center md:py-24"
      >
        <Container>
          <BsGithub aria-hidden="true" className="mx-auto mb-5 h-10 w-10 text-gray-900" />
          <h2
            id="oss-heading"
            className="text-balance text-3xl font-extrabold text-gray-900 sm:text-4xl"
          >
            Open source
          </h2>
          <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-(--text-gray)">
            CertCascade is fully open source. Explore the code, report issues,
            suggest features, or contribute.
          </p>
          <a
            href="https://github.com/RishiBuilds/certcascade"
            target="_blank"
            rel="noopener noreferrer"
            className={`mt-8 inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-800 ${focusRing}`}
          >
            <BsGithub aria-hidden="true" className="h-5 w-5" />
            Star us on GitHub
            <BsStarFill aria-hidden="true" className="h-4 w-4 text-yellow-400" />
          </a>
        </Container>
      </section>
    </main>
  );
}
