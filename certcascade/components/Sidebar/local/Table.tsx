import { GoX } from "react-icons/go";
import type { CsvResult } from "@/types/types";

interface TableProps {
  csvData: Extract<CsvResult, { ok: true }>;
  rowCount: number;
  onCellChange: (header: string, rowIndex: number, value: string) => void;
  onClose: () => void;
}

const Table = ({ csvData, rowCount, onCellChange, onClose }: TableProps) => {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="csv-table-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="flex max-h-[85vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-gray-200 px-6 py-5">
          <div>
            <h2
              id="csv-table-title"
              className="text-lg font-bold tracking-tight text-gray-900"
            >
              Your data
            </h2>
            <p className="mt-1 text-sm text-(--text-gray)">
              {rowCount} {rowCount === 1 ? "row" : "rows"},{" "}
              {csvData.headers.length}{" "}
              {csvData.headers.length === 1 ? "column" : "columns"}. Click any
              cell to edit it.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close CSV table"
            className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg text-gray-500 outline-none transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:ring-2 focus-visible:ring-(--brand-orange)/40"
          >
            <GoX className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-auto">
          <table className="w-full border-separate border-spacing-0 text-left text-sm">
            <thead className="sticky top-0 z-10 bg-gray-50">
              <tr>
                <th className="w-14 border-b border-r border-gray-200 px-3 py-3 text-center text-xs font-medium text-gray-400">
                  #
                </th>
                {csvData.headers.map((header) => (
                  <th
                    key={header}
                    className="whitespace-nowrap border-b border-r border-gray-200 px-3 py-3 text-sm font-semibold text-gray-800"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {Array.from({ length: rowCount }).map((_, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="group transition-colors hover:bg-orange-50/40"
                >
                  <td className="border-b border-r border-gray-100 bg-gray-50 px-3 py-2 text-center text-xs tabular-nums text-gray-400">
                    {rowIndex + 1}
                  </td>

                  {csvData.headers.map((header) => (
                    <td
                      key={header}
                      className="min-w-36 border-b border-r border-gray-100 p-1"
                    >
                      <input
                        aria-label={`${header}, row ${rowIndex + 1}`}
                        value={csvData.rows[header]?.[rowIndex] ?? ""}
                        onChange={(event) =>
                          onCellChange(header, rowIndex, event.target.value)
                        }
                        className="w-full min-w-24 rounded-md border border-transparent bg-transparent px-2 py-1.5 text-sm text-gray-900 outline-none transition-colors focus:border-(--brand-orange) focus:bg-white focus:ring-2 focus:ring-(--brand-orange)/20"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4">
          <p className="text-xs text-(--text-gray)">
            Changes are held in the current session.
          </p>

          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-lg bg-(--brand-orange) px-5 py-2 text-sm font-semibold text-white outline-none transition-[filter] hover:brightness-95 focus-visible:ring-4 focus-visible:ring-(--brand-orange)/30"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default Table;