import {
  createContext,
  useContext,
  type AnchorHTMLAttributes,
  type ComponentType,
  type ReactNode,
} from "react";

/** Lo que el sistema le pasa a un enlace: `href` y los atributos de siempre. */
export type LinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  href: string;
  children?: ReactNode;
};

const DefaultLink = (props: LinkProps) => <a {...props} />;

const LinkContext = createContext<ComponentType<LinkProps>>(DefaultLink);

/**
 * Conecta los enlaces del sistema con el router de cada app.
 *
 * react-router (cliente):
 *   <RymelUIProvider linkComponent={({ href, ...p }) => <Link to={href} {...p} />}>
 * wouter (admin): su `<Link>` ya recibe `href`:
 *   <RymelUIProvider linkComponent={Link}>
 */
export const RymelUIProvider = ({
  linkComponent,
  children,
}: {
  linkComponent: ComponentType<LinkProps>;
  children: ReactNode;
}) => (
  <LinkContext.Provider value={linkComponent}>{children}</LinkContext.Provider>
);

/** El componente de enlace configurado (por defecto, un `<a>`). */
export const useLinkComponent = () => useContext(LinkContext);
