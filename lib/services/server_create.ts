
import certificate from "./certificate.ts";
import file from "../utilities/file.ts";
import hash from "../core/hash.ts";
import log from "../core/log.ts";
import server from "../transmit/server.ts";
import vars from "../core/vars.ts";

// 1. add server to the vars.servers object
// 2. add server to servers.json file
// 3. create server's directory structure
// 4. create server's certificates
// 5. launch servers
// 6. call the callback

const server_create = function services_serverCreate(data:services_action_server, callback:() => void, dashboard:boolean):void {
    hash({
        algorithm: "sha3-512",
        callback: function services_serverCreate_hashCallback(output:hash_output):void {
            let count:number = 0;
            const config:services_server = data.server,
                path_config:string = `${vars.path.project}servers.json`,
                path_name:string = vars.path.servers + output.hash + vars.path.sep,
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
                                if (config.activate === true && config.id !== vars.dashboard_id) {
                                    server(data, serverCallback);
                                } else if (callback !== null) {
                                    callback();
                                }
                            };
                        log.application({
                            error: null,
                            message: `Server named ${config.name} created.`,
                            section: "servers_web",
                            status: "informational",
                            time: Date.now()
                        });
                        // 4. create server's certificates
                        if (config.encryption === "open") {
                            certCallback();
                        } else {
                            certificate({
                                callback: certCallback,
                                days: 65535,
                                id: config.id,
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
                        location: location,
                        section: "servers_web"
                    });
                },
                write = function services_serverCreate_write():void {
                    const keys:string[] = Object.keys(vars.servers),
                        total:number = keys.length,
                        config:core_servers_file = {
                            "compose-variables": vars.compose.variables,
                            dashboard_id: vars.dashboard_id,
                            servers: {}
                        };
                    let index:number = 0;
                    do {
                        config.servers[keys[index]] = vars.servers[keys[index]].config;
                        index = index + 1;
                    } while (index < total);
                    file.write({
                        callback: function services_serverCreate_writeConfig():void {
                            complete("config");
                        },
                        contents: JSON.stringify(config),
                        location: path_config,
                        section: "servers_web"
                    });
                };
            if (vars.servers[output.hash] === undefined) {
                // 1. add server to the vars.servers object
                config.id = output.hash;
                if (vars.servers[config.id] === undefined) {
                    if (dashboard === true) {
                        vars.dashboard_id = output.hash;
                    }
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
                    vars.servers[config.id] = {
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
                        error: new Error(),
                        message: `Server named ${config.name} already exists.  Called on library server_create.`,
                        section: "servers_web",
                        status: "error",
                        time: Date.now()
                    });
                    return;
                }
                // 3. create server's directory structure
                mkdir(path_assets);
                mkdir(path_certs);
            } else {
                services_serverCreate(data, callback, dashboard);
            }
        },
        digest: "hex",
        hash_input_type: "direct",
        section: "servers_web",
        source: String(Date.now()) + String(Math.random()) + vars.os.os.hostname
    });
};

export default server_create;
