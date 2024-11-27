import { InspectOutput } from "./InspectOutput.ts";

export class Service {
  private _internalPort: string;
  private _externalPort: string;
  private _mountPaths: string[];

  constructor(private _inspectOutput: InspectOutput, private _name: string) {
    const { internalPort, externalPort } = this._inspectOutput.getInternalAndExternalPorts();
    this._internalPort = internalPort;
    this._externalPort = externalPort;
    this._mountPaths = this._inspectOutput.getMountPaths();
  }
}
