import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from 'url';

// --- PERBAIKAN DIMULAI DI SINI ---
// Mendefinisikan __dirname secara manual untuk lingkungan ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// --- PERBAIKAN SELESAI ---

export default defineConfig(({ mode }) => {
  // Project root directory (contains dfx.json and .env output by DFX)
  const envDir = path.resolve(__dirname, "..", "..");
  const env = loadEnv(mode, envDir, "");
  return {
    plugins: [react()],
    envDir,
    define: {
      'import.meta.env.VITE_CANISTER_ID_AURA_BACKEND': JSON.stringify(env.CANISTER_ID_AURA_BACKEND || env.VITE_CANISTER_ID_AURA_BACKEND || ""),
      'import.meta.env.VITE_DFX_NETWORK': JSON.stringify(env.DFX_NETWORK || env.VITE_DFX_NETWORK || "local"),
      global: 'globalThis',
      'process.env': {},
    },
    resolve: {
      alias: {
        // Point to src/declarations where `dfx generate` places files in this project
        "declarations": path.resolve(__dirname, "..", "..", "src", "declarations"),
      },
    },
    server: {
      proxy: {
        "/api": {
          target: "http://127.0.0.1:4943",
          changeOrigin: true,
        },
      },
    },
  };
});