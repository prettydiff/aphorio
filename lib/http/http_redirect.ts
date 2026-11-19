
import http_write from "./http_write.ts";
import node from "../core/node.ts";
import vars from "../core/vars.ts";

const http_redirect = function http_redirect(config:config_http, scheme:string, socket:websocket_client):void {
    const server_id:string = socket.server_hash,
        domain:string = (node.net.isIPv6(config.domain) === true)
            ? `[${config.domain}]`
            : config.domain,
        port:number = (scheme === "https" || scheme === "wss")
            ? vars.data.server[server_id].ports.secure
            : vars.data.server[server_id].ports.open;
    http_write(socket, [
        "HTTP/1.1 308",
        `location: ${scheme}://${domain}:${port + config.resource}`,
        "content-length: 5",
        "",
        "moved",
        "",
        ""
    ].join("\r\n"), true);
};

export default http_redirect;