
import broadcast from "../transmit/broadcast.ts";
import file from "../utilities/file.ts";
import node from "../core/node.ts";
import spawn from "../core/spawn.ts";
import vars from "../core/vars.ts";

// cspell: words CPUPerc, MemPerc

const statistics:core_statistics = {
    data: function services_statisticsData():void {
        const container_keys:string[] = Object.keys(vars.compose.containers),
            container_len:number = container_keys.length,
            cpu:os_node_cpuUsage = process.cpuUsage(),
            mem:os_node_memoryUsage = process.memoryUsage(),
            cpus:os_node_cpu = node.os.cpus(),
            // net function not used for docker containers
            net = function services_statistics_netIO(type:"in"|"out"):void {
                let start:number = (type === "in")
                        ? vars.stats.net_in
                        : vars.stats.net_out;
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
                let index:number = keys.length,
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
                vars.stats.application[`net_${type}`].data.push(start);
            },
            splice = function services_statisticsData_splice(item:number[]|string[], empty_labels:boolean):void {
                const len:number = item.length;
                if (empty_labels === true) {
                    if (len < vars.stats.records) {
                        const str:string[] = item as string[];
                        str.push((len + 1).toString());
                    }
                } else {
                    if (len > vars.stats.records) {
                        item.splice(0, len - vars.stats.records);
                    }
                }
            },
            now:number = Date.now(),
            payload:services_statistics_data = {
                application: vars.stats.application,
                docker: vars.stats.docker,
                frequency: vars.stats.frequency,
                now: now,
                records: vars.stats.records
            };
        // gathering total time and then converting microseconds into milliseconds because CPU timing is in milliseconds
        vars.stats.application.cpu.data.push((cpu.system + cpu.user) / 1000);
        vars.stats.application.cpu.labels.push(`${(((cpu.system + cpu.user) / 1000) / (cpus[0].times.idle + cpus[0].times.irq + cpus[0].times.nice + cpus[0].times.sys + cpus[0].times.user)) * 100}%`);
        vars.stats.application.mem.data.push(mem.arrayBuffers + mem.external + mem.heapUsed + mem.rss);
        vars.stats.application.mem.labels.push(`${((mem.arrayBuffers + mem.external + mem.heapUsed + mem.rss) / vars.os.machine.memory.total) * 100}%`);
        vars.stats.application.threads.data.push(vars.stats.children);
        net("in");
        net("out");
        vars.stats.now = now;
        splice(vars.stats.application.cpu.data, false);
        splice(vars.stats.application.mem.data, false);
        splice(vars.stats.application.net_in.data, false);
        splice(vars.stats.application.net_out.data, false);
        splice(vars.stats.application.threads.data, false);
        splice(vars.stats.application.cpu.labels, false);
        splice(vars.stats.application.mem.labels, false);
        splice(vars.stats.application.net_in.labels, true);
        splice(vars.stats.application.net_out.labels, true);
        splice(vars.stats.application.threads.labels, true);
        if (container_len === 0) {
            broadcast(vars.dashboard_id, "dashboard", {
                data: payload,
                service: "dashboard-statistics-data"
            });
        } else {
            spawn("docker stats --no-stream --no-trunc --format json", function services_statisticsData_spawnDocker(output:core_spawn_output):void {
                const obj:string = `[${output.stdout.replace(/\}\n/g, "},")}]`.replace(/\},\]$/, "}]"),
                    data:core_docker_status = JSON.parse(obj),
                    payload_id:string[] = Object.keys(payload.docker),
                    actual_id:string[] = [];
                let index:number = data.length,
                    disk:string[] = null,
                    net:string[] = null;
                if (index > 0) {
                    do {
                        index = index - 1;
                        disk = data[index].BlockIO.split(" / ");
                        net = data[index].NetIO.split(" / ");
                        if (payload.docker[data[index].ID] === undefined) {
                            payload.docker[data[index].ID] = {
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
                        }
                        actual_id.push(data[index].ID);
                        vars.stats.docker[data[index].ID].cpu.data.push(Number(data[index].CPUPerc.replace("%", "")));
                        vars.stats.docker[data[index].ID].disk_in.data.push(disk[0].bytes());
                        vars.stats.docker[data[index].ID].disk_out.data.push(disk[1].bytes());
                        vars.stats.docker[data[index].ID].mem.data.push(data[index].MemUsage.split(" / ")[0].bytes());
                        vars.stats.docker[data[index].ID].mem.labels.push(data[index].MemPerc);
                        vars.stats.docker[data[index].ID].net_in.data.push(net[0].bytes());
                        vars.stats.docker[data[index].ID].net_out.data.push(net[1].bytes());
                        vars.stats.docker[data[index].ID].threads.data.push(data[index].PIDs);
                        splice(vars.stats.docker[data[index].ID].cpu.data, false);
                        splice(vars.stats.docker[data[index].ID].disk_in.data, false);
                        splice(vars.stats.docker[data[index].ID].disk_out.data, false);
                        splice(vars.stats.docker[data[index].ID].mem.data, false);
                        splice(vars.stats.docker[data[index].ID].net_in.data, false);
                        splice(vars.stats.docker[data[index].ID].net_out.data, false);
                        splice(vars.stats.docker[data[index].ID].threads.data, false);
                        splice(vars.stats.docker[data[index].ID].cpu.labels, true);
                        splice(vars.stats.docker[data[index].ID].disk_in.labels, true);
                        splice(vars.stats.docker[data[index].ID].disk_out.labels, true);
                        splice(vars.stats.docker[data[index].ID].mem.labels, false);
                        splice(vars.stats.docker[data[index].ID].net_in.labels, true);
                        splice(vars.stats.docker[data[index].ID].net_out.labels, true);
                        splice(vars.stats.docker[data[index].ID].threads.labels, true);
                    } while (index > 0);
                    index = payload_id.length;
                    do {
                        index = index - 1;
                        if (actual_id.includes(payload_id[index]) === false) {
                            delete payload.docker[payload_id[index]];
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
    update: function services_statisticsUpdate(data:socket_data):void {
        const update:services_statistics_update = data.data as services_statistics_update,
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