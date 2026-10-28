
import get_address from "../core/get_address.ts";
import log from "../core/log.ts";
import node from "../core/node.ts";
import socket_extension from "./socketExtension.ts";
import vars from "../core/vars.ts";

const create_proxy = function transmit_createProxy(config:config_proxy_create):void {
    let count:number = 0;
    const host:string = (function transmit_createProxy_scheme():string {
            const hosts:string[] = (config.host.includes("://") === true)
                ? config.host.split("://")
                : ["", config.host]
            if (hosts[0].toLowerCase() === "https" || hosts[0].toLowerCase() === "wss") {
                config.encrypted = true;
            }
            return hosts[1];
        }()),
        port_value:number = (typeof config.port === "number" && config.port > 0)
            ? config.port
            : (config.encrypted === true)
                ? 443
                : 80,
        proxy:websocket_client = (config.encrypted === true)
            ?  node.tls.connect({
                host: host,
                port: port_value,
                rejectUnauthorized: false
            }) as websocket_client
            : node.net.connect({
                host: host,
                port: port_value
            }) as websocket_client,
        now:string = process.hrtime.bigint().toString(),
        callback = function transmit_createProxy_callback():void {
            count = count + 1;
            if (count > 1) {
                // const header:string[] = config.headers[0].replace(/\u0020+/g, " ").split(" ");
                // header[1] = (config.resource === "")
                //     ? "/"
                //     : config.resource.replace(/(\\|\/)/g, "/");
                // config.headers[0] = header.join(" ");
                if (config.resource !== "") {
                    const header:string[] = config.headers[0].replace(/\u0020+/g, " ").split(" ");
                    header[1] = config.resource.replace(/(\\|\/)/g, "/");
                    config.headers[0] = header.join(" ");
                }
                config.headers[config.host_index] = (node.net.isIPv6(config.host) === true)
                    ? `Host: [${host}]:${port_value}`
                    : `Host: ${host}:${port_value}`;
                proxy.pipe(config.socket);
                config.socket.pipe(proxy);
                proxy.write((config.body === null)
                    ? Buffer.from(config.headers.join("\r\n") + "\r\n\r\n")
                    : Buffer.concat([Buffer.from(config.headers.join("\r\n") + "\r\n\r\n"), config.body]));
            }
        };
    proxy.on("error", function transmit_createProxy_error(proxy_error:node_error):void {
        if (vars.test.testing === true) {
            log.shell([
                "Error on establishing proxy connection.",
                proxy_error.stack
            ]);
        }
        log.application({
            error: proxy_error,
            message: "proxy connection error.",
            origin: `${config.host} ${port_value}`,
            section: "servers-web",
            status: "error",
            time: Date.now()
        });
        proxy.destroy();
        config.socket.destroy();
    });
    vars.test.encrypted_proxy = (config.encrypted === true);
    proxy.once("ready", function transmit_createProxy_ready():void {
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

export default create_proxy;