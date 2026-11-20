import { useEffect, useRef, useState, type ReactNode } from "react";
import { cx } from "../cx.js";
import { IconChevronDown, IconLogout, IconMenu, IconPlus, IconX } from "../icons.js";
import { useLinkComponent } from "../link.js";

export interface NavItem {
  label: string;
  href: string;
  /** Línea de ayuda bajo el título, en los menús. */
  description?: string;
  icon?: ReactNode;
  active?: boolean;
}

export interface NavSection {
  label: string;
  icon?: ReactNode;
  /** Sección encendida (la decide la app según la ruta). */
  active?: boolean;
  /** Enlace directo… */
  href?: string;
  /** …o menú con varios destinos. */
  items?: NavItem[];
}

export interface NavbarUser {
  name: string;
  email?: string;
  roles?: string[];
}

export interface NavbarProps {
  /** Marca: ficha amarilla con la inicial y el nombre. */
  brand?: { name?: string; mark?: ReactNode; href?: string };
  sections: NavSection[];
  /** Destinos del botón amarillo «Crear». Sin ellos no aparece. */
  createActions?: NavItem[];
  createLabel?: string;
  user?: NavbarUser;
  /** Enlaces extra del menú de cuenta (perfil, configuración…). */
  accountItems?: NavItem[];
  onLogout?: () => void;
}

/** Cierra un menú al pulsar fuera de él o con Esc. */
const useDismiss = (open: boolean, close: () => void) => {
  const ref = useRef<HTMLDivElement>(null);
  const closeRef = useRef(close);
  closeRef.current = close;
  useEffect(() => {
    if (!open) return;
    const onDown = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) closeRef.current();
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeRef.current();
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);
  return ref;
};

const navButton = (active?: boolean) =>
  cx(
    "flex h-11 cursor-pointer items-center gap-2 whitespace-nowrap rounded-[10px] border-0 px-4 text-[15px] no-underline transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60",
    active
      ? "bg-white/10 font-semibold text-white"
      : "bg-transparent font-medium text-white/80 hover:bg-white/10 hover:text-white",
  );

const menuPanel = "absolute top-[54px] z-50 rounded-2xl bg-white shadow-menu";

const Chevron = ({ open }: { open: boolean }) => (
  <IconChevronDown size={14} className={cx("transition-transform", open && "rotate-180")} />
);

const MenuLink = ({ item, onNavigate }: { item: NavItem; onNavigate: () => void }) => {
  const Link = useLinkComponent();
  return (
    <Link
      href={item.href}
      role="menuitem"
      onClick={onNavigate}
      className={cx(
        "flex gap-3 rounded-xl p-3 text-gray-900 no-underline transition-colors",
        item.active ? "bg-rymel-tint" : "hover:bg-gray-50",
      )}
    >
      {item.icon && (
        <span
          aria-hidden="true"
          className={cx(
            "flex size-[38px] shrink-0 items-center justify-center rounded-[10px]",
            item.active ? "bg-rymel-blue text-white" : "bg-rymel-soft text-rymel-indigo",
          )}
        >
          {item.icon}
        </span>
      )}
      <span className="flex flex-col gap-0.5">
        <span className="text-sm font-bold">{item.label}</span>
        {item.description && <span className="text-[13px] text-gray-600">{item.description}</span>}
      </span>
    </Link>
  );
};

const SectionMenu = ({ section }: { section: NavSection }) => {
  const [open, setOpen] = useState(false);
  const ref = useDismiss(open, () => setOpen(false));
  return (
    <div className="relative shrink-0" ref={ref}>
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={cx(navButton(section.active), open && "bg-white/20")}
      >
        {section.icon}
        {section.label}
        <Chevron open={open} />
      </button>
      {open && (
        <div role="menu" aria-label={section.label} className={cx(menuPanel, "left-0 flex w-80 flex-col gap-1 p-4")}>
          <span className="px-3 pb-2 pt-1 text-[11px] font-bold uppercase tracking-[0.08em] text-gray-600">
            {section.label}
          </span>
          {section.items?.map((item) => (
            <MenuLink key={item.href} item={item} onNavigate={() => setOpen(false)} />
          ))}
        </div>
      )}
    </div>
  );
};

const CreateMenu = ({ actions, label }: { actions: NavItem[]; label: string }) => {
  const [open, setOpen] = useState(false);
  const ref = useDismiss(open, () => setOpen(false));
  return (
    <div className="relative shrink-0" ref={ref}>
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={cx(
          "flex h-11 cursor-pointer items-center gap-2 rounded-xl border-0 bg-rymel-yellow px-[18px] text-[15px] font-bold text-rymel-blue transition hover:brightness-105 focus:outline-none focus-visible:ring-[3px] focus-visible:ring-white/40",
          open && "ring-[3px] ring-white/35",
        )}
      >
        <IconPlus size={16} />
        {label}
        <Chevron open={open} />
      </button>
      {open && (
        <div role="menu" aria-label={label} className={cx(menuPanel, "right-0 flex w-[300px] flex-col gap-0.5 p-2")}>
          {actions.map((action) => (
            <MenuLink key={action.href} item={action} onNavigate={() => setOpen(false)} />
          ))}
        </div>
      )}
    </div>
  );
};

