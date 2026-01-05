/* eslint-disable @typescript-eslint/ban-ts-comment */
import { parse } from "svg-parser";
import hastToBabelAst from "@svgr/hast-util-to-babel-ast";
import { transformFromAstSync, createConfigItem } from "@babel/core";
import { format } from "prettier/standalone";
// @ts-ignore
import prettierPluginTypescript from "prettier/plugins/typescript";
// @ts-ignore
import prettierPluginEstree from "prettier/plugins/estree";
import svgrBabelPreset, {
  Options as SvgrPresetOptions,
} from "@svgr/babel-preset";
import type { Plugin } from "@svgr/core";
import { optimize } from "svgo";
import { sanitizeComponentName } from "./format";

export class SVGR {
  constructor() {}
  private transform: Plugin = (code, config, state) => {
    const hastTree = parse(code);

    const babelTree = hastToBabelAst(hastTree);

    const svgPresetOptions: SvgrPresetOptions = {
      ref: config.ref,
      titleProp: config.titleProp,
      descProp: config.descProp,
      expandProps: config.expandProps,
      dimensions: config.dimensions,
      icon: config.icon,
      native: config.native,
      svgProps: config.svgProps,
      replaceAttrValues: config.replaceAttrValues,
      typescript: config.typescript,
      template: config.template,
      memo: config.memo,
      exportType: config.exportType,
      namedExport: config.namedExport,
      jsxRuntime: "classic",
      importSource: "react",
      jsxRuntimeImport: { namespace: "React", source: "react" },
      state,
    };

    const result = transformFromAstSync(babelTree, code, {
      caller: {
        name: "svgr",
      },
      presets: [
        createConfigItem([svgrBabelPreset, svgPresetOptions], {
          type: "preset",
        }),
      ],
      filename: "unknown",
      babelrc: false,
      configFile: false,
      code: true,
      ast: false,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      inputSourceMap: false,
      ...(config.jsx && config.jsx.babelConfig),
    });

    if (!result?.code) {
      throw new Error(`Unable to generate SVG file`);
    }

    return result.code;
  };

  async convertToTSX({ name, svg }: { name: string; svg: string }) {
    return await format(
      this.transform(
        optimize(svg.trim()).data,
        {
          native: false,
          typescript: true,
          dimensions: true,
          icon: false,
          expandProps: "end",
        },
        { componentName: sanitizeComponentName(name || "Icon") },
      ),
      {
        parser: "typescript",
        plugins: [prettierPluginEstree, prettierPluginTypescript],
      },
    );
  }
}
