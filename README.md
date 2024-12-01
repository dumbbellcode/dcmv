# Run the code

```bash
deno run --env-file .env -A src/main.ts
```

# Docker Service Migration Utility

A utility to simplify the process of moving services in and out of Docker
containers. This tool helps in updating environment variables in `.env` files to
ensure a smooth transition between environments.

## Features

- Automatically updates environment variables in `.env` files based on the
  service's new location (inside or outside Docker).
- Provides a preview of the changes to be made before applying them.
- Supports multiple services and their dependencies.

## Usage

To use this utility, run the following command in your terminal:

```bash
deno run -A src/main.ts
```

This will start the utility and guide you through the process of moving services
in or out of Docker containers.

## Options

The utility accepts the following options:

- `--out` or `-o`: Move the service outside Docker.
- `--in` or `-i`: Move the service inside Docker.
- `--service` or `-s`: Specify the service name to be moved.
- `--help` or `-h`: Display help and exit.

## Examples

To move a service named `service1` outside Docker, run:

```bash
deno run src/main.ts --out --s service1
```

To move a service named `service2` inside Docker, run:

```bash
deno run src/main.ts --in --s service2
```

## Contributing

Contributions are welcome! If you'd like to contribute to this project, please
fork the repository, make your changes, and submit a pull request.

## License

This project is licensed under the MIT License.
