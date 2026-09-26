
import clock from "../services/clock.ts";
import demo from "../services/demo.ts";
import log from "../core/log.ts";
import node from "../core/node.ts";
import ports_application from "../services/ports_application.ts";
import statistics_resources from "../services/statistics_resources.ts";
import test_index from "../test/index.ts";
import vars from "../core/vars.ts";

const ready_services = function start_readServices(count_task:number):void {
    vars.environment.hashes = node.crypto.getHashes();
    clock();
    statistics_resources.data();
    if (vars.environment.features["ports-application"] === true) {
        ports_application();
    }
    if (vars.options.mode === "demo") {
        demo.clock_self();
    }
    if (vars.test.testing === true) {
        test_index();
    } else {
        const heading = function start_services_heading(message:string):string {
                return vars.text.underline + message + vars.text.none;
            },
            servers:string[] = Object.keys(vars.data.server),
            time:number = Number(process.hrtime.bigint() - vars.environment.start_time),
            asterisk:string = `${vars.text.angry}*${vars.text.none}`,
            bun:string = process.versions.bun,
            versions:string = (bun === undefined)
                ? `${asterisk} Application executed from ${vars.text.green}Node.js${vars.text.none} at version ${vars.text.cyan + process.versions.node + vars.text.none}.`
                : `${asterisk} Application executed from ${vars.text.green}bun${vars.text.none} at Node.js API version ${vars.text.cyan + process.versions.node + vars.text.none} and bun version ${vars.text.cyan + bun + vars.text.none}.`,
            demo_text:string = (vars.options.mode === "server")
                ? `${vars.text.green}server${vars.text.none}`
                : `${vars.text.angry + vars.options.mode + vars.text.none}`,
            logs:string[] = [
                "",
                heading("Startup Complete"),
                versions,
                `${asterisk} Application completed ${vars.text.cyan + count_task + vars.text.none} startup tasks in ${vars.text.cyan + (time / 1e9) + vars.text.none} seconds.`,
                `${asterisk} Application is running in ${demo_text} mode.`,
                `${asterisk} Process ID: ${vars.text.cyan + process.pid + vars.text.none}`,
                "",
                heading("Web Server Ports"),
            ],
            pad = function start_completeTasks_ready_start_serverCallback_pad(str:string, num:number, dir:"left"|"right"):string {
                let item:number = longest[num] - str.length;
                if (item > 0) {
                    do {
                        if (dir === "left") {
                            str = ` ${str}`;
                        } else {
                            str = `${str} `;
                        }
                        item = item - 1;
                    } while (item > 0);
                }
                return str;
            },
            log_start = function start_completeTasks_ready_start_serverCallback_logStart(config:config_log_start):void {
                const value:string = (config.type === "tcp" || config.type === "udp")
                        ? vars.text.green + pad(config.value.toString(), 2, "left") + vars.text.none
                        : (config.conflict === true)
                            ? vars.text.angry + config.value + vars.text.none
                            : vars.text.green + config.value + vars.text.none,
                    str:string = `${asterisk} ${pad(name, 0, "right")} - ${pad(config.type, 1, "right")} - ${value}`;
                if (config.conflict === true) {
                    if (config.value < 1025) {
                        logs.push(`${str} (Server offline, typically due to insufficient access for reserved port or port conflict.)`);
                    } else {
                        logs.push(`${str} (Server offline, typically due to port conflict.)`);
                    }
                } else {
                    logs.push(str);
                }
            },
            keys:string[] = Object.keys(vars.data.containers),
            sort = function start_completeTasks_ready_start_serverCallback_sort(a:[number, "tcp"|"udp"], b:[number, "tcp"|"udp"]):-1|1 {
                if (a[0] < b[0] || (a[0] === b[0] && a[1] < b[1])) {
                    return -1;
                }
                return 1;
            };
        let index:number = 0,
            name:string = "",
            ports:type_docker_ports = null,
            longest:number[] = [0, 0, 0],
            len:number = servers.length;
        servers.sort(function start_completeTasks_read_start_serverCallback_serverSort(a:string, b:string):-1|1 {
            if (a > b) {
                return -1;
            }
            return 1;
        });
        // get string column width
        do {
            name = vars.data.server[servers[index]].config.name;
            if (name.length > longest[0]) {
                longest[0] = name.length;
            }
            if (vars.data.server[servers[index]].config.encryption === "both") {
                if (vars.data.server[servers[index]].ports["secure"].toString().length > longest[2]) {
                    longest[2] = vars.data.server[servers[index]].ports["secure"].toString().length;
                }
                if (vars.data.server[servers[index]].ports["open"].toString().length > longest[2]) {
                    longest[3] = vars.data.server[servers[index]].ports["secure"].toString().length;
                }
                longest[1] = 6;
            } else if (vars.data.server[servers[index]].config.encryption === "secure") {
                if (vars.data.server[servers[index]].ports["secure"].toString().length > longest[2]) {
                    longest[2] = vars.data.server[servers[index]].ports["secure"].toString().length;
                }
                longest[1] = 6;
            } else {
                if (vars.data.server[servers[index]].ports["open"].toString().length > longest[2]) {
                    longest[2] = vars.data.server[servers[index]].ports["secure"].toString().length;
                }
            }
            index = index + 1;
        } while (index < servers.length);
        // from servers
        index = 0;
        // server[servers[index]].config.ports = user assigned port value
        // server[servers[index]].ports        = actual system port in use
        do {
            if (vars.data.server[servers[index]].ports !== undefined) {
                if (vars.data.server[servers[index]].config.encryption === "both") {
                    log_start({
                        conflict: (vars.data.server[servers[index]].ports.open === 0),
                        name: vars.data.server[servers[index]].config.name,
                        type: "open",
                        value: vars.data.server[servers[index]].ports.open
                    });
                    log_start({
                        conflict: (vars.data.server[servers[index]].ports.secure === 0),
                        name: vars.data.server[servers[index]].config.name,
                        type: "secure",
                        value: vars.data.server[servers[index]].ports.secure
                    });
                } else if (vars.data.server[servers[index]].config.encryption === "open") {
                    log_start({
                        conflict: (vars.data.server[servers[index]].ports.open === 0),
                        name: vars.data.server[servers[index]].config.name,
                        type: "open",
                        value: vars.data.server[servers[index]].ports.open
                    });
                } else if (vars.data.server[servers[index]].config.encryption === "secure") {
                    log_start({
                        conflict: (vars.data.server[servers[index]].ports.secure === 0),
                        name: vars.data.server[servers[index]].config.name,
                        type: "secure",
                        value: vars.data.server[servers[index]].ports.secure
                    });
                }
            }
            index = index + 1;
        } while (index < len);

        // from containers
        len = keys.length;
        if (len > 0) {
            let index_ports:number = 0,
                len_ports:number = 0,
                title:boolean = false;
            index = 0;
            longest = [0, 3, 0];
            keys.sort();
            do {
                if (vars.data.containers[keys[index]].name.length > longest[0]) {
                    longest[0] = vars.data.containers[keys[index]].name.length;
                }
                index = index + 1;
            } while (index < len);
            index = 0;
            do {
                ports = vars.data.containers[keys[index]].ports;
                len_ports = (ports === null)
                    ? 0
                    : ports.length;
                if (len_ports > 0) {
                    if (title === false) {
                        logs.push("");
                        logs.push(heading("Container Ports"));
                        title = true;
                    }
                    longest[2] = 0;
                    ports.sort(sort);
                    index_ports = 0;
                    do {
                        if (ports[index_ports][0].toString().length > longest[2]) {
                            longest[2] = ports[index_ports][0].toString().length;
                        }
                        index_ports = index_ports + 1;
                    } while (index_ports < len_ports);
                    index_ports = 0;
                    do {
                        log_start({
                            conflict: false,
                            name: vars.data.containers[keys[index]].name,
                            type: ports[index_ports][1],
                            value: ports[index_ports][0]
                        });
                        index_ports = index_ports + 1;
                    } while (index_ports < len_ports);
                }
                index = index + 1;
            } while (index < len);
        }
        logs.push("");
        logs.push(heading("Help"));
        logs.push(`${vars.environment.name.capitalize()} also supports shell interactions.`);
        logs.push(`Execute with shell argument '${vars.text.cyan}help${vars.text.none}' to see a command list.`);
        log.shell(logs, true);
    }
    vars.environment.loading = false;
};

export default ready_services;