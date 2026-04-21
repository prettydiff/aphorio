
import broadcast from "../transmit/broadcast.ts";
import server_create from "./server_create.ts";
import server_halt from "./server_halt.ts";
import server_start from "./server_start.ts";
import vars from "../core/vars.ts";

const servers = function services_server(socketData:socket_data):void {
    if (socketData.service === "dashboard-server-action") {
        const data:services_server_action = socketData.data as services_server_action,
            callback = function services_server_callback():void {
                const payload:services_server_update = {
                    ports_used: vars.data_store.server_ports,
                    servers: vars.data.servers
                };
                broadcast(vars.environment.dashboard_id, "dashboard", {
                    data: payload,
                    service: "dashboard-server-update"
                });
            };
        if (data.action === "activate") {
            server_start(data.server.id, callback);
        } else if (data.action === "add") {
            server_create(data, callback, (data.server.id === vars.environment.dashboard_id));
        } else {
            server_halt(data, callback);
        }
    }
};

export default servers;