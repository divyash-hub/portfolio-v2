import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { netlifyHeadersFile, siteHeaders } from "./security-headers";

export default defineConfig({
  plugins: [
    react(),
    {
      name: "netlify-headers",
      generateBundle() {
        this.emitFile({ type: "asset", fileName: "_headers", source: netlifyHeadersFile });
      },
    },
  ],
  server: { port: 5173 },
  preview: { headers: siteHeaders },
});
