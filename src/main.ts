import type { Container } from "./container.ts";
import { getDockerComposeConfig } from "./commands/get_dc_config.ts";
import { ContainerMovement } from "./container_movement.ts";
import { Arguments } from "./args.ts";
import chalk from "chalk";

function main(): void {
  const flags = Arguments.parse(Deno.args);
  if (flags.help) {
    Arguments.printHelp();
    return;
  }
  if (flags.version) {
    Arguments.printVersion();
    return;
  }

  Arguments.validate(flags);

  const composePath = flags.path;
  const targetService = flags.service;
  const containers: Container[] = (getDockerComposeConfig(composePath))
    .getContainers();

  const targetContainer = containers.find((container) =>
    container.name === targetService
  );

  if (!targetContainer) {
    console.error(
      chalk.red(`\n Service ${targetService} not found in docker-compose`),
    );
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
