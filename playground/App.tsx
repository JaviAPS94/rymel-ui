import { useEffect, useState, type ReactNode } from "react";
import { Toaster, toast } from "sonner";
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
  toastOptions,
} from "../src";

/* ------------------------------------------------------------------ */
/* Datos de ejemplo (del canvas de diseño del cliente)                 */
/* ------------------------------------------------------------------ */

const designs = [
  { code: "1DAA2612-CO CV", subd: 1, date: "28 ago 2026" },
  { code: "1DAA26A54-CO CV", subd: 1, date: "28 ago 2026" },
  { code: "1DAA2646-CO CV", subd: 2, date: "10 feb 2026" },
  { code: "DESIGN_1769136541805", subd: 1, date: "23 ene 2026" },
  { code: "DESIGN_1760386068420", subd: 1, date: "13 oct 2025" },
];

const countries = [
  { label: "Colombia", value: 1 },
  { label: "Ecuador", value: 2 },
];

const subtypes = [
  "Convencional",
  "Convencional Frente Muerto",
  "Convencional con TC",
  "Pedestal Malla",
].map((label) => ({ label, value: label }));

/** Bandera de Colombia en franjas, como en el canvas. */
const FlagCO = () => (
  <span aria-hidden="true" className="flex h-[15px] w-[22px] shrink-0 flex-col overflow-hidden rounded-[3px]">
    <span className="flex-[2] bg-[#FCD116]" />
    <span className="flex-1 bg-[#003893]" />
    <span className="flex-1 bg-[#CE1126]" />
  </span>
);

const FileIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
    <path d="M14 3v6h6M8 13h8M8 17h5" />
  </svg>
);
const ListIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <path d="M4 6h16M4 12h16M4 18h10" />
  </svg>
);

/* ------------------------------------------------------------------ */
/* Piezas de la galería                                                */
/* ------------------------------------------------------------------ */

const SECTIONS = [
  ["tokens", "Tokens"],
  ["botones", "Botones"],
  ["formularios", "Formularios"],
  ["etiquetas", "Etiquetas"],
  ["bloques", "Bloques"],
  ["tabla", "Tabla"],
  ["pestanas", "Pestañas"],
  ["avisos", "Avisos y vacíos"],
  ["superpuestos", "Modal y barra"],
] as const;

const Section = ({ id, title, description, children }: { id: string; title: string; description?: string; children: ReactNode }) => (
  <Card as="section" id={id} padded={false} className="scroll-mt-6">
    <header className="flex flex-col gap-1 border-b border-gray-200 px-5 py-5 sm:px-8">
      <h2 className="m-0 text-xl font-extrabold tracking-[-0.01em]">{title}</h2>
      {description && <p className="m-0 text-sm text-gray-600">{description}</p>}
    </header>
    <div className="flex flex-col gap-8 px-5 py-7 sm:px-8">{children}</div>
  </Card>
);

const Demo = ({ label, children, dark }: { label: string; children: ReactNode; dark?: boolean }) => (
  <div className="flex flex-col gap-3">
    <span className="text-xs font-bold uppercase tracking-[0.08em] text-gray-600">{label}</span>
    <div className={dark ? "rm-dots flex flex-wrap items-center gap-3 rounded-2xl bg-rymel-blue p-6" : "flex flex-wrap items-center gap-3"}>
      {children}
    </div>
  </div>
);

const Swatch = ({ name, value }: { name: string; value: string }) => (
  <div className="flex w-[148px] flex-col gap-2">
    <span className="h-16 rounded-xl border border-gray-200" style={{ background: value }} />
    <span className="flex flex-col">
      <code className="font-mono text-[12.5px] font-bold text-gray-900">{name}</code>
      <code className="font-mono text-xs text-gray-600">{value}</code>
    </span>
  </div>
);

/* ------------------------------------------------------------------ */

