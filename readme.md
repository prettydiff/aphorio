
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
