import { useEffect, useId, useRef, type ReactNode } from "react";
import { cx } from "../cx.js";
import { IconX } from "../icons.js";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  description?: ReactNode;
  /** Icono en ficha índigo junto al título. */
  icon?: ReactNode;
  children: ReactNode;
  /** Botones al pie, alineados a la derecha. */
  footer?: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  /** Cerrar al pulsar fuera (por defecto, sí). */
  dismissable?: boolean;
}

const widths = {
  sm: "max-w-md",
  md: "max-w-xl",
  lg: "max-w-3xl",
  xl: "max-w-[1120px]",
};

/** Diálogo modal: Esc cierra, el foco entra al abrir y el fondo no se desplaza. */
export const Modal = ({
  open,
  onClose,
  title,
  description,
  icon,
  children,
  footer,
  size = "md",
  dismissable = true,
}: ModalProps) => {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCloseRef.current();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      previous?.focus?.();
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-[#0E0C2E]/60 p-4 sm:pt-14"
      onMouseDown={(event) => {
        if (dismissable && event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={cx(
          "w-full overflow-hidden rounded-3xl bg-white shadow-modal outline-none",
          widths[size],
        )}
      >
        <div className="flex items-center gap-4 border-b border-gray-200 px-5 py-5 sm:px-7">
          {icon && (
            <span
              aria-hidden="true"
              className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-rymel-blue text-rymel-yellow"
            >
              {icon}
            </span>
          )}
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <h2 id={titleId} className="m-0 text-xl font-extrabold tracking-[-0.01em] text-gray-900">
              {title}
            </h2>
            {description && <p className="m-0 text-sm text-gray-600">{description}</p>}
          </div>
          <button
            type="button"
            aria-label="Cerrar"
            onClick={onClose}
            className="flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-xl border-0 bg-gray-100 text-gray-900 transition-colors hover:bg-gray-200"
          >
            <IconX size={20} />
          </button>
        </div>
        <div className="px-5 py-6 sm:px-7">{children}</div>
        {footer && (
          <div className="flex flex-wrap justify-end gap-2.5 border-t border-gray-200 px-5 py-4 sm:px-7">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
