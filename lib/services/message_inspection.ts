import send from "../transmit/send.ts";
import vars from "../core/vars.ts";


const message_inspection:core_module_messageInspection = {
    send: function services_messageInspection_send(data:services_message_inspection):void {
        let index_messages:number = vars.data_store.message_inspection.length;
        if (index_messages > 0) {
            do {
                index_messages = index_messages - 1;
                if (
                    vars.data_store.message_inspection[index_messages].type === data.type &&
                    vars.data_store.message_inspection[index_messages].service === data.service
                ) {
                    send({
                        data: data,
                        service: "dashboard-message-inspection"
                    }, vars.data_store.message_inspection[index_messages].socket, 3);
                }
            } while (index_messages > 0);
        }
    },
    set: function services_messageInspection_set(socket_data:socket_data, transmit:transmit_socket):void {
        const data:services_message_inspection = socket_data.data as services_message_inspection,
            socket:websocket_client = transmit.socket as websocket_client;
        let index:number = vars.data_store.message_inspection.length;
        if (index > 0) {
            do {
                index = index - 1;
                if (vars.data_store.message_inspection[index].socket === socket) {
                    if (data.service === "" || (data.type === "web-server" && vars.data.servers[data.service] === undefined) || (data.type === "docker-container" && vars.data.containers[data.service] === undefined)) {
                        vars.data_store.message_inspection.splice(index, 1);
                    } else {
                        vars.data_store.message_inspection[index].service = data.service;
                        vars.data_store.message_inspection[index].type = data.type;
                    }
                    return;
                }
            } while (index > 0);
        }
        if (data.service !== "" && (
            (data.type === "web-server" && vars.data.servers[data.service] !== undefined) ||
            (data.type === "docker-container" && vars.data.containers[data.service] !== undefined)
        )) {
            vars.data_store.message_inspection.push({
                service: data.service,
                socket: socket,
                type: data.type
            });
            if (data.type === "docker-container") {

            }
        }
    }
};

export default message_inspection;