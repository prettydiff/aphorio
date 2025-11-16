
import certificate from "./certificate.ts";
import file from "../utilities/file.ts";
import log from "../core/log.ts";
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
    if (id === "" || (data.action === "destroy" && id === vars.dashboard_id)) {
        return;
    } 
    if (vars.servers[id] === undefined) {
        log.application({
            error: new Error(),
            message: `Server named ${data.server.name} with id ${data.server.id} does not exist.  Called on library server_halt.`,
            section: "servers_web",
            status: "error",
            time: Date.now()
        });
    } else {
        const single_socket:boolean = vars.servers[id].config.single_socket,
            temporary:boolean = vars.servers[id].config.temporary,
            path_config:string = `${vars.path.project}servers.json`,
            path_name:string = vars.path.servers + id + vars.path.sep,
            encryption:type_encryption = vars.servers[id].config.encryption,
            complete = function services_serverHalt_complete():void {
                const actionText:string = (data.action.charAt(data.action.length - 1) === "e")
                    ? `${data.action}d`
                    : `${data.action}ed`;
                if (callback !== null) {
                    // 5. call the callback
                    callback();
                }
                log.application({
                    error: null,
                    message: `Server named ${data.server.name} ${actionText}.`,
                    section: "servers_web",
                    status: "informational",
                    time: Date.now()
                });
            },
            write_callback = function services_serverHalt_writeCallback():void {
                const activate = function servers_serverHalt_activate():void {
                        if (vars.servers[id].config.activate === true) {
                            // 4. Reactivate the server(s) if its given "activate" property has a true boolean value
                            server({
                                action: "activate",
                                server: data.server
                            }, function servers_serverHalt_complete_server():void {
                                complete();
                            });
                        } else {
                            complete();
                        }
                    };
                if (data.action === "destroy") {
                    const  file_remove:config_file_remove = {
                        callback: function services_serverHalt_remove():void {
                            activate();
                        },
                        exclusions: [],
                        location: path_name,
                        section: "servers_web"
                    };
                    delete vars.servers[id];
                    // 3a. Remove the web server's assets from the file system
                    file.remove(file_remove);
                } else if (data.action === "modify" && (encryption === "both" || encryption === "secure")) {
                    vars.servers[id].config = data.server;
                    // 3b. Issue new certificates for modified secure server
                    certificate({
                        callback: function services_serverHalt_certificate():void {
                            server(data, function services_serverHalt_certificate_restartComplete():void {
                                activate();
                            });
                        },
                        days: 65535,
                        id: id,
                        selfSign: true
                    });
                } else {
                    activate();
                }
            },
            kill_sockets = function servers_serverHalt_killSockets(sockets:websocket_client[]):void {
                let index:number = sockets.length;
                if (index > 0) {
                    do {
                        index = index - 1;
                        sockets[index].destroy();
                    } while (index > 0);
                }
            };
        
        if (single_socket === true || temporary === true) {
            data.action = "destroy";
        }

        // 1. Disable the servers and kill their sockets
        if (encryption === "both") {
            vars.server_meta[id].server.open.close();
            vars.server_meta[id].server.secure.close();
            kill_sockets(vars.server_meta[id].sockets.open);
            kill_sockets(vars.server_meta[id].sockets.secure);
        } else {
            vars.server_meta[id].server[encryption].close();
            kill_sockets(vars.server_meta[id].sockets[encryption]);
        }
        if (data.action === "destroy" || data.action === "modify") {
            const modify_file = function servers_serverHalt_modifyFile():void {
                // 2. modify the servers.json file
                const config:core_servers_file = {
                    "compose-variables": vars.compose.variables,
                    dashboard_id: vars.dashboard_id,
                    servers: {}
                };
                let index:number = 0,
                    keys:string[] = [],
                    total:number = 0;
                keys = Object.keys(vars.servers);
                total = keys.length;
                if (total > 0) {
                    do {
                        config.servers[keys[index]] = vars.servers[keys[index]].config;
                        index = index + 1;
                    } while (index < total);
                }
                file.write({
                    callback: write_callback,
                    contents: JSON.stringify(config),
                    location: path_config,
                    section: "servers_web"
                });
            };
            if (data.action === "modify") {
                vars.servers[id] = {
                    config: data.server,
                    sockets: [],
                    status: {
                        open: 0,
                        secure: 0
                    }
                };
                modify_file();
            } else {
                delete vars.servers[id];
                delete vars.server_meta[id];
                file.remove({
                    callback: modify_file,
                    exclusions: null,
                    location: vars.path.servers + id,
                    section: "servers_web"
                });
            }
        } else {
            write_callback();
        }
    }
};

export default server_halt;