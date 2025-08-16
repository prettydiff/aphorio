
import node from "./node.ts";

/* cspell: words appdata, cputime, lslogins, pwsh, serv, volu */

const win32:boolean = (process.platform === "win32"),
    gid:number = (typeof process.getgid === "undefined")
        ? 0
        : process.getgid(),
    uid:number = (typeof process.getuid === "undefined")
        ? 0
        : process.getuid(),
    vars:vars = {
        commands: {
            compose: (process.platform === "win32")
                ? "docker-compose"
                : "docker",
            docker: "docker",
            disk: (win32 === true)
                ? "Get-Disk | ConvertTo-JSON -compress -depth 2"
                : "lsblk -Ob --json",
            part: "Get-Partition | ConvertTo-JSON -compress -depth 2",
            proc: (win32 === true)
                ? "Get-Process -IncludeUserName | Select-Object id, cpu, pm, name, username | ConvertTo-JSON -compress -depth 1"
                : "ps -eo pid,cputime,rss,user,comm= | tail -n +2 | tr -s \" \" \",\"",
            serv: (win32 === true)
                ? "Get-Service | ConvertTo-JSON -compress -depth 2"
                : "systemctl list-units --type=service --all --output json",
            socT: (win32 === true)
                ? "Get-NetTCPConnection | Select-Object LocalAddress, LocalPort, RemoteAddress, RemotePort, OwningProcess | ConvertTo-JSON -compress -depth 2"
                : "ss -atu | tail -n +2 | tr -s \" \" \",\"",
            socU: (win32 === true)
                ? "Get-NetUDPEndpoint | Select-Object LocalAddress, LocalPort, OwningProcess | ConvertTo-JSON -compress -depth 2"
                : "",
            user: (win32 === true)
                ? "Get-LocalUser | ConvertTo-JSON -compress -depth 1"
                : "lslogins -o user,uid,proc,last-login --time-format iso | tail -n +2 | tr -s \" \" \",\"",
            volu: "Get-Volume | ConvertTo-JSON -compress -depth 2"
        },
        compose: {
            containers: {},
            variables: {}
        },
        css: {
            basic: "",
            complete: ""
        },
        dashboard: "",
        environment: {
            date_commit: 0,
            hash: ""
        },
        hashes: node.crypto.getHashes(),
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
        os: {
            interfaces: {
                data: node.os.networkInterfaces(),
                time: 0
            },
            machine: {
                cpu: {
                    arch: node.os.arch(),
                    cores: node.os.cpus().length,
                    endianness: node.os.endianness(),
                    frequency: node.os.cpus()[0].speed,
                    name: node.os.cpus()[0].model,
                },
                memory: {
                    free: node.os.freemem(),
                    total: node.os.totalmem()
                }
            },
            os: {
                env: process.env,
                hostname: node.os.hostname(),
                name: node.os.version(),
                path: (process.platform === "win32")
                    ? process.env.Path.split(";")
                    : (process.env.PATH === undefined)
                        ? []
                        : process.env.PATH.split(":"),
                platform: node.os.platform(),
                release: node.os.release(),
                type: node.os.type(),
                uptime: node.os.uptime()
            },
            process: {
                arch: process.arch,
                argv: process.argv,
                cpuSystem: process.cpuUsage().system,
                cpuUser: process.cpuUsage().user,
                cwd: process.cwd(),
                memory: {
                    external: 0,
                    rss: 0,
                    V8: 0
                },
                pid: process.pid,
                platform: process.platform,
                ppid: process.ppid,
                uptime: process.uptime(),
                versions: process.versions
            },
            processes: {
                data: [],
                time: 0
            },
            services: {
                data: [],
                time: 0
            },
            sockets: {
                data: [],
                time: 0
            },
            storage: {
                data: [],
                time: 0
            },
            time: 0,
            user: {
                gid: (gid === 0)
                    ? 1000
                    : gid,
                homedir: node.os.homedir(),
                uid: (gid === 0)
                    ? 1000
                    : uid
            },
            users: {
                data: [],
                time: 0
            }
        },
        path: {
            compose: "",
            project: "",
            servers: ""
        },
        processes: {},
        sep: node.path.sep,
        servers: {},
        server_meta: {},
        system_ports: {
            list: [],
            time: 0
        },
        start_time: process.hrtime.bigint(),
        terminal: (process.platform === "win32")
            ? [
                "C:\\Program Files\\PowerShell\\7\\pwsh.exe",
                "C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe",
                "C:\\Windows\\System32\\cmd.exe",
                "C:\\Program Files\\Git\\bin\\bash.exe",
                "C:\\Program Files (x86)\\Git\\bin\\bash.exe"
            ]
            : [],
        test: {
            browser: null,
            browser_args: [],
            browser_child: null,
            browser_start: false,
            counts: {},
            index: 0,
            list: null,
            magicString: "AW#E$RF1SA9DFY^HDfg4hw5se45tDA234",
            store: null,
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
        text: (process.stdout.isTTY === false || process.argv.includes("no-color") === true)
            ? {
                angry    : "",
                blue     : "",
                bold     : "",
                boldLine : "",
                clear    : "",
                cyan     : "",
                green    : "",
                noColor  : "",
                none     : "",
                purple   : "",
                red      : "",
                underline: "",
                yellow   : ""
            }
            : {
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