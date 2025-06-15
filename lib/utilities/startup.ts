
import broadcast from "../transmit/broadcast.js";
import commas from "./commas.js";
import core from "../browser/core.js";
import dashboard_script from "../dashboard/dashboard_script.js";
import dateTime from "./dateTime.js";
import docker_ps from "../services/docker_ps.js";
import file from "./file.js";
import node from "./node.js";
import port_map from "../services/port_map.js";
import vars from "./vars.js";

// cspell: words bestaudio, blockdevices, bootable, fsavail, fssize, fstype, fsused, keyid, mountpoint, multistreams, nmap, partflags, parttypename, pathlen, pwsh, volu

const startup = function utilities_startup(callback:() => void):void {
    const flags:store_flag = {
            compose: false,
            config: false,
            css: false,
            docker: false,
            html: false,
            ports: false
        },
        readComplete = function utilities_startup_readComplete(flag:"config"|"css"|"docker"|"html"):void {
            flags[flag] = true;
            if (flags.config === true && flags.css === true && flags.docker === true && flags.html === true) {
                callback();
            }
        },
        readCompose = function utilities_startup_readCompose(fileContents:Buffer):void {
            if (fileContents === null) {
                vars.compose = {
                    containers: {},
                    variables: {}
                };
            } else {
                vars.compose = JSON.parse(fileContents.toString());
            }
            flags.compose = true;
            commandsCallback();
        },
        readCSS = function utilities_startup_readCSS(fileContents:Buffer):void {
            const css:string = fileContents.toString();
            vars.css = css.slice(css.indexOf(":root"), css.indexOf("/* end basic html */"));
            readComplete("css");
        },
        readConfig = function utilities_startup_readConfig(fileContents:Buffer):void {
            const configStr:string = (fileContents === null)
                    ? ""
                    : fileContents.toString(),
                config:store_server_config = (configStr === "" || (/^\s*\{/).test(configStr) === false || (/\}\s*$/).test(configStr) === false)
                    ? null
                    : JSON.parse(configStr) as store_server_config,
                includes = function utilities_startup_read_instructions_includes(input:string):void {
                    if (vars.interfaces.includes(input) === false && input.toLowerCase().indexOf("fe80") !== 0) {
                        vars.interfaces.push(input);
                    }
                },
                interfaces:{ [index: string]: node_os_NetworkInterfaceInfo[]; } = node.os.networkInterfaces(),
                keys_int:string[] = Object.keys(interfaces),
                keys_srv:string[] = (config === null)
                    ? null
                    : Object.keys(config);
            let index_int:number = keys_int.length,
                index_srv:number = (config === null)
                    ? 0
                    : keys_srv.length,
                server:server = null,
                sub:number = 0;
            if (index_srv > 0) {
                do {
                    index_srv = index_srv - 1;
                    index_int = keys_int.length;
                    server = {
                        config: config[keys_srv[index_srv]],
                        sockets: [],
                        status: {
                            open: 0,
                            secure: 0
                        }
                    };
                    if (server.config.ports === null || server.config.ports === undefined) {
                        server.config.ports = {
                            open: 0,
                            secure: 0
                        };
                    } else {
                        if (typeof server.config.ports.open !== "number") {
                            server.config.ports.open = 0;
                        }
                        if (typeof server.config.ports.secure !== "number") {
                            server.config.ports.secure = 0;
                        }
                    }
                    if (server.config.block_list === undefined || server.config.block_list === null) {
                        server.config.block_list = {
                            host: [],
                            ip: [],
                            referrer: []
                        };
                    }
                    if (Array.isArray(server.config.domain_local) === false) {
                        server.config.domain_local = [];
                    }
                    vars.servers[server.config.name] = server;
                } while (index_srv > 0);
            }
            do {
                index_int = index_int - 1;
                sub = interfaces[keys_int[index_int]].length;
                do {
                    sub = sub - 1;
                    includes(interfaces[keys_int[index_int]][sub].address);
                } while (sub > 0);
            } while (index_int > 0);
            readComplete("config");
        },
        readXterm = function utilities_startup_readXterm(xtermFile:Buffer):void {
            file.read({
                callback: function utilities_startup_readHTML(fileContents:Buffer):void {
                    const xterm:string = xtermFile.toString().replace(/\s*\/\/# sourceMappingURL=xterm\.js\.map/, ""),
                        script:string = dashboard_script.toString().replace("path: \"\",", `path: "${vars.path.project.replace(/\\/g, "\\\\").replace(/"/g, "\\\"")}",`).replace(/\(\s*\)/, "(core)");
                    vars.dashboard = fileContents.toString()
                        .replace("${payload.intervals.nmap}", (vars.intervals.nmap / 1000).toString())
                        .replace("${payload.intervals.compose}", (vars.intervals.compose / 1000).toString())
                        .replace("replace_javascript", `${xterm}const commas=${commas.toString()};(${script}(${core.toString()}));`);
                    readComplete("html");
                },
                error_terminate: null,
                location: `${vars.path.project}lib${vars.sep}dashboard${vars.sep}dashboard.html`,
                no_file: null
            });
        },
        options = function utilities_startup_options(key:"no_color"|"verbose", iterate:string):void {
            const argv:number = process.argv.indexOf(key);
            if (argv > -1) {
                process.argv.splice(argv, 1);
                if (iterate !== null) {
                    const store:store_string = vars[iterate as "text"],
                        keys:string[] = Object.keys(store);
                    let index:number = keys.length;
                    do {
                        index = index - 1;
                        if (iterate === "text") {
                            store[keys[index]] = "";
                        }
                    } while (index > 0);
                }
            }
        },
        capitalize = function utilities_startup_capitalize():string {
            // eslint-disable-next-line no-restricted-syntax
            return this.charAt(0).toUpperCase() + this.slice(1);
        },
        commandsCallback = function utilities_startup_commandsCallback():void {
            if (flags.compose === true && flags.ports === true) {
                docker_ps(dockerCallback);
                file.read({
                    callback: readConfig,
                    error_terminate: null,
                    location: `${vars.path.project}servers.json`,
                    no_file: null
                });
                file.read({
                    callback: readXterm,
                    error_terminate: null,
                    location: `${vars.path.project}node_modules${vars.sep}@xterm${vars.sep}xterm${vars.sep}lib${vars.sep}xterm.js`,
                    no_file: null
                });
                file.read({
                    callback: readCSS,
                    error_terminate: null,
                    location: `${vars.path.project}lib${vars.sep}dashboard${vars.sep}styles.css`,
                    no_file: null
                });
            }
        },
        portCallback = function utilities_startup_portCallback():void {
            flags.ports = true;
            commandsCallback();
        },
        dockerCallback = function utilities_startup_dockerCallback():void {
            readComplete("docker");
        },
        osUpdate = function utilities_startup_osUpdate():void {
            const powershell:boolean = (process.platform === "win32"),
                commands:store_string = {
                    disk: (powershell === true)
                        ? "Get-Disk | ConvertTo-JSON -compress -depth 2"
                        : "lsblk -Ob --json",
                    part: "Get-Partition | ConvertTo-JSON -compress -depth 2",
                    volu: "Get-Volume | ConvertTo-JSON -compress -depth 2"
                },
                chunks:store_string_list = {
                    disk: [],
                    part: [],
                    volu: []
                },
                flags:store_flag = {
                    disk: false,
                    part: false,
                    volu: false,
                },
                spawn:store_children = {
                    disk: null,
                    part: null,
                    volu: null
                },
                raw:os_disk_raw = {
                    disk: null,
                    part: null,
                    volu: null
                },
                win_string:string = "\x1B[33;1mWARNING: Resulting JSON is truncated as serialization has exceeded the set depth of 2.\x1B[0m\r\n",
                chunks_complete = function utilities_startup_osUpdate_chunksComplete(type:"disk"|"part"|"volu", segment:Buffer):void {
                    if (flags[type] === false) {
                        chunks[type].push(segment.toString());
                        const temp:string = chunks[type].join("").replace(/\s+$/, "").replace(win_string, "");
                        // eslint-disable-next-line no-restricted-syntax
                        try {
                            if (type === "disk") {
                                if (powershell === true) {
                                    raw.disk = JSON.parse(temp) as os_disk_windows[];
                                } else {
                                    raw.disk = JSON.parse(temp).blockdevices as os_disk_posix[];
                                }
                            } else {
                                raw[type] = JSON.parse(temp);
                            }
                            flags[type] = true;
                            spawn[type].kill();
                            if (flags.disk === true && flags.part === true && flags.volu === true) {
                                disk_callback();
                            }
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        } catch (e:unknown) {
                            return;
                        }
                    }
                },
                disk_callback = function utilities_startup_osUpdate_diskCallback():void {
                    const data_posix:os_disk_posix[] = raw.disk as os_disk_posix[],
                        data_win:os_disk_windows[] = raw.disk as os_disk_windows[],
                        parts:os_disk_windows_partition[] = (powershell === true)
                            ? raw.part
                            : null,
                        volumes:os_disk_windows_volume[] = (powershell === true)
                            ? raw.volu
                            : null,
                        len:number = (powershell === true)
                            ? data_win.length
                            : data_posix.length,
                        pLen:number = (parts === null)
                            ? 0
                            : parts.length,
                        vLen:number = (volumes === null)
                            ? 0
                            : volumes.length,
                        disks:os_disk[] = [],
                        mem:server_os_memoryUsage = process.memoryUsage(),
                        os:services_os = {
                            machine: {
                                cores: node.os.cpus().length,
                                interfaces: node.os.networkInterfaces(),
                                memory: {
                                    free: node.os.freemem(),
                                    total: node.os.totalmem()
                                },
                                storage: null
                            },
                            os: {
                                uptime: node.os.uptime()
                            },
                            process: {
                                // microseconds
                                cpuSystem: process.cpuUsage().system / 1e6,
                                cpuUser: process.cpuUsage().user / 1e6,
                                memory: {
                                    external: mem.external,
                                    rss: process.memoryUsage.rss(),
                                    V8: mem.heapUsed
                                },
                                uptime: process.uptime()
                            },
                            time: Date.now()
                        };
                    let index:number = 0,
                        pIndex:number = 0,
                        vIndex:number = 0,
                        id:string = "",
                        vol:string = "",
                        part:os_disk_partition = null,
                        disk:os_disk = null,
                        child:os_disk_posix_partition = null,
                        child_len:number = 0;
                    if (len > 0 && ((powershell === true && pLen > 0 && vLen > 0) || powershell === false)) {
                        do {
                            pIndex = 0;
                            if (powershell === true) {
                                disk = {
                                    bus: data_win[index].BusType,
                                    guid: data_win[index].Guid,
                                    id: data_win[index].UniqueId,
                                    name: data_win[index].FriendlyName,
                                    partitions: [],
                                    serial: data_win[index].SerialNumber,
                                    size_disk: data_win[index].Size
                                };
                                do {
                                    id = parts[pIndex].UniqueId.split("}")[1];
                                    if (id === disk.id) {
                                        part = {
                                            active: parts[pIndex].IsActive,
                                            bootable: parts[pIndex].IsBoot,
                                            diskId: id,
                                            file_system: null,
                                            hidden: parts[pIndex].IsHidden,
                                            id: parts[pIndex].Guid,
                                            path: null,
                                            read_only: parts[pIndex].IsReadOnly,
                                            size_free: 0,
                                            size_total: 0,
                                            size_used: 0,
                                            type: parts[pIndex].Type
                                        };
                                        vIndex = 0;
                                        do {
                                            vol = volumes[vIndex].UniqueId.split("Volume")[1].replace("\\", "");
                                            if (vol === parts[pIndex].Guid) {
                                                if (volumes[vIndex].FileSystem !== "") {
                                                    part.file_system = volumes[vIndex].FileSystem;
                                                }
                                                if (volumes[vIndex].DriveLetter !== "") {
                                                    part.path = volumes[vIndex].DriveLetter;
                                                }
                                                part.size_free = volumes[vIndex].SizeRemaining;
                                                part.size_total = volumes[vIndex].Size;
                                                part.size_used = volumes[vIndex].Size - volumes[vIndex].SizeRemaining;
                                            }
                                            vIndex = vIndex + 1;
                                        } while (vIndex < vLen);
                                        disk.partitions.push(part);
                                    }
                                    pIndex = pIndex + 1;
                                } while (pIndex < pLen);
                            } else {
                                disk = {
                                    bus: data_posix[index].tran,
                                    guid: data_posix[index].uuid,
                                    id: data_posix[index].uuid,
                                    name: data_posix[index].model,
                                    partitions: [],
                                    serial: data_posix[index].serial,
                                    size_disk: data_posix[index].size
                                };
                                child_len = (data_posix[index].children === undefined || data_posix[index].children === null)
                                    ? 0
                                    : data_posix[index].children.length;
                                if (child_len > 0) {
                                    do {
                                        child = data_posix[index].children[pIndex];
                                        part = {
                                            active: (child.mountpoint !== null),
                                            bootable: (child.partflags === "0x80"),
                                            diskId: disk.id,
                                            file_system: child.fstype,
                                            hidden: (child.mountpoint !== null && child.mountpoint.charAt(0) !== "/"),
                                            id: child.uuid,
                                            path: child.path,
                                            read_only: child.ro,
                                            size_free: (child.fsavail === null)
                                                ? 0
                                                : child.fsavail,
                                            size_total: (child.fssize === null)
                                                ? 0
                                                : child.fssize,
                                            size_used: (child.fsused === null)
                                                ? 0
                                                : child.fsused,
                                            type: (child.type === "part")
                                                ? child.parttypename
                                                : child.type
                                        };
                                        disk.partitions.push(part);
                                        pIndex = pIndex + 1;
                                    } while (pIndex < child_len);
                                }
                            }
                            disks.push(disk);
                            index = index + 1;
                        } while (index < len);
                    }
                    vars.os.machine.cpu.cores = os.machine.cores;
                    vars.os.machine.storage = disks;
                    vars.os.machine.interfaces = os.machine.interfaces;
                    vars.os.machine.memory.free = os.machine.memory.free;
                    vars.os.machine.memory.total = os.machine.memory.total;
                    vars.os.os.uptime = os.os.uptime;
                    vars.os.process.cpuSystem = os.process.cpuSystem;
                    vars.os.process.cpuUser = os.process.cpuUser;
                    vars.os.process.uptime = os.process.uptime;
                    vars.os.process.memory.external = os.process.memory.external;
                    vars.os.process.memory.rss = os.process.memory.rss;
                    vars.os.process.memory.V8 = os.process.memory.V8;
                    broadcast("dashboard", "dashboard", {
                        data: os,
                        service: "dashboard-os"
                    });
                    setTimeout(utilities_startup_osUpdate, 60000);
                },
                spawning = function utilities_startup_osUpdate_spawning(type:"disk"|"part"|"volu"):void {
                    const data_callback = function utilities_startup_osUpdate_spawning_dataCallback(buf:Buffer):void {
                            chunks_complete(type, buf);
                        };
                    spawn[type] = node.child_process.spawn(commands[type], [], {
                        shell: (powershell === true)
                            ? "C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe"
                            : "/bin/sh",
                        windowsHide: true
                    });
                    spawn[type].stdout.on("data", data_callback);
                };
            spawning("disk");
            if (powershell === true) {
                spawning("part");
                spawning("volu");
            } else {
                flags.part = true;
                flags.volu = true;
            }
        };

    String.prototype.capitalize = capitalize;
    Number.prototype.dateTime = dateTime;

    options("no_color", "text");
    vars.path.project = process.argv[1].slice(0, process.argv[1].indexOf(`${vars.sep}js${vars.sep}`)) + vars.sep;
    vars.path.compose = `${vars.path.project}compose${vars.sep}`;
    vars.path.servers = `${vars.path.project}servers${vars.sep}`;
    port_map(portCallback);
    file.read({
        callback: readCompose,
        error_terminate: null,
        location: `${vars.path.project}compose.json`,
        no_file: null
    });
    // build shell list
    if (process.platform === "win32") {
        const stats = function utilities_startup_shellWin(index:number):void {
            node.fs.stat(vars.terminal[index], function utilities_startup_shellWin_callback(err:node_error) {
                if (err !== null) {
                    vars.terminal.splice(index, 1);
                }
                if (index > 0) {
                    utilities_startup_shellWin(index - 1);
                } else {
                    osUpdate();
                }
            });
        };
        stats(vars.terminal.length - 1);
    } else {
        file.stat({
            callback: function utilities_startup_shellStat(stat:node_fs_BigIntStats):void {
                if (stat === null) {
                    vars.terminal.push("/bin/sh");
                } else {
                    file.read({
                        callback: function utilities_startup_shellStat_shellRead(contents:Buffer):void {
                            const lines:string[] = contents.toString().split("\n"),
                                len:number = lines.length;
                            let index:number = 1;
                            if (len > 1) {
                                do {
                                    if (lines[index].indexOf("/bin/") === 0) {
                                        vars.terminal.push(lines[index]);
                                    }
                                    index = index + 1;
                                } while (index < len);
                            }
                            if (vars.terminal.length < 1) {
                                vars.terminal.push("/bin/sh");
                            }
                            osUpdate();
                        },
                        error_terminate: null,
                        location: "/etc/shells",
                        no_file: null
                    });
                }
            },
            error_terminate: null,
            location: "/etc/shells",
            no_file: null
        });
    }
};

export default startup;