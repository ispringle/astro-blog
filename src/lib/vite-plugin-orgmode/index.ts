import { PluggableList } from "@mdx-js/mdx/lib/core.js";
import type { AstroIntegration } from "astro";
import { VFile } from "vfile";
import type { Plugin as VitePlugin } from "vite";

import render from "./render";
import orgToHtml from "./orgToHtml";

export type OrgOptions = {
  reorgPlugins?: PluggableList;
  rehypePlugins?: PluggableList;
};

export default function reorg(orgOptions: OrgOptions = {}): AstroIntegration {
  return {
    name: "@reorg/astro",
    hooks: {
      "astro:config:setup": async ({
        updateConfig,
        config,
        addPageExtension,
      }: any) => {
        addPageExtension(".org");
        let importMetaEnv: Record<string, any> = {
          SITE: config.site,
        };

        updateConfig({
          vite: {
            plugins: [
              {
                name: "astro:orgmode",
                enforce: "pre",
                async transform(code, id) {
                  if (!id.endsWith(".org")) return;
                  const compiled = await orgToHtml(
                    new VFile({ value: code, path: id })
                  );
                  console.log(compiled);
                  const layout = compiled.data.properties?.layout || "Layout";
                  const frontmatter = { ...compiled.data, layout };
                  const rendered = render(compiled.value);
                  console.log(rendered);
                  return {
                    code: rendered,
                    map: null,
                  };
                },
              },
            ] as VitePlugin[],
          },
        });
      },
    },
  };
}
