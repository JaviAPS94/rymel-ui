import { useEffect, useState, type ReactNode } from "react";
import { toast } from "sonner";
import {
  Badge,
  Button,
  Card,
  Checkbox,
  EmptyState,
  Field,
  FilterField,
  HeaderChip,
  IconArrowRight,
  IconButton,
  IconLock,
  IconPlus,
  IconSearch,
  IconX,
  Input,
  Modal,
  Navbar,
  Notice,
  Page,
  PageHeader,
  Pagination,
  SectionCard,
  Select,
  SelectionBar,
  StatTile,
  Tabs,
  TableCard,
  Tag,
  TitleCell,
  tokens,
} from "../src";
import { countries, Demo, designs, FileIcon, FlagCO, ListIcon, subtypes, Swatch } from "./shared";

/**
 * Registro de la galería: cada entrada es una página del menú lateral.
 * Para sumar un componente basta con añadir su entrada aquí.
 */
export interface GalleryPage {
  id: string;
  title: string;
  category: string;
  description: string;
  /** Lo que se importa de @rymel/ui (para la línea de import). */
  imports?: string[];
  /** Ejemplo mínimo de uso. */
  usage?: string;
  Body: () => ReactNode;
}

/** ?demo=largo | apilados | avisos abre esa demo al cargar (capturas, revisión). */
export const demoParam = new URLSearchParams(window.location.search).get("demo");

/* Fundamentos --------------------------------------------------------- */

const ColorsPage = () => {
  const brand = Object.entries(tokens.colors).filter(
    ([name, value]) => typeof value === "string" && (name.startsWith("rymel") || name === "surface"),
  ) as [string, string][];
  const states = Object.entries(tokens.colors).filter(([name]) => /^(success|warning|danger)/.test(name)) as [
    string,
    string,
  ][];
  return (
    <>
      <Demo label="Marca">
        {brand.map(([name, value]) => (
          <Swatch key={name} name={name} value={value} />
        ))}
      </Demo>
      <Demo label="Estados">
        {states.map(([name, value]) => (
          <Swatch key={name} name={name} value={value} />
        ))}
      </Demo>
      <Demo label="Grises (con un punto de índigo)">
        {Object.entries(tokens.colors.gray).map(([step, value]) => (
          <Swatch key={step} name={`gray-${step}`} value={value} />
        ))}
      </Demo>
    </>
  );
};

const TypographyPage = () => (
  <Demo label="Escala" stack>
    <span className="text-5xl font-extrabold leading-[1.05] tracking-[-0.03em]">Título 48 · extrabold</span>
    <span className="text-[40px] font-extrabold leading-[1.05] tracking-[-0.03em]">Detalle 40 · extrabold</span>
    <span className="text-xl font-extrabold">Sección 20 · extrabold</span>
    <span className="text-[15px]">Texto 15 · Plus Jakarta Sans regular</span>
    <span className="text-[13px] text-gray-600">Ayuda 13 · gray-600</span>
    <span className="text-xs font-bold uppercase tracking-[0.08em] text-gray-600">Etiqueta 12 · mayúsculas</span>
    <span className="font-mono text-[15px]">1DAA2612-CO CV · JetBrains Mono</span>
  </Demo>
);

const ShadowsPage = () => (
  <Demo label="Sombras">
    {/* Clases escritas enteras: Tailwind no ve las que se arman en tiempo de ejecución. */}
    {["shadow-float", "shadow-menu", "shadow-bar", "shadow-modal"].map((name) => (
      <div key={name} className={`flex h-24 w-44 items-center justify-center rounded-2xl bg-white font-mono text-sm ${name}`}>
        {name}
      </div>
    ))}
  </Demo>
);

/* Acciones ------------------------------------------------------------ */

