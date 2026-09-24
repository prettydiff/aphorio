
<!-- cspell: words buildx, containerd, dpkg, keyrings, kurkle, winget -->

# Aphorio
Like Windows Task Manager, but also works on Linux and displays web servers, docker containers, and more.

* Web Servers
  - Serves and proxies HTTP over WebSockets for both TCP and TLS
  - Server standup via small JSON configuration, which includes optional proxies and traffic redirection
  - Simple and yet more powerful file system navigation via web server
  - Servers include a *temporary* option to spin up servers with no state information
  - Servers support mutual TLS (mTLS) for secure access by trusted certificate
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
1. Install one of
   * [Node.js](https://nodejs.org/) version 25 or later.
   * [bun](https://bun.com/)
2. Install [git](https://git-scm.com/)
3. Execute `git clone https://github.com/prettydiff/aphorio.git`
4. Run the application with any of:
   * Node.js - `node ./aphorio/lib/index.ts`
   * bun - `bun ./aphorio/lib/index.ts`
5. Access the dashboard in a browser on the specified random port.

## Nerd Stuff
### Shell commands
* `npm run lint` - Executes ESLint for TypeScript to analyze the application against a bunch of custom draconian rules. This option is not available by default, and requires use of these steps:
   1. Rename `package.json` to `package_x.json`.
   1. Rename `package_dev.json` to `package.json`.
   1. Execute `npm install` from the project directory.
   1. Execute `npm run lint`.
   1. Provide any suggested code changes and execute `npm run lint` as needed.
   1. Rename `package.json` to `package_dev.json`.
   1. Rename `package_x.json` to `package.json`.
   1. Execute `npm install`.
   1. Execute `git checkout node_modules/file`.
   1. Execute `git checkout node_modules/@lydell`.
* `npm run server-bun` or `bun ./lib/index.ts` - Executes the application with bun
* `npm run server-node` or `node ./lib/index.ts` - Executes the application with Node.js
* `npm run test-bun` or  `bun ./lib/index.ts test` - Runs the test automation with bun
* `npm run test-node` or  `node ./lib/index.ts test` - Runs the test automation with Node.js
* `npm run tsc` - Executes the TypeScript compiler to perform explicit type checking

Please note that for Docker support the `npm run server` command must be executed using an administrative account and/or shell.

#### Supported shell command arguments
All arguments are supported only on the server command, example: `npm run server test no-color`

##### Execution Modes
* `certificate <server_id>` - Generates new certificate files for the specified server id. *Warning: Use of this option will reset the certificate paths in the server's configuration to the default values.*
* `demo`                    - Runs the application in demo mode where some functionality is disabled and no changes are written to disk.
* `test`                    - Instructs the application to execute test automation.

##### Test Options
* `browser:<file_path>`      - Provides for an absolute file path for a web browser executable to test against.
                               The file path value can be quoted, but if not quoted then spaces must be escaped according to the given shell's syntax rules.
                               Any arguments following this argument will be passed directly to that web browser.
* `delay-intervals:<number>` - A delay test will halt the test runner until the given test evaluates to true by default.
                               The default delay values retry the test 250 times every 50 milliseconds before returning a failed test.
                               This argument allows changing the number of retries.
* `delay-time:<number>`      - Specifies the time between delay intervals in milliseconds from the default 50 milliseconds.
* `list:<file_name>`         - Specifies a single test list file name to execute starting from the project's test directory at */lib/test*.
* `no-exit`                  - Application remains actively available after completing test automation.
* `stop-on-fail`             - Tells the test runner to stop processing further test lists after the first failed assertion.

##### General Use Options
* `no-color`                  - Eliminates use of ANSI color codes in terminal output.
* `port-open:<port_number>`   - Creates an insecure instance of the dashboard server on the specified insecure port, if that port is open.
* `port-secure:<port_number>` - Creates a secure instance of the dashboard server on the specified insecure port, if that port is open.

#### Run Time Examples
* `npm run server-bun`
* `npm run server-node`
* `npm run test-node "browser:C:\Program Files\Mozilla Firefox\firefox.exe" "list:list_local_browser_fileSystem.ts" no-exit no-color`
* `node lib\index.ts certificate 1234abcdef`
* `npm run server-bun certificate 1234abcdef`
* `sudo /home/user_id/.nvm/versions/node/v26.7.0/bin/node /home/user_id/aphorio/lib/index.ts no-color`

### Tested Platforms
* Debian Linux 13
* Windows 11

### Dependencies
The external dependencies need to be installed and added to the system path, but require no further configuration.  The included dependencies require no action or configuration at all.

#### External Dependencies
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

#### Included Dependencies
These dependencies are included with this application code repository.

* [@lydell/node-pty](https://www.npmjs.com/package/@lydell/node-pty)
   * [GitHub](https://github.com/lydell/node-pty)
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