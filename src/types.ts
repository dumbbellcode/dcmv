export interface Service {
  name: string;
  mountSourceDirs: string[];
  internalPort: string;
  externalPort: string;
}

export interface InspectOutputData {
  Mounts: Mount[];
  HostConfig: HostConfig;
}

// docker-compose output types
export interface Mount {
  Type: string;
  Source: string;
  Target: string;
}

export interface HostConfig {
  PortBindings: PortBindings;
}
export interface PortBindings {
  [key: string]: PortBinding[];
}
export interface PortBinding {
  HostPort: string;
}