const ButtonsPage = () => (
  <>
    <Demo label="Variantes">
      <Button>Primario</Button>
      <Button variant="accent">Guardar</Button>
      <Button variant="secondary">Secundario</Button>
      <Button variant="ghost">Fantasma</Button>
      <Button variant="danger">Eliminar</Button>
      <Button variant="secondary" active>
        Activo
      </Button>
    </Demo>
    <Demo label="Sobre la banda índigo" dark>
      <Button variant="light" icon={<IconPlus size={16} />}>
        Agregar elementos
      </Button>
      <Button variant="outlineLight" icon={<IconSearch size={16} />}>
        Buscar diseños existentes
      </Button>
      <Button variant="ghostLight">Limpiar selección</Button>
      <Button variant="dangerLight">Eliminar</Button>
      <Button variant="accent">Guardar</Button>
    </Demo>
    <Demo label="Tamaños y estados">
      <Button size="sm">Pequeño</Button>
      <Button size="md">Mediano</Button>
      <Button size="lg">Grande</Button>
      <Button loading>Guardando</Button>
      <Button disabled>Deshabilitado</Button>
      <Button variant="secondary" icon={<IconSearch size={16} />}>
        Con icono
      </Button>
    </Demo>
  </>
);

const IconButtonsPage = () => (
  <Demo label="Tonos y tamaños">
    <IconButton label="Editar">
      <FileIcon />
    </IconButton>
    <IconButton label="Quitar" tone="danger">
      <IconX size={16} />
    </IconButton>
    <IconButton label="Buscar" size="lg">
      <IconSearch size={18} />
    </IconButton>
    <IconButton label="Deshabilitado" disabled>
      <IconLock size={16} />
    </IconButton>
  </Demo>
);

/* Formularios --------------------------------------------------------- */

const FieldsPage = () => {
  const [code, setCode] = useState("1DAA");
  return (
    <>
      <Demo label="Campo con etiqueta, ayuda y error" stack>
        <div className="grid gap-5 md:grid-cols-3">
          <Field label="Versión" hint="Formato libre, p. ej. 1.0.0">
            <Input mono placeholder="Ej. 1.0.0" />
          </Field>
          <Field label="Código de diseño">
            <Input value={code} onChange={(e) => setCode(e.target.value)} onClear={() => setCode("")} />
          </Field>
          <Field label="Correo" error="El correo no es válido.">
            <Input invalid defaultValue="admin@" />
          </Field>
        </div>
      </Demo>
      <Demo label="Tamaños e iconos" stack>
        <div className="grid gap-5 md:grid-cols-2">
          <Input leftIcon={<IconSearch size={18} />} placeholder="Buscar por nombre…" />
          <Input size="lg" leftIcon={<IconSearch size={18} />} placeholder="Grande (50 px)" />
          <Input disabled placeholder="Deshabilitado" />
        </div>
      </Demo>
    </>
  );
};

const SelectPage = () => {
  const [country, setCountry] = useState<number | undefined>(1);
  const [subtype, setSubtype] = useState<string | undefined>();
  return (
    <Demo label="Con búsqueda y teclado (↑ ↓ Intro Esc)" stack>
      <div className="grid gap-5 md:grid-cols-3">
        <Field label="País">
          <Select
            options={countries.map((c) => ({ ...c, prefix: <FlagCO /> }))}
            value={country}
            onChange={setCountry}
            placeholder="Selecciona un país"
          />
        </Field>
        <Field label="Subtipo">
          <Select options={subtypes} value={subtype} onChange={setSubtype} placeholder="Todos" />
        </Field>
        <Field label="Norma" error="Selecciona una norma.">
          <Select options={[]} value={undefined} onChange={() => {}} invalid placeholder="Selecciona una norma" />
        </Field>
      </div>
    </Demo>
  );
};

const CheckboxPage = () => (
  <Demo label="Casillas">
    <Checkbox label="Elemento seleccionado" defaultChecked />
    <Checkbox label="Sin marcar" />
    <Checkbox label="Bloqueado" checked disabled readOnly />
  </Demo>
);

