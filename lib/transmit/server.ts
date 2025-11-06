
import broadcast from "./broadcast.ts";
import connection from "./connection.ts";
import file from "../utilities/file.ts";
import log from "../core/log.ts";
import node from "../core/node.ts";
import read_certs from "../core/read_certs.ts";
import vars from "../core/vars.ts";

// cspell: words untrapped

const server = function transmit_server(data:services_action_server, callback:(name:string) => void):void {
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
            complete = function transmit_server_start_complete(server_name:string):void {
                count = count + 1;
                if (callback !== null && ((vars.servers[server_name].config.encryption === "both" && count > 1) || vars.servers[server_name].config.encryption !== "both")) {
                    callback(server_name);
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
                    message: `Server ${serverItem.id} - ${secure} came online at port ${vars.servers[serverItem.id].config.ports[secure]}.`,
                    section: "servers",
                    status: "informational",
                    time: Date.now()
                });
                broadcast(vars.dashboard_id, "dashboard", {
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
                    section: "servers",
                    status: "error",
                    time: Date.now()
                });
                complete(serverItem.id);
            };
        // type identification assignment
        wsServer.secure = (options === null)
            ? false
            : true;
        wsServer.id = data.server.id;
        wsServer.on("error", server_error);
        wsServer.on("close", server_error);

        // insecure connection listener
        if (options === null) {
            wsServer.on("connection", connection);
        }

        // secure connection listener
        wsServer.listen({
            port: vars.servers[data.server.id].config.ports[secureType]
        }, listenerCallback);
    };
    if (Array.isArray(data.server.domain_local) === false) {
        data.server.domain_local = [];
    }
    if (vars.server_meta[data.server.id] === undefined) {
        vars.server_meta[data.server.id] = {
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
    if (vars.servers[data.server.id].config.encryption === "open") {
        if (vars.servers[data.server.id].config.single_socket === true || vars.servers[data.server.id].config.temporary === true) {
            file.remove({
                callback: function transmit_server_readCerts_starterOpen():void {
                    start(null);
                },
                exclusions: null,
                location: vars.path.servers + data.server.name,
                section: "servers"
            });
        } else {
            start(null);
        }
    } else {
        read_certs(data.server.id, function transmit_server_readCerts(id:string, options:transmit_tlsOptions):void {
            const starter = function transmit_server_readCerts_starterSecure():void {
                if (vars.servers[id].config.encryption === "both") {
                    start(null);
                }
                start(options);
            };
            if (vars.servers[data.server.id].config.single_socket === true || vars.servers[id].config.temporary === true) {
                file.remove({
                    callback: starter,
                    exclusions: null,
                    location: vars.path.servers + id,
                    section: "servers"
                });
            } else {
                starter();
            }
        });
    }
};

export default server;
