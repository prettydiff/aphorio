
import broadcast from "../transmit/broadcast.js";
import file from "./file.js";
import node from "./node.js";
import vars from "./vars.js";

// cspell: words blockdevices, bootable, fsavail, fssize, fstype, fsused, mountpoint, partflags, parttypename, pwsh, serv, volu

const os = function utilities_os(type_os:type_os):void {
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
                    : "ps -eo pid,time,rss,comm=",
                serv: (win32 === true)
                    ? "Get-Service | ConvertTo-JSON -compress -depth 2"
                    : "systemctl list-units --type=service --all --output json",
                socT: (win32 === true)
                    ? "Get-NetTCPConnection | Select-Object LocalAddress, LocalPort, RemoteAddress, RemotePort, OwningProcess | ConvertTo-JSON -compress -depth 2"
                    : "ss -a -t",
                socU: (win32 === true)
                    ? "Get-NetUDPEndpoint | Select-Object LocalAddress, LocalPort, OwningProcess | ConvertTo-JSON -compress -depth 2"
                    : "ss -a -u",
                volu: "Get-Volume | ConvertTo-JSON -compress -depth 2"
            },
            disks:os_disk[] = [],
            processes:os_proc[] = [],
            services:os_service[] = [],
            sockets_tcp: os_sockets_tcp[] = [],
            sockets_udp: os_sockets_udp[] = [],
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
                    data_win:os_disk_windows[] = raw.disk as os_disk_windows[],
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
                if (type_os === "disk") {
                    const service:services_os_disk = {
                        disks: disks,
                        time: Date.now()
                    };
                    broadcast("dashboard", "dashboard", {
                        data: service,
                        service: "dashboard-os-disk"
                    });
                } else {
                    complete.part = true;
                    complete.volu = true;
                    completed("disk");
                }
            },
            proc_callback = function utilities_os_populate_procCallback():void {
                const data_win:os_proc_windows[] = raw.proc as os_proc_windows[],
                    data_posix:os_service_posix[] = raw.serv as os_service_posix[],
                    len:number = (win32 === true)
                        ? data_win.length
                        : data_posix.length;
                let index:number = 0,
                    proc:os_proc = null;
                if (len > 0) {
                    do {
                        if (win32 === true) {
                            proc = {
                                id: data_win[index].Id,
                                memory: data_win[index].PM,
                                name: data_win[index].Name,
                                time: data_win[index].CPU
                            };
                        } else {
                            // service = {
                            //     description: data_posix[index].Description,
                            //     name_display: data_posix[index].DisplayName,
                            //     name_service: data_posix[index].Name,
                            //     path: data_posix[index].BinaryPathName,
                            //     start_type: numeric("start_type", data_posix[index].StartType),
                            //     status: numeric("status", data_posix[index].Status)
                            // };
                        }
                        processes.push(proc);
                        index = index + 1;
                    } while (index < len);
                }
                if (type_os === "proc") {
                    const service:services_os_proc = {
                        processes: processes,
                        time: Date.now()
                    };
                    broadcast("dashboard", "dashboard", {
                        data: service,
                        service: "dashboard-os-proc"
                    });
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
                                description: data_win[index].Description,
                                name_display: data_win[index].DisplayName,
                                name_service: data_win[index].Name,
                                path: data_win[index].BinaryPathName,
                                start_type: numeric("start_type", data_win[index].StartType),
                                status: numeric("status", data_win[index].Status)
                            };
                        } else {
                            // service = {
                            //     description: data_posix[index].Description,
                            //     name_display: data_posix[index].DisplayName,
                            //     name_service: data_posix[index].Name,
                            //     path: data_posix[index].BinaryPathName,
                            //     start_type: numeric("start_type", data_posix[index].StartType),
                            //     status: numeric("status", data_posix[index].Status)
                            // };
                        }
                        services.push(service);
                        index = index + 1;
                    } while (index < len);
                }
                if (type_os === "serv") {
                    const service:services_os_service = {
                        services: services,
                        time: Date.now()
                    };
                    broadcast("dashboard", "dashboard", {
                        data: service,
                        service: "dashboard-os-serv"
                    });
                } else {
                    completed("serv");
                }
            },
            socT_callback = function utilities_os_populate_socTCallback():void {
                const data_win:os_sockets_tcp_windows[] = raw.socT as os_sockets_tcp_windows[],
                    data_posix:string = raw.socT as string,
                    len:number = (win32 === true)
                        ? data_win.length
                        : data_posix.length;
                let index:number = 0,
                    sock:os_sockets_tcp = null;
                if (len > 0) {
                    do {
                        if (win32 === true) {
                            sock = {
                                "local-address": data_win[index].LocalAddress,
                                "local-port": data_win[index].LocalPort,
                                "process": data_win[index].OwningProcess,
                                "remote-address": data_win[index].RemoteAddress,
                                "remote-port": data_win[index].RemotePort
                            };
                        } else {
                            // service = {
                            //     description: data_posix[index].Description,
                            //     name_display: data_posix[index].DisplayName,
                            //     name_service: data_posix[index].Name,
                            //     path: data_posix[index].BinaryPathName,
                            //     start_type: numeric("start_type", data_posix[index].StartType),
                            //     status: numeric("status", data_posix[index].Status)
                            // };
                        }
                        sockets_tcp.push(sock);
                        index = index + 1;
                    } while (index < len);
                }
                if (type_os === "sock") {
                    flags.socT = true;
                    if (flags.socT === true && flags.socU === true) {
                        const sockets:services_os_sockets = {
                            tcp: sockets_tcp,
                            time: Date.now(),
                            udp: sockets_udp
                        };
                        broadcast("dashboard", "dashboard", {
                            data: sockets,
                            service: "dashboard-os-sockets"
                        });
                    }
                } else {
                    completed("socT");
                }
            },
            socU_callback = function utilities_os_populate_socTCallback():void {
                const data_win:os_sockets_udp_windows[] = raw.socU as os_sockets_udp_windows[],
                    data_posix:string = raw.socU as string,
                    len:number = (win32 === true)
                        ? data_win.length
                        : data_posix.length;
                let index:number = 0,
                    sock:os_sockets_udp = null;
                if (len > 0) {
                    do {
                        if (win32 === true) {
                            sock = {
                                "address": data_win[index].LocalAddress,
                                "port": data_win[index].LocalPort,
                                "process": data_win[index].OwningProcess
                            };
                        } else {
                            // service = {
                            //     description: data_posix[index].Description,
                            //     name_display: data_posix[index].DisplayName,
                            //     name_service: data_posix[index].Name,
                            //     path: data_posix[index].BinaryPathName,
                            //     start_type: numeric("start_type", data_posix[index].StartType),
                            //     status: numeric("status", data_posix[index].Status)
                            // };
                        }
                        sockets_udp.push(sock);
                        index = index + 1;
                    } while (index < len);
                }
                if (type_os === "sock") {
                    flags.socU = true;
                    if (flags.socT === true && flags.socU === true) {
                        const sockets:services_os_sockets = {
                            tcp: sockets_tcp,
                            time: Date.now(),
                            udp: sockets_udp
                        };
                        broadcast("dashboard", "dashboard", {
                            data: sockets,
                            service: "dashboard-os-sockets"
                        });
                    }
                } else {
                    completed("socU");
                }
            },
            main = function utilities_os_populate_main():services_os_all {
                const mem:server_os_memoryUsage = process.memoryUsage(),
                    output:services_os_all = {
                        machine: {
                            cores: node.os.cpus().length,
                            interfaces: node.os.networkInterfaces(),
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
                        processes: [],
                        services: [],
                        sockets: {
                            tcp: [],
                            udp: []
                        },
                        storage: [],
                        time: Date.now()
                    };

                vars.os.machine.cpu.cores = output.machine.cores;
                vars.os.machine.interfaces = output.machine.interfaces;
                vars.os.machine.memory.free = output.machine.memory.free;
                vars.os.machine.memory.total = output.machine.memory.total;
                vars.os.os.uptime = output.os.uptime;
                vars.os.process.cpuSystem = output.process.cpuSystem;
                vars.os.process.cpuUser = output.process.cpuUser;
                vars.os.process.uptime = output.process.uptime;
                vars.os.process.memory.external = output.process.memory.external;
                vars.os.process.memory.rss = output.process.memory.rss;
                vars.os.process.memory.V8 = output.process.memory.V8;
                if (type_os === "main") {
                    broadcast("dashboard", "dashboard", {
                        data: output,
                        service: "dashboard-os-main"
                    });
                }
                return output;
            },
            completed = function utilities_os_populate_complete(type:type_os_key):void {
                complete[type] = true;

                const keys:string[] = Object.keys(complete),
                    output:services_os_all = main();
                let index:number = keys.length;

                if (index > 0) {
                    do {
                        index = index - 1;
                        if (complete[keys[index]] === false) {
                            return;
                        }
                    } while (index > 0);
                }
                output.storage = disks;
                vars.os.storage = disks;
                output.processes = processes;
                vars.os.processes = processes;
                output.services = services;
                vars.os.services = services;
                output.sockets = {
                    tcp: sockets_tcp,
                    udp: sockets_udp
                };
                vars.os.sockets = {
                    tcp: sockets_tcp,
                    udp: sockets_udp
                };

                broadcast("dashboard", "dashboard", {
                    data: output,
                    service: "dashboard-os-all"
                });
                setTimeout(utilities_os_populate, 60000);
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
            spawning("proc");
            spawning("serv");
            spawning("disk");
            spawning("socT");
            spawning("socU");
            if (win32 === true) {
                spawning("part");
                spawning("volu");
            } else {
                flags.part = true;
                flags.volu = true;
            }
        } else if (type_os === "disk") {
            spawning("disk");
            if (win32 === true) {
                spawning("part");
                spawning("volu");
            } else {
                flags.part = true;
                flags.volu = true;
            }
        } else if (type_os === "proc") {
            spawning("proc");
        } else if (type_os === "serv") {
            spawning("serv");
        } else if (type_os === "sock") {
            spawning("socT");
            spawning("socU");
        } else if (type_os === "main") {
            main();
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