import stylistic from "@stylistic/eslint-plugin";
import stylisticJs from "@stylistic/eslint-plugin-js";
import stylisticTs from "@stylistic/eslint-plugin-ts";
import stylisticJsx from "@stylistic/eslint-plugin-jsx";

/** @type {import("eslint").Linter.Config[]} */
export default [
  {
    ignores: ["**/dist", "**/node_modules"],
  },
  {
    plugins: {
      "@stylistic/js": stylisticJs,
      "@stylistic/ts": stylisticTs,
      "@stylistic/jsx": stylisticJsx,
    },
  },
  stylistic.configs.customize({
    semi: true,
    quotes: "double",
  }),
];
