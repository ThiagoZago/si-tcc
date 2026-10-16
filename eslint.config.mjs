import { builtinModules } from "node:module";
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const features = ["site", "auth", "booking", "dashboard"];
const nodeModules = [
  ...new Set(builtinModules.filter((m) => !m.startsWith("_")).map((m) => m.split("/")[0])),
];
const relative = (folders) => `^(\\.{1,2}/)+(${folders.join("|")})(/|$)`;
const nodeBuiltins = `^(node:|(${nodeModules.join("|")})(/|$))`;

const restrict = (files, rules) => ({
  files,
  rules: {
    "no-restricted-imports": [
      "error",
      {
        patterns: rules.flatMap(({ message, group = [], regexes = [] }) => [
          ...(group.length ? [{ group, message }] : []),
          ...regexes.map((regex) => ({ regex, message })),
        ]),
      },
    ],
  },
});

const ui = {
  message: "A interface não importa o back-end: use a API (src/lib/api-client) ou src/shared.",
  group: ["@/server", "@/server/**", "@/app/**"],
  regexes: [relative(["server", "app"])],
};

export default defineConfig([
  ...nextVitals,
  ...nextTypescript,
  { rules: { "no-irregular-whitespace": "error" } },
  restrict(
    ["src/components/**", "src/lib/**"],
    [
      ui,
      {
        message: "components e lib são compartilhados: não dependem de uma funcionalidade.",
        group: ["@/features/**"],
        regexes: [relative(["features"])],
      },
    ],
  ),
  ...features.map((feature) =>
    restrict(
      [`src/features/${feature}/**`],
      [
        ui,
        {
          message:
            "Uma funcionalidade não importa outra: mova o código comum para components, lib ou shared.",
          group: features
            .filter((other) => other !== feature)
            .map((other) => `@/features/${other}/**`),
          regexes: [relative(features.filter((other) => other !== feature))],
        },
      ],
    ),
  ),
  restrict(
    ["src/shared/**"],
    [
      {
        message:
          "src/shared roda no cliente e no servidor: não depende de outras camadas nem do Node.js.",
        group: [
          "@/server/**",
          "@/features/**",
          "@/components/**",
          "@/lib/**",
          "@/app/**",
          "next/*",
        ],
        regexes: [relative(["server", "features", "components", "lib", "app"]), nodeBuiltins],
      },
    ],
  ),
  restrict(
    ["src/server/**"],
    [
      {
        message: "O back-end não depende da interface.",
        group: ["@/features/**", "@/components/**", "@/lib/**", "@/app/**"],
        regexes: [relative(["features", "components", "lib", "app"])],
      },
    ],
  ),
  globalIgnores([
    ".next/**",
    ".next-test/**",
    "node_modules/**",
    "legacy/**",
    "data/**",
    "artifacts/**",
    "playwright-report/**",
    "test-results/**",
    "next-env.d.ts",
  ]),
]);
