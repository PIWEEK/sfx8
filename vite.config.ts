import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/sfx8/", // GitHub Pages base path
  css: {
    modules: {
      localsConvention: "camelCase",
    },
  },
});
