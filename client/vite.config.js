import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Configuration Vite standard pour une SPA React.
// Le port 5173 correspond à CLIENT_URL attendu par le CORS du serveur.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
});
