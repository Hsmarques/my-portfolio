import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite-plus";
import solid from "vite-plugin-solid";

import { devPhotosApiPlugin } from "./scripts/dev-api-plugin";

export default defineConfig({
  appType: "spa",
  plugins: [solid(), devPhotosApiPlugin()],
  resolve: {
    alias: {
      "~": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    host: "0.0.0.0",
  },
  preview: {
    host: "0.0.0.0",
  },
});
