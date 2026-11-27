"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  GoChevronLeft,
  GoChevronRight,
  GoDownload,
  GoSync,
} from "react-icons/go";
import {
  HiOutlineMinus,
  HiOutlinePlus,
  HiOutlineQuestionMarkCircle,
} from "react-icons/hi";
import {
  CertificateInterface,
  CsvResult,
  _type_TextField,
} from "@/types/types";

interface Props {
  certificate: CertificateInterface;
  csvData: CsvResult | null;
  fields: _type_TextField[];
  selectedId: string | null;
  imgRef: React.RefObject<HTMLImageElement | null>;
  onSelectField: (id: string | null) => void;
  onMoveField: (id: string, x: number, y: number) => void;
  show_prev_next_navigation: boolean;
  onReselect?: () => void;
}

const MIN_ZOOM = 0.25;
const MAX_ZOOM = 4;
const ZOOM_STEP = 0.25;
const SNAP_THRESHOLD = 0.008;
const NUDGE = 0.002;
const NUDGE_FAST = 0.01;
const ACCENT = "#E8884A";

const focusRing =
  "outline-none focus-visible:ring-2 focus-visible:ring-(--brand-orange)/40";
const iconButton = `flex h-10 w-10 cursor-pointer items-center justify-center rounded-md text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent ${focusRing}`;

const shortcuts: { keys: string; action: string }[] = [
  { keys: "Arrow keys", action: "Nudge the selected field" },
  { keys: "Shift + arrows", action: "Nudge 5 times further" },
  { keys: "Left / Right", action: "Previous / next row when nothing is selected" },
  { keys: "Page Up / Down", action: "Previous / next row" },
  { keys: "+  and  -", action: "Zoom in and out" },
  { keys: "0", action: "Fit to screen" },
  { keys: "Esc", action: "Deselect the field" },
  { keys: "Hold Alt while dragging", action: "Turn off snapping" },
];

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function setFont(ctx: CanvasRenderingContext2D, field: _type_TextField) {
  const weight = field.bold ? "bold" : "normal";
  const style = field.italic ? "italic" : "normal";
  ctx.font = `${style} ${weight} ${field.fontSize}px "${field.fontFamily}"`;
}

function buildValues(
  csvData: CsvResult | null,
  fields: _type_TextField[],
  index: number
): Record<string, string> {
  const values: Record<string, string> = {};

  if (csvData?.ok) {
    for (const header of csvData.headers) {
      values[header] = csvData.rows[header]?.[index] ?? "";
    }
  } else {
    for (const field of fields) {
      values[field.column] = field.column;
    }
  }

  return values;
}

function drawFields(
  ctx: CanvasRenderingContext2D,
  fields: _type_TextField[],
  rowValues: Record<string, string>,
  w: number,
  h: number
) {
  for (const field of fields) {
    const text = rowValues[field.column] ?? "";

    setFont(ctx, field);
    ctx.fillStyle = field.color;
    ctx.textBaseline = "top";

    const x = field.x * w;
    const y = field.y * h;

    ctx.fillText(text, x, y);

    if (field.underline) {
      const textWidth = ctx.measureText(text).width;

      ctx.beginPath();
      ctx.strokeStyle = field.color;
      ctx.lineWidth = Math.max(1, field.fontSize / 16);
      ctx.moveTo(x, y + field.fontSize);
      ctx.lineTo(x + textWidth, y + field.fontSize);
      ctx.stroke();
    }
  }
}

