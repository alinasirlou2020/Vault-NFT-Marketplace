import path from "path";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
      "@assets": path.resolve(
        import.meta.dirname,
        "..",
        "..",
        "attached_assets",
      ),
    },
    dedupe: ["react", "react-dom"],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: "dist", // تغییر کرد تا مستقیماً در dist ساخته شود
    emptyOutDir: true,
  },
  server: {
    port: 5173,
    host: "0.0.0.0",
    strictPort: true,
  },
  preview: {
    port: 5173,
    host: "0.0.0.0",
  },
});
