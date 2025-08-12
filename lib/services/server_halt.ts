
import certificate from "./certificate.ts";
import file from "../utilities/file.ts";
import log from "../utilities/log.ts";
import node from "../utilities/node.ts";
import server from "../transmit/server.ts";
import server_create from "./server_create.ts";
import vars from "../utilities/vars.ts";

// 1. turn off active servers and delete their corresponding objects
// 2. kill all sockets on the server
// 3. delete vars.sockets[server]
// 4. delete server from vars.server
// 5. remove server's directory
// 6. modify the server
// 7. remove server from the servers.json file
// 8. call the callback

const server_halt = function services_serverHalt(data:services_action_server, callback:() => void):void {
    const old:string = (data.server.modification_name === undefined || data.server.modification_name === null || data.server.modification_name === "")
            ? String(data.server.name)
            : String(data.server.modification_name),
        single_socket:boolean = vars.servers[old].config.single_socket,
        temporary:boolean = vars.servers[old].config.temporary;
    if (vars.servers[old] === undefined) {
        log.application({
            action: data.action,
            config: data.server,
            message: `Server named ${old} does not exist.  Called on library server_halt.`,
            status: "error",
            time: Date.now(),
            type: "log"
        });
    } else {
        const path_config:string = `${vars.path.project}servers.json`,
            path_name:string = vars.path.servers + old + vars.sep,
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
                    if (data.action === "modify") {
                        data.server.modification_name = old;
                    }
                    log.application({
                        action: data.action,
                        config: data.server,
                        message: `Server named ${data.server.name} ${actionText}.`,
                        status: "success",
                        time: Date.now(),
                        type: "server"
                    });
                }
            },
            file_remove:file_remove = {
                callback: function services_serverHalt_remove():void {
                    complete("remove");
                },
                error_terminate: data.server,
                exclusions: [],
                location: path_name
            },
            server_restart = function services_serverHalt_serverRestart():void {
                node.fs.cp(path_name, vars.path.servers + data.server.name + vars.sep, {
                    recursive: true
                }, function server_restart_cp(erc:node_error):void {
                    if (erc === null) {
                        complete("restart");
                        file.remove(file_remove);
                    } else {
                        log.application({
                            action: "modify",
                            config: data.server,
                            message: "Error copying files from old server location to new server location.",
                            status: "error",
                            time: Date.now(),
                            type: "server"
                        });
                    }
                });
            },
            write_json = function services_serverHalt_writeJSON():void {
                const sockets_open:websocket_client[] = vars.server_meta[old].sockets.open,
                    sockets_secure:websocket_client[] = vars.server_meta[old].sockets.secure;
                let index:number = (sockets_open === undefined)
                    ? 0
                    : sockets_open.length;
                if (single_socket === true || temporary === true) {
                    data.action = "destroy";
                }
                // 2. turn off active servers
                if (vars.server_meta[old].server.open !== undefined && vars.server_meta[old].server.open !== null) {
                    vars.server_meta[old].server.open.close();
                }
                if (vars.server_meta[old].server.secure !== undefined && vars.server_meta[old].server.secure !== null) {
                    vars.server_meta[old].server.secure.close();
                }
                vars.servers[old].status = {
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
                delete vars.server_meta[old];
                // 4. delete vars.sockets[name]
                if (data.action === "destroy") {
                    // 5. delete server from vars.server
                    delete vars.servers[old];
                    // 6. remove server's directory
                    file.remove(file_remove);
                } else if (data.action !== "modify") {
                    complete("remove");
                }
                // 7. modify the server
                if (data.action === "modify") {
                    delete data.server.modification_name;
                    vars.servers[data.server.name].config = data.server;
                    if (data.server.name !== old) {
                        delete vars.servers[old];
                        server_create({
                            action: "add",
                            server: data.server
                        }, server_restart);
                    } else {
                        certificate({
                            callback: function services_serverHalt_certificate():void {
                                server(data, function services_serverHalt_certificate_restartComplete():void {
                                    complete("restart");
                                });
                            },
                            days: 65535,
                            name: data.server.name,
                            selfSign: true
                        });
                    }
                } else {
                    complete("restart");
                }
            };
        if (data.action === "destroy" || data.action === "modify") {
            // 1. modify the servers.json file
            const servers:store_server_config = {},
                keys:string[] = Object.keys(vars.servers),
                total:number = keys.length;
            let index:number = 0;
            if (data.action === "modify") {
                if (data.server.name !== data.server.modification_name) {
                    delete vars.servers[data.server.name];
                }
                delete data.server.modification_name;
                vars.servers[old] = {
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
                    delete vars.servers[keys[index]].config.modification_name;
                    servers[keys[index]] = vars.servers[keys[index]].config;
                    index = index + 1;
                } while (index < total);
            }
            file.write({
                callback: write_json,
                contents: JSON.stringify(servers),
                error_terminate: data.server,
                location: path_config
            });
        } else {
            write_json();
        }
    }
};

export default server_halt;