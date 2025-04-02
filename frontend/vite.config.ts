import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0", // Allow external access to Vite dev serverd
    port: 5173, // Make sure this port matches your Docker configuration
  },
});
