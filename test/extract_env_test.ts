import { extractEnv } from "../src/extract_env.ts";

// test extractEnv
const envFilePath = new URL("./mocks/sample1.env", import.meta.url).pathname;
console.log(envFilePath);   
extractEnv(envFilePath);


// deno command to run test
// deno test --allow-read --allow-env test/extract_env.ts
