
import get_address from "../core/get_address.ts";
import file from "../utilities/file.ts";
import hash from "../core/hash.ts";
import http from "../http/index.ts";
import http_write from "../http/http_write.ts";
import log from "../core/log.ts";
import node from "../core/node.ts";
import message_handler from "./messageHandler.ts";
import message_inspection from "../services/message_inspection.ts";
import proxy_create from "./proxy_create.ts";
import send from "./send.ts";
import server_halt from "../server/server_halt.ts";
import socket_extension from "./socketExtension.ts";
import terminal from "../services/terminal.ts";
import vars from "../core/vars.ts";

//cspell: words prettydiff

const connection = function transmit_connection(this:core_server_instance, TLS_socket:node_tls_TLSSocket):void {
    const server_id:string = this.id,
        server:supplemental_server_config = vars.data.server[server_id].config,
        handshake = function transmit_connection_handshake(this:websocket_client, data:Buffer):void {
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

            const // eslint-disable-next-line @typescript-eslint/no-this-alias
                socket:websocket_client = this,
                config_http:config_http = (function transmit_connection_handshake_headerList():config_http {
                    const dataString:string = data.toString("utf-8"),
                        headerIndex:number = dataString.replace(/^\s+/, "").indexOf("\r\n\r\n"),
                        headerString:string = (headerIndex > 0)
                            ? dataString.replace(/^\s+/, "").slice(0, headerIndex)
                            : dataString.replace(/^\s+/, ""),
                        list:string[] = headerString.split("\r\n"),
                        list0:string[] = list[0].split(" "),
                        query:number = list0[1].indexOf("?"),
                        fragment:number = list0[1].indexOf("#"),
                        config:config_http = {
                            accept: "",
                            body: null,
                            domain: "",
                            encryption: (socket.encrypted === true)
                                ? "secure"
                                : "open",
                            fragment: "",
                            headers: list,
                            host_index: 0,
                            http_test: false,
                            http_upgrade: false,
                            method: list[0].slice(0, list[0].indexOf(" ")).toLowerCase() as type_http_method,
                            origin: "",
                            port: 0,
                            proxy_type: "none",
                            query: "",
                            range: "",
                            referrer: "",
                            resource: list[0].slice(list[0].replace(/ +/, " ").indexOf(" ") + 1).replace(/\s+HTTP\/\d(\.\d)?/, ""),
                            resource_absolute: "",
                            resource_size: 0,
                            resource_type: "other",
                            user_agent: "",
                            websocket_key: "",
                            websocket_nonce: "",
                            websocket_type: ""
                        },
                        get_domain = function transmit_connection_handshake_headerList_getDomain(header:string):void {
                            const sIndex:number = header.indexOf("]"),
                                index:number = header.indexOf(":"),
                                host:string = (index > 0)
                                    ? header.slice(0, index)
                                    : header;
                            if (header.indexOf("[") === 0 && sIndex > 0) {
                                config.domain = header.slice(1, sIndex);
                            } else if ((/:\d+$/).test(header) === true) {
                                config.domain = host;
                            } else {
                                config.domain = host;
                            }
                            config.origin = header.replace(/:80$/, "").replace(/:443$/, ".secure");
                        },
                        pair = function transmit_connection_handshake_headerList_pair(input:string):[string, string] {
                            return [input.slice(0, input.indexOf(":")).trim().toLowerCase(), input.slice(input.indexOf(":") + 1).trim()];
                        };
                    list.forEach(function transmit_connection_handshake_headerList_each(header:string, index:number):void {
                        const values:[string, string] = pair(header);
                        if (values[0] === "sec-websocket-key") {
                            config.websocket_key = values[1] + "258EAFA5-E914-47DA-95CA-C5AB0DC85B11";
                        } else if (values[0] === "accept") {
                            config.accept = values[1];
                        } else if (values[0] === "host") {
                            get_domain(values[1]);
                            config.host_index = index;
                        } else if (values[0] === "range") {
                            config.range = values[1];
                        } else if (values[0] === "referer:") {
                            config.referrer = values[1];
                        } else if (values[0] === "sec-websocket-protocol") {
                            config.websocket_nonce = header;
                            config.websocket_type = values[1];
                        } else if (values[0] === "user-agent") {
                            let ua:string[] = [];
                            ua[0] = values[1].slice(values[1].indexOf("(") + 1, values[1].indexOf(")"));
                            ua = ua[0].split(";");
                            config.user_agent = `${ua[0]}, ${ua[1]}, ${config.user_agent.slice(config.user_agent.lastIndexOf(")") + 2)}`;
                        } else if (values[0] === "upgrade-insecure-requests" && socket.encrypted !== true && server.upgrade === true && vars.data.server[server_id].ports.secure > 0) {
                            config.http_upgrade = true;
                        } else if (values[0] === "services_http_test") {
                            config.http_test = true;
                        }
                    });
                    if (fragment > 0) {
                        config.fragment = config.resource.slice(fragment + 1);
                        config.resource = config.resource.slice(0, fragment);
                    }
                    if (query > 0) {
                        config.query = config.resource.slice(query + 1);
                        config.resource = config.resource.slice(0, query);
                    }
                    config.resource = (config.resource === "/")
                        ? "/"
                        : config.resource.replace(/\/$/, "");
                    if (config.method === "get" && server_id === vars.id.dashboard_server && config.resource === "/") {
                        if (config.websocket_key === "") {
                            vars.environment.request_http = headerString;
                        } else {
                            vars.environment.request_ws = headerString;
                        }
                    }
                    if (headerIndex > 1) {
                        config.body = data.subarray(Buffer.byteLength(headerString) + 4);
                    }
                    if (server.id === vars.id.dashboard_server) {
                        vars.environment.dashboard_page.replace("request: \"\"", `request: \`${headerString}\``);
                    }
                    if (config.http_upgrade === true && config.http_test === true) {
                        config.http_upgrade = false;
                    }
                    socket.addresses = get_address(socket);
                    config.port = socket.addresses.local.port;
                    message_inspection.send({
                        count: 0,
                        direction: "in",
                        maximum_size: 0,
                        message: dataString,
                        service: socket.server_hash,
                        throttle_size: 0,
                        throttle_time: 0,
                        type: "web-server"
                    });
                    return config;
                }()),
                domain_local:string[] = server.domain_local.concat(vars.environment.interfaces),
                upgrade_tls = function transmit_connection_handshake_upgradeTLS():void {
                    // * server option 'upgrade' must be true
                    // * must be http request with header 'upgrade-insecure-requests: 1'
                    // * requests from the dashboard http test tool are ignored
                    const domain:string = (node.net.isIPv6(config_http.domain) === true)
                        ? `[${config_http.domain}]`
                        : config_http.domain;
                    http_write(socket, [
                        "HTTP/1.1 308",
                        `location: https://${domain}:${vars.data.server[server_id].ports.secure + config_http.resource}`,
                        "content-length: 5",
                        "",
                        "moved",
                        "",
                        ""
                    ].join("\r\n"), true);
                },
                local_service = function transmit_connection_handshake_localService():void {
                    if (socket.destroyed === true) {
                        return;
                    }
                    // http
                    if (config_http.websocket_key === "") {
                        const http_action = function transmit_connection_handshake_localService_httpAction():void {
                                const keys:string[] = (server.method === null || server.method === undefined)
                                    ? []
                                    : Object.keys(server.method);
                                let index:number = keys.length;
                                if (index > 0) {
                                    do {
                                        index = index - 1;
                                        if (keys[index].toLowerCase() === config_http.method) {
                                            proxy_create({
                                                data: data,
                                                encrypted: socket.encrypted,
                                                host: server.method[config_http.method as "delete"].address,
                                                identifier: config_http.origin,
                                                port: server.method[config_http.method as "delete"].port,
                                                server_hash: server_id,
                                                socket: socket,
                                                user_agent: config_http.user_agent
                                            });
                                            return;
                                        }
                                    } while (index > 0);
                                }
                                if (http[config_http.method] === undefined) {
                                    // unsupported HTTP methods result in socket destruction
                                    socket.destroy();
                                } else {
                                    http[config_http.method](config_http, socket);
                                    if (server.single_socket === true) {
                                        const terminate = function transmit_connection_handshake_localService_httpAction_terminate(this:websocket_client):void {
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
                                }
                            };
                        socket_extension({
                            callback: http_action,
                            handler: message_handler.default,
                            identifier: `http-${config_http.resource}-${Math.random()}`,
                            proxy: null,
                            role: "server",
                            server: server_id,
                            single_socket: server.single_socket,
                            socket: socket,
                            temporary: server.temporary,
                            timeout: null,
                            type: `http-${config_http.method}`,
                            userAgent: config_http.user_agent
                        });
                    // websocket
                    } else {
                        // local domain websocket support
                        const callback = function transmit_connection_handshake_hash(hashOutput:core_hash_output):void {
                            const client_respond = function transmit_connection_handshake_hash_clientRespond():void {
                                    const headers:string[] = [
                                            "HTTP/1.1 101 Switching Protocols",
                                            "Upgrade: websocket",
                                            "Connection: Upgrade",
                                            `Sec-WebSocket-Accept: ${hashOutput.hash}`,
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
                                localFlag:boolean = (server_id === vars.id.dashboard_server),
                                identifier:string = (function transmit_connection_handshake_hash_identifier():string {
                                    if (localFlag === true && config_http.websocket_type === "dashboard-terminal") {
                                        return `dashboard-terminal-${hashOutput.hash}`;
                                    }
                                    if (config_http.websocket_type === "test-websocket") {
                                        return `websocketTest-browserSocket-${hashOutput.hash}`;
                                    }
                                    return `browserSocket-${hashOutput.hash}`;
                                }()),
                                handler:websocket_message_handler = (function transmit_connection_handshake_hash_handler():websocket_message_handler {
                                    if (config_http.websocket_type === "test-websocket") {
                                        return message_handler.test_websocket;
                                    }
                                    if (config_http.websocket_type === "test-performance-socket") {
                                        return message_handler.test_performance;
                                    }
                                    return message_handler.default;
                                }()),
                                config:config_websocket_extensions = {
                                    callback: client_respond,
                                    handler: handler,
                                    identifier: identifier,
                                    proxy: null,
                                    role: "server",
                                    server: server_id,
                                    single_socket: server.single_socket,
                                    socket: socket,
                                    temporary: server.temporary,
                                    timeout: null,
                                    type: config_http.websocket_type,
                                    userAgent: config_http.user_agent
                                };
                            socket_extension(config);
                        };
                        hash({
                            algorithm: "sha1",
                            callback: callback,
                            digest: "base64",
                            hash_input_type: "direct",
                            section: "servers-web",
                            source: config_http.websocket_key
                        });
                    }
                },
                blocked:boolean = (function transmit_connection_handshake_blocked():boolean {
                    let index:number = (server.block_list === null || server.block_list === undefined)
                        ? 0
                        : server.block_list.referrer.length;
                    if (config_http.headers.length < 3) {
                        return true;
                    }
                    if (domain_local.includes(config_http.origin) === false && socket.proxy === null) {
                        return true;
                    }
                    if (server.block_list !== null && server.block_list !== undefined) {
                        if (server.block_list.host.includes(config_http.origin) === true) {
                            return true;
                        }
                        if (server.block_list.ip.includes(socket.addresses.remote.address) === true) {
                            return true;
                        }
                    }
                    if (index > 0) {
                        do {
                            index = index - 1;
                            if (config_http.referrer.indexOf(server.block_list.referrer[index].toLowerCase()) === 0 || config_http.referrer.replace(/\w+:\/\//, "").indexOf(server.block_list.referrer[index].toLowerCase()) === 0) {
                                return true;
                            }
                        } while (index > 0);
                    }
                    return false;
                }()),
                redirect_tls:boolean = (data[0] === 22 && socket.addresses.local.port === server.ports.open && vars.data.server[server_id].ports.secure > 0);
            if (blocked === true) {
                socket.destroy();
            } else if (redirect_tls === true) {
                config_http.domain = `open_socket_tunnel-${vars.data.server[server_id].config.name}`;
                proxy_create({
                    data: data,
                    encrypted: false,
                    host: socket.addresses.local.address,
                    identifier: config_http.origin,
                    port: vars.data.server[server_id].ports.secure,
                    server_hash: server_id,
                    socket: socket,
                    user_agent: config_http.user_agent
                });
            } else if (config_http.http_upgrade === true) {
                upgrade_tls();
            } else {
                let domain:string = "",
                    encryption:boolean = null,
                    port:number = 0,
                    resource:string = "";
                const resource_stat = function transmit_connection_handshake_resourceStat(incoming:string, callback:() => void):void {
                    if (typeof incoming === "string" && incoming !== "") {
                        // scenario 1 - resource path change
                        if (domain === "" && port === 0 && resource !== "") {
                            const resource_absolute:string = resource.replace(/(\/|\\)$/, ""),
                                resource_relative:string = `${vars.path.project}servers${vars.path.sep + server.id + vars.path.sep}assets${vars.path.sep + resource_absolute.replace(/^(\\|\/)/, "")}`,
                                stat_callback = function transmit_connection_handshake_resourceStat_statCallback(stats:node_fs_BigIntStats, location:string):void {
                                    if (stats !== null) {
                                        config_http.resource_absolute = location;
                                        if (stats.isFile() === true) {
                                            config_http.resource_size = Number(stats.size);
                                            config_http.resource_type = "file";
                                        } else if (stats.isDirectory() === true) {
                                            config_http.resource_type = "directory";
                                        }
                                        callback();
                                    }

                                };
                            // 1. specific, fs absolute          - outgoing
                            // 2. specific, relative to web root - project_path/servers/server/assets/outgoing
                            // 3. wildcard, fs absolute          - (outgoing + config.resource without match)
                            // 4. wildcard, relative to web root - project_path/servers/server/assets/(outgoing + config.resource without match)
                            file.stat({
                                // fs absolute
                                callback: stat_callback,
                                location: resource_relative,
                                no_file: function () {
                                    // fs relative to web root
                                    file.stat({
                                        callback: stat_callback,
                                        location: resource_absolute,
                                        no_file: null,
                                        section: "servers-web"
                                    });
                                },
                                section: "servers-web"
                            });
                        }
                    }
                };
                // legacy asset redirection
                if (server.redirect_asset !== null && server.redirect_asset !== undefined) {
                    const keys:string[] = Object.keys(server.redirect_asset),
                        len:number = keys.length;
                    let index_domains:number = 0,
                        index_res:number = 0,
                        index_wild:number = 0,
                        longest:number = 0,
                        domain_keys:string[] = null;
                    if (len > 0) {
                        do {
                            if (keys[index_domains] === config_http.domain) {
                                domain_keys = Object.keys(server.redirect_asset[config_http.domain]);
                                index_res = domain_keys.length;
                                longest = 0;
                                do {
                                    index_res = index_res - 1;
                                    // non-wildcard keys must match exactly and are dominate
                                    if (domain_keys[index_res].replace(/(\/|\\)$/, "") === config_http.resource.replace(/(\/|\\)$/, "")) {
                                        resource = server.redirect_asset[config_http.domain][domain_keys[index_res]];
                                        longest = -1;
                                        break;
                                    }
                                    // find the most specific wildcard match by key length
                                    if (config_http.resource.indexOf(domain_keys[index_res].replace(/\/\*$/, "")) === 0 && domain_keys[index_res].length > longest) {
                                        longest = domain_keys[index_res].length;
                                        index_wild = index_res;
                                    }
                                } while (index_res > 0);
                                if (longest > 0) {
                                    resource = server.redirect_asset[config_http.domain][domain_keys[index_wild]].replace(/(\\|\/)$/, "").replace(/(\\|\/)/g, vars.path.sep) + vars.path.sep + config_http.resource.replace(domain_keys[index_wild].replace(/\/\*$/, ""), "").replace(/^\//, "").replace(/(\\|\/)/g, vars.path.sep);
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
                    const select_rule = function transmit_connection_handshake_redirectDomain(rule:string,):void {
                        if (test === false && server.redirect_domain[rule] !== null && server.redirect_domain[rule] !== undefined) {
                            test = true;
                            domain = server.redirect_domain[rule][0];
                            port = server.redirect_domain[rule][1];
                            if ((/\.secure$/).test(rule) === true) {
                                encryption = true;
                            } else if (server.redirect_domain[rule][2] === "default") {
                                encryption = (config_http.encryption === "secure");
                            } else if (server.redirect_domain[rule][2] === "secure") {
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
                if (domain === "" && port === 0 && resource !== "" && config_http.websocket_key === "") {
                    resource_stat(resource, local_service);
                } else if (domain !== "" || port > 0) {
                    const port_value:number = (port > 0)
                        ? port
                        : (encryption === true)
                            ? 443
                            : 80;
                    config_http.headers[config_http.host_index] = (node.net.isIPv6(config_http.domain) === true)
                        ? `Host: [${config_http.domain}]:${port_value}`
                        : `Host: ${config_http.domain}:${port_value}`;
                    proxy_create({
                        data: data,
                        encrypted: encryption,
                        host: domain,
                        identifier: "",
                        port: port_value,
                        server_hash: server_id,
                        socket: socket,
                        user_agent: config_http.user_agent
                    });
                } else {
                    // universal proxy model
                    // if (server.proxy !== null && server.proxy !== undefined) {
                    //     const matches:[number, number, string, boolean][] = [],
                    //         resource_match = function transmit_proxy_resourceMatch(resource:string, index:number):void {
                    //             resource = resource.trim();
                    //             const wildcard:boolean = (/\/\*$/).test(resource) === true;
                    //             if (config_http.resource === resource) {
                    //                 count = count + 1;
                    //                 matches.push([index, count, resource, wildcard]);
                    //             } else if (wildcard === true && config_http.resource.indexOf(resource.replace(/\/\*$/, "")) === 0) {
                    //                 count = count + 1;
                    //                 matches.push([index, count, resource, wildcard]);
                    //             } else {
                    //                 matches.push([index, count, "", false]);
                    //             }
                    //         },
                    //         len:number = server.proxy.length;
                    //     let index:number = 0,
                    //         count:number = 0;
                    //     // grade matching rule sets to determine the best rule set to apply
                    //     if (len > 0) {
                    //         do {
                    //             count = 0;
                    //             if (server.proxy[index].incoming.port === config_http.port) {
                    //                 count = count + 1;
                    //             }
                    //             if (server.proxy[index].incoming.domain === config_http.domain) {
                    //                 count = count + 1;
                    //             }
                    //             if (server.proxy[index].incoming.encryption === "both" || (server.proxy[index].incoming.encryption === config_http.encryption)) {
                    //                 count = count + 1;
                    //             }
                    //             resource_match(server.proxy[index].incoming.resource, index);
                    //             index = index + 1;
                    //         } while (index < len);
                    //     }

                    //     if (matches.length > 0) {
                    //         // use sorting to filter the best rule
                    //         // 1. sort first by most matching rules
                    //         // 2. preference exact resource matches over wildcard matches
                    //         const index:number = matches.sort(function transmit_proxy_sort(a:[number, number, string, boolean], b:[number, number, string, boolean]):-1|0|1 {
                    //                 // greatest matches
                    //                 if (a[1] > b[1]) {
                    //                     return -1;
                    //                 }
                    //                 // preference the rule without a wildcard resource match if both rule sets have the a resource rule
                    //                 if (a[1] === b[1]) {
                    //                     if (a[2] !== "" && b[2] !== "") {
                    //                         if ((/\/\*$/).test(a[2]) === false && (/\/\*$/).test(b[2]) === true) {
                    //                             return -1;
                    //                         }
                    //                         if ((/\/\*$/).test(a[2]) === true && (/\/\*$/).test(b[2]) === true && a[2].length > b[2].length) {
                    //                             return -1;
                    //                         }
                    //                         return 1;
                    //                     }
                    //                     return 0;
                    //                 }
                    //                 return 1;
                    //             })[0][0],
                    //             incoming:supplemental_server_proxy_identity = server.proxy[index].incoming,
                    //             outgoing:supplemental_server_proxy_identity = server.proxy[index].outgoing;
                    //         domain = (typeof outgoing.domain === "string" && outgoing.domain !== "")
                    //             ? outgoing.domain
                    //             : null,
                    //         port = (typeof outgoing.port === "number" && outgoing.port > 0 && outgoing.port < 65536)
                    //             ? outgoing.port
                    //             : null,
                    //         resource = (typeof outgoing.resource === "string" && outgoing.resource !== "")
                    //             ? outgoing.resource.replace(/\/|\\/g, vars.path.sep)
                    //             : null;
                    //         resource_stat(incoming.resource, matches[0][3]);
                    //     }
                    // }
                    local_service();
                }
            }
        };
    // unhandled errors on sockets are fatal and will crash the application
    // errors on sockets resulting from stream collisions internal to node must be trapped immediately
    // trapping the error event on a socket any later will still result in a fatal application crash, as of Node 23.1.0, if the error is the result of an internal Node stream collision
    TLS_socket.on("error", function transmit_connection_handshake_error(error:node_error):void{
        log.application({
            error: error,
            message: "Socket connection error.",
            origin: server.id,
            section: "servers-web",
            status: "error",
            time: Date.now()
        });
    });
    TLS_socket.once("data", handshake);
};

export default connection;