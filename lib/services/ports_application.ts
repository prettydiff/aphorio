
import broadcast from "../transmit/broadcast.ts";
import vars from "../core/vars.ts";

const ports_application = function services_portsApplication():void {
    const list:supplemental_ports_application_item[] = [],
        keys_container:string[] = Object.keys(vars.data.containers),
        keys_servers:string[] = Object.keys(vars.data.server),
        payload:services_ports_application = {
            data: null,
            time: Date.now()
        };
    let index_item:number = keys_container.length,
        index_ports:number = 0,
        server:supplemental_server_config = null,
        container:core_compose_container = null;

    // from containers
    if (index_item > 0) {
        do {
            index_item = index_item - 1;
            container = vars.data.containers[keys_container[index_item]];
            index_ports = (container.ports === null)
                ? 0
                : container.ports.length;
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
            server = vars.data.server[keys_servers[index_item]].config;
            if (vars.data.server[keys_servers[index_item]].ports !== undefined) {
                if (server.encryption === "both") {
                    list.push({
                        hash: keys_servers[index_item],
                        port: vars.data.server[keys_servers[index_item]].ports.open,
                        service: "server",
                        service_name: server.name,
                        type: "tcp"
                    });
                    list.push({
                        hash: keys_servers[index_item],
                        port: vars.data.server[keys_servers[index_item]].ports.secure,
                        service: "server",
                        service_name: server.name,
                        type: "tcp"
                    });
                } else {
                    list.push({
                        hash: keys_servers[index_item],
                        port: vars.data.server[keys_servers[index_item]].ports[server.encryption],
                        service: "server",
                        service_name: server.name,
                        type: "tcp"
                    });
                }
            } else {
                vars.data.server[keys_servers[index_item]].ports = {
                    open: 0,
                    secure: 0
                };
            }
        } while (index_item > 0);
    }

    list.sort(function services_portsApplication_sort(a:supplemental_ports_application_item, b:supplemental_ports_application_item):-1|1 {
        if (a.port < b.port || (a.port === b.port && a.type < b.type)) {
            return -1;
        }
        return 1;
    });

    payload.data = list;

    vars.data.ports_application = payload.data;
    vars.data_meta.ports_application = payload.time;
    broadcast(vars.id.dashboard_server, "dashboard", {
        data: payload,
        service: "services_ports_application"
    });
};

export default ports_application;