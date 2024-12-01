import { parseArgs } from "jsr:@std/cli@1.0.7/parse-args";
import type { Args } from "jsr:@std/cli@1.0.7/parse-args";
import { attemptToFindComposeFileInCurrentDir, exists } from "./utils/misc.ts";
import chalk from "chalk";
const VERSION = '1.0.1';

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
      "version": "v",
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
    console.log(`${chalk.blue('Usage:')} dcmv [options]`);
    console.log(chalk.blue("\nOptions:"));
    console.log("  --help, -h        Print help");
    console.log("  --out             Move service outside docker");
    console.log("  --in              Move service inside docker");
    console.log("  --service, -s     Service name inside docker-compose.yml");
    console.log(
      "  --path, -p        Absolute path to docker-compose.yml if compose file doesn't exist in pwd",
    );
    // Examples
    console.log(chalk.blue("\nExamples:"));
    console.log("dcmv --out -s service1");
  }

  public static printVersion(): void {
    console.log(`${chalk.blue('Version:')} ${chalk.green(VERSION)} \n`);
  }

  public static validate(flags: Args) {
    // publish version if no argument passed
    if (Deno.args.length === 0) {
      Arguments.printVersion();
      Arguments.printHelp();
      Deno.exit(0);
    }

    if (flags.path && !exists(flags.path)) {
      console.log(chalk.red(`\n Compose file ${flags.path} does not exist`));
      Deno.exit(0);
    }

    if (!flags.path) {
      const dcPath = attemptToFindComposeFileInCurrentDir();
      if (!dcPath) {
        console.log(
          chalk.red(
            `\n docker_compose.yml file not found in current directory. Pass -p compose_file_path`,
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
