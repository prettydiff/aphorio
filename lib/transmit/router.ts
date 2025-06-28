
import compose from "../services/compose.js";
import dns from "../services/dns.js";
import fileSystem from "../services/fileSystem.js";
import hash from "../services/hash.js";
import http_request from "../http/http_requestTest.js";
import os from "../services/os.js";
import process_kill from "../services/processKill.js";
import servers from "../services/server.js";
import terminal from "../services/terminal.js";
import websocket_test from "../services/websocket.js";
import youtube_download from "../services/youtubeDownload.js";

// cspell: words serv

const router = function transmit_router(socketData:socket_data, transmit:transmit_socket):void {
    const services:type_service = socketData.service,
        actions:transmit_receiver = {
            "dashboard-compose-container": compose,
            "dashboard-compose-variables": compose,
            "dashboard-dns": dns,
            "dashboard-fileSystem": fileSystem,
            "dashboard-hash": hash,
            "dashboard-http": http_request,
            "dashboard-os-all": os,
            "dashboard-os-disk": os,
            "dashboard-os-intr": os,
            "dashboard-os-main": os,
            "dashboard-os-proc": os,
            "dashboard-os-serv": os,
            "dashboard-os-sock": os,
            "dashboard-server": servers,
            "dashboard-terminal-resize": terminal.resize,
            "dashboard-websocket-handshake": websocket_test.handshake,
            "dashboard-websocket-message": websocket_test.message,
            "process-kill": process_kill,
            "youtube-download": youtube_download
        };
    if (actions[services] !== undefined) {
        actions[services](socketData, transmit);
    }
};

export default router;