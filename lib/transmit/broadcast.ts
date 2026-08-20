
import send from "./send.ts";
import vars from "../core/vars.ts";

const broadcast = function transmit_broadcast(server:string, type:string, message:socket_data):void {
    const encryptionType:type_encryption = (vars.data.server[server] === undefined || vars.data.server[server] === null)
            ? null
            : vars.data.server[server].config.encryption,
        perServer = function transmit_broadcast_perServer(encryption:"open"|"secure"):void {
            const list:websocket_client[] = (vars.data_store.server[server].sockets_tcp === undefined)
                ? []
                : vars.data_store.server[server].sockets_tcp[encryption];
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
