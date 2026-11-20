
import get_address from "../core/get_address.ts";
import http_parse from "../http/http_parse.ts";
import log from "../core/log.ts";
import node from "../core/node.ts";
import socket_extension from "./socket_extension.ts";
import server_halt from "../server/server_halt.ts";
import vars from "../core/vars.ts";

const create_proxy = function transmit_createProxy(config:config_proxy_create):void {
    let count:number = 0;
    const host:string = (function transmit_createProxy_scheme():string {
            const hosts:string[] = (config.domain.includes("://") === true)
                ? config.domain.split("://")
                : ["", config.domain];
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
                if (config.socket.type_primary === "http" && config.socket.timeout > 0) {
                    config.socket.setTimeout(config.socket.timeout);
                    config.socket.on("timeout", function transmit_connection_extend_hash_dataHTTP_timeout():void {
                        config.socket.destroy();
                    });
                }
                if (vars.data.server[config.server_hash].config.single_socket === true) {
                    const terminate = function transmit_connection_extend_hash_dataHTTP_terminate(this:websocket_client):void {
                        this.destroy();
                        server_halt({
                            action: "destroy",
                            server: vars.data.server[this.server_hash].config
                        }, null);
                    };
                    config.socket.on("close", terminate);
                    config.socket.on("end", terminate);
                    config.socket.on("error", terminate);
                }
                if (config.socket.type_primary === "ws" || config.resource === "" || config.resource === null) {
                    proxy.pipe(config.socket);
                    config.socket.pipe(proxy);
                    proxy.write(config.data);
                } else {
                    const payload = function transmit_createProxy_callback_modifyHeaders(socket:websocket_client, config_http:config_http):void {
                        if (config_http.headers === null) {
                            proxy.write(config_http.body);
                        } else {
                            const method:type_http_method | "" = (typeof config_http.method !== "string" || config_http.method.length === 0)
                                    ? null
                                    : config_http.method,
                                resource:string = (config_http.resource === "" || config_http.resource === undefined || config_http.resource === null)
                                    ? null
                                    : config_http.resource;
                            if (typeof method === "string" || typeof resource === "string") {
                                const header:string[] = config_http.headers[0].replace(/\u0020+/g, " ").split(" ");
                                if (typeof method === "string") {
                                    header[0] = method.toUpperCase();
                                }
                                if (typeof resource === "string") {
                                    header[1] = (function transmit_createProxy_callback_modifyHeaders_resource():string {
                                        // not modified resource path
                                        if (socket.http_resource_rule === "" || typeof socket.http_resource_rule !== "string") {
                                            return resource;
                                        }
                                        // wildcard resource match
                                        if ((/\/\*$/).test(socket.http_resource_rule) === true) {
                                            const rule:string = socket.http_resource_rule.replace(/\*$/, "");
                                            if (rule.charAt(0) === "/") {
                                                return `/${resource.replace(rule, "")}`;
                                            }
                                            return resource.replace(rule, "");
                                        }
                                        // literal resource match
                                        if (socket.http_resource_rule.charAt(0) === "/") {
                                            return `/${resource.replace(socket.http_resource_rule, "")}`;
                                        }
                                        return resource.replace(socket.http_resource_rule, "");
                                    }());
                                }
                                config_http.headers[0] = header.join(" ");
                            }
                            config_http.headers[config_http.host_index] = (node.net.isIPv6(config_http.domain) === true)
                                ? `Host: [${host}]:${port_value}`
                                : `Host: ${host}:${port_value}`;
                            proxy.write((config_http.body === null)
                                ? Buffer.from(config_http.headers.join("\r\n") + "\r\n\r\n")
                                : Buffer.concat([Buffer.from(config_http.headers.join("\r\n") + "\r\n\r\n"), config_http.body]));
                        }
                    };
                    proxy.pipe(config.socket);
                    config.socket.on("data", function transmit_createProxy_callback_data(this:websocket_client, data:Buffer):void {
                        const socket:websocket_client = this,
                            config_http:config_http = http_parse(socket.server_hash, socket.addresses.local.port, data);
                        payload(socket, config_http);
                    });
                    payload(config.socket, config.config_http);
                }
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
            origin: `${config.domain} ${port_value}`,
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
            type_primary: (config.config_http.websocket_key === "")
                ? "http"
                : "ws",
            type_secondary: "relay",
            userAgent: config.config_http.user_agent
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
            type_primary: (config.config_http.websocket_key === "")
                ? "http"
                : "ws",
            type_secondary: "proxy",
            userAgent: config.config_http.user_agent
        });
    });
};

export default create_proxy;