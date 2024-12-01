import type { Container } from "./container.ts";
import type { AllEnvDiff } from "./types.ts";
import { prettyPrintAllEnvDiff } from "./utils/misc.ts";
import chalk from "chalk";

export class ContainerMovement {
  public getDiffsWhenMovedOut(
    targetService: Container,
    restServices: Container[],
  ): AllEnvDiff {
    const diffs: AllEnvDiff = {};

    restServices.forEach((s) => {
      diffs[s.name] = s.getEnvDiffWhenOtherContainerMovedOutside(targetService);
    });
    diffs[targetService.name] = targetService.getEnvDiffWhenMovedOutside(
      restServices,
    );
    return diffs;
  }

  public serviceMovedOut(
    targetService: Container,
    restServices: Container[],
  ) {
    const allServicesEnvDiff = this.getDiffsWhenMovedOut(
      targetService,
      restServices,
    );

    if (Object.values(allServicesEnvDiff).every((d) => !d.length)) {
      console.log(chalk.green("Nothing to update. Aborting !"));
      Deno.exit(0);
    }

    // pretty print env diff
    prettyPrintAllEnvDiff(allServicesEnvDiff);

    const shouldProceed = confirm("Do you want to proceed?");
    if (!shouldProceed) {
      console.log("Aborting...");
      Deno.exit(0);
    }
    // apply diff
    restServices.map((s) => {
      s.applyEnvDiffToEnvFile(allServicesEnvDiff[s.name]);
    });
    targetService.applyEnvDiffToEnvFile(allServicesEnvDiff[targetService.name]);

    console.log(
      chalk.green(
        ".env files were updated sucessfully !, you can now run the service outside docker",
      ),
    );
  }

  public getDiffsWhenMovedIn(
    targetService: Container,
    restServices: Container[],
  ): AllEnvDiff {
    const diffs: AllEnvDiff = {};

    restServices.forEach((s) => {
      diffs[s.name] = s.getEnvDiffWhenOtherContainerMovedInside(targetService);
    });
    diffs[targetService.name] = targetService.getEnvDiffWhenMovedInside(
      restServices,
    );

    return diffs;
  }

  public serviceMovedIn(
    targetService: Container,
    restServices: Container[],
  ) {
    const allServicesEnvDiff = this.getDiffsWhenMovedIn(
      targetService,
      restServices,
    );

    if (Object.values(allServicesEnvDiff).every((d) => !d.length)) {
      console.log(chalk.green("Nothing to update. Aborting !"));
      Deno.exit(0);
    }

    // pretty print env diff

    prettyPrintAllEnvDiff(allServicesEnvDiff);

    const shouldProceed = confirm("Do you want to proceed?");
    if (!shouldProceed) {
      console.log("Aborting...");
      Deno.exit(0);
    }

    // apply diff
    restServices.map((s) => {
      s.applyEnvDiffToEnvFile(allServicesEnvDiff[s.name]);
    });
    targetService.applyEnvDiffToEnvFile(allServicesEnvDiff[targetService.name]);

    console.log(
      chalk.green(
        ".env files were updated sucessfully !, you can now start the service inside docker",
      ),
    );
  }
}
