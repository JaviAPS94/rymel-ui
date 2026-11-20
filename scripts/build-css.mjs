// Genera los estilos a partir de src/tokens.ts.
//
//   dist/styles.css  variables --rm-* y clases .rm-* (cualquier proyecto; Tailwind v3)
//   dist/theme.css   lo anterior + @theme y @source para Tailwind v4
//   dist/preset.js   preset de Tailwind v3
//
// Con --playground escribe solo playground/.generated/theme.css, apuntando a src.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { tokens } from "../src/tokens.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (path) => readFileSync(join(root, path), "utf8");
const write = (path, content) => {
  mkdirSync(dirname(join(root, path)), { recursive: true });
  writeFileSync(join(root, path), content);
};

/** [["rymel-blue", "#16134A"], ["gray-50", "#FAFAFC"], …] */
const flatColors = Object.entries(tokens.colors).flatMap(([name, value]) =>
  typeof value === "string"
    ? [[name, value]]
    : Object.entries(value).map(([step, hex]) => [`${name}-${step}`, hex]),
);
const fonts = Object.entries(tokens.fontFamily).map(([name, stack]) => [
  name,
  stack.join(", "),
]);
const shadows = Object.entries(tokens.boxShadow);

const header = "/* Generado por scripts/build-css.mjs a partir de src/tokens.ts. No editar. */\n";

const cssVars = `:root {
${flatColors.map(([n, v]) => `  --rm-${n}: ${v};`).join("\n")}
${fonts.map(([n, v]) => `  --rm-font-${n}: ${v};`).join("\n")}
${shadows.map(([n, v]) => `  --rm-shadow-${n}: ${v};`).join("\n")}
}
`;

const v4Theme = `@theme {
${flatColors.map(([n, v]) => `  --color-${n}: ${v};`).join("\n")}
${fonts.map(([n, v]) => `  --font-${n}: ${v};`).join("\n")}
${shadows.map(([n, v]) => `  --shadow-${n}: ${v};`).join("\n")}
}
`;

const components = read("src/css/components.css");
const float = read("src/css/float.css");

/** Tailwind v4: las clases van en la capa components para que las utilidades ganen. */
const themeCss = (sourceGlob) => `${header}
${v4Theme}
@source "${sourceGlob}";

${cssVars}
@layer components {
${components}
}

${float}`;

if (process.argv.includes("--playground")) {
  write("playground/.generated/theme.css", themeCss("../../src"));
  console.log("playground/.generated/theme.css");
} else {
  write("dist/styles.css", `${header}\n${cssVars}\n${components}\n${float}`);
  write("dist/theme.css", themeCss("./"));

  const preset = {
    theme: {
      extend: {
        colors: tokens.colors,
        fontFamily: tokens.fontFamily,
        boxShadow: tokens.boxShadow,
      },
    },
  };
  write(
    "dist/preset.js",
    `${header.replace("/*", "//").replace(" */", "")}\n/** Preset de Tailwind v3 con los tokens de Rymel. */\nexport default ${JSON.stringify(preset, null, 2)};\n`,
  );
  write(
    "dist/preset.d.ts",
    `declare const preset: { theme: { extend: Record<string, unknown> } };\nexport default preset;\n`,
  );
  console.log("dist/styles.css, dist/theme.css, dist/preset.js");
}
