
import broadcast from "../transmit/broadcast.ts";
import directory from "../utilities/directory.ts";
import file from "../utilities/file.ts";
import node from "../core/node.ts";
import spawn from "../core/spawn.ts";
import vars from "../core/vars.ts";

// cspell: words CPUPerc, MemPerc, pids, rbytes, usec, wbytes

const statistics:core_statistics = {
    change: function services_statisticsChange(data:socket_data):void {
        const update:services_statistics_change = data.data as services_statistics_change,
            list:store_server_config = {},
            keys:string[] = Object.keys(vars.servers),
            len:number = keys.length,
            file_data:core_servers_file = {
                "compose-variables": vars.compose.variables,
                dashboard_id: vars.dashboard_id,
                servers: {},
                stats: {
                    frequency: update.frequency,
                    records: update.records
                }
            };
        let index:number = 0;
        if (len > 0) {
            do {
                list[keys[index]] = vars.servers[keys[index]].config;
                index = index + 1;
            } while (index < len);
        }
        file_data.servers = list;
        vars.stats.frequency = update.frequency;
        vars.stats.records = update.records;
        file.write({
            callback: null,
            contents: JSON.stringify(file_data),
            location: `${vars.path.project}servers.json`,
            section: "statistics"
        });
    },
    data: function services_statisticsData():void {
        const start_time:bigint = process.hrtime.bigint(),
            container_keys:string[] = Object.keys(vars.compose.containers),
            container_len:number = container_keys.length,
            cpu:os_node_cpuUsage = process.cpuUsage(),
            mem:os_node_memoryUsage = process.memoryUsage(),
            cpu_total:number = (function services_statisticsData_cpuTotal():number {
                const cpus:os_node_cpu = node.os.cpus();
                let output:number = 0,
                    index:number = cpus.length;
                if (index > 0) {
                    do {
                        index = index - 1;
                        output = output + (cpus[index].times.idle + cpus[index].times.irq + cpus[index].times.nice + cpus[index].times.sys + cpus[index].times.user);
                    } while (index > 0);
                }
                return output;
            }()),
            cpu_raw:number = (cpu.system + cpu.user) / 1000,
            cpu_per:number = Math.round((cpu_raw / cpu_total) * 100000) / 100,
            // net function not used for docker containers
            empty = function services_statisticsData_empty(id:string):void {
                vars.stats.containers[id] = {
                    cpu: {
                        data: [],
                        labels: []
                    },
                    disk_in: {
                        data: [],
                        labels: []
                    },
                    disk_out: {
                        data: [],
                        labels: []
                    },
                    mem: {
                        data: [],
                        labels: []
                    },
                    net_in: {
                        data: [],
                        labels: []
                    },
                    net_out: {
                        data: [],
                        labels: []
                    },
                    threads: {
                        data: [],
                        labels: []
                    }
                };
            },
            disk_complete = function services_statisticsData_diskComplete():void {
                const payload = function services_statisticsData_diskComplete_payload(container_keys:string[], actual_keys:string[]):void {
                    const output:services_statistics_data = {
                        containers: vars.stats.containers,
                        duration: Number(process.hrtime.bigint() - start_time),
                        frequency: vars.stats.frequency,
                        now: vars.stats.now,
                        records: vars.stats.records
                    };
                    vars.stats.duration = output.duration;
                    if (container_keys !== null && actual_keys !== null) {
                        let index:number = container_keys.length;
                        if (index > 0) {
                            do {
                                index = index - 1;
                                if (actual_keys.includes(container_keys[index]) === false) {
                                    vars.stats.containers[container_keys[index]] = null;
                                }
                            } while (index > 0);
                        }
                    }
                    broadcast(vars.dashboard_id, "dashboard", {
                        data: output,
                        service: "dashboard-statistics-data"
                    });
                };
                if (container_len === 0) {
                    payload(null, null);
                } else if (vars.path.cgroup === null) {
                    spawn("docker stats --no-stream --no-trunc --format json", function services_statisticsData_diskComplete_spawnStats(output:core_spawn_output):void {
                        const obj:string = `[${output.stdout.replace(/\}\n/g, "},")}]`.replace(/\},\]$/, "}]"),
                            data:core_docker_status = JSON.parse(obj),
                            len:number = data.length,
                            actual_keys:string[] = [];
                        let index:number = len,
                            id:string = "",
                            disk:string[] = null,
                            net_data:string[] = null;
                        if (index > 0) {
                            do {
                                index = index - 1;
                                id = data[index].ID;
                                if (vars.stats.containers[id] === undefined) {
                                    empty(id);
                                }
                                actual_keys.push(id);
                                disk = data[index].BlockIO.split(" / ");
                                net_data = data[index].NetIO.split(" / ");
                                vars.stats.containers[id].cpu.data.push(cpu_total * (Number(data[index].CPUPerc.replace("%", "")) / 1000));
                                vars.stats.containers[id].cpu.labels.push(data[index].CPUPerc);
                                vars.stats.containers[id].disk_in.data.push(disk[0].bytes());
                                vars.stats.containers[id].disk_out.data.push(disk[1].bytes());
                                vars.stats.containers[id].mem.data.push(data[index].MemUsage.split(" / ")[0].bytes());
                                vars.stats.containers[id].mem.labels.push(data[index].MemPerc);
                                vars.stats.containers[id].net_in.data.push(net_data[0].bytes());
                                vars.stats.containers[id].net_out.data.push(net_data[1].bytes());
                                vars.stats.containers[id].threads.data.push(data[index].PIDs);
                                splice(vars.stats.containers[id].cpu.data, false);
                                splice(vars.stats.containers[id].disk_in.data, false);
                                splice(vars.stats.containers[id].disk_out.data, false);
                                splice(vars.stats.containers[id].mem.data, false);
                                splice(vars.stats.containers[id].net_in.data, false);
                                splice(vars.stats.containers[id].net_out.data, false);
                                splice(vars.stats.containers[id].threads.data, false);
                                splice(vars.stats.containers[id].cpu.labels, false);
                                splice(vars.stats.containers[id].disk_in.labels, true);
                                splice(vars.stats.containers[id].disk_out.labels, true);
                                splice(vars.stats.containers[id].mem.labels, false);
                                splice(vars.stats.containers[id].net_in.labels, true);
                                splice(vars.stats.containers[id].net_out.labels, true);
                                splice(vars.stats.containers[id].threads.labels, true);
                            } while (index > 0);
                        }
                        payload(container_keys, actual_keys);
                    }).execute();
                } else {
                    spawn("docker ps --no-trunc --format json", function services_statisticsData_diskComplete_spawnPS(output:core_spawn_output):void {
                        const obj:string = `[${output.stdout.replace(/\}\n/g, "},")}]`.replace(/\},\]$/, "}]"),
                            complete = function services_statisticsData_diskComplete_spawnPS_complete(identifier:string, name:"cpu"|"io"|"mem"|"net"|"threads"):void {
                                flags[identifier][name] =  true;
                                if (flags[identifier].cpu === true && flags[identifier].io === true && flags[identifier].mem === true && flags[identifier].net === true && flags[identifier].threads === true) {
                                    splice(vars.stats.containers[identifier].cpu.data, false);
                                    splice(vars.stats.containers[identifier].disk_in.data, false);
                                    splice(vars.stats.containers[identifier].disk_out.data, false);
                                    splice(vars.stats.containers[identifier].mem.data, false);
                                    splice(vars.stats.containers[identifier].net_in.data, false);
                                    splice(vars.stats.containers[identifier].net_out.data, false);
                                    splice(vars.stats.containers[identifier].threads.data, false);
                                    splice(vars.stats.containers[identifier].cpu.labels, false);
                                    splice(vars.stats.containers[identifier].disk_in.labels, true);
                                    splice(vars.stats.containers[identifier].disk_out.labels, true);
                                    splice(vars.stats.containers[identifier].mem.labels, false);
                                    splice(vars.stats.containers[identifier].net_in.labels, true);
                                    splice(vars.stats.containers[identifier].net_out.labels, true);
                                    splice(vars.stats.containers[identifier].threads.labels, true);
                                    count = count + 1;
                                    if (count === len) {
                                        payload(container_keys, actual_keys);
                                    }
                                }
                            },
                            cpu = function services_statisticsData_diskComplete_spawnPS_cpu(file:Buffer, location:string, identifier:string):void {
                                if (vars.stats.containers[identifier] !== undefined && vars.stats.containers[identifier] !== null) {
                                    const data:string = file.toString(),
                                        key:string = "system_usec ",
                                        segment:string = data.slice(data.indexOf(key) + key.length),
                                        value:number = Number(segment.slice(0, segment.indexOf("\n"))) / 1000,
                                        per:number = Math.round((value / cpu_total) * 100000) / 100;
                                    vars.stats.containers[identifier].cpu.data.push(value);
                                    vars.stats.containers[identifier].cpu.labels.push(`${(per < 0.01) ? "< 0.01" : per}%`);
                                }
                                complete(identifier, "cpu");
                            },
                            io = function services_statisticsData_diskComplete_spawnPS_io(file:Buffer, location:string, identifier:string):void {
                                if (vars.stats.containers[identifier] !== undefined && vars.stats.containers[identifier] !== null) {
                                    const data:string[] = file.toString().split(" ");
                                    let index_io:number = data.length;
                                    if (index_io > 0) {
                                        do {
                                            index_io = index_io - 1;
                                            if (data[index_io].indexOf("rbytes=") === 0) {
                                                vars.stats.containers[identifier].disk_in.data.push(Number(data[index_io].replace("rbytes=", "")));
                                            } else if (data[index_io].indexOf("wbytes=") === 0) {
                                                vars.stats.containers[identifier].disk_out.data.push(Number(data[index_io].replace("wbytes=", "")));
                                            }
                                        } while (index_io > 0);
                                    }
                                }
                                complete(identifier, "io");
                            },
                            mem = function services_statisticsData_diskComplete_spawnPS_mem(file:Buffer, location:string, identifier:string):void {
                                if (vars.stats.containers[identifier] !== undefined && vars.stats.containers[identifier] !== null) {
                                    const value:number = Number(file.toString()),
                                        per:number = Math.round((value / vars.os.machine.memory.total) * 10000) / 100;
                                    vars.stats.containers[identifier].mem.data.push(value);
                                    vars.stats.containers[identifier].mem.labels.push(`${(per < 0.01) ? "< 0.01" : per}%`);
                                }
                                complete(identifier, "mem");
                            },
                            net = function services_statisticsData_diskComplete_spawnPS_net(output:core_spawn_output):void {
                                const str:string = output.stdout.trim(),
                                    data:transmit_linux_ip = (str.charAt(0) === "[" && str.charAt(str.length - 1) === "]")
                                        ? JSON.parse(str)
                                        : null;
                                let index_net:number = (data === null)
                                        ? 0
                                        : data.length,
                                    read:number = 0,
                                    write:number = 0;
                                if (vars.stats.containers[output.type] !== undefined && vars.stats.containers[output.type] !== null) {
                                    if (index_net > 0) {
                                        do {
                                            index_net = index_net - 1;
                                            read = read + data[index_net].stats64.rx.bytes;
                                            write = write + data[index_net].stats64.tx.bytes;
                                        } while (index_net > 0);
                                        vars.stats.containers[output.type].net_in.data.push(read);
                                        vars.stats.containers[output.type].net_out.data.push(write);
                                    }
                                }
                                complete(output.type, "net");
                            },
                            threads = function services_statisticsData_diskComplete_spawnPS_threads(file:Buffer, location:string, identifier:string):void {
                                if (vars.stats.containers[identifier] !== undefined && vars.stats.containers[identifier] !== null) {
                                    vars.stats.containers[identifier].threads.data.push(Number(file.toString()));
                                }
                                complete(identifier, "threads");
                            },
                            flags:store_store_flag = {},
                            data:core_docker_status = JSON.parse(obj),
                            len:number = data.length,
                            actual_keys:string[] = [];
                        let count:number = 0,
                            index:number = len,
                            id:string = "";
                        if (index > 0) {
                            do {
                                index = index - 1;
                                id = data[index].ID;
                                if (vars.stats.containers[id] === undefined) {
                                    empty(id);
                                }
                                actual_keys.push(id);
                                flags[id] = {
                                    cpu: false,
                                    io: false,
                                    mem: false,
                                    net: false,
                                    threads: false
                                };
                                file.read({
                                    callback: cpu,
                                    identifier: id,
                                    location: `${vars.path.cgroup}docker-${id}.scope/cpu.stat`,
                                    no_file: null,
                                    section: "statistics"
                                });
                                file.read({
                                    callback: io,
                                    identifier: id,
                                    location: `${vars.path.cgroup}docker-${id}.scope/io.stat`,
                                    no_file: null,
                                    section: "statistics"
                                });
                                file.read({
                                    callback: mem,
                                    identifier: id,
                                    location: `${vars.path.cgroup}docker-${id}.scope/memory.current`,
                                    no_file: null,
                                    section: "statistics"
                                });
                                file.read({
                                    callback: threads,
                                    identifier: id,
                                    location: `${vars.path.cgroup}docker-${id}.scope/pids.current`,
                                    no_file: null,
                                    section: "statistics"
                                });
                                spawn(`docker exec ${id} ip -json -s link`, net, {
                                    type: id
                                }).execute();
                            } while (index > 0);
                        }
                    }).execute();
                }
                if (vars.stats.frequency > 0) {
                    setTimeout(services_statisticsData, vars.stats.frequency);
                }
            },
            disk = function services_statisticsData_disk(directory_list:directory_list|string[]):void {
                const list:directory_list = directory_list as directory_list;
                let size:number = 0,
                    index:number = list.length;
                do {
                    index = index - 1;
                    size = size + list[index][5].size;
                } while (index > 0);
                vars.stats.containers.application.disk_out.data.push(size);
                splice(vars.stats.containers.application.disk_out.data, false);
                disk_complete();
            },
            net = function services_statisticsData_netIO(type:"in"|"out"):void {
                const keys:string[] = Object.keys(vars.server_meta),
                    sockets = function core_status_netIO_sockets(list:websocket_client[]):void {
                        let index_list:number = list.length;
                        if (index_list > 0) {
                            do {
                                index_list = index_list - 1;
                                if (list[index] !== undefined) {
                                    if (type === "in") {
                                        start = start + list[index].bytesRead;
                                    } else {
                                        start = start + list[index].bytesWritten;
                                    }
                                }
                            } while (index_list > 0);
                        }
                    };
                let start:number = (type === "in")
                        ? vars.stats.net_in
                        : vars.stats.net_out,
                    index:number = keys.length,
                    encryption:"both"|"open"|"secure";
                if (index > 0) {
                    do {
                        index = index - 1;
                        encryption = vars.servers[keys[index]].config.encryption;
                        if (encryption === "both") {
                            sockets(vars.server_meta[keys[index]].sockets.open);
                            sockets(vars.server_meta[keys[index]].sockets.secure);
                        } else {
                            sockets(vars.server_meta[keys[index]].sockets[encryption]);
                        }
                    } while (index > 0);
                }
                vars.stats.containers.application[`net_${type}`].data.push(start);
            },
            splice = function services_statisticsData_splice(item:number[]|string[], empty_labels:boolean):void {
                const len:number = item.length;
                if (empty_labels === true) {
                    if (len < vars.stats.records) {
                        const num:number[] = item as number[];
                        num.push((len + 1));
                    }
                } else {
                    if (len > vars.stats.records) {
                        item.splice(0, len - vars.stats.records);
                    }
                }
            };
        if (vars.stats.containers.application === undefined) {
            empty("application");
        }
        // gathering total time and then converting microseconds into milliseconds because CPU timing is in milliseconds
        vars.stats.containers.application.cpu.data.push(cpu_raw);
        vars.stats.containers.application.cpu.labels.push(`${(cpu_per) < 0.01 ? "< 0.01" : cpu_per}%`);
        vars.stats.containers.application.disk_in.data.push(0);
        vars.stats.containers.application.mem.data.push(mem.arrayBuffers + mem.external + mem.heapUsed + mem.rss);
        vars.stats.containers.application.mem.labels.push(`${Math.round(((mem.arrayBuffers + mem.external + mem.heapUsed + mem.rss) / vars.os.machine.memory.total) * 10000) / 100}%`);
        vars.stats.containers.application.threads.data.push(vars.stats.children);
        net("in");
        net("out");
        vars.stats.now = Date.now();
        splice(vars.stats.containers.application.cpu.data, false);
        splice(vars.stats.containers.application.mem.data, false);
        splice(vars.stats.containers.application.disk_in.data, false);
        splice(vars.stats.containers.application.net_in.data, false);
        splice(vars.stats.containers.application.net_out.data, false);
        splice(vars.stats.containers.application.threads.data, false);
        splice(vars.stats.containers.application.cpu.labels, false);
        splice(vars.stats.containers.application.disk_in.labels, true);
        splice(vars.stats.containers.application.disk_out.labels, true);
        splice(vars.stats.containers.application.mem.labels, false);
        splice(vars.stats.containers.application.net_in.labels, true);
        splice(vars.stats.containers.application.net_out.labels, true);
        splice(vars.stats.containers.application.threads.labels, true);
        directory({
            callback: disk,
            depth: 0,
            exclusions: [],
            mode: "read",
            path: vars.path.project,
            relative: false,
            search: null,
            symbolic: true
        });
    }
};

