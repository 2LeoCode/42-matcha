import { StatusCodes } from "http-status-codes";

import { config, createHandler } from "..";

const PACKAGE_REF_PATTERN = /^\/@(\w+)(?:\/(.*)){0,1}$/;

export const GET = createHandler(async (req, res) => {
  const url = req.parsedUrl;
  let pathName = url.pathname;

  if (
    req.headers.origin &&
    (config.cors.origin === "*" || config.cors.origin === req.headers.origin)
  )
    res.setHeader("access-control-allow-origin", config.cors.origin);

  console.log(pathName);

  if (pathName.endsWith("/index.html"))
    res.writeHead(StatusCodes.MOVED_PERMANENTLY, pathName.slice(0, -10)).end();
  else {
    if (pathName.endsWith("/")) pathName = pathName.slice(0, -1);
    if (pathName.startsWith("/@")) {
      const match = pathName.match(PACKAGE_REF_PATTERN);

      if (!match || match[2] === undefined)
        res.writeHead(StatusCodes.NOT_FOUND).end();
      else {
        let [packageName, file] = match.slice(1) as [string, string];
        await res.serveFile(packageName!, file!);
      }
    } else await res.serveFile("~", pathName.slice(1));
  }
});
