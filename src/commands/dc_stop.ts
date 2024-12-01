// write a deno command to stop a docker container using docker-compose stop

const command = (filePath: string, serviceName: string) =>
  new Deno.Command("docker-compose", {
    args: [
      "-f",
      filePath,
      "stop",
      serviceName,
    ],
    stdout: "piped",
    stderr: "piped",
  });

export function dockerComposeStop(filePath: string, serviceName: string) {
  const { stdout, stderr } = command(filePath, serviceName).outputSync();

  if (stderr) {
    // console.error(new TextDecoder().decode(stderr));
    return false;
  }

  console.log(new TextDecoder().decode(stdout));
  return true;
}
