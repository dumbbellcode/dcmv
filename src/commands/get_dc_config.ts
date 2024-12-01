import { DockerComposeConfig } from "../dc_config.ts";

const command = (filePath: string) =>
  new Deno.Command("docker-compose", {
    args: [
      "-f",
      filePath,
      "config",
      "--format",
      "json",
    ],
    stdout: "piped",
    stderr: "piped",
  });

export function getDockerComposeConfig(
  composeFilePath: string,
): DockerComposeConfig {
  console.log("Reading docker-compose.yml file", composeFilePath);
  const { stdout, stderr } = command(composeFilePath).outputSync();

  if (stderr) {
    console.error(new TextDecoder().decode(stderr));
  }

  const output = new TextDecoder().decode(stdout);
  return new DockerComposeConfig(JSON.parse(output));
}
