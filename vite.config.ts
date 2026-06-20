import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Aplikasi murni frontend (tanpa backend). Tidak ada API key, tidak ada biaya.
// Port mengikuti env PORT bila ada (mis. dari tooling), default 5173.
export default defineConfig({
  plugins: [react()],
  server: {
    port: Number(process.env.PORT) || 5173,
  },
});
