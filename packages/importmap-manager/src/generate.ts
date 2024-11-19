import { createReadStream } from "fs";
import { writeFile } from "fs/promises";
import { json } from "stream/consumers";
import { get } from "https";
import { StatusCodes } from "http-status-codes";
import type { PackageJson } from "types-package-json";

import { HttpStatusError } from "@42-matcha/common";

type PackageConditionalExport = {
  types?: string;
  import?: string;
  require?: string;
  node?: string;
  default?: string;
};

declare module "types-package-json" {
  interface PackageJson {
    exports?: string | Record<string, string | PackageConditionalExport>;
  }
}

async function fetchPackageJson(host: string, path: string, redirectLimit = 1) {
  const req = get({
    host,
    path,
    headers: { accept: "application/json" },
  }).end();

  const result = await new Promise<PackageJson>((resolve, reject) => {
    req
      .once("response", (res) => {
        if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400) {
          if (!res.headers.location) {
            reject(new Error("invalid redirection response"));
          } else {
            const newUrl = new URL(res.headers.location);
            if (!redirectLimit)
              reject(new Error("redirection limit has been reached"));
            else
              resolve(
                fetchPackageJson(
                  newUrl.host,
                  newUrl.pathname,
                  redirectLimit - 1,
                ),
              );
          }
        } else if (res.statusCode !== StatusCodes.OK)
          reject(new HttpStatusError(path, res.statusCode));
        else if (!res.headers["content-type"]?.startsWith("application/json"))
          reject(new Error());
        else resolve(json(res) as Promise<PackageJson>);
      })
      .once("error", reject);
  });
  req.destroy();
  return result;
}

function packageJsonToImportMap(
  pack: PackageJson,
  provider: string,
): Record<string, string> {
  if (pack.name.startsWith("@42-matcha/"))
    return {
      [pack.name]: `@${pack.name.slice(11)}/${pack.main!}`,
    };

  const baseUrl = `https://${provider}/${pack.name}@${pack.version}`;
  const dependencies = pack.dependencies ?? {};
  const importMap: Record<string, string> = {
    [pack.name]: baseUrl,
  };

  function parseExportsEntry(importMapKey: string, value: string) {
    if (value.startsWith("./")) {
      importMap[importMapKey] = `${baseUrl}${value.slice(1)}`;
    } else if (value in dependencies) {
      importMap[importMapKey] = `${baseUrl}${dependencies[value]}`;
    }
  }

  if (pack.exports && typeof pack.exports === "object") {
    for (const key in pack.exports) {
      if (key === ".") continue;
      const importMapKey = `${pack.name}${key.slice(1)}`;
      const value = pack.exports[key]!;
      if (typeof value === "string") parseExportsEntry(importMapKey, value);
      else if (value.import) parseExportsEntry(importMapKey, value.import);
      else if (value.default) parseExportsEntry(importMapKey, value.default);
    }
  }
  return importMap;
}

type ImportMap = {
  imports: Record<string, string>;
};

export async function generateImportMap(
  provider: string,
  config: string,
  output: string,
) {
  let importMap: ImportMap = { imports: {} };

  const uiPackage = (await json(createReadStream(config))) as PackageJson;
  const dependencies = uiPackage.dependencies ?? {};
  for (const dep in dependencies) {
    if (dep.startsWith("@42-matcha/")) {
      // Local dependency
      const pack = dep.slice(11);
      importMap.imports[dep] = `/@${pack}/index.js`;
    } else {
      const packagePath = `/${dep}@${dependencies[dep]}/package.json`;
      const depPackage = await fetchPackageJson(provider, packagePath);
      const packageImportMap = packageJsonToImportMap(depPackage, provider);
      importMap.imports = { ...importMap.imports, ...packageImportMap };
    }
  }

  await writeFile(output, JSON.stringify(importMap));
}
