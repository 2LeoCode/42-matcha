import { createServer } from "./server";

async function main() {
  const server = createServer();
  server.start();
}

main();