export default function App() {
  const [country, setCountry] = useState<number | undefined>(1);
  const [subtype, setSubtype] = useState<string | undefined>();
  const [code, setCode] = useState("");
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  // ?demo=largo | apilados | avisos abre la demo al cargar (capturas, revisión).
  const demo = new URLSearchParams(window.location.search).get("demo");
  const [tallOpen, setTallOpen] = useState(demo === "largo");
  const [stackOpen, setStackOpen] = useState(demo === "apilados" ? 2 : 0);
  useEffect(() => {
    if (demo !== "avisos") return;
    // Tras montar el <Toaster>, que se suscribe en su propio efecto.
    const id = setTimeout(() => {
      // Sin cierre automático, para que se puedan revisar.
      const duration = Infinity;
      toast.success("Norma guardada", { description: "NTCA 1.0.0 · Colombia", duration });
      toast.error("No se pudo guardar", { description: "El código ya existe.", duration });
      toast("Diseño eliminado", { action: { label: "Deshacer", onClick: () => {} }, duration });
    }, 300);
    return () => clearTimeout(id);
  }, [demo]);
  const [selected, setSelected] = useState<Record<string, boolean>>({ [designs[0].code]: true });
  const selectedCount = Object.values(selected).filter(Boolean).length;

  const brandColors = Object.entries(tokens.colors).filter(
    ([name, value]) => typeof value === "string" && (name.startsWith("rymel") || name === "surface"),
  ) as [string, string][];
  const stateColors = Object.entries(tokens.colors).filter(
    ([name]) => /^(success|warning|danger)/.test(name),
  ) as [string, string][];

  return (
    <>
      <Navbar
        sections={[
          { label: "Normas", icon: <ListIcon />, href: "#" },
          {
            label: "Diseño",
            icon: <FileIcon />,
            active: true,
            items: [
              { label: "Todos los diseños", description: "Busca y filtra la biblioteca", href: "#", icon: <ListIcon />, active: true },
              { label: "Nuevo diseño", description: "Empieza un diseño desde cero", href: "#", icon: <IconPlus size={18} /> },
            ],
          },
        ]}
        createActions={[
          { label: "Nuevo diseño", description: "Con elementos y sub-diseños", href: "#", icon: <FileIcon /> },
          { label: "Nueva norma", description: "Registrar una norma técnica", href: "#", icon: <ListIcon /> },
        ]}
        user={{ name: "admin", email: "admin@rymel.com", roles: ["ADMIN"] }}
        onLogout={() => alert("Cerrar sesión")}
      />

      <PageHeader
        eyebrow="Rymel UI · v0.1"
        title="Sistema de diseño"
        description={
          <>
            Tokens y componentes compartidos por <strong>cliente</strong> y <strong>admin</strong>.
          </>
        }
        meta={
          <>
            <HeaderChip mono>@rymel/ui</HeaderChip>
            <HeaderChip>Tailwind v3 y v4</HeaderChip>
          </>
        }
        actions={
          <>
            <Button variant="outlineLight" size="lg" onClick={() => setModalOpen(true)}>
              Abrir modal
            </Button>
            <Button variant="light" size="lg" icon={<IconPlus size={16} />}>
              Acción principal
            </Button>
          </>
        }
      />

      <Page>
        {/* El primer bloque flota sobre la banda índigo. */}
        <Card as="div" className="flex flex-wrap gap-2">
          {SECTIONS.map(([id, label]) => (
            <a
              key={id}
              href={`#${id}`}
              className="flex h-9 items-center rounded-full bg-rymel-soft px-3.5 text-[13px] font-semibold text-rymel-indigo no-underline hover:bg-rymel-blue hover:text-white"
            >
              {label}
            </a>
          ))}
        </Card>

        <Section id="tokens" title="Tokens" description="Salen de src/tokens.ts: colores, tipografía y sombras. Las clases de Tailwind usan estos nombres (bg-rymel-blue, text-gray-600, shadow-float…).">
          <Demo label="Marca">
            {brandColors.map(([name, value]) => (
              <Swatch key={name} name={name} value={value} />
            ))}
          </Demo>
          <Demo label="Estados">
            {stateColors.map(([name, value]) => (
              <Swatch key={name} name={name} value={value} />
            ))}
          </Demo>
          <Demo label="Grises">
            {Object.entries(tokens.colors.gray).map(([step, value]) => (
              <Swatch key={step} name={`gray-${step}`} value={value} />
            ))}
          </Demo>
          <Demo label="Tipografía">
            <div className="flex flex-col gap-3">
              <span className="text-5xl font-extrabold leading-[1.05] tracking-[-0.03em]">Título 48 · extrabold</span>
              <span className="text-xl font-extrabold">Sección 20 · extrabold</span>
              <span className="text-[15px]">Texto 15 · Plus Jakarta Sans regular</span>
              <span className="text-[13px] text-gray-600">Ayuda 13 · gray-600</span>
              <span className="font-mono text-[15px]">1DAA2612-CO CV · JetBrains Mono</span>
            </div>
          </Demo>
          <Demo label="Sombras">
            {/* Clases escritas enteras: Tailwind no ve las que se arman en tiempo de ejecución. */}
            {["shadow-float", "shadow-menu", "shadow-bar", "shadow-modal"].map((name) => (
              <div key={name} className={`flex h-20 w-40 items-center justify-center rounded-2xl bg-white font-mono text-sm ${name}`}>
                {name}
              </div>
            ))}
          </Demo>
        </Section>

        <Section id="botones" title="Botones" description="Una acción principal por zona. El color no distingue tipos de acción.">
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
            <Button variant="light" icon={<IconPlus size={16} />}>Agregar elementos</Button>
            <Button variant="outlineLight" icon={<IconSearch size={16} />}>Buscar diseños existentes</Button>
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
            <Button variant="secondary" icon={<IconSearch size={16} />}>Con icono</Button>
          </Demo>
          <Demo label="Solo icono">
            <IconButton label="Editar">
              <FileIcon />
            </IconButton>
            <IconButton label="Quitar" tone="danger">
              <IconX size={16} />
            </IconButton>
            <IconButton label="Buscar" size="lg">
              <IconSearch size={18} />
            </IconButton>
          </Demo>
        </Section>

        <Section id="formularios" title="Formularios" description="Campos de 46 px, foco índigo. El Select busca y se maneja con ↑ ↓ Intro Esc.">
          <div className="grid gap-5 md:grid-cols-3">
            <Field label="Versión" hint="Formato libre, p. ej. 1.0.0">
              <Input mono placeholder="Ej. 1.0.0" />
            </Field>
            <Field label="País">
              <Select
                options={countries.map((c) => ({ ...c, prefix: <FlagCO /> }))}
                value={country}
                onChange={setCountry}
                placeholder="Selecciona un país"
              />
            </Field>
            <Field label="Norma" error="Selecciona una norma.">
              <Select options={[]} value={undefined} onChange={() => {}} invalid placeholder="Selecciona una norma" />
            </Field>
          </div>
          <Demo label="Casillas">
            <Checkbox label="Elemento seleccionado" defaultChecked />
            <Checkbox label="Sin marcar" />
            <Checkbox label="Bloqueado" checked disabled readOnly />
          </Demo>
          <Demo label="Barra de filtros">
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
        </Section>

        <Section id="etiquetas" title="Etiquetas" description="Aquí sí vive el color semántico.">
          <Demo label="Badge">
            <Badge>Neutral</Badge>
            <Badge tone="brand">Convencional</Badge>
            <Badge tone="brand" count="×2">Convencional con TC</Badge>
            <Badge tone="neutral" dot>Convencionales</Badge>
            <Badge tone="success">Adjunto</Badge>
            <Badge tone="warning">Sin elementos</Badge>
            <Badge tone="danger">Duplicado</Badge>
            <Badge icon={<IconLock size={12} />}>Bloqueado</Badge>
          </Demo>
          <Demo label="Tag">
            <Tag>1F</Tag>
            <Tag mono>1.0.0</Tag>
          </Demo>
        </Section>

        <Section id="bloques" title="Bloques" description="SectionCard para pantallas largas por pasos; StatTile para cifras.">
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
              description="Completa los datos generales y pulsa «Agregar elemento», o parte de uno ya registrado con «Cargar desde existente»."
            />
          </SectionCard>
          <div className="grid max-w-md grid-cols-2 gap-3">
            <StatTile value={1} label="Elementos" />
            <StatTile value={1} label="Sub-diseños" tone="soft" />
          </div>
        </Section>

        <Section id="tabla" title="Tabla" description="TableCard + <table className=&quot;rm-table&quot;>. data-align=&quot;right&quot; para cifras; aria-selected tiñe la fila.">
          <TableCard
            aria-label="Diseños"
            footer={<Pagination page={page} totalPages={3} onPageChange={setPage} totalItems={20} pageSize={7} />}
          >
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
        </Section>

        <Section id="pestanas" title="Pestañas" description="segmented para vistas de una misma cosa; underline para secciones de una tarjeta.">
          <Tabs
            aria-label="Vista de cálculo"
            items={[
              { id: "design", label: "Diseño", content: <p className="m-0 text-sm text-gray-600">Hoja de diseño…</p> },
              { id: "costs", label: "Costos", content: <p className="m-0 text-sm text-gray-600">Hoja de costos…</p> },
              { id: "bom", label: "Lista de materiales", content: <p className="m-0 text-sm text-gray-600">Lista de materiales…</p> },
            ]}
          />
          <Card padded={false} className="overflow-hidden">
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
        </Section>

        <Section id="avisos" title="Avisos y vacíos">
          <div className="flex flex-col gap-3">
            <Notice tone="success" title="¡Diseño guardado exitosamente!" actions={<Button variant="secondary" size="sm">Ver todos los diseños</Button>} />
            <Notice tone="warning">Falta Material del núcleo y Material de devanado.</Notice>
            <Notice tone="danger" onClose={() => {}}>Debes seleccionar al menos un elemento.</Notice>
            <Notice tone="info" title="Recalcular">Los valores de la plantilla cambiaron desde la última vez.</Notice>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <EmptyState title="Ningún diseño coincide con los filtros." action={<Button variant="secondary">Limpiar filtros</Button>} />
            <EmptyState tone="error" title="No se pudieron cargar las normas." />
          </div>
        </Section>

        <Section
          id="superpuestos"
          title="Modal, avisos y barra de selección"
          description="Esc cierra solo el modal de arriba; un modal alto se desplaza con el fondo y deja la cabecera fija."
        >
          <Demo label="Modal">
            <Button onClick={() => setModalOpen(true)}>Abrir modal</Button>
            <Button variant="secondary" onClick={() => setTallOpen(true)}>
              Modal largo
            </Button>
            <Button variant="secondary" onClick={() => setStackOpen(1)}>
              Dos modales apilados
            </Button>
          </Demo>
          <Demo label="Avisos (sonner)">
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
              onClick={() =>
                toast("Diseño eliminado", {
                  action: { label: "Deshacer", onClick: () => toast.info("Restaurado") },
                })
              }
            >
              Con acción
            </Button>
          </Demo>
          <SelectionBar
            count={selectedCount}
            label={selectedCount === 1 ? "elemento seleccionado" : "elementos seleccionados"}
            hint="Solo se muestran elementos de la norma NTCA."
            actions={
              <>
                <Button variant="ghostLight" onClick={() => setSelected({})}>
                  Limpiar selección
                </Button>
                <Button variant="light">
                  Continuar <IconArrowRight size={16} />
                </Button>
              </>
            }
          />
        </Section>
      </Page>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        icon={<FileIcon />}
        title="Elige un diseño existente como base"
        description="Sus elementos y sub-diseños se copiarán al nuevo diseño."
        size="lg"
        footer={
          <>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={() => setModalOpen(false)}>Usar como base</Button>
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

      <Modal open={tallOpen} onClose={() => setTallOpen(false)} title="Vista previa de importación" size="lg">
        <div className="flex flex-col gap-2">
          {Array.from({ length: 60 }, (_, i) => (
            <div key={i} className="rounded-lg bg-gray-50 px-3 py-2 font-mono text-sm">
              Fila {i + 1} · 1-25-220-120-CV-CT-NTCA-CO-ST
            </div>
          ))}
        </div>
      </Modal>

      <Modal open={stackOpen >= 1} onClose={() => setStackOpen(0)} title="Menú de plantilla">
        <Button onClick={() => setStackOpen(2)}>Elegir ítem…</Button>
      </Modal>
      <Modal open={stackOpen >= 2} onClose={() => setStackOpen(1)} title="Elegir ítem" size="sm">
        <p className="m-0 text-sm text-gray-600">Pulsa Esc: se cierra este y el de abajo sigue abierto.</p>
      </Modal>

      <Toaster position="top-right" toastOptions={toastOptions} />
    </>
  );
}
