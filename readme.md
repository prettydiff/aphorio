# Web Server
A simple web based dashboard for the following features.

* Web Servers
  - Serves and proxies HTTP over WebSockets for both TCP and TLS
  - Server standup via small JSON configuration, which includes optional proxies and traffic redirection
  - Simple and yet more powerful file system navigation via web server
  - Servers include an optional *temporary* option to spin up servers with no state information
* Provides primitive docker container management for Docker Compose files
* Provides server management data for:
  - Accounts for system and users
  - Network interfaces
  - Network sockets and ports
  - OS and hardware information
  - OS services
  - Processes
  - Storage hardware and partition data
* Provides remote shell access for a variety of shells executing on the server
* Graphical file system navigation for the server
* Provides various network testing tools:
  - Forward and reverse DNS lookup for up to 11 record types
  - HTTP request tester with complete raw payload inspection for both requests and responses
  - WebSocket tester with raw frame header inspection/editing
  - Hash and Base64 tool

## Installation
1. Install [Node.js](https://nodejs.org/)
2. Install [git](https://git-scm.com/)
3. Execute `git clone https://github.com/prettydiff/webserver.git`
4. Execute `cd webserver`
5. Execute `node install.js`
7. Run the application: `npm run server`.
6. Access the dashboard in a browser on the specified random port.

## Shell commands
* `npm run server` - Executes the application
* `npm run server-no-color` - Executes the application without ANSI control characters to color output to the shell
* `npm run tsc` - Executes the TypeScript compiler to perform explicit type checking
* `npm run lint` - Executes ESLint for TypeScript to analyze the application against a bunch of draconian rules

<!--
## Optional steps to reduce the dependency count to 3:
1. Delete the `node_modules` directory.
2. Delete the `devDependencies` object from the file `package.json`.
3. Execute `npm install`.
4. Restart the application with `npm run server` or your favorite OS service management tool.
-->