export default statistics;

// {"BlockIO":"356MB / 349MB","CPUPerc":"0.17%","Container":"256c9e9f1555","ID":"256c9e9f1555e5e5d9592c109293c3399f2d9fcc6e50fa071ed57b98ad786d44","MemPerc":"1.16%","MemUsage":"370.8MiB / 31.26GiB","Name":"mealie","NetIO":"15.5MB / 3.1MB","PIDs":"6"}

// windows - web_server - cpu     -   ((get-process -id 16992).CPU / (Get-WmiObject -Class Win32_Processor | Select-Object -ExpandProperty NumberOfLogicalProcessors))  / 10
// windows - web_server - mem     -   ((get-process -id 16992).workingSet / (Get-WmiObject -Class Win32_ComputerSystem | Select-Object -ExpandProperty TotalPhysicalMemory)) * 100
// windows - web_server - disk    -   (Get-Counter -Counter "\Process(firefox)\IO Write Operations/sec").counterSamples.cookedValue     (Get-Counter -Counter "\Process(firefox)\IO Read Operations/sec").counterSamples.cookedValue
// windows - web_server - net     -   (Get-Counter -Counter "\Process(firefox)\IO Write Bytes/sec").counterSamples.cookedValue     (Get-Counter -Counter "\Process(firefox)\IO Read Bytes/sec").counterSamples.cookedValue
// windows - web_server - threads -   (Get-Counter -Counter "\Process(firefox)\thread count").counterSamples.cookedValue
// linux   - web_server - cpu     -   ps -p 425114 -o %cpu --no-headers
// linux   - web_server - mem     -   ps -p 425114 -o %mem --no-headers
// linux   - web_server - disk    -   cat /proc/425114/io    read_bytes, write_bytes
// linux   - web_server - net     -   cat /proc/425114/io    IPExt -> InOctets, OutOctets
// linux   - web_server - threads -   ps huH p 425114 | wc -l
// node    - node       - cpu     -   (process.cpuUsage().system + process.cpuUsage().user) / sum of cpu times
// node    - node       - disk    -   not used
// node    - node       - mem     -   (sum of memory types from process.memoryUsage()) / vars.os.machine.memory.total
// node    - node       - net     -   custom solution, storing bytes from closed sockets and adding bytes from active sockets
// node    - node       - threads -   custom solution, counting child processes from the one library that opens and closes child processes
// docker  - docker     - cpu     -   stats_list[index].CPUPerc
// docker  - docker     - mem     -   stats_list[index].MemPerc
// docker  - docker     - disk    -   stats_list[index].BlockIO
// docker  - docker     - net     -   stats_list[index].NetIO
// docker  - docker     - threads -   stats_list[index].PIDs


// for windows need to cache
// * (Get-WmiObject -Class Win32_Processor | Select-Object -ExpandProperty NumberOfLogicalProcessors)
// * (Get-WmiObject -Class Win32_ComputerSystem | Select-Object -ExpandProperty TotalPhysicalMemory)

// for a windows process need to cache
// * name from process thread - (get-process -id 16992).name

// docker command
// * docker stats - docker stats --no-stream --no-trunc --format json

// * windows - IO Write/Read Operations - count of transfers/requests/operations to all sources
// * windows - IO write/read bytes      - count of bytes to all sources

// node cpu time is milliseconds
// docker (linux cgroup) cpu time is microseconds