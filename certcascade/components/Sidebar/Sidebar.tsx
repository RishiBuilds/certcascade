"use client";

import React, { useRef, useState } from "react";
import JSZip from "jszip";
import {
  GoCheck,
  GoDownload,
  GoEye,
  GoPlus,
  GoTrash,
  GoUpload,
  GoX,
} from "react-icons/go";
import Table from "./local/Table";
import {
  handleCellChange,
  handleDelete,
  handleInputChange,
} from "./utils/utils";
import {
  _type_TextField,
  SidebarProps,
  CsvResult,
  Notice,
} from "@/types/types";
import { FONT_FAMILIES } from "./constants";
import { uid } from "./utils/utils";

const sectionClass = "border-t border-gray-200 p-5";
const headingClass = "mb-3 text-sm font-semibold text-gray-900";
const focusRing =
  "outline-none focus-visible:ring-2 focus-visible:ring-(--brand-orange)/40";
const inputClass =
  "w-full rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-sm text-gray-900 outline-none transition-colors focus:border-(--brand-orange) focus:ring-2 focus:ring-(--brand-orange)/20";
const labelClass = "flex flex-col gap-1 text-xs font-medium text-gray-600";
const secondaryButton = `flex min-h-10 cursor-pointer items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900 ${focusRing}`;

