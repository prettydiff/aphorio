
import log from "../utilities/log.js";
import node from "../utilities/node.js";
import socket_extension from "./socketExtension.js";

const create_socket = function transmit_createSocket(config:config_websocket_create):void {
    let a:number = 0,
        startTime:bigint = null;
    const len:number = config.headers.length,
        client:websocket_client = (config.secure === true)
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
            log({
                action: "add",
                config: errorMessage,
                message: `Error attempting websocket connect from client side on server. ${(config.proxy === null)
                    ? "Socket is not a proxy."
                    : `Socket is a proxy to ${config.proxy.hash} on server ${config.proxy.server}.`}`,
                status: "error",
                type: (config.type === "websocket-test")
                    ? "websocket-test"
                    : "socket"
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
            client.once("data", function transmit_createSocket_hash_ready_data():void {
                startTime = process.hrtime.bigint() - startTime;
                socket_extension({
                    callback: config.callback,
                    handler: config.handler,
                    identifier: config.hash,
                    proxy: config.proxy,
                    role: "client",
                    server: config.server,
                    socket: client,
                    temporary: false,
                    timeout: startTime,
                    type: config.type
                });
            });
        },
        callbackTimeout = function transmit_createSocket_hash_timeout():void {
            const error:node_error = new Error("Socket handshake timedout.");
            error.code = "ETIMEDOUT";
            config.callback(null, null, error);
            client.removeAllListeners("error");
            client.removeAllListeners("ready");
        };
    if (config.ip === "") {
        // an empty string defaults to loopback, which creates an endless feedback loop
        return;
    }
    if (len > 0) {
        do {
            header.push(config.headers[a]);
            a = a + 1;
        } while (a < len);
    }
    if (config.timeout > 0) {
        client.once("connectionAttemptTimeout", callbackTimeout);
    }
    client.once("error", callbackError);
    client.once("ready", callbackReady);
};

export default create_socket;