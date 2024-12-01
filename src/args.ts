import type { Args } from "https://deno.land/std@0.200.0/flags/mod.ts";
import { parse } from "https://deno.land/std@0.200.0/flags/mod.ts";
import { exists } from "./utils/misc.ts";
import chalk from "chalk";

export class Arguments {
  public static parse(args: string[]): Args {
    const booleanArgs = [
      "in",
      "out",
    ];
    // All string arguments
    const stringArgs = [
      "service",
      "path",
    ];

    // And a list of aliases
    const alias = {
      "help": "h",
      "service": "s",
      "path": "p",
    };

    return parse(args, {
      alias,
      boolean: booleanArgs,
      string: stringArgs,
      stopEarly: false,
      "--": true,
    });
  }

  public static printHelp(): void {
    console.log("Usage: deno run src/main.ts [options]");
    console.log("Options:");
    console.log("  --help, -h        Print help");
    console.log("  --out, -o         Move service outside docker");
    console.log("  --in, -i          Move service inside docker");
    console.log("  --service, -s     Service name inside docker-compose.yml");
    // Examples
    console.log("Examples:");
    console.log("deno run src/main.ts --out --s service1");
  }

  public static validate(flags: Args) {
    if (flags.path && !exists(flags.path)) {
      console.log(chalk.red(`\n Compose file ${flags.path} does not exist`));
      Deno.exit(0);
    }

    if (!flags.service) {
      console.log(
        chalk.red("\n Service name is required. Pass --s service_name"),
      );
      Deno.exit(0);
    }

    if (!flags.in && !flags.out) {
      console.log(chalk.red("\n Either --in or --out is required"));
      Deno.exit(0);
    }

    if (flags.in && flags.out) {
      console.log(chalk.red("\n Only one of --in or --out is allowed"));
      Deno.exit(0);
    }
  }
}
