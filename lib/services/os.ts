
import os from "../utilities/os.js";
import send from "../transmit/send.js";

const osService = function services_os(socket_data:socket_data, transmit:transmit_socket):void {
    const type_os:type_os = socket_data.service.replace("dashboard-os-", "") as type_os;
    os(type_os, function services_os_callback(output:socket_data):void {
        send(output, transmit.socket as websocket_client, 3);
    });
};

export default osService;