const FiltersPage = () => {
  const [country, setCountry] = useState<number | undefined>(1);
  const [subtype, setSubtype] = useState<string | undefined>();
  const [code, setCode] = useState("");
  return (
    <Demo label="Barra de filtros sobre una tarjeta" stack>
      <Card as="form" elevated className="flex w-full flex-wrap items-end gap-3" onSubmit={(e) => e.preventDefault()}>
        <FilterField label="País">
          <Select options={countries} value={country} onChange={setCountry} />
        </FilterField>
        <FilterField label="Código de diseño">
          <Input value={code} onChange={(e) => setCode(e.target.value)} onClear={() => setCode("")} placeholder="Ej. 1DAA2612" />
        </FilterField>
        <FilterField label="Subtipo">
          <Select options={subtypes} value={subtype} onChange={setSubtype} placeholder="Todos" />
        </FilterField>
        <Button type="submit" className="h-[46px]" icon={<IconSearch size={17} />}>
          Buscar
        </Button>
      </Card>
    </Demo>
  );
};

/* Datos --------------------------------------------------------------- */

const TagsPage = () => (
  <>
    <Demo label="Badge">
      <Badge>Neutral</Badge>
      <Badge tone="brand">Convencional</Badge>
      <Badge tone="brand" count="×2">
        Convencional con TC
      </Badge>
      <Badge dot>Convencionales</Badge>
      <Badge tone="success">Adjunto</Badge>
      <Badge tone="warning">Sin elementos</Badge>
      <Badge tone="danger">Duplicado</Badge>
      <Badge icon={<IconLock size={12} />}>Bloqueado</Badge>
    </Demo>
    <Demo label="Tag">
      <Tag>1F</Tag>
      <Tag mono>1.0.0</Tag>
    </Demo>
  </>
);

const CardsPage = () => (
  <>
    <Demo label="SectionCard por pasos" stack>
      <SectionCard step={1} title="Datos generales" description="Identifican la norma. Complétalos antes de cargar elementos.">
        <div className="grid gap-5 md:grid-cols-3">
          <Field label="Norma">
            <Select options={[]} value={undefined} onChange={() => {}} placeholder="Selecciona una norma" />
          </Field>
          <Field label="Versión">
            <Input mono placeholder="Ej. 1.0.0" />
          </Field>
          <Field label="País">
            <Select options={countries} value={undefined} onChange={() => {}} placeholder="Selecciona un país" />
          </Field>
        </div>
      </SectionCard>
      <SectionCard
        step={2}
        title="Elementos (0)"
        description="Cada elemento es un producto de la norma con sus valores y su referencia ERP."
        actions={
          <>
            <Button variant="secondary">Cargar desde existente</Button>
            <Button icon={<IconPlus size={16} />}>Agregar elemento</Button>
          </>
        }
      >
        <EmptyState
          bare
          title="Todavía no hay elementos"
          description="Completa los datos generales y pulsa «Agregar elemento»."
        />
      </SectionCard>
    </Demo>
    <Demo label="StatTile">
      <div className="grid w-full max-w-md grid-cols-3 gap-3">
        <StatTile value={1} label="Elementos" />
        <StatTile value={1} label="Sub-diseños" tone="soft" />
        <StatTile value={37} label="Normas" tone="plain" />
      </div>
    </Demo>
  </>
);

