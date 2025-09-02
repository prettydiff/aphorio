
import create_socket from "../transmit/createSocket.ts";

const http_connect:http_action = function http_connect(headerList:string[], socket:websocket_client):void {
    const destination:string = headerList[0].replace(/\s+/g, " ").split(" ")[1],
        index_colon:number = destination.lastIndexOf(":"),
        index_brace:number = destination.lastIndexOf("]"),
        portString:string = (index_colon > 0 && (index_brace < 0 || (index_brace > 0 && index_brace < index_colon)))
            ? destination.slice(index_colon + 1)
            : "",
        ip:string = (portString === "")
            ? destination
            : destination.split(`:${portString}`)[0];
    create_socket({
        callback: null,
        handler: null,
        hash: `${socket.server}-connect-${process.hrtime.bigint().toString()}`,
        ip: ip,
        port: (isNaN(Number(portString)) === true)
            ? (socket.encrypted === true)
                ? 443
                : 80
            : Number(portString),
        headers: [],
        proxy: socket,
        resource: null,
        secure: (socket.encrypted === true),
        server: socket.server,
        timeout: null,
        type: "http-proxy"
    });
};

export default http_connect;