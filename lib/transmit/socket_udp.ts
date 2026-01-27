
import broadcast from "./broadcast.ts";
import hash from "../core/hash.ts";
import node from "../core/node.ts";
import vars from "../core/vars.ts";

const socket_udp:transmit_udp_module = {
    closed: function transmit_socketUDP_closed():void {
        // eslint-disable-next-line @typescript-eslint/no-this-alias, no-restricted-syntax
        const socket:transmit_udp = this;
        socket_udp.list({
            address_local: "",
            address_remote: "",
            handler: null,
            id: socket.id,
            multicast_interface: "",
            multicast_group: "",
            multicast_membership: "",
            multicast_source: "",
            multicast_type: "none",
            port_local: null,
            port_remote: null,
            role: null,
            time: 0,
            type: null
        }, "remove", Date.now());
    },
    create: function transmit_socketUDP_create(socket_data:socket_data, callback:(socket:transmit_udp) => void):void {
        const data:services_udp_socket = socket_data.data as services_udp_socket,
            port:number = (isNaN(data.port_local) === true || data.port_local > 65535 || data.port_local < 1)
                ? 0
                : Math.floor(data.port_local),
            address:string = ((data.type === "ipv4" && node.net.isIPv4(data.address_local) === true) || (data.type === "ipv6" && node.net.isIPv6(data.address_local) === true))
                ? data.address_local
                : null,
            dgram:node_dgram_Socket = node.dgram.createSocket({
                recvBufferSize: 1024 * 64,
                sendBufferSize: 1024 * 64,
                type: (data.type === "ipv4")
                    ? "udp4"
                    : "udp6"
            }),
            status = function transmit_socketUDP_create_status(socket:transmit_udp):void {
                const now:number = Date.now(),
                    config_hash:config_hash = {
                        algorithm: "sha3-512",
                        callback: function transmit_socketUDP_create_status_hash(hash_output:hash_output):void {
                            const local:node_net_AddressInfo = socket.address(),
                                remote:node_net_AddressInfo = (socket.role === "client")
                                    ? socket.remoteAddress()
                                    : null;
                            socket.addresses = {
                                local: {
                                    address: local.address,
                                    port: local.port
                                },
                                remote: {
                                    address: (remote === null)
                                        ? (socket.type === "ipv4")
                                            ? "0.0.0.0"
                                            : "::"
                                        : remote.address,
                                    port: (remote === null)
                                        ? 0
                                        : remote.port
                                }
                            };
                            data.address_local = socket.addresses.local.address;
                            data.address_remote = socket.addresses.remote.address;
                            data.port_local = socket.addresses.local.port;
                            data.port_remote = socket.addresses.remote.port;
                            data.id = hash_output.hash;
                            socket.id = hash_output.hash;
                            data.time = now;
                            socket.time = now;
                            socket.on("close", socket_udp.closed);
                            socket.on("error", socket_udp.closed);
                            if (data.handler !== null) {
                                socket.on("message", data.handler);
                                data.handler = null;
                            }
                            socket_udp.list(data, "add", now);
                            if (callback !== null) {
                                callback(socket);
                            }
                            // 1. need to pass in handler
                            // 2. send a status message, if socket_data.service === dashboard-udp-socket
                        },
                        digest: "hex",
                        hash_input_type: "direct",
                        section: "udp-socket",
                        source: JSON.stringify(data) + now
                    };
                hash(config_hash);
            };
        if (data.role === "server") {
            // eslint-disable-next-line no-restricted-syntax
            dgram.bind({
                address: address,
                port: port
            }, function transmit_socketUDP_create_server():void {
                // eslint-disable-next-line @typescript-eslint/no-this-alias, no-restricted-syntax
                const socket:transmit_udp = this,
                    multicast:"membership"|"none"|"source" = (data.multicast_type === "membership" && ((data.type === "ipv4" && node.net.isIPv4(data.multicast_membership) === true) || (data.type === "ipv6" && node.net.isIPv6(data.multicast_membership) === true)))
                        ? "membership"
                        : (data.multicast_type === "source" && ((data.type === "ipv4" && node.net.isIPv4(data.multicast_group) === true && node.net.isIPv4(data.multicast_source) === true) || (data.type === "ipv6" && node.net.isIPv6(data.multicast_group) === true && node.net.isIPv6(data.multicast_source) === true)))
                            ? "source"
                            : "none";
                if (multicast !== "none") {
                    const membership = function transmit_socketUDP_create_server_membership(interface_name:string):void {
                            socket.addMembership(data.multicast_membership, interface_name);
                        },
                        source = function transmit_socketUDP_create_server_source(interface_name:string):void {
                            socket.addSourceSpecificMembership(data.multicast_source, data.multicast_group, interface_name);
                        },
                        action:((interface_name:string) => void) = (multicast === "membership")
                            ? membership
                            : source;
                    if (data.multicast_interface === "All Interfaces") {
                        const keys:string[] = Object.keys(vars.os.intr.data);
                        let index:number = keys.length;
                        if (index > 0) {
                            do {
                                index = index - 1;
                                action(keys[index]);
                            } while (index > 0);
                        }
                    } else {
                        action(data.multicast_interface);
                    }
                }
                socket.multicast_type = multicast;
                socket.role = "server";
                socket.type = data.type;
                status(socket);
            });
        } else {
            dgram.connect(port, address, function transmit_socketUDP_create_client():void {
                // eslint-disable-next-line @typescript-eslint/no-this-alias, no-restricted-syntax
                const socket:transmit_udp = this;
                socket.multicast_type = "none";
                socket.role = "client";
                socket.type = data.type;
                status(socket);
            });
        }
    },
    handler: function transmit_socketUDP_handler(socket:transmit_udp, handler:(message:Buffer) => void):void {
        if (handler !== null) {
            socket.on("message", handler);
        }
    },
    list: function transmit_socketUDP_list(item:services_udp_socket, action:"add"|"remove", now:number):void {
        if (action === "add") {
            vars.sockets.udp.push(item);
        } else {
            let index:number = vars.sockets.udp.length;
            if (index > 0) {
                do {
                    index = index - 1;
                    if (vars.sockets.udp[index].id === item.id) {
                        vars.sockets.udp.splice(index, 1);
                        break;
                    }
                } while (index > 0);
            }
        }
        vars.sockets.time = now;
        broadcast(vars.environment.dashboard_id, "dashboard", {
            data: vars.sockets,
            service: "dashboard-socket-application"
        });
    },
    send: function transmit_socketUDP_send(socket:transmit_udp, message_item:Array<number>|Buffer|bigint|number|string):void {
        const message:Buffer = (Buffer.isBuffer(message_item) === true)
            ? message_item
            : (typeof message_item === "bigint" || typeof message_item === "number")
                ? Buffer.from(String(message_item))
                : Buffer.from(message_item);
        socket.send(message);
    }
};

export default socket_udp;