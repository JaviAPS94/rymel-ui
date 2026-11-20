/**
 * Tokens del sistema de diseño: la única fuente de verdad.
 *
 * De aquí salen las variables CSS (`--rm-*`), el preset de Tailwind v3
 * (`@rymel/ui/preset`) y el `@theme` de Tailwind v4 (`@rymel/ui/theme.css`).
 * Cambia un valor aquí y se propaga a todo.
 */
export const tokens = {
  colors: {
    // Marca
    "rymel-blue": "#16134A",
    "rymel-indigo": "#2A2486",
    "rymel-soft": "#EEEDF8",
    "rymel-tint": "#F3F2FB",
    "rymel-yellow": "#E8C547",
    surface: "#F5F5F9",
    // Estados: el color semántico vive en etiquetas y avisos, nunca en botones.
    success: "#146C43",
    "success-soft": "#E7F6EE",
    warning: "#7A5A00",
    "warning-soft": "#FFF9E6",
    danger: "#B42318",
    "danger-soft": "#FEF1F0",
    // Grises con un punto de índigo.
    gray: {
      50: "#FAFAFC",
      100: "#F3F2F8",
      200: "#ECEBF3",
      300: "#E3E2EE",
      400: "#8B89A3",
      500: "#6E6C86",
      600: "#5D5B76",
      700: "#3B3962",
      800: "#24223F",
      900: "#14132B",
    },
  },
  fontFamily: {
    sans: ['"Plus Jakarta Sans"', "system-ui", "sans-serif"],
    mono: ['"JetBrains Mono"', "ui-monospace", "monospace"],
  },
  boxShadow: {
    float: "0 1px 2px rgba(22,19,74,.06), 0 16px 40px rgba(22,19,74,.10)",
    menu: "0 2px 4px rgba(22,19,74,.06), 0 24px 56px rgba(22,19,74,.22)",
    bar: "0 16px 40px rgba(22,19,74,.30)",
    modal: "0 32px 80px rgba(0,0,0,.35)",
  },
} as const;

/** Enlace de Google Fonts con las dos familias del sistema. */
export const fontsHref =
  "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap";

export type Tokens = typeof tokens;
