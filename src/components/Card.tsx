import type { HTMLAttributes, ReactNode } from "react";
import { cx } from "../cx.js";

export interface CardProps extends HTMLAttributes<HTMLElement> {
  /** Sombra en lugar de borde (el primer bloque de `<Page>` ya la lleva solo). */
  elevated?: boolean;
  padded?: boolean;
  as?: "section" | "div" | "article" | "form";
}

/** Tarjeta blanca de pantalla: filtros, tablas, bloques. */
export const Card = ({ elevated, padded = true, as: Tag = "section", className, ...props }: CardProps) => (
  <Tag
    className={cx(
      "rounded-[20px] border bg-white",
      elevated ? "border-transparent shadow-float" : "border-gray-200",
      padded && "p-5",
      className,
    )}
    {...props}
  />
);

export interface SectionCardProps {
  /** Número del paso, cuando la pantalla se recorre en orden. El 1 va en índigo. */
  step?: number;
  /** Icono en ficha índigo, si no hay paso. */
  icon?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  /** Sin relleno en el cuerpo (tablas que llegan al borde). */
  flush?: boolean;
}

/** Bloque de una pantalla larga: título, contexto y acciones arriba; contenido debajo. */
export const SectionCard = ({
  step,
  icon,
  title,
  description,
  actions,
  children,
  flush,
}: SectionCardProps) => (
  <section className="overflow-hidden rounded-[20px] border border-gray-200 bg-white">
    <header className="flex flex-wrap items-center gap-4 border-b border-gray-200 px-5 py-6 sm:px-8">
      {step !== undefined ? (
        <span
          className={cx(
            "flex size-10 shrink-0 items-center justify-center rounded-xl text-base font-extrabold",
            step === 1 ? "bg-rymel-blue text-rymel-yellow" : "bg-rymel-soft text-rymel-indigo",
          )}
        >
          {step}
        </span>
      ) : (
        icon && (
          <span
            aria-hidden="true"
            className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-rymel-blue text-rymel-yellow"
          >
            {icon}
          </span>
        )
      )}
      <div className="flex min-w-0 flex-[1_1_320px] flex-col gap-0.5">
        <h2 className="m-0 text-xl font-extrabold tracking-[-0.01em] text-gray-900">{title}</h2>
        {description && <p className="m-0 text-sm text-gray-600">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2.5">{actions}</div>}
    </header>
    <div className={flush ? undefined : "px-5 pb-8 pt-7 sm:px-8"}>{children}</div>
  </section>
);

/** Cifra destacada: `dark` en índigo con número amarillo, `soft` en lavanda. */
export const StatTile = ({
  value,
  label,
  tone = "dark",
}: {
  value: ReactNode;
  label: ReactNode;
  tone?: "dark" | "soft" | "plain";
}) => (
  <div
    className={cx(
      "flex flex-col gap-1 rounded-2xl p-5",
      tone === "dark" && "bg-rymel-blue",
      tone === "soft" && "bg-rymel-soft",
      tone === "plain" && "bg-surface",
    )}
  >
    <span
      className={cx(
        "text-[40px] font-extrabold leading-none tabular-nums",
        tone === "dark" ? "text-rymel-yellow" : "text-rymel-blue",
      )}
    >
      {value}
    </span>
    <span
      className={cx(
        "text-sm font-semibold",
        tone === "dark" ? "text-white/85" : "text-gray-700",
      )}
    >
      {label}
    </span>
  </div>
);
