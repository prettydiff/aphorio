
import broadcast from "../transmit/broadcast.ts";
import directory from "../utilities/directory.ts";
import file from "../utilities/file.ts";
import node from "../core/node.ts";
import spawn from "../core/spawn.ts";
import vars from "../core/vars.ts";

// cspell: words CPUPerc, MemPerc

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
        const container_keys:string[] = Object.keys(vars.compose.containers),
            container_len:number = container_keys.length,
            cpu:os_node_cpuUsage = process.cpuUsage(),
            mem:os_node_memoryUsage = process.memoryUsage(),
            cpus:os_node_cpu = node.os.cpus(),
            cpu_total:number = cpus[0].times.idle + cpus[0].times.irq + cpus[0].times.nice + cpus[0].times.sys + cpus[0].times.user,
            cpu_raw:number = (cpu.system + cpu.user) / 1000,
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
            complete = function services_statisticsData_complete():void {
                if (container_len === 0) {
                    const payload:services_statistics_data = {
                        containers: {
                            application: vars.stats.containers.application
                        },
                        frequency: vars.stats.frequency,
                        now: vars.stats.now,
                        records: vars.stats.records
                    };
                    broadcast(vars.dashboard_id, "dashboard", {
                        data: payload,
                        service: "dashboard-statistics-data"
                    });
                } else {
                    spawn("docker stats --no-stream --no-trunc --format json", function services_statisticsData_spawnDocker(output:core_spawn_output):void {
                        const obj:string = `[${output.stdout.replace(/\}\n/g, "},")}]`.replace(/\},\]$/, "}]"),
                            data:core_docker_status = JSON.parse(obj),
                            actual_id:string[] = [],
                            payload:services_statistics_data = {
                                containers: vars.stats.containers,
                                frequency: vars.stats.frequency,
                                now: vars.stats.now,
                                records: vars.stats.records
                            };
                        let index:number = data.length,
                            disk:string[] = null,
                            net:string[] = null,
                            cpu_value:number = 0;
                        if (index > 0) {
                            do {
                                index = index - 1;
                                disk = data[index].BlockIO.split(" / ");
                                net = data[index].NetIO.split(" / ");
                                if (vars.stats.containers[data[index].ID] === undefined) {
                                    empty(data[index].ID);
                                }
                                actual_id.push(data[index].ID);
                                cpu_value = Number(data[index].CPUPerc.replace("%", ""));
                                vars.stats.containers[data[index].ID].cpu.data.push(cpu_value);
                                vars.stats.containers[data[index].ID].cpu.labels.push(Math.round(cpu_total * cpu_value * 100) / 100);
                                vars.stats.containers[data[index].ID].disk_in.data.push(disk[0].bytes());
                                vars.stats.containers[data[index].ID].disk_out.data.push(disk[1].bytes());
                                vars.stats.containers[data[index].ID].mem.data.push(Number(data[index].MemPerc.replace("%", "")));
                                vars.stats.containers[data[index].ID].mem.labels.push(data[index].MemUsage.split(" / ")[0].bytes());
                                vars.stats.containers[data[index].ID].net_in.data.push(net[0].bytes());
                                vars.stats.containers[data[index].ID].net_out.data.push(net[1].bytes());
                                vars.stats.containers[data[index].ID].threads.data.push(data[index].PIDs);
                                splice(vars.stats.containers[data[index].ID].cpu.data, false);
                                splice(vars.stats.containers[data[index].ID].disk_in.data, false);
                                splice(vars.stats.containers[data[index].ID].disk_out.data, false);
                                splice(vars.stats.containers[data[index].ID].mem.data, false);
                                splice(vars.stats.containers[data[index].ID].net_in.data, false);
                                splice(vars.stats.containers[data[index].ID].net_out.data, false);
                                splice(vars.stats.containers[data[index].ID].threads.data, false);
                                splice(vars.stats.containers[data[index].ID].cpu.labels, false);
                                splice(vars.stats.containers[data[index].ID].disk_in.labels, true);
                                splice(vars.stats.containers[data[index].ID].disk_out.labels, true);
                                splice(vars.stats.containers[data[index].ID].mem.labels, false);
                                splice(vars.stats.containers[data[index].ID].net_in.labels, true);
                                splice(vars.stats.containers[data[index].ID].net_out.labels, true);
                                splice(vars.stats.containers[data[index].ID].threads.labels, true);
                            } while (index > 0);
                            index = container_len;
                            do {
                                index = index - 1;
                                if (actual_id.includes(container_keys[index]) === false) {
                                    vars.stats.containers[container_keys[index]] = null;
                                }
                            } while (index > 0);
                        }
                        broadcast(vars.dashboard_id, "dashboard", {
                            data: payload,
                            service: "dashboard-statistics-data"
                        });
                    }).execute();
                }
                if (vars.stats.frequency > 0) {
                    setTimeout(services_statisticsData, vars.stats.frequency);
                }
            },
            disk = function services_statisticsData_disk(directory_list:string[]|directory_list):void {
                const list:directory_list = directory_list as directory_list;
                let size:number = 0,
                    index:number = list.length;
                do {
                    index = index - 1;
                    size = size + list[index][5].size;
                } while (index > 0);
                vars.stats.containers.application.disk_out.data.push(size);
                splice(vars.stats.containers.application.disk_out.data, false);
                complete();
            },
            net = function services_statisticsData_netIO(type:"in"|"out"):void {
                const keys:string[] = Object.keys(vars.server_meta),
                    sockets = function core_status_netIO_sockets(list:websocket_client[]):void {
                        let index_list:number = list.length;
                        if (index_list > 0) {
                            do {
                                index_list = index_list - 1;
                                if (type === "in") {
                                    start = start + list[index].bytesRead;
                                } else {
                                    start = start + list[index].bytesWritten;
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
        vars.stats.containers.application.cpu.data.push(Math.round((cpu_raw / cpu_total) * 1000000) / 10000);
        vars.stats.containers.application.cpu.labels.push(cpu_raw);
        vars.stats.containers.application.disk_in.data.push(0);
        vars.stats.containers.application.mem.data.push(Math.round(((mem.arrayBuffers + mem.external + mem.heapUsed + mem.rss) / vars.os.machine.memory.total) * 10000) / 100);
        vars.stats.containers.application.mem.labels.push(mem.arrayBuffers + mem.external + mem.heapUsed + mem.rss);
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