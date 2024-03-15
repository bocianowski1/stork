import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    define: {
      "process.env.SECRET": JSON.stringify(env.SECRET),
      "process.env.ENV": JSON.stringify(env.ENV),
    },
    plugins: [react()],
  };
});
