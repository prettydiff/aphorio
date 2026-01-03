
# Aphorio
A simple web based dashboard for the following features.

* Web Servers
  - Serves and proxies HTTP over WebSockets for both TCP and TLS
  - Server standup via small JSON configuration, which includes optional proxies and traffic redirection
  - Simple and yet more powerful file system navigation via web server
  - Servers include a *temporary* option to spin up servers with no state information
* Docker Compose container management
* OS Data dashboards:
  - Accounts for system and users
  - Network interfaces
  - Network sockets and ports
  - OS and hardware information
  - OS services
  - Processes
  - Storage hardware and partition data
* Provides remote shell access, via browser based dashboard, for a variety of shells executing on the server
* Graphical file system navigation for the server
* Network testing tools:
  - Forward and reverse DNS lookup for up to 11 record types
  - HTTP request tester with complete raw payload inspection for both requests and responses
  - WebSocket tester with raw frame header inspection/editing
  - Hash and Base64 tool

## Feature Management
Determine which features to exclude by simply setting a boolean value in the `features.json` file.

## Screenshots
* https://prettydiff.github.io/aphorio/screenshots/index.html

## Installation
1. Install [Node.js](https://nodejs.org/) version 24 or later.
2. Install [git](https://git-scm.com/)
3. Execute `git clone https://github.com/prettydiff/aphorio.git`
4. Execute `cd aphorio`
7. Run the application: `npm run server`.
6. Access the dashboard in a browser on the specified random port.

## Shell commands
* `npm run lint` - Executes ESLint for TypeScript to analyze the application against a bunch of draconian rules
* `npm run server` or `node ./lib/index.ts` - Executes the application
* `npm run test` or  `node ./lib/index.ts test` - Runs the test automation
* `npm run tsc` - Executes the TypeScript compiler to perform explicit type checking

Please note that for Docker support the `npm run server` command must be executed using an administrative account and/or shell.

### Supported shell command arguments
All arguments are supported only on the server command, example: `npm run server test no-color`

* `browser:<file_path>` - *This option is ignored unless in test mode.* Provides a custom file path for a web browser executable to test against. The file path value can be quoted, but if not quoted then spaces must be escaped according to the given shells syntax rules. Any arguments following this argument will be passed directly to that web browser.
* `list:<file_path>` - *This option is ignored unless in test mode.* Allows specifying a single test list to execute starting from the project's test directory at */lib/test*.
* `no-color` - Eliminates use of ANSI color codes in terminal output.
* `no-exit` - *This option is ignored unless in test mode.* Application remains actively available after completing test automation.

## Tested Platforms
* Debian Linux 13
* Windows 11

## Dependencies
The external dependencies need to be installed and added to the system path, but require no further configuration.  The included dependencies require no action or configuration at all.

### External Dependencies
These dependencies must be installed separate from this application.

* [Node.js](https://github.com)
   * License - MIT
   * Description - a command line JavaScript/TypeScript code interpreter and runtime.
   * This application requires version 24.2.0 or greater.
* [OpenSSL 3](https://openssl-library.org/)
   * License - Apache
   * Description - a library for certificate generation, encryption, hashing, and other cryptography
   * Installation
      * Windows - `winget install --id=ShiningLight.OpenSSL.Dev -e`
      * Linux (Debian) - `sudo apt install openssl`
* [Docker and Docker Compose](https://www.docker.com/) (Optional for Docker support)
   * License - Apache
   * Description - Docker allows execution of application containers and Docker Compose provides configuration with a simple text format
   * Installation
      * Windows
      ```
      winget install --id=Docker.DockerCLI -e
      winget install --id=Docker.DockerCompose -e
      ```
      * Linux (Debian)
      ```
      sudo apt-get update
      sudo apt-get install ca-certificates curl
      sudo install -m 0755 -d /etc/apt/keyrings
      sudo curl -fsSL https://download.docker.com/linux/debian/gpg -o /etc/apt/keyrings/docker.asc
      sudo chmod a+r /etc/apt/keyrings/docker.asc
      echo "deb \
          [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] \
          https://download.docker.com/linux/debian \
          $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
          sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
      sudo apt-get update
      sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
      ```

### Included Dependencies
These dependencies are included with this application code repository.

* [@lydell/node-pty<](https://www.npmjs.com/package/@lydell/node-pty)
   * [GitHub](https://github.com/lydell/node-pty)">
   * License - MIT
   * Description - the binaries powering XTERM emulation for the UI terminal
* [@xterm/xterm](https://www.npmjs.com/package/@xterm/xterm)
   * [GitHub](https://github.com/xtermjs/xterm.js)
   * License - MIT
   * Description - the actual browser code for the UI terminal
* [chart.js](https://www.npmjs.com/package/chart.js)
   * [GitHub](https://github.com/chartjs/Chart.js)
   * License - MIT
   * Description - the library that creates the statistics charts
* [@kurkle/color](https://www.npmjs.com/package/@kurkle/color), dependency of Chart.js
   * [GitHub](https://github.com/kurkle/color)
   * License - MIT
   * Description - a dependency of charts.js library
* [file for win32](https://gnuwin32.sourceforge.net/packages/file.htm)
   * License - BSD 2-2clause
   * Description - allows execution of the Unix file utility on Windows
* [jschardet](https://www.npmjs.com/package/jschardet)
   * [GitHub](https://github.com/aadsm/jschardet)
   * License - GPLv2.1
   * Description - a fall back to discover text encoding of files