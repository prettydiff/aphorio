
import broadcast from "../transmit/broadcast.ts";
import commas from "./commas.ts";
import core from "../browser/core.ts";
import dashboard_script from "../dashboard/dashboard_script.ts";
import dateTime from "./dateTime.ts";
import docker_ps from "../services/docker_ps.ts";
import file from "./file.ts";
import log from "./log.ts";
import node from "./node.ts";
import os from "./os.ts";
import server from "../transmit/server.ts";
import server_create from "../services/server_create.ts";
import time from "./time.ts";
import vars from "./vars.ts";

const start_server = function utilities_startServer():void {
    const flags:store_flag = {
            config: false,
            css: false,
            docker: false,
            html: false,
            os: false
        },
        readComplete = function utilities_startServer_readComplete(flag:"config"|"css"|"docker"|"html"|"os"):void {
            flags[flag] = true;
            if (flags.config === true && flags.css === true && flags.docker === true && flags.html === true && flags.os === true) {
                const clock = function utilities_startServer_readComplete_clock():void {
                        const now:number = Date.now(),
                            payload:services_clock = {
                                time_local: now,
                                time_zulu: (now + (new Date().getTimezoneOffset() * 60000))
                            };
                        broadcast("dashboard", "dashboard", {
                            data: payload,
                            service: "dashboard-clock"
                        });
                        setTimeout(utilities_startServer_readComplete_clock, 950);
                    },
                    default_server = function utilities_startServer_readComplete_defaultServer(name:string):services_server {
                        return {
                            activate: true,
                            domain_local: [
                                "localhost",
                                "127.0.0.1",
                                "::1"
                            ],
                            encryption: "both",
                            name: name,
                            ports: {
                                open: 0,
                                secure: 0
                            },
                            redirect_asset: {
                                "localhost": {
                                    "/lib/assets/*": "/lib/dashboard/*"
                                }
                            }
                        };
                    },
                    start = function utilities_startServer_readComplete_start():void {
                        const servers:string[] = Object.keys(vars.servers),
                            total:number = servers.length,
                            callback = function utilities_startServer_readComplete_start_serverCallback():void {
                                count = count + 1;
                                if (count === total) {
                                    const time:number = Number(process.hrtime.bigint() - vars.start_time),
                                        logs:string[] = [
                                            "",
                                            `${vars.text.underline}Application started in ${time / 1e9} seconds.${vars.text.none}`,
                                            "",
                                            `Process ID: ${vars.text.cyan + process.pid + vars.text.none}`,
                                            "",
                                            "Ports:",
                                        ],
                                        pad = function utilities_startServer_readComplete_start_serverCallback_pad(str:string, num:number, dir:"left"|"right"):string {
                                            let item:number = num - str.length;
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
                                        logItem = function utilities_startServer_readComplete_start_serverCallback_logItem(name:string, encryption:"open"|"secure"):void {
                                            const conflict:boolean = (vars.servers[name].status[encryption] === 0),
                                                portNumber:number = (conflict === true)
                                                    ? vars.servers[name].config.ports[encryption]
                                                    : vars.servers[name].status[encryption],
                                                portDisplay:string = (conflict === true)
                                                    ? vars.text.angry + portNumber + vars.text.none
                                                    : portNumber.toString(),
                                                str:string = `${vars.text.angry}*${vars.text.none} ${pad(name, longest.name, "right")} - ${pad(encryption, longest.encryption, "right")} - ${vars.text.green + pad(portDisplay, longest.port, "left") + vars.text.none}`;
                                            if (conflict === true) {
                                                if (portNumber < 1025) {
                                                    logs.push(`${str} (Server offline, typically due to insufficient access for reserved port or port conflict.)`);
                                                } else {
                                                    logs.push(`${str} (Server offline, typically due to port conflict.)`);
                                                }
                                            } else {
                                                logs.push(str);
                                            }
                                        },
                                        longest:store_number = {
                                            encryption: 4,
                                            name: 0,
                                            port: 0
                                        };
                                    servers.sort();
                                    let index:number = 0;
                                    // get string column width
                                    do {
                                        if (servers[index].length > longest.name) {
                                            longest.name = servers[index].length;
                                        }
                                        if (vars.servers[servers[index]].config.encryption === "both") {
                                            if (vars.servers[servers[index]].config.ports["secure"].toString().length > longest.port) {
                                                longest.port = vars.servers[servers[index]].config.ports["secure"].toString().length;
                                            }
                                            if (vars.servers[servers[index]].config.ports["open"].toString().length > longest.port) {
                                                longest.port = vars.servers[servers[index]].config.ports["secure"].toString().length;
                                            }
                                            longest.encryption = 6;
                                        } else if (vars.servers[servers[index]].config.encryption === "secure") {
                                            if (vars.servers[servers[index]].config.ports["secure"].toString().length > longest.port) {
                                                longest.port = vars.servers[servers[index]].config.ports["secure"].toString().length;
                                            }
                                            longest.encryption = 6;
                                        } else {
                                            if (vars.servers[servers[index]].config.ports["open"].toString().length > longest.port) {
                                                longest.port = vars.servers[servers[index]].config.ports["secure"].toString().length;
                                            }
                                        }
                                        index = index + 1;
                                    } while (index < servers.length);
                
                                    index = 0;
                                    do {
                                        if (vars.servers[servers[index]].config.encryption === "both") {
                                            logItem(servers[index], "open");
                                            logItem(servers[index], "secure");
                                        } else if (vars.servers[servers[index]].config.encryption === "open") {
                                            logItem(servers[index], "open");
                                        } else if (vars.servers[servers[index]].config.encryption === "secure") {
                                            logItem(servers[index], "secure");
                                        }
                                        index = index + 1;
                                    } while (index < servers.length);
                                    log.shell(logs, true);
                                }
                            };
                        let count:number = 0,
                            index:number = 0;
                        do {
                            server({
                                action: "activate",
                                server: vars.servers[servers[index]].config
                            }, callback);
                            index = index + 1;
                        } while (index < total);
                    };
                clock();
                if (vars.servers.dashboard === undefined) {
                    server_create({
                        action: "add",
                        server: default_server("dashboard")
                    }, start);
                } else {
                    start();
                }
            }
        },
        readCompose = function utilities_startServer_readCompose(fileContents:Buffer):void {
            if (fileContents === null) {
                vars.compose = {
                    containers: {},
                    variables: {}
                };
            } else {
                vars.compose = JSON.parse(fileContents.toString());
            }
            commandsCallback();
        },
        readCSS = function utilities_startServer_readCSS(fileContents:Buffer):void {
            const css:string = fileContents.toString();
            vars.css = css.slice(css.indexOf(":root"), css.indexOf("/* end basic html */"));
            readComplete("css");
        },
        readConfig = function utilities_startServer_readConfig(fileContents:Buffer):void {
            const configStr:string = (fileContents === null)
                    ? ""
                    : fileContents.toString(),
                config:store_server_config = (configStr === "" || (/^\s*\{/).test(configStr) === false || (/\}\s*$/).test(configStr) === false)
                    ? null
                    : JSON.parse(configStr) as store_server_config,
                includes = function utilities_startServer_read_instructions_includes(input:string):void {
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
        readXterm = function utilities_startServer_readXterm(xtermFile:Buffer):void {
            file.read({
                callback: function utilities_startServer_readHTML(fileContents:Buffer):void {
                    const xterm:string = xtermFile.toString().replace(/\s*\/\/# sourceMappingURL=xterm\.js\.map/, ""),
                        script:string = dashboard_script.toString().replace("path: \"\",", `path: "${vars.path.project.replace(/\\/g, "\\\\").replace(/"/g, "\\\"")}",`).replace(/\(\s*\)/, "(core)");
                    vars.dashboard = fileContents.toString()
                        .replace("${payload.intervals.compose}", (vars.intervals.compose / 1000).toString())
                        .replace("replace_javascript", `${xterm}const commas=${commas.toString()},dateTime=${dateTime.toString()},time=${time.toString()};(${script}(${core.toString()}));`);
                    readComplete("html");
                },
                error_terminate: null,
                location: `${vars.path.project}lib${vars.sep}dashboard${vars.sep}dashboard.html`,
                no_file: null
            });
        },
        options = function utilities_startServer_options(key:"no_color"|"verbose", iterate:string):void {
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
        commandsCallback = function utilities_startServer_commandsCallback():void {
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
        },
        dockerCallback = function utilities_startServer_dockerCallback():void {
            readComplete("docker");
        },
        osCallback = function utilities_startServer_osCallback():void {
            readComplete("os");
        },
        midnight:number = (function utilities_startServer_midnight():number {
            const date:Date = new Date(),
                hours:number = date.getHours(),
                minutes:number = date.getMinutes(),
                seconds:number = date.getSeconds(),
                mill:number = date.getMilliseconds(),
                night:number = ((23 - hours) * 3600 * 1000) + ((59 - minutes) * 60 * 1000) + ((59 - seconds) * 1000) + (1000 - mill);
            vars.timeZone_offset = date.getTimezoneOffset() * 60000;
            return night - 25;
        }()),
        osDelay = function utilities_startServer_osDelay():void {
            os("all", function utilities_startServer_osDelay(payload:socket_data):void {
                broadcast("dashboard", "dashboard", payload);
            });
            osDaily();
        },
        osDaily = function utilities_startServer_osDaily():void {
            setTimeout(osDelay, 86399975);
        };

    options("no_color", "text");
    vars.path.project = process.argv[1].slice(0, process.argv[1].indexOf(`${vars.sep}lib${vars.sep}`)) + vars.sep;
    vars.path.compose = `${vars.path.project}compose${vars.sep}`;
    vars.path.servers = `${vars.path.project}servers${vars.sep}`;
    file.read({
        callback: readCompose,
        error_terminate: null,
        location: `${vars.path.project}compose.json`,
        no_file: null
    });

    os("all", osCallback);
    setTimeout(osDelay, midnight);
};

export default start_server;