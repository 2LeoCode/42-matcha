import { OutgoingHttpHeaders } from "http";
import { StatusCodes } from "http-status-codes";

import { config, createHandler } from "..";

export const OPTIONS = createHandler(async (req, res) => {
  if (req.headers.origin) {
    const allowedHeaders =
      req.headers["access-control-request-headers"]
        ?.split(", ")
        .map((s) => s.toLowerCase())
        .filter((header) => config.cors.allowedHeaders.includes(header)) ?? [];
    const allowedMethods =
      req.headers["access-control-request-method"]
        ?.split(", ")
        .filter((method) => config.cors.allowedMethods.includes(method)) ?? [];

    const headers: OutgoingHttpHeaders = {
      "access-control-allow-credentials": "true",
      "access-control-max-age": "600",
    };

    if (config.cors.origin === "*" || config.cors.origin === req.headers.origin)
      headers["access-control-allow-origin"] = req.headers.origin;
    if (allowedHeaders.length)
      headers["access-control-allow-headers"] = allowedHeaders.join(", ");
    if (allowedMethods.length)
      headers["access-control-allow-methods"] = allowedMethods.join(", ");

    res.writeHead(StatusCodes.OK, headers).end();
  }
});
