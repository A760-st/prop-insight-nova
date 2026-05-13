import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  vite: {
    preview: {
      allowedHosts: ["prop-insight-nova.onrender.com", "prop-insight-nova-2.onrender.com"],
    },
    build: {
      rollupOptions: {
        output: {
          entryFileNames: (chunkInfo) => {
            return chunkInfo.name === 'server' ? '[name].js' : 'assets/[name]-[hash].js';
          },
        },
      },
    },
  },
});
