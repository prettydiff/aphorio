
import node from "../core/node.ts";
import http_parse from "./http_parse.ts";

const http_client = function http_client(config:config_http_client):websocket_client {
    const socket:websocket_client = (config.encryption === true)
            ? node.tls.connect({
                host: config.host,
                port: config.port,
                timeout: config.timeout,
                rejectUnauthorized: false
            }) as websocket_client
            : node.net.connect({
                host: config.host,
                port: config.port,
                timeout: config.timeout,
            }) as websocket_client;
    socket.on("data", function http_client_data(this:websocket_client, data_response:Buffer):void {
        const socket:websocket_client = this,
            output:Buffer = (function http_client_data_output():Buffer {
                socket.fragments.push(data_response);
                return Buffer.concat(socket.fragments);
            }());
        if (output.includes("\r\n\r\n")) {
            const config_http:config_http = http_parse(null, config.port, output),
                chunked:number = config_http.body.indexOf("\r\n0\r\n\r\n");
            if (config_http.response_type === -1 && chunked > 0) {
                socket.fragments = [config_http.body.subarray(chunked + 7)];
                config.callback_response(socket, Buffer.concat([Buffer.from(`${config_http.headers.join("\r\n")}\r\n\r\n`), config_http.body.subarray(0, chunked)]));
            } else if (config_http.body.byteLength === config_http.response_type) {
                socket.fragments = [config_http.body.subarray(config_http.response_type)];
                config.callback_response(socket, Buffer.concat([Buffer.from(`${config_http.headers.join("\r\n")}\r\n\r\n`), config_http.body.subarray(0, config_http.response_type)]));
            }
        }
        
    });
    socket.on("error", function http_client_error(this:websocket_client, error:node_error):void {
        const socket:websocket_client = this;
        socket.removeAllListeners("data");
        socket.removeAllListeners("error");
        socket.removeAllListeners("ready");
        socket.destroy();
        config.callback_error(error);
    });
    socket.on("ready", function http_client_ready(this:websocket_client):void {
        const socket:websocket_client = this;
        socket.fragments = [];
        socket.write(config.message);
    });
    socket.on("timeout", function http_client_timeout(this:websocket_client):void {
        const socket:websocket_client = this;
        socket.removeAllListeners("data");
        socket.removeAllListeners("error");
        socket.removeAllListeners("ready");
        socket.destroy();
    });
    return socket;
};

export default http_client;