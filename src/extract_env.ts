import os from "node:os";
import { Service } from "./types.ts";

export function extractEnv(serviceName: string, path: string): void {
  const envFilePath = new URL(`${path}/.env`, import.meta.url).pathname;
  const envFile = Deno.readTextFileSync(envFilePath);
  
  const lines = envFile.split(os.EOL);
  for (const line of lines) {
    const [key, value] = line.split("=");
    console.log(`${key}=${value}`);
  }
}

export function modifyServiceEnv(service: string, path: string, targetService: string): void {
  /*
  psuedo code: 

  // service moved out 
  if(targetService === service) 
    change other service paths to localhost path
  else 
    change targetService path to localhost
  
  // service moved in
  if(targetService === service)
    change other service paths to 


  */
}