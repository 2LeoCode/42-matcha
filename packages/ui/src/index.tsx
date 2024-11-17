import { createRoot } from "react-dom/client";
import App from "./app.js";

async function main() {
  const main = document.querySelector("main")!;
  const root = createRoot(main);
  root.render(<App />);
}

await main();
