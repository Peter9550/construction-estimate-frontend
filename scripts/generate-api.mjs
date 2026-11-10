import { resolve } from "path";

import { generateApi } from "swagger-typescript-api";

generateApi({
  fileName: "Api.ts",
  output: resolve(process.cwd(), "./src/api"),
  url: "http://localhost:8000/openapi.json",
  httpClientType: "axios",
  moduleNameIndex: 1,
});
