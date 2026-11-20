import type { ReactNode } from "react";

/**
 * Barra índigo fija al pie mientras hay algo elegido o pendiente de guardar:
 * «3 elementos seleccionados · Limpiar · Continuar».
 */
export const SelectionBar = ({
  count,
  label,
  hint,
  actions,
}: {
  count: ReactNode;
  label: ReactNode;
  /** Texto secundario tras la etiqueta. */
  hint?: ReactNode;
  /** Botones en variantes claras (`light`, `outlineLight`, `accent`). */
  actions?: ReactNode;
}) => (
  <div className="sticky bottom-4 z-10 flex flex-wrap items-center justify-between gap-4 rounded-[18px] bg-rymel-blue py-3 pl-6 pr-3 text-white shadow-bar">
    <div className="flex flex-wrap items-center gap-3 text-[15px]">
      <span className="flex h-8 min-w-8 items-center justify-center rounded-[10px] bg-rymel-yellow px-2 font-extrabold text-rymel-blue">
        {count}
      </span>
      {label}
      {hint && <span className="text-sm text-white/70">· {hint}</span>}
    </div>
    {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
  </div>
);
