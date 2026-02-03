
import send from "../transmit/send.ts";
import socket_udp from "../transmit/socket_udp.ts";

const udp_socket = function services_udpSocket(socket_data:socket_data, transmit:transmit_socket):void {
    const data:services_udp_socket = socket_data.data as services_udp_socket;
    data.handler = null;
    socket_udp.create(socket_data, function services_udpSocket_callback(socket_udp:transmit_udp):void {
        const socket:websocket_client = transmit.socket as websocket_client;
        send({
            data: [`UDP ${socket_udp.role} socket created on local port ${socket_udp.addresses.local.port} with id: ${socket_udp.hash}.`],
            service: "dashboard-udp-status"
        }, socket, 3);
    });
};

export default udp_socket;