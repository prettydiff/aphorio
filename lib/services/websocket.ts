import create_socket from "../transmit/createSocket.js";
import node from "../utilities/node.js";
import send from "../transmit/send.js";
import vars from "../utilities/vars.js";

const websocket_test:websocket_test = {
    handler: function services_websocketTest_handler(socket_test:websocket_client, resultBuffer:Buffer, frame:websocket_frame):void {
        // from - websocket-test socket
        // to   - dashboard socket
        const decoder:node_stringDecoder_StringDecoder = new node.stringDecoder.StringDecoder("utf8"),
            result:string = decoder.end(resultBuffer),
            payload:services_websocket_message = {
                frame: frame,
                message: result
            };
        send({
            data: payload,
            service: "dashboard-websocket-message"
        }, socket_test.proxy, 3);
        if (frame.opcode === 8) {
            socket_test.destroy();
        }
    },
    handshake: function services_websocketTest_handshake(socket_data:socket_data, transmit:transmit_socket):void {
        const data:services_websocket_handshake = socket_data.data as services_websocket_handshake,
            browser_socket:websocket_client = transmit.socket as websocket_client,
            socket_id:string = browser_socket.hash,
            socket:websocket_client = transmit.socket as websocket_client;
        let index:number = data.message.length,
            host:string = "";
        if (data.message.length === 1 && data.message[0] === "disconnect") {
            if (socket.proxy !== null) {
                const message:services_websocket_status = {
                    connected: false,
                    error: null
                };
                send({
                    data: message,
                    service: "dashboard-websocket-status"
                }, socket, 3);
                if (socket.proxy !== null && socket.proxy !== undefined && socket.proxy !== socket) {
                    socket.proxy.destroy();
                }
            }
        } else {
            const callback = function services_websocket_handshake_callback(websocket:websocket_client, timeout:bigint, error:node_error):void {
                    const message:services_websocket_status = {
                            connected: (websocket !== null),
                            error: (error === undefined || error === null)
                                ? `Connected in ${Number(timeout) /1e6} milliseconds.`
                                : error.message
                        };
                    send({
                        data: message,
                        service: "dashboard-websocket-status"
                    }, socket, 3);
                },
                config:config_websocket_create = {
                    callback: callback,
                    hash: `websocketTest-${socket_id}`,
                    handler: websocket_test.handler,
                    headers: data.message,
                    ip: "",
                    port: 0,
                    proxy: socket,
                    resource: null,
                    secure: data.encryption,
                    server: "dashboard",
                    timeout: 0,
                    type: "websocket-test"
                },
                secureString:"open"|"secure" = (config.secure === true)
                    ? "secure"
                    : "open";
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
            if (vars.servers.dashboard.config.domain_local.includes(config.ip) === true && vars.servers.dashboard.config.ports[secureString] === config.port) {
                socket.proxy = socket;
                callback(socket, 0n, null);
            } else {
                create_socket(config);
            }
        }
    },
    message: function services_websocketTest_message(socket_data:socket_data, transmit:transmit_socket):void {
        // from - dashboard socket
        // to   - websocket-test socket
        const data:services_websocket_message = socket_data.data as services_websocket_message,
            socket_dashboard:websocket_client = transmit.socket as websocket_client,
            body:Buffer = Buffer.from(data.message),
            same_application = function services_websocketTest_message_sameApplication():void {
                const respond:services_websocket_message = {
                    frame: data.frame,
                    message: `WebSocket response:\n\n${data.message}`
                };
                respond.frame.extended = Buffer.byteLength(respond.message);
                if (respond.frame.extended < 126) {
                    respond.frame.len = respond.frame.extended;
                } else if (respond.frame.extended < 65536) {
                    respond.frame.len = 126;
                } else {
                    respond.frame.len = 127;
                }
                send({
                    data: respond,
                    service: "dashboard-websocket-response"
                }, socket_dashboard, 3);
            };
        let frameHeader:Buffer = null,
            payload:Buffer = null,
            headerSize:number = 2;
        if (data.frame.opcode < 8) {
            if (data.frame.len === 126) {
                headerSize = headerSize + 2;
            } else if (data.frame.len === 127) {
                headerSize = headerSize + 8;
            }
        }
        frameHeader = Buffer.alloc(headerSize);
        if (data.frame.fin === true) {
            frameHeader[0] = 128;
        }
        if (data.frame.rsv1 === true) {
            frameHeader[0] = frameHeader[0] + 64;
        }
        if (data.frame.rsv2 === true) {
            frameHeader[0] = frameHeader[0] + 32;
        }
        if (data.frame.rsv3 === true) {
            frameHeader[0] = frameHeader[0] + 16;
        }
        frameHeader[0] = frameHeader[0] + data.frame.opcode;
        frameHeader[1] = (data.frame.mask === true)
            ? 128 + data.frame.len
            : data.frame.len;
        if (data.frame.opcode < 8) {
            if (data.frame.len === 126) {
                frameHeader.writeUInt16BE(data.frame.extended, 2);
            } else if (data.frame.len === 127) {
                frameHeader.writeUIntBE(data.frame.extended, 4, 6);
            }
            if (data.frame.mask === true) {
                payload = Buffer.concat([frameHeader, data.frame.maskKey, body]);
            } else {
                payload = Buffer.concat([frameHeader, body]);
            }
        } else {
            payload = Buffer.concat([frameHeader, body]);
        }
        // connected to same server, so just respond to the requesting browser
        if (socket_dashboard.proxy === socket_dashboard) {
            same_application();
        // connected to another server spawned from an instance of this application
        } else if (socket_dashboard.type === "websocket-test-remote") {
            same_application();
        // received response from remote of a connection to a different server spawned from an instance of this application
        } else if (socket_dashboard.type === "websocket-test-local") {
            send({
                data: data,
                service: "dashboard-websocket-response"
            }, socket_dashboard.proxy, 3);
        // connected to an unrelated remote
        } else {
            socket_dashboard.proxy.write(payload);
        }
    }
};

export default websocket_test;