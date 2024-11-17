import { IncomingMessage, ServerResponse } from ".";

export type Handler = (
  req: IncomingMessage,
  res: ServerResponse,
) => Promise<void>;

export function createHandler(handler: Handler) {
  return handler;
}
