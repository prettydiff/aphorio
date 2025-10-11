
import certificate from "./certificate.ts";
import file from "../utilities/file.ts";
import log from "../core/log.ts";
import server from "../transmit/server.ts";
import vars from "../core/vars.ts";

// 1. add server to the vars.servers object
// 2. add server to servers.json file
// 3. create server's directory structure
// 4. create server's certificates
// 5. launch servers
// 6. call the callback

const server_create = function services_serverCreate(data:services_action_server, callback:() => void):void {
    let count:number = 0;
    const config:services_server = data.server,
        path_config:string = `${vars.path.project}servers.json`,
        path_name:string = vars.path.servers + config.name + vars.path.sep,
        path_assets:string = `${path_name}assets${vars.path.sep}`,
        path_certs:string = `${path_name}certs${vars.path.sep}`,
        flags:store_flag = {
            config: false,
            dir: false
        },
        complete = function services_serverCreate_complete(input:"config"|"dir"):void {
            flags[input] = true;
            if (flags.config === true && flags.dir === true) {
                let server_count:number = 0;
                const serverCallback = function services_serverCreate_complete_serverCallback():void {
                        server_count = server_count + 1;
                        if ((server_count > 1 && config.encryption === "both") || config.encryption !== "both") {
                            // 6. call the callback
                            if (callback !== null) {
                                callback();
                            }
                        }
                    },
                    // 5. launch servers
                    certCallback = function services_serverCreate_complete_certificate():void {
                        if (config.activate === true && config.name !== "dashboard") {
                            server(data, serverCallback);
                        } else if (callback !== null) {
                            callback();
                        }
                    };
                log.application({
                    action: "add",
                    config: config,
                    message: `Server named ${config.name} created.`,
                    status: "success",
                    time: Date.now(),
                    type: "server"
                });
                // 4. create server's certificates
                if (config.encryption === "open") {
                    certCallback();
                } else {
                    certificate({
                        callback: certCallback,
                        days: 65535,
                        name: config.name,
                        selfSign: false
                    });
                }
            }
        },
        children = function services_serverCreate_children():void {
            count = count + 1;
            if (count > 1) {
                complete("dir");
            }
        },
        mkdir = function services_serverCreate_serverDir(location:string):void {
            file.mkdir({
                callback: children,
                location: location
            });
        },
        write = function services_serverCreate_write():void {
            const servers:store_server_config = {},
                keys:string[] = Object.keys(vars.servers),
                total:number = keys.length;
            let index:number = 0;
            do {
                delete vars.servers[keys[index]].config.modification_name;
                servers[keys[index]] = vars.servers[keys[index]].config;
                index = index + 1;
            } while (index < total);
            file.write({
                callback: function services_serverCreate_writeConfig():void {
                    complete("config");
                },
                contents: JSON.stringify(servers),
                location: path_config
            });
        };
    // 1. add server to the vars.servers object
    if (vars.servers[config.name] === undefined) {
        if (config.ports === undefined || config.ports === null) {
            config.ports = {};
        }
        if (config.encryption === "both") {
            if (typeof config.ports.open !== "number") {
                config.ports.open = 0;
            }
            if (typeof config.ports.secure !== "number") {
                config.ports.secure = 0;
            }
        } else if (config.encryption === "open") {
            if (typeof config.ports.open !== "number") {
                config.ports = {
                    open: 0
                };
            } else {
                config.ports = {
                    open: config.ports.open
                };
            }
        } else {
            if (typeof config.ports.secure !== "number") {
                config.ports = {
                    secure: 0
                };
            } else {
                config.ports = {
                    secure: config.ports.secure
                };
            }
        }
        vars.servers[config.name] = {
            config: config,
            sockets: [],
            status: {
                open: 0,
                secure: 0
            }
        };
        // 2. add server to servers.json file
        if (config.single_socket === true || config.temporary === true) {
            complete("config");
        } else {
            write();
        }
    } else {
        log.application({
            action: "add",
            config: config,
            message: `Server named ${config.name} already exists.  Called on library server_create.`,
            status: "error",
            time: Date.now(),
            type: "log"
        });
        return;
    }
    // 3. create server's directory structure
    mkdir(path_assets);
    mkdir(path_certs);
};

export default server_create;
