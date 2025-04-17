import create_socket from "../transmit/createSocket.js";
import node from "../utilities/node.js";
import vars from "../utilities/vars.js";

const websocket_test = {
    handler: function services_websocketTest_handler():void {},
    handshake: function services_websocketTest_handshake(socket_data:socket_data, transmit:transmit_socket):void {
        const data:services_websocket_handshake = socket_data.data as services_websocket_handshake,
            browser_socket:websocket_client = transmit.socket as websocket_client,
            socket_id:string = browser_socket.hash,
            config:config_websocket_create = {
                callback: function services_websocket_handshake_callback(socket:websocket_client):void {

                },
                hash: `websocketTest-${socket_id}`,
                handler: websocket_test.handler,
                headers: data.message,
                ip: "",
                port: 0,
                proxy: null,
                resource: null,
                secure: data.encryption,
                server: "dashboard",
                type: "websocket-test"
            };
        let index:number = data.message.length,
            host:string = "";
        do {
            index = index - 1;
            if (data.message[index].toLowerCase().indexOf("host:") === 0) {
                host = data.message[index].replace(/host:\s+/, "");
                break;
            }
        } while (index > 0);
        if (host === "") {
            config.ip = "127.0.0.1";
            config.port = (data.encryption === true)
                ? vars.servers.dashboard.config.ports.secure
                : vars.servers.dashboard.config.ports.open;
        } else {
            if (host.includes("[") === true && host.includes("]") === true) {
                config.ip = host.slice(host.indexOf("[") + 1, host.indexOf("]"));
                host = host.slice(host.indexOf("]") + 1);
                if (host === "") {
                    config.port = (data.encryption === true)
                        ? 443
                        : 80;
                } else {
                    config.port = Number(host.replace(":", ""));
                }
            } else {
                if (node.net.isIPv6(host) === true) {
                    config.ip = host;
                    config.port = (data.encryption === true)
                        ? 443
                        : 80;
                } else if (host.includes(":") === true) {
                    config.ip = host.slice(0, host.indexOf(":"));
                    config.port = Number(host.slice(host.indexOf(":") + 1));
                } else {
                    config.ip = host;
                    config.port = (data.encryption === true)
                        ? 443
                        : 80;
                }
            }
        }
        create_socket(config);
    }
};

export default websocket_test;