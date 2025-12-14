import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const backendPort = 3000;

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api/v1": {
        target: `http://localhost:${backendPort}`,
        changeOrigin: true,
      },
    },
    port: 5173,
  },
  build: {
    sourcemap: process.env.NODE_ENV !== "production",
    rollupOptions: {
      output: {
        manualChunks: (id: string) => {
          // Разделяем вендорные пакеты
          if (id.includes("node_modules")) {
            if (id.includes("react") || id.includes("react-dom")) {
              return "react-vendor";
            }
            if (id.includes("axios") || id.includes("react-router-dom")) {
              return "ui-vendor";
            }
            return "vendor";
          }
        },
      },
    },
  },
});
