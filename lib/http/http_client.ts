
import get_address from "../core/get_address.ts";
import node from "../core/node.ts";
import socket_extension from "../transmit/socketExtension.ts";
import vars from "../core/vars.ts";

const http_client = function http_client(config:transmit_http_client):websocket_client {
    const socket:websocket_client = (config.encryption === true)
            ? node.tls.connect({
                host: config.host,
                port: config.port,
                timeout: config.timeout,
                rejectUnauthorized: false
            }) as websocket_client
            : node.net.connect({
                host: config.host,
                port: config.port,
                timeout: config.timeout,
            }) as websocket_client,
        extension = function http_client_extension():void {
            socket.on("data", function http_client_extension_data(this:websocket_client, data_response:Buffer):void {
                const socket:websocket_client = this,
                    segmentation = function http_client_extension_data_segmentation(data:Buffer):void {
                        if (socket.fragments.length === 0) {
                            const index:number = data.indexOf("\r\n\r\n");
                            socket.http_header = (index > 0)
                                ? data.subarray(0, index + 4).toString()
                                : data.toString();
                            data = (index < 0)
                                ? Buffer.from("")
                                : data.subarray(index + 4);
                            if ((/transfer-encoding:\s*chunked/).test(socket.http_header.toLowerCase()) === true) {
                                socket.http_response_type = -1;
                            } else if ((/content-length:\s*\d+/).test(socket.http_header.toLowerCase()) === true) {
                                const str:string = socket.http_header.toLowerCase().split("content-length:")[1],
                                    end_index:number = str.indexOf("\r\n");
                                if (end_index > 0) {
                                    socket.http_response_type = Number(str.slice(0, end_index).trim());
                                } else {
                                    socket.http_response_type = Number(str.trim());
                                }
                            }
                        }
                        if (socket.http_response_type === 0) {
                            // no body
                            const header:string = socket.http_header;
                            socket.http_header = "";
                            config.callback_response(socket, header, Buffer.from(""));
                        } else if (socket.http_response_type === -1) {
                            // chunked
                            if (data.toString() === "\r\n0\r\n\r\n") {
                                const payload:Buffer = Buffer.concat(socket.fragments),
                                    header:string = socket.http_header;
                                socket.http_header = "";
                                socket.http_response_type = 0;
                                socket.fragments = [];
                                config.callback_response(socket, header, payload);
                            } else if (data.indexOf("\r\n0\r\n\r\n") === data.byteLength - 7) {
                                socket.fragments.push(data.subarray(0, data.byteLength - 7));
                                const payload:Buffer = Buffer.concat(socket.fragments),
                                    header:string = socket.http_header;
                                socket.http_header = "";
                                socket.http_response_type = 0;
                                socket.fragments = [];
                                config.callback_response(socket, header, payload);
                            } else {
                                socket.fragments.push(data.subarray(data.indexOf("\r\n", 2) + 2));
                            }
                        } else {
                            // content-length
                            socket.fragments.push(data);
                            const payload:Buffer = Buffer.concat(socket.fragments),
                                    header:string = socket.http_header;
                            if (payload.byteLength === socket.http_response_type) {
                                socket.http_header = "";
                                socket.http_response_type = 0;
                                socket.fragments = [];
                                config.callback_response(socket, header, payload);
                            } else if (payload.byteLength > socket.http_response_type) {
                                const ending:number = socket.http_response_type;
                                socket.http_header = "";
                                socket.http_response_type = 0;
                                socket.fragments = [];
                                config.callback_response(socket, header, payload.subarray(0, ending));
                                http_client_extension_data_segmentation(payload.subarray(ending));
                            }
                        }
                    };
                segmentation(data_response);
            });
            socket.on("error", function http_client_error(this:websocket_client, error:node_error):void {
                const socket:websocket_client = this;
                socket.end();
                config.callback_error(socket, error);
            });
            socket.on("ready", function http_client_ready(this:websocket_client):void {
                const socket:websocket_client = this;
                socket.fragments = [];
                socket.write(config.message);
            });
            socket.on("timeout", function http_client_timeout(this:websocket_client):void {
                const socket:websocket_client = this;
                socket.end();
            });
        };
    socket.addresses = get_address(socket);
    socket.timeout = config.timeout;
    socket_extension({
        callback: extension,
        handler: null,
        identifier: `http-${config.host}-${config.port}-${Math.random()}`,
        proxy: null,
        role: "client",
        server: (vars.options.mode === "test-proxy")
            ? vars.test.servers[0].id
            : vars.id.dashboard_server,
        single_socket: false,
        socket: socket,
        type: `http-${config.type}`,
        userAgent: `aphorio-${vars.environment.version}`
    });
    return socket;
};

export default http_client;