
import server from "./transmit/server.js";
import server_create from "./services/server_create.js";
import startup from "./utilities/startup.js";
import yt_config from "./services/yt_config.js";
import vars from "./utilities/vars.js";

startup(function index():void {
    const default_server = function index_defaultServer(name:string):services_server {
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
    start = function index_start():void {
        const servers:string[] = Object.keys(vars.servers),
            total:number = servers.length,
            callback = function index_start_serverCallback():void {
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
                        pad = function index_start_serverCallback_pad(str:string, num:number, dir:"left"|"right"):string {
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
                        logItem = function index_start_serverCallback_logItem(name:string, encryption:"open"|"secure"):void {
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
                    logs.push("");
                    // eslint-disable-next-line no-console
                    console.log(logs.join("\n"));
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

    if (process.argv.includes("yt_config") === true) {
        yt_config(process.argv[process.argv.indexOf("yt_config") + 1], function index_ytConfig(dest:string):void {
            // eslint-disable-next-line no-console
            console.log(`Configs written to ${dest}.`);
            process.exit(0);
        });
    } else {
        if (vars.servers.dashboard === undefined) {
            server_create({
                action: "add",
                server: default_server("dashboard")
            }, start);
        } else {
            start();
        }
    }
});
