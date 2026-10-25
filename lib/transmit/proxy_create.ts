
import get_address from "../core/get_address.ts";
import log from "../core/log.ts";
import node from "../core/node.ts";
import socket_extension from "./socketExtension.ts";

const proxy_create = function transmit_proxyCreate(config:config_proxy_create):void {
    let count:number = 0;
    const proxy:websocket_client = (config.encrypted === true)
            ?  node.tls.connect({
                host: config.host,
                port: config.port,
                rejectUnauthorized: false
            }) as websocket_client
            : node.net.connect({
                host: config.host,
                port: config.port
            }) as websocket_client,
        now:string = process.hrtime.bigint().toString(),
        callback = function transmit_proxyCreate_callback():void {
            count = count + 1;
            if (count > 1) {
                proxy.pipe(config.socket);
                config.socket.pipe(proxy);
                proxy.write(config.data);
            }
        };
    proxy.on("error", function transmit_proxyCreate_error(proxy_error:node_error):void {
        log.application({
            error: proxy_error,
            message: "UDP connection error.",
            origin: `${config.host} ${config.port}`,
            section: "servers-web",
            status: "error",
            time: Date.now()
        });
        proxy.destroy();
        config.socket.destroy();
    });
    proxy.once("ready", function transmit_proxyCreate_ready():void {
        // requested socket
        socket_extension({
            callback: callback,
            handler: null,
            identifier: `${config.identifier}-${now}`,
            proxy: proxy,
            role: "server",
            server: config.server_hash,
            single_socket: false,
            socket: config.socket,
            temporary: false,
            timeout: null,
            type: "relay",
            userAgent: config.user_agent
        });
        proxy.addresses = get_address(proxy);
        // proxy socket
        socket_extension({
            callback: callback,
            handler: null,
            identifier: `${config.identifier}-${now}-proxy`,
            proxy: config.socket,
            role: "client",
            server: config.server_hash,
            single_socket: false,
            socket: proxy,
            temporary: false,
            timeout: null,
            type: "proxy",
            userAgent: config.user_agent
        });
    });
};

export default proxy_create;