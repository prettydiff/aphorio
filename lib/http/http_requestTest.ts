
import node from "../utilities/node.js";
import send from "../transmit/send.js";
import vars from "../utilities/vars.js";

// cspell: words prettydiff

const http_request = function http_request(socket_data:socket_data, transmit:transmit_socket):void {
    const data:services_http_test = socket_data.data as services_http_test,
        req:string = data.headers,
        header:string = req.split("\r\n\r\n")[0].replace(/\s+$/, "").replace(/\r\n/g, "\n").replace(/\r/g, "\n"),
        headers:string[] = header.split("\n"),
        bodyRaw:string = req.split("\r\n\r\n")[1],
        body:string = (bodyRaw === undefined)
            ? ""
            : bodyRaw,
        path:string = headers[0].replace(/^[A-Z]+\s+/, ""),
        write = function http_request_write(response_body_raw:string, response_headers:string, uri:boolean):void {
            const response_body:string = (response_body_raw === undefined)
                        ? ""
                        : response_body_raw,
                output:services_http_test = {
                    body: response_body,
                    encryption: data.encryption,
                    headers: response_headers,
                    stats: {
                        chunks: {
                            chunked: chunked,
                            count: (chunked === true)
                                ? chunkCount
                                : 1
                        },
                        request: {
                            size_body: Buffer.byteLength(body),
                            size_header: Buffer.byteLength(header)
                        },
                        response: {
                            size_body: Buffer.byteLength(response_body),
                            size_header: Buffer.byteLength(response_headers)
                        },
                        time: (Math.round(Number(process.hrtime.bigint() - startTime) / 1e6) / 1000)
                    },
                    timeout: Math.round(Number(process.hrtime.bigint() - startTime) / 1e6),
                    uri: (uri === true)
                        ? urlOutput()
                        : ""
                };
            send({
                data: output,
                service: "dashboard-http"
            }, transmit.socket as websocket_client, 3);
            if (socket !== null) {
                socket.destroy();
            }
        },
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
        },
        scheme:"http"|"https" = (data.encryption === true)
            ? "https"
            : "http";
    let index:number = headers.length,
        startTime:bigint = 0n,
        socket:node_net_Socket = null,
        url:URL = null,
        host:string = "",
        port:number = 0,
        address:string = "",
        chunked:boolean = false,
        chunkCount:number = 0;
    do {
        index = index - 1;
        if ((/^host\s*:\s*/).test(headers[index].toLowerCase()) === true) {
            address = `${scheme}://${headers[index].toLowerCase().replace(/host\s*:\s*/, "").replace(/\s+$/, "") + path.slice(0, path.indexOf(" "))}`;
        }
        if ((/^connection:\s*keep-alive$/).test(headers[index].toLowerCase()) === true || headers[index].toLowerCase().indexOf("keep-alive:") === 0) {
            headers.splice(index, 1);
        }
        if ((/^accept-encoding\s*:/).test(headers[index].toLowerCase()) === true) {
            headers.splice(index, 1);
        }
    } while (index > 0);
    // eslint-disable-next-line no-restricted-syntax
    try {
        url = new URL(address);
    } catch {
        write(`Error: Invalid address - ${address}`, "", false);
        return;
    }
    port = (url.port === "")
        ? (data.encryption === true)
            ? 443
            : 80
        : Number(url.port);

    host = url.hostname.replace("[", "").replace("]", "");
    if (isNaN(port) === true) {
        write(`Error: Port value is not a number, ${host.slice(host.indexOf(":") + 1)}`, "", false);
        return;
    }
    if (url.hostname === undefined) {
        write(`Error: Host value does not appear valid: ${host}`, "", true);
        return;
    }
    socket = (data.encryption === true)
        ? node.tls.connect({
            host: host,
            port: port,
            rejectUnauthorized: false
        })
        : node.net.connect({
            host: host,
            port: port
        });
    if (data.timeout > 0) {
        socket.setTimeout(data.timeout, function http_request_timeout():void {
            if (socket.writable === true) {
                write(`Error: request exceeded a ${data.timeout / 1000} second timeout.`, "", true);
                socket.end();
            }
        });
    }
    socket.once("error", function http_request_error(error:node_error):void {
        if (error.code === "EPROTO" && error.syscall === "write") {
            write(`The EPROTO error is a protocol negotiation error that occurs for one of three reasons:\n1. Remote server is using outdated TLSv1.1 which is not supported by OpenSSL3 used by Node.js since version 17.\n2. There is a defect in this application.\n3. The most likely cause is a defect in Node.js.\n\nKnown domains causing this error:\n* prettydiff.com\n* www.army.mil\n* www.treasury.gov\n\n${JSON.stringify(error)}\n\nscheme: ${(data.encryption === true) ? "https (tls)" : "http"}\nhost: ${host}\nport: ${port}`, "", true);
        } else {
            write(JSON.stringify(error), "", true);
        }
    });
    socket.once("ready", function http_request_ready():void {
        const decoder:node_stringDecoder_StringDecoder = new node.stringDecoder.StringDecoder("utf8");
        let chunks:string = "",
            fragment:string = "",
            bodyIndex:number = -1,
            contentLength:number = -1;
        if (vars.servers.dashboard.config.domain_local.indexOf(host) > -1 || vars.interfaces.indexOf(host) > -1) {
            headers.push("dashboard-http: true");
        }
        headers.push("");
        headers.push("");
        if (body.length > 0) {
            headers.push(body);
        }
        startTime = process.hrtime.bigint();
        socket.write(headers.join("\r\n"));
        socket.on("data", function http_request_data(responseData:Buffer):void {
            if (contentLength === 0 && ((responseData.length === 5 && responseData.toString() === "0\r\n\r\n") || responseData.length === 0)) {
                socket.end();
                return;
            }
            fragment = decoder.write(responseData);
            chunkCount = chunkCount + 1;
            if (chunked === true) {
                chunks = chunks + fragment.replace(/^[0-9a-f]+\r\n/, "");
            } else {
                chunks = chunks + fragment;
            }
            if (chunkCount === 1) {
                const lower:string = chunks.toLowerCase(),
                    contentIndex:number = lower.indexOf("content-length");
                let content:string = "";
                if (contentIndex > 0) {
                    content = chunks.slice(contentIndex);
                    contentLength = Number(content.slice(content.indexOf(":") + 1, content.indexOf("\r\n")).replace(/\s+/g, ""));
                } else if ((/transfer-encoding:\s*chunked/).test(lower) === true) {
                    contentLength = 0;
                    chunked = true;
                }
            }
            if (bodyIndex < 4) {
                bodyIndex = chunks.indexOf("\r\n\r\n") + 4;
                chunks = chunks.slice(0, bodyIndex) + chunks.slice(bodyIndex).replace(/^[0-9a-f]+\r\n/, "");
            }
            if (Buffer.byteLength(chunks.slice(bodyIndex)) === contentLength) {
                socket.end();
            }
        });
        socket.once("end", function http_request_end():void {
            if (chunks.length < 1) {
                write("Error: message ended with no data, which indicates no web server or connection refused.", "", true);
            } else {
                write(chunks.slice(bodyIndex), chunks.slice(0, bodyIndex), true);
            }
        });
    });
};

export default http_request;


