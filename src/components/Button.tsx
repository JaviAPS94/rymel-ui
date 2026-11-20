import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cx } from "../cx.js";
import { IconSpinner } from "../icons.js";

/**
 * Jerarquía de botones:
 *  - primary:   la acción principal de la zona. Una sola por zona.
 *  - accent:    guardar / cerrar un flujo: el amarillo de marca.
 *  - secondary: el resto de acciones (borde, fondo blanco).
 *  - ghost:     acciones de poco peso (instrucciones, volver).
 *  - danger:    acciones destructivas.
 *  - light, outlineLight, ghostLight, dangerLight: las mismas sobre la banda índigo.
 *
 * El color no distingue tipos de acción: verde, ámbar y rojo suave quedan
 * para estados (etiquetas, avisos), nunca para botones.
 */
export type ButtonVariant =
  | "primary"
  | "accent"
  | "secondary"
  | "ghost"
  | "danger"
  | "light"
  | "outlineLight"
  | "ghostLight"
  | "dangerLight";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Icono antes del texto. */
  icon?: ReactNode;
  loading?: boolean;
  /** Estado «encendido» de un botón que alterna un modo. */
  active?: boolean;
  /** Ocupa todo el ancho disponible. */
  block?: boolean;
}

export const buttonVariants: Record<ButtonVariant, string> = {
  primary:
    "border-rymel-blue bg-rymel-blue font-bold text-white hover:bg-rymel-indigo",
  accent:
    "border-rymel-yellow bg-rymel-yellow font-extrabold text-rymel-blue hover:brightness-105",
  secondary:
    "border-gray-300 bg-white font-semibold text-gray-900 hover:border-gray-400 hover:bg-gray-50",
  ghost:
    "border-transparent bg-transparent font-semibold text-gray-900 hover:bg-gray-100",
  danger:
    "border-danger bg-danger font-bold text-white hover:brightness-90",
  light:
    "border-white bg-white font-bold text-rymel-blue hover:bg-rymel-tint",
  outlineLight:
    "border-white/30 bg-transparent font-semibold text-white hover:bg-white/10",
  ghostLight:
    "border-transparent bg-transparent font-semibold text-white/85 hover:bg-white/10 hover:text-white",
  dangerLight:
    "border-[#FF8A80]/50 bg-transparent font-bold text-[#FFB4AB] hover:bg-[#FF8A80]/10",
};

export const buttonSizes: Record<ButtonSize, string> = {
  sm: "h-9 gap-1.5 rounded-[10px] px-3 text-[13px]",
  md: "h-11 gap-2 rounded-xl px-4 text-sm",
  lg: "h-[50px] gap-2 rounded-xl px-5 text-[15px]",
};

const activeClass =
  "border-rymel-blue bg-rymel-soft font-bold text-rymel-indigo";

/** Clases de botón, para dar aspecto de botón a un enlace. */
export const buttonClass = ({
  variant = "primary",
  size = "md",
  active,
  block,
}: Pick<ButtonProps, "variant" | "size" | "active" | "block"> = {}) =>
  cx(
    "inline-flex shrink-0 cursor-pointer items-center justify-center whitespace-nowrap border no-underline transition focus:outline-none focus-visible:ring-2 focus-visible:ring-rymel-indigo focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
    buttonSizes[size],
    active ? activeClass : buttonVariants[variant],
    block && "w-full",
  );

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = "primary",
      size = "md",
      icon,
      loading,
      active,
      block,
      disabled,
      className,
      children,
      type = "button",
      ...props
    },
    ref,
  ) {
    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        aria-pressed={active}
        className={cx(buttonClass({ variant, size, active, block }), className)}
        {...props}
      >
        {loading ? <IconSpinner size={16} /> : icon}
        {children}
      </button>
    );
  },
);
