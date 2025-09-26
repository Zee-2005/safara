import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@shared": path.resolve(__dirname, "../../shared")
    }
  },
  root: path.resolve(__dirname),
  server: {
    port: 5174
  },
  build: {
    outDir: path.resolve(__dirname, "dist"),
    emptyOutDir: true
  }
});
