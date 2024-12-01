export interface EnvDiff {
  key: string;
  oldValue: string;
  newValue: string;
}

export interface AllEnvDiff {
  [service_name: string]: EnvDiff[];
}
