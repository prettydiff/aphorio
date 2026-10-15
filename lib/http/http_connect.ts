
import create_socket from "../transmit/create_socket.ts";
import http_write from "./http_write.ts";
import vars from "../core/vars.ts";

// cspell: words prettydiff

const http_connect:type_http_action = function http_connect(config:config_http, socket:websocket_client):void {
    if (isNaN(config.port) === true) {
        const headers:string[] = [
            "HTTP/1.1 400",
            `server: prettydiff/${vars.environment.name}`,
            "content-type: application/json",
            "content-length: ",
            "",
            "",
            "{",
            "    \"error\": \"Bad request\",",
            "    \"message\": \"CONNECT request method did not specify a port.\"",
            "}"
        ];
        headers[3] = headers[3] + Buffer.from([headers[6], headers[7], headers[8], headers[9]].join("\r\n")).byteLength;
        http_write(socket, headers.join("\r\n"), true);
        socket.write(headers.join("\r\n"));
    } else {
        create_socket({
            callback: null,
            handler: null,
            hash: `${socket.server_hash}-connect-${process.hrtime.bigint().toString()}`,
            ip: config.domain,
            port: config.port,
            headers: [],
            proxy: socket,
            resource: null,
            secure: (socket.encrypted === true),
            server: socket.server_hash,
            timeout: null,
            type: "http-proxy"
        });
    }
};

export default http_connect;