import create_socket from "../transmit/createSocket.ts";
import node from "../utilities/node.ts";
import send from "../transmit/send.ts";
import vars from "../utilities/vars.ts";

const websocket_test:websocket_test = {
    find_socket: function services_websocket_findSocket(direction:"in"|"out", hashString:string):websocket_client {
        const hash:string = (direction === "in")
            ? hashString.replace("websocketTest-", "")
            : `websocketTest-${hashString}`;
        let sockets:websocket_client[] = vars.server_meta.dashboard.sockets.open,
            index:number = sockets.length;
        if (index > 0) {
            do {
                index = index - 1;
                if (sockets[index].hash === hash) {
                    return sockets[index];
                }
            } while (index > 0);
        }
        sockets = vars.server_meta.dashboard.sockets.secure;
        index = sockets.length;
        if (index > 0) {
            do {
                index = index - 1;
                if (sockets[index].hash === hash) {
                    return sockets[index];
                }
            } while (index > 0);
        }
        return null;
    },
    handler_client: function services_websocketTest_handlerClient(socket_test:websocket_client, resultBuffer:Buffer, frame:websocket_frame):void {
        // from - websocket-test socket
        // to   - dashboard socket
        const decoder:node_stringDecoder_StringDecoder = new node.stringDecoder.StringDecoder("utf8"),
            result:string = decoder.end(resultBuffer),
            payload:services_websocket_message = {
                frame: frame,
                message: result
            },
            socket_dashboard:websocket_client = websocket_test.find_socket("in", socket_test.hash);
        if (socket_dashboard !== null) {
            send({
                data: payload,
                service: "dashboard-websocket-message"
            }, socket_dashboard, 3);
        }
        if (frame.opcode === 8) {
            socket_test.destroy();
        }
    },
    handler_server: function services_websocketTest_handlerServer(socket_test:websocket_client, resultBuffer:Buffer):void {
        send(`Response message.\n\n${resultBuffer.toString()}`, socket_test, 1);
    },
    handshake: function services_websocketTest_handshake(socket_data:socket_data, transmit:transmit_socket):void {
        const data:services_websocket_handshake = socket_data.data as services_websocket_handshake,
            browser_socket:websocket_client = transmit.socket as websocket_client,
            socket_id:string = browser_socket.hash,
            socket_dashboard:websocket_client = transmit.socket as websocket_client,
            socket_test:websocket_client = websocket_test.find_socket("out", socket_dashboard.hash);
        let index:number = data.message.length,
            host:string = "";
        if (data.message.length === 1 && data.message[0] === "disconnect") {
            const message:services_websocket_status = {
                connected: false,
                error: null
            };
            send({
                data: message,
                service: "dashboard-websocket-status"
            }, socket_dashboard, 3);
            if (socket_test !== null) {
                socket_test.destroy();
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
                    }, socket_dashboard, 3);
                },
                config:config_websocket_create = {
                    callback: callback,
                    hash: `websocketTest-${socket_id}`,
                    handler: websocket_test.handler_client,
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

            // get the host value
            do {
                index = index - 1;
                if (data.message[index].toLowerCase().indexOf("host:") === 0) {
                    host = data.message[index].toLowerCase().replace(/host:\s+/, "");
                    break;
                }
            } while (index > 0);

            // set host to loopback if not found
            if (host === "") {
                config.ip = "127.0.0.1";
                config.port = (data.encryption === true)
                    ? vars.servers.dashboard.status.secure
                    : vars.servers.dashboard.status.open;
            // discern host value from IPv6 address plus specified port
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
            // if literal IPv6 value set host to IPv6 address
            } else if (node.net.isIPv6(host) === true) {
                config.ip = host;
                config.port = (data.encryption === true)
                    ? 443
                    : 80;
            // if host value is IPv4 plus port number then discern the correct values
            } else if (host.includes(":") === true) {
                config.ip = host.slice(0, host.indexOf(":"));
                config.port = Number(host.slice(host.indexOf(":") + 1));
            // otherwise use the supplied host with default HTTP ports
            } else {
                config.ip = host;
                config.port = (data.encryption === true)
                    ? 443
                    : 80;
            }

            // set the timeout value for the handshake, if any
            if (isNaN(data.timeout) === false && data.timeout > 0) {
                config.timeout = Math.floor(data.timeout);
            }

            create_socket(config);
        }
    },
    message: function services_websocketTest_message(socket_data:socket_data, transmit:transmit_socket):void {
        // from - dashboard socket
        // to   - websocket-test socket
        const data:services_websocket_message = socket_data.data as services_websocket_message,
            socket_dashboard:websocket_client = transmit.socket as websocket_client,
            body:Buffer = Buffer.from(data.message),
            socket_test:websocket_client = websocket_test.find_socket("out", socket_dashboard.hash);
        let frameHeader:Buffer = null,
            payload:Buffer = null,
            headerSize:number = 2;
        if (socket_test === null) {
            return;
        }
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
        socket_test.write(payload);
    }
};

export default websocket_test;