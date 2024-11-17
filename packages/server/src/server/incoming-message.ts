import { IncomingMessage as HttpIncomingMessage } from "http";

export class IncomingMessage extends HttpIncomingMessage {
  get parsedUrl() {
    return new URL(this.url || "/", "http://localhost:4242");
  }
}
