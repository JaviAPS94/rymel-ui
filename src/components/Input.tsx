import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { cx } from "../cx.js";
import { IconX } from "../icons.js";

/** Caja de los campos: la comparten Input y Select. */
export const fieldBoxClass = (invalid?: boolean, size: "md" | "lg" = "md") =>
  cx(
    "flex w-full items-center gap-2 rounded-xl border bg-white px-3.5 transition-[border-color,box-shadow] focus-within:ring-[3px]",
    size === "lg" ? "h-[50px]" : "h-[46px]",
    invalid
      ? "border-danger focus-within:border-danger focus-within:ring-danger/20"
      : "border-gray-300 hover:border-gray-400 focus-within:border-rymel-indigo focus-within:ring-rymel-indigo/[.12]",
  );

export const fieldInputClass =
  "h-full min-w-0 flex-1 border-0 bg-transparent p-0 text-[15px] text-gray-900 outline-none placeholder:text-gray-500 disabled:cursor-not-allowed disabled:text-gray-500";

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  leftIcon?: ReactNode;
  rightSlot?: ReactNode;
  invalid?: boolean;
  /** Muestra una ✕ para vaciar el campo cuando tiene valor. */
  onClear?: () => void;
  /** Texto monoespaciado: códigos, referencias, versiones. */
  mono?: boolean;
  size?: "md" | "lg";
  /** Clases de la caja exterior. */
  className?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { leftIcon, rightSlot, invalid, onClear, mono, size, className, disabled, value, ...props },
  ref,
) {
  return (
    <span
      className={cx(
        fieldBoxClass(invalid, size),
        disabled && "bg-gray-100",
        className,
      )}
    >
      {leftIcon && <span className="flex shrink-0 text-gray-400">{leftIcon}</span>}
      <input
        ref={ref}
        value={value}
        disabled={disabled}
        aria-invalid={invalid || undefined}
        className={cx(fieldInputClass, mono && "font-mono text-sm")}
        {...props}
      />
      {onClear && value !== undefined && value !== "" && !disabled && (
        <button
          type="button"
          aria-label="Vaciar"
          onClick={onClear}
          className="flex shrink-0 cursor-pointer rounded-md p-0.5 text-gray-400 hover:text-gray-700"
        >
          <IconX size={16} />
        </button>
      )}
      {rightSlot}
    </span>
  );
});
