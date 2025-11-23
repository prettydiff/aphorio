

/* cspell: words appdata, atupn, cputime, lslogins, pwsh, serv, volu */

const vars:core_vars = {
        commands: (function utilities_vars_commands():os_vars {
            const os_vars:os_var_list = {
                "linux": {
                    admin_check: "id -u", // true if it returns "0"
                    compose: "docker compose",
                    compose_empty: "",
                    devs: "lspci -v -k",
                    disk: "lsblk -Ob --json",
                    open: "xdg-open",
                    part: "",
                    proc: "ps -eo pid,cputime,rss,user,comm= | tail -n +2 | tr -s \" \" \",\"",
                    serv: "systemctl list-units --type=service --all --output json",
                    socT: "ss -atupn | tail -n +2 | tr -s \" \" \",\"",
                    socU: "",
                    user: "lslogins -o user,uid,proc,last-login --time-format iso | tail -n +2 | tr -s \" \" \",\"",
                    volu: ""

                },
                "win32": {
                    admin_check: "([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)", // return a string "true" or "false" value
                    compose: "docker-compose",
                    compose_empty: "",
                    devs: "Get-PNPDevice | ConvertTo-json",
                    disk: "Get-Disk | ConvertTo-JSON -compress -depth 2",
                    open: "start",
                    part: "Get-Partition | ConvertTo-JSON -compress -depth 2",
                    proc: "Get-Process -IncludeUserName | Select-Object id, cpu, pm, name, username | ConvertTo-JSON -compress -depth 1",
                    serv: "Get-Service | ConvertTo-JSON -compress -depth 2",
                    socT: "Get-NetTCPConnection | Select-Object LocalAddress, LocalPort, RemoteAddress, RemotePort, OwningProcess | ConvertTo-JSON -compress -depth 2",
                    socU: "Get-NetUDPEndpoint | Select-Object LocalAddress, LocalPort, OwningProcess | ConvertTo-JSON -compress -depth 2",
                    user: "Get-LocalUser | ConvertTo-JSON -compress -depth 1",
                    volu: "Get-Volume | ConvertTo-JSON -compress -depth 2"
                }
            };
            return os_vars[process.platform];
        }()),
        compose: {
            containers: {},
            status: "",
            time: 0,
            variables: {}
        },
        css: {
            basic: "",
            complete: ""
        },
        dashboard_id: "",
        dashboard_page: "",
        environment: {
            date_commit: 0,
            hash: ""
        },
        hashes: [],
        http_request: "",
        interfaces: [
            "localhost",
            "127.0.0.1",
            "::1",
            "[::1]"
        ],
        intervals: {
            compose: 0
        },
        logs: [],
        name: "aphorio",
        options: {
            "browser": null,
            "list": null,
            "no-color": false,
            "no-exit": false,
            "no-terminal": false,
            "test": false
        },
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
            sock: {
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
        path: {
            compose: "",
            compose_empty: "",
            node: "",
            process: "",
            project: "",
            sep: "/",
            servers: ""
        },
        servers: {},
        server_meta: {},
        sockets: {
            list: [],
            time: 0
        },
        start_time: process.hrtime.bigint(),
        stats: {
            children: 1,
            net_in: 0,
            net_out: 0
        },
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
        timeZone_offset: 0
    };

export default vars;