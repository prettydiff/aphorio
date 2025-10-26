
import log from "../core/log.ts";
import node from "../core/node.ts";
import socket_extension from "./socketExtension.ts";

const create_socket = function transmit_createSocket(config:config_websocket_create):void {
    let startTime:bigint = null;
    const client:websocket_client = (config.secure === true)
            ? node.tls.connect({
                host: config.ip,
                port: config.port,
                timeout: config.timeout,
                rejectUnauthorized: false
            }) as websocket_client
            : node.net.connect({
                host: config.ip,
                port: config.port,
                timeout: config.timeout,
            }) as websocket_client,
        resource:string = (config.resource === null || config.resource === "" || config.resource === "/")
            ? "GET / HTTP/1.1"
            : config.resource,
        header:string[] = (config.headers === undefined || config.headers === null)
            ? [
                resource,
                (config.ip.indexOf(":") > -1)
                    ? `Host: [${config.ip}]:${config.port}`
                    : `Host: ${config.ip}:${config.port}`,
                "Upgrade: websocket",
                "Connection: Upgrade",
                "Sec-WebSocket-Version: 13",
                `Sec-WebSocket-Key: ${Buffer.from((Math.random().toString() + Math.random()).slice(2, 18)).toString("base64")}`,
                `Sec-WebSocket-Protocol: ${config.type}`
            ]
            : config.headers,
        callbackError = function transmit_createSocket_hash_error(errorMessage:node_error):void {
            log.application({
                error: errorMessage,
                message: `Error attempting websocket connect from client side on server. ${(config.proxy === null)
                    ? "Socket is not a proxy."
                    : `Socket is a proxy to ${config.proxy.hash} on server ${config.proxy.server}.`}`,
                section: (config.type === "websocket-test")
                    ? "websocket"
                    : "sockets-application",
                status: "error",
                time: Date.now()
            });
            if (config.type === "websocket-test") {
                config.callback(null, null, errorMessage);
            }
        },
        callbackReady = function transmit_createSocket_hash_ready():void {
            header.push("");
            header.push("");
            client.write(header.join("\r\n"));
            startTime = process.hrtime.bigint();
            client.once("data", function transmit_createSocket_hash_ready_data(responseData:Buffer):void {
                const response:string = responseData.toString();
                if ((/^HTTP\/1.1 (4|5)\d{2}/).test(response) === true) {
                    let status:string = response.slice(response.indexOf(" ") + 1);
                    status = status.slice(0, status.indexOf(" "));
                    callbackError(new Error(`Remote server returned an HTTP response with status code ${status}.`));
                    return null;
                }
                startTime = process.hrtime.bigint() - startTime;
                socket_extension({
                    callback: config.callback,
                    handler: config.handler,
                    identifier: config.hash,
                    proxy: config.proxy,
                    role: "client",
                    server: config.server,
                    single_socket: false,
                    socket: client,
                    temporary: false,
                    timeout: startTime,
                    type: config.type
                });
            });
        },
        // eslint-disable-next-line max-params
        callbackTimeout = function transmit_createSocket_hash_timeout(ip:string, port:number, family:number, errorItem?:node_error):void {
            const error:node_error = (errorItem === undefined)
                ? new Error("Socket handshake timed out.")
                : errorItem;
            error.code = (errorItem === undefined)
                ? "ETIMEDOUT"
                : errorItem.code;
            config.callback(null, null, error);
            client.removeAllListeners("error");
            client.removeAllListeners("ready");
        };
    if (config.ip === "") {
        // an empty string defaults to loopback, which creates an endless feedback loop
        return;
    }
    if (config.timeout > 0) {
        client.once("connectionAttemptTimeout", callbackTimeout);
    }
    client.once("connectionAttemptFailed", callbackTimeout);
    client.once("error", callbackError);
    client.once("ready", callbackReady);
};

export default create_socket;