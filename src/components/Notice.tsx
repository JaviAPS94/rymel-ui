import type { ReactNode } from "react";
import { cx } from "../cx.js";
import { IconAlert, IconCheckCircle, IconX } from "../icons.js";

export type NoticeTone = "info" | "success" | "warning" | "danger";

const tones: Record<NoticeTone, string> = {
  info: "bg-rymel-tint text-rymel-blue",
  success: "bg-success-soft text-success",
  warning: "bg-warning-soft text-warning",
  danger: "bg-danger-soft text-danger",
};

/** Aviso dentro de la pantalla: guardado, falta un dato, error de carga. */
export const Notice = ({
  tone = "info",
  title,
  children,
  icon,
  actions,
  onClose,
}: {
  tone?: NoticeTone;
  title?: ReactNode;
  children?: ReactNode;
  icon?: ReactNode;
  actions?: ReactNode;
  onClose?: () => void;
}) => (
  <div
    role={tone === "danger" ? "alert" : "status"}
    className={cx("flex flex-wrap items-start gap-3 rounded-[14px] px-4 py-3.5 text-sm", tones[tone])}
  >
    <span className="mt-px flex shrink-0">{icon ?? (tone === "success" ? <IconCheckCircle size={18} /> : <IconAlert size={18} />)}</span>
    <div className="flex min-w-0 flex-[1_1_240px] flex-col gap-0.5">
      {title && <span className="font-bold">{title}</span>}
      {children && <span className={title ? "opacity-90" : "font-semibold"}>{children}</span>}
    </div>
    {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    {onClose && (
      <button
        type="button"
        aria-label="Cerrar aviso"
        onClick={onClose}
        className="flex shrink-0 cursor-pointer rounded-md border-0 bg-transparent p-0.5 text-current opacity-70 hover:opacity-100"
      >
        <IconX size={16} />
      </button>
    )}
  </div>
);
