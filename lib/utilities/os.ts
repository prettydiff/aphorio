
import file from "./file.js";
import node from "./node.js";
import vars from "./vars.js";

// cspell: words blockdevices, bootable, cputime, fsavail, fssize, fstype, fsused, mountpoint, partflags, parttypename, pwsh, serv, volu

const os = function utilities_os(type_os:type_os, callback:(output:socket_data) => void):void {
    const populate = function utilities_os_populate():void {
        const win32:boolean = (process.platform === "win32"),
            shell:string = (win32 === true)
                ? (vars.terminal.includes("C:\\Program Files\\PowerShell\\7\\pwsh.exe") === true)
                    ? "C:\\Program Files\\PowerShell\\7\\pwsh.exe"
                    : "C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe"
                : "/bin/sh",
            commands:store_string = {
                disk: (win32 === true)
                    ? "Get-Disk | ConvertTo-JSON -compress -depth 2"
                    : "lsblk -Ob --json",
                part: "Get-Partition | ConvertTo-JSON -compress -depth 2",
                proc: (win32 === true)
                    ? "Get-Process | Select-Object id, cpu, pm, name | ConvertTo-JSON"
                    : "ps -eo pid,cputime,rss,comm= | tail -n +2 | tr -s \" \" \",\"",
                serv: (win32 === true)
                    ? "Get-Service | ConvertTo-JSON -compress -depth 2"
                    : "systemctl list-units --type=service --all --output json",
                socT: (win32 === true)
                    ? "Get-NetTCPConnection | Select-Object LocalAddress, LocalPort, RemoteAddress, RemotePort, OwningProcess | ConvertTo-JSON -compress -depth 2"
                    : "ss -atu | tail -n +2 | tr -s \" \" \",\"",
                socU: (win32 === true)
                    ? "Get-NetUDPEndpoint | Select-Object LocalAddress, LocalPort, OwningProcess | ConvertTo-JSON -compress -depth 2"
                    : "",
                volu: "Get-Volume | ConvertTo-JSON -compress -depth 2"
            },
            disks:os_disk[] = [],
            processes:os_proc[] = [],
            services:os_service[] = [],
            sockets: os_sockets[] = [],
            chunks:store_string_list = {
                disk: [],
                part: [],
                proc: [],
                serv: [],
                socT: [],
                socU: [],
                volu: []
            },
            flags:store_flag = {
                disk: false,
                part: false,
                proc: false,
                serv: false,
                socT: false,
                socU: false,
                volu: false,
            },
            spawn:store_children = {
                disk: null,
                part: null,
                proc: null,
                serv: null,
                socT: null,
                socU: null,
                volu: null
            },
            raw:os_raw = {
                disk: null,
                part: null,
                proc: null,
                serv: null,
                socT: null,
                socU: null,
                volu: null
            },
            complete:store_flag = {
                disk: false,
                part: false,
                proc: false,
                serv: false,
                socT: false,
                socU: false,
                volu: false
            },
            disk_callback = function utilities_os_populate_diskCallback():void {
                const data_posix:os_disk_posix[] = raw.disk as os_disk_posix[],
                    data_win:os_disk_windows[] = (function utilities_os_populate_diskCallback_win32():os_disk_windows[] {
                        if (raw.disk.length === undefined) {
                            // @ts-expect-error - in the case of one disk powershell returns a single object not wrapped in an array
                            return [raw.disk] as os_disk_windows[];
                        }
                        return raw.disk as os_disk_windows[];
                    }()),
                    parts:os_disk_windows_partition[] = (win32 === true)
                        ? raw.part
                        : null,
                    volumes:os_disk_windows_volume[] = (win32 === true)
                        ? raw.volu
                        : null,
                    len:number = (win32 === true)
                        ? data_win.length
                        : data_posix.length,
                    pLen:number = (parts === null)
                        ? 0
                        : parts.length,
                    vLen:number = (volumes === null)
                        ? 0
                        : volumes.length;
                let index:number = 0,
                    pIndex:number = 0,
                    vIndex:number = 0,
                    id:string = "",
                    vol:string = "",
                    part:os_disk_partition = null,
                    disk:os_disk = null,
                    child:os_disk_posix_partition = null,
                    child_len:number = 0;
                if (len > 0 && ((win32 === true && pLen > 0 && vLen > 0) || win32 === false)) {
                    do {
                        pIndex = 0;
                        if (win32 === true) {
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
                complete.part = true;
                complete.volu = true;
                completed("disk");
            },
            proc_callback = function utilities_os_populate_procCallback():void {
                const data_win:os_proc_windows[] = raw.proc as os_proc_windows[],
                    data_posix:string[] = raw.proc as string[],
                    len:number = (win32 === true)
                        ? data_win.length
                        : data_posix.length;
                let index:number = 0,
                    proc:os_proc = null,
                    line:string[] = null,
                    time:string[] = null;
                if (len > 0) {
                    do {
                        if (win32 === true) {
                            proc = {
                                id: data_win[index].Id,
                                memory: data_win[index].PM,
                                name: data_win[index].Name,
                                time: (data_win[index].CPU === null)
                                    ? 0
                                    : data_win[index].CPU
                            };
                        } else {
                            line = data_posix[index].split(",");
                            time = line[1].split(":");
                            proc = {
                                id: Number(line[0]),
                                memory: Number(line[2]),
                                name: line[3],
                                time: (Number(time[0]) * 3600) + (Number(time[1]) * 60) + Number(time[2])
                            };
                        }
                        processes.push(proc);
                        index = index + 1;
                    } while (index < len);
                }
                completed("proc");
            },
            proc_child = function utilities_os_populate_procChild(err:node_childProcess_ExecException, stdout:string):void {
                if (err === null) {
                    raw.proc = stdout.replace(/^,/, "").replace(/\n,/g, "\n").replace(/\s+$/, "").split("\n");
                    proc_callback();
                } else {
                    completed("proc");
                }
            },
            serv_callback = function utilities_os_populate_servCallback():void {
                const data_win:os_service_windows[] = raw.serv as os_service_windows[],
                    data_posix:os_service_posix[] = raw.serv as os_service_posix[],
                    len:number = (win32 === true)
                        ? data_win.length
                        : data_posix.length,
                    numeric = function utilities_os_populate_servCallback_numeric(key:string, value:number):string {
                        const values:store_string_list = {
                            start_type: ["boot", "system", "automatic", "manual", "disabled"],
                            status: ["", "stopped", "start_pending", "stop_pending", "running", "continue_pending", "paused_pending", "paused"]
                        };
                        return values[key][value];
                    };
                let index:number = 0,
                    service:os_service = null;
                if (len > 0) {
                    do {
                        if (win32 === true) {
                            service = {
                                description: (data_win[index].Description === undefined)
                                    ? data_win[index].DisplayName
                                    : data_win[index].Description,
                                name: data_win[index].Name,
                                status: numeric("status", data_win[index].Status)
                            };
                        } else {
                            service = {
                                description: data_posix[index].description,
                                name: data_posix[index].unit,
                                status: data_posix[index].active
                            };
                        }
                        services.push(service);
                        index = index + 1;
                    } while (index < len);
                }
                completed("serv");
            },
            socT_callback = function utilities_os_populate_socTCallback():void {
                const data_win:os_sockets_tcp_windows[] = raw.socT as os_sockets_tcp_windows[],
                    data_posix:string[] = raw.socT as string[],
                    len:number = (win32 === true)
                        ? data_win.length
                        : data_posix.length;
                let index:number = 0,
                    sock:os_sockets = null,
                    line:string[] = null,
                    local:string[] = null,
                    remote:string[] = null,
                    port_local:number = 0,
                    port_remote:number = 0;
                if (len > 0) {
                    do {
                        if (win32 === true) {
                            sock = {
                                "local-address": (data_win[index].LocalAddress === null)
                                    ? ""
                                    : data_win[index].LocalAddress,
                                "local-port": (Number.isNaN(data_win[index].LocalPort) === true)
                                    ? 0
                                    : data_win[index].LocalPort,
                                "remote-address": (data_win[index].RemoteAddress === null)
                                    ? ""
                                    : data_win[index].RemoteAddress,
                                "remote-port": (Number.isNaN(data_win[index].RemotePort) === true)
                                    ? 0
                                    : data_win[index].RemotePort,
                                "type": "tcp"
                            };
                        } else {
                            line = data_posix[index].split(",");
                            if (line.length > 5) {
                                local = line[4].split(":");
                                remote = line[5].split(":");
                                port_local = Number(local[1]);
                                port_remote = Number(remote[1]);
                                sock = {
                                    "local-address": (local[0] === null)
                                        ? ""
                                        : local[0],
                                    "local-port": (Number.isNaN(port_local) === true)
                                        ? 0
                                        : port_local,
                                    "remote-address": (remote[0] === null)
                                        ? ""
                                        : remote[0],
                                    "remote-port": (Number.isNaN(port_remote) === true)
                                        ? 0
                                        : port_remote,
                                    "type": line[0] as "tcp"
                                };
                            }
                        }
                        sockets.push(sock);
                        index = index + 1;
                    } while (index < len);
                }
                completed("socT");
            },
            socT_child = function utilities_os_populate_childSocT(err:node_childProcess_ExecException, stdout:string):void {
                complete.socU = true;
                if (err === null) {
                    raw.socT = stdout.replace(",\n", "\n").split("\n");
                    socT_callback();
                } else {
                    completed("socT");
                }
            },
            socU_callback = function utilities_os_populate_socTCallback():void {
                const data_win:os_sockets_udp_windows[] = raw.socU as os_sockets_udp_windows[],
                    len:number = data_win.length;
                let index:number = 0,
                    sock:os_sockets = null;
                if (len > 0) {
                    do {
                        if (win32 === true) {
                            sock = {
                                "local-address": (data_win[index].LocalAddress === null)
                                    ? ""
                                    : data_win[index].LocalAddress,
                                "local-port": (Number.isNaN(data_win[index].LocalPort) === true)
                                    ? 0
                                    : data_win[index].LocalPort,
                                "remote-address": "",
                                "remote-port": 0,
                                "type": "udp"
                            };
                        }
                        sockets.push(sock);
                        index = index + 1;
                    } while (index < len);
                }
                completed("socU");
            },
            main = function utilities_os_populate_main():services_os_all {
                const mem:server_os_memoryUsage = process.memoryUsage(),
                    output:services_os_all = {
                        interfaces: {
                            data: {},
                            time: 0
                        },
                        machine: {
                            cores: node.os.cpus().length,
                            memory: {
                                free: node.os.freemem(),
                                total: node.os.totalmem()
                            }
                        },
                        os: {
                            services: services,
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
                        time: Date.now()
                    };

                vars.os.machine.cpu.cores = output.machine.cores;
                vars.os.interfaces = output.interfaces;
                vars.os.machine.memory.free = output.machine.memory.free;
                vars.os.machine.memory.total = output.machine.memory.total;
                vars.os.os.uptime = output.os.uptime;
                vars.os.process.cpuSystem = output.process.cpuSystem;
                vars.os.process.cpuUser = output.process.cpuUser;
                vars.os.process.uptime = output.process.uptime;
                vars.os.process.memory.external = output.process.memory.external;
                vars.os.process.memory.rss = output.process.memory.rss;
                vars.os.process.memory.V8 = output.process.memory.V8;
                vars.os.time = Date.now();
                return output;
            },
            completed = function utilities_os_populate_complete(type:type_os_key):void {
                const keys:string[] = Object.keys(complete),
                    now:number = Date.now();
                let index:number = keys.length;

                if (type_os === "all" && index > 0) {
                    const output:services_os_all = main();
                    complete[type] = true;
                    do {
                        index = index - 1;
                        if (complete[keys[index]] === false) {
                            return;
                        }
                    } while (index > 0);
                    output.interfaces = {
                        data: node.os.networkInterfaces(),
                        time: now
                    };
                    output.processes = {
                        data: processes,
                        time: now
                    };
                    output.services = {
                        data: services,
                        time: now
                    };
                    output.sockets = {
                        data: sockets,
                        time: now
                    };
                    output.storage = {
                        data: disks,
                        time: now
                    };
                    vars.os.interfaces = output.interfaces;
                    vars.os.processes = output.processes;
                    vars.os.services = output.services;
                    vars.os.sockets = output.sockets;
                    vars.os.storage = output.storage;
                    vars.os.time = now;
                    callback({
                        data: output,
                        service: "dashboard-os-all"
                    });
                } else if (type_os === "main") {
                    const output:services_os_all = main();
                    output.time = now;
                    callback({
                        data: output,
                        service: "dashboard-os-main"
                    });
                } else if (type_os === "disk") {
                    vars.os.storage = {
                        data: disks,
                        time: now
                    };
                    callback({
                        data: vars.os.storage,
                        service: "dashboard-os-disk"
                    });
                } else if (type_os === "intr") {
                    vars.os.interfaces = {
                        data: node.os.networkInterfaces(),
                        time: now
                    };
                    callback({
                        data: vars.os.interfaces,
                        service: "dashboard-os-intr"
                    });
                } else if (type_os === "proc") {
                    vars.os.processes = {
                        data: processes,
                        time: now
                    };
                    callback({
                        data: vars.os.processes,
                        service: "dashboard-os-proc"
                    });
                } else if (type_os === "serv") {
                    vars.os.services =  {
                        data: services,
                        time: now
                    };
                    callback({
                        data: vars.os.services,
                        service: "dashboard-os-serv"
                    });
                } else if (type_os === "sock") {
                    vars.os.sockets = {
                        data: sockets,
                        time: now
                    };
                    callback({
                        data: vars.os.sockets,
                        service: "dashboard-os-sock"
                    });
                }
            },
            spawning = function utilities_os_populate_spawning(type:type_os_key):void {
                const chunks_complete = function utilities_os_populate_chunksComplete(type:type_os_key, segment:Buffer):void {
                        if (flags[type] === false) {
                            chunks[type].push(segment.toString());
                            const win_string:string = "\x1B[33;1mWARNING: Resulting JSON is truncated as serialization has exceeded the set depth of 2.\x1B[0m\r\n",
                                temp:string = chunks[type].join("").replace(/\s+$/, "").replace(win_string, "");
                            // eslint-disable-next-line no-restricted-syntax
                            try {
                                if (type === "disk") {
                                    if (win32 === true) {
                                        raw.disk = JSON.parse(temp) as os_disk_windows[];
                                    } else {
                                        raw.disk = JSON.parse(temp).blockdevices as os_disk_posix[];
                                    }
                                } else {
                                    raw[type] = JSON.parse(temp);
                                }
                                flags[type] = true;
                                spawn[type].kill();
                                if (flags.disk === true && flags.part === true && flags.volu === true && (type === "disk" || type === "part" || type === "volu")) {
                                    disk_callback();
                                } else if (type === "proc") {
                                    proc_callback();
                                } else if (type === "serv") {
                                    serv_callback();
                                } else if (type === "socT") {
                                    socT_callback();
                                } else if (type === "socU") {
                                    socU_callback();
                                }
                            // eslint-disable-next-line @typescript-eslint/no-unused-vars
                            } catch (e:unknown) {
                                return;
                            }
                        }
                    },
                    data_callback = function utilities_os_populate_spawning_dataCallback(buf:Buffer):void {
                        chunks_complete(type, buf);
                    };
                spawn[type] = node.child_process.spawn(commands[type], [], {
                    shell: shell,
                    windowsHide: true
                });
                spawn[type].stdout.on("data", data_callback);
            };
        if (type_os === "all" || type_os === undefined || type_os === null) {
            type_os = "all";
            if (win32 === true) {
                spawning("part");
                spawning("proc");
                spawning("socT");
                spawning("socU");
                spawning("volu");
            } else {
                flags.part = true;
                flags.socU = true;
                flags.volu = true;
                node.child_process.exec(commands.proc, proc_child);
                node.child_process.exec(commands.socT, socT_child);
            }
            spawning("serv");
            spawning("disk");
        } else if (type_os === "disk") {
            if (win32 === true) {
                spawning("part");
                spawning("volu");
            } else {
                flags.part = true;
                flags.volu = true;
            }
            spawning("disk");
        } else if (type_os === "intr") {
            completed("disk");
        } else if (type_os === "proc") {
            if (win32 === true) {
                spawning("proc");
            } else {
                node.child_process.exec(commands.proc, proc_child);
            }
        } else if (type_os === "serv") {
            spawning("serv");
        } else if (type_os === "sock") {
            if (win32 === true) {
                spawning("socT");
                spawning("socU");
            } else {
                flags.socU = true;
                node.child_process.exec(commands.socT, socT_child);
            }
        } else if (type_os === "main") {
            completed("disk");
        }
    };
    // build shell list
    if (process.platform === "win32") {
        const stats = function utilities_os_shellWin(index:number):void {
            node.fs.stat(vars.terminal[index], function utilities_os_shellWin_callback(err:node_error) {
                if (err !== null) {
                    vars.terminal.splice(index, 1);
                }
                if (index > 0) {
                    utilities_os_shellWin(index - 1);
                } else {
                    populate();
                }
            });
        };
        stats(vars.terminal.length - 1);
    } else {
        file.stat({
            callback: function utilities_os_shellStat(stat:node_fs_BigIntStats):void {
                if (stat === null) {
                    vars.terminal.push("/bin/sh");
                } else {
                    file.read({
                        callback: function utilities_os_shellStat_shellRead(contents:Buffer):void {
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
                            populate();
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

export default os;