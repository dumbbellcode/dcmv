import { parse } from "@std/dotenv";
import { isUrl } from "./utils/url.ts";
import type { EnvDiff } from "./types.ts";
import { EOL } from "node:os";

export class Container {
  public static ENV_FILE_NAME = ".env";
  public envObjects: Record<string, string> = {};

  constructor(
    public name: string,
    public internalPort: string, // target
    public externalPort: string, // published
    public mountPath: string | null,
  ) {
    const envFileText = this.getEnvFileText();
    if (envFileText) {
      this.envObjects = parse(envFileText);
    }
  }

  private getEnvFilePath(): string {
    return `${this.mountPath}/${Container.ENV_FILE_NAME}`;
  }

  private getEnvFileText(): string | null {
    if (!this.mountPath) {
      return null;
    }
    // return file, return null if not exists
    const path = this.getEnvFilePath();

    try {
      const file = Deno.readTextFileSync(path);
      return file;
    } catch (e) {
      if (!(e instanceof Deno.errors.NotFound)) {
        // console.error(e);
      }
      return null;
    }
  }

  public getEnvObjectsThatAreUrls(): Array<{ key: string; value: URL }> {
    return Object.entries(this.envObjects)
      .map(([key, value]) => {
        try {
          const url = new URL(value); // Attempt to create a URL
          return { key, value: url }; // Return the key and the URL object
        } catch {
          return null; // Return null if not a valid URL
        }
      })
      .filter((entry) => entry !== null); // Filter out null entries
  }

  // when current container moves outside
  public getEnvDiffWhenMovedOutside(containersInside: Container[]): EnvDiff[] {
    return this.getDiffWhenReplacingContainerHostToLocalHost(containersInside);
  }

  // when any other container moves outside
  public getEnvDiffWhenOtherContainerMovedOutside(
    otherContainer: Container,
  ): EnvDiff[] {
    return this.getDiffWhenReplacingContainerHostToLocalHost([otherContainer]);
  }

  public getEnvDiffWhenMovedInside(
    containersAlreadyInside: Container[],
  ): EnvDiff[] {
    return this.getDiffWhenReplacingLocalHostToContainerHost(
      containersAlreadyInside,
    );
  }

  public getEnvDiffWhenOtherContainerMovedInside(
    otherContainer: Container,
  ): EnvDiff[] {
    return this.getDiffWhenReplacingLocalHostToContainerHost([otherContainer]);
  }

  private getDiffWhenReplacingLocalHostToContainerHost(
    searchContainers: Container[],
  ) {
    const envDiff = [];
    for (const [key, value] of Object.entries(this.envObjects)) {
      if (!isUrl(value)) {
        continue;
      }
      const url = new URL(value);
      if (url.hostname !== "localhost") {
        continue;
      }
      const container = searchContainers.find((container) => {
        return container.externalPort === url.port;
      });
      if (!container) {
        continue;
      }
      url.hostname = container.name;
      url.port = container.internalPort;

      envDiff.push({
        key,
        oldValue: value,
        newValue: url.toString(),
      });
    }

    return envDiff;
  }

  private getDiffWhenReplacingContainerHostToLocalHost(
    searchContainers: Container[],
  ) {
    const envDiff = [];
    for (const [key, value] of Object.entries(this.envObjects)) {
      if (!isUrl(value)) {
        continue;
      }
      const url = new URL(value);
      const searchContainer = searchContainers.find((container) => {
        return container.name === url.hostname;
      });
      if (!searchContainer) {
        continue;
      }
      url.host = "localhost";
      url.port = searchContainer.externalPort;

      envDiff.push({
        key,
        oldValue: value,
        newValue: url.toString(),
      });
    }

    return envDiff;
  }

  applyEnvDiffToEnvFile(diff: EnvDiff[]) {
    let envText = this.getEnvFileText();
    if (!envText) {
      return;
    }

    const lines = envText.split(EOL);

    // Update the key-value pairs
    const updatedLines = lines.map((line) => {
      const [key, _value] = line.split("=");
      const match = diff.find((d) => d.key === key);
      if (match) {
        line = `${key}=${match.newValue}`;
      }
      return line;
    });

    envText = updatedLines.join(EOL);
    const path = this.getEnvFilePath();
    Deno.writeFileSync(path, new TextEncoder().encode(envText));
  }
}
