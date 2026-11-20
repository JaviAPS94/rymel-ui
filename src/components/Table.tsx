import type { ReactNode } from "react";
import { cx } from "../cx.js";

/**
 * Tarjeta de tabla: borde redondeado, desplazamiento horizontal y pie.
 * Dentro va una `<table className="rm-table">` normal:
 *  - `<th data-align="right">` / `<td data-align="right">` para cifras.
 *  - `<tr aria-selected>` tiñe la fila elegida.
 *  - `rm-table rm-table-compact` reduce el alto de fila.
 */
export const TableCard = ({
  children,
  footer,
  minWidth = 960,
  className,
  "aria-label": ariaLabel,
}: {
  children: ReactNode;
  /** Pie: normalmente `<Pagination>`. */
  footer?: ReactNode;
  /** Ancho mínimo de la tabla antes de desplazarse en horizontal. */
  minWidth?: number;
  className?: string;
  "aria-label"?: string;
}) => (
  <section
    aria-label={ariaLabel}
    className={cx("overflow-hidden rounded-[20px] border border-gray-200 bg-white", className)}
  >
    <div className="overflow-x-auto [&>table]:min-w-[var(--rm-table-min)]" style={{ ["--rm-table-min" as string]: `${minWidth}px` }}>
      {children}
    </div>
    {footer && <div className="px-6 py-4">{footer}</div>}
  </section>
);

/** Ficha cuadrada de la primera columna: icono o iniciales. */
export const RowIcon = ({ children }: { children: ReactNode }) => (
  <span
    aria-hidden="true"
    className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-rymel-soft text-xs font-extrabold text-rymel-indigo"
  >
    {children}
  </span>
);

/** Nombre en negrita con código monoespaciado debajo. */
export const TitleCell = ({
  icon,
  title,
  code,
}: {
  icon?: ReactNode;
  title: ReactNode;
  code?: ReactNode;
}) => (
  <div className="flex items-center gap-3.5">
    {icon && <RowIcon>{icon}</RowIcon>}
    <div className="flex min-w-0 flex-col gap-0.5">
      <span className="font-bold text-gray-900">{title}</span>
      {code && <span className="font-mono text-[12.5px] text-gray-600">{code}</span>}
    </div>
  </div>
);
