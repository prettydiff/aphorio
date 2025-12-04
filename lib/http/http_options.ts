

const http_options = function http_trace(headerList:string[], socket:websocket_client):void {
    const options:string[] = ["GET", "CONNECT", "OPTIONS", "TRACE"],
        output:string[] = [
            "HTTP/1.1 200 OK",
            `allow: ${options.join(", ")}`,
            `date: ${new Date(Date.now()).toUTCString()}`,
            "server: Aphorio",
            "content-type: message/http",
            ""
        ];
    socket.write(output.join("\r\n"));
    socket.destroySoon();
};

export default http_options;