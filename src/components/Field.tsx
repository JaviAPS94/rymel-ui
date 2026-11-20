import type { ReactNode } from "react";
import { cx } from "../cx.js";

export interface FieldProps {
  label: ReactNode;
  children: ReactNode;
  /** Texto de ayuda bajo el campo. */
  hint?: ReactNode;
  /** Mensaje de error; sustituye a la ayuda. */
  error?: ReactNode;
  /**
   * `form`: etiqueta oscura de formulario.
   * `filter`: etiqueta pequeña y gris de una barra de filtros; el campo crece en la fila.
   */
  variant?: "form" | "filter";
  className?: string;
}

/** Etiqueta + control. Envuelve el control en un `<label>`, así el clic lo enfoca. */
export const Field = ({
  label,
  children,
  hint,
  error,
  variant = "form",
  className,
}: FieldProps) => (
  <label
    className={cx(
      "flex min-w-0 flex-col",
      variant === "filter"
        ? "flex-[1_1_180px] gap-1.5 text-xs font-semibold text-gray-600"
        : "gap-2 text-sm font-semibold text-gray-900",
      className,
    )}
  >
    <span>{label}</span>
    {children}
    {error ? (
      <span role="alert" className="text-[13px] font-medium text-danger">
        {error}
      </span>
    ) : (
      hint && <span className="text-[13px] font-normal text-gray-600">{hint}</span>
    )}
  </label>
);

/** Campo de una barra de filtros. */
export const FilterField = (props: Omit<FieldProps, "variant">) => (
  <Field {...props} variant="filter" />
);
