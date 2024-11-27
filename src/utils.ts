import type { PortBindings } from "./types.ts";

export function getInternalAndExternalPorts(portBindings: PortBindings): { internal: string, external: string } {
  const internalPort = Object.keys(portBindings)[0].split("/")[0];
  const externalPort = portBindings[internalPort][0].HostPort;
  return { internal: internalPort, external: externalPort };
}

export function isUrl(value: string): boolean {
  // of format scheme://username:password@host:port/path?query#fragment
  return URL.canParse(value);
}

export function isLocalhostUrl(value: string): boolean {
  return value.startsWith("http://localhost") || value.startsWith("https://localhost");
}

export function extractServiceName(url: string): string {
  return url.split(":")[0].split("/")[1];
}
