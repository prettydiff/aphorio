
import broadcast from "../transmit/broadcast.ts";
import server from "../transmit/server.ts";
import server_create from "./server_create.ts";
import server_halt from "./server_halt.ts";
import vars from "../core/vars.ts";

const servers = function services_server(socketData:socket_data):void {
    if (socketData.service === "dashboard-server") {
        const data:services_action_server = socketData.data as services_action_server,
            callback = function services_server_callback():void {
                broadcast(vars.dashboard_id, "dashboard", {
                    data: vars.servers,
                    service: "dashboard-server"
                });
            };
        if (data.action === "activate") {
            server(data, callback);
        } else if (data.action === "add") {
            server_create(data, callback, (data.server.id === vars.dashboard_id));
        } else {
            server_halt(data, callback);
        }
    }
};

export default servers;