import type { ReactNode } from "react";
import { cx } from "../cx.js";

export type BadgeTone = "neutral" | "brand" | "success" | "warning" | "danger";

const tones: Record<BadgeTone, string> = {
  neutral: "bg-gray-100 text-gray-700",
  brand: "bg-rymel-soft text-rymel-indigo",
  success: "bg-success-soft text-success",
  warning: "bg-warning-soft text-warning",
  danger: "bg-danger-soft text-danger",
};

const dots: Record<BadgeTone, string> = {
  neutral: "bg-rymel-indigo",
  brand: "bg-rymel-indigo",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
};

export interface BadgeProps {
  tone?: BadgeTone;
  /** Punto de color delante del texto. */
  dot?: boolean;
  /** Contador al final («×2»). */
  count?: ReactNode;
  icon?: ReactNode;
  title?: string;
  children: ReactNode;
}

/** Etiqueta de estado o categoría. Aquí sí vive el color semántico. */
export const Badge = ({
  tone = "neutral",
  dot,
  count,
  icon,
  title,
  children,
}: BadgeProps) => (
  <span
    title={title}
    className={cx(
      "inline-flex h-7 items-center gap-1.5 whitespace-nowrap rounded-full px-3 text-[13px] font-semibold",
      tones[tone],
    )}
  >
    {dot && <span aria-hidden="true" className={cx("size-1.5 rounded-full", dots[tone])} />}
    {icon}
    {children}
    {count !== undefined && (
      <span className="rounded-full bg-white px-1.5 text-[11px] font-bold">
        {count}
      </span>
    )}
  </span>
);

/** Ficha cuadrada con borde: subtipos cortos («1F»), versiones. */
export const Tag = ({ children, mono }: { children: ReactNode; mono?: boolean }) =>
  mono ? (
    <span className="inline-flex rounded-md bg-gray-100 px-2 py-1 font-mono text-[13px] text-gray-900">
      {children}
    </span>
  ) : (
    <span className="inline-flex h-7 min-w-9 items-center justify-center rounded-lg border border-gray-300 px-2 text-[13px] font-bold text-gray-900">
      {children}
    </span>
  );
