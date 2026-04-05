
import broadcast from "../transmit/broadcast.ts";
import vars from "../core/vars.ts";

const socket_list = function services_socketList():void {
    vars.data_meta.sockets = Date.now();
    broadcast(vars.environment.dashboard_id, "dashboard", {
        data: {
            tcp: vars.data.sockets_tcp,
            time: vars.data_meta.sockets,
            udp: vars.data.sockets_udp
        },
        service: "dashboard-socket-application"
    });
};

export default socket_list;