import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "url";
import { vitePluginErrorOverlay } from "@hiogawa/vite-plugin-error-overlay";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), tailwindcss(), mode === "development" ? vitePluginErrorOverlay() : null].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        // Long-lived vendor chunks cache across deploys.
        manualChunks: {
          react: ["react", "react-dom", "react-dom/client", "react-router-dom"],
          motion: ["framer-motion"],
          i18n: ["i18next", "react-i18next", "i18next-browser-languagedetector"],
        },
      },
    },
  },
}));
