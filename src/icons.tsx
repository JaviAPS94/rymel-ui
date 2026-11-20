import type { ReactNode, SVGProps } from "react";

/**
 * Iconos internos de los componentes. El paquete no impone librería de
 * iconos: donde un componente recibe un icono, acepta cualquier nodo React
 * (react-icons en el cliente, Tabler en el admin).
 */
export type IconProps = SVGProps<SVGSVGElement> & { size?: number };

const make = (paths: ReactNode, strokeWidth = 2) =>
  function Icon({ size = 18, ...props }: IconProps) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        {...props}
      >
        {paths}
      </svg>
    );
  };

export const IconChevronDown = make(<path d="m6 9 6 6 6-6" />, 2.4);
export const IconChevronLeft = make(<path d="m15 6-6 6 6 6" />, 2.4);
export const IconChevronRight = make(<path d="m9 6 6 6-6 6" />, 2.4);
export const IconArrowLeft = make(<path d="M19 12H5M11 6l-6 6 6 6" />, 2.4);
export const IconArrowRight = make(<path d="M5 12h14M13 6l6 6-6 6" />, 2.4);
export const IconPlus = make(<path d="M12 5v14M5 12h14" />, 2.6);
export const IconX = make(<path d="M6 6l12 12M18 6 6 18" />, 2.4);
export const IconCheck = make(<path d="M20 6 9 17l-5-5" />, 2.4);
export const IconCheckCircle = make(
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="m8.5 12.5 2.5 2.5 4.5-5" />
  </>,
);
export const IconMenu = make(<path d="M4 7h16M4 12h16M4 17h16" />);
export const IconSearch = make(
  <>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </>,
  2.4,
);
export const IconLogout = make(
  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />,
);
export const IconInbox = make(
  <>
    <path d="M22 12h-6l-2 3h-4l-2-3H2" />
    <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
  </>,
);
export const IconAlert = make(
  <>
    <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
    <path d="M12 9v4M12 17h.01" />
  </>,
);
export const IconLock = make(
  <>
    <rect x="4" y="11" width="16" height="10" rx="2" />
    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
  </>,
);
export const IconSpinner = ({ size = 18, className }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
    className={`animate-spin ${className ?? ""}`}
  >
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity=".25" strokeWidth="3" />
    <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
  </svg>
);
