
import certificate from "./certificate.ts";
import file from "../utilities/file.ts";
import log from "../core/log.ts";
import node from "../core/node.ts";
import server from "../transmit/server.ts";
import vars from "../core/vars.ts";

// 1. turn off active servers and delete their corresponding objects
// 2. kill all sockets on the server
// 3. delete vars.sockets[server]
// 4. delete server from vars.server
// 5. remove server's directory
// 6. modify the server
// 7. remove server from the servers.json file
// 8. call the callback

const server_halt = function services_serverHalt(data:services_action_server, callback:() => void):void {
    const id:string = data.server.id;
    if (data.action === "destroy" && id === vars.dashboard_id) {
        return;
    } 
    if (vars.servers[id] === undefined) {
        log.application({
            error: new Error(),
            message: `Server named ${data.server.name} with id ${data.server.id} does not exist.  Called on library server_halt.`,
            section: "servers",
            status: "error",
            time: Date.now()
        });
    } else {
        const single_socket:boolean = vars.servers[id].config.single_socket,
            temporary:boolean = vars.servers[id].config.temporary,
            path_config:string = `${vars.path.project}servers.json`,
            path_name:string = vars.path.servers + id + vars.path.sep,
            flags:store_flag = {
                config: false,
                remove: (data.action === "destroy")
                    ? false
                    : true,
                restart: (data.action === "modify")
                    ? false
                    : true
            },
            complete = function services_serverHalt_complete(flag:"config"|"remove"|"restart"):void {
                flags[flag] = true;
                if (flags.config === true && flags.remove === true && flags.restart === true) {
                    const actionText:string = (data.action.charAt(data.action.length - 1) === "e")
                        ? `${data.action}d`
                        : `${data.action}ed`;
                    if (callback !== null) {
                        // 8. call the callback
                        callback();
                    }
                    log.application({
                        error: null,
                        message: `Server named ${data.server.name} ${actionText}.`,
                        section: "servers",
                        status: "informational",
                        time: Date.now()
                    });
                }
            },
            file_remove:config_file_remove = {
                callback: function services_serverHalt_remove():void {
                    complete("remove");
                },
                exclusions: [],
                location: path_name,
                section: "servers"
            },
            write_json = function services_serverHalt_writeJSON():void {
                const sockets_open:websocket_client[] = vars.server_meta[id].sockets.open,
                    sockets_secure:websocket_client[] = vars.server_meta[id].sockets.secure;
                let index:number = (sockets_open === undefined)
                    ? 0
                    : sockets_open.length;
                if (single_socket === true || temporary === true) {
                    data.action = "destroy";
                }
                // 2. turn off active servers
                if (vars.server_meta[id].server.open !== undefined && vars.server_meta[id].server.open !== null) {
                    vars.server_meta[id].server.open.close();
                }
                if (vars.server_meta[id].server.secure !== undefined && vars.server_meta[id].server.secure !== null) {
                    vars.server_meta[id].server.secure.close();
                }
                vars.servers[id].status = {
                    open: 0,
                    secure: 0
                };
                // 3. kill all sockets on the server
                if (index > 0) {
                    do {
                        index = index - 1;
                        sockets_open[index].destroy();
                    } while (index > 0);
                }
                index = (sockets_secure === undefined)
                    ? 0
                    : sockets_secure.length;
                if (index > 0) {
                    do {
                        index = index - 1;
                        sockets_secure[index].destroy();
                    } while (index > 0);
                }
                delete vars.server_meta[id];
                // 4. delete vars.sockets[name]
                if (data.action === "destroy") {
                    // 5. delete server from vars.server
                    delete vars.servers[id];
                    // 6. remove server's directory
                    file.remove(file_remove);
                } else if (data.action !== "modify") {
                    complete("remove");
                }
                // 7. modify the server
                if (data.action === "modify") {
                    vars.servers[data.server.name].config = data.server;
                    certificate({
                        callback: function services_serverHalt_certificate():void {
                            server(data, function services_serverHalt_certificate_restartComplete():void {
                                complete("restart");
                            });
                        },
                        days: 65535,
                        id: data.server.id,
                        selfSign: true
                    });
                } else {
                    complete("restart");
                }
            };
        if (data.action === "destroy" || data.action === "modify") {
            // 1. modify the servers.json file
            const keys:string[] = Object.keys(vars.servers),
                total:number = keys.length,
                config:config_servers_file = {
                    dashboard_id: vars.dashboard_id,
                    servers: {}
                };
            let index:number = 0;
            if (data.action === "modify") {
                vars.servers[id] = {
                    config: data.server,
                    sockets: [],
                    status: {
                        open: 0,
                        secure: 0
                    }
                };
            }
            // the servers.json file only stores the config property of each server's data
            if (total > 0) {
                do {
                    config.servers[keys[index]] = vars.servers[keys[index]].config;
                    index = index + 1;
                } while (index < total);
            }
            file.write({
                callback: write_json,
                contents: JSON.stringify(config),
                location: path_config,
                section: "servers"
            });
        } else {
            write_json();
        }
    }
};

export default server_halt;