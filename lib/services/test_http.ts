
import http_client from "../http/http_client.ts";
import send from "../transmit/send.ts";
import vars from "../core/vars.ts";

const test_http = function services_testHTTP(socket_data:socket_data, transmit:transmit_socket):void {
    const data:services_test_http = socket_data.data as services_test_http,
        startTime:bigint = process.hrtime.bigint();
    if (vars.options.mode !== "demo") {
        const scheme:"http"|"https" = (data.encryption === true)
                ? "https"
                : "http",
            headers:string[] = data.headers.split("\r\n\r\n")[0].replace(/\s+$/, "").replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n"),
            path:string = headers[0].replace(/^[A-Z]+\s+/, "");
        let index:number = headers.length,
            url:URL = null,
            address:string = "",
            host:string = "",
            port:number = 0,
            error_message:string = "";
        if (index > 0) {
            do {
                index = index - 1;
                if ((/^host\s*:\s*/).test(headers[index].toLowerCase()) === true) {
                    address = `${scheme}://${headers[index].toLowerCase().replace(/host\s*:\s*/, "").replace(/\s+$/, "") + path.slice(0, path.indexOf(" "))}`;
                    break;
                }
            } while (index > 0);
            // eslint-disable-next-line no-restricted-syntax
            try {
                url = new URL(address);
            } catch {
                error_message = `Error: Invalid address - ${address}`;
            }
            port = (url.port === "")
                ? (data.encryption === true)
                    ? 443
                    : 80
                : Number(url.port);
            if (isNaN(port) === true || port < 1 || port > 65535) {
                error_message = `Error: Port value is not a number, ${host.slice(host.indexOf(":") + 1)}`;
            }
            if (typeof url.hostname !== "string" || url.hostname === "") {
                error_message = `Error: Host value does not appear valid: ${host}`;
            } else {
                host = url.hostname.replace("[", "").replace("]", "");
            }
            if (data.encryption === true && vars.environment.interfaces.includes(host) === true) {
                let index:number = vars.data.ports_application.length;
                do {
                    index = index - 1;
                    if (vars.data.ports_application[index].port === port && vars.data.ports_application[index].type === "tcp" && vars.data.server[vars.data.ports_application[index].hash].ports.open === port) {
                        error_message = "Error: Encrypted connections not allowed to unencrypted servers.";
                        break;
                    }
                } while (index > 0);
            }
        }
        if (error_message === "") {
            http_client({
                callback_error: function services_testHTTP_error(socket:websocket_client, error:node_error):void {
                    socket.destroy();
                    send({
                        data: {
                            body: error.message,
                            encryption: data.encryption,
                            headers: "",
                            stats: null,
                            timeout: Math.round(Number(process.hrtime.bigint() - startTime) / 1e6),
                            uri: null
                        },
                        service: "services_test_http"
                    }, transmit.socket as websocket_client, 3);
                },
                callback_response: function services_testHTTP_response(socket:websocket_client, response:Buffer, meta:config_http_request_output):void {
                    const header_index:number = response.indexOf("\r\n\r\n"),
                        body:Buffer = response.subarray(header_index + 4),
                        headers: Buffer = response.subarray(0, header_index),
                        urlOutput = function http_request_urlOutput():string {
                            const urls:string[] = [
                                    "",
                                    `"absolute": ${JSON.stringify(url)},`
                                ],
                                urlPush = function http_request_data_urlPush(input:"hash"|"host"|"hostname"|"origin"|"password"|"pathname"|"port"|"protocol"|"search"|"username", noComma?:boolean):void {
                                    const comma:string = (noComma === true)
                                        ? ""
                                        : ",";
                                    urls.push(`"${input}": "${url[input]}"${comma}`);
                                };
                            urlPush("origin");
                            urlPush("protocol");
                            urlPush("username");
                            urlPush("password");
                            urlPush("host");
                            urlPush("hostname");
                            urlPush("port");
                            urlPush("pathname");
                            urlPush("search");
                            urlPush("hash", true);
                            return `{${urls.join("\n    ")}\n}`;
                        };
                    socket.destroy();
                    send({
                        data: {
                            body: body.toString(),
                            encryption: data.encryption,
                            headers: headers.toString(),
                            stats: {
                                chunks: {
                                    chunked: meta.chunked,
                                    count: (meta.chunked === true)
                                        ? meta.chunks
                                        : 1
                                },
                                request: {
                                    size_body: Buffer.byteLength(data.body),
                                    size_header: Buffer.byteLength(data.headers)
                                },
                                response: {
                                    size_body: Buffer.byteLength(body),
                                    size_header: Buffer.byteLength(headers)
                                },
                                time: (Math.round(Number(process.hrtime.bigint() - startTime) / 1e6) / 1000)
                            },
                            timeout: Math.round(Number(process.hrtime.bigint() - startTime) / 1e6),
                            uri: (url === null)
                                ? null
                                : urlOutput()
                        },
                        service: "services_test_http"
                    }, transmit.socket as websocket_client, 3);
                },
                encryption: data.encryption,
                host: host,
                port: port,
                message: Buffer.from(data.headers.replace(/\r/g, "").replace(/\n/g, "\r\n")),
                timeout: data.timeout,
                type: "test-http"
            });
        } else {
            send({
                data: {
                    body: error_message,
                    encryption: data.encryption,
                    headers: "",
                    stats: null,
                    timeout: Math.round(Number(process.hrtime.bigint() - startTime) / 1e6),
                    uri: ""
                },
                service: "services_test_http"
            }, transmit.socket as websocket_client, 3);
        }
    }
};

export default test_http;