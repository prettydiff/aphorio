
import broadcast from "./broadcast.ts";
import socket_list from "../services/socket_list.ts";
import vars from "../core/vars.ts";

const socket_end = function transmit_socketEnd(error:node_error):void {
    // eslint-disable-next-line @typescript-eslint/no-this-alias, no-restricted-syntax
    const socket:websocket_client = this,
        encryption:"open"|"secure" = (socket.secure === true)
            ? "secure"
            : "open",
        sockets:services_socket_application_item[] = vars.servers[socket.server].sockets,
        address_local:string = (socket.addresses.local.address.includes(":") === true)
            ? `[${socket.addresses.local.address}]:${socket.addresses.local.port}`
            : `${socket.addresses.local.address}:${socket.addresses.local.port}`,
        address_remote:string = (socket.addresses.remote.address.includes(":") === true)
            ? `[${socket.addresses.remote.address}]:${socket.addresses.remote.port}`
            : `${socket.addresses.remote.address}:${socket.addresses.remote.port}`,
        payload_log:config_log = {
            error: (typeof error === "boolean")
                ? new Error()
                : error,
            message: `Socket type ${socket.type} with id ${socket.hash} from ${address_local} to ${address_remote} ended.`,
            section: "sockets-application",
            status: "error",
            time: Date.now()
        };
    // remove the socket from the respective server's list of sockets
    let index:number = sockets.length,
        flag:boolean = false;
    if (index > 0) {
        do {
            index = index - 1;
            if (sockets[index].hash === socket.hash) {
                sockets.splice(index, 1);
            }
        } while (index > 0);
    }

    // remove the socket from the sockets list of server_meta
    index = (vars.server_meta[socket.server] === null || vars.server_meta[socket.server] === undefined)
        ? 0
        : vars.server_meta[socket.server].sockets[encryption].length;
    if (index > 0) {
        do {
            index = index - 1;
            if (vars.server_meta[socket.server].sockets[encryption][index] === socket) {
                vars.server_meta[socket.server].sockets[encryption].splice(index, 1);
            }
            // kill any child websocket-test sockets if the corresponding dashboard socket ends
            if (socket.type === "dashboard" && vars.server_meta[socket.server].sockets[encryption][index] !== null && vars.server_meta[socket.server].sockets[encryption][index] !== undefined && vars.server_meta[socket.server].sockets[encryption][index].hash === `websocketTest-${socket.hash}`) {
                vars.server_meta[socket.server].sockets[encryption][index].status = "end";
                vars.server_meta[socket.server].sockets[encryption][index].destroy();
                flag = true;
            }
        } while (index > 0);
    }

    // look for any websocket test connections of opposite encryption type
    if (socket.type === "dashboard" && flag === false) {
        const encrypt:"open"|"secure" = (encryption === "open")
            ? "secure"
            : "open";
        index = (vars.server_meta[socket.server] === null || vars.server_meta[socket.server] === undefined)
            ? 0
            : vars.server_meta[socket.server].sockets[encrypt].length;
        if (index > 0) {
            do {
                index = index - 1;
                // kill any child websocket-test sockets if the corresponding dashboard socket ends
                if (socket.type === "dashboard" && vars.server_meta[socket.server].sockets[encrypt][index] !== null && vars.server_meta[socket.server].sockets[encrypt][index] !== undefined && vars.server_meta[socket.server].sockets[encrypt][index].hash === `websocketTest-${socket.hash}`) {
                    vars.server_meta[socket.server].sockets[encrypt][index].status = "end";
                    vars.server_meta[socket.server].sockets[encrypt][index].destroy();
                }
            } while (index > 0);
        }
    }

    socket.status = "end";
    socket.off("close", transmit_socketEnd);
    socket.off("end", transmit_socketEnd);
    socket.off("error", transmit_socketEnd);
    socket.destroy();
    if (socket.proxy !== null && socket.proxy !== undefined) {
        if (socket.type === "websocket-test") {
            socket.proxy.proxy = null;
        } else {
            socket.proxy.destroy();
        }
    }
    broadcast("dashboard", "dashboard", {
        data: payload_log,
        service: "dashboard-log"
    });
    broadcast("dashboard", "dashboard", {
        data: socket_list(),
        service: "dashboard-socket-application"
    });
};

export default socket_end;