export default function Sidebar({
  certificate,
  fields,
  setFields,
  selectedId,
  setSelectedId,
  onCsvDataChange,
  imgRef,
}: SidebarProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [csvData, setCSVData] = useState<CsvResult | null>(null);
  const [isTableOpen, setIsTableOpen] = useState(false);
  const [showPasteModal, setShowPasteModal] = useState(false);
  const [pastedCsv, setPastedCsv] = useState("");
  const [notice, setNotice] = useState<Notice | null>(null);
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);

  const setCSVDataWithCallback = (
    value: React.SetStateAction<CsvResult | null>
  ) => {
    const next = typeof value === "function" ? value(csvData) : value;
    setCSVData(next);
    onCsvDataChange(next);
  };

  const rowCount = csvData?.ok
    ? Math.max(
      0,
      ...csvData.headers.map((h) => csvData.rows[h]?.length ?? 0)
    )
    : 0;

  function handlePasteCsv() {
    const text = pastedCsv.trim();

    if (!text) {
      setNotice({ type: "error", message: "Please enter CSV data." });
      return;
    }

    const records: string[][] = [];
    let row: string[] = [];
    let cell = "";
    let quoted = false;

    for (let i = 0; i < text.length; i++) {
      const char = text[i];

      if (char === '"' && quoted && text[i + 1] === '"') {
        cell += '"';
        i++;
      } else if (char === '"') {
        quoted = !quoted;
      } else if (char === "," && !quoted) {
        row.push(cell);
        cell = "";
      } else if ((char === "\n" || char === "\r") && !quoted) {
        if (char === "\r" && text[i + 1] === "\n") i++;

        row.push(cell);

        if (row.some((value) => value.trim() !== "")) {
          records.push(row);
        }

        row = [];
        cell = "";
      } else {
        cell += char;
      }
    }

    if (quoted) {
      setNotice({
        type: "error",
        message: "CSV contains an unclosed quotation mark.",
      });
      return;
    }

    row.push(cell);

    if (row.some((value) => value.trim() !== "")) {
      records.push(row);
    }

    if (records.length < 2) {
      setNotice({
        type: "error",
        message: "Include column headers and at least one data row.",
      });
      return;
    }

    const headers = records[0].map((header, index) =>
      (index === 0 ? header.replace(/^\uFEFF/, "") : header).trim()
    );

    if (headers.some((header) => !header)) {
      setNotice({
        type: "error",
        message: "Column names cannot be empty.",
      });
      return;
    }

    if (new Set(headers).size !== headers.length) {
      setNotice({
        type: "error",
        message: "Column names must be unique.",
      });
      return;
    }

    const rows: Record<string, string[]> = Object.fromEntries(
      headers.map((header, columnIndex) => [
        header,
        records.slice(1).map((record) => record[columnIndex] ?? ""),
      ])
    );

    const result: CsvResult = {
      ok: true,
      headers,
      rows,
      filename: "pasted-data.csv",
    };

    setCSVDataWithCallback(result);
    setShowPasteModal(false);
    setPastedCsv("");
    setNotice(null);
  }

  function addField(column: string) {
    const newField: _type_TextField = {
      id: uid(),
      column,
      x: 0.1,
      y: 0.5,
      fontSize: 32,
      color: "#000000",
      fontFamily: "Inter",
      bold: false,
      italic: false,
      underline: false,
    };

    setFields((prev) => [...prev, newField]);
    setSelectedId(newField.id);
  }

  function updateSelected(patch: Partial<_type_TextField>) {
    setFields((prev) =>
      prev.map((f) => (f.id === selectedId ? { ...f, ...patch } : f))
    );
  }

  function removeField(id: string) {
    setFields((prev) => prev.filter((f) => f.id !== id));

    if (selectedId === id) {
      setSelectedId(null);
    }
  }

  function downloadBlob(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  const ext = certificate?.type === "image/png" ? "png" : "jpg";
  const mimeType =
    certificate?.type === "image/png" ? "image/png" : "image/jpeg";

  async function renderRow(
    ctx: CanvasRenderingContext2D,
    offscreen: HTMLCanvasElement,
    img: HTMLImageElement,
    rowIndex: number
  ): Promise<Blob> {
    ctx.clearRect(0, 0, offscreen.width, offscreen.height);
    ctx.drawImage(img, 0, 0);

    const csv = csvData!;
    if (!csv.ok) throw new Error("CSV data is not loaded.");

    const rowValues: Record<string, string> = {};

    for (const header of csv.headers) {
      rowValues[header] = csv.rows[header]?.[rowIndex] ?? "";
    }

    for (const field of fields) {
      const text = rowValues[field.column] ?? "";
      const weight = field.bold ? "bold" : "normal";
      const style = field.italic ? "italic" : "normal";

      ctx.font = `${style} ${weight} ${field.fontSize}px "${field.fontFamily}"`;
      ctx.fillStyle = field.color;
      ctx.textBaseline = "top";

      ctx.fillText(
        text,
        field.x * offscreen.width,
        field.y * offscreen.height
      );

      if (field.underline) {
        const metrics = ctx.measureText(text);
        const textY = field.y * offscreen.height;

        ctx.beginPath();
        ctx.strokeStyle = field.color;
        ctx.lineWidth = Math.max(1, field.fontSize / 16);
        ctx.moveTo(field.x * offscreen.width, textY + field.fontSize);
        ctx.lineTo(
          field.x * offscreen.width + metrics.width,
          textY + field.fontSize
        );
        ctx.stroke();
      }
    }

    return new Promise<Blob>((resolve, reject) => {
      offscreen.toBlob(
        (result) => {
          if (result) resolve(result);
          else reject(new Error("Failed to generate certificate image."));
        },
        mimeType,
        0.95
      );
    });
  }

  function safeNameForRow(rowIndex: number): string {
    if (!csvData?.ok) return `certificate_${rowIndex + 1}`;
    const rowValues: Record<string, string> = {};
    for (const header of csvData.headers) {
      rowValues[header] = csvData.rows[header]?.[rowIndex] ?? "";
    }
    const firstVal =
      rowValues[fields[0]?.column] ?? `certificate_${rowIndex + 1}`;
    return (
      firstVal.replace(/[^a-z0-9_-]/gi, "_").slice(0, 60) ||
      `certificate_${rowIndex + 1}`
    );
  }

  async function handleGenerate() {
    if (
      !csvData?.ok ||
      !imgRef.current ||
      !certificate ||
      fields.length === 0 ||
      rowCount === 0 ||
      generating
    ) {
      return;
    }

    setGenerating(true);
    setProgress(0);

    try {
      const img = imgRef.current;
      const offscreen = document.createElement("canvas");

      offscreen.width = img.naturalWidth;
      offscreen.height = img.naturalHeight;

      const ctx = offscreen.getContext("2d");

      if (!ctx) {
        throw new Error("Unable to create the certificate canvas.");
      }

      if (rowCount === 1) {
        const blob = await renderRow(ctx, offscreen, img, 0);
        const safeName = safeNameForRow(0) || "certificate";
        downloadBlob(blob, `${safeName}.${ext}`);
        setProgress(100);
      } else {
        const zip = new JSZip();

        for (let i = 0; i < rowCount; i++) {
          const blob = await renderRow(ctx, offscreen, img, i);
          const safeName = safeNameForRow(i);
          zip.file(
            `${String(i + 1).padStart(3, "0")}_${safeName}.${ext}`,
            blob
          );

          setProgress(Math.round(((i + 1) / rowCount) * 100));

          if (i % 10 === 0) {
            await new Promise((resolve) => setTimeout(resolve, 0));
          }
        }

        const zipBlob = await zip.generateAsync({ type: "blob" });
        downloadBlob(zipBlob, "certificates.zip");
      }
    } catch (error) {
      setNotice({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Failed to generate certificates.",
      });
    } finally {
      setGenerating(false);
      setProgress(0);
    }
  }

  const selected = fields.find((f) => f.id === selectedId) ?? null;
  const usedColumns = new Set(fields.map((f) => f.column));

  const toggleClass = (active: boolean) =>
    `flex h-10 flex-1 cursor-pointer items-center justify-center rounded-lg border text-sm transition-colors ${focusRing} ${
      active
        ? "border-(--brand-orange) bg-orange-50 text-(--brand-orange-ink)"
        : "border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
    }`;

  return (
    <aside className="flex w-full shrink-0 flex-col border-b border-gray-200 bg-white text-gray-900 lg:h-full lg:w-80 lg:overflow-y-auto lg:border-b-0 lg:border-r">
      <div className="p-5">
        <h2 className="mb-3 text-sm font-semibold text-gray-900">Data</h2>

        {!csvData?.ok ? (
          <div className="space-y-3">
            <label
              htmlFor="csv-data"
              className="group flex cursor-pointer items-center gap-3 rounded-xl border-2 border-dashed border-gray-300 bg-white p-3 transition-colors focus-within:ring-4 focus-within:ring-(--brand-orange)/30 hover:border-(--brand-orange) hover:bg-orange-50/40"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-50 text-(--brand-orange-ink)">
                <GoUpload aria-hidden="true" className="h-5 w-5" />
              </span>

              <span className="min-w-0">
                <span className="block text-sm font-semibold text-gray-900">
                  Upload a CSV file
                </span>
                <span className="block text-xs text-(--text-gray)">
                  Up to 5 MB
                </span>
              </span>

              <input
                ref={inputRef}
                type="file"
                name="csv-data"
                id="csv-data"
                accept=".csv,text/csv"
                onChange={(e) =>
                  handleInputChange(
                    e,
                    setCSVDataWithCallback,
                    setNotice,
                    setIsTableOpen
                  )
                }
                className="sr-only"
              />
            </label>

            <div className="flex items-center gap-3 text-xs text-gray-400">
              <span className="h-px flex-1 bg-gray-200" />
              or
              <span className="h-px flex-1 bg-gray-200" />
            </div>

            <button
              type="button"
              onClick={() => {
                setPastedCsv("");
                setNotice(null);
                setShowPasteModal(true);
              }}
              className={`${secondaryButton} w-full`}
            >
              <GoPlus aria-hidden="true" className="h-4 w-4" />
              Paste CSV text
            </button>
          </div>
        ) : (
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
            <p className="truncate text-sm font-semibold text-gray-900">
              {csvData.filename}
            </p>
            <p className="mt-0.5 text-xs text-(--text-gray)">
              {rowCount} {rowCount === 1 ? "row" : "rows"},{" "}
              {csvData.headers.length}{" "}
              {csvData.headers.length === 1 ? "column" : "columns"}
            </p>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setIsTableOpen(true)}
                className={secondaryButton}
              >
                <GoEye aria-hidden="true" className="h-4 w-4" />
                View
              </button>

              <button
                type="button"
                onClick={() =>
                  handleDelete(
                    setCSVDataWithCallback,
                    setNotice,
                    setIsTableOpen,
                    inputRef
                  )
                }
                className="flex min-h-10 cursor-pointer items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 outline-none transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-700 focus-visible:ring-2 focus-visible:ring-red-500/40"
              >
                <GoTrash aria-hidden="true" className="h-4 w-4" />
                Delete
              </button>
            </div>
          </div>
        )}

        {notice && notice.type !== "success" && (
          <div
            role="alert"
            className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm leading-5 text-red-700"
          >
            <p className="wrap-break-word">{notice.message}</p>
          </div>
        )}
      </div>

      {csvData != null && (
        <>
          <section className={sectionClass}>
            <h3 className={headingClass}>Columns</h3>

            {!csvData.ok ? (
              <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-4 text-center">
                <p className="text-sm font-medium text-gray-700">
                  No columns yet
                </p>
                <p className="mt-1 text-xs leading-5 text-(--text-gray)">
                  Upload or paste CSV data to place columns on the certificate.
                </p>
              </div>
            ) : (
              <>
                <p className="mb-3 text-xs text-(--text-gray)">
                  Click a column to place it on the certificate.
                </p>
                <div className="flex flex-wrap gap-2">
                  {csvData.headers.map((header) => {
                    const already = usedColumns.has(header);

                    return (
                      <button
                        key={header}
                        type="button"
                        title={
                          already
                            ? "Already placed"
                            : `Place "${header}" on certificate`
                        }
                        onClick={() => !already && addField(header)}
                        aria-disabled={already}
                        className={`flex min-h-10 items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${focusRing} ${
                          already
                            ? "cursor-not-allowed border-gray-200 bg-gray-50 text-gray-400"
                            : "cursor-pointer border-gray-300 bg-white text-gray-700 hover:border-(--brand-orange) hover:bg-orange-50 hover:text-(--brand-orange-ink)"
                        }`}
                      >
                        {already ? (
                          <GoCheck aria-hidden="true" className="h-3.5 w-3.5" />
                        ) : (
                          <GoPlus aria-hidden="true" className="h-3.5 w-3.5" />
                        )}
                        {header}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </section>

          <section className={sectionClass}>
            <h3 className={headingClass}>Placed fields</h3>

            {fields.length === 0 ? (
              <p className="text-sm text-(--text-gray)">
                Nothing placed yet. Pick a column above.
              </p>
            ) : (
              <ul className="space-y-1.5">
                {fields.map((f) => (
                  <li
                    key={f.id}
                    className={`flex items-center rounded-lg border transition-colors ${
                      f.id === selectedId
                        ? "border-(--brand-orange) bg-orange-50"
                        : "border-gray-200 bg-white hover:bg-gray-50"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setSelectedId(f.id)}
                      aria-pressed={f.id === selectedId}
                      className={`min-h-10 min-w-0 flex-1 cursor-pointer truncate rounded-lg px-3 py-2 text-left text-sm font-medium ${focusRing} ${
                        f.id === selectedId
                          ? "text-(--brand-orange-ink)"
                          : "text-gray-700"
                      }`}
                    >
                      {f.column}
                    </button>

                    <button
                      type="button"
                      onClick={() => removeField(f.id)}
                      aria-label={`Remove ${f.column}`}
                      title="Remove"
                      className={`mr-1 flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600 ${focusRing}`}
                    >
                      <GoX aria-hidden="true" className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {selected && (
            <section className={`${sectionClass} space-y-4`}>
              <h3 className="text-sm font-semibold text-gray-900">
                Style for{" "}
                <span className="rounded bg-gray-100 px-1.5 py-0.5 font-medium">
                  {selected.column}
                </span>
              </h3>

              <label className={labelClass}>
                Font
                <select
                  value={selected.fontFamily}
                  onChange={(e) =>
                    updateSelected({ fontFamily: e.target.value })
                  }
                  className={inputClass}
                >
                  {FONT_FAMILIES.map((font) => (
                    <option key={font} value={font}>
                      {font}
                    </option>
                  ))}
                </select>
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label className={labelClass}>
                  Size
                  <input
                    type="number"
                    min={8}
                    max={300}
                    value={selected.fontSize}
                    onChange={(e) =>
                      updateSelected({ fontSize: Number(e.target.value) })
                    }
                    className={inputClass}
                  />
                </label>

                <label className={labelClass}>
                  Color
                  <input
                    type="color"
                    value={selected.color}
                    onChange={(e) =>
                      updateSelected({ color: e.target.value })
                    }
                    className="h-10 w-full cursor-pointer rounded-md border border-gray-300 bg-white p-1"
                  />
                </label>
              </div>

              <div
                role="group"
                aria-label="Text formatting"
                className="flex gap-2"
              >
                <button
                  type="button"
                  aria-label="Bold"
                  aria-pressed={selected.bold}
                  onClick={() => updateSelected({ bold: !selected.bold })}
                  className={`${toggleClass(selected.bold)} font-bold`}
                >
                  B
                </button>

                <button
                  type="button"
                  aria-label="Italic"
                  aria-pressed={selected.italic}
                  onClick={() =>
                    updateSelected({ italic: !selected.italic })
                  }
                  className={`${toggleClass(selected.italic)} italic`}
                >
                  I
                </button>

                <button
                  type="button"
                  aria-label="Underline"
                  aria-pressed={selected.underline}
                  onClick={() =>
                    updateSelected({ underline: !selected.underline })
                  }
                  className={`${toggleClass(selected.underline)} underline`}
                >
                  U
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <label className={labelClass}>
                  Horizontal position (%)
                  <input
                    type="number"
                    min={0}
                    max={99}
                    step={0.5}
                    value={+(selected.x * 100).toFixed(1)}
                    onChange={(e) =>
                      updateSelected({
                        x: Number(e.target.value) / 100,
                      })
                    }
                    className={inputClass}
                  />
                </label>

                <label className={labelClass}>
                  Vertical position (%)
                  <input
                    type="number"
                    min={0}
                    max={99}
                    step={0.5}
                    value={+(selected.y * 100).toFixed(1)}
                    onChange={(e) =>
                      updateSelected({
                        y: Number(e.target.value) / 100,
                      })
                    }
                    className={inputClass}
                  />
                </label>
              </div>

              <button
                type="button"
                onClick={() => removeField(selected.id)}
                className="flex min-h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-red-200 bg-white py-2 text-sm font-medium text-red-600 outline-none transition-colors hover:bg-red-50 focus-visible:ring-2 focus-visible:ring-red-500/40"
              >
                <GoTrash aria-hidden="true" className="h-4 w-4" />
                Remove field
              </button>
            </section>
          )}

          <section className="mt-auto border-t border-gray-200 bg-white p-5 lg:sticky lg:bottom-0">
            {csvData.ok && rowCount > 0 && fields.length > 0 ? (
              <>
                <button
                  type="button"
                  onClick={handleGenerate}
                  disabled={generating}
                  className="relative flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-xl bg-(--brand-orange-ink) py-3 text-sm font-semibold text-white outline-none transition-[filter] hover:brightness-110 focus-visible:ring-4 focus-visible:ring-(--brand-orange)/30 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:brightness-100"
                >
                  {generating && (
                    <span
                      aria-hidden="true"
                      className="absolute inset-y-0 left-0 bg-black/20 transition-[width] duration-200"
                      style={{ width: `${progress}%` }}
                    />
                  )}
                  <span className="relative flex items-center gap-2">
                    {!generating && <GoDownload aria-hidden="true" className="h-4 w-4" />}
                    {generating
                      ? `Generating… ${progress}%`
                      : `Generate ${rowCount} certificate${
                          rowCount !== 1 ? "s" : ""
                        }`}
                  </span>
                </button>
                <p className="mt-2 text-center text-xs text-(--text-gray)">
                  {rowCount === 1
                    ? `Downloads as a ${ext === "png" ? "PNG" : "JPG"} image.`
                    : "Downloads as a ZIP file."}
                </p>
              </>
            ) : (
              <div className="rounded-xl border border-gray-200 bg-gray-50 py-3 text-center text-sm text-(--text-gray)">
                {!csvData.ok
                  ? "Upload or paste a CSV to generate"
                  : fields.length === 0
                    ? "Place at least one field"
                    : "No rows in CSV"}
              </div>
            )}
          </section>

          {isTableOpen && csvData.ok && (
            <Table
              csvData={csvData}
              rowCount={rowCount}
              onCellChange={(header, rowIndex, value) =>
                handleCellChange(
                  header,
                  rowIndex,
                  value,
                  setCSVDataWithCallback
                )
              }
              onClose={() => setIsTableOpen(false)}
            />
          )}
        </>
      )}

      {showPasteModal && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center bg-gray-900/50 p-4 backdrop-blur-sm"
          onClick={() => setShowPasteModal(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="paste-csv-title"
            className="w-full max-w-xl rounded-2xl border border-gray-200 bg-white p-6 text-gray-900 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h2
                  id="paste-csv-title"
                  className="text-lg font-bold tracking-tight"
                >
                  Paste CSV text
                </h2>
                <p className="mt-1 text-sm text-(--text-gray)">
                  Paste your data, including the column headers.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowPasteModal(false)}
                aria-label="Close"
                className={`flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 ${focusRing}`}
              >
                <GoX aria-hidden="true" className="h-5 w-5" />
              </button>
            </div>

            <textarea
              autoFocus
              value={pastedCsv}
              onChange={(e) => setPastedCsv(e.target.value)}
              placeholder={`Name,College
Aarav Mehta,VJTI Mumbai
Rohan Desai,Thadomal Shahani Engineering College
Ishita Patil,DJ Sanghvi College
Aditya Kulkarni,SPIT Mumbai`}
              className="h-64 w-full resize-y rounded-xl border border-gray-300 bg-gray-50 p-3 font-mono text-sm outline-none transition-colors focus:border-(--brand-orange) focus:bg-white focus:ring-2 focus:ring-(--brand-orange)/20"
            />

            <p className="mt-2 text-xs leading-5 text-(--text-gray)">
              The first row holds column names. Each row after it makes one
              certificate. Put values that contain commas in double quotes.
            </p>

            {notice && notice.type !== "success" && (
              <p
                role="alert"
                className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
              >
                {notice.message}
              </p>
            )}

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowPasteModal(false)}
                className={`min-h-10 cursor-pointer rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-50 ${focusRing}`}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handlePasteCsv}
                className="min-h-10 cursor-pointer rounded-xl bg-(--brand-orange-ink) px-5 py-2 text-sm font-semibold text-white outline-none transition-[filter] hover:brightness-110 focus-visible:ring-4 focus-visible:ring-(--brand-orange)/30"
              >
                Use this data
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}