
import http_write from "./http_write.ts";

const http_trace = function http_trace(config:config_http, socket:websocket_client):void {
    const output:string[] = [
            "HTTP/1.1 200 OK",
            "content-length: ",
            `date: ${new Date(Date.now()).toUTCString()}`,
            "server: Aphorio",
            "content-type: message/http",
            "",
            `${config.method.toUpperCase()} ${config.resource} HTTP/1.1`,
            `host: ${config.origin}`,
            `useragent: ${config.user_agent}`,
            `accept: ${config.accept}`
        ];
    output[1] = output[1] + output.slice(output.length - 4).join("\r\n").length;
    http_write(socket, output.join("\r\n"), true);
};

export default http_trace;