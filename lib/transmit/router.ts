
import dns from "../services/dns.ts";
import docker from "../services/docker.ts";
import fileSystem from "../services/fileSystem.ts";
import hash from "../services/hash.ts";
import http_request from "../http/http_requestTest.ts";
import os from "../services/os.ts";
import servers from "../services/server.ts";
import socket_list from "../services/socket_list.ts";
import statistics from "../services/statistics.ts";
import terminal from "../services/terminal.ts";
import test_runner from "../test/runner.ts";
import udp_socket from "../services/udp_socket.ts";
import websocket_test from "../services/websocket.ts";

// cspell: words serv

const router = function transmit_router(socketData:socket_data, transmit:transmit_socket):void {
    const services:type_service = socketData.service,
        actions:transmit_receiver = {
            "dashboard-compose-container": docker.receive,
            "dashboard-compose-variables": docker.receive,
            "dashboard-dns": dns,
            "dashboard-fileSystem": fileSystem,
            "dashboard-hash": hash,
            "dashboard-http": http_request,
            "dashboard-os-all": os,
            "dashboard-os-devs": os,
            "dashboard-os-disk": os,
            "dashboard-os-intr": os,
            "dashboard-os-main": os,
            "dashboard-os-proc": os,
            "dashboard-os-serv": os,
            "dashboard-os-sock": os,
            "dashboard-os-user": os,
            "dashboard-server": servers,
            "dashboard-socket-application": socket_list,
            "dashboard-statistics-change": statistics.change,
            "dashboard-terminal-resize": terminal.resize,
            "dashboard-udp-socket": udp_socket,
            "dashboard-websocket-handshake": websocket_test.handshake,
            "dashboard-websocket-message": websocket_test.message,
            "test-browser": test_runner.receive
        };
    if (actions[services] !== undefined) {
        actions[services](socketData, transmit);
    }
};

export default router;