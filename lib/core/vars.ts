

/* cspell: words appdata, atupn, cputime, lslogins, pwsh, serv, stcp, sudp, volu */

const vars:core_vars = {
        // critical shell commands by operating system
        commands: (function utilities_vars_commands():os_vars {
            const os_vars:os_var_list = {
                "linux": {
                    admin_check: "id -u", // true if it returns "0"
                    compose: "docker compose",
                    compose_empty: "",
                    devs: "lspci -v -k",
                    disk: "lsblk -Ob --json",
                    file: "",
                    open: "xdg-open",
                    part: "",
                    proc: "ps -eo pid,cputime,rss,user,comm= | tail -n +2 | tr -s \" \" \",\"",
                    serv: "systemctl list-units --type=service --all --output json",
                    stcp: "ss -atupn | tail -n +2 | tr -s \" \" \",\"",
                    sudp: "",
                    user: "lslogins -o user,uid,proc,last-login --time-format iso | tail -n +2 | tr -s \" \" \",\"",
                    volu: ""

                },
                "win32": {
                    admin_check: "([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)", // return a string "true" or "false" value
                    compose: "docker-compose",
                    compose_empty: "",
                    devs: "Get-PNPDevice | ConvertTo-json",
                    disk: "Get-Disk | ConvertTo-JSON -compress -depth 2",
                    file: "",
                    open: "start",
                    part: "Get-Partition | ConvertTo-JSON -compress -depth 2",
                    proc: "Get-Process -IncludeUserName | Select-Object id, cpu, pm, name, username | ConvertTo-JSON -compress -depth 1",
                    serv: "Get-Service | ConvertTo-JSON -compress -depth 2",
                    stcp: "Get-NetTCPConnection | Select-Object LocalAddress, LocalPort, RemoteAddress, RemotePort, OwningProcess | ConvertTo-JSON -compress -depth 2",
                    sudp: "Get-NetUDPEndpoint | Select-Object LocalAddress, LocalPort, OwningProcess | ConvertTo-JSON -compress -depth 2",
                    user: "Get-LocalUser | ConvertTo-JSON -compress -depth 1",
                    volu: "Get-Volume | ConvertTo-JSON -compress -depth 2"
                }
            };
            return os_vars[process.platform];
        }()),
        // properties related to docker and docker compose
        compose: {
            // docker image details and compose files
            containers: {},
            // whether the application believes docker and docker compose are executing as an OS service
            status: null,
            // time of last update
            time: 0,
            // docker compose environmental variables
            variables: {}
        },
        // fractions of lib/dashboard/styles.css
        css: {
            // less css for system generated web pages on web servers
            basic: "",
            // more complete css for the dashboard
            complete: ""
        },
        environment: {
            // the web server id that is the dashboard's web server
            dashboard_id: "",
            // the fully assembled dashboard HTML after dynamic changes during build time with css and JavaScript included
            dashboard_page: "",
            // last git commit date/time
            date_commit: 0,
            // supported features of this running instance
            features: {
                "application-logs": true,
                "compose-containers": true,
                "devices": true,
                "disks": true,
                "dns-query": true,
                "file-system": true,
                "hash": true,
                "interfaces": true,
                "os-machine": true,
                "ports-application": true,
                "processes": true,
                "servers-web": true,
                "services": true,
                "sockets-application-tcp": true,
                "sockets-application-udp": true,
                "sockets-os-tcp": true,
                "sockets-os-udp": true,
                "statistics": true,
                "terminal": true,
                "test-http": true,
                "test-websocket": true,
                "udp-socket": true,
                "users": true
            },
            // whether linux "file" command is available in the OS system path
            file: false,
            // last git commit hash
            hash: "",
            // list of supported hash algorithm names
            hashes: [],
            // the HTTP request header of the dashboard page request, used as a default value for the dashboard's http test tool
            http_request: "",
            // a list of local network addresses as determined from active network interfaces on the OS
            interfaces: [
                "localhost",
                "127.0.0.1",
                "::1",
                "[::1]"
            ],
            // a store of objects representing a log entry
            logs: [],
            // this application's name
            name: "aphorio",
            // the earliest recorded time this application starts
            start_time: process.hrtime.bigint(),
            // the file system paths of locally available command shells
            terminal: (process.platform === "win32")
                ? [
                    "C:\\Program Files\\PowerShell\\7\\pwsh.exe",
                    "C:\\Program Files\\PowerShell\\7-preview\\pwsh.exe",
                    "C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe",
                    "C:\\Windows\\System32\\cmd.exe",
                    "C:\\Program Files\\Git\\bin\\bash.exe",
                    "C:\\Program Files (x86)\\Git\\bin\\bash.exe"
                ]
                : [],
            // the amount of time required to covert local time to UTC time
            timeZone_offset: 0,
            version: "0.0.0"
        },
        // command line options for running this application
        options: {
            "browser": null,
            "list": null,
            "no-color": false,
            "no-exit": false,
            "test": false
        },
        // raw OS data
        os: {
            devs: {
                data: [],
                time: 0
            },
            disk: {
                data: [],
                time: 0
            },
            intr: {
                data: null,
                time: 0
            },
            machine: {
                cpu: {
                    arch: "",
                    cores: 0,
                    endianness: "",
                    frequency: 0,
                    name: ""
                },
                memory: {
                    free: 0,
                    total: 0
                }
            },
            os: {
                env: {},
                hostname: "",
                name: "",
                path: [],
                platform: "",
                release: "",
                type: "",
                uptime: 0
            },
            proc: {
                data: [],
                time: 0
            },
            process: {
                admin: false,
                arch: "",
                argv: [],
                cpuSystem: 0,
                cpuUser: 0,
                cwd: "",
                memory: {
                    external: 0,
                    rss: 0,
                    V8: 0
                },
                pid: 0,
                platform: "",
                ppid: 0,
                uptime: 0,
                versions: {}
            },
            serv: {
                data: [],
                time: 0
            },
            stcp: {
                data: [],
                time: 0
            },
            sudp: {
                data: [],
                time: 0
            },
            time: 0,
            user: {
                data: [],
                time: 0
            },
            user_account: {
                gid: 0,
                homedir: "",
                uid: 0
            }
        },
        // commonly used file system path addresses that are validated at start up
        path: {
            cgroup: "",
            compose: "",
            compose_empty: "",
            node: "",
            process: "",
            project: "",
            sep: "/",
            servers: ""
        },
        // objects describing web servers and contains objects describing their sockets
        servers: {},
        // the actual web server objects and their actual socket objects
        server_meta: {},
        // the list of objects describing sockets connected to this application
        sockets: {
            tcp: [],
            time: 0,
            udp: []
        },
        // an information store necessary for calculating this application's portion of the OS performance statistics
        stats: {
            children: 1,
            containers: {},
            duration: 0,
            frequency: 20000,
            net_in: 0,
            net_out: 0,
            now: 0,
            records: 10
        },
        // data properties necessary for executing test automation
        test: {
            browser_args: [],
            browser_child: null,
            browser_start: false,
            counts: {},
            index: 0,
            list: null,
            magicString: "AW#E$RF1SA9DFY^HDfg4hw5se45tDA234",
            store: null,
            test_browser: null,
            testing: false,
            total_assertions: 0,
            total_assertions_fail: 0,
            total_lists: 0,
            total_tests: 0,
            total_tests_fail: 0,
            total_tests_skipped: 0,
            total_time_end: 0n,
            total_time_start: 0n
        },
        // ASCII text decoration for terminal emulators
        text: {
            angry    : "\u001b[1m\u001b[31m",
            blue     : "\u001b[34m",
            bold     : "\u001b[1m",
            boldLine : "\u001b[1m\u001b[4m",
            clear    : "\u001b[24m\u001b[22m",
            cyan     : "\u001b[36m",
            green    : "\u001b[32m",
            noColor  : "\u001b[39m",
            none     : "\u001b[0m",
            purple   : "\u001b[35m",
            red      : "\u001b[31m",
            underline: "\u001b[4m",
            yellow   : "\u001b[33m"
        },
        // stores UDP sockets
        udp: []
    };

export default vars;