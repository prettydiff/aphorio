
import broadcast from "./broadcast.ts";
import connection from "./connection.ts";
import file from "../utilities/file.ts";
import log from "../core/log.ts";
import node from "../core/node.ts";
import vars from "../core/vars.ts";

// cspell: words untrapped

const server = function transmit_server(id:string, callback:(name:string) => void):void {
    let count:number = 0;
    const start = function transmit_server_start(options:transmit_tlsOptions):void {
        const wsServer:server_instance = (options === null)
                // options are of type TlsOptions
                ? node.net.createServer()
                : node.tls.createServer({
                    ca: options.options.ca,
                    cert: options.options.cert,
                    key: options.options.key
                }, connection),
            secureType:"open"|"secure" = (options === null)
                ? "open"
                : "secure",
            complete = function transmit_server_start_complete(id:string):void {
                count = count + 1;
                if (callback !== null && callback !== undefined && ((vars.servers[id].config.encryption === "both" && count > 1) || vars.servers[id].config.encryption !== "both")) {
                    callback(id);
                }
            },
            listenerCallback = function transmit_server_start_listenerCallback():void {
                // eslint-disable-next-line @typescript-eslint/no-this-alias, no-restricted-syntax
                const serverItem:server_instance = this,
                    address:node_net_AddressInfo = serverItem.address() as node_net_AddressInfo,
                    secure:"open"|"secure" = (serverItem.secure === true)
                        ? "secure"
                        : "open";
                vars.server_meta[serverItem.id].server[secure] = serverItem;
                vars.servers[serverItem.id].status[secure] = address.port;
                log.application({
                    error: null,
                    message: `Server ${serverItem.id} - ${secure} came online at port ${address.port}.`,
                    section: "servers-web",
                    status: "informational",
                    time: Date.now()
                });
                broadcast(vars.environment.dashboard_id, "dashboard", {
                    data: vars.servers,
                    service: "dashboard-server"
                });
                complete(serverItem.id);
            },
            server_error = function transmit_server_start_serverError(ser:node_error):void {
                // eslint-disable-next-line @typescript-eslint/no-this-alias, no-restricted-syntax
                const serverItem:server_instance = this,
                    secure:"open"|"secure" = (serverItem.secure === true)
                        ? "secure"
                        : "open",
                    message:string = (ser !== null && ser !== undefined && ser.code === "EADDRINUSE")
                        ? `Port conflict on port ${vars.servers[serverItem.id].config.ports[secure]} of ${secure} server named ${serverItem.id}.`
                        : `Server ${serverItem.id} - ${secure} went offline.  Was listening on port ${vars.servers[serverItem.id].config.ports[secure]}.`;
                log.application({
                    error: ser,
                    message: message,
                    section: "servers-web",
                    status: "error",
                    time: Date.now()
                });
                complete(serverItem.id);
            };
        // type identification assignment
        wsServer.secure = (options === null)
            ? false
            : true;
        wsServer.id = id;
        wsServer.on("error", server_error);
        wsServer.on("close", server_error);

        // insecure connection listener
        if (options === null) {
            wsServer.on("connection", connection);
        }

        // secure connection listener
        wsServer.listen({
            port: vars.servers[id].config.ports[secureType]
        }, listenerCallback);
    };

    // create default structures
    if (Array.isArray(vars.servers[id].config.domain_local) === false) {
        vars.servers[id].config.domain_local = [];
    }
    if (vars.server_meta[id] === undefined) {
        vars.server_meta[id] = {
            server: {
                open: null,
                secure: null
            },
            sockets: {
                open: [],
                secure: []
            }
        };
    }

    if (vars.servers[id].config.encryption === "open") {
        if (vars.servers[id].config.single_socket === true || vars.servers[id].config.temporary === true) {
            file.remove({
                callback: function transmit_server_readCerts_starterOpen():void {
                    start(null);
                },
                exclusions: null,
                location: vars.path.servers + id,
                section: "servers-web"
            });
        } else {
            start(null);
        }
    } else {
        // for TLS must read the cert chain first
        const certLocation:string = `${vars.path.servers + id + vars.path.sep}certs${vars.path.sep}`,
            certName:string = "server",
            caName:string = "int",
            https:transmit_tlsOptions = {
                options: {
                    ca: "",
                    cert: "",
                    key: ""
                },
                fileFlag: {
                    ca: false,
                    crt: false,
                    key: false
                }
            },
            certCheck = function utilities_readCerts_certCheck():void {
                if (https.fileFlag.ca === true && https.fileFlag.crt === true && https.fileFlag.key === true) {
                    const starter = function transmit_server_readCerts_starterSecure():void {
                        if (vars.servers[id].config.encryption === "both") {
                            // starts server without TLS certs for non-TLS server
                            start(null);
                        }
                        start(https);
                    };
                    if (https.options.ca === "" || https.options.cert === "" || https.options.key === "") {
                        log.application({
                            error: new Error(),
                            message: `Required certificate files are missing for server ${vars.servers[id].config.name}.`,
                            section: "servers-web",
                            status: "error",
                            time: Date.now()
                        });
                    }
                    if (vars.servers[id].config.single_socket === true || vars.servers[id].config.temporary === true) {
                        file.remove({
                            callback: starter,
                            exclusions: null,
                            location: vars.path.servers + id,
                            section: "servers-web"
                        });
                    } else {
                        starter();
                    }
                }
            },
            certRead = function transmit_server_certRead(certType:type_certKey):void {
                const location:string = (certType === "ca")
                    ? `${certLocation + caName}.crt`
                    : `${certLocation + certName}.${certType}`;
                node.fs.readFile(location, "utf8", function transmit_server_certRead_readFile(fileError:node_error, fileData:string):void {
                    https.fileFlag[certType] = true;
                    if (fileError === null) {
                        if (certType === "crt") {
                            https.options.cert = fileData;
                        } else {
                            https.options[certType] = fileData;
                        }
                    }
                    certCheck();
                });
            },
            certStat = function transmit_server_certStat(certType:type_certKey):void {
                const location:string = (certType === "ca")
                    ? `${certLocation + caName}.crt`
                    : `${certLocation + certName}.${certType}`;
                node.fs.stat(location, function transmit_server_certStat_stat(statError:node_error):void {
                    if (statError === null) {
                        certRead(certType);
                    } else {
                        https.fileFlag[certType] = true;
                        certCheck();
                    }
                });
            };

        certStat("ca");
        certStat("crt");
        certStat("key");
    }
};

export default server;
