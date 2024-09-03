# eDroplets
A web platform for the eDroplets project.

## Documentation

See the [GitBook](https://edrops-website.gitbook.io/edrops3/) (https://edrops-website.gitbook.io/edrops3/) for comprehensive documentation about the app.

## Environment Setup

### Prerequisites
- [NodeJS (v18)](https://nodejs.org/en/download/)
  - We require v18 for native fetch API support
  - It is suggested to use [nvm](https://github.com/nvm-sh/nvm) to manage your NodeJS versions
  - Note that if you are on Windows, you will need to use WSL or the [Windows Subsystem for Linux](https://docs.microsoft.com/en-us/windows/wsl/install-win10) to nvm, or you can check out [nvm-windows](https://github.com/coreybutler/nvm-windows)
- [Docker](https://www.docker.com/products/docker-desktop/)
  - Download Docker Desktop (comes with the docker daemon) for your OS to manage containerizations
  - This is used to run tools such as MySQL in an OS-agnostic fashion