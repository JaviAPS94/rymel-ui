# @rymel/ui

Sistema de diseño de Rymel: tokens, estilos y componentes React compartidos por
el **cliente** (`project-front`, Tailwind v3 + react-router) y el **admin**
(`project-admin`, Tailwind v4 + wouter).

## Ver los componentes

```bash
npm install
npm run dev        # galería en http://localhost:5180
```

Con `?demo=largo`, `?demo=apilados` o `?demo=avisos` la galería abre esa demo
al cargar. La galería (`playground/`) muestra tokens, botones, formularios, etiquetas,
bloques, tabla, pestañas, avisos, modal y barra de selección, montados con el
mismo Tailwind v4 que usa el admin.

## Qué trae

| Exportación              | Para qué                                                      |
| ------------------------ | ------------------------------------------------------------- |
| `@rymel/ui`              | Componentes, iconos internos, `tokens`, `cx`                  |
| `@rymel/ui/preset`       | Preset de **Tailwind v3** (cliente)                           |
| `@rymel/ui/theme.css`    | `@theme` + estilos para **Tailwind v4** (admin)               |
| `@rymel/ui/styles.css`   | Variables `--rm-*` y clases `.rm-*` sin Tailwind (Tailwind v3) |

Los tokens viven en un solo sitio: [`src/tokens.ts`](src/tokens.ts). El build
genera a partir de ellos el preset, el `@theme` y las variables CSS.

**Componentes:** `Navbar`, `PageHeader` (+ `HeaderChip`, `PageIcon`), `Page`,
`Card`, `SectionCard`, `StatTile`, `TableCard` (+ `TitleCell`, `RowIcon`),
`Pagination`, `Tabs`, `Button`, `IconButton`, `Badge`, `Tag`, `Field`,
`FilterField`, `Input`, `Select`, `Checkbox`, `Modal`, `Notice`,
`SelectionBar`, `EmptyState`.

**Clases CSS:** `rm-page` (cuerpo bajo la cabecera; su primer bloque flota),
`rm-table` (tablas de listado), `rm-dots` (trama de la banda índigo).

## Instalación

Se instala desde GitHub con una etiqueta de versión, igual que
`@rymel/design-template`:

```json
"@rymel/ui": "github:<org>/rymel-ui#v0.1.0"
```

En los dos proyectos, carga las fuentes en `index.html`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link
  rel="stylesheet"
  href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap"
/>
```

### Cliente: Tailwind v3

`tailwind.config.js`:

```js
import rymel from "@rymel/ui/preset";

export default {
  presets: [rymel],
  // Tailwind tiene que ver las clases que usan los componentes del paquete.
  content: ["./index.html", "./src/**/*.{ts,tsx}", "./node_modules/@rymel/ui/dist/**/*.js"],
};
```

`src/index.css`:

```css
@import "@rymel/ui/styles.css";
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  @apply bg-surface font-sans text-gray-900;
}
```

### Admin: Tailwind v4

`src/index.css` (el `@source` del tema ya escanea el paquete):

```css
@import "tailwindcss";
@import "@rymel/ui/theme.css";

body {
  @apply bg-surface font-sans text-gray-900;
}
```

### Enlaces del router

Los componentes no dependen de ningún router. Envuelve la app una vez:

```tsx
// Cliente (react-router)
import { Link } from "react-router-dom";
import { RymelUIProvider } from "@rymel/ui";

<RymelUIProvider linkComponent={({ href, ...props }) => <Link to={href} {...props} />}>
  <App />
</RymelUIProvider>;

// Admin (wouter): su Link ya recibe `href`
import { Link } from "wouter";

<RymelUIProvider linkComponent={Link}>
  <App />
</RymelUIProvider>;
```

### Avisos (sonner)

El paquete no depende de `sonner`; exporta las opciones con la marca:

```tsx
import { Toaster } from "sonner";
import { toastOptions } from "@rymel/ui";

<Toaster position="top-right" toastOptions={toastOptions} />;
```

### Modales

`Modal` cubre lo que antes resolvía cada app por su cuenta:

- Con varios abiertos, Esc cierra solo el de arriba.
- Si un control de dentro ya usó Esc (`event.preventDefault()`, p. ej. un
  autocompletado), el modal no se cierra.
- Un modal más alto que la pantalla se desplaza con el fondo
  (`[data-modal-overlay]`) y la cabecera queda fija; el cuerpo no tiene
  desplazamiento propio, así no recorta desplegables.
- `dismissable={false}` evita cerrar al pulsar fuera; `showCloseButton={false}`
  quita la ✕.

### Iconos

El paquete no impone librería de iconos. Donde un componente recibe `icon`,
acepta cualquier nodo: `react-icons` en el cliente o `@tabler/icons-react` en
el admin.

## Una pantalla tipo

```tsx
import { Button, Navbar, Page, PageHeader, Card, FilterField, Input, TableCard, Pagination } from "@rymel/ui";

<>
  <Navbar sections={sections} createActions={create} user={user} onLogout={logout} />
  <PageHeader
    eyebrow="Biblioteca de diseños"
    title="Diseños"
    description={<><strong>20 diseños</strong> coinciden con tus filtros.</>}
    actions={<Button variant="light" size="lg">Nuevo diseño</Button>}
  />
  <Page>
    {/* El primer bloque sube y flota sobre la banda índigo. */}
    <Card as="form" className="flex flex-wrap items-end gap-3">
      <FilterField label="Código de diseño">
        <Input placeholder="Ej. 1DAA2612" />
      </FilterField>
      <Button type="submit">Buscar</Button>
    </Card>
    <TableCard footer={<Pagination page={1} totalPages={3} onPageChange={setPage} totalItems={20} pageSize={7} />}>
      <table className="rm-table">…</table>
    </TableCard>
  </Page>
</>;
```

## Reglas de uso

- **Botones:** una acción principal por zona. `accent` (amarillo) para guardar
  o cerrar un flujo. Sobre la banda índigo: `light`, `outlineLight`,
  `ghostLight`, `dangerLight`. El color no distingue tipos de acción: verde,
  ámbar y rojo suave quedan para etiquetas y avisos.
- **Tablas:** `<th data-align="right">` y `<td data-align="right">` para
  cifras; `<tr aria-selected>` tiñe la fila elegida; `rm-table rm-table-compact`
  baja el alto de fila.
- Las clases `.rm-*` no suman especificidad: cualquier utilidad de Tailwind
  puesta encima gana. La excepción es el primer bloque de `rm-page`, que siempre
  flota.

## Publicar una versión

```bash
npm run verify               # typecheck + pruebas + build
npm version minor            # o patch / major
git push --follow-tags
```

Después sube la etiqueta en `package.json` del cliente y del admin
(`#v0.2.0`). `prepare` compila el paquete al instalarlo desde GitHub.
