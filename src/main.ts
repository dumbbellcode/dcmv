import { Container } from "./container.ts";
import { getDockerComposeConfig } from "./commands/get_dc_config.ts";
import { ContainerMovement } from "./container_movement.ts";
import { Arguments } from "./args.ts";
import { getFileThatExists } from "./utils/misc.ts";

function main(): void {
  const flags = Arguments.parse(Deno.args);
  if (flags.help) {
    Arguments.printHelp();
    return;
  }

  Arguments.validate(flags);

  let composePath = flags.path;
  if (!composePath) {
    const cwd = Deno.cwd();
    composePath = getFileThatExists([
      `${cwd}/docker-compose.yml`,
      `${cwd}/docker-compose.yaml`,
    ]);
  }

  if (!composePath) {
    console.error(
      "docker-compose.yml not found in current directory, please pass it's path using --path argument",
    );
    return;
  }

  const targetService = flags.service;
  const containers: Container[] = (getDockerComposeConfig(composePath))
    .getContainers();

  const targetContainer = containers.find((container) =>
    container.name === targetService
  );

  if (!targetContainer) {
    console.error(`Service ${targetService} not found in docker-compose`);
    return;
  }

  const restContainers = containers.filter((container) =>
    container.name !== targetService
  );

  const movement = new ContainerMovement();
  if (flags.out) {
    movement.serviceMovedOut(targetContainer, restContainers);
  }
  if (flags.in) {
    movement.serviceMovedIn(targetContainer, restContainers);
  }
}

/**
 * Run CLI.
 */
main();
