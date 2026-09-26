
import certificate from "../services/certificate.ts";
import file from "../utilities/file.ts";
import hash from "../core/hash.ts";
import log from "../core/log.ts";
import node from "../core/node.ts";
import save from "../utilities/save.ts";
import vars from "../core/vars.ts";

const servers = function start_servers(start_prerequisites:() => void, process_path:string):core_start_task {
    return {
        label: "Reads the servers.json file to dynamically standup and populate configured web servers.",
        task: function start_servers_task():void {
            const callback = function start_servers_task_callback(fileContents:Buffer):void {
                const configStr:string = (fileContents === null)
                        ? ""
                        : fileContents.toString(),
                    config:core_state_file = (configStr === "" || (/^\s*\{/).test(configStr) === false || (/\}\s*$/).test(configStr) === false)
                        ? null
                        : JSON.parse(configStr) as core_state_file,
                    includes = function start_servers_task_callback_includes(input:string):void {
                        if (vars.environment.interfaces.includes(input) === false && input.toLowerCase().indexOf("fe80") !== 0) {
                            vars.environment.interfaces.push(input);
                        }
                    },
                    interfaces:{ [index: string]: node_os_NetworkInterfaceInfo[]; } = node.os.networkInterfaces(),
                    keys_int:string[] = Object.keys(interfaces),
                    keys_srv:string[] = (config === null)
                        ? null
                        : Object.keys(config.servers);
                let index_int:number = keys_int.length,
                    index_srv:number = (config === null)
                        ? 0
                        : keys_srv.length,
                    server:supplemental_server_config = null,
                    sub:number = 0;
                if (config !== null) {
                    if (typeof config.notes === "string") {
                        vars.data.notes = config.notes;
                    }
                    if (config.id !== undefined) {
                        vars.id = config.id;
                    }
                    // @ts-expect-error - the reference dashboard_id no longer exists and is here for backwards compatibility
                    if (typeof config.dashboard_id === "string") {
                        // @ts-expect-error - the reference dashboard_id no longer exists and is here for backwards compatibility
                        vars.id.dashboard_server = config.dashboard_id;
                    }
                    if (config.stats !== undefined) {
                        vars.stats.frequency = config.stats.frequency;
                        vars.stats.records = config.stats.records;
                    }
                }
                if (index_srv > 0) {
                    do {
                        index_srv = index_srv - 1;
                        if (vars.environment.features["servers-web"] === true || config.servers[keys_srv[index_srv]].id === config.id.dashboard_server) {
                            index_int = keys_int.length;
                            server = config.servers[keys_srv[index_srv]];
                            if (server.ports === null || server.ports === undefined) {
                                server.ports = {
                                    open: 0,
                                    secure: 0
                                };
                            } else {
                                if (typeof server.ports.open !== "number") {
                                    server.ports.open = 0;
                                }
                                if (typeof server.ports.secure !== "number") {
                                    server.ports.secure = 0;
                                }
                            }
                            if (server.block_list === undefined || server.block_list === null) {
                                server.block_list = {
                                    host: [],
                                    ip: [],
                                    referrer: []
                                };
                            }
                            if (server.certificate_path === undefined || server.certificate_path === null) {
                                server.certificate_path = {
                                    ca: `${process_path}servers${vars.path.sep + server.id + vars.path.sep}certs${vars.path.sep}int.crt`,
                                    cert: `${process_path}servers${vars.path.sep + server.id + vars.path.sep}certs${vars.path.sep}server.crt`,
                                    key: `${process_path}servers${vars.path.sep + server.id + vars.path.sep}certs${vars.path.sep}server.key`
                                };
                            }
                            if (Array.isArray(server.domain_local) === false) {
                                server.domain_local = [];
                            }
                            if (server.message_segmentation === undefined || server.message_segmentation === null) {
                                server.message_segmentation = 1e6;
                            }
                            vars.data.server[server.id] = {
                                certificates_client: {
                                    crt: "",
                                    pfx: ""
                                },
                                config: server,
                                ports: {
                                    open: 0,
                                    secure: 0
                                },
                                sockets: []
                            };
                            vars.data_store.server[server.id] = {
                                server_certs: {
                                    ca: "",
                                    cert: "",
                                    key: ""
                                },
                                server_object: {
                                    open: null,
                                    secure: null
                                },
                                sockets_tcp: {
                                    open: [],
                                    secure: []
                                }
                            };
                        }
                    } while (index_srv > 0);
                }
                if (vars.options.mode === "certificate") {
                    let index:number = process.argv.length,
                        id_test:boolean = false;
                    do {
                        index = index - 1;
                        if (keys_srv.includes(process.argv[index]) === true) {
                            id_test = true;
                            certificate({
                                callback: function start_servers_task_certificate():void {
                                    log.shell([`Certificates created for server named ${vars.text.cyan + vars.data.server[process.argv[index]].config.name + vars.text.none}.`], true);
                                    process.exit(0);
                                },
                                days: 65535,
                                id: process.argv[index],
                                selfSign: false
                            });
                            break;
                        }
                    } while (index > 0);
                    if (id_test === false) {
                        log.shell(["Either no server id was specified or the server at the specified id does not exist."], true);
                        process.exit(1);
                    }
                } else {
                    if (index_int > 0) {
                        do {
                            index_int = index_int - 1;
                            sub = interfaces[keys_int[index_int]].length;
                            do {
                                sub = sub - 1;
                                includes(interfaces[keys_int[index_int]][sub].address);
                            } while (sub > 0);
                        } while (index_int > 0);
                    }
                    if (typeof vars.id.machine === "string" && vars.id.machine.length > 0) {
                        start_prerequisites();
                    } else {
                        const cpu:os_node_cpu = node.os.cpus();
                        hash({
                            algorithm: "sha3-512",
                            callback: function start_servers_task_callback_hash(out:core_hash_output):void {
                                vars.id.machine = out.hash;
                                save(function start_servers_task_callback_hash():void {
                                    start_prerequisites();
                                }, "startup");
                            },
                            digest: "hex",
                            hash_input_type: "direct",
                            section: "startup",
                            source: `${process.hrtime.bigint()} ${process.pid} ${process.ppid} ${cpu[0].model} ${cpu[0].speed} ${process.platform} ${node.os.hostname()}`
                        });
                    }
                }
            };
            if (vars.options.mode === "demo") {
                callback(null);
            } else {
                file.read({
                    callback: callback,
                    location: `${vars.path.project}servers.json`,
                    no_file: null,
                    section: "startup"
                });
            }
        }
    };
};

export default servers;