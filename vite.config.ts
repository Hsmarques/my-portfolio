import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite-plus";
import solid from "vite-plugin-solid";
import { darkroomPhotosMiddleware } from "./scripts/dev-photos-middleware";

export default defineConfig({
  appType: "spa",
  plugins: [solid(), darkroomPhotosMiddleware()],
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
