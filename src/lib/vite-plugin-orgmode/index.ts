import { PluggableList } from "@mdx-js/mdx/lib/core.js";
import type { AstroIntegration } from "astro";
import { VFile } from "vfile";
import type { Plugin as VitePlugin } from "vite";
import orgToHtml from "./orgToHtml";

export type OrgOptions = {
  reorgPlugins?: PluggableList;
  rehypePlugins?: PluggableList;
};

export default function org(orgOptions: OrgOptions = {}): AstroIntegration {
  return {
    name: "@reorg/astro",
    hooks: {
      "astro:config:setup": async ({
        updateConfig,
        // config,
        addPageExtension,
      }: // command,
      any) => {
        addPageExtension(".org");

        // let importMetaEnv: Record<string, any> = {
        //   SITE: config.site,
        // };

        updateConfig({
          vite: {
            plugins: [
              {
                name: "reorg/astro",
                enforce: "pre",
                async transform(code, id) {
                  if (!id.endsWith(".org")) return;
                  const compiled = await orgToHtml(
                    new VFile({ value: code, path: id })
                  );
                  console.log(String(compiled.result));
                  return {
                    code: String(compiled.result),
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
