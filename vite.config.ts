import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },

  vite: {
    preview: {
      allowedHosts: ["prop-insight-nova.onrender.com"],
    },
  },
});
