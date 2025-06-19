import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig(() => {
  const origin = process.env.VITE_APP_URL || "http://localhost:5173";

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      proxy: {
        "/api/fruits": {
          target: "https://fruity-proxy.vercel.app",
          changeOrigin: true,
          headers: {
            "x-api-key": "fruit-api-challenge-2025",
            Origin: origin,
          },
        },
      },
    },
  };
});
