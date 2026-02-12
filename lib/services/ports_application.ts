
import broadcast from "../transmit/broadcast.ts";
import vars from "../core/vars.ts";

const ports_application = function services_portsApplication():void {
    const list:services_ports_application_item[] = [],
        keys_container:string[] = Object.keys(vars.compose.containers),
        keys_servers:string[] = Object.keys(vars.servers),
        payload:services_ports_application = {
            data: null,
            time: Date.now()
        };
    let index_item:number = keys_container.length,
        index_ports:number = 0,
        server:server = null,
        container:core_compose_container = null;

    // from containers
    if (index_item > 0) {
        do {
            index_item = index_item - 1;
            container = vars.compose.containers[keys_container[index_item]];
            index_ports = container.ports.length;
            if (index_ports > 0) {
                do {
                    index_ports = index_ports - 1;
                    list.push({
                        hash: keys_container[index_item],
                        port: container.ports[index_ports][0],
                        service: "container",
                        service_name: container.name,
                        type: container.ports[index_ports][1]
                    });
                } while (index_ports > 0);
            }
        } while (index_item > 0);
    }

    // from servers
    index_item = keys_servers.length;
    if (index_item > 0) {
        do {
            index_item = index_item - 1;
            server = vars.servers[keys_servers[index_item]];
            if (server.config.encryption === "both") {
                list.push({
                    hash: keys_servers[index_item],
                    port: server.status.open,
                    service: "server",
                    service_name: server.config.name,
                    type: "tcp"
                });
                list.push({
                    hash: keys_servers[index_item],
                    port: server.status.secure,
                    service: "server",
                    service_name: server.config.name,
                    type: "tcp"
                });
            } else {
                list.push({
                    hash: keys_servers[index_item],
                    port: server.status[server.config.encryption],
                    service: "server",
                    service_name: server.config.name,
                    type: "tcp"
                });
            }
        } while (index_item > 0);
    }

    list.sort(function dashboard_sections_portsApplication_receive_sort(a:services_ports_application_item, b:services_ports_application_item):-1|1 {
        if (a.port < b.port || (a.port === b.port && a.type < b.type)) {
            return -1;
        }
        return 1;
    });

    payload.data = list;

    vars.ports_application = payload;
    broadcast(vars.environment.dashboard_id, "dashboard", {
        data: payload,
        service: "dashboard-ports-application"
    });
};

export default ports_application;