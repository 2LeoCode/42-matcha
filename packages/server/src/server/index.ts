import { createServer as httpCreateServer } from "http";
import { StatusCodes } from "http-status-codes";

import { IncomingMessage, ServerResponse, handlers, config } from ".";

export { default as config } from "./config";
export * from "./handler";
export * as handlers from "./handlers";
export * from "./incoming-message";
export * from "./server-response";

export function createServer(): Server {
  const httpServer = httpCreateServer(
    {
      IncomingMessage,
      ServerResponse,
    },
    async (req, res) => {
      if (req.method && req.method in handlers)
        await handlers[req.method as keyof typeof handlers](req, res);
      else res.writeHead(StatusCodes.NOT_IMPLEMENTED).end();
    },
  );

  return {
    start() {
      httpServer.listen(config.port, () => {
        console.log(`Listening on ${config.port}`);
      });
    },
  };
}

export type Server = {
  start(): void;
};
