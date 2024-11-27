import type { Args } from "https://deno.land/std@0.200.0/flags/mod.ts";
import { parse } from "https://deno.land/std@0.200.0/flags/mod.ts";

export class Arguments {
  public static parse(args: string[]): Args {
    const booleanArgs = [
      "in",
      "out",
    ]
    // All string arguments
    const stringArgs = [
      "service",
    ];
  
    // And a list of aliases
    const alias = {
      "help": "h",
      "service": "s",
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
    console.log("Usage: deno run main.ts [options]");
    console.log("Options:");
    console.log("  --out, -o         Move service outside docker");
    console.log("  --in, -i          Move service inside docker");
    console.log("  --service, -s     Service name inside docker-compose.yml");
  }
}