const initialOf = (user: NavbarUser) => user.name.charAt(0).toUpperCase() || "U";

const UserMenu = ({
  user,
  items,
  onLogout,
}: {
  user: NavbarUser;
  items?: NavItem[];
  onLogout?: () => void;
}) => {
  const [open, setOpen] = useState(false);
  const ref = useDismiss(open, () => setOpen(false));
  const Link = useLinkComponent();
  return (
    <div className="relative shrink-0" ref={ref}>
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        aria-label={`Cuenta de ${user.name}`}
        onClick={() => setOpen((v) => !v)}
        className={cx(
          "flex h-11 cursor-pointer items-center gap-2.5 rounded-xl border-0 pl-1 pr-2.5 text-[15px] font-semibold text-white transition-colors hover:bg-white/10",
          open ? "bg-white/[.12]" : "bg-transparent",
        )}
      >
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white text-sm font-extrabold text-rymel-blue">
          {initialOf(user)}
        </span>
        <span className="hidden max-w-40 truncate md:block">{user.name}</span>
        <Chevron open={open} />
      </button>
      {open && (
        <div role="menu" aria-label="Cuenta" className={cx(menuPanel, "right-0 w-[260px] overflow-hidden")}>
          <div className="flex items-center gap-3 border-b border-gray-200 p-4">
            <span className="flex size-[42px] shrink-0 items-center justify-center rounded-full bg-rymel-blue text-base font-extrabold text-white">
              {initialOf(user)}
            </span>
            <span className="flex min-w-0 flex-col gap-0.5">
              <span className="truncate text-[15px] font-bold text-gray-900">{user.name}</span>
              {user.email && <span className="truncate text-xs text-gray-600">{user.email}</span>}
            </span>
          </div>
          {user.roles && user.roles.length > 0 && (
            <div className="flex flex-wrap gap-1 border-b border-gray-200 px-4 py-3">
              {user.roles.map((role) => (
                <span key={role} className="rounded-full bg-rymel-soft px-2 py-0.5 text-xs font-semibold text-rymel-indigo">
                  {role}
                </span>
              ))}
            </div>
          )}
          {items && items.length > 0 && (
            <div className="flex flex-col gap-0.5 border-b border-gray-200 p-2">
              {items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  role="menuitem"
                  onClick={() => setOpen(false)}
                  className="flex h-11 items-center gap-3 rounded-[10px] px-3 text-sm font-semibold text-gray-900 no-underline hover:bg-gray-50"
                >
                  <span className="flex text-gray-600">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </div>
          )}
          {onLogout && (
            <div className="p-2">
              <button
                type="button"
                role="menuitem"
                onClick={onLogout}
                className="flex h-11 w-full cursor-pointer items-center gap-3 rounded-[10px] border-0 bg-transparent px-3 text-left text-sm font-semibold text-danger transition-colors hover:bg-danger-soft"
              >
                <IconLogout size={18} />
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const Brand = ({
  brand,
  onClick,
}: {
  brand: NonNullable<NavbarProps["brand"]>;
  onClick?: () => void;
}) => {
  const Link = useLinkComponent();
  const name = brand.name ?? "Rymel";
  return (
    <Link
      href={brand.href ?? "/"}
      onClick={onClick}
      aria-label={`${name}, inicio`}
      className="flex shrink-0 items-center gap-2.5 text-white no-underline"
    >
      <span
        aria-hidden="true"
        className="flex size-[34px] items-center justify-center rounded-[10px] bg-rymel-yellow text-lg font-extrabold text-rymel-blue"
      >
        {brand.mark ?? name.charAt(0)}
      </span>
      <span className="text-xl font-bold tracking-[-0.01em]">{name}</span>
    </Link>
  );
};

const MobileMenu = ({ props, onClose }: { props: NavbarProps; onClose: () => void }) => {
  const Link = useLinkComponent();
  const { sections, createActions = [], user, onLogout, accountItems } = props;
  return (
    <div className="fixed inset-0 z-50 flex flex-col overflow-hidden bg-rymel-blue text-white lg:hidden">
      <div className="h-[3px] shrink-0 bg-rymel-yellow" />
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-white/10 pl-5 pr-4">
        <Brand brand={props.brand ?? {}} onClick={onClose} />
        <button
          type="button"
          aria-label="Cerrar menú"
          onClick={onClose}
          className="flex size-11 cursor-pointer items-center justify-center rounded-xl border-0 bg-white/10 text-white"
        >
          <IconX size={20} />
        </button>
      </div>

      <nav aria-label="Principal" className="flex flex-1 flex-col gap-1.5 overflow-auto p-4">
        {sections.map((section) =>
          section.items ? (
            <div key={section.label} className="rounded-[14px] bg-white/[.07]">
              <span className="flex h-[52px] items-center gap-3 px-3.5 text-base font-bold">
                {section.icon}
                {section.label}
              </span>
              <div className="flex flex-col gap-0.5 px-2 pb-2">
                {section.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    aria-current={item.active ? "page" : undefined}
                    className={cx(
                      "relative flex h-[46px] items-center rounded-[10px] pl-[38px] pr-3 text-[15px] no-underline",
                      item.active ? "bg-white/10 font-semibold text-white" : "font-medium text-white/80",
                    )}
                  >
                    {item.active && (
                      <span aria-hidden="true" className="absolute left-[18px] size-1.5 rounded-full bg-rymel-yellow" />
                    )}
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <Link
              key={section.label}
              href={section.href ?? "/"}
              onClick={onClose}
              aria-current={section.active ? "page" : undefined}
              className={cx(
                "flex h-[52px] items-center gap-3 rounded-xl px-3.5 text-base font-semibold no-underline",
                section.active ? "bg-white/10 text-white" : "text-white/85",
              )}
            >
              {section.icon}
              {section.label}
            </Link>
          ),
        )}

        {createActions.length > 0 && (
          <div className="mt-2.5 flex flex-col gap-2">
            <span className="px-1 text-[11px] font-bold uppercase tracking-[0.08em] text-white/65">
              {props.createLabel ?? "Crear"}
            </span>
            <div className="grid grid-cols-2 gap-2">
              {createActions.map((action, index) => (
                <Link
                  key={action.href}
                  href={action.href}
                  onClick={onClose}
                  className={cx(
                    "flex min-h-[50px] items-center justify-center gap-2 rounded-xl px-2 text-center text-sm font-bold no-underline",
                    index === 0 ? "bg-rymel-yellow text-rymel-blue" : "border border-white/25 text-white",
                  )}
                >
                  <IconPlus size={15} />
                  {action.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>

      {user && (
        <div className="flex shrink-0 flex-col gap-1 border-t border-white/10 p-4">
          <div className="flex items-center gap-3 px-1.5 pb-3 pt-2">
            <span className="flex size-[42px] items-center justify-center rounded-full bg-white text-base font-extrabold text-rymel-blue">
              {initialOf(user)}
            </span>
            <span className="flex min-w-0 flex-col gap-0.5">
              <span className="truncate text-[15px] font-bold">{user.name}</span>
              {user.email && <span className="truncate text-xs text-white/70">{user.email}</span>}
            </span>
          </div>
          {accountItems?.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className="flex h-[46px] items-center gap-3 rounded-[10px] px-2.5 text-[15px] font-medium text-white/90 no-underline"
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
          {onLogout && (
            <button
              type="button"
              onClick={onLogout}
              className="flex h-[46px] cursor-pointer items-center gap-3 rounded-[10px] border-0 bg-transparent px-2.5 text-left text-[15px] font-semibold text-[#FF9B8F]"
            >
              <IconLogout size={18} />
              Cerrar sesión
            </button>
          )}
        </div>
      )}
    </div>
  );
};

/**
 * Barra de navegación: abre la banda índigo que continúa `PageHeader`.
 * En pantallas estrechas (< lg) pasa a un menú de pantalla completa.
 */
export const Navbar = (props: NavbarProps) => {
  const { brand = {}, sections, createActions = [], createLabel = "Crear", user, accountItems, onLogout } = props;
  const [mobileOpen, setMobileOpen] = useState(false);
  const Link = useLinkComponent();

  return (
    <header className="relative z-40 bg-rymel-blue">
      <div className="h-[3px] bg-rymel-yellow" />
      <div aria-hidden="true" className="rm-dots pointer-events-none absolute inset-y-0 right-0 w-[46%]" />
      <div className="relative mx-auto flex h-[72px] max-w-[1280px] items-center gap-8 px-4 sm:px-8">
        <Brand brand={brand} />

        <nav aria-label="Principal" className="hidden flex-1 items-center gap-1 lg:flex">
          {sections.map((section) =>
            section.items ? (
              <SectionMenu key={section.label} section={section} />
            ) : (
              <Link
                key={section.label}
                href={section.href ?? "/"}
                aria-current={section.active ? "page" : undefined}
                className={navButton(section.active)}
              >
                {section.icon}
                {section.label}
              </Link>
            ),
          )}
        </nav>

        <div className="ml-auto hidden items-center gap-4 lg:flex">
          {createActions.length > 0 && <CreateMenu actions={createActions} label={createLabel} />}
          {createActions.length > 0 && user && (
            <span aria-hidden="true" className="h-7 w-px bg-white/[.18]" />
          )}
          {user && <UserMenu user={user} items={accountItems} onLogout={onLogout} />}
        </div>

        <button
          type="button"
          aria-label="Abrir menú"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen(true)}
          className="ml-auto flex size-11 cursor-pointer items-center justify-center rounded-xl border-0 bg-white/10 text-white lg:hidden"
        >
          <IconMenu size={20} />
        </button>
      </div>

      {mobileOpen && <MobileMenu props={props} onClose={() => setMobileOpen(false)} />}
    </header>
  );
};
