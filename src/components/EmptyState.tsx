import type { ReactNode } from "react";
import { cx } from "../cx.js";
import { IconAlert, IconInbox } from "../icons.js";

export interface EmptyStateProps {
  title: ReactNode;
  description?: ReactNode;
  /** `error` pinta el icono y el título en rojo. */
  tone?: "neutral" | "error";
  icon?: ReactNode;
  /** Acción bajo el texto («Limpiar filtros», «Agregar elemento»). */
  action?: ReactNode;
  /** Sin tarjeta, para usarlo dentro de una sección. */
  bare?: boolean;
}

/** Sin resultados, sin datos todavía o error de carga. */
export const EmptyState = ({
  title,
  description,
  tone = "neutral",
  icon,
  action,
  bare,
}: EmptyStateProps) => {
  const isError = tone === "error";
  return (
    <div
      role={isError ? "alert" : undefined}
      className={cx(
        "flex flex-col items-center justify-center gap-3 px-8 py-12 text-center",
        !bare && "rounded-[20px] border border-gray-200 bg-white",
      )}
    >
      <span
        aria-hidden="true"
        className={cx(
          "flex size-16 items-center justify-center rounded-[20px]",
          isError ? "bg-danger-soft text-danger" : "bg-gray-100 text-gray-400",
        )}
      >
        {icon ?? (isError ? <IconAlert size={28} /> : <IconInbox size={28} />)}
      </span>
      <p className={cx("m-0 max-w-[520px] text-[17px] font-bold", isError ? "text-danger" : "text-gray-900")}>
        {title}
      </p>
      {description && (
        <p className="m-0 max-w-[520px] text-sm leading-relaxed text-gray-600">{description}</p>
      )}
      {action && <div className="mt-1">{action}</div>}
    </div>
  );
};
