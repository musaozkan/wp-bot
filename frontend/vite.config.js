import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig(() => {
  return {
    plugins: [react()],
    server: {
      port: 3001,
      host: "0.0.0.0",
      open: "true",
    },
    define: {
      serverUrl: JSON.stringify("http://localhost:3000/api"),
    },
  };
});
