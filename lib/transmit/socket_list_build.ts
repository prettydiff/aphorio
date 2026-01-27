
import broadcast from "../transmit/broadcast.ts";
import socket_end from "../transmit/socket_end.ts";
import vars from "../core/vars.ts";

const socket_list = function services_socketList(extension?:() => void):void {
    const keys:string[] = Object.keys(vars.servers),
        len:number = keys.length,
        tcp:services_socket_application_tcp[] = [],
        socket_health = function services_socketList_socketHealth(server_id:string, encryption:"open"|"secure"):void {
            const destroy = function services_socketList_socketHealth_destroy(socket:websocket_client, index:number):void {
                socket.status = "end";
                socket.off("close", socket_end);
                socket.off("end", socket_end);
                socket.off("error", socket_end);
                socket.destroy();
                vars.stats.net_in = vars.stats.net_in + socket.bytesRead;
                vars.stats.net_out = vars.stats.net_out + socket.bytesWritten;
                vars.server_meta[server_id].sockets[encryption].splice(index, 1);
            };
            let index_list:number = (vars.server_meta[server_id].sockets[encryption] === undefined)
                    ? 0
                    : vars.server_meta[server_id].sockets[encryption].length,
                index_server:number = 0,
                socket_item:websocket_client = null;
            if (index_list > 0) {
                do {
                    index_list = index_list - 1;
                    // find the actual socket from the socket store
                    socket_item = vars.server_meta[server_id].sockets[encryption][index_list];
                    if (socket_item.destroyed === true || socket_item.closed === true) {

                        // remove the socket config
                        index_server = vars.servers[server_id].sockets.length;
                        if (index_server > 0) {
                            do {
                                index_server = index_server - 1;
                                if (
                                    // remove the dead socket's configuration
                                    vars.servers[server_id].sockets[index_server].hash === socket_item.hash ||
                                    // kill any child test-websocket sockets if the corresponding dashboard socket ends
                                    (vars.test.testing === true && socket_item.type === "dashboard" && vars.servers[server_id].sockets[index_server].hash === `websocketTest-${socket_item.hash}`) ||
                                    // kill the socket's proxy, if any
                                    (socket_item.proxy !== null && socket_item.proxy !== undefined && vars.servers[server_id].sockets[index_server].hash === socket_item.proxy.hash)
                                ) {
                                    vars.servers[server_id].sockets.splice(index_server, 1);
                                }
                            } while (index_server > 0);
                        }

                        destroy(socket_item, index_list);

                        if (
                            (vars.test.testing === true && socket_item.type === "dashboard") ||
                            (socket_item.proxy !== null && socket_item.proxy !== undefined)
                        ) {
                            index_server = vars.server_meta[server_id].sockets[encryption].length;
                            if (index_server > 0) {
                                do {
                                    index_server = index_server - 1;
                                    if (
                                        vars.server_meta[server_id].sockets[encryption][index_server].hash === `websocketTest-${socket_item.hash}` ||
                                        vars.server_meta[server_id].sockets[encryption][index_server] === socket_item.proxy
                                    ) {
                                        destroy(vars.server_meta[server_id].sockets[encryption][index_server], index_server);
                                        if (index_server < index_list) {
                                            index_list = index_list - 1;
                                        }
                                    }
                                } while (index_server > 0);
                            }
                        }
                    }
                } while (index_list > 0);
            }
        };
    let index_servers:number = 0,
        index_sockets:number = 0,
        len_socket:number = 0;
    if (typeof extension === "function") {
        extension();
    }

    // check the health of stored sockets
    do {
        socket_health(keys[index_servers], "open");
        socket_health(keys[index_servers], "secure");
        index_servers = index_servers + 1;
    } while (index_servers < len);

    // iterate through the servers
    index_servers = 0;
    do {
        len_socket = vars.servers[keys[index_servers]].sockets.length;
        index_sockets = 0;
        // iterate through the sockets on each server
        if (len_socket > 0) {
            do {
                tcp.push(vars.servers[keys[index_servers]].sockets[index_sockets]);
                index_sockets = index_sockets + 1;
            } while (index_sockets < len_socket);
        }
        index_servers = index_servers + 1;
    } while (index_servers < len);
    vars.sockets.time = Date.now();
    vars.sockets.tcp = tcp;
    broadcast(vars.environment.dashboard_id, "dashboard", {
        data: vars.sockets,
        service: "dashboard-socket-application"
    });
};

export default socket_list;