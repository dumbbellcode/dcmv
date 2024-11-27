import { InspectOutputData, Service } from "./types.ts";
import { InspectOutput } from "./InspectOutput.ts";
import { Arguments } from "./Arguments.ts";

const services: Service[] = [];
function main(): void {

  const flags = Arguments.parse(Deno.args);
  if (flags.help) {
    Arguments.printHelp();
    return;
  }
  // run a shell script
  const command = new Deno.Command("bash", {
    args: ["extract-paths.sh"],
    stdout: "piped",
    stderr: "piped",
  });
  const { stdout, stderr } = command.outputSync();
  const result = new TextDecoder().decode(stdout);
  if (stderr) {
    console.error(new TextDecoder().decode(stderr));
  }
  console.log(identifyServicesAndPaths("./mounts"));
}

function identifyServicesAndPaths(mountsDirPath: string): void {
  const mountsDir = Deno.readDirSync(mountsDirPath);
  for (const mount of mountsDir) {
    console.log(mount.name);

    // read file content as JSON
    const fileContent = Deno.readTextFileSync(`${mountsDirPath}/${mount.name}`);
    const jsonContent: InspectOutputData = JSON.parse(fileContent);
    const inspectOutput = new InspectOutput(jsonContent);
    const moundDirs = inspectOutput.getMountPaths();
    const { internalPort, externalPort } = inspectOutput.getInternalAndExternalPorts();
    services.push({ name: mount.name, mountSourceDirs: moundDirs, internalPort, externalPort });
  }
}


/**
 * Run CLI.
 */
main();

