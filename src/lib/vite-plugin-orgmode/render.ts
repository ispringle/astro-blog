import { fileURLToPath } from "node:url";
import { normalizePath } from "vite";
import { toEstree } from "hast-util-to-estree";
import { toJs, jsx } from "estree-util-to-js";

// absolute path of "astro/jsx-runtime"
const astroJsxRuntimeModulePath = normalizePath(
  fileURLToPath(new URL("../jsx-runtime/index.js", import.meta.url))
);

export default function render(html) {
  // const j = toJs(toEstree(hast), { handlers: jsx }).value;
  return `
export default function Content() {
return '${html.replace(/\\n/, "")}'
}`;
}

function escapeViteEnvReferences(code: string) {
  return code.replace(/import\.meta\.env/g, "import\\u002Emeta.env");
}
