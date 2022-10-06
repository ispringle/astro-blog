import { defineConfig } from "astro/config";
import reorg from "./src/lib/vite-plugin-orgmode";

// https://astro.build/config
export default defineConfig({
  integrations: [reorg()],
  vite: {},
});
