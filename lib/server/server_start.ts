
import broadcast from "../transmit/broadcast.ts";
import connection from "../transmit/connection.ts";
import file from "../utilities/file.ts";
import log from "../core/log.ts";
import node from "../core/node.ts";
import vars from "../core/vars.ts";

// cspell: words untrapped

const server_start = function transmit_serverStart(id:string, callback:(name:string) => void):void {
    let count:number = 0;
    const open = function transmit_serverStart_open(options:transmit_tlsOptions):void {
        const wsServer:core_server_instance = (options === null)
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
            complete = function transmit_serverStart_open_complete(id:string):void {
                count = count + 1;
                if (callback !== null && callback !== undefined && ((vars.data.servers[id].encryption === "both" && count > 1) || vars.data.servers[id].encryption !== "both")) {
                    callback(id);
                }
            },
            listenerCallback = function transmit_serverStart_open_listenerCallback():void {
                // eslint-disable-next-line @typescript-eslint/no-this-alias, no-restricted-syntax
                const serverItem:core_server_instance = this,
                    address:node_net_AddressInfo = serverItem.address() as node_net_AddressInfo,
                    secure:"open"|"secure" = (serverItem.secure === true)
                        ? "secure"
                        : "open";
                vars.server_meta[serverItem.id].server[secure] = serverItem;
                if (vars.data_meta.server_ports[serverItem.id] === undefined) {
                    vars.data_meta.server_ports[serverItem.id] = {
                        open: 0,
                        secure: 0
                    };
                }
                vars.data_meta.server_ports[serverItem.id][secure] = address.port;
                log.application({
                    error: null,
                    message: `${secure.capitalize()} server came online at port ${address.port}.`,
                    origin: id,
                    section: "servers-web",
                    status: "informational",
                    time: Date.now()
                });
                broadcast(vars.environment.dashboard_id, "dashboard", {
                    data: {
                        ports_used: vars.data_meta.server_ports,
                        servers: vars.data.servers
                    },
                    service: "dashboard-server-update"
                });
                complete(serverItem.id);
            },
            server_error = function transmit_serverStart_open_serverError(ser:node_error):void {
                // eslint-disable-next-line @typescript-eslint/no-this-alias, no-restricted-syntax
                const serverItem:core_server_instance = this,
                    secure:"open"|"secure" = (serverItem.secure === true)
                        ? "secure"
                        : "open",
                    message:string = (ser !== null && ser !== undefined && ser.code === "EADDRINUSE")
                        ? `Port conflict on port ${vars.data.servers[serverItem.id].ports[secure]} of ${secure} server.`
                        : `${secure.capitalize()} went offline.  Was listening on port ${vars.data.servers[serverItem.id].ports[secure]}.`;
                log.application({
                    error: ser,
                    message: message,
                    origin: id,
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
        if (vars.data.servers[wsServer.id] !== undefined && options !== null) {
            vars.data_meta.server_certs[wsServer.id] = options.options;
        }

        // insecure connection listener
        if (options === null) {
            wsServer.on("connection", connection);
        }

        // secure connection listener
        wsServer.listen({
            port: (vars.options[`port-${secureType}`] > 0)
                ? vars.options[`port-${secureType}`]
                : vars.data.servers[id].ports[secureType]
        }, listenerCallback);
    };

    // create default structures
    if (Array.isArray(vars.data.servers[id].domain_local) === false) {
        vars.data.servers[id].domain_local = [];
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

    if (vars.data.servers[id].encryption === "open") {
        if (vars.data.servers[id].single_socket === true || vars.data.servers[id].temporary === true) {
            file.remove({
                callback: function transmit_serverStart_readCerts_starterOpen():void {
                    open(null);
                },
                exclusions: null,
                location: vars.path.servers + id,
                section: "servers-web"
            });
        } else {
            open(null);
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
                    const starter = function transmit_serverStart_readCerts_starterSecure():void {
                        if (vars.data.servers[id].encryption === "both") {
                            // starts server without TLS certs for non-TLS server
                            open(null);
                        }
                        open(https);
                    };
                    if (https.options.ca === "" || https.options.cert === "" || https.options.key === "") {
                        log.application({
                            error: new Error(),
                            message: "Required certificate files are missing for server.",
                            origin: id,
                            section: "servers-web",
                            status: "error",
                            time: Date.now()
                        });
                    }
                    if (vars.data.servers[id].single_socket === true || vars.data.servers[id].temporary === true) {
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
            certRead = function transmit_serverStart_certRead(certType:type_certKey):void {
                const location:string = (certType === "ca")
                    ? `${certLocation + caName}.crt`
                    : `${certLocation + certName}.${certType}`;
                node.fs.readFile(location, "utf8", function transmit_serverStart_certRead_readFile(fileError:node_error, fileData:string):void {
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
            certStat = function transmit_serverStart_certStat(certType:type_certKey):void {
                const location:string = (certType === "ca")
                    ? `${certLocation + caName}.crt`
                    : `${certLocation + certName}.${certType}`;
                node.fs.stat(location, function transmit_serverStart_certStat_stat(statError:node_error):void {
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

export default server_start;
