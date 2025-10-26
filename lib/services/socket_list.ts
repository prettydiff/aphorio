
import vars from "../core/vars.ts";

const socket_list = function services_socketList(extension?:() => void):services_socket_application {
    const keys:string[] = Object.keys(vars.servers),
        len:number = keys.length,
        output:services_socket_application_item[] = [];
    let index_servers:number = 0,
        index_sockets:number = 0,
        len_socket:number = 0;
    if (typeof extension === "function") {
        extension();
    }

    // iterate through the servers
    do {
        len_socket = vars.servers[keys[index_servers]].sockets.length;
        index_sockets = 0;
        // iterate through the sockets on each server
        if (len_socket > 0) {
            do {
                output.push(vars.servers[keys[index_servers]].sockets[index_sockets]);
                index_sockets = index_sockets + 1;
            } while (index_sockets < len_socket);
        }
        index_servers = index_servers + 1;
    } while (index_servers < len);
    return {
        list: output,
        time: Date.now()
    };
};

export default socket_list;