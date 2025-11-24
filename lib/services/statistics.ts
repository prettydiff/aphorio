
import broadcast from "../transmit/broadcast.ts";
import node from "../core/node.ts";
import spawn from "../core/spawn.ts";
import vars from "../core/vars.ts";

// cspell: words CPUPerc, MemPerc

const statistics = function services_statistics():void {
    const container_keys:string[] = Object.keys(vars.compose.containers),
        container_len:number = container_keys.length,
        cpu:os_node_cpuUsage = process.cpuUsage(),
        mem:os_node_memoryUsage = process.memoryUsage(),
        cpus:os_node_cpu = node.os.cpus(),
        application:services_status_item = {
            cpu: [0, 0],
            disk:[0, 0],
            mem: [0, 0],
            net: (function services_statistics_netIO():[number, number] {
                const output:[number, number] = [vars.stats.net_in, vars.stats.net_out],
                    keys:string[] = Object.keys(vars.server_meta),
                    sockets = function core_status_netIO_sockets(list:websocket_client[]):void {
                        let index_list:number = list.length;
                        if (index_list > 0) {
                            do {
                                index_list = index_list - 1;
                                output[0] = output[0] + list[index].bytesRead;
                                output[1] = output[1] + list[index].bytesWritten;
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
                return output;
            }()),
            threads: vars.stats.children
        },
        payload:services_status_statistics = {
            application: vars.stats.application,
            docker: vars.stats.docker,
            now: Date.now()
        };
    // gathering total time and then converting microseconds into milliseconds because CPU timing is in milliseconds
    application.cpu[0] = (cpu.system + cpu.user) / 1000;
    application.cpu[1] = (application.cpu[0] / (cpus[0].times.idle + cpus[0].times.irq + cpus[0].times.nice + cpus[0].times.sys + cpus[0].times.user)) * 100;
    application.mem[0] = mem.arrayBuffers + mem.external + mem.heapUsed + mem.rss;
    application.mem[1] = (application.mem[0] / vars.os.machine.memory.total) * 100;
    vars.stats.application.push(application);
    if (vars.stats.application.length > vars.stats.records) {
        vars.stats.application.splice(0, vars.stats.application.length - vars.stats.records);
    }
    if (container_len === 0) {
        broadcast(vars.dashboard_id, "dashboard", {
            data: payload,
            service: "dashboard-status-statistics"
        });
    } else {
        spawn("docker stats --no-stream --no-trunc --format json", function services_statistics_spawnDocker(output:core_spawn_output):void {
            const obj:string = `[${output.stdout.replace(/\}\n/g, "},")}]`.replace(/\},\]$/, "}]"),
                data:core_docker_status = JSON.parse(obj);
            let index:number = data.length,
                disk:string[] = null,
                net:string[] = null;
            if (index > 0) {
                do {
                    index = index - 1;
                    disk = data[index].BlockIO.split(" / ");
                    net = data[index].NetIO.split(" / ");
                    if (payload.docker[data[index].ID] === undefined) {
                        payload.docker[data[index].ID] = [];
                    }
                    payload.docker[data[index].ID].push({
                        cpu: [0, Number(data[index].CPUPerc.replace("%", ""))],
                        disk: [disk[0].bytes(), disk[1].bytes()],
                        mem: [data[index].MemUsage.split(" / ")[0].bytes(), Number(data[index].MemPerc.replace("%", ""))],
                        net: [net[0].bytes(), net[1].bytes()],
                        threads: Number(data[index].PIDs)
                    });
                    if (payload.docker[data[index].ID].length > vars.stats.records) {
                        payload.docker[data[index].ID].splice(0, payload.docker[data[index].ID].length - vars.stats.records);
                    }
                } while (index > 0);
            }
            broadcast(vars.dashboard_id, "dashboard", {
                data: payload,
                service: "dashboard-status-statistics"
            });
        }).execute();
    }
    if (vars.stats.frequency > 0) {
        setTimeout(services_statistics, vars.stats.frequency);
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