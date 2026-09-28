import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [tailwindcss(), cloudflare()],
  server: {
    host: "0.0.0.0",
    port: 4317,
    strictPort: true,
  },
});
