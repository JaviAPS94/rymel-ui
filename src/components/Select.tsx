import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { cx } from "../cx.js";
import { IconChevronDown, IconX } from "../icons.js";
import { fieldBoxClass, fieldInputClass } from "./Input.js";

export interface SelectOption<T> {
  label: string;
  value: T;
  /** Contenido delante del texto (bandera, icono). */
  prefix?: ReactNode;
}

export interface SelectProps<T> {
  options: SelectOption<T>[] | undefined;
  value: T | null | undefined;
  onChange: (value: T | undefined) => void;
  placeholder?: string;
  loading?: boolean;
  disabled?: boolean;
  invalid?: boolean;
  /** Permite escribir para filtrar (por defecto, sí). */
  searchable?: boolean;
  /** Muestra la ✕ para quitar la selección (por defecto, sí). */
  clearable?: boolean;
  size?: "md" | "lg";
  className?: string;
  "aria-label"?: string;
  emptyText?: string;
}

/** Desplegable con búsqueda y teclado (↑ ↓ Intro Esc). */
export function Select<T>({
  options = [],
  value,
  onChange,
  placeholder = "Selecciona una opción…",
  loading,
  disabled,
  invalid,
  searchable = true,
  clearable = true,
  size,
  className,
  emptyText = "No hay resultados",
  ...aria
}: SelectProps<T>) {
  const listId = useId();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [highlight, setHighlight] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selected = options.find((option) => option.value === value);
  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return term
      ? options.filter((option) => option.label.toLowerCase().includes(term))
      : options;
  }, [options, query]);

  useEffect(() => {
    if (!open) return;
    const close = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  useEffect(() => setHighlight(0), [query, open]);

  const choose = (option: SelectOption<T>) => {
    onChange(option.value);
    setQuery("");
    setOpen(false);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (!open) setOpen(true);
      else setHighlight((i) => Math.min(i + 1, filtered.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlight((i) => Math.max(i - 1, 0));
    } else if (event.key === "Enter" && open) {
      event.preventDefault();
      const option = filtered[highlight];
      if (option) choose(option);
    } else if (event.key === "Escape") {
      setOpen(false);
      setQuery("");
    }
  };

  const showClear = clearable && !disabled && (selected || query);

  return (
    <div ref={rootRef} className={cx("relative w-full", className)}>
      <div
        className={cx(fieldBoxClass(invalid, size), "pr-2", disabled && "bg-gray-100")}
        onClick={() => !disabled && inputRef.current?.focus()}
      >
        {selected?.prefix && !query && <span className="flex shrink-0">{selected.prefix}</span>}
        <input
          ref={inputRef}
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-invalid={invalid || undefined}
          aria-label={aria["aria-label"]}
          readOnly={!searchable}
          disabled={disabled || loading}
          placeholder={loading ? "Cargando…" : placeholder}
          value={query || selected?.label || ""}
          onFocus={() => setOpen(true)}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onKeyDown={onKeyDown}
          className={cx(fieldInputClass, !searchable && "cursor-pointer")}
        />
        {showClear && (
          <button
            type="button"
            aria-label="Quitar selección"
            onClick={(event) => {
              event.stopPropagation();
              setQuery("");
              onChange(undefined);
            }}
            className="flex shrink-0 cursor-pointer rounded-md p-1 text-gray-400 hover:text-gray-700"
          >
            <IconX size={15} />
          </button>
        )}
        {!disabled && (
          <IconChevronDown
            size={14}
            className={cx(
              "shrink-0 text-gray-400 transition-transform",
              open && "rotate-180",
            )}
          />
        )}
      </div>

      {open && !disabled && (
        <ul
          id={listId}
          role="listbox"
          className="absolute left-0 top-full z-30 mt-2 max-h-64 w-full overflow-y-auto rounded-xl border border-gray-200 bg-white p-1.5 text-sm shadow-menu"
        >
          {loading ? (
            <li className="p-2.5 text-gray-600">Cargando…</li>
          ) : filtered.length === 0 ? (
            <li className="p-2.5 text-gray-600">{emptyText}</li>
          ) : (
            filtered.map((option, index) => {
              const isSelected = option.value === value;
              return (
                <li
                  key={String(option.value)}
                  role="option"
                  aria-selected={isSelected}
                  onMouseDown={(event) => event.preventDefault()}
                  onMouseEnter={() => setHighlight(index)}
                  onClick={() => choose(option)}
                  className={cx(
                    "flex cursor-pointer items-center gap-2 rounded-[10px] px-3 py-2.5",
                    isSelected
                      ? "bg-rymel-tint font-bold text-rymel-blue"
                      : index === highlight
                        ? "bg-gray-50 text-gray-900"
                        : "text-gray-900",
                  )}
                >
                  {option.prefix}
                  {option.label}
                </li>
              );
            })
          )}
        </ul>
      )}
    </div>
  );
}
