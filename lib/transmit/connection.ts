
import create_proxy from "./create_proxy.ts";
import get_address from "../core/get_address.ts";
import hash from "../core/hash.ts";
import http from "../http/index.ts";
import http_parse from "../http/http_parse.ts";
import http_redirect from "../http/http_redirect.ts";
import log from "../core/log.ts";
import node from "../core/node.ts";
import message_handler from "./messageHandler.ts";
import send from "./send.ts";
import server_halt from "../server/server_halt.ts";
import socket_extension from "./socket_extension.ts";
import terminal from "../services/terminal.ts";
import vars from "../core/vars.ts";

//cspell: words prettydiff

const connection = function transmit_connection(this:core_server_instance, TLS_socket:node_tls_TLSSocket):void {
    const server_id:string = this.id,
        server:supplemental_server_config = vars.data.server[server_id].config,
        extend = function transmit_connection_extend(this:websocket_client, data:Buffer):void {
            // mutual TLS enforcement
            if (vars.data.server[server.id].config.mutual_tls === true) {
                // eslint-disable-next-line @typescript-eslint/no-this-alias
                const socket:websocket_client = this,
                    certificate_client:node_crypto_X509Certificate = (vars.data.server[server.id].config.mutual_tls === true && socket.encrypted === true)
                        ? socket.getPeerX509Certificate()
                        : null;
                if (socket.encrypted !== true || certificate_client === null || certificate_client === undefined) {
                    socket.destroy();
                } else {
                    const now:number = Date.now(),
                        parent_cert:node_crypto_X509Certificate = new node.crypto.X509Certificate(vars.data_store.server[server.id].server_certs.ca),
                        parent_key:node_crypto_KeyObject = parent_cert.publicKey,
                        from:number = Date.parse(certificate_client.validFrom),
                        until:number = Date.parse(certificate_client.validTo);
                    if (parent_key === null || parent_key === undefined || from > now || until < now || certificate_client.verify(parent_key) !== true) {
                        socket.destroy();
                        return;
                    }
                }
            }
            const socket:websocket_client = this,
                address:transmit_addresses_socket = get_address(socket),
                config_http:config_http = http_parse(server_id, address.local.port, data);
            hash({
                algorithm: "sha1",
                callback: function transmit_connection_extend_hash(output:core_hash_output):void {
                    const localFlag:boolean = (server_id === vars.id.dashboard_server),
                        websocket:boolean = (typeof config_http.websocket_key === "string" && config_http.websocket_key !== ""),
                        identifier:string = (function transmit_connection_extend_hash_identifier():string {
                            if (websocket === false) {
                                return `http-${config_http.resource}-${output.hash}`;
                            }
                            if (localFlag === true && config_http.websocket_type === "dashboard-terminal") {
                                return `ws-dashboard-terminal-${output.hash}`;
                            }
                            if (config_http.websocket_type === "test-websocket") {
                                return `ws-dashboard-test--${output.hash}`;
                            }
                            return `ws-${config_http.websocket_type}-${output.hash}`;
                        }()),
                        handler_ws:websocket_message_handler = (function transmit_connection_extend_hash_handlerWS():websocket_message_handler {
                            if (websocket === false) {
                                return null;
                            }
                            if (config_http.websocket_type === "test-websocket") {
                                return message_handler.test_websocket;
                            }
                            if (config_http.websocket_type === "test-performance-socket") {
                                if (vars.test.test_browser === "send") {
                                    return null;
                                }
                                return message_handler.test_performance;
                            }
                            return message_handler.default;
                        }()),
                        blocked =       function transmit_connection_extend_hash_blocked():boolean {
                            const domain_local:string[] = server.domain_local.concat(vars.environment.interfaces);
                            let index:number = (server.block_list === null || server.block_list === undefined)
                                    ? 0
                                    : server.block_list.referrer.length,
                                message:string = "";
                            if (config_http.headers.length < 3) {
                                message = "incomplete RFC2616 headers";
                            } else if (domain_local.includes(config_http.domain) === false && socket.proxy === null) {
                                message = "desired domain not supported on this server";
                            } else if (server.block_list !== null && server.block_list !== undefined) {
                                if (server.block_list.host.includes(config_http.origin) === true) {
                                    message = "origin in server's block list";
                                }
                                if (server.block_list.ip.includes(address.remote.address) === true) {
                                    message = "remote IP in server's block list";
                                }
                            }
                            if (index > 0) {
                                do {
                                    index = index - 1;
                                    if (config_http.referrer.indexOf(server.block_list.referrer[index].toLowerCase()) === 0 || config_http.referrer.replace(/\w+:\/\//, "").indexOf(server.block_list.referrer[index].toLowerCase()) === 0) {
                                        message = "referrer in block list";
                                        break;
                                    }
                                } while (index > 0);
                            }
                            if (message === "") {
                                return false;
                            }
                            socket.destroy();
                            log.application({
                                error: null,
                                message: `Blocked socket - ${message}`,
                                origin: server.id,
                                section: "servers-web",
                                status: "informational",
                                time: Date.now()
                            });
                            return true;
                        },
                        data_event =    function transmit_connection_extend_hash_dataEvent():void {
                            socket_extension({
                                callback: (websocket === true)
                                    ? data_ws
                                    : data_http,
                                handler: handler_ws,
                                identifier: identifier,
                                proxy: null,
                                role: "server",
                                server: server_id,
                                single_socket: server.single_socket,
                                socket: socket,
                                type_primary: (websocket === true)
                                    ? "ws"
                                    : "http",
                                type_secondary: (websocket === true)
                                    ? config_http.websocket_type
                                    : `http-${config_http.method}`,
                                userAgent: config_http.user_agent
                            });
                        },
                        data_http =     function transmit_connection_extend_hash_dataHTTP():void {
                            if (socket.timeout > 0) {
                                socket.setTimeout(config_http.timeout);
                                socket.on("timeout", function transmit_connection_extend_hash_dataHTTP_timeout():void {
                                    socket.destroy();
                                });
                            }
                            if (server.single_socket === true) {
                                const terminate = function transmit_connection_extend_hash_dataHTTP_terminate(this:websocket_client):void {
                                        this.destroy();
                                        server_halt({
                                            action: "destroy",
                                            server: vars.data.server[this.server_hash].config
                                        }, null);
                                    };
                                socket.on("close", terminate);
                                socket.on("end", terminate);
                                socket.on("error", terminate);
                            }
                            socket.on("data", function transmit_connection_extend_hash_dataHTTP_data(this:websocket_client, data_http:Buffer):void {
                                const socket:websocket_client = this,
                                    config:config_http = (data_http.includes("\r\n\r\n") === true)
                                        ? http_parse(socket.server_hash, socket.addresses.local.port, data_http)
                                        : null;
                                if (config !== null) {
                                    http(config, socket);
                                }
                            });
                            http(config_http, socket);
                        },
                        data_ws =       function transmit_connection_extend_hash_dataWS():void {
                            const headers:string[] = [
                                    "HTTP/1.1 101 Switching Protocols",
                                    "Upgrade: websocket",
                                    "Connection: Upgrade",
                                    `Sec-WebSocket-Accept: ${output.hash}`,
                                    "Access-Control-Allow-Origin: *",
                                    `Server: prettydiff/${vars.environment.name}`
                                ];
                            if (config_http.websocket_nonce !== null) {
                                headers.push(config_http.websocket_nonce);
                            }
                            headers.push("");
                            headers.push("");
                            socket.write(headers.join("\r\n"));
                            if (server.single_socket === true || server.temporary === true) {
                                const security:"open"|"secure" = (socket.secure === true)
                                    ? "secure"
                                    : "open";
                                vars.data_store.server[server_id].server_object[security].removeAllListeners();
                            }
                            if (localFlag === true) {
                                if (config_http.websocket_type === "dashboard-terminal" && config_http.query.includes("shell") === true) {
                                    const params:string[] = config_http.query.split("&"),
                                        cols:number = (params[1] === undefined)
                                            ? null
                                            : Number(params[1].split("=")[1]),
                                        rows:number = (params[2] === undefined)
                                            ? null
                                            : Number(params[2].split("=")[1]),
                                        term:config_terminal = {
                                            cols: (Number.isNaN(cols) === true)
                                                ? 199
                                                : cols,
                                            rows: (Number.isNaN(rows) === true)
                                                ? 50
                                                : rows,
                                            shell: decodeURIComponent(params[0].split("=")[1])
                                        };
                                    terminal.shell(socket as websocket_pty, term);
                                } else if (config_http.websocket_type === "dashboard") {
                                    const payload:services_dashboard_open = {
                                        compose: (vars.environment.features["compose-containers"] === true)
                                            ? {
                                                containers: vars.data.containers,
                                                status: vars.environment.compose_status,
                                                time: vars.data_meta.compose_time,
                                                variables: vars.data.compose_variables
                                            }
                                            : null,
                                        demo: (vars.options.mode === "demo"),
                                        hashes: (vars.environment.features["hash"] === true)
                                            ? vars.environment.hashes
                                            : null,
                                        id: vars.id,
                                        logs: (vars.environment.features["application-logs"] === true)
                                            ? {
                                                entries: (vars.environment.logs.total > vars.environment.logs.max)
                                                    ? vars.data.logs.slice(vars.environment.logs.total - vars.environment.logs.max)
                                                    : vars.data.logs,
                                                max: vars.environment.logs.max,
                                                total: vars.environment.logs.total
                                            }
                                            : null,
                                        name: vars.environment.name,
                                        notes: vars.data.notes,
                                        os: vars.os,
                                        path: vars.path,
                                        "ports-application": {
                                            data: vars.data.ports_application,
                                            time: vars.data_meta.ports_application
                                        },
                                        repository: vars.environment.repository,
                                        request_http: (vars.environment.features["test-http"] === true)
                                            ? vars.environment.request_http
                                            : null,
                                        request_ws: (vars.environment.features["test-websocket"] === true)
                                            ? vars.environment.request_ws
                                            : null,
                                        runtime: vars.environment.runtime,
                                        server: (vars.environment.features["servers-web"] === true)
                                            ? vars.data.server
                                            : null,
                                        services_app: (vars.environment.features["services-app"] === true)
                                            ? vars.environment.services_app
                                            : null,
                                        sockets: (vars.environment.features["sockets-application-tcp"] === true || vars.environment.features["sockets-application-udp"] === true)
                                            ? {
                                                tcp: vars.data.sockets_tcp,
                                                time: vars.data_meta.sockets,
                                                udp: vars.data.sockets_udp
                                            }
                                            : null,
                                        start_date: vars.environment.start_date,
                                        stats: (vars.environment.features["statistics-resources"] === true)
                                            ? {
                                                containers: vars.stats.containers,
                                                duration: vars.stats.duration,
                                                frequency: vars.stats.frequency,
                                                now: vars.stats.now,
                                                records: vars.stats.records
                                            }
                                            : null,
                                        terminal: (vars.environment.features["terminal"] === true)
                                            ? vars.environment.terminal
                                            : null,
                                        timeZone_offset: vars.environment.timeZone_offset,
                                        version: vars.environment.version
                                    };
                                    send({
                                        data: payload,
                                        service: "services_dashboard_open"
                                    }, socket, 3);
                                }
                            }
                        },
                        proxy_eval =    function transmit_connection_extend_hash_proxyEval(config:config_proxy_test):[boolean, boolean] {
                            const port_open:number = vars.data.server[server.id].ports.open,
                                port_secure:number = vars.data.server[server.id].ports.secure,
                                domain_test:boolean = (typeof config.domain === "string" && config.domain !== "" && config.domain !== config_http.domain),
                                encryption_test:boolean = (socket.encrypted === true && config.encryption === false) || (socket.encrypted !== true && config.encryption === true),
                                port_test:boolean = (config.port > 0 && (
                                    (config.port !== port_open && config.port !== port_secure) ||
                                    (config.port === port_open && socket.encrypted === true) ||
                                    (config.port === port_secure && socket.encrypted !== true))
                                ),
                                resource_test:boolean = (typeof config.resource === "string" && config.resource !== "" && websocket === false);
                            if (domain_test === true || port_test === true || encryption_test === true) {
                                return [true, resource_test];
                            }
                            return [false, resource_test];
                        },
                        proxy_legacy =  function transmit_connection_extend_hash_proxyLegacy(logger:boolean):boolean {
                            let domain:string = "",
                                encryption:boolean = null,
                                port:number = 0,
                                resource:string = "",
                                proxy_test:[boolean, boolean] = null;
                            if (server.redirect_asset !== null && server.redirect_asset !== undefined) {
                                const keys:string[] = Object.keys(server.redirect_asset),
                                    len:number = keys.length;
                                let index_domains:number = 0,
                                    index_res:number = 0,
                                    index_wild:number = 0,
                                    longest:number = 0,
                                    asset_keys:string[] = null;
                                if (len > 0) {
                                    do {
                                        if (keys[index_domains] === config_http.domain) {
                                            asset_keys = Object.keys(server.redirect_asset[config_http.domain]);
                                            index_res = asset_keys.length;
                                            longest = 0;
                                            do {
                                                index_res = index_res - 1;
                                                // non-wildcard keys must match exactly and are dominate
                                                if (asset_keys[index_res].replace(/(\/|\\)$/, "") === config_http.resource.replace(/(\/|\\)$/, "")) {
                                                    resource = server.redirect_asset[config_http.domain][asset_keys[index_res]];
                                                    longest = -1;
                                                    break;
                                                }
                                                // find the most specific wildcard match by key length
                                                if (config_http.resource.indexOf(asset_keys[index_res].replace(/\/\*$/, "")) === 0 && asset_keys[index_res].length > longest) {
                                                    longest = asset_keys[index_res].length;
                                                    index_wild = index_res;
                                                }
                                            } while (index_res > 0);
                                            if (longest > 0) {
                                                resource = server.redirect_asset[config_http.domain][asset_keys[index_wild]].replace(/(\\|\/)$/, "").replace(/(\\|\/)/g, vars.path.sep) + vars.path.sep + config_http.resource.replace(asset_keys[index_wild].replace(/\/\*$/, ""), "").replace(/^\//, "");
                                            }
                                            break;
                                        }
                                        index_domains = index_domains + 1;
                                    } while (index_domains < len);
                                }
                            }
                            // legacy domain redirection
                            if (server.redirect_domain !== null && server.redirect_domain !== undefined) {
                                let test:boolean = false;
                                const select_rule = function transmit_connection_extend_hash_redirectDomain(rule_name:string):void {
                                    const rule:[string, number, "default" | "open" | "secure"] = server.redirect_domain[rule_name];
                                    if (test === false && rule !== null && rule !== undefined) {
                                        test = true;
                                        domain = rule[0];
                                        port = rule[1];
                                        if ((/\.secure$/).test(rule_name) === true) {
                                            encryption = true;
                                        } else if (rule[2] === "default") {
                                            encryption = (config_http.encryption === "secure");
                                        } else if (rule[2] === "secure") {
                                            encryption = true;
                                        } else {
                                            encryption = false;
                                        }
                                    }
                                };
                                select_rule(config_http.origin);
                                select_rule(config_http.domain);
                                select_rule(`${config_http.domain}.secure`);
                            }
                            proxy_test = proxy_eval({
                                domain: domain,
                                encryption: encryption,
                                port: port,
                                resource: resource
                            });
                            // legacy asset redirection
                            if (logger === true) {
                                // For testing legacy redirection criteria:
                                if (proxy_test[0] === true) {
                                    log.shell([`proxy legacy: ${vars.text.angry}proxy rule applied${vars.text.none}`, domain+" "+port+" "+resource+" "+config_http.domain+" "+config_http.resource]);
                                } else if (proxy_test[1] === true) {
                                    log.shell([`proxy legacy: ${vars.text.angry}resource redirect rule applied${vars.text.none}`, domain+" "+port+" "+resource+" "+config_http.domain+" "+config_http.resource]);
                                }
                            }
                            if (proxy_test[0] === true) {
                                // proxy to a different server due to legacy redirect_domain rules
                                create_proxy({
                                    config_http: config_http,
                                    data: config_http.body,
                                    domain: domain,
                                    encrypted: encryption,
                                    identifier: identifier,
                                    method: null,
                                    port: port,
                                    resource: resource,
                                    server_hash: server_id,
                                    socket: socket
                                });
                                return true;
                            }
                            if (proxy_test[1] === true) {
                                // resolve a resource from the local file system due to legacy redirect_asset rules
                                config_http.resource = resource.replace(/(\\|\/)g/, vars.path.sep);
                                data_event();
                                return true;
                            }
                            return false;
                        },
                        proxy_modern =  function transmit_connection_extend_hash_proxyModern(logger:boolean):boolean {
                            const matches:[number, number, string, boolean][] = [],
                                resource_match = function transmit_connection_extend_hash_proxyModern_resourceMatch(resource_input:string, index:number):void {
                                    resource_input = (typeof resource_input === "string")
                                        ? resource_input.trim()
                                        : "";
                                    const wildcard:boolean = (/\/\*$/).test(resource_input) === true;
                                    if (config_http.resource.replace(/(\/|\\)$/, "") === resource_input.replace(/(\/|\\)$/, "")) {
                                        count = count + 1;
                                        matches.push([index, count, resource_input, false]);
                                    } else if (wildcard === true && config_http.resource.indexOf(resource_input.replace(/\/\*$/, "")) === 0) {
                                        count = count + 1;
                                        matches.push([index, count, resource_input, true]);
                                    } else if (count > 0 && (resource_input === null || resource_input === undefined || resource_input === "")) {
                                        matches.push([index, count, "", false]);
                                    }
                                },
                                len:number = (server.proxy === null || server.proxy === undefined)
                                    ? 0
                                    : server.proxy.length;
                            let domain:string = "",
                                encryption:boolean = null,
                                method:type_http_method | "",
                                port:number = 0,
                                resource:string = "",
                                proxy_test:[boolean, boolean] = null,
                                index:number = 0,
                                count:number = 0,
                                not_matched:boolean = false;
                            // grade matching rule sets to determine the best rule set to apply
                            if (len === 0) {
                                return false;
                            }
                            do {
                                count = 0;
                                not_matched = false;
                                if (server.proxy[index].incoming.port === config_http.port) {
                                    count = count + 1;
                                } else if (typeof server.proxy[index].incoming.port === "number" && server.proxy[index].incoming.port > 0) {
                                    not_matched = true;
                                }
                                if (server.proxy[index].incoming.domain === config_http.domain) {
                                    count = count + 1;
                                } else if (typeof server.proxy[index].incoming.domain === "string" && server.proxy[index].incoming.domain !== "") {
                                    not_matched = true;
                                }
                                if (typeof server.proxy[index].incoming.method === "string") {
                                    if (server.proxy[index].incoming.method.toLowerCase() === config_http.method) {
                                        count = count + 1;
                                    } else {
                                        not_matched = true;
                                    }
                                }
                                if (server.proxy[index].incoming.encryption === "both" || (server.proxy[index].incoming.encryption === config_http.encryption)) {
                                    count = count + 1;
                                } else if (typeof server.proxy[index].incoming.encryption === "string") {
                                    not_matched = true;
                                }
                                if (not_matched === false) {
                                    resource_match(server.proxy[index].incoming.resource, index);
                                }
                                index = index + 1;
                            } while (index < len);
                            if (matches.length === 0) {
                                return false;
                            }
                            // use sorting to filter the best rule
                            // 1. sort first by most matching rules
                            // 2. preference exact resource matches over wildcard matches
                            const ordered:number = matches.sort(function transmit_connection_extend_hash_proxyModern_sort(a:[number, number, string, boolean], b:[number, number, string, boolean]):-1|0|1 {
                                    // greatest matches
                                    if (a[1] > b[1]) {
                                        return -1;
                                    }
                                    // preference the rule without a wildcard resource match if both rule sets have the a resource rule
                                    if (a[1] === b[1]) {
                                        if (a[2] !== "" && b[2] !== "") {
                                            if ((/\/\*$/).test(a[2]) === false && (/\/\*$/).test(b[2]) === true) {
                                                return -1;
                                            }
                                            if ((/\/\*$/).test(a[2]) === true && (/\/\*$/).test(b[2]) === true && a[2].length > b[2].length) {
                                                return -1;
                                            }
                                            return 1;
                                        }
                                        return 0;
                                    }
                                    return 1;
                                })[0][0];
                            if (matches[0][1] > 0) {
                                const outgoing:supplemental_server_proxy_identity = server.proxy[ordered].outgoing;
                                domain = (typeof outgoing.domain === "string" && outgoing.domain !== "")
                                    ? outgoing.domain.replace(/(\/|\\)$/, "")
                                    : "";
                                encryption = (outgoing.encryption === "secure")
                                    ? true
                                    : (outgoing.encryption === "open")
                                        ? false
                                        : (socket.encrypted === true);
                                method = (typeof outgoing.method === "string" && outgoing.method !== "" as type_http_method)
                                    ? outgoing.method
                                    : "";
                                port = (typeof outgoing.port === "number" && outgoing.port > 0 && outgoing.port < 65536)
                                    ? outgoing.port
                                    : 0;
                                resource = matches[0][2];
                            }
                            proxy_test = proxy_eval({
                                domain: domain,
                                encryption: encryption,
                                port: port,
                                resource: resource
                            });
                            if (logger === true) {
                                // For testing universal redirection criteria:
                                if (proxy_test[0] === true) {
                                    log.shell([`proxy modern: ${vars.text.angry}proxy rule applied${vars.text.none}`, domain+" "+port+" "+resource+" "+config_http.domain+" "+config_http.resource]);
                                } else if (proxy_test[1] === true) {
                                    log.shell([`proxy modern: ${vars.text.angry}resource redirect rule applied${vars.text.none}`, domain+" "+port+" "+resource+" "+config_http.domain+" "+config_http.resource]);
                                }
                            }
                            if (proxy_test[0] === true) {
                                // proxy to a different server
                                socket.http_resource_rule = resource;
                                create_proxy({
                                    config_http: config_http,
                                    data: config_http.body,
                                    domain: domain,
                                    encrypted: encryption,
                                    identifier: identifier,
                                    method: method,
                                    port: port,
                                    resource: config_http.resource,
                                    server_hash: server_id,
                                    socket: socket
                                });
                                return true;
                            }
                            if (proxy_test[1] === true) {
                                // resolve a resource from the local file system due to most well matched proxy rule
                                resource = (typeof resource === "string" && resource !== "")
                                    ? (matches[0][3] === true)
                                        ? resource.replace(/(\\|\/)$/, "").replace(/(\\|\/)/g, vars.path.sep) + vars.path.sep + config_http.resource.replace(matches[0][2].replace(/\/\*$/, ""), "").replace(/^\//, "")
                                        : resource.replace(/(\\|\/)g/, vars.path.sep)
                                    : "";
                                config_http.resource = resource;
                                data_event();
                                return true;
                            }
                            return false;
                        },
                        redirect_tls =  function transmit_connection_extend_hash_redirectTLS():boolean {
                            if (data[0] === 22 && address.local.port === server.ports.open && vars.data.server[server_id].ports.secure > 0) {
                                config_http.domain = `open_socket_tunnel-${vars.data.server[server_id].config.name}`;
                                create_proxy({
                                    config_http: config_http,
                                    data: data,
                                    domain: address.local.address,
                                    encrypted: false,
                                    identifier: identifier,
                                    method: "",
                                    port: vars.data.server[server_id].ports.secure,
                                    resource: "",
                                    server_hash: server_id,
                                    socket: socket
                                });
                                return true;
                            }
                            return false;
                        };
                    socket.addresses = address;
                    socket.timeout = config_http.timeout;
                    socket.type_primary = (websocket === true)
                        ? "ws"
                        : "http";
                    // * socket_extension must be called on every socket exactly once, called in
                    //   - create_proxy - redirect_tls, proxy_legacy, proxy_modern
                    //   - data_event

                    // 1. proxy - secure socket on open server to TLS server peer
                    if (redirect_tls() === true) {
                        return;
                    }

                    // 2. destroy - blocked socket, no socket_extension
                    if (blocked() === true) {
                        return;
                    }

                    // 3. http 308 - socket upgrade via redirect response to client
                    if (config_http.http_upgrade === true) {
                        // * server option 'upgrade' must be true
                        // * must be http request with header 'upgrade-insecure-requests: 1'
                        // * requests from the dashboard http test tool are ignored
                        socket_extension({
                            callback: function transmit_connection_extend_hash_httpUpgrade():void {
                                http_redirect(config_http, "https", socket);
                            },
                            handler: handler_ws,
                            identifier: identifier,
                            proxy: null,
                            role: "server",
                            server: server_id,
                            single_socket: server.single_socket,
                            socket: socket,
                            type_primary: (websocket === true)
                                ? "ws"
                                : "http",
                            type_secondary: (websocket === true)
                                ? config_http.websocket_type
                                : `http-${config_http.method}`,
                            userAgent: config_http.user_agent
                        });
                        return;
                    }

                    // 4. proxy/data_event - applicable legacy proxy conventions
                    if (proxy_legacy(false) === true) {
                        return;
                    }

                    // 5. proxy/data_event - applicable legacy proxy conventions
                    if (proxy_modern(false) === true) {
                        return;
                    }

                    // 6. data_event - remaining sockets
                    data_event();
                },
                digest: "base64",
                hash_input_type: "direct",
                section: "servers-web",
                source: (config_http.websocket_key === "")
                    ? config_http.domain + address.local.port + Math.random()
                    : config_http.websocket_key
            });
        };
    // unhandled errors on sockets are fatal and will crash the application
    // errors on sockets resulting from stream collisions internal to node must be trapped immediately
    // trapping the error event on a socket any later will still result in a fatal application crash, as of Node 23.1.0, if the error is the result of an internal Node stream collision
    TLS_socket.on("error", function transmit_connection_error(error:node_error):void{
        log.application({
            error: error,
            message: "Socket connection error.",
            origin: server.id,
            section: "servers-web",
            status: "error",
            time: Date.now()
        });
    });
    TLS_socket.once("data", extend);
};

export default connection;


/**
 * 
 * 1. /assets will be the only path source
 *    a. external resources will require a user symlink
 * 2. every new http GET socket will store a path to its first resource
 *    a. all further requests on that socket will be relative to that page's path if resource not beginning with "/"
 *    b. all further requests on that socket will be relative to "/assets" if beginning with "/"
 * 
 * testing
 * 1. must include tests for subdomains
 * 2. must include tests for a page with relative assets in a child directory with page address ending in slash
 * 3. must include tests for a page with relative assets in a child directory with page address not ending in slash
 */