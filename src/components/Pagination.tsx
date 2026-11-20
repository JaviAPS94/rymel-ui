import { cx } from "../cx.js";
import { IconChevronLeft, IconChevronRight } from "../icons.js";

export interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  /** Con el total y el tamaño de página, muestra «Mostrando 1–10 de 37». */
  totalItems?: number;
  pageSize?: number;
  maxVisiblePages?: number;
}

const square =
  "flex h-10 min-w-10 cursor-pointer items-center justify-center rounded-[10px] border px-2 text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-rymel-indigo";
const idle = "border-gray-300 bg-white font-semibold text-gray-900 hover:bg-gray-50";

export const pageNumbers = (current: number, total: number, max: number) => {
  if (total <= max) return Array.from({ length: total }, (_, i) => i + 1);
  let start = Math.max(2, current - 1);
  let end = Math.min(total - 1, current + 1);
  if (current <= 3) {
    start = 2;
    end = Math.min(max - 1, total - 1);
  }
  if (current >= total - 2) {
    start = Math.max(2, total - (max - 2));
    end = total - 1;
  }
  const pages: (number | "…")[] = [1];
  if (start > 2) pages.push("…");
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < total - 1) pages.push("…");
  pages.push(total);
  return pages;
};

export const Pagination = ({
  page,
  totalPages,
  onPageChange,
  totalItems,
  pageSize,
  maxVisiblePages = 5,
}: PaginationProps) => {
  if (totalPages <= 1 && totalItems === undefined) return null;
  const from = pageSize ? (page - 1) * pageSize + 1 : 0;
  const to = pageSize && totalItems !== undefined ? Math.min(page * pageSize, totalItems) : 0;

  return (
    <div className="flex w-full flex-wrap items-center justify-between gap-4">
      {totalItems !== undefined && pageSize ? (
        <span className="text-sm text-gray-600">
          Mostrando <strong className="text-gray-900">{totalItems === 0 ? 0 : `${from}–${to}`}</strong>{" "}
          de <strong className="text-gray-900">{totalItems}</strong>
        </span>
      ) : (
        <span />
      )}
      {totalPages > 1 && (
        <nav aria-label="Paginación" className="flex items-center gap-1.5">
          <button
            type="button"
            aria-label="Página anterior"
            disabled={page === 1}
            onClick={() => onPageChange(page - 1)}
            className={cx(square, idle, "disabled:pointer-events-none disabled:text-gray-400")}
          >
            <IconChevronLeft size={16} />
          </button>
          {pageNumbers(page, totalPages, maxVisiblePages).map((n, index) =>
            n === "…" ? (
              <span key={`gap-${index}`} aria-hidden="true" className="w-7 text-center text-gray-600">
                …
              </span>
            ) : (
              <button
                key={n}
                type="button"
                aria-current={n === page ? "page" : undefined}
                onClick={() => onPageChange(n)}
                className={cx(
                  square,
                  n === page ? "border-rymel-blue bg-rymel-blue font-bold text-white" : idle,
                )}
              >
                {n}
              </button>
            ),
          )}
          <button
            type="button"
            aria-label="Página siguiente"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
            className={cx(square, idle, "disabled:pointer-events-none disabled:text-gray-400")}
          >
            <IconChevronRight size={16} />
          </button>
        </nav>
      )}
    </div>
  );
};
