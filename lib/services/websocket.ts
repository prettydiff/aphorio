import create_socket from "../transmit/createSocket.js";
import node from "../utilities/node.js";
import send from "../transmit/send.js";
import vars from "../utilities/vars.js";

const websocket_test:websocket_test = {
    handler: function services_websocketTest_handler():void {},
    handshake: function services_websocketTest_handshake(socket_data:socket_data, transmit:transmit_socket):void {
        const data:services_websocket_handshake = socket_data.data as services_websocket_handshake,
            browser_socket:websocket_client = transmit.socket as websocket_client,
            socket_id:string = browser_socket.hash,
            socket:websocket_client = transmit.socket as websocket_client;
        let index:number = data.message.length,
            host:string = "";
        if (data.message.length === 1 && data.message[0] === "disconnect") {
            if (websocket_test.socket !== null) {
                const message:services_websocket_status = {
                    connected: false,
                    error: null
                };
                send({
                    data: message,
                    service: "dashboard-websocket-status"
                }, socket, 3);
                websocket_test.socket.destroy();
                websocket_test.socket = null;
            }
        } else {
            const config:config_websocket_create = {
                callback: function services_websocket_handshake_callback(websocket:websocket_client, timeout:bigint, error:node_error):void {
                    const message:services_websocket_status = {
                            connected: (websocket !== null),
                            error: (error === undefined)
                                ? `Connected in ${Number(timeout) /1e6} milliseconds.`
                                : error
                        };
                    websocket_test.socket = websocket;
                    send({
                        data: message,
                        service: "dashboard-websocket-status"
                    }, socket, 3);
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
                timeout: 0,
                type: "websocket-test"
            };
            do {
                index = index - 1;
                if (data.message[index].toLowerCase().indexOf("host:") === 0) {
                    host = data.message[index].toLowerCase().replace(/host:\s+/, "");
                    break;
                }
            } while (index > 0);
            if (host === "") {
                config.ip = "127.0.0.1";
                config.port = (data.encryption === true)
                    ? vars.servers.dashboard.config.ports.secure
                    : vars.servers.dashboard.config.ports.open;
            } else if (host.includes("[") === true && host.includes("]") === true) {
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
            if (isNaN(data.timeout) === false && data.timeout > 0) {
                config.timeout = Math.floor(data.timeout);
            }
            create_socket(config);
        }
    },
    socket: null
};

export default websocket_test;