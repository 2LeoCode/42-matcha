const importMap = document.createElement("script");
importMap.type = "importmap";

const app = document.createElement("script");
app.type = "module";
app.src = "./index.js";

fetch("./importmap.json").then((res) =>
  res.text().then((value) => {
    importMap.innerHTML = value;
    document
      .querySelector('script[src="./preload.js"]')
      .insertAdjacentElement("afterend", importMap);
    importMap.insertAdjacentElement("afterend", app);
  }),
);
