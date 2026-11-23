"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
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
    const weight = field.bold ? "bold" : "normal";
    const style = field.italic ? "italic" : "normal";

    ctx.font = `${style} ${weight} ${field.fontSize}px "${field.fontFamily}"`;
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
}: Props) {
  const previewRef = useRef<HTMLCanvasElement>(null);

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

  const totalImages = csvData?.ok
    ? Math.max(
      0,
      ...csvData.headers.map(
        (header) => csvData.rows[header]?.length ?? 0
      )
    )
    : 1;

  const redraw = useCallback(
    (
      currentFields: _type_TextField[],
      img: HTMLImageElement | null = imgRef.current
    ) => {
      const canvas = previewRef.current;

      if (!canvas || !img) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;

      ctx.drawImage(img, 0, 0);

      const previewValues: Record<string, string> = {};

      if (csvData?.ok) {
        for (const header of csvData.headers) {
          previewValues[header] =
            csvData.rows[header]?.[currentIndex] ?? "";
        }
      } else {
        for (const field of currentFields) {
          previewValues[field.column] = field.column;
        }
      }

      drawFields(
        ctx,
        currentFields,
        previewValues,
        img.naturalWidth,
        img.naturalHeight
      );

      for (const field of currentFields) {
        if (field.id !== selectedId) continue;

        const weight = field.bold ? "bold" : "normal";
        const style = field.italic ? "italic" : "normal";

        ctx.font = `${style} ${weight} ${field.fontSize}px "${field.fontFamily}"`;

        const text = previewValues[field.column] ?? field.column;
        const textWidth = ctx.measureText(text).width;
        const textHeight = field.fontSize * 1.2;

        const px = field.x * img.naturalWidth;
        const py = field.y * img.naturalHeight;

        ctx.strokeStyle = "#2563eb";
        ctx.lineWidth = 2;
        ctx.strokeRect(
          px - 2,
          py - 2,
          textWidth + 4,
          textHeight + 4
        );
      }
    },
    [csvData, currentIndex, selectedId, imgRef]
  );

  useEffect(() => {
    let cancelled = false;
    const img = new Image();

    img.onload = () => {
      if (cancelled) return;

      imgRef.current = img;
      redraw(fieldsRef.current, img);
    };

    img.onerror = () => {
      console.error("Failed to load certificate image:", certificate.url);
    };

    img.src = certificate.url;

    return () => {
      cancelled = true;
    };
  }, [certificate.url, imgRef, redraw]);

  useEffect(() => {
    redraw(fields);
  }, [fields, selectedId, redraw]);

  function goToPrevious() {
    setIndexState((prev) => ({
      csvData: prev.csvData,
      index: Math.max(0, prev.index - 1),
    }));
  }

  function goToNext() {
    setIndexState((prev) => ({
      csvData: prev.csvData,
      index: Math.min(Math.max(0, totalImages - 1), prev.index + 1),
    }));
  }

  function toNorm(e: React.MouseEvent<HTMLCanvasElement>) {
    const canvas = previewRef.current!;

    const rect = canvas.getBoundingClientRect();

    return {
      nx: (e.clientX - rect.left) / rect.width,
      ny: (e.clientY - rect.top) / rect.height,
    };
  }

  function onMouseDown(e: React.MouseEvent<HTMLCanvasElement>) {
    const { nx, ny } = toNorm(e);
    const img = imgRef.current;
    const canvas = previewRef.current;

    if (!img || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const currentFields = fieldsRef.current;

    for (let i = currentFields.length - 1; i >= 0; i--) {
      const field = currentFields[i];

      const weight = field.bold ? "bold" : "normal";
      const style = field.italic ? "italic" : "normal";

      ctx.font = `${style} ${weight} ${field.fontSize}px "${field.fontFamily}"`;

      const previewVal = csvData?.ok
        ? csvData.rows[field.column]?.[currentIndex] ?? ""
        : field.column;

      const textWidth =
        ctx.measureText(previewVal).width / img.naturalWidth;

      const textHeight =
        (field.fontSize * 1.2) / img.naturalHeight;

      if (
        nx >= field.x &&
        nx <= field.x + textWidth &&
        ny >= field.y &&
        ny <= field.y + textHeight
      ) {
        onSelectField(field.id);

        draggingRef.current = {
          id: field.id,
          ox: nx - field.x,
          oy: ny - field.y,
        };

        return;
      }
    }

    onSelectField(null);
  }

  function onMouseMove(e: React.MouseEvent<HTMLCanvasElement>) {
    const drag = draggingRef.current;

    if (!drag) return;

    const { nx, ny } = toNorm(e);

    onMoveField(
      drag.id,
      Math.max(0, Math.min(0.98, nx - drag.ox)),
      Math.max(0, Math.min(0.98, ny - drag.oy))
    );
  }

  function onMouseUp() {
    draggingRef.current = null;
  }

  return (
    <div className="relative flex flex-1 items-center justify-center overflow-auto bg-gray-100 p-6">
      <div className="absolute left-0 top-0 z-10 m-1">
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="cursor-pointer rounded-sm bg-white p-2 text-(--text-gray) transition-all duration-100 ease-in hover:scale-105 hover:text-black"
        >
          Re-select
        </button>
      </div>

      {show_prev_next_navigation && (
        <div className="absolute left-1/2 top-0 z-10 m-1 flex -translate-x-1/2 items-center gap-1 rounded-lg border border-black/10 bg-white p-1 shadow-sm">
          <button
            type="button"
            onClick={goToPrevious}
            disabled={currentIndex === 0 || totalImages === 0}
            className="cursor-pointer rounded-md px-3 py-2 text-sm text-(--text-gray) transition-colors hover:bg-gray-100 hover:text-black disabled:cursor-not-allowed disabled:opacity-30"
          >
            Previous
          </button>

          <span className="min-w-14 text-center text-xs font-medium tabular-nums text-gray-600">
            {totalImages > 0 ? currentIndex + 1 : 0} / {totalImages}
          </span>

          <button
            type="button"
            onClick={goToNext}
            disabled={
              totalImages === 0 || currentIndex >= totalImages - 1
            }
            className="cursor-pointer rounded-md px-3 py-2 text-sm text-(--text-gray) transition-colors hover:bg-gray-100 hover:text-black disabled:cursor-not-allowed disabled:opacity-30"
          >
            Next
          </button>
        </div>
      )}

      <canvas
        ref={previewRef}
        className="max-h-full max-w-full cursor-crosshair shadow-xl"
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
      />
    </div>
  );
}
