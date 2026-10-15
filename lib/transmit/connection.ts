
import get_address from "../core/get_address.ts";
import hash from "../core/hash.ts";
import http from "../http/index.ts";
import http_write from "../http/http_write.ts";
import log from "../core/log.ts";
import node from "../core/node.ts";
import message_handler from "./messageHandler.ts";
import message_inspection from "../services/message_inspection.ts";
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

            const flags:store_flag = {
                    referer: false
                },
                // eslint-disable-next-line @typescript-eslint/no-this-alias
                socket:websocket_client = this,
                config_http:config_http = (function transmit_connection_handshake_headerList():config_http {
                    const testNonce:RegExp = (/^sec-websocket-protocol:\s*/),
                        dataString:string = data.toString("utf-8"),
                        headerIndex:number = dataString.replace(/^\s+/, "").indexOf("\r\n\r\n"),
                        headerString:string = (headerIndex > 0)
                            ? dataString.replace(/^\s+/, "").slice(0, headerIndex)
                            : dataString.replace(/^\s+/, ""),
                        list:string[] = headerString.split("\r\n"),
                        query:number = list[0].indexOf("?"),
                        fragment:number = list[0].indexOf("#"),
                        config:config_http = {
                            accept: "",
                            body: null,
                            domain: "",
                            fragment: "",
                            header_count: list.length,
                            http_test: false,
                            http_upgrade: false,
                            method: "get",
                            origin: "",
                            port: 0,
                            query: "",
                            range: "",
                            referrer: "",
                            resource: "",
                            user_agent: "",
                            websocket_key: "",
                            websocket_nonce: "",
                            websocket_type: ""
                        },
                        get_domain = function transmit_connection_handshake_headerList_getDomain(header:string):void {
                            const hostName:string = header.toLowerCase().replace("host:", "").replace(/\s+/g, ""),
                                sIndex:number = hostName.indexOf("]"),
                                index:number = hostName.indexOf(":"),
                                host:string = (index > 0)
                                    ? hostName.slice(0, index)
                                    : hostName;
                            if (hostName.indexOf("[") === 0 && sIndex > 0) {
                                config.domain = hostName.slice(1, sIndex);
                                if ((/\]:\d+$/).test(hostName) === true) {
                                    config.port = Number(hostName.slice(hostName.lastIndexOf(":") + 1));
                                }
                            } else if ((/:\d+$/).test(hostName) === true) {
                                config.domain = host;
                                config.port = Number(hostName.slice(index + 1));
                            } else {
                                config.domain = host;
                            }
                            config.origin = hostName.replace(/:80$/, "").replace(/:443$/, ".secure");
                        },
                        get_referrer = function transmit_connection_handshake_headerList_getReferrer(header:string):void {
                            config_http.referrer = header.toLowerCase().replace(/referer:\s*/, "");
                            let index:number = (server.block_list === null || server.block_list === undefined)
                                ? 0
                                : server.block_list.referrer.length;
                            if (index > 0) {
                                do {
                                    index = index - 1;
                                    if (config_http.referrer.indexOf(server.block_list.referrer[index].toLowerCase()) === 0 || config_http.referrer.replace(/\w+:\/\//, "").indexOf(server.block_list.referrer[index].toLowerCase()) === 0) {
                                        flags.referer = true;
                                        return;
                                    }
                                } while (index > 0);
                            }
                        },
                        value = function transmit_connection_handshake_headerList_value(input:string):string {
                            return input.slice(input.indexOf(":") + 1).trim();
                        };
                    list.forEach(function transmit_connection_handshake_headerList_each(header:string):void {
                        const lower:string = header.toLowerCase();
                        if (lower.indexOf("sec-websocket-key") === 0) {
                            config.websocket_key = value(lower) + "258EAFA5-E914-47DA-95CA-C5AB0DC85B11";
                        } else if (lower.indexOf("accept:") === 0) {
                            config.accept = value(lower);
                        } else if (lower.indexOf("host:") === 0) {
                            get_domain(header);
                        } else if (lower.indexOf("range:") === 0) {
                            config.range = value(lower);
                        } else if (lower.indexOf("referer:") === 0) {
                            get_referrer(header);
                        } else if (testNonce.test(lower) === true) {
                            config.websocket_nonce = header;
                            config.websocket_type = lower.replace(testNonce, "");
                        } else if (lower.indexOf("user-agent:") === 0) {
                            let ua:string[] = [];
                            config.user_agent = value(lower);
                            ua[0] = config.user_agent.slice(config.user_agent.indexOf("(") + 1, config.user_agent.indexOf(")"));
                            ua = ua[0].split(";");
                            config.user_agent = `${ua[0]}, ${ua[1]}, ${config.user_agent.slice(config.user_agent.lastIndexOf(")") + 2)}`;
                        } else if ((/^upgrade-insecure-requests:\s*1$/).test(lower) === true && socket.encrypted !== true && server.upgrade === true && vars.data.server[server_id].ports.secure > 0) {
                            config.http_upgrade = true;
                        } else if ((/services_http_test:\s*true/).test(lower) === true) {
                            config.http_test = true;
                        }
                    });
                    config.method = list[0].slice(0, list[0].indexOf(" ")).toLowerCase() as type_http_method;
                    config.query = "";
                    config.resource = list[0]
                        .slice(list[0].replace(/ +/, " ").indexOf(" ") + 1)
                        .replace(/\s+HTTP\/\d(\.\d)?/, "");
                    if (fragment > 0) {
                        config.resource = config.resource.slice(0, fragment);
                        config.fragment = config.resource.slice(fragment + 1);
                    }
                    if (query > 0) {
                        config.resource = config.resource.slice(0, query);
                        config.query = config.resource.slice(query + 1);
                    }
                    config.resource = (config.resource === "/")
                        ? "/"
                        : config.resource.replace(/\/$/, "");
                    if (config.method === "get" && server_id === vars.id.dashboard_server && config.resource === "/") {
                        vars.environment.http_request = headerString;
                    }
                    if (headerIndex > 1) {
                        config.body = data.subarray(Buffer.byteLength(headerString) + 4);
                    }
                    if (server.id === vars.id.dashboard_server) {
                        vars.environment.dashboard_page.replace("request: \"\"", `request: \`${headerString}\``);
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
                single_socket:boolean = (server.single_socket === true),
                temporary:boolean = (server.temporary === true),
                domain_local:string[] = server.domain_local.concat(vars.environment.interfaces),
                // redirection = function transmit_connection_handshake_redirection():Buffer {
                //     const keys:string[] = (server.redirect_asset === null || server.redirect_asset === undefined || server.redirect_asset[config_http.origin] === undefined)
                //             ? []
                //             : Object.keys(server.redirect_asset[config_http.origin]),
                //         proxy_existing = function transmit_connection_handshake_proxyExisting(hash:string):boolean {
                //             const loop = function transmit_connection_handshake_proxyExisting_loop():boolean {
                //                 let index:number = vars.data.sockets_tcp.length;
                //                 if (index > 0) {
                //                     do {
                //                         index = index - 1;
                //                         if (vars.data.sockets_tcp[index].hash === hash) {
                //                             if (vars.data.sockets_tcp[index].proxy === null) {
                //                                 const servers:string[] = Object.keys(vars.data_store.server),
                //                                     list = function transmit_connection_handshake_proxyExisting_loop_list(id:string, list_type:"open"|"secure"):boolean {
                //                                         const sockets:websocket_client[] = vars.data_store.server[id].sockets_tcp[list_type];
                //                                         let count:number = sockets.length;
                //                                         do {
                //                                             count = count - 1;
                //                                             if (sockets[count].hash === hash) {
                //                                                 if (sockets[count].proxy === null) {
                //                                                     proxy = sockets[count];
                //                                                 }
                //                                                 return true;
                //                                             }
                //                                         } while (count > 0);
                //                                         return false;
                //                                     };
                //                                 let proxy:websocket_client = null,
                //                                     server_len:number = servers.length;
                //                                 if (server_len > 0) {
                //                                     do {
                //                                         server_len = server_len - 1;
                //                                         if (list(servers[server_len], "secure") === true) {
                //                                             break;
                //                                         }
                //                                     } while (server_len > 0);
                //                                     if (proxy === null && socket.encrypted !== true) {
                //                                         do {
                //                                             server_len = server_len - 1;
                //                                             if (list(servers[server_len], "open") === true) {
                //                                                 break;
                //                                             }
                //                                         } while (server_len > 0);
                //                                     }
                //                                 }
                //                                 if (proxy === null) {
                //                                     socket.destroy();
                //                                 } else {
                //                                     socket.pipe(proxy);
                //                                 }
                //                                 proxy.proxy = socket;
                //                                 socket_extension({
                //                                     callback: function transmit_connection_handshake_proxyExisting_loop_callback():void {
                //                                         proxy.pipe(socket);
                //                                         socket.pipe(proxy);
                //                                         proxy.write(data);
                //                                     },
                //                                     handler: null,
                //                                     identifier: `${config_http.origin}-${process.hrtime.bigint().toString()}`,
                //                                     proxy: proxy,
                //                                     role: "server",
                //                                     server: server_id,
                //                                     single_socket: false,
                //                                     socket: socket,
                //                                     temporary: false,
                //                                     timeout: null,
                //                                     type: "relay",
                //                                     userAgent: config_http.user_agent
                //                                 });
                //                             } else {
                //                                 socket.destroy();
                //                             }
                //                             return true;
                //                         }
                //                     } while (index > 0);
                //                 }
                //                 return false;
                //             };
                //             if ((/^[0-9a-f]{128}$/).test(hash) === true) {
                //                 loop();
                //                 return true;
                //             }
                //             return false;
                //         },
                //         compare = function transmit_connection_handshake_redirection_compare(path:string, wild:string):string {
                //             const destination:string = server.redirect_asset[config_http.origin][path];
                //             if (path === config_http.resource) {
                //                 // literal match
                //                 if (wild === null && path.charAt(path.length - 1) !== "*") {
                //                     if (proxy_existing(destination) === true) {
                //                         proxy_test = true;
                //                         return true;
                //                     }
                //                     headerList[0] = `${config_http.method} ${destination + headerList[0].replace(/ +$/, "").slice(headerList[0].lastIndexOf(" "))}`;
                //                 // wildcard match
                //                 } else if (wild !== null && path.charAt(path.length - 1) === "*" && path.indexOf(wild) === 0 && path.indexOf(destination) !== 0) {
                //                     if (proxy_existing(destination) === true) {
                //                         proxy_test = true;
                //                         return true;
                //                     }
                //                     headerList[0] = `${config_http.method} ${request_path.replace(wild, destination) + headerList[0].replace(/ +$/, "").slice(headerList[0].lastIndexOf(" "))}`;
                //                 }
                //                 return true;
                //             }
                //             return null;
                //         };
                //     let proxy_test:boolean = false,
                //         index:number = keys.length;

                //     if (index > 0) {
                //         let matched:boolean = false,
                //             compared:string = false;
                //         // look for exact matches first
                //         do {
                //             index = index - 1;
                //             compared = compare(keys[index], null);
                //             if (compared === null) {
                //                 return null;
                //             }
                //             if (compared !== null) {
                //                 matched = true;
                //                 break;
                //             }
                //         } while (index > 0);

                //         // look for wildcard matches second
                //         index = keys.length;
                //         if (matched === false) {
                //             do {
                //                 index = index - 1;
                //                 compared = compare(keys[index], keys[index].replace(/\*$/, ""));
                //                 if (compared === null) {
                //                     return null;
                //                 }
                //                 if (compared !== null) {
                //                     break;
                //                 }
                //             } while (index > 0);
                //         }
                //         if (proxy_test === false) {
                //             return Buffer.from(dataString.replace(headerString, headerList.join("\r\n")));
                //         }
                //     }
                //     return null;
                // },
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
                    const redirect:Buffer = redirection();
                    if (socket.destroyed === true) {
                        return;
                    }
                    data = (redirect === null)
                        ? data
                        : redirect;
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
                                            proxy_create(server.method[config_http.method as "delete"].address, server.method[config_http.method as "delete"].port, socket.encrypted);
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
                            single_socket: single_socket,
                            socket: socket,
                            temporary: temporary,
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
                                    if (single_socket === true || temporary === true) {
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
                                                    shell: params[0].split("=")[1].replace(/%20/g, " ")
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
                                                http_request: (vars.environment.features["test-http"] === true)
                                                    ? vars.environment.http_request
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
                                    single_socket: single_socket,
                                    socket: socket,
                                    temporary: temporary,
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
                proxy_create = function transmit_connection_handshake_proxyCreate(host:string, port:number, encrypted:boolean):void {
                    let count:number = 0;
                    const proxy:websocket_client = (encrypted === true)
                            ?  node.tls.connect({
                                host: host,
                                port: port,
                                rejectUnauthorized: false
                            }) as websocket_client
                            : node.net.connect({
                                host: host,
                                port: port
                            }) as websocket_client,
                        now:string = process.hrtime.bigint().toString(),
                        callback = function transmit_connection_handshake_proxyCreate_callback():void {
                            count = count + 1;
                            if (count > 1) {
                                const redirect:Buffer = redirection();
                                proxy.pipe(socket);

                                // redirection
                                if (redirect === null) {
                                    // no redirection
                                    socket.pipe(proxy);
                                    proxy.write(data);
                                } else {
                                    // redirect by domain
                                    if (
                                        server.redirect_domain !== undefined &&
                                        server.redirect_domain !== null &&
                                        (
                                            server.redirect_domain[config_http.origin] !== undefined ||
                                            (socket.encrypted === true && server.redirect_domain[`${config_http.origin}.secure`] !== undefined)
                                        )
                                    ) {
                                        socket.pipe(proxy);
                                    } else {
                                        // internal redirection
                                        socket.on("data", function transmit_connection_handshake_proxyCreate_redirect(message_data:Buffer):void {
                                            proxy.write(message_data);
                                        });
                                    }
                                    proxy.write(redirect);
                                }
                            }
                        };
                    proxy.on("error", function transmit_connection_handshake_proxyCreate_error(proxy_error:node_error):void {
                        log.application({
                            error: proxy_error,
                            message: "UDP connection error.",
                            origin: `${host} ${port}`,
                            section: "servers-web",
                            status: "error",
                            time: Date.now()
                        });
                        proxy.destroy();
                        socket.destroy();
                    });
                    proxy.once("ready", function transmit_connection_handshake_proxyCreate_ready():void {
                        // requested socket
                        socket_extension({
                            callback: callback,
                            handler: null,
                            identifier: `${config_http.origin}-${now}`,
                            proxy: proxy,
                            role: "server",
                            server: server_id,
                            single_socket: false,
                            socket: socket,
                            temporary: false,
                            timeout: null,
                            type: "relay",
                            userAgent: config_http.user_agent
                        });
                        proxy.addresses = get_address(proxy);
                        // proxy socket
                        socket_extension({
                            callback: callback,
                            handler: null,
                            identifier: `${config_http.origin}-${now}-proxy`,
                            proxy: socket,
                            role: "client",
                            server: server_id,
                            single_socket: false,
                            socket: proxy,
                            temporary: false,
                            timeout: null,
                            type: "proxy",
                            userAgent: config_http.user_agent
                        });
                    });
                };

            {
                const block_list:store_flag = (server.block_list === null || server.block_list === undefined)
                        ? {
                            domain: (domain_local.includes(config_http.origin) === false && socket.proxy === null),
                            host: false,
                            ip: false
                        }
                        : {
                            domain: (domain_local.includes(config_http.origin) === false && socket.proxy === null),
                            host: server.block_list.host.includes(config_http.origin),
                            ip: server.block_list.ip.includes(socket.addresses.remote.address)
                        },
                    blocked:boolean = (config_http.header_count < 3 || flags.referer === true || block_list.host === true || block_list.ip === true || block_list.domain === true),
                    redirect_tls:boolean = (data[0] === 22 && socket.addresses.local.port === server.ports.open && vars.data.server[server_id].ports.secure > 0),
                    redirect_domain_flag:boolean = (server.redirect_domain !== undefined && server.redirect_domain !== null && server.redirect_domain[config_http.origin] !== undefined && server.redirect_domain[config_http.origin] !== null),
                    upgrade_tls_flag:boolean = (config_http.http_upgrade === true && config_http.http_test === false && socket.encrypted !== true && vars.data.server[server_id].config.encryption === "both");

                if (blocked === true) {
                    socket.destroy();
                } else if (redirect_tls === true) {
                    config_http.domain = `open_socket_tunnel-${vars.data.server[server_id].config.name}`;
                    proxy_create(socket.addresses.local.address, vars.data.server[server_id].ports.secure, false);
                } else if (redirect_domain_flag === true) {
                    const pair:type_redirect_domain = (socket.encrypted === true && server.redirect_domain[`${config_http.origin}.secure`] !== undefined)
                            ? server.redirect_domain[`${config_http.origin}.secure`]
                            : server.redirect_domain[config_http.origin],
                        encryption:boolean = (pair[2] === "open")
                            ? false
                            : (pair[2] === "secure")
                                ? true
                                : socket.encrypted,
                        host:string = (pair[0] === undefined || pair[0] === null || pair[0] === "")
                            ? socket.addresses.local.address
                            : pair[0],
                        port:number = (typeof pair[1] === "number")
                            ? pair[1]
                            : (socket.encrypted === true)
                                ? server.ports.secure
                                : server.ports.open;
                    if (config_http.domain === "") {
                        config_http.domain = (host === "127.0.0.1" || host === "::1" || host === "::" || host === "[::1]")
                            ? "localhost"
                            : host;
                    }
                    config_http.domain = `tls_socket_redirect-${vars.data.server[server_id].config.name}`;
                    proxy_create(host, port, encryption);
                } else if (upgrade_tls_flag === true) {
                    upgrade_tls();
                } else {
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