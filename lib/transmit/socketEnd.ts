
import broadcast from "./broadcast.ts";
import get_address from "../utilities/getAddress.ts";
import vars from "../utilities/vars.ts";

const socket_end = function transmit_socketEnd(socket_input:websocket_client):void {
    const socket:websocket_client = (typeof socket_input === "object")
            ? socket_input
            // eslint-disable-next-line no-restricted-syntax
            : this,
        encryption:"open"|"secure" = (socket.secure === true)
            ? "secure"
            : "open",
        sockets:services_socket[] = vars.servers[socket.server].sockets,
        payload_configuration:services_socket = {
            address: get_address({
                socket: socket_input,
                type: "ws"
            }),
            encrypted: socket.encrypted,
            hash: socket.hash,
            proxy: (socket.proxy === null || socket.proxy === undefined)
                ? ""
                : socket.proxy.hash,
            role: socket.role,
            server: socket.server,
            type: socket.type
        },
        payload:services_dashboard_status = {
            action: "destroy",
            configuration: payload_configuration,
            message: "Socket ended.",
            status: "success",
            time: Date.now(),
            type: "socket"
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
    socket.destroy();
    if (socket.proxy !== null && socket.proxy !== undefined) {
        if (socket.type === "websocket-test") {
            socket.proxy.proxy = null;
        } else {
            socket.proxy.destroy();
        }
    }

    broadcast("dashboard", "dashboard", {
        data: payload,
        service: "dashboard-status"
    });
};

export default socket_end;