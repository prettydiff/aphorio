
import server from "../transmit/server.js";
import server_create from "./server_create.js";
import server_halt from "./server_halt.js";

const servers = function services_server(socketData:socket_data):void {
    if (socketData.service === "dashboard-server") {
        const data:services_action_server = socketData.data as services_action_server,
            action_map:services_dashboard = {
                "activate": server,
                "add": server_create,
                "deactivate": server_halt,
                "destroy": server_halt,
                "modify": server_halt
            };
        action_map[data.action](data, null, data.action as type_halt_action);
    }
};

export default servers;