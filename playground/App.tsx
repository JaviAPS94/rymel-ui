import { useEffect, useMemo, useState } from "react";
import { Toaster } from "sonner";
import {
  IconArrowLeft,
  IconArrowRight,
  IconMenu,
  IconSearch,
  IconX,
  Input,
  cx,
  toastOptions,
} from "../src";
import pkg from "../package.json";
import { CATEGORIES, demoParam, PAGES, type GalleryPage } from "./pages";
import { Code } from "./shared";

/* Ruta: #/botones. Sin ruta, la portada; ?demo= abre la página de su demo. */

const HOME = "inicio";

const routeFromHash = () => {
  const id = window.location.hash.replace(/^#\/?/, "");
  if (PAGES.some((page) => page.id === id)) return id;
  if (demoParam === "largo" || demoParam === "apilados") return "modal";
  if (demoParam === "avisos") return "toasts";
  return HOME;
};

const useRoute = () => {
  const [route, setRoute] = useState(routeFromHash);
  useEffect(() => {
    const onHash = () => setRoute(routeFromHash());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  // Cada página empieza arriba. (Con llaves: en Chrome, scrollTo devuelve una
  // promesa, y React tomaría lo devuelto por la función de limpieza.)
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [route]);
  return route;
};

const hrefOf = (id: string) => (id === HOME ? "#/" : `#/${id}`);

/* Menú lateral -------------------------------------------------------- */

/** Icono de cada categoría: la cabecera del grupo se distingue de sus páginas. */
const CATEGORY_ICONS: Record<string, string> = {
  Fundamentos: "M12 3a9 9 0 1 0 0 18c1 0 1.5-.8 1.5-1.6 0-.5-.3-.9-.6-1.2-.3-.4-.5-.8-.5-1.2 0-.9.7-1.6 1.6-1.6H16a5 5 0 0 0 5-5c0-4-4-7.4-9-7.4zM7.5 12.5h.01M10 8h.01M15 8h.01",
  Acciones: "M9 9l10.5 4.5-4.5 1.5-1.5 4.5zM5 3v4M3 5h4M14 3l-1 2M3 14l2-1",
  Formularios: "M4 7h16v10H4zM8 12h.01M12 12h4",
  Datos: "M4 5h16v14H4zM4 10h16M10 10v9",
  Navegación: "M4 6h16M4 12h10M4 18h16",
  Avisos: "M6 16V11a6 6 0 1 1 12 0v5l2 2H4zM10 21h4",
  Superposiciones: "M12 3l9 5-9 5-9-5zM3 13l9 5 9-5",
};

const CategoryIcon = ({ category }: { category: string }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d={CATEGORY_ICONS[category] ?? "M4 12h16"} />
  </svg>
);

const Sidebar = ({ route, onNavigate }: { route: string; onNavigate?: () => void }) => {
  const [query, setQuery] = useState("");
  const term = query.trim().toLowerCase();
  const matches = (page: GalleryPage) =>
    !term ||
    [page.title, page.category, ...(page.imports ?? [])].some((text) => text.toLowerCase().includes(term));

  const linkClass = (active: boolean) =>
    cx(
      "relative flex h-9 items-center rounded-[10px] px-3 text-sm no-underline transition-colors",
      active ? "bg-rymel-tint font-bold text-rymel-blue" : "font-normal text-gray-600 hover:bg-gray-50 hover:text-gray-900",
    );

  return (
    <nav aria-label="Componentes" className="flex flex-col gap-5 p-4">
      <Input
        type="search"
        aria-label="Buscar componente"
        placeholder="Buscar componente…"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        onClear={() => setQuery("")}
        leftIcon={<IconSearch size={16} />}
      />

      {!term && (
        <a href={hrefOf(HOME)} onClick={onNavigate} aria-current={route === HOME ? "page" : undefined} className={linkClass(route === HOME)}>
          Introducción
        </a>
      )}

      {CATEGORIES.map((category) => {
        const pages = PAGES.filter((page) => page.category === category && matches(page));
        if (pages.length === 0) return null;
        return (
          <section key={category} aria-label={category} className="flex flex-col gap-1.5 border-t border-gray-200 pt-4 first-of-type:border-t-0 first-of-type:pt-0">
            {/* Cabecera del grupo: índigo, con icono y contador; las páginas van
                debajo, con sangría y una línea que las une a su categoría. */}
            <h2 className="m-0 flex items-center gap-2.5 px-1 text-[13px] font-extrabold uppercase tracking-[0.06em] text-rymel-blue">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-rymel-blue text-rymel-yellow">
                <CategoryIcon category={category} />
              </span>
              {category}
              <span className="ml-auto rounded-full bg-gray-100 px-2 py-px text-[11px] font-bold tracking-normal text-gray-600">
                {pages.length}
              </span>
            </h2>
            <div className="ml-[18px] flex flex-col gap-0.5 border-l border-gray-200 pl-2.5">
            {pages.map((page) => {
              const active = page.id === route;
              return (
                <a
                  key={page.id}
                  href={hrefOf(page.id)}
                  onClick={onNavigate}
                  aria-current={active ? "page" : undefined}
                  className={linkClass(active)}
                >
                  {active && (
                    <span aria-hidden="true" className="absolute -left-[12px] h-6 w-[3px] rounded-full bg-rymel-blue" />
                  )}
                  {page.title}
                </a>
              );
            })}
            </div>
          </section>
        );
      })}

      {term && !PAGES.some(matches) && <p className="m-0 px-3 text-sm text-gray-600">Ningún componente coincide.</p>}
    </nav>
  );
};

/* Páginas ------------------------------------------------------------- */

const Home = () => (
  <div className="flex flex-col gap-8">
    <header className="flex flex-col gap-3">
      <span className="flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.08em] text-rymel-indigo">
        <span aria-hidden="true" className="h-0.5 w-[18px] bg-rymel-yellow" />
        Rymel UI · v{pkg.version}
      </span>
      <h1 className="m-0 text-4xl font-extrabold leading-[1.05] tracking-[-0.03em] text-gray-900 sm:text-5xl">Sistema de diseño</h1>
      <p className="m-0 max-w-2xl text-[17px] text-gray-600">
        Tokens y componentes compartidos por el cliente (Tailwind v3) y el admin (Tailwind v4). Elige un componente en el menú para
        ver sus variantes y cómo se usa.
      </p>
    </header>

    <section className="flex flex-col gap-3">
      <h2 className="m-0 text-lg font-extrabold">Instalación</h2>
      <Code>{`"@rymel/ui": "github:JaviAPS94/rymel-ui#v${pkg.version}"`}</Code>
      <p className="m-0 text-sm text-gray-600">
        Tailwind v3: <code className="font-mono">presets: [rymel]</code> desde <code className="font-mono">@rymel/ui/preset</code>.
        Tailwind v4: <code className="font-mono">@import "@rymel/ui/theme.css"</code>. Los detalles, en el README.
      </p>
    </section>

    <section className="flex flex-col gap-3">
      <h2 className="m-0 text-lg font-extrabold">Componentes</h2>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {CATEGORIES.map((category) => {
          const pages = PAGES.filter((page) => page.category === category);
          return (
            <div key={category} className="flex flex-col gap-2 rounded-2xl border border-gray-200 bg-white p-5">
              <span className="flex items-center justify-between">
                <span className="font-extrabold text-gray-900">{category}</span>
                <span className="rounded-full bg-gray-100 px-2 py-px text-xs font-bold text-gray-700">{pages.length}</span>
              </span>
              <span className="flex flex-wrap gap-x-3 gap-y-1">
                {pages.map((page) => (
                  <a key={page.id} href={hrefOf(page.id)} className="text-sm font-semibold text-rymel-indigo no-underline hover:underline">
                    {page.title}
                  </a>
                ))}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  </div>
);

const ComponentPage = ({ page }: { page: GalleryPage }) => {
  const index = PAGES.indexOf(page);
  const prev = PAGES[index - 1];
  const next = PAGES[index + 1];
  const Body = page.Body;

  return (
    <article className="flex flex-col gap-8">
      <header className="flex flex-col gap-3">
        <span className="flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.08em] text-rymel-indigo">
          <span aria-hidden="true" className="h-0.5 w-[18px] bg-rymel-yellow" />
          {page.category}
        </span>
        <h1 className="m-0 text-4xl font-extrabold leading-[1.05] tracking-[-0.03em] text-gray-900">{page.title}</h1>
        <p className="m-0 max-w-3xl text-[16px] leading-relaxed text-gray-600">{page.description}</p>
      </header>

      {(page.imports || page.usage) && (
        <section className="flex flex-col gap-3">
          <h2 className="m-0 text-xs font-bold uppercase tracking-[0.08em] text-gray-600">Uso</h2>
          <Code>
            {[page.imports && `import { ${page.imports.join(", ")} } from "@rymel/ui";`, page.usage]
              .filter(Boolean)
              .join("\n\n")}
          </Code>
        </section>
      )}

      <Body />

      <nav aria-label="Otras páginas" className="mt-4 grid gap-3 border-t border-gray-200 pt-6 sm:grid-cols-2">
        {prev ? (
          <a href={hrefOf(prev.id)} className="flex flex-col gap-1 rounded-2xl border border-gray-200 bg-white p-4 no-underline hover:shadow-float">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-600">
              <IconArrowLeft size={14} /> Anterior
            </span>
            <span className="font-bold text-gray-900">{prev.title}</span>
          </a>
        ) : (
          <span />
        )}
        {next && (
          <a
            href={hrefOf(next.id)}
            className="flex flex-col items-end gap-1 rounded-2xl border border-gray-200 bg-white p-4 text-right no-underline hover:shadow-float"
          >
            <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-600">
              Siguiente <IconArrowRight size={14} />
            </span>
            <span className="font-bold text-gray-900">{next.title}</span>
          </a>
        )}
      </nav>
    </article>
  );
};

/* Marco --------------------------------------------------------------- */

export default function App() {
  const route = useRoute();
  const [menuOpen, setMenuOpen] = useState(false);
  const page = useMemo(() => PAGES.find((item) => item.id === route), [route]);

  useEffect(() => {
    document.title = page ? `${page.title} · Rymel UI` : "Rymel UI";
  }, [page]);

  return (
    <div className="min-h-screen bg-surface">
      <header className="sticky top-0 z-40 bg-rymel-blue">
        <div className="h-[3px] bg-rymel-yellow" />
        <div aria-hidden="true" className="rm-dots pointer-events-none absolute inset-y-0 right-0 w-[46%]" />
        <div className="relative flex h-16 items-center gap-3 px-4 sm:px-6">
          <button
            type="button"
            aria-label="Abrir menú de componentes"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(true)}
            className="flex size-10 cursor-pointer items-center justify-center rounded-xl border-0 bg-white/10 text-white lg:hidden"
          >
            <IconMenu size={20} />
          </button>
          <a href={hrefOf(HOME)} className="flex items-center gap-2.5 text-white no-underline">
            <span
              aria-hidden="true"
              className="flex size-[34px] items-center justify-center rounded-[10px] bg-rymel-yellow text-lg font-extrabold text-rymel-blue"
            >
              R
            </span>
            <span className="text-lg font-bold tracking-[-0.01em]">Rymel UI</span>
          </a>
          <span className="rounded-full border border-white/25 px-2.5 py-0.5 font-mono text-xs text-white/85">v{pkg.version}</span>
          <span className="ml-auto hidden text-sm text-white/70 sm:block">{PAGES.length} componentes y fundamentos</span>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1440px]">
        <aside className="sticky top-[67px] hidden h-[calc(100vh-67px)] w-72 shrink-0 overflow-y-auto border-r border-gray-200 bg-white lg:block">
          <Sidebar route={route} />
        </aside>

        <main className="min-w-0 flex-1 px-4 pb-16 pt-8 sm:px-10">
          <div className="mx-auto max-w-[1040px]">{page ? <ComponentPage key={page.id} page={page} /> : <Home />}</div>
        </main>
      </div>

      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Cerrar menú"
            onClick={() => setMenuOpen(false)}
            className="absolute inset-0 cursor-default border-0 bg-[#0E0C2E]/60"
          />
          <aside className="absolute inset-y-0 left-0 flex w-80 max-w-[85vw] flex-col overflow-y-auto bg-white shadow-modal">
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-gray-200 px-4">
              <span className="font-extrabold text-gray-900">Componentes</span>
              <button
                type="button"
                aria-label="Cerrar menú"
                onClick={() => setMenuOpen(false)}
                className="flex size-10 cursor-pointer items-center justify-center rounded-xl border-0 bg-gray-100 text-gray-900"
              >
                <IconX size={18} />
              </button>
            </div>
            <Sidebar route={route} onNavigate={() => setMenuOpen(false)} />
          </aside>
        </div>
      )}

      <Toaster position="top-right" toastOptions={toastOptions} />
    </div>
  );
}