const TablePage = () => {
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Record<string, boolean>>({ [designs[0].code]: true });
  return (
    <Demo label="TableCard + rm-table" stack>
      <TableCard aria-label="Diseños" footer={<Pagination page={page} totalPages={3} onPageChange={setPage} totalItems={20} pageSize={7} />}>
        <table className="rm-table">
          <thead>
            <tr>
              <th className="w-14">
                <span className="sr-only">Seleccionar</span>
              </th>
              <th>Diseño</th>
              <th>Tipo</th>
              <th>Subtipo</th>
              <th>Norma</th>
              <th data-align="right">Sub-diseños</th>
              <th>Actualizado</th>
              <th>
                <span className="sr-only">Acciones</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {designs.map((d) => (
              <tr
                key={d.code}
                aria-selected={!!selected[d.code]}
                className="cursor-pointer"
                onClick={() => setSelected((s) => ({ ...s, [d.code]: !s[d.code] }))}
              >
                <td>
                  <Checkbox
                    checked={!!selected[d.code]}
                    onClick={(e) => e.stopPropagation()}
                    onCheckedChange={(on) => setSelected((s) => ({ ...s, [d.code]: on }))}
                    aria-label={`Seleccionar ${d.code}`}
                  />
                </td>
                <td>
                  <TitleCell icon={<FileIcon />} title="Nuevo diseño" code={d.code} />
                </td>
                <td>
                  <Badge dot>Convencionales</Badge>
                </td>
                <td>
                  <Tag>1F</Tag>
                </td>
                <td>
                  <span className="flex items-center gap-2.5 font-semibold">
                    <FlagCO />
                    NTCA
                  </span>
                </td>
                <td data-align="right" className="font-semibold tabular-nums">
                  {d.subd}
                </td>
                <td className="whitespace-nowrap text-gray-600">{d.date}</td>
                <td data-align="right">
                  <Button variant="secondary" size="sm" onClick={(e) => e.stopPropagation()}>
                    Ver <IconArrowRight size={14} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableCard>
    </Demo>
  );
};

const PaginationPage = () => {
  const [page, setPage] = useState(4);
  const [short, setShort] = useState(1);
  return (
    <>
      <Demo label="Con resumen «Mostrando…»" stack>
        <Pagination page={page} totalPages={12} onPageChange={setPage} totalItems={234} pageSize={20} />
      </Demo>
      <Demo label="Solo páginas" stack>
        <Pagination page={short} totalPages={3} onPageChange={setShort} />
      </Demo>
    </>
  );
};

/* Navegación ---------------------------------------------------------- */

const NavbarPage = () => (
  <Demo label="Con menús, Crear y cuenta (en pantallas estrechas pasa a menú completo)" stack>
    <div className="-m-4 sm:-m-6 rounded-2xl">
      <Navbar
        sections={[
          { label: "Normas", icon: <ListIcon />, href: "#/navbar" },
          {
            label: "Diseño",
            icon: <FileIcon />,
            active: true,
            items: [
              { label: "Todos los diseños", description: "Busca y filtra la biblioteca", href: "#/navbar", icon: <ListIcon />, active: true },
              { label: "Nuevo diseño", description: "Empieza un diseño desde cero", href: "#/navbar", icon: <IconPlus size={18} /> },
            ],
          },
        ]}
        createActions={[
          { label: "Nuevo diseño", description: "Con elementos y sub-diseños", href: "#/navbar", icon: <FileIcon /> },
          { label: "Nueva norma", description: "Registrar una norma técnica", href: "#/navbar", icon: <ListIcon /> },
        ]}
        user={{ name: "admin", email: "admin@rymel.com", roles: ["ADMIN"] }}
        onLogout={() => toast("Cerrar sesión")}
      />
      {/* Espacio para que los menús desplegados se vean dentro del ejemplo. */}
      <div className="h-64 rounded-b-2xl bg-surface" />
    </div>
  </Demo>
);

const HeaderPage = () => (
  <>
    <Demo label="Listado: eyebrow, descripción y acción principal; el primer bloque flota" stack>
      <div className="-m-4 sm:-m-6 overflow-hidden rounded-2xl bg-surface">
        <PageHeader
          eyebrow="Biblioteca de diseños"
          title="Diseños"
          description={
            <>
              <strong>20 diseños</strong> coinciden con tus filtros.
            </>
          }
          actions={
            <Button variant="light" size="lg" icon={<IconPlus size={16} />}>
              Nuevo diseño
            </Button>
          }
        />
        <Page className="pb-8">
          <Card>
            <p className="m-0 text-sm text-gray-600">Primer bloque de la página: sube 72 px y flota sobre la banda.</p>
          </Card>
        </Page>
      </div>
    </Demo>
    <Demo label="Detalle: volver, icono, etiquetas y acciones claras" stack>
      <div className="-m-4 sm:-m-6 overflow-hidden rounded-2xl bg-surface">
        <PageHeader
          icon={<FileIcon />}
          back={{ label: "Volver al catálogo", onClick: () => {} }}
          title="Nuevo diseño"
          meta={
            <>
              <HeaderChip mono>1DAA2612-CO CV</HeaderChip>
              <HeaderChip>Convencionales</HeaderChip>
              <HeaderChip>Subtipo 1F</HeaderChip>
            </>
          }
          actions={
            <>
              <Button variant="dangerLight" size="lg">
                Eliminar
              </Button>
              <Button variant="light" size="lg">
                Ver cálculos
              </Button>
            </>
          }
        />
        <Page className="pb-8">
          <Card>
            <p className="m-0 text-sm text-gray-600">Contenido del detalle.</p>
          </Card>
        </Page>
      </div>
    </Demo>
  </>
);

const TabsPage = () => (
  <>
    <Demo label="segmented: vistas de una misma cosa" stack>
      <Tabs
        aria-label="Vista de cálculo"
        items={[
          { id: "design", label: "Diseño", content: <p className="m-0 text-sm text-gray-600">Hoja de diseño…</p> },
          { id: "costs", label: "Costos", content: <p className="m-0 text-sm text-gray-600">Hoja de costos…</p> },
          { id: "bom", label: "Lista de materiales", content: <p className="m-0 text-sm text-gray-600">Lista de materiales…</p> },
        ]}
      />
    </Demo>
    <Demo label="underline: secciones de una tarjeta" stack>
      <Card padded={false} className="-m-4 sm:-m-6 overflow-hidden">
        <Tabs
          variant="underline"
          listClassName="px-6"
          aria-label="Secciones del diseño"
          items={[
            { id: "summary", label: "Resumen", content: <p className="m-0 p-6 text-sm text-gray-600">Información general…</p> },
            { id: "elements", label: "Elementos", count: 1, content: <p className="m-0 p-6 text-sm text-gray-600">Elementos…</p> },
            { id: "sub", label: "Sub-diseños", count: 1, content: <p className="m-0 p-6 text-sm text-gray-600">Sub-diseños…</p> },
          ]}
        />
      </Card>
    </Demo>
  </>
);

/* Avisos -------------------------------------------------------------- */

const NoticePage = () => (
  <Demo label="Tonos" stack>
    <Notice tone="success" title="¡Diseño guardado exitosamente!" actions={<Button variant="secondary" size="sm">Ver todos los diseños</Button>} />
    <Notice tone="warning">Falta Material del núcleo y Material de devanado.</Notice>
    <Notice tone="danger" onClose={() => {}}>
      Debes seleccionar al menos un elemento.
    </Notice>
    <Notice tone="info" title="Recalcular">
      Los valores de la plantilla cambiaron desde la última vez.
    </Notice>
  </Demo>
);

const ToastsPage = () => {
  useEffect(() => {
    if (demoParam !== "avisos") return;
    // Tras montar el <Toaster>, que se suscribe en su propio efecto.
    const id = setTimeout(() => {
      // Sin cierre automático, para que se puedan revisar.
      const duration = Infinity;
      toast.success("Norma guardada", { description: "NTCA 1.0.0 · Colombia", duration });
      toast.error("No se pudo guardar", { description: "El código ya existe.", duration });
      toast("Diseño eliminado", { action: { label: "Deshacer", onClick: () => {} }, duration });
    }, 300);
    return () => clearTimeout(id);
  }, []);
  return (
    <Demo label="Lanza un aviso (arriba a la derecha)">
      <Button variant="secondary" onClick={() => toast.success("Norma guardada", { description: "NTCA 1.0.0 · Colombia" })}>
        Éxito
      </Button>
      <Button variant="secondary" onClick={() => toast.error("No se pudo guardar", { description: "El código ya existe." })}>
        Error
      </Button>
      <Button variant="secondary" onClick={() => toast.warning("Faltan datos", { description: "Material del núcleo sin etiquetar." })}>
        Advertencia
      </Button>
      <Button
        variant="secondary"
        onClick={() => toast("Diseño eliminado", { action: { label: "Deshacer", onClick: () => toast.info("Restaurado") } })}
      >
        Con acción
      </Button>
    </Demo>
  );
};

const EmptyPage = () => (
  <Demo label="Sin resultados y error" stack>
    <div className="grid gap-4 md:grid-cols-2">
      <EmptyState title="Ningún diseño coincide con los filtros." action={<Button variant="secondary">Limpiar filtros</Button>} />
      <EmptyState tone="error" title="No se pudieron cargar las normas." />
    </div>
  </Demo>
);

/* Superposiciones ----------------------------------------------------- */

const ModalPage = () => {
  const [open, setOpen] = useState(false);
  const [tall, setTall] = useState(demoParam === "largo");
  const [stack, setStack] = useState(demoParam === "apilados" ? 2 : 0);
  const [country, setCountry] = useState<number | undefined>(1);
  return (
    <>
      <Demo label="Abrir">
        <Button onClick={() => setOpen(true)}>Modal con pie</Button>
        <Button variant="secondary" onClick={() => setTall(true)}>
          Modal largo
        </Button>
        <Button variant="secondary" onClick={() => setStack(1)}>
          Dos modales apilados
        </Button>
      </Demo>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        icon={<FileIcon />}
        title="Elige un diseño existente como base"
        description="Sus elementos y sub-diseños se copiarán al nuevo diseño."
        size="lg"
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={() => setOpen(false)}>Usar como base</Button>
          </>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="País">
            <Select options={countries} value={country} onChange={setCountry} />
          </Field>
          <Field label="Código de diseño">
            <Input placeholder="Ej. 1DAA2612" />
          </Field>
        </div>
      </Modal>

      <Modal open={tall} onClose={() => setTall(false)} title="Vista previa de importación" size="lg">
        <div className="flex flex-col gap-2">
          {Array.from({ length: 60 }, (_, i) => (
            <div key={i} className="rounded-lg bg-gray-50 px-3 py-2 font-mono text-sm">
              Fila {i + 1} · 1-25-220-120-CV-CT-NTCA-CO-ST
            </div>
          ))}
        </div>
      </Modal>

      <Modal open={stack >= 1} onClose={() => setStack(0)} title="Menú de plantilla">
        <Button onClick={() => setStack(2)}>Elegir ítem…</Button>
      </Modal>
      <Modal open={stack >= 2} onClose={() => setStack(1)} title="Elegir ítem" size="sm">
        <p className="m-0 text-sm text-gray-600">Pulsa Esc: se cierra este y el de abajo sigue abierto.</p>
      </Modal>
    </>
  );
};

const SelectionBarPage = () => {
  const [count, setCount] = useState(3);
  return (
    <Demo label="Fija al pie mientras hay selección" stack>
      {count > 0 ? (
        <SelectionBar
          count={count}
          label={count === 1 ? "elemento seleccionado" : "elementos seleccionados"}
          hint="Solo se muestran elementos de la norma NTCA."
          actions={
            <>
              <Button variant="ghostLight" onClick={() => setCount(0)}>
                Limpiar selección
              </Button>
              <Button variant="light">
                Continuar <IconArrowRight size={16} />
              </Button>
            </>
          }
        />
      ) : (
        <Button variant="secondary" onClick={() => setCount(3)}>
          Volver a seleccionar
        </Button>
      )}
    </Demo>
  );
};

/* Registro ------------------------------------------------------------ */

export const CATEGORIES = [
  "Fundamentos",
  "Acciones",
  "Formularios",
  "Datos",
  "Navegación",
  "Avisos",
  "Superposiciones",
] as const;

export const PAGES: GalleryPage[] = [
  {
    id: "colores",
    title: "Colores",
    category: "Fundamentos",
    description: "Marca, estados y una escala de grises con un punto de índigo. Salen de src/tokens.ts y llegan a Tailwind con estos nombres (bg-rymel-blue, text-gray-600…).",
    usage: `<div className="bg-rymel-blue text-rymel-yellow">…</div>
<span className="bg-success-soft text-success">Adjunto</span>`,
    Body: ColorsPage,
  },
  {
    id: "tipografia",
    title: "Tipografía",
    category: "Fundamentos",
    description: "Plus Jakarta Sans para todo el texto y JetBrains Mono para códigos, referencias y versiones.",
    usage: `<h1 className="text-5xl font-extrabold tracking-[-0.03em]">Diseños</h1>
<span className="font-mono">1DAA2612-CO CV</span>`,
    Body: TypographyPage,
  },
  {
    id: "sombras",
    title: "Sombras",
    category: "Fundamentos",
    description: "float para bloques que flotan sobre la banda, menu para desplegables, bar para la barra de selección y modal para diálogos.",
    usage: `<div className="shadow-float">…</div>`,
    Body: ShadowsPage,
  },
  {
    id: "botones",
    title: "Button",
    category: "Acciones",
    description: "Una acción principal por zona. accent (amarillo) para guardar o cerrar un flujo. Sobre la banda índigo, las variantes claras. El color no distingue tipos de acción.",
    imports: ["Button"],
    usage: `<Button>Buscar</Button>
<Button variant="accent" loading={saving}>Guardar</Button>
<Button variant="light" size="lg" icon={<IconPlus />}>Nuevo diseño</Button>`,
    Body: ButtonsPage,
  },
  {
    id: "boton-icono",
    title: "IconButton",
    category: "Acciones",
    description: "Acciones de solo icono en filas de tabla y cabeceras. label es obligatorio: es el nombre accesible y el texto de ayuda.",
    imports: ["IconButton"],
    usage: `<IconButton label="Editar norma NTCA" onClick={edit}>
  <IconPencil />
</IconButton>`,
    Body: IconButtonsPage,
  },
  {
    id: "campos",
    title: "Field e Input",
    category: "Formularios",
    description: "Field pone la etiqueta, la ayuda y el error; Input es la caja de 46 px (50 px en lg), con icono, botón de vaciar y texto monoespaciado.",
    imports: ["Field", "Input"],
    usage: `<Field label="Versión" error={errors.version}>
  <Input mono value={version} onChange={(e) => setVersion(e.target.value)} />
</Field>`,
    Body: FieldsPage,
  },
  {
    id: "select",
    title: "Select",
    category: "Formularios",
    description: "Desplegable con búsqueda y teclado. Acepta cualquier tipo de valor y un prefijo por opción (bandera, icono).",
    imports: ["Select"],
    usage: `<Select
  options={countries.map((c) => ({ label: c.name, value: c.id }))}
  value={country}
  onChange={setCountry}
/>`,
    Body: SelectPage,
  },
  {
    id: "casillas",
    title: "Checkbox",
    category: "Formularios",
    description: "Casilla nativa con el color de marca: accesible por teclado sin más.",
    imports: ["Checkbox"],
    usage: `<Checkbox label="Incluir dadas de baja" checked={value} onCheckedChange={setValue} />`,
    Body: CheckboxPage,
  },
  {
    id: "filtros",
    title: "Barra de filtros",
    category: "Formularios",
    description: "FilterField pone la etiqueta pequeña y gris sobre cada control; los campos crecen en la fila.",
    imports: ["Card", "FilterField", "Input", "Select", "Button"],
    usage: `<Card as="form" className="flex flex-wrap items-end gap-3">
  <FilterField label="Código de diseño">
    <Input placeholder="Ej. 1DAA2612" />
  </FilterField>
  <Button type="submit">Buscar</Button>
</Card>`,
    Body: FiltersPage,
  },
  {
    id: "etiquetas",
    title: "Badge y Tag",
    category: "Datos",
    description: "Badge para estado o categoría: aquí sí vive el color semántico. Tag para valores cortos con borde (subtipos) o monoespaciados (versiones).",
    imports: ["Badge", "Tag"],
    usage: `<Badge tone="success" dot>Activo</Badge>
<Tag mono>1.0.0</Tag>`,
    Body: TagsPage,
  },
  {
    id: "tarjetas",
    title: "Card, SectionCard y StatTile",
    category: "Datos",
    description: "Card es la tarjeta blanca de pantalla; SectionCard, el bloque de una pantalla larga con su paso o icono; StatTile, una cifra destacada.",
    imports: ["Card", "SectionCard", "StatTile"],
    usage: `<SectionCard step={1} title="Datos generales" description="…">
  …
</SectionCard>`,
    Body: CardsPage,
  },
  {
    id: "tabla",
    title: "TableCard",
    category: "Datos",
    description: "Tarjeta de tabla con desplazamiento horizontal y pie. Dentro va una <table className=\"rm-table\">: data-align=\"right\" para cifras y aria-selected tiñe la fila.",
    imports: ["TableCard", "TitleCell", "Pagination"],
    usage: `<TableCard footer={<Pagination … />}>
  <table className="rm-table">…</table>
</TableCard>`,
    Body: TablePage,
  },
  {
    id: "paginacion",
    title: "Pagination",
    category: "Datos",
    description: "Páginas con elipsis. Con totalItems y pageSize muestra «Mostrando 1–20 de N».",
    imports: ["Pagination"],
    usage: `<Pagination page={page} totalPages={pages} onPageChange={setPage} totalItems={total} pageSize={20} />`,
    Body: PaginationPage,
  },
  {
    id: "navbar",
    title: "Navbar",
    category: "Navegación",
    description: "Barra de navegación: abre la banda índigo. La app decide las secciones, cuál está activa y qué ve cada rol; los enlaces usan el router configurado en RymelUIProvider.",
    imports: ["Navbar"],
    usage: `<Navbar
  sections={sections}
  createActions={createActions}
  user={{ name, email, roles }}
  onLogout={logout}
/>`,
    Body: NavbarPage,
  },
  {
    id: "cabecera",
    title: "PageHeader y Page",
    category: "Navegación",
    description: "PageHeader continúa la banda índigo de la barra; dentro de Page, el primer bloque sube y flota sobre ella.",
    imports: ["PageHeader", "HeaderChip", "Page"],
    usage: `<PageHeader eyebrow="Biblioteca de diseños" title="Diseños" actions={…} />
<Page>
  <Card>…</Card>
</Page>`,
    Body: HeaderPage,
  },
  {
    id: "pestanas",
    title: "Tabs",
    category: "Navegación",
    description: "segmented para vistas de una misma cosa; underline para secciones de una tarjeta. Controladas o no.",
    imports: ["Tabs"],
    usage: `<Tabs variant="underline" items={[{ id: "resumen", label: "Resumen", content: … }]} />`,
    Body: TabsPage,
  },
  {
    id: "notice",
    title: "Notice",
    category: "Avisos",
    description: "Aviso dentro de la pantalla: guardado, falta un dato, error de carga. Con título, acciones y cierre opcionales.",
    imports: ["Notice"],
    usage: `<Notice tone="warning">Falta Material del núcleo.</Notice>`,
    Body: NoticePage,
  },
  {
    id: "toasts",
    title: "Avisos flotantes (sonner)",
    category: "Avisos",
    description: "El paquete no depende de sonner: exporta toastOptions para su <Toaster> con la marca.",
    imports: ["toastOptions"],
    usage: `import { Toaster } from "sonner";
<Toaster position="top-right" toastOptions={toastOptions} />`,
    Body: ToastsPage,
  },
  {
    id: "vacios",
    title: "EmptyState",
    category: "Avisos",
    description: "Sin resultados, sin datos todavía o error de carga, con una acción opcional.",
    imports: ["EmptyState"],
    usage: `<EmptyState title="Ningún diseño coincide con los filtros." action={<Button>Limpiar filtros</Button>} />`,
    Body: EmptyPage,
  },
  {
    id: "modal",
    title: "Modal",
    category: "Superposiciones",
    description: "Esc cierra solo el de arriba y respeta un Esc ya usado dentro; un modal alto se desplaza con el fondo y deja la cabecera fija; el foco vuelve al cerrar.",
    imports: ["Modal"],
    usage: `<Modal open={open} onClose={close} title="Eliminar diseño" footer={…}>
  …
</Modal>`,
    Body: ModalPage,
  },
  {
    id: "barra-seleccion",
    title: "SelectionBar",
    category: "Superposiciones",
    description: "Barra índigo fija al pie mientras hay algo elegido o pendiente de guardar.",
    imports: ["SelectionBar"],
    usage: `<SelectionBar count={3} label="elementos seleccionados" actions={…} />`,
    Body: SelectionBarPage,
  },
];
