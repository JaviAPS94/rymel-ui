import { useId, useState, type ReactNode } from "react";
import { cx } from "../cx.js";

export interface TabItem {
  id: string;
  label: ReactNode;
  icon?: ReactNode;
  /** Contador junto al texto (solo en `underline`). */
  count?: ReactNode;
  content: ReactNode;
}

export interface TabsProps {
  items: TabItem[];
  /**
   * `segmented`: pastillas sobre fondo gris (vistas de una misma cosa).
   * `underline`: subrayado bajo el título de una tarjeta (secciones).
   */
  variant?: "segmented" | "underline";
  /** Controlado… */
  value?: string;
  onValueChange?: (id: string) => void;
  /** …o no controlado. */
  defaultValue?: string;
  className?: string;
  /** Clases del contenedor de pestañas (p. ej. relleno lateral en `underline`). */
  listClassName?: string;
  /** Mantiene montadas las pestañas ocultas (hojas de cálculo con estado). */
  keepMounted?: boolean;
  "aria-label"?: string;
}

export const Tabs = ({
  items,
  variant = "segmented",
  value,
  onValueChange,
  defaultValue,
  className,
  listClassName,
  keepMounted = true,
  "aria-label": ariaLabel,
}: TabsProps) => {
  const baseId = useId();
  const [inner, setInner] = useState(defaultValue ?? items[0]?.id);
  const active = value ?? inner;
  const select = (id: string) => {
    setInner(id);
    onValueChange?.(id);
  };

  return (
    <div className={className}>
      <div
        role="tablist"
        aria-label={ariaLabel}
        className={cx(
          variant === "segmented"
            ? "inline-flex flex-wrap items-center gap-1 rounded-[14px] bg-gray-100 p-1"
            : "flex gap-1 overflow-x-auto border-b border-gray-200",
          listClassName,
        )}
      >
        {items.map((item) => {
          const selected = item.id === active;
          return (
            <button
              key={item.id}
              id={`${baseId}-tab-${item.id}`}
              role="tab"
              type="button"
              aria-selected={selected}
              aria-controls={`${baseId}-panel-${item.id}`}
              onClick={() => select(item.id)}
              className={cx(
                "flex cursor-pointer items-center gap-2 whitespace-nowrap border-0 text-sm transition-colors",
                variant === "segmented"
                  ? cx(
                      "h-[42px] rounded-[10px] px-4",
                      selected
                        ? "bg-rymel-blue font-bold text-white"
                        : "bg-transparent font-semibold text-gray-700 hover:bg-white",
                    )
                  : cx(
                      "h-[60px] border-b-[3px] border-solid bg-transparent px-4 text-[15px]",
                      selected
                        ? "border-rymel-blue font-bold text-rymel-blue"
                        : "border-transparent font-semibold text-gray-600 hover:text-gray-900",
                    ),
              )}
            >
              {item.icon}
              {item.label}
              {item.count !== undefined && (
                <span className="rounded-full bg-gray-100 px-2 py-px text-xs font-bold text-gray-700">
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
      {items.map((item) =>
        keepMounted || item.id === active ? (
          <div
            key={item.id}
            id={`${baseId}-panel-${item.id}`}
            role="tabpanel"
            aria-labelledby={`${baseId}-tab-${item.id}`}
            hidden={item.id !== active}
            className={variant === "segmented" ? "mt-5" : undefined}
          >
            {item.content}
          </div>
        ) : null,
      )}
    </div>
  );
};
