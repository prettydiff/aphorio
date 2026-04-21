
import send from "./send.ts";
import vars from "../core/vars.ts";

const broadcast = function transmit_broadcast(server:string, type:string, message:socket_data):void {
    const encryptionType:type_encryption = (vars.data.servers[server] === undefined || vars.data.servers[server] === null)
            ? null
            : vars.data.servers[server].encryption,
        perServer = function transmit_broadcast_perServer(encryption:"open"|"secure"):void {
            const list:websocket_client[] = (vars.data_store.sockets_tcp[server] === undefined)
                ? []
                : vars.data_store.sockets_tcp[server][encryption];
            let index:number = list.length;
            if (index > 0) {
                do {
                    index = index - 1;
                    if (list[index].type === type || type === "") {
                        send(message, list[index], 3);
                    }
                } while (index > 0);
            }
        };
    if (encryptionType === null) {
        return;
    }
    if (encryptionType === "both") {
        perServer("open");
        perServer("secure");
    } else {
        perServer(encryptionType);
    }
};

export default broadcast;
