import { defineConfig } from "astro/config";
import org from "./src/lib/vite-plugin-orgmode";

// https://astro.build/config
export default defineConfig({
  integrations: [org()],
});
