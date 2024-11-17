import { createReadStream, constants as fsConstants } from "fs";
import { access } from "fs/promises";
import { ServerResponse as HttpServerResponse } from "http";
import { StatusCodes } from "http-status-codes";
import path from "path";

import { throwError } from "@42-matcha/common";

import { config, IncomingMessage } from ".";
import mime from "mime-types";

const { R_OK } = fsConstants;

async function resolveFile(
  packageName: string,
  route: string,
): Promise<HttpFileInfo | null> {
  if (!(packageName in config.packages)) return null;

  if (packageName === "~" && (!route || config.routes.includes(route)))
    return resolveFile("~", "index.html");
  const pack = config.packages[packageName]!;
  for (const dir of pack.includeDirectories) {
    const filePath = path.resolve(
      config.packagesRoot,
      pack.rootDirectory,
      dir,
      route,
    );

    try {
      const contentType = mime.contentType(path.basename(filePath));
      if (!contentType) continue;
      await access(filePath, R_OK);

      return {
        contentType,
        filePath,
      };
    } catch {
      continue;
    }
  }
  return null;
}

type HttpFileInfo = {
  contentType: string;
  filePath: string;
};

export class ServerResponse extends HttpServerResponse<IncomingMessage> {
  async serveFile(packageName: string, route: string) {
    if (!["GET", "HEAD"].includes(this.req.method!))
      throwError("Cannot serve file outside of GET or HEAD requests");

    const fileInfo = await resolveFile(packageName, route);

    if (!fileInfo) this.writeHead(StatusCodes.NOT_FOUND).end();
    else {
      const { contentType, filePath } = fileInfo;
      this.writeHead(StatusCodes.OK, {
        "content-type": contentType,
      });

      if (this.req.method === "GET") createReadStream(filePath).pipe(this);
      else this.end();
    }
  }
}
