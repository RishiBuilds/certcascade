"use client";
import HomePage from "@/components/HomePage/HomePage";
import { useRef, useState } from "react";
import { CertificateInterface } from "@/types/types";
import Sidebar from "@/components/Sidebar/Sidebar";
import TemplateEditor from "@/components/TemplateEditor/TemplateEditor";
import type { CsvResult, _type_TextField } from "@/types/types";

export default function GenerateCertificate() {
  const [certificate, setCertificate] = useState<CertificateInterface | null>(null);
  const [csvData, setCsvData] = useState<CsvResult | null>(null);
  const [fields, setFields] = useState<_type_TextField[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  function handleMoveField(id: string, x: number, y: number) {
    setFields((prev) => prev.map((f) => (f.id === id ? { ...f, x, y } : f)));
  }

  if (certificate != null) {
    return (
      <main className="flex h-(--body-height) overflow-hidden">
        <Sidebar
          certificate={certificate}
          fields={fields}
          setFields={setFields}
          selectedId={selectedId}
          setSelectedId={setSelectedId}
          onCsvDataChange={setCsvData}
          imgRef={imgRef}
        />
        <TemplateEditor
          show_prev_next_navigation={csvData != null}
          certificate={certificate}
          csvData={csvData}
          fields={fields}
          selectedId={selectedId}
          imgRef={imgRef}
          onSelectField={setSelectedId}
          onMoveField={handleMoveField}
        />
      </main>
    );
  }

  return <HomePage onCertificateChange={setCertificate} />;
}