export default function TemplateEditor({
  certificate,
  csvData,
  fields,
  selectedId,
  imgRef,
  onSelectField,
  onMoveField,
  show_prev_next_navigation = false,
  onReselect,
}: Props) {
  const previewRef = useRef<HTMLCanvasElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const helpRef = useRef<HTMLDivElement>(null);

  const draggingRef = useRef<{
    id: string;
    ox: number;
    oy: number;
  } | null>(null);

  const fieldsRef = useRef(fields);
  useEffect(() => {
    fieldsRef.current = fields;
  });

  const [indexState, setIndexState] = useState<{
    csvData: CsvResult | null;
    index: number;
  }>({ csvData, index: 0 });

  const currentIndex =
    indexState.csvData === csvData ? indexState.index : 0;

  if (indexState.csvData !== csvData) {
    setIndexState({ csvData, index: 0 });
  }

  const [zoom, setZoom] = useState(1);
  const [box, setBox] = useState({ w: 0, h: 0 });
  const [imgSize, setImgSize] = useState<{ w: number; h: number } | null>(null);
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [cursor, setCursor] = useState<"default" | "move" | "grabbing">("default");
  const [guides, setGuides] = useState({ x: false, y: false });
  const [jump, setJump] = useState<string | null>(null);
  const [helpOpen, setHelpOpen] = useState(false);

  const totalImages = csvData?.ok
    ? Math.max(
      0,
      ...csvData.headers.map(
        (header) => csvData.rows[header]?.length ?? 0
      )
    )
    : 1;

  const fit =
    imgSize && box.w > 0 && box.h > 0
      ? Math.min(box.w / imgSize.w, box.h / imgSize.h, 1)
      : 1;
  const displayScale = fit * zoom;

  const goTo = useCallback(
    (index: number) => {
      setIndexState((prev) => ({
        csvData: prev.csvData,
        index: clamp(index, 0, Math.max(0, totalImages - 1)),
      }));
    },
    [totalImages]
  );

  const goToPrevious = useCallback(() => {
    setIndexState((prev) => ({
      csvData: prev.csvData,
      index: Math.max(0, prev.index - 1),
    }));
  }, []);

  const goToNext = useCallback(() => {
    setIndexState((prev) => ({
      csvData: prev.csvData,
      index: Math.min(Math.max(0, totalImages - 1), prev.index + 1),
    }));
  }, [totalImages]);

  const zoomBy = useCallback((delta: number) => {
    setZoom((z) =>
      clamp(parseFloat((z + delta).toFixed(2)), MIN_ZOOM, MAX_ZOOM)
    );
  }, []);

  const redraw = useCallback(
    (
      currentFields: _type_TextField[],
      img: HTMLImageElement | null = imgRef.current
    ) => {
      const canvas = previewRef.current;

      if (!canvas || !img) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const w = img.naturalWidth;
      const h = img.naturalHeight;

      canvas.width = w;
      canvas.height = h;

      ctx.drawImage(img, 0, 0);

      const previewValues = buildValues(csvData, currentFields, currentIndex);

      drawFields(ctx, currentFields, previewValues, w, h);

      const unit = 1 / Math.max(displayScale, 0.05);

      for (const field of currentFields) {
        const isSelected = field.id === selectedId;
        const isHover = field.id === hoverId && !isSelected;

        if (!isSelected && !isHover) continue;

        setFont(ctx, field);

        const text = previewValues[field.column] ?? field.column;
        const textWidth = ctx.measureText(text).width;
        const textHeight = field.fontSize * 1.2;

        const px = field.x * w;
        const py = field.y * h;

        ctx.save();
        ctx.strokeStyle = ACCENT;
        ctx.lineWidth = (isSelected ? 2 : 1.5) * unit;
        if (isHover) ctx.setLineDash([6 * unit, 4 * unit]);
        ctx.strokeRect(
          px - 2 * unit,
          py - 2 * unit,
          textWidth + 4 * unit,
          textHeight + 4 * unit
        );
        ctx.restore();
      }

      if (guides.x || guides.y) {
        ctx.save();
        ctx.strokeStyle = ACCENT;
        ctx.lineWidth = unit;
        ctx.setLineDash([6 * unit, 4 * unit]);

        if (guides.x) {
          ctx.beginPath();
          ctx.moveTo(w / 2, 0);
          ctx.lineTo(w / 2, h);
          ctx.stroke();
        }

        if (guides.y) {
          ctx.beginPath();
          ctx.moveTo(0, h / 2);
          ctx.lineTo(w, h / 2);
          ctx.stroke();
        }

        ctx.restore();
      }
    },
    [csvData, currentIndex, selectedId, hoverId, guides, displayScale, imgRef]
  );

  const redrawRef = useRef(redraw);
  useEffect(() => {
    redrawRef.current = redraw;
  }, [redraw]);

  useEffect(() => {
    let cancelled = false;
    const img = new Image();

    img.onload = () => {
      if (cancelled) return;

      imgRef.current = img;
      setImgSize({ w: img.naturalWidth, h: img.naturalHeight });
      redrawRef.current(fieldsRef.current, img);
    };

    img.onerror = () => {
      console.error("Failed to load certificate image:", certificate.url);
    };

    img.src = certificate.url;

    return () => {
      cancelled = true;
    };
  }, [certificate.url, imgRef]);

  useEffect(() => {
    redraw(fields);
  }, [fields, redraw]);

  const fontSignature = Array.from(
    new Set(
      fields.map(
        (f) =>
          `${f.italic ? "italic" : "normal"} ${f.bold ? "bold" : "normal"} 16px "${f.fontFamily}"`
      )
    )
  ).join("|");

  useEffect(() => {
    if (!fontSignature || typeof document === "undefined" || !document.fonts) {
      return;
    }

    let cancelled = false;

    Promise.all(
      fontSignature.split("|").map((spec) => document.fonts.load(spec))
    )
      .then(() => {
        if (!cancelled) redrawRef.current(fieldsRef.current);
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, [fontSignature]);

  useEffect(() => {
    const node = viewportRef.current;
    if (!node) return;

    const observer = new ResizeObserver((entries) => {
      const rect = entries[0]?.contentRect;
      if (rect) setBox({ w: rect.width, h: rect.height });
    });

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!helpOpen) return;

    function onPointerDown(e: PointerEvent) {
      if (helpRef.current && !helpRef.current.contains(e.target as Node)) {
        setHelpOpen(false);
      }
    }

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setHelpOpen(false);
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [helpOpen]);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;

      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLSelectElement ||
        target?.isContentEditable
      ) {
        return;
      }

      if (e.ctrlKey || e.metaKey || e.altKey) return;

      if (e.key === "+" || e.key === "=") {
        e.preventDefault();
        zoomBy(ZOOM_STEP);
        return;
      }

      if (e.key === "-" || e.key === "_") {
        e.preventDefault();
        zoomBy(-ZOOM_STEP);
        return;
      }

      if (e.key === "0") {
        e.preventDefault();
        setZoom(1);
        return;
      }

      if (e.key === "Escape") {
        onSelectField(null);
        return;
      }

      if (show_prev_next_navigation) {
        if (e.key === "PageUp") {
          e.preventDefault();
          goToPrevious();
          return;
        }

        if (e.key === "PageDown") {
          e.preventDefault();
          goToNext();
          return;
        }
      }

      const arrows = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"];
      if (!arrows.includes(e.key)) return;

      const field = selectedId
        ? fieldsRef.current.find((f) => f.id === selectedId)
        : undefined;

      if (field) {
        e.preventDefault();

        const step = e.shiftKey ? NUDGE_FAST : NUDGE;
        const dx =
          e.key === "ArrowLeft" ? -step : e.key === "ArrowRight" ? step : 0;
        const dy =
          e.key === "ArrowUp" ? -step : e.key === "ArrowDown" ? step : 0;

        onMoveField(
          field.id,
          clamp(field.x + dx, 0, 0.98),
          clamp(field.y + dy, 0, 0.98)
        );
        return;
      }

      if (show_prev_next_navigation) {
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          goToPrevious();
        } else if (e.key === "ArrowRight") {
          e.preventDefault();
          goToNext();
        }
      }
    }

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [
    selectedId,
    show_prev_next_navigation,
    goToPrevious,
    goToNext,
    zoomBy,
    onMoveField,
    onSelectField,
  ]);

  function toNorm(e: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = previewRef.current!;
    const rect = canvas.getBoundingClientRect();

    return {
      nx: (e.clientX - rect.left) / rect.width,
      ny: (e.clientY - rect.top) / rect.height,
    };
  }

  function hitTest(nx: number, ny: number) {
    const img = imgRef.current;
    const canvas = previewRef.current;

    if (!img || !canvas) return null;

    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    const currentFields = fieldsRef.current;
    const values = buildValues(csvData, currentFields, currentIndex);

    for (let i = currentFields.length - 1; i >= 0; i--) {
      const field = currentFields[i];

      setFont(ctx, field);

      const text = values[field.column] ?? "";
      const textWidth = ctx.measureText(text).width / img.naturalWidth;
      const textHeight = (field.fontSize * 1.2) / img.naturalHeight;

      if (
        nx >= field.x &&
        nx <= field.x + Math.max(textWidth, 0.01) &&
        ny >= field.y &&
        ny <= field.y + textHeight
      ) {
        return field;
      }
    }

    return null;
  }

  function onPointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    if (e.pointerType === "mouse" && e.button !== 0) return;

    const { nx, ny } = toNorm(e);
    const hit = hitTest(nx, ny);

    if (!hit) {
      onSelectField(null);
      return;
    }

    onSelectField(hit.id);

    draggingRef.current = {
      id: hit.id,
      ox: nx - hit.x,
      oy: ny - hit.y,
    };

    e.currentTarget.setPointerCapture(e.pointerId);
    setCursor("grabbing");
  }

  function onPointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    const { nx, ny } = toNorm(e);
    const drag = draggingRef.current;

    if (!drag) {
      if (e.pointerType !== "mouse") return;

      const hit = hitTest(nx, ny);
      setHoverId(hit ? hit.id : null);
      setCursor(hit ? "move" : "default");
      return;
    }

    let x = clamp(nx - drag.ox, 0, 0.98);
    let y = clamp(ny - drag.oy, 0, 0.98);
    let snapX = false;
    let snapY = false;

    const img = imgRef.current;
    const canvas = previewRef.current;
    const field = fieldsRef.current.find((f) => f.id === drag.id);
    const ctx = canvas?.getContext("2d");

    if (!e.altKey && img && field && ctx) {
      setFont(ctx, field);

      const values = buildValues(csvData, fieldsRef.current, currentIndex);
      const text = values[field.column] ?? "";
      const widthN = ctx.measureText(text).width / img.naturalWidth;
      const heightN = (field.fontSize * 1.2) / img.naturalHeight;

      if (Math.abs(x + widthN / 2 - 0.5) < SNAP_THRESHOLD) {
        x = clamp(0.5 - widthN / 2, 0, 0.98);
        snapX = true;
      }

      if (Math.abs(y + heightN / 2 - 0.5) < SNAP_THRESHOLD) {
        y = clamp(0.5 - heightN / 2, 0, 0.98);
        snapY = true;
      }
    }

    setGuides((prev) =>
      prev.x === snapX && prev.y === snapY ? prev : { x: snapX, y: snapY }
    );

    onMoveField(drag.id, x, y);
  }

  function endDrag(e: React.PointerEvent<HTMLCanvasElement>) {
    if (draggingRef.current) {
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        return;
      } finally {
        draggingRef.current = null;
        setGuides({ x: false, y: false });
        setCursor("default");
      }
    }
  }

  function onPointerLeave() {
    if (!draggingRef.current) {
      setHoverId(null);
      setCursor("default");
    }
  }

  function commitJump() {
    const value = parseInt(jump ?? "", 10);
    if (!Number.isNaN(value)) goTo(value - 1);
    setJump(null);
  }

  function downloadCurrent() {
    const img = imgRef.current;
    if (!img) return;

    const offscreen = document.createElement("canvas");
    offscreen.width = img.naturalWidth;
    offscreen.height = img.naturalHeight;

    const ctx = offscreen.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(img, 0, 0);

    const values = buildValues(csvData, fields, currentIndex);
    drawFields(ctx, fields, values, offscreen.width, offscreen.height);

    const isPng = certificate.type === "image/png";
    const mimeType = isPng ? "image/png" : "image/jpeg";
    const ext = isPng ? "png" : "jpg";

    const firstValue = fields[0] ? values[fields[0].column] ?? "" : "";
    const safeName =
      firstValue.replace(/[^a-z0-9_-]/gi, "_").slice(0, 60) ||
      `certificate_${currentIndex + 1}`;

    offscreen.toBlob(
      (blob) => {
        if (!blob) return;

        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${safeName}.${ext}`;
        a.click();

        setTimeout(() => URL.revokeObjectURL(url), 1000);
      },
      mimeType,
      0.95
    );
  }

  const cursorClass =
    cursor === "grabbing"
      ? "cursor-grabbing"
      : cursor === "move"
        ? "cursor-move"
        : "cursor-default";

  const canvasStyle: React.CSSProperties | undefined = imgSize
    ? {
      width: imgSize.w * displayScale,
      height: imgSize.h * displayScale,
    }
    : undefined;

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-gray-100">
      <div
        role="toolbar"
        aria-label="Editor tools"
        className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 border-b border-gray-200 bg-white px-4 py-2.5"
      >
        <button
          type="button"
          onClick={() => (onReselect ? onReselect() : window.location.reload())}
          className={`flex min-h-10 cursor-pointer items-center gap-2 rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900 ${focusRing}`}
        >
          <GoSync aria-hidden="true" className="h-4 w-4" />
          Re-select
        </button>

        {show_prev_next_navigation && (
          <div
            role="group"
            aria-label="Row navigation"
            className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white p-0.5"
          >
            <button
              type="button"
              onClick={goToPrevious}
              disabled={currentIndex === 0 || totalImages === 0}
              aria-label="Previous row"
              className={iconButton}
            >
              <GoChevronLeft aria-hidden="true" className="h-4 w-4" />
            </button>

            <label className="flex items-center gap-1.5 text-sm text-gray-700">
              <span className="sr-only">Row number</span>
              <input
                type="text"
                inputMode="numeric"
                value={jump ?? String(totalImages > 0 ? currentIndex + 1 : 0)}
                onFocus={(e) => e.currentTarget.select()}
                onChange={(e) => setJump(e.target.value.replace(/\D/g, ""))}
                onBlur={commitJump}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    commitJump();
                    e.currentTarget.blur();
                  }
                  if (e.key === "Escape") {
                    setJump(null);
                    e.currentTarget.blur();
                  }
                }}
                className="h-10 w-12 rounded-md border border-transparent bg-gray-50 text-center text-sm tabular-nums outline-none transition-colors focus:border-(--brand-orange) focus:bg-white"
              />
              <span className="pr-1 tabular-nums">of {totalImages}</span>
            </label>

            <button
              type="button"
              onClick={goToNext}
              disabled={totalImages === 0 || currentIndex >= totalImages - 1}
              aria-label="Next row"
              className={iconButton}
            >
              <GoChevronRight aria-hidden="true" className="h-4 w-4" />
            </button>
          </div>
        )}

        <div className="flex items-center gap-2">
          <div
            role="group"
            aria-label="Zoom"
            className="flex items-center gap-0.5 rounded-lg border border-gray-200 bg-white p-0.5"
          >
            <button
              type="button"
              onClick={() => zoomBy(-ZOOM_STEP)}
              disabled={zoom <= MIN_ZOOM}
              aria-label="Zoom out"
              className={iconButton}
            >
              <HiOutlineMinus aria-hidden="true" className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() => setZoom(1)}
              title="Fit to screen"
              aria-label={`Zoom ${Math.round(displayScale * 100)} percent. Fit to screen`}
              className={`h-10 min-w-14 cursor-pointer rounded-md px-2 text-sm font-medium tabular-nums text-gray-700 transition-colors hover:bg-gray-100 ${focusRing}`}
            >
              {Math.round(displayScale * 100)}%
            </button>

            <button
              type="button"
              onClick={() => zoomBy(ZOOM_STEP)}
              disabled={zoom >= MAX_ZOOM}
              aria-label="Zoom in"
              className={iconButton}
            >
              <HiOutlinePlus aria-hidden="true" className="h-4 w-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={downloadCurrent}
            disabled={!imgSize}
            title="Download this document as an image"
            className={`flex min-h-10 cursor-pointer items-center gap-2 rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-40 ${focusRing}`}
          >
            <GoDownload aria-hidden="true" className="h-4 w-4" />
            <span className="hidden lg:inline">Download this one</span>
            <span className="sr-only lg:hidden">Download this document</span>
          </button>

          <div ref={helpRef} className="relative">
            <button
              type="button"
              onClick={() => setHelpOpen((open) => !open)}
              aria-expanded={helpOpen}
              aria-controls="editor-shortcuts"
              aria-label="Keyboard shortcuts"
              className={iconButton}
            >
              <HiOutlineQuestionMarkCircle aria-hidden="true" className="h-5 w-5" />
            </button>

            {helpOpen && (
              <div
                id="editor-shortcuts"
                role="dialog"
                aria-label="Keyboard shortcuts"
                className="absolute right-0 top-full z-30 mt-2 w-72 max-w-[calc(100vw-2rem)] rounded-2xl border border-gray-200 bg-white p-4 shadow-xl"
              >
                <h2 className="text-sm font-semibold text-gray-900">
                  Keyboard shortcuts
                </h2>
                <dl className="mt-3 space-y-2.5">
                  {shortcuts.map((item) => (
                    <div
                      key={item.keys}
                      className="flex items-start justify-between gap-3"
                    >
                      <dt>
                        <kbd className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs text-gray-700">
                          {item.keys}
                        </kbd>
                      </dt>
                      <dd className="text-right text-xs leading-relaxed text-(--text-gray)">
                        {item.action}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </div>
        </div>
      </div>

      {fields.length === 0 && (
        <div className="shrink-0 border-b border-orange-200 bg-orange-50/70 px-4 py-2 text-center text-xs font-medium text-(--brand-orange-ink)">
          Add data in the sidebar, then click a column to place it on your template.
        </div>
      )}

      <div className="relative min-h-[60dvh] flex-1 lg:min-h-0">
        <div
          ref={viewportRef}
          className="absolute inset-0 flex overflow-auto bg-[radial-gradient(circle,#d1d5db_1px,transparent_1px)] bg-size-[20px_20px] p-6 sm:p-10"
        >
          <canvas
            ref={previewRef}
            style={canvasStyle}
            aria-label="Template preview. Drag text fields to position them."
            className={`m-auto max-w-none shrink-0 touch-none rounded-sm bg-white shadow-xl ring-1 ring-black/10 ${cursorClass}`}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onPointerLeave={onPointerLeave}
          />
        </div>
      </div>
    </div>
  );
}