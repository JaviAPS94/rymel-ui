import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Solo para la galería local (`npm run dev`); el paquete se compila con tsc.
export default defineConfig({
  root: "playground",
  plugins: [react(), tailwindcss()],
  server: { port: 5180, open: true },
});
