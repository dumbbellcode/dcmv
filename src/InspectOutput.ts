import type { InspectOutputData } from "./types.ts";

export class InspectOutput {
  constructor(private _inspectOutput: InspectOutputData) {
  }

  getMountPaths(): string[] {
    return this._inspectOutput.Mounts.map((mount) => mount.Source);
  }

  getInternalAndExternalPorts(): { internalPort: string, externalPort: string } {
    const portBindings = this._inspectOutput.HostConfig.PortBindings;
    const internalPort = Object.keys(portBindings)[0].split("/")[0];
    const externalPort = portBindings[internalPort][0].HostPort;
    return { internalPort: internalPort, externalPort: externalPort };
  }
}
