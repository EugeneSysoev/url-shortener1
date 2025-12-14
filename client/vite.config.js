import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite"; // ← ИМЕННО ТАК для v4!

// Замените 3000 на реальный порт вашего бэкенд-сервера,
// если он отличается (например, 8080).
const backendPort = 3000;

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // ← Теперь это правильный импорт для v4
  ],
  server: {
    // ВАЖНО: Настройка прокси
    proxy: {
      // Все запросы, начинающиеся с /api/v1,
      // будут перенаправлены на http://localhost:3000
      "/api/v1": {
        target: `http://localhost:${backendPort}`,
        changeOrigin: true, // Изменяет заголовок Host на target URL
        // rewrite: (path) => path.replace(/^\/api/, ''), // Если бэкенд не ожидает префикс /api
      },
    },
    // Убедитесь, что ваш фронтенд слушает порт 5173
    port: 5173,
  },
});
