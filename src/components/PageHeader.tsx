import type { ReactNode } from "react";
import { cx } from "../cx.js";
import { IconArrowLeft } from "../icons.js";
import { useLinkComponent } from "../link.js";

export interface PageHeaderProps {
  /** Icono en ficha amarilla junto al título (pantallas de detalle). */
  icon?: ReactNode;
  /** Línea corta en amarillo sobre el título: «Biblioteca de diseños», «Paso 1 · Elementos». */
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  /** Etiquetas bajo el título; usa `HeaderChip`. */
  meta?: ReactNode;
  /** Botones a la derecha, en variantes claras (`light`, `outlineLight`, `dangerLight`). */
  actions?: ReactNode;
  /** Enlace de vuelta sobre el título: con `href` navega, con `onClick` ejecuta. */
  back?: { label: string; href?: string; onClick?: () => void };
}

/** Ficha del icono de pantalla: amarilla sobre la banda índigo. */
export const PageIcon = ({ children, size = "lg" }: { children: ReactNode; size?: "md" | "lg" }) => (
  <span
    aria-hidden="true"
    className={cx(
      "flex shrink-0 items-center justify-center bg-rymel-yellow text-rymel-blue [&_svg]:size-1/2",
      size === "lg" ? "size-[72px] rounded-[20px]" : "size-11 rounded-xl",
    )}
  >
    {children}
  </span>
);

/** Etiqueta clara de la fila `meta`: código (mono) o categoría. */
export const HeaderChip = ({ children, mono }: { children: ReactNode; mono?: boolean }) =>
  mono ? (
    <span className="rounded-lg bg-white/10 px-2.5 py-1 font-mono text-sm text-white">
      {children}
    </span>
  ) : (
    <span className="rounded-full border border-white/25 px-2.5 py-[5px] text-[13px] font-semibold text-white">
      {children}
    </span>
  );

const backClass =
  "-ml-2 flex h-9 cursor-pointer items-center gap-2 self-start rounded-[10px] border-0 bg-transparent pl-2 pr-3 text-sm font-semibold text-white/85 no-underline transition-colors hover:bg-white/10 hover:text-white";

/**
 * Cabecera de pantalla: continúa la banda índigo de la barra de navegación.
 * El contenido va después dentro de `<Page>`: su primer bloque sube y flota
 * sobre la banda.
 */
export const PageHeader = ({
  icon,
  eyebrow,
  title,
  description,
  meta,
  actions,
  back,
}: PageHeaderProps) => {
  const Link = useLinkComponent();
  const compact = Boolean(icon || back);

  return (
    <div className="relative overflow-hidden bg-rymel-blue">
      <div
        aria-hidden="true"
        className="rm-dots absolute inset-y-0 right-0 w-[46%]"
        // Continúa la trama de la barra (75 px de alto) sin salto.
        style={{ backgroundPosition: "0 -75px" }}
      />
      <section
        className={cx(
          "relative mx-auto flex max-w-[1280px] flex-col gap-4 px-4 pb-28 sm:px-8",
          back ? "pt-7" : "pt-10",
        )}
      >
        {back &&
          (back.href ? (
            <Link href={back.href} className={backClass}>
              <IconArrowLeft size={16} />
              {back.label}
            </Link>
          ) : (
            <button type="button" onClick={back.onClick} className={backClass}>
              <IconArrowLeft size={16} />
              {back.label}
            </button>
          ))}
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="flex min-w-0 items-center gap-5">
            {icon && <PageIcon>{icon}</PageIcon>}
            <div className="flex min-w-0 flex-col gap-3">
              {eyebrow && (
                <span className="flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.08em] text-rymel-yellow">
                  <span aria-hidden="true" className="h-0.5 w-[18px] bg-rymel-yellow" />
                  {eyebrow}
                </span>
              )}
              <h1
                className={cx(
                  "m-0 font-extrabold leading-[1.05] tracking-[-0.03em] text-white",
                  compact ? "text-3xl sm:text-[40px]" : "text-4xl sm:text-5xl",
                )}
              >
                {title}
              </h1>
              {description && (
                <p className="m-0 text-[17px] text-white/80 [&_strong]:font-bold [&_strong]:text-white">
                  {description}
                </p>
              )}
              {meta && <div className="flex flex-wrap items-center gap-2">{meta}</div>}
            </div>
          </div>
          {actions && <div className="flex flex-wrap items-center gap-2.5">{actions}</div>}
        </div>
      </section>
    </div>
  );
};

/** Cuerpo de pantalla bajo `PageHeader`. `width` estrecha el contenido (formularios). */
export const Page = ({
  children,
  width,
  className,
}: {
  children: ReactNode;
  width?: number;
  className?: string;
}) => (
  <main className={cx("rm-page", className)} style={width ? { maxWidth: width } : undefined}>
    {children}
  </main>
);
