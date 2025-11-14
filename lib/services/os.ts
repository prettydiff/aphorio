
import os_lists from "../utilities/os_lists.ts";
import send from "../transmit/send.ts";

const osService = function services_os(socket_data:socket_data, transmit:transmit_socket):void {
    const type_os:type_os_services = socket_data.service.replace("dashboard-os-", "") as type_os_services;
    os_lists(type_os, function services_os_callback(output:socket_data):void {
        send(output, transmit.socket as websocket_client, 3);
    });
};

export default osService;