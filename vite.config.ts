import typescript from "@rollup/plugin-typescript";
import { FilterPattern } from "@rollup/pluginutils";
import react from "@vitejs/plugin-react";
import { PluginOption, defineConfig } from "vite";
import * as rollup from "rollup";

interface ViteExpressBuilder extends Omit<rollup.RollupOptions, "external"> {
  output?: rollup.OutputOptions;
  exclude?: FilterPattern;
  external?: (string | RegExp)[] | string | RegExp;
}

const viteExpressBuilder = ({
  input = "./src/server/main.ts",
  output = {
    dir: "./dist/server",
    format: "esm",
  },
  exclude = "./src/client/**",
  external = [],
  plugins = [],
  ...rest
}: ViteExpressBuilder = {}): PluginOption => {
  return {
    name: "Vite Express Builder",
    async writeBundle() {
      const config = await rollup.rollup({
        input: input,
        external: [
          "express",
          "vite-express",
          ...(Array.isArray(external) ? external : [external]),
        ],
        plugins: [
          typescript({
            module: "ESNext",
            exclude: exclude,
          }),
          ...(Array.isArray(plugins) ? plugins : [plugins]),
        ],
        ...rest,
      });
      await config.write(output);
    },
  };
};

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: "./dist/client",
  },
  plugins: [react(), viteExpressBuilder()],
});
