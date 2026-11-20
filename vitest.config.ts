import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    include: ["src/**/*.spec.{ts,tsx}"],
    // Testing Library limpia el DOM entre pruebas solo con globals.
    globals: true,
  },
});
