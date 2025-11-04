
import log from "../core/log.ts";
import message_handler from "./messageHandler.ts";
import receiver from "./receiver.ts";
import send from "./send.ts";
import server_halt from "../services/server_halt.ts";
import socket_end from "./socketEnd.ts";
import socket_list from "../services/socket_list.ts";
import vars from "../core/vars.ts";

const socket_extension = function transmit_socketExtension(config:config_websocket_extensions):void {
    const encryption:type_encryption = (config.socket.secure === true)
        ? "secure"
        : "open";
    // permit if the socket is not already created
    if (vars.server_meta[config.server].sockets[encryption].includes(config.socket) === false) {
        const ping = function transmit_socketExtension_ping(ttl:number, callback:(err:node_error, roundtrip:bigint) => void):void {
                const errorObject = function transmit_socketExtension_ping_errorObject(code:string, message:string):node_error {
                        const err:node_error = new Error();
                        err.code = code;
                        err.message = `${message} Socket ${config.socket.hash} and name ${config.socket.hash}.`;
                        return err;
                    };
                if (config.socket.status !== "open") {
                    callback(errorObject("ECONNABORTED", "Ping error on websocket without 'open' status."), null);
                } else {
                    const nameSlice:string = config.socket.hash.slice(0, 125);
                    // send ping
                    send(Buffer.from(nameSlice), config.socket, 9);
                    config.socket.pong[nameSlice] = {
                        callback: callback,
                        start: process.hrtime.bigint(),
                        timeOut: setTimeout(function transmit_socketExtension_ping_delay():void {
                            callback(config.socket.pong[nameSlice].timeOutMessage, null);
                            delete config.socket.pong[nameSlice];
                        }, ttl),
                        timeOutMessage: errorObject("ETIMEDOUT", "Ping timeout on websocket."),
                        ttl: BigInt(ttl * 1e6)
                    };
                }
            },
            encryption:"open"|"secure" = (config.socket.secure === true)
                ? "secure"
                : "open",
            socket:services_socket_application_item = {
                address: config.socket.addresses,
                encrypted: (config.socket.encrypted === true),
                hash: config.identifier,
                proxy: (config.socket.proxy === undefined || config.socket.proxy === null)
                    ? null
                    : config.socket.proxy.hash,
                role: config.role,
                server_id: config.server,
                server_name: vars.servers[config.server].config.name,
                type: config.type
            },
            log_config:config_log = {
                error: null,
                message: `Socket ${config.identifier} opened on ${encryption} server ${config.server}.`,
                section: "sockets-application",
                status: "informational",
                time: Date.now()
            };
        config.socket.server = config.server;     // identifies which local server the given socket is connected to
        config.socket.hash = config.identifier;   // assigns a unique identifier to the socket based upon the socket's credentials
        config.socket.role = config.role;         // assigns socket creation location
        config.socket.type = config.type;         // a classification identifier to functionally identify a common utility of sockets on a given server
        if (config.type === "websocket-test" || config.proxy === null) {
            config.socket.handler = (config.handler === message_handler.default)
                ? (message_handler[config.server] === undefined)
                    ? config.handler
                    : message_handler[config.server]
                : config.handler;   // assigns an event handler to process incoming messages
            if (config.type !== "http") {
                config.socket.on("data", receiver);
                config.socket.fragment = Buffer.from([]); // storehouse of complete data frames, which will comprise a frame header and payload body that may be fragmented
                config.socket.frame = Buffer.from([]);    // stores pieces of frames, which can be divided due to TLS decoding or header separation from some browsers
                config.socket.frameExtended = 0;          // stores the payload size of a given message payload as derived from the extended size bytes of a frame header
                config.socket.ping = ping;                // provides a means to insert a ping control frame and measure the round trip time of the returned pong frame
                config.socket.pong = {};                  // stores termination times and callbacks for pong handling
                config.socket.queue = [];                 // stores messages for transmit, because websocket protocol cannot intermix messages
            }
            config.socket.status = "open";            // sets the status flag for the socket
            if (config.single_socket === true) {
                const death = function transmit_socketExtension_death():void {
                    // eslint-disable-next-line @typescript-eslint/no-this-alias, no-restricted-syntax
                    const socket:websocket_client = this;
                    server_halt({
                        action: "destroy",
                        server: vars.servers[socket.server].config
                    }, null);
                };
                config.socket.on("close", death);
                config.socket.on("end", death);
                config.socket.on("error", death);
            } else {
                config.socket.on("close", socket_end);
                config.socket.on("end", socket_end);
                config.socket.on("error", socket_end);
            }
        } else {
            config.socket.on("close", socket_end);
            config.socket.on("end", socket_end);
            config.socket.on("error", socket_end);
        }
        if (config.callback !== null && config.callback !== undefined) {
            config.callback(config.socket, config.timeout);
        }
        socket_list(function transmit_socketExtension_socketList():void {
            vars.server_meta[config.server].sockets[encryption].push(config.socket);
            vars.servers[config.server].sockets.push(socket);
        });
        log.application(log_config);
    }
};

export default socket_extension;