
import log from "../core/log.ts";
import node from "../core/node.ts";
import spawn from "../core/spawn.ts";
import vars from "../core/vars.ts";

// cspell: words blockdevices, bootable, fsavail, fssize, fstype, fsused, mountpoint, partflags, parttypename, pwsh, serv, volu

const os = function utilities_os(type_os:type_os_services, callback:(output:socket_data) => void):void {
    const win32:boolean = (process.platform === "win32"),
        shell:string = (win32 === true)
            ? (vars.terminal.includes("C:\\Program Files\\PowerShell\\7\\pwsh.exe") === true)
                ? "C:\\Program Files\\PowerShell\\7\\pwsh.exe"
                : "C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe"
            : "/bin/sh",
        devices:os_devs[] = [],
        disks:os_disk[] = [],
        processes:os_proc[] = [],
        services:os_serv[] = [],
        sockets: os_sock[] = [],
        users: os_user[] = [],
        int:NodeJS.Dict<node_os_NetworkInterfaceInfo[]> = node.os.networkInterfaces(),
        flags:store_flag = {
            devs: false,
            disk: false,
            part: (win32 === false),
            proc: false,
            serv: false,
            socT: false,
            socU: (win32 === false),
            user: false,
            volu: (win32 === false)
        },
        spawn_item:store_children_os = {
            devs: null,
            disk: null,
            part: null,
            proc: null,
            serv: null,
            socT: null,
            socU: null,
            user: null,
            volu: null
        },
        raw:os_raw = {
            devs: null,
            disk: null,
            part: null,
            proc: null,
            serv: null,
            sock: null,
            socT: null,
            socU: null,
            user: null,
            volu: null
        },
        complete:store_flag = {
            devs: false,
            disk: false,
            part: true,
            proc: false,
            serv: false,
            socT: false,
            socU: (win32 === false),
            user: false,
            volu: true
        },
        builder:store_function = {
            devs: function utilities_os_builderDevs():void {
                const data_posix:string[] = raw.devs as string[],
                    data_win:os_devs_windows[] = raw.devs as os_devs_windows[],
                    len:number = (win32 === true)
                        ? data_win.length
                        : data_posix.length;
                let index:number = 0,
                    lines:string[] = null,
                    devs:os_devs = null,
                    kernel:string = "";
                if (len > 0) {
                    do {
                        if (win32 === true) {
                            if (data_win[index].FriendlyName !== null && data_win[index].FriendlyName !== undefined && data_win[index].FriendlyName.replace(/\s+/, "") !== "") {
                                devs = {
                                    kernel_module: data_win[index].PNPDeviceID,
                                    name: data_win[index].FriendlyName,
                                    type: (data_win[index].PNPClass === null || data_win[index].PNPClass === undefined || data_win[index].PNPClass.replace(/\s+/, "") === "")
                                        ? data_win[index].CreationClassName
                                        : data_win[index].PNPClass
                                };
                            } else {
                                devs = null;
                            }
                        } else {
                            lines = data_posix[index].split("\n");
                            kernel = (lines[lines.length - 1].indexOf("\tKernel modules: ") === 0)
                                ? lines[lines.length - 1].split("\tKernel modules: ")[1]
                                : (lines[lines.length - 1].indexOf("\tKernel driver in use: ") === 0)
                                    ? lines[lines.length - 1].split("\tKernel driver in use: ")[1]
                                    : "";
                            if (kernel === "") {
                                devs = null;
                            } else {
                                devs = {
                                    kernel_module: kernel,
                                    name: lines[0].split(": ")[1],
                                    type: lines[0].split(": ")[0].slice(lines[0].indexOf(" ") + 1)
                                };
                            }
                        }
                        if (devs !== null) {
                            devices.push(devs);
                        }
                        index = index + 1;
                    } while (index < len);
                }
                completed("devs");
            },
            disk: function utilities_os_builderDisk():void {
                const data_posix:os_disk_posix[] = raw.disk as os_disk_posix[],
                    data_win:os_disk_windows[] = (function utilities_os_builderDisk_win32():os_disk_windows[] {
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
                                        diskName: data_win[index].FriendlyName,
                                        file_system: null,
                                        hidden: parts[pIndex].IsHidden,
                                        id: parts[pIndex].Guid,
                                        path: null,
                                        read_only: parts[pIndex].IsReadOnly,
                                        size_free: 0,
                                        size_free_percent: 0,
                                        size_total: 0,
                                        size_used: 0,
                                        size_used_percent: 0,
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
                                            part.size_free_percent = (part.size_free === 0 || part.size_total === 0)
                                                ? 0
                                                : Math.round((part.size_free / part.size_total) * 100);
                                            part.size_used_percent = (part.size_used === 0 || part.size_total === 0)
                                                ? 0
                                                : Math.round((part.size_used / part.size_total) * 100);
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
                                        diskName: data_posix[index].model,
                                        file_system: child.fstype,
                                        hidden: (child.mountpoint !== null && child.mountpoint.charAt(0) !== "/"),
                                        id: child.uuid,
                                        path: child.path,
                                        read_only: child.ro,
                                        size_free: (child.fsavail === null)
                                            ? 0
                                            : child.fsavail,
                                        size_free_percent: (child.fsavail === null || child.fsavail === 0 || child.fssize === null || child.fssize === 0)
                                            ? 0
                                            : Math.round((child.fsavail / child.fssize) * 100),
                                        size_total: (child.fssize === null)
                                            ? 0
                                            : child.fssize,
                                        size_used: (child.fsused === null)
                                            ? 0
                                            : child.fsused,
                                        size_used_percent: (child.fsused === null || child.fsused === 0 || child.fssize === null || child.fssize === 0)
                                            ? 0
                                            : Math.round((child.fsused / child.fssize) * 100),
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
                completed("disk");
            },
            proc: function utilities_os_builderProc():void {
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
                                    : data_win[index].CPU,
                                user: (data_win[index].UserName === null)
                                    ? ""
                                    : (data_win[index].UserName.indexOf("\\") > -1)
                                        ? data_win[index].UserName.split("\\")[1]
                                        : data_win[index].UserName
                            };
                        } else {
                            line = data_posix[index].replace(/^,/, "").split(",");
                            time = line[1].split(":");
                            proc = {
                                id: Number(line[0]),
                                memory: Number(line[2]),
                                name: line[4],
                                time: (Number(time[0]) * 3600) + (Number(time[1]) * 60) + Number(time[2]),
                                user: line[3]
                            };
                        }
                        processes.push(proc);
                        index = index + 1;
                    } while (index < len);
                }
                if (type_os === "user") {
                    spawning("user");
                } else {
                    completed("proc");
                }
            },
            serv: function utilities_os_builderServ():void {
                const data_win:os_serv_windows[] = raw.serv as os_serv_windows[],
                    data_posix:os_serv_posix[] = raw.serv as os_serv_posix[],
                    len:number = (win32 === true)
                        ? data_win.length
                        : data_posix.length,
                    numeric = function utilities_os_builderServ_numeric(key:string, value:number):string {
                        const values:store_string_list = {
                            start_type: ["boot", "system", "automatic", "manual", "disabled"],
                            status: ["", "stopped", "start_pending", "stop_pending", "running", "continue_pending", "paused_pending", "paused"]
                        };
                        return values[key][value];
                    };
                let index:number = 0,
                    service:os_serv = null;
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
            socT: function utilities_os_builderSocT():void {
                const data_win:os_sock_tcp_windows[] = raw.socT as os_sock_tcp_windows[],
                    data_posix:string[] = raw.socT as string[],
                    len:number = (win32 === true)
                        ? data_win.length
                        : data_posix.length,
                    getAddress = function utilities_os_builderSocT_getAddress(num:number):string {
                        return (line[num].charAt(0) === "[")
                            ? line[num].slice(1, line[num].indexOf("]"))
                            : line[num].split(":")[0];
                    },
                    getPort = function utilities_os_builderSocT_getPort(num:number):number {
                        const value:number = Number(line[num].slice(line[num].lastIndexOf(":") + 1));
                        return (isNaN(value) === true)
                            ? 0
                            : value;
                    };
                let index:number = 0,
                    sock:os_sock = null,
                    line:string[] = null;
                if (len > 0) {
                    do {
                        if (win32 === true) {
                            sock = {
                                "local-address": (data_win[index].LocalAddress === null)
                                    ? ""
                                    : data_win[index].LocalAddress,
                                "local-port": data_win[index].LocalPort,
                                "process": data_win[index].OwningProcess,
                                "remote-address": (data_win[index].RemoteAddress === null)
                                    ? ""
                                    : data_win[index].RemoteAddress,
                                "remote-port": data_win[index].RemotePort,
                                "type": "tcp"
                            };
                            sockets.push(sock);
                        } else {
                            line = data_posix[index].split(",");
                            if (line.length > 5) {
                                sock = {
                                    "local-address": getAddress(4),
                                    "local-port": getPort(4),
                                    "process": (line[7] === undefined)
                                        ? 0
                                        : Number(line[7].replace("pid=", "")),
                                    "remote-address": getAddress(5),
                                    "remote-port": getPort(5),
                                    "type": line[0] as "tcp"
                                };
                                sockets.push(sock);
                            }
                        }
                        index = index + 1;
                    } while (index < len);
                }
                completed("socT");
            },
            socU: function utilities_os_builderSocU():void {
                const data_win:os_sock_udp_windows[] = raw.socU as os_sock_udp_windows[],
                    len:number = data_win.length;
                let index:number = 0,
                    sock:os_sock = null;
                if (len > 0) {
                    do {
                        sock = {
                            "local-address": (data_win[index].LocalAddress === null)
                                ? ""
                                : data_win[index].LocalAddress,
                            "local-port": data_win[index].LocalPort,
                            "process": data_win[index].OwningProcess,
                            "remote-address": "",
                            "remote-port": 0,
                            "type": "udp"
                        };
                        sockets.push(sock);
                        index = index + 1;
                    } while (index < len);
                }
                completed("socU");
            },
            user: function utilities_os_builderUser():void {
                const data_win:os_user_windows[] = raw.user as os_user_windows[],
                    data_posix:string[] = raw.user as string[],
                    len:number = (win32 === true)
                        ? data_win.length
                        : data_posix.length,
                    proc = function utilities_os_builderUser_proc(name:string):number {
                        let index:number = processes.length,
                            count:number = 0;
                        if (index > 0) {
                            do {
                                index = index - 1;
                                if (processes[index].user === name && name !== "") {
                                    count = count + 1;
                                }
                            } while (index > 0);
                        }
                        return count;
                    };
                let index:number = 0,
                    user:os_user = null,
                    line:string[] = null,
                    uid:number = 0;
                if (len > 0) {
                    do {
                        if (win32 === true) {
                            uid = Number(data_win[index].SID.slice(data_win[index].SID.lastIndexOf("-") + 1));
                            user = {
                                lastLogin: new Date(data_win[index].LastLogon).getTime(),
                                name: data_win[index].Name,
                                proc: proc(data_win[index].Name),
                                type: (uid < 1000)
                                    ? "system"
                                    : "user",
                                uid: uid
                            };
                        } else {
                            line = data_posix[index].split(",");
                            uid = Number(line[1]);
                            user = {
                                lastLogin: (line[3] === undefined || line[3] === null || line[3] === "")
                                    ? 0
                                    : new Date(line[3]).getTime(),
                                name: line[0],
                                proc: Number(line[2]),
                                type: (uid > 0 && (uid < 1000 || uid > 65530))
                                    ? "system"
                                    : "user",
                                uid: uid
                            };
                        }
                        users.push(user);
                        index = index + 1;
                    } while (index < len);
                }
                completed("user");
            }
        },
        comparison = function utilities_os_comparison(config:config_os_comparison, time:number, type:"child"|"parent"):void {
            const list_new:Array<object>|string[] = (config.dict === true)
                    ? Object.keys(config.lists.new)
                    : config.lists.new as Array<object>,
                list_old:Array<object>|string[] = (config.dict === true)
                    ? Object.keys(config.lists.old)
                    : config.lists.old as Array<object>;
            let index_old:number = list_old.length,
                index_new:number = 0,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                item_new:any = null,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                item_old:any = null,
                match:boolean = false;
            if (time > 0 && index_old > 0 && index_new > 0) {
                do {
                    index_old = index_old - 1;
                    index_new = list_new.length;
                    match = false;
                    do {
                        if (config.dict === true) {
                            // @ts-expect-error - some data property abstracted from any object by array notation
                            item_new = config.lists.new[list_new[index_new]];
                            // @ts-expect-error - some data property abstracted from any object by array notation
                            item_old = config.lists.old[list_old[index_old]];
                        } else {
                            // @ts-expect-error - some data object from an array
                            item_new = config.lists.new[index_new];
                            // @ts-expect-error - some data object from an array
                            item_old = config.lists.old[index_old];
                        }
                        index_new = index_new - 1;
                        if (item_new[config.properties.parent] === item_old[config.properties.parent]) {
                            if (type === "parent" && config.properties.child !== null) {
                                if (item_new[config.properties.child].length > 0) {
                                    const child_config:config_os_comparison = {
                                        dict: false,
                                        lists: {
                                            new: item_new[config.properties.child],
                                            old: item_old[config.properties.child]
                                        },
                                        messages: config.messages,
                                        properties: config.properties
                                    };
                                    utilities_os_comparison(child_config, time, "child");
                                } else if (item_old[config.properties.child].length > 0) {
                                    log.application({
                                        action: "modify",
                                        config: null,
                                        message: (config.dict === true)
                                            ? config.messages.no_child(item_old, list_old[index_old] as string)
                                            : config.messages.no_child(item_old),
                                        status: "informational",
                                        time: Date.now(),
                                        type: "os"
                                    });
                                }
                            }
                            if (config.properties.parent !== "local-address" || (config.properties.parent === "local-address" && item_new["local-port"] === item_old["local-port"])) {
                                match = true;
                            }
                            break;
                        }
                    } while (index_new > 0);
                    if (match === false) {
                        log.application({
                            action: "modify",
                            config: null,
                            message: (config.dict === true)
                                ? config.messages[type].old(item_old, list_old[index_old] as string)
                                : config.messages[type].old(item_old),
                            status: "informational",
                            time: Date.now(),
                            type: "os"
                        });
                    }
                } while (index_old > 0);
                index_new = list_new.length;
                do {
                    index_new = index_new - 1;
                    index_old = list_old.length;
                    match = false;
                    do {
                        if (config.dict === true) {
                            // @ts-expect-error - some data property abstracted from any object by array notation
                            item_new = config.lists.new[list_new[index_new]];
                            // @ts-expect-error - some data property abstracted from any object by array notation
                            item_old = config.lists.old[list_old[index_old]];
                        } else {
                            // @ts-expect-error - some data object from an array
                            item_new = config.lists.new[index_new];
                            // @ts-expect-error - some data object from an array
                            item_old = config.lists.old[index_old];
                        }
                        index_old = index_old - 1;
                        if (item_new[config.properties[type]] === item_old[config.properties[type]]) {
                            match = true;
                            break;
                        }
                    } while (index_old > 0);
                    if (match === false) {
                        log.application({
                            action: "modify",
                            config: null,
                            message: (config.dict === true)
                                ? config.messages[type].new(item_new, list_new[index_new] as string)
                                : config.messages[type].new(item_new),
                            status: "informational",
                            time: Date.now(),
                            type: "os"
                        });
                    }
                } while (index_new > 0);
            }
        },
        difference:store_os_difference = {
            devs: {
                dict: false,
                lists: {
                    new: devices,
                    old: vars.os.devs.data
                },
                messages: {
                    child: null,
                    no_child: null,
                    parent: {
                        new: function utilities_os_differenceDevs_messagesParentNew(item:object):string {
                            const dev:os_devs = item as os_devs;
                            return `New device with name ${dev.name} and kernel module ${dev.kernel_module} came online.`;
                        },
                        old: function utilities_os_differenceDevs_messagesParentOld(item:object):string {
                            const dev:os_devs = item as os_devs;
                            return `Device with name ${dev.name} and kernel module ${dev.kernel_module} is no longer available.`;
                        }
                    }
                },
                properties: {
                    child: null,
                    parent: "kernel_module"
                }
            },
            disk: {
                dict: false,
                lists: {
                    new: disks,
                    old: vars.os.disk.data
                },
                messages: {
                    child: {
                        new: function utilities_os_differenceDisk_messagesChildNew(item:object):string {
                            const part:os_disk_partition = item as os_disk_partition;
                            return `Partition ${part.id} from disk ${part.diskName} of capacity ${part.size_total} is now available.`;
                        },
                        old: function utilities_os_differenceDisk_messagesChildOld(item:object):string {
                            const part:os_disk_partition = item as os_disk_partition;
                            return `Partition ${part.id} from disk ${part.diskName} of capacity ${part.size_total} is no longer available available.`;
                        }
                    },
                    no_child: function utilities_os_differenceDisk_messagesNoChild(item:object):string {
                        const disk:os_disk = item as os_disk;
                        return `Disk ${disk.name} had ${disk.partitions.length} partitions but now has none.`;
                    },
                    parent: {
                        new: function utilities_os_differenceDisk_messagesParentNew(item:object):string {
                            const disk:os_disk = item as os_disk;
                            return `New storage device ${disk.name} with capacity ${disk.size_disk} is now available.`;
                        },
                        old: function utilities_os_differenceDisk_messagesParentOld(item:object):string {
                            const disk:os_disk = item as os_disk;
                            return `Storage device ${disk.name} with capacity ${disk.size_disk} is no longer available.`;
                        }
                    }
                },
                properties: {
                    child: "partitions",
                    parent: "id"
                }
            },
            intr: {
                dict: true,
                lists: {
                    new: int,
                    old: vars.os.intr.data
                },
                messages: {
                    child: {
                        new: function utilities_os_differenceIntr_messagesChildNew(item:object, name:string):string {
                            const intr:node_os_NetworkInterfaceInfo = item as node_os_NetworkInterfaceInfo;
                            return `Address ${intr.address} from interface ${name} is now available.`;
                        },
                        old: function utilities_os_differenceIntr_messagesChildOld(item:object, name:string):string {
                            const intr:node_os_NetworkInterfaceInfo = item as node_os_NetworkInterfaceInfo;
                            return `Partition ${intr.address} from disk ${name} is no longer available available.`;
                        }
                    },
                    no_child: function utilities_os_differenceIntr_messagesNoChild(item:object, name:string):string {
                        const intr:Array<node_os_NetworkInterfaceInfo> = item as Array<node_os_NetworkInterfaceInfo>;
                        return `Network interface ${name} had ${intr.length} addresses assigned but now has none.`;
                    },
                    parent: {
                        new: function utilities_os_differenceIntr_messagesParentNew(item:object, name:string):string {
                            return `New network interface ${name} is now available.`;
                        },
                        old: function utilities_os_differenceIntr_messagesParentOld(item:object, name:string):string {
                            return `Network interface ${name} is no longer available.`;
                        }
                    }
                },
                properties: {
                    child: "address",
                    parent: "id"
                }
            },
            proc: {
                dict: false,
                lists: {
                    new: processes,
                    old: vars.os.proc.data
                },
                messages: {
                    child: null,
                    no_child: null,
                    parent: {
                        new: function utilities_os_differenceProc_messagesParentNew(item:object):string {
                            const proc:os_proc = item as os_proc;
                            return `New process ${proc.name} with id ${proc.id} came online.`;
                        },
                        old: function utilities_os_differenceProc_messagesParentOld(item:object):string {
                            const proc:os_proc = item as os_proc;
                            return `Process ${proc.name} with id ${proc.id} is no longer available.`;
                        }
                    }
                },
                properties: {
                    child: null,
                    parent: "id"
                }
            },
            serv: {
                dict: false,
                lists: {
                    new: services,
                    old: vars.os.serv.data
                },
                messages: {
                    child: null,
                    no_child: null,
                    parent: {
                        new: function utilities_os_differenceServ_messagesParentNew(item:object):string {
                            const serv:os_serv = item as os_serv;
                            return `New service ${serv.name} now available.`;
                        },
                        old: function utilities_os_differenceServ_messagesParentOld(item:object):string {
                            const serv:os_serv = item as os_serv;
                            return `Service ${serv.name} is removed.`;
                        }
                    }
                },
                properties: {
                    child: null,
                    parent: "name"
                }
            },
            sock: {
                dict: false,
                lists: {
                    new: sockets,
                    old: vars.os.sock.data
                },
                messages: {
                    child: null,
                    no_child: null,
                    parent: {
                        new: function utilities_os_differenceSock_messagesParentNew(item:object):string {
                            const sock:os_sock = item as os_sock;
                            return `New socket with local address ${sock["local-address"]} and port ${sock["local-port"]} came online.`;
                        },
                        old: function utilities_os_differenceSock_messagesParentOld(item:object):string {
                            const sock:os_sock = item as os_sock;
                            return `Socket with local address ${sock["local-address"]} with port ${sock["local-port"]} is no longer available.`;
                        }
                    }
                },
                properties: {
                    child: null,
                    parent: "local-address"
                }
            },
            user: {
                dict: false,
                lists: {
                    new: users,
                    old: vars.os.user.data
                },
                messages: {
                    child: null,
                    no_child: null,
                    parent: {
                        new: function utilities_os_differenceUser_messagesParentNew(item:object):string {
                            const user:os_user = item as os_user;
                            return `New user account with name ${user.name} came online.`;
                        },
                        old: function utilities_os_differenceUser_messagesParentOld(item:object):string {
                            const user:os_user = item as os_user;
                            return `User account with name ${user.name} is no longer available.`;
                        }
                    }
                },
                properties: {
                    child: null,
                    parent: "name"
                }
            }
        },
        main = function utilities_os_main(time:number):server_os {
            const mem:server_os_memoryUsage = process.memoryUsage(),
                gid:number = (typeof process.getgid === "undefined")
                    ? 0
                    : process.getgid(),
                uid:number = (typeof process.getuid === "undefined")
                    ? 0
                    : process.getuid(),
                output:server_os = {
                    devs: {
                        data: [],
                        time: 0
                    },
                    disk: {
                        data: [],
                        time: 0
                    },
                    intr: {
                        data: {},
                        time: 0
                    },
                    machine: {
                        cpu: {
                            arch: node.os.arch(),
                            cores: node.os.cpus().length,
                            endianness: node.os.endianness(),
                            frequency: node.os.cpus()[0].speed,
                            name: node.os.cpus()[0].model
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
                        cpuSystem: process.cpuUsage().system / 1e6,
                        cpuUser: process.cpuUsage().user / 1e6,
                        cwd: process.cwd(),
                        memory: {
                            external: mem.external,
                            rss: process.memoryUsage.rss(),
                            V8: mem.heapUsed
                        },
                        pid: process.pid,
                        platform: process.platform,
                        ppid: process.ppid,
                        uptime: process.uptime(),
                        versions: process.versions
                    },
                    proc: {
                        data: [],
                        time: 0
                    },
                    serv: {
                        data: [],
                        time: 0
                    },
                    sock: {
                        data: [],
                        time: 0
                    },
                    time: time,
                    user: {
                        data: [],
                        time: 0
                    },
                    user_account: {
                        gid: (gid === 0)
                            ? 1000
                            : gid,
                        homedir: node.os.homedir(),
                        uid: (gid === 0)
                            ? 1000
                            : uid
                    }
                };
            vars.os.time = time;
            vars.os.machine = output.machine;
            vars.os.os = output.os;
            vars.os.process = output.process;
            vars.os.user_account = output.user_account;
            return output;
        },
        completed = function utilities_os_complete(type:type_os_key):void {
            const keys:string[] = Object.keys(complete),
                now:number = Date.now();
            let index:number = keys.length;
            if (type_os !== "all" && type_os !== "main" && vars.os[type_os].time > 0) {
                comparison(difference[type_os], vars.os[type_os].time, "parent");
            }
            complete[type] = true;
            if (type_os === "all" && index > 0) {
                const output:server_os = main(now);
                do {
                    index = index - 1;
                    if (complete[keys[index]] === false) {
                        return;
                    }
                } while (index > 0);
                output.devs = {
                    data: devices,
                    time: now
                };
                output.disk = {
                    data: disks,
                    time: now
                };
                output.intr = {
                    data: int,
                    time: now
                };
                output.proc = {
                    data: processes,
                    time: now
                };
                output.serv = {
                    data: services,
                    time: now
                };
                output.sock = {
                    data: sockets,
                    time: now
                };
                output.user = {
                    data: users,
                    time: now
                };
                vars.os.devs = output.devs;
                vars.os.disk = output.disk;
                vars.os.intr = output.intr;
                vars.os.proc = output.proc;
                vars.os.serv = output.serv;
                vars.os.sock = output.sock;
                vars.os.user = output.user;
                callback({
                    data: output,
                    service: "dashboard-os-all"
                });
            } else if (type_os === "main") {
                const output:server_os = main(now);
                callback({
                    data: output,
                    service: "dashboard-os-main"
                });
            } else if (type_os === "devs") {
                vars.os.devs = {
                    data: devices,
                    time: now
                };
                callback({
                    data: vars.os.devs,
                    service: "dashboard-os-devs"
                });
            } else if (type_os === "disk") {
                vars.os.disk = {
                    data: disks,
                    time: now
                };
                callback({
                    data: vars.os.disk,
                    service: "dashboard-os-disk"
                });
            } else if (type_os === "intr") {
                vars.os.intr = {
                    data: int,
                    time: now
                };
                callback({
                    data: vars.os.intr,
                    service: "dashboard-os-intr"
                });
            } else if (type_os === "proc") {
                vars.os.proc = {
                    data: processes,
                    time: now
                };
                callback({
                    data: vars.os.proc,
                    service: "dashboard-os-proc"
                });
            } else if (type_os === "serv") {
                vars.os.serv = {
                    data: services,
                    time: now
                };
                callback({
                    data: vars.os.serv,
                    service: "dashboard-os-serv"
                });
            } else if (type_os === "sock" && complete.socT === true && complete.socU === true) {
                vars.os.sock = {
                    data: sockets,
                    time: now
                };
                callback({
                    data: vars.os.sock,
                    service: "dashboard-os-sock"
                });
            } else if (type_os === "user") {
                if (win32 === true) {
                    vars.os.proc = {
                        data: processes,
                        time: now
                    };
                }
                vars.os.user = {
                    data: users,
                    time: now
                };
                callback({
                    data: vars.os.user,
                    service: "dashboard-os-user"
                });
            }
        },
        spawning = function utilities_os_spawning(type:type_os_key):void {
            const spawn_complete = function utilities_os_spawnComplete(type:type_os_key, action:(type?:type_os_key) => void):void {
                    flags[type] = true;
                    if ((type === "disk" || type === "part" || type === "volu") && flags.disk === true && flags.part === true && flags.volu === true) {
                        if (action === completed) {
                            completed("disk");
                        } else {
                            builder.disk();
                        }
                    } else if (type !== "disk" && type !== "part" && type !== "volu") {
                        action(type);
                    }
                };
            spawn_item[type] = spawn(vars.commands[type], function utilities_os_spawning_close(output:core_spawn_output):void {
                // eslint-disable-next-line @typescript-eslint/no-this-alias, no-restricted-syntax
                const type:type_os_key = output.type as type_os_key,
                    temp:string = output.stdout.trim().replace(/\x1B\[33;1mWARNING: Resulting JSON is truncated as serialization has exceeded the set depth of \d.\x1B\[0m\s+/, ""),
                    parseTry = function utilities_os_spawning_close_parseTry():boolean {
                        if (win32 === false) {
                            if ((type === "proc" || type === "socT" || type === "user")) {
                                raw[type] = temp.replace(/\n\s+/, "\n").split("\n");
                                return true;
                            }
                            if (type === "devs") {
                                raw.devs = temp.split("\n\n");
                                return true;
                            }
                        }
                        // eslint-disable-next-line no-restricted-syntax
                        try {
                            raw[type] = (win32 === false && type === "disk")
                                ? JSON.parse(temp).blockdevices
                                : JSON.parse(temp);
                        } catch (e:unknown) {
                            log.application({
                                action: "activate",
                                config: e as node_error,
                                message: `Error parsing operating system data of type ${type}.`,
                                status: "error",
                                time: Date.now(),
                                type: "os"
                            });
                            spawn_complete(type, completed);
                            return false;
                        }
                        return true;
                    };

                // parse the data
                if (parseTry() === false) {
                    return;
                }
                flags[type] = true;
                spawn_complete(type, builder[type]);
            }, {
                error: function utilities_os_spawning_spawnError(err:node_childProcess_ExecException):void {
                    spawn_complete(type, completed);
                },
                shell: shell,
                type: type
            });
            spawn_item[type].child();
        };
    if (type_os === "all" || type_os === undefined || type_os === null) {
        type_os = "all";
        if (win32 === true) {
            spawning("part");
            spawning("socU");
            spawning("volu");
        }
        spawning("disk");
        spawning("proc");
        spawning("serv");
        spawning("socT");
        if (win32 === false) {
            // for windows spawning("user") is called from builder.proc
            spawning("user");
        }
    } else if (type_os === "devs") {
        spawning("devs");
    } else if (type_os === "disk") {
        if (win32 === true) {
            spawning("part");
            spawning("volu");
        }
        spawning("disk");
    } else if (type_os === "intr") {
        completed("disk");
    } else if (type_os === "proc") {
        spawning("proc");
    } else if (type_os === "serv") {
        spawning("serv");
    } else if (type_os === "sock") {
        if (win32 === true) {
            spawning("socU");
        }
        spawning("socT");
    } else if (type_os === "user") {
        if (win32 === true) {
            // for windows spawning("user") is called from builder.proc
            spawning("proc");
        } else {
            spawning("user");
        }
    } else if (type_os === "main") {
        completed("disk");
    }
};

export default os;