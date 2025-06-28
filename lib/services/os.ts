
import broadcast from "../transmit/broadcast.js";
import os from "../utilities/os.js";

const osService = function services_os(socket_data:socket_data):void {
    const type_os:type_os = socket_data.service.replace("dashboard-os-", "") as type_os;
    os(type_os, function services_os_callback(output:socket_data):void {
        broadcast("dashboard", "dashboard", output);
    });
};

export default osService;