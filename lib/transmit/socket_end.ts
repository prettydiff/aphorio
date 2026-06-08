
import log from "../core/log.ts";
import message_inspection from "../services/message_inspection.ts";
import socket_list_build from "../transmit/socket_list_build.ts";
import vars from "../core/vars.ts";

const socket_end = function transmit_socketEnd(this:websocket_client, error:node_error):void {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const socket:websocket_client = this,
        address_local:string = (socket.addresses.local.address.includes(":") === true)
            ? `[${socket.addresses.local.address}]:${socket.addresses.local.port}`
            : `${socket.addresses.local.address}:${socket.addresses.local.port}`,
        address_remote:string = (socket.addresses.remote.address.includes(":") === true)
            ? `[${socket.addresses.remote.address}]:${socket.addresses.remote.port}`
            : `${socket.addresses.remote.address}:${socket.addresses.remote.port}`,
        payload_log:config_log = {
            error: error,
            message: `Socket type ${socket.type} with id ${socket.hash} from ${address_local} to ${address_remote} ended.`,
            origin: socket.server_hash,
            section: "sockets-application-tcp",
            status: "error",
            time: Date.now()
        },
        encryption:"open"|"secure" = (socket.encrypted === true)
            ? "secure"
            : "open";
    let index:number = vars.data_store.sockets_tcp[socket.server_hash][encryption].length;

    // remove actual socket object from storage
    if (index > 0) {
        do {
            index = index - 1;
            if (vars.data_store.sockets_tcp[socket.server_hash][encryption][index].hash === socket.hash) {
                vars.data_store.sockets_tcp[socket.server_hash][encryption].splice(index, 1);
                break;
            }
        } while (index > 0);
    }

    // remove socket data
    index = vars.data.sockets_tcp.length;
    if (index > 0) {
        do {
            index = index - 1;
            if (vars.data.sockets_tcp[index].hash === socket.hash) {
                vars.data.sockets_tcp.splice(index, 1);
                break;
            }
        } while (index > 0);
    }

    if (vars.data.servers[socket.server_hash].id === vars.environment.dashboard_id && socket.type === "dashboard") {
        const payload:services_message_inspection = {
            count: 0,
            direction: "in",
            max_size: 0,
            message: "",
            service: "",
            type: "web-server"
        };
        message_inspection.set({
            data: payload,
            service: "dashboard-message-inspection"
        }, {
            socket: socket,
            type: "ws"
        });
    }

    log.application(payload_log);
    socket_list_build();
};

export default socket_end;