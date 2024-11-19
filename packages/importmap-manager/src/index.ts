import { command, option, run, string, subcommands } from "cmd-ts";
import { writeFile } from "fs/promises";
import { generateImportMap } from "./generate";

const DEFAULT_PROVIDER = "esm.sh";
const DEFAULT_CONFIG = "./package.json";
const DEFAULT_OUTPUT = "./dist/importmap.json";

const Program = subcommands({
  name: "importmap-manager",
  version: "0.0.1",
  description: "A tool to manage importmaps in the UI",
  cmds: {
    generate: command({
      name: "generate",
      description: "Generate an importmap",
      args: {
        provider: option({
          type: string,
          short: "p",
          long: "provider",
          description: "The provider to use for the import map",
          defaultValue() {
            return DEFAULT_PROVIDER;
          },
        }),
        config: option({
          type: string,
          short: "c",
          long: "config",
          description: "The path to the UI's package.json",
          defaultValue() {
            return DEFAULT_CONFIG;
          },
        }),
        output: option({
          type: string,
          short: "o",
          long: "output",
          description:
            "The path in which to generate the output JSON importmap",
          defaultValue() {
            return DEFAULT_OUTPUT;
          },
        }),
      },
      handler({ provider, config, output }) {
        generateImportMap(provider, config, output);
      },
    }),
  },
});

function main() {
  run(Program, process.argv.slice(2));
}

main();
