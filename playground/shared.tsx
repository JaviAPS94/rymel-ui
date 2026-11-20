import { useState, type ReactNode } from "react";
import { IconCheck, cx } from "../src";

/* Datos de ejemplo (del canvas de diseño del cliente) ---------------- */

export const designs = [
  { code: "1DAA2612-CO CV", subd: 1, date: "28 ago 2026" },
  { code: "1DAA26A54-CO CV", subd: 1, date: "28 ago 2026" },
  { code: "1DAA2646-CO CV", subd: 2, date: "10 feb 2026" },
  { code: "DESIGN_1769136541805", subd: 1, date: "23 ene 2026" },
  { code: "DESIGN_1760386068420", subd: 1, date: "13 oct 2025" },
];

export const countries = [
  { label: "Colombia", value: 1 },
  { label: "Ecuador", value: 2 },
];

export const subtypes = [
  "Convencional",
  "Convencional Frente Muerto",
  "Convencional con TC",
  "Pedestal Malla",
].map((label) => ({ label, value: label }));

/* Iconos y bandera de ejemplo ----------------------------------------- */

/** Bandera de Colombia en franjas, como en el canvas. */
export const FlagCO = () => (
  <span aria-hidden="true" className="flex h-[15px] w-[22px] shrink-0 flex-col overflow-hidden rounded-[3px]">
    <span className="flex-[2] bg-[#FCD116]" />
    <span className="flex-1 bg-[#003893]" />
    <span className="flex-1 bg-[#CE1126]" />
  </span>
);

export const FileIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
    <path d="M14 3v6h6M8 13h8M8 17h5" />
  </svg>
);

export const ListIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <path d="M4 6h16M4 12h16M4 18h10" />
  </svg>
);

/* Piezas de la galería ------------------------------------------------ */

/** Un ejemplo con su título: fondo blanco, o índigo con `dark`. */
export const Demo = ({
  label,
  children,
  dark,
  stack,
}: {
  label: string;
  children: ReactNode;
  dark?: boolean;
  /** Apila el contenido en columna en vez de en fila. */
  stack?: boolean;
}) => (
  <section className="flex flex-col gap-3">
    <h3 className="m-0 text-xs font-bold uppercase tracking-[0.08em] text-gray-600">{label}</h3>
    <div
      className={cx(
        "rounded-2xl border p-4 sm:p-6",
        dark ? "rm-dots border-transparent bg-rymel-blue" : "border-gray-200 bg-white",
        stack ? "flex flex-col gap-4" : "flex flex-wrap items-center gap-3",
      )}
    >
      {children}
    </div>
  </section>
);

/** Bloque de código con botón de copiar. */
export const Code = ({ children }: { children: string }) => {
  const [copied, setCopied] = useState(false);
  return (
    <div className="overflow-hidden rounded-2xl bg-rymel-blue">
      {/* El botón va en su propia barra: así no tapa el código al desplazarlo. */}
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
        <span className="font-mono text-xs text-white/60">tsx</span>
        <button
          type="button"
          onClick={() => {
            void navigator.clipboard?.writeText(children).then(() => {
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            });
          }}
          className="flex h-8 cursor-pointer items-center gap-1.5 rounded-[10px] border border-white/25 bg-transparent px-3 text-xs font-semibold text-white hover:bg-white/10"
        >
          {copied && <IconCheck size={14} />}
          {copied ? "Copiado" : "Copiar"}
        </button>
      </div>
      <pre className="m-0 overflow-x-auto p-5 font-mono text-[13px] leading-relaxed text-white/90">
        <code>{children}</code>
      </pre>
    </div>
  );
};

export const Swatch = ({ name, value }: { name: string; value: string }) => (
  <div className="flex w-[132px] flex-col gap-2">
    <span className="h-16 rounded-xl border border-gray-200" style={{ background: value }} />
    <span className="flex flex-col">
      <code className="font-mono text-[12.5px] font-bold text-gray-900">{name}</code>
      <code className="font-mono text-xs text-gray-600">{value}</code>
    </span>
  </div>
);
