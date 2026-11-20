import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { cx } from "../cx.js";

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: ReactNode;
  onCheckedChange?: (checked: boolean) => void;
}

/** Casilla nativa con el color de marca: accesible por teclado sin más. */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  function Checkbox({ label, onCheckedChange, onChange, className, ...props }, ref) {
    const box = (
      <input
        ref={ref}
        type="checkbox"
        onChange={(event) => {
          onChange?.(event);
          onCheckedChange?.(event.target.checked);
        }}
        className={cx(
          "size-5 shrink-0 cursor-pointer accent-rymel-blue disabled:cursor-not-allowed",
          className,
        )}
        {...props}
      />
    );
    return label ? (
      <label className="inline-flex cursor-pointer items-center gap-2.5 text-sm font-medium text-gray-900">
        {box}
        {label}
      </label>
    ) : (
      box
    );
  },
);
