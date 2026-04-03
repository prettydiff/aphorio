
import log from "../core/log.ts";
import socket_list from "../services/socket_list.ts";

const socket_end = function transmit_socketEnd(error:node_error):void {
    // eslint-disable-next-line @typescript-eslint/no-this-alias, no-restricted-syntax
    const socket:websocket_client = this,
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
            origin: socket.server,
            section: "sockets-application-tcp",
            status: "error",
            time: Date.now()
        };

    log.application(payload_log);
    socket_list();
};

export default socket_end;