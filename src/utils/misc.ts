import type { AllEnvDiff, EnvDiff } from "../types.ts";
import chalk from "chalk";

export function prettyPrintAllEnvDiff(allEnvDiff: AllEnvDiff) {
  console.log("The following changes will take place");
  Object.entries(allEnvDiff).map(([serviceName, envDiff]) => {
    prettyPrintEnvDiff(serviceName, envDiff);
  });
}

export function prettyPrintEnvDiff(serviceName: string, envDiff: EnvDiff[]) {
  if (envDiff.length === 0) {
    return;
  }
  console.log(`\n${chalk.blue(serviceName)} : \n`);
  console.table(envDiff.map((diff) => {
    return {
      key: diff.key,
      old: diff.oldValue,
      new: diff.newValue,
    };
  }));
}

export function toNewKeyValues(envDiff: EnvDiff[]) {
  return envDiff.reduce((acc: Record<string, string>, curr: EnvDiff) => {
    acc[curr.key] = curr.newValue;
    return acc;
  }, {});
}

export function getFileThatExists(filePaths: string[]) {
  for (const filePath of filePaths) {
    if (exists(filePath)) {
      return filePath;
    }
  }
  return null;
}

export function exists(filePath: string) {
  try {
    Deno.statSync(filePath);
    return true;
  } catch (_error) {
    return false;
  }
}

export function attemptToFindComposeFileInCurrentDir() {
  const cwd = Deno.cwd();
  return getFileThatExists([
    `${cwd}/docker-compose.yml`,
    `${cwd}/docker-compose.yaml`,
  ]);
}