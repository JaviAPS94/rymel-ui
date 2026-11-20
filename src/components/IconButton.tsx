import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cx } from "../cx.js";

export interface IconButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  /** Nombre accesible y texto de ayuda: un botón de solo icono siempre lo lleva. */
  label: string;
  children: ReactNode;
  tone?: "neutral" | "danger";
  size?: "md" | "lg";
}

/** Acción de solo icono: filas de tabla, cabeceras de tarjeta, barras de filtros. */
export const IconButton = ({
  label,
  children,
  tone = "neutral",
  size = "md",
  className,
  type = "button",
  ...props
}: IconButtonProps) => (
  <button
    {...props}
    type={type}
    title={label}
    aria-label={label}
    className={cx(
      "inline-flex shrink-0 cursor-pointer items-center justify-center border border-gray-300 bg-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-rymel-indigo disabled:pointer-events-none disabled:opacity-50",
      size === "lg" ? "size-[46px] rounded-xl" : "size-10 rounded-[10px]",
      tone === "danger"
        ? "text-danger hover:border-danger/40 hover:bg-danger-soft"
        : "text-rymel-blue hover:border-rymel-blue hover:bg-rymel-blue hover:text-white",
      className,
    )}
  >
    {children}
  </button>
);
