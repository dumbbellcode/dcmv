# dcmv

A CLI utility to update .env references to other containers when moving containers
inside/outside docker. 

`dcmv` is short for docker-compose move. 
`dcmv` is useful in case you need to run certain containers outside docker for faster debugging or for tooling reasons. 

## Usage
Run it in the directory which has your docker-compose file.

When running service named `service1` outside Docker, run:

```bash
dcmv --out --s service1
```

When running a service named `service2` inside Docker, which was initially being run from 
outside, run:

```bash
dcmv --in --s service2
```

## Installation (Deno)

```
deno install --global -A -f jsr:@dcode/dcmv
```

## Installation (Node)

```
npx jsr i @dcode/dcmv
```

## Install (binaries)

| Platform       | Download Link          |
|----------------|------------------------|
| Windows        | [Download Windows](https://github.com/sudheer121/dcmv/releases/download/v1.0.2/dcmv_win_x86_64.exe)  |
| macOS arm64    | [Download macOS](https://github.com/sudheer121/dcmv/releases/download/v1.0.2/dcmv_mac_arm64)    |
| Linux x86_64   | [Download Linux x86_64](https://github.com/sudheer121/dcmv/releases/download/v1.0.2/dcmv_linux_x86_64) |
| Linux arm64    | [Download Linux arm64](https://github.com/sudheer121/dcmv/releases/download/v1.0.2/dcmv_linux_arm64)  |

After installation change binary name to `dcmv` and add it to $PATH

## Features

- Automatically updates environment variables in `.env` files based on the
  service's new location (inside or outside Docker).
- Provides a preview of the changes to be made before applying them.
- Supports multiple services and their dependencies.



## Contributing

Contributions are welcome! If you'd like to contribute to this project, please
fork the repository, make your changes, and submit a pull request. Likewise, if you find any issues with the tool, feel free to raise an issue.

## License

This project is licensed under the MIT License.
