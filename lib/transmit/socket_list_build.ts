
import broadcast from "../transmit/broadcast.ts";
import vars from "../core/vars.ts";

const socket_list = function services_socketList():void {
    const now:number = Date.now(),
        payload:services_socket_application = {
            tcp: vars.data.sockets_tcp,
            time: now,
            udp: vars.data.sockets_udp
        };
    vars.data_meta.sockets = now;
    broadcast(vars.id.dashboard_server, "dashboard", {
        data: payload,
        service: "services_socket_application"
    });
};

export default socket_list;