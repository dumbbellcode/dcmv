import { parseArgs } from "jsr:@std/cli@1.0.7/parse-args";
import type { Args } from "jsr:@std/cli@1.0.7/parse-args";
import { attemptToFindComposeFileInCurrentDir, exists } from "./utils/misc.ts";
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

    return parseArgs(args, {
      alias,
      boolean: booleanArgs,
      string: stringArgs,
      stopEarly: false,
      "--": true,
    });
  }

  public static printHelp(): void {
    console.log("Usage: dcmv [options]");
    console.log("Options:");
    console.log("  --help, -h        Print help");
    console.log("  --out             Move service outside docker");
    console.log("  --in              Move service inside docker");
    console.log("  --service, -s     Service name inside docker-compose.yml");
    console.log(
      "  --path, -p        Absolute path to docker-compose.yml if compose file doesn't exist in pwd",
    );
    // Examples
    console.log("Examples:");
    console.log("dcmv --out -s service1");
  }

  public static validate(flags: Args) {
    if (flags.path && !exists(flags.path)) {
      console.log(chalk.red(`\n Compose file ${flags.path} does not exist`));
      Deno.exit(0);
    }

    if (!flags.path) {
      const dcPath = attemptToFindComposeFileInCurrentDir();
      if (!dcPath) {
        console.log(
          chalk.red(
            `\n Compose file not found in current directory. Pass -p compose_file_path`,
          ),
        );
        Deno.exit(0);
      }
      flags.path = dcPath;
    }

    if (!flags.service) {
      console.log(
        chalk.red("\n Service name is required. Pass -s service_name"),
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
