"use client";

import React, { useRef, useState } from "react";
import { GoUpload } from "react-icons/go";
import { CertificateInterface } from "@/types/types";

interface EnterCertificateProps {
  onCertificateChange: (cert: CertificateInterface) => void;
}

const ACCEPTED_TYPES = ["image/jpeg", "image/png"];

export default function EnterCertificate({ onCertificateChange }: EnterCertificateProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const prevUrlRef = useRef<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processFile = (file: File | undefined) => {
    if (!file) return;

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError("That file isn't supported. Upload a PNG or JPG.");
      return;
    }
    setError(null);

    if (prevUrlRef.current) {
      URL.revokeObjectURL(prevUrlRef.current);
    }

    const fileUrl = URL.createObjectURL(file);
    prevUrlRef.current = fileUrl;

    const cert: CertificateInterface = {
      name: file.name,
      size: file.size,
      type: file.type,
      url: fileUrl,
    };

    onCertificateChange(cert);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    processFile(e.target.files?.[0]);
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
    processFile(e.dataTransfer.files?.[0]);
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  return (
    <main className="flex h-(--body-height) flex-col items-center justify-center overflow-hidden px-4 py-4 sm:py-6">
      <img src="/logo.svg" alt="CertCascade logo" className="mb-3 h-10 w-auto sm:mb-4 sm:h-12" />

      <h1 className="max-w-2xl text-center text-3xl font-bold leading-tight tracking-tight text-gray-900 sm:text-4xl">
        One certificate in.
        <br />
        Hundreds out.
      </h1>

      <p className="mt-2.5 max-w-md text-center text-sm leading-relaxed text-(--text-gray) sm:text-base">
        Upload a design once, then generate certificates, report cards, IDs, and more in bulk.
        Always <b className="text-(--brand-orange)">free</b>.
      </p>

      <div className="relative mt-6 w-full max-w-md sm:mt-8">
        <div
          aria-hidden="true"
          className="absolute inset-0 translate-x-2.5 translate-y-2.5 rotate-[2.5deg] rounded-2xl border border-gray-200 bg-white"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 translate-x-1 translate-y-1 rotate-[1.2deg] rounded-2xl border border-gray-200 bg-white"
        />

        <input
          ref={inputRef}
          type="file"
          name="certificate"
          id="certificate"
          accept="image/jpeg, image/png"
          onChange={handleFileChange}
          className="peer sr-only"
        />

        <label
          htmlFor="certificate"
          onDragOver={handleDragOver}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`relative flex cursor-pointer flex-col items-center justify-center gap-3 sm:gap-4
                      rounded-2xl border-2 border-dashed px-6 py-8 sm:py-10 text-center shadow-sm
                      transition-colors duration-150
                      peer-focus-visible:ring-4 peer-focus-visible:ring-(--brand-orange)/30
                      ${
                        isDragging
                          ? "border-(--brand-orange) bg-orange-50"
                          : "border-gray-300 bg-white hover:border-(--brand-orange) hover:bg-orange-50/40"
                      }`}
        >
          <span
            className={`flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full transition-colors duration-150 ${
              isDragging ? "bg-(--brand-orange) text-white" : "bg-orange-50 text-(--brand-orange)"
            }`}
          >
            <GoUpload className="h-5 w-5 sm:h-6 sm:w-6" />
          </span>

          <div>
            <p className="text-base sm:text-lg font-semibold text-gray-900">
              {isDragging ? "Drop it here" : "Drop your certificate here"}
            </p>
            <p className="mt-0.5 text-xs sm:text-sm text-(--text-gray)">
              or <span className="font-semibold text-(--brand-orange) underline underline-offset-2">browse files</span>
            </p>
          </div>

          <p className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-(--text-gray)">
            PNG or JPG
          </p>
        </label>
      </div>

      {error && (
        <p role="alert" className="mt-4 text-sm font-medium text-red-600">
          {error}
        </p>
      )}
    </main>
  );
}