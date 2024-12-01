import { Container } from "./container.ts";

export class DockerComposeConfig {
  constructor(private _store: Store) {
  }

  public getServices(): string[] {
    return Object.keys(this._store.services);
  }

  public getContainers(): Container[] {
    const containers: Container[] = [];
    for (const [serviceName, service] of Object.entries(this._store.services)) {
      /**
       * Note: Ensure that first volume contains the path of the project
       */
      const volume = service?.volumes?.find((v) => v.type === "bind") ?? null;
      const container = new Container(
        serviceName,
        service.ports[0].target.toString(),
        service.ports[0].published,
        volume?.source ?? null,
      );
      containers.push(container);
    }
    return containers;
  }
}

interface Store extends Record<string, unknown> {
  name: string;
  services: {
    [name: string]: Service;
  };
}

interface Service extends Record<string, unknown> {
  ports: Port[];
  volumes?: Volume[];
}

interface Port {
  mode: string;
  target: number;
  published: string;
  protocol: string;
}

interface Volume {
  type: string;
  source: string;
  target: string;
}
