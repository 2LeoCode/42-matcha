import path from "path";

const DEFAULT_PORT = 4242;

const CONFIG: ServerConfig = {
  port: loadPort(),
  packagesRoot: path.normalize(`${__dirname}/../../../`),
  packages: {
    "~": {
      rootDirectory: "ui",
      includeDirectories: ["dist", "public"],
    },
    "common": {
      rootDirectory: "common",
      includeDirectories: ["dist"],
    },
  },
  routes: [],
  cors: {
    origin: "http://localhost:4242",
    allowedMethods: ["GET", "HEAD"],
    allowedHeaders: ["content-type", "authorization"],
  },
};

function loadPort() {
  if (process.env.PORT) {
    const port = parseInt(process.env.PORT);
    if (port < 1 || port > 65535) throw new Error("");
    return port;
  }
  return DEFAULT_PORT;
}

type ServerConfig = {
  port: number;
  packagesRoot: string;
  packages: {
    "~": Package;
    [key: string]: Package;
  };
  routes: string[];
  cors: CorsConfig;
};

type Package = {
  rootDirectory: string;
  includeDirectories: string[];
};

type CorsConfig = {
  origin: string;
  allowedMethods: string[];
  allowedHeaders: string[];
};

export default CONFIG;
