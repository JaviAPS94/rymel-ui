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
  /** Muestra el botón «Cerrar» de la cabecera (por defecto, sí). */
  showCloseButton?: boolean;
}

const widths = {
  sm: "max-w-md",
  md: "max-w-xl",
  lg: "max-w-3xl",
  xl: "max-w-[1120px]",
};

/**
 * Modales abiertos, el más reciente al final: Esc cierra solo el de arriba
 * (un selector abierto desde otro modal), no todos los de debajo.
 */
const openModals: symbol[] = [];

/**
 * Diálogo modal.
 *
 * - Esc cierra solo el modal de arriba y respeta un Esc que ya usó alguien
 *   dentro (`event.defaultPrevented`, p. ej. un autocompletado).
 * - Un modal más alto que la pantalla se desplaza con el fondo
 *   (`[data-modal-overlay]`) y su cabecera queda fija arriba. El cuerpo no
 *   tiene desplazamiento propio, así no recorta los desplegables que contiene.
 * - El foco entra al abrir y vuelve a donde estaba al cerrar.
 */
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
  showCloseButton = true,
}: ModalProps) => {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) return;
    const token = Symbol("modal");
    openModals.push(token);

    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus({ preventScroll: true });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (openModals[openModals.length - 1] !== token) return;
      // Alguien dentro ya lo usó (cerrar un autocompletado): cerrar también
      // el modal perdería lo escrito.
      if (event.defaultPrevented) return;
      event.stopPropagation();
      onCloseRef.current();
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      openModals.splice(openModals.indexOf(token), 1);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus?.({ preventScroll: true });
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      data-modal-overlay
      className="fixed inset-0 z-50 overflow-y-auto bg-[#0E0C2E]/60"
      onMouseDown={(event) => {
        if (dismissable && !panelRef.current?.contains(event.target as Node)) {
          onClose();
        }
      }}
    >
      <div className="flex min-h-full items-start justify-center p-4 sm:py-14">
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          tabIndex={-1}
          className={cx(
            "w-full rounded-3xl bg-white shadow-modal outline-none",
            widths[size],
          )}
        >
          {/* El título es hijo directo de la cabecera fija: icono, título y
              cierre van en una rejilla, la descripción en su segunda fila. */}
          <div
            className={cx(
              "sticky top-0 z-10 grid items-center gap-x-4 gap-y-0.5 rounded-t-3xl border-b border-gray-200 bg-white px-5 py-5 sm:px-7",
              icon
                ? "grid-cols-[auto_minmax(0,1fr)_auto]"
                : "grid-cols-[minmax(0,1fr)_auto]",
            )}
          >
            {icon && (
              <span
                aria-hidden="true"
                className="row-span-2 flex size-11 shrink-0 items-center justify-center rounded-xl bg-rymel-blue text-rymel-yellow"
              >
                {icon}
              </span>
            )}
            <h2
              id={titleId}
              className={cx(
                "m-0 text-xl font-extrabold tracking-[-0.01em] text-gray-900",
                icon ? "col-start-2" : "col-start-1",
              )}
            >
              {title}
            </h2>
            {description && (
              <p
                className={cx(
                  "m-0 text-sm text-gray-600",
                  icon ? "col-start-2" : "col-start-1",
                )}
              >
                {description}
              </p>
            )}
            {showCloseButton && (
              <button
                type="button"
                aria-label="Cerrar"
                onClick={onClose}
                className={cx(
                  "row-span-2 row-start-1 flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-xl border-0 bg-gray-100 text-gray-900 transition-colors hover:bg-gray-200",
                  icon ? "col-start-3" : "col-start-2",
                )}
              >
                <IconX size={20} />
              </button>
            )}
          </div>
          <div className="px-5 py-6 sm:px-7">{children}</div>
          {footer && (
            <div className="flex flex-wrap justify-end gap-2.5 rounded-b-3xl border-t border-gray-200 px-5 py-4 sm:px-7">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
