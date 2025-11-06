
import get_address from "../core/get_address.ts";
import hash from "../core/hash.ts";
import http from "../http/index.ts";
import log from "../core/log.ts";
import message_handler from "./messageHandler.ts";
import node from "../core/node.ts";
import server_halt from "../services/server_halt.ts";
import socket_extension from "./socketExtension.ts";
import terminal from "../services/terminal.ts";
import vars from "../core/vars.ts";
import websocket_test from "../services/websocket.ts";

const connection = function transmit_connection(TLS_socket:node_tls_TLSSocket):void {
    // eslint-disable-next-line no-restricted-syntax
    const server_id:string = this.id,
        server:services_server = vars.servers[server_id].config,
        handshake = function transmit_connection_handshake(data:Buffer):void {
            let nonceHeader:string = null,
                domain:string = "",
                key:string = "",
                referer:boolean = null,
                type:string = "";
            // eslint-disable-next-line @typescript-eslint/no-this-alias, no-restricted-syntax
            const socket:websocket_client = this,
                dataString:string = data.toString("utf-8"),
                headerIndex:number = dataString.replace(/^\s+/, "").indexOf("\r\n\r\n"),
                headerString:string = (headerIndex > 0)
                    ? dataString.replace(/^\s+/, "").slice(0, headerIndex)
                    : dataString.replace(/^\s+/, ""),
                headerList:string[] = headerString.split("\r\n"),
                testNonce:RegExp = (/^Sec-WebSocket-Protocol:\s*/),
                single_socket:boolean = (server.single_socket === true),
                temporary:boolean = (server.temporary === true),
                address:transmit_addresses_socket = get_address(socket),
                get_domain = function transmit_connection_handshake_getDomain(header:string, arrIndex:number, arr:string[]):void {
                    const hostName:string = header.toLowerCase().replace("host:", "").replace(/\s+/g, ""),
                        sIndex:number = hostName.indexOf("]"),
                        index:number = hostName.indexOf(":"),
                        host:string = (index > 0)
                            ? hostName.slice(0, index)
                            : hostName;
                    if (hostName.indexOf("[") === 0 && ((index > 4 && sIndex > 5) || hostName.indexOf("::") > -1)) {
                        domain = hostName.slice(1, sIndex);
                    } else {
                        domain = host.replace(`:${address.local.port}`, "");
                    }
                    // ensures HTTP requests pushed through the proxy are identified as originating from the proxy
                    if (server.domain_local.includes(domain) === false) {
                        arr[arrIndex] = (socket.encrypted === true)
                            ? `Host: ${address.local.address}:${server.ports.secure}`
                            : `Host: ${address.local.address}:${server.ports.open}`;
                    }
                },
                get_referer = function transmit_connection_handshake_getReferer(header:string):void {
                    const refererName:string = header.toLowerCase().replace(/referer:\s*/, "");
                    let index:number = (server.block_list === null || server.block_list === undefined)
                        ? 0
                        : server.block_list.referrer.length;
                    if (index > 0) {
                        do {
                            index = index - 1;
                            if (refererName.indexOf(server.block_list.referrer[index].toLowerCase()) === 0 || refererName.replace(/\w+:\/\//, "").indexOf(server.block_list.referrer[index].toLowerCase()) === 0) {
                                referer = true;
                                return;
                            }
                        } while (index > 0);
                    }
                },
                headerEach = function transmit_connection_handshake_headerEach(header:string, arrIndex:number, arr:string[]):void {
                    if (header.indexOf("Sec-WebSocket-Key") === 0) {
                        key = header.slice(header.indexOf("-Key:") + 5).replace(/\s/g, "") + "258EAFA5-E914-47DA-95CA-C5AB0DC85B11";
                    } else if (header.toLowerCase().indexOf("host:") === 0) {
                        get_domain(header, arrIndex, arr);
                    } else if (header.toLowerCase().indexOf("referer:") === 0) {
                        get_referer(header);
                    } else if (testNonce.test(header) === true) {
                        nonceHeader = header;
                        type = header.replace(testNonce, "");
                    }
                },
                redirection = function transmit_connection_handshake_redirection():Buffer {
                    const request_path:string = (headerList[0].includes("HTTP") === true)
                            ? headerList[0].replace(/ +/g, " ").replace(/ $/, "").slice(headerList[0].indexOf(" ") + 1, headerList[0].lastIndexOf(" "))
                            : null,
                        keys:string[] = (server.redirect_asset === null || server.redirect_asset === undefined || server.redirect_asset[domain] === undefined)
                            ? []
                            : Object.keys(server.redirect_asset[domain]);
                    let index:number = keys.length;

                    if (index > 0) {
                        let matched:boolean = false,
                            wild:string = "";
                        // look for exact matches first
                        do {
                            index = index - 1;
                            if (keys[index] === request_path && key.charAt(keys[index].length - 1) !== "*") {
                                headerList[0] = `${headerList[0].slice(0, headerList[0].indexOf(" "))} ${server.redirect_asset[domain][keys[index]] + headerList[0].replace(/ +$/, "").slice(headerList[0].lastIndexOf(" "))}`;
                                matched = true;
                                break;
                            }
                        } while (index > 0);

                        // look for wildcard matches second
                        index = keys.length;
                        if (matched === false) {
                            do {
                                index = index - 1;
                                wild = keys[index].replace(/\*$/, "");
                                if (keys[index].charAt(key.length - 1) === "*" && request_path.indexOf(wild) === 0 && request_path.indexOf(server.redirect_asset[domain][keys[index]]) !== 0) {
                                    headerList[0] = `${headerList[0].slice(0, headerList[0].indexOf(" "))} ${request_path.replace(wild, server.redirect_asset[domain][keys[index]]) + headerList[0].replace(/ +$/, "").slice(headerList[0].lastIndexOf(" "))}`;
                                    break;
                                }
                            } while (index > 0);
                        }

                        return Buffer.from(dataString.replace(headerString, headerList.join("\r\n")));
                    }
                    return null;

                },
                local_service = function transmit_connection_handshake_localService():void {
                    data = redirection();
                    if (key === "") {
                        const http_action = function transmit_connection_handshake_localService_httpAction():void {
                            const method:type_http_method = headerList[0].slice(0, headerList[0].indexOf(" ")).toLowerCase() as type_http_method;
                            if (http[method] !== undefined) {
                                if (method === "get" && server_id === vars.dashboard_id && headerList[0].indexOf("GET / HTTP") === 0) {
                                    vars.http_request = headerString;
                                }
                                http[method](headerList, socket, headerIndex < 1
                                    ? null
                                    : data.subarray(Buffer.byteLength(headerString))
                                );
                                if (server.single_socket === true) {
                                    const terminate = function transmit_connection_handshake_localService_httpAction_terminate():void {
                                        // eslint-disable-next-line @typescript-eslint/no-this-alias, no-restricted-syntax
                                        const this_socket:websocket_client = this;
                                        server_halt({
                                            action: "destroy",
                                            server: vars.servers[this_socket.server].config
                                        }, null);
                                    };
                                    socket.on("close", terminate);
                                    socket.on("end", terminate);
                                    socket.on("error", terminate);
                                }
                            } else {
                                // unsupported HTTP methods result in socket destruction
                                socket.destroy();
                            }
                        };
                        let resource:string = headerList[0].slice(headerList[0].indexOf(" ") + 1).trim();
                        resource = resource.slice(0, resource.indexOf(" "));
                        socket_extension({
                            callback: http_action,
                            handler: message_handler.default,
                            identifier: `http-${resource}-${Math.random()}`,
                            proxy: null,
                            role: "server",
                            server: server_id,
                            single_socket: single_socket,
                            socket: socket,
                            temporary: temporary,
                            timeout: null,
                            type: "http"
                        });
                    } else {
                        // local domain websocket support
                        const callback = function transmit_connection_handshake_hash(hashOutput:hash_output):void {
                            const client_respond = function transmit_connection_handshake_hash_clientRespond():void {
                                    const headers:string[] = [
                                            "HTTP/1.1 101 Switching Protocols",
                                            "Upgrade: websocket",
                                            "Connection: Upgrade",
                                            `Sec-WebSocket-Accept: ${hashOutput.hash}`,
                                            "Access-Control-Allow-Origin: *",
                                            "Server: webserver"
                                        ];
                                    if (nonceHeader !== null) {
                                        headers.push(nonceHeader);
                                    }
                                    headers.push("");
                                    headers.push("");
                                    socket.write(headers.join("\r\n"));
                                    if (single_socket === true || temporary === true) {
                                        const security:"open"|"secure" = (socket.secure === true)
                                            ? "secure"
                                            : "open";
                                        vars.server_meta[server_id].server[security].removeAllListeners();
                                    }
                                    if (terminalFlag === true && headerList[0].includes("shell") === true) {
                                        const url:URL = new URL(decodeURIComponent(`http://www.x${headerList[0].split(" ")[1]}`)),
                                            params:string[] = url.search.slice(1).split("&"),
                                            cols:number = (params[1] === undefined)
                                                ? null
                                                : Number(params[1].split("=")[1]),
                                            rows:number = (params[2] === undefined)
                                                ? null
                                                : Number(params[2].split("=")[1]),
                                            term:terminal = {
                                                cols: (Number.isNaN(cols) === true)
                                                    ? 199
                                                    : cols,
                                                rows: (Number.isNaN(rows) === true)
                                                    ? 50
                                                    : rows,
                                                shell: params[0].split("=")[1].replace(/%20/g, " ")
                                            };
                                        terminal.shell(socket as websocket_pty, term);
                                    }
                                },
                                terminalFlag:boolean = (server_id === vars.dashboard_id && type === "dashboard-terminal"),
                                identifier:string = (terminalFlag === true)
                                    ? `dashboard-terminal-${hashOutput.hash}`
                                    : (type === "websocket-test")
                                        ? `websocketTest-browserSocket-${hashOutput.hash}`
                                        : `browserSocket-${hashOutput.hash}`;
                            socket_extension({
                                callback: client_respond,
                                handler: (type === "websocket-test")
                                    ? websocket_test.handler_server
                                    : message_handler.default,
                                identifier: identifier,
                                proxy: null,
                                role: "server",
                                server: server_id,
                                single_socket: single_socket,
                                socket: socket,
                                temporary: temporary,
                                timeout: null,
                                type: type
                            });
                        };
                        hash({
                            algorithm: "sha1",
                            callback: callback,
                            digest: "base64",
                            hash_input_type: "direct",
                            section: "servers",
                            source: key
                        });
                    }
                },
                create_proxy = function transmit_connection_handshake_createProxy():void {
                    let count:number = 0;
                    const encrypted:boolean = (
                            socket.encrypted === true &&
                            server.redirect_domain !== undefined &&
                            server.redirect_domain !== null &&
                            server.redirect_domain[`${domain}.secure`] !== undefined
                        ),
                        pair:[string, number] = (encrypted === true)
                            ? server.redirect_domain[`${domain}.secure`]
                            : (server.redirect_domain === undefined || server.redirect_domain === null || server.redirect_domain[domain] === undefined)
                                ? (socket.encrypted === true)
                                    ? [address.local.address, server.ports.secure]
                                    : [address.local.address, server.ports.open]
                                : server.redirect_domain[domain],
                        host:string = (pair[0] === undefined || pair[0] === null || pair[0] === "")
                            ? address.local.address
                            : pair[0],
                        port:number = (typeof pair[1] === "number")
                            ? pair[1]
                            : (socket.encrypted === true)
                                ? server.ports.secure
                                : server.ports.open,
                        proxy:websocket_client = (encrypted === true)
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
                        callback = function transmit_connection_handshake_createProxy_callback():void {
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
                                    if (server.redirect_domain !== undefined && server.redirect_domain !== null && (server.redirect_domain[domain] !== undefined || (socket.encrypted === true && server.redirect_domain[`${domain}.secure`] !== undefined))) {
                                        socket.pipe(proxy);
                                    } else {
                                        // internal redirection
                                        socket.on("data", function transmit_connection_handshake_createProxy_redirect(message_data:Buffer):void {
                                            proxy.write(message_data);
                                        });
                                    }
                                    proxy.write(redirect);
                                }
                            }
                        };
                    proxy.once("ready", function transmit_connection_handshake_createProxy_ready():void {
                        // requested socket
                        socket_extension({
                            callback: callback,
                            handler: null,
                            identifier: `${domain}-${now}`,
                            proxy: proxy,
                            role: "server",
                            server: server_id,
                            single_socket: false,
                            socket: socket,
                            temporary: false,
                            timeout: null,
                            type: `relay`
                        });
                        proxy.addresses = get_address(proxy);
                        // proxy socket
                        socket_extension({
                            callback: callback,
                            handler: null,
                            identifier: `${domain}-${now}-proxy`,
                            proxy: socket,
                            role: "client",
                            server: server_id,
                            single_socket: false,
                            socket: proxy,
                            temporary: false,
                            timeout: null,
                            type: "proxy"
                        });
                    });
                },
                blocked_host:boolean = (server.block_list !== null && server.block_list !== undefined && server.block_list.host.includes(domain) === true),
                blocked_ip:boolean = (server.block_list !== null && server.block_list !== undefined && server.block_list.ip.includes(address.remote.address) === true),
                no_domain_redirect:boolean = (server.redirect_domain === undefined || server.redirect_domain === null || server.redirect_domain[domain] === undefined),
                domain_local:boolean = server.domain_local.concat(vars.interfaces).includes(domain);
            headerList.forEach(headerEach);
            if (referer === true || blocked_host === true || blocked_ip === true) {
                socket.destroy();
            } else if (no_domain_redirect === true && domain_local === true) {
                socket.destroy();
            } else {
                socket.addresses = address;
                // do not proxy primary domain -> endless loop
                if (server.domain_local.includes(domain) === true || vars.interfaces.includes(domain) === true) {
                    local_service();
                } else {
                    create_proxy();
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
            section: "servers",
            status: "error",
            time: Date.now()
        });
    });
    TLS_socket.once("data", handshake);
};

export default connection;