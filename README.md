# dcmv

A CLI utility to update .env references to other containers when moving containers
inside/outside docker. 

`dcmv` is short for docker-compose move. 
`dcmv` is useful in case you need to run certain containers outside docker for faster debugging or for tooling reasons. 

## Run from source

1. Make sure you have `Deno` installed on your system
2. Compile to native binary
```sh
deno run compile
```
3. Add to $PATH
```sh
mkdir -p $HOME/.dcmv
mv ./dcmv $HOME/.dcmv

# Replace ~/.zshrc with your profile: ~/.bashrc, ~/.profile, etc
echo 'export PATH="$PATH:$HOME/.dcmv"' >> ~/.zshrc
source ~/.zshrc
```

## Features

- Automatically updates environment variables in `.env` files based on the
  service's new location (inside or outside Docker).
- Provides a preview of the changes to be made before applying them.
- Supports multiple services and their dependencies.


## Usage Examples
Run it in the directory which has your docker-compose file.

To move a service named `service1` outside Docker, run:

```bash
dcmv --out --s service1
```

To move a service named `service2` inside Docker, run:

```bash
dcmv --in --s service2
```

## Contributing

Contributions are welcome! If you'd like to contribute to this project, please
fork the repository, make your changes, and submit a pull request. Likewise, if you find any issues with the tool, feel free to raise an issue.

## License

This project is licensed under the MIT License.
