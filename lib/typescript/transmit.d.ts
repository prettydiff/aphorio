
interface socket_data {
    data: type_socket_data;
    service: type_service;
}

interface stat_item extends node_fs_Stats {
    path: string;
    type: type_file;
}
type statList = Array<stat_item>;

interface transmit_addresses_socket {
    local: {
        address: string;
        port: number;
    };
    remote: {
        address: string;
        port: number;
    };
}

interface transmit_dashboard {
    compose: core_compose;
    dashboard_id: string;
    hashes: string[];
    http_request: string;
    logs: config_log[];
    name: string;
    os: core_server_os;
    path: core_vars_path;
    servers: store_servers;
    sockets: services_socket_application;
    terminal: string[];
    timeZone_offset: number;
}

interface transmit_receiver {
    [key:string]: receiver;
}

interface transmit_socket {
    socket: node_http_ClientRequest | node_http_ServerResponse | websocket_client;
    type: "http" | "ws";
}

interface transmit_socket_messageHandler {
    [key:string]: websocket_message_handler;
}

interface transmit_tlsOptions {
    fileFlag: {
        ca: boolean;
        crt: boolean;
        key: boolean;
    };
    options: {
        ca: string;
        cert: string;
        key: string;
    };
}

interface websocket_client extends node_tls_TLSSocket {
    addresses: transmit_addresses_socket;
    fragment: Buffer;
    frame: Buffer;
    frameExtended: number;
    handler: websocket_message_handler;
    hash: string;
    ping: (ttl:number, callback:(err:node_error, roundtrip:bigint) => void) => void;
    pong: {
        [key:string]: websocket_pong;
    };
    proxy: websocket_client;
    queue: Buffer[];
    role: "client"|"server";
    secure: boolean;
    server: string;
    status: type_socket_status;
    type: string;
    userAgent: string;
}

interface websocket_pty extends websocket_client {
    pty: pty;
}

interface websocket_event extends Event {
    data: string;
}

interface websocket_frame {
    extended: number;
    fin: boolean;
    len: number;
    mask: boolean;
    maskKey: Buffer;
    opcode: number;
    rsv1: boolean;
    rsv2: boolean;
    rsv3: boolean;
    startByte: number;
}

interface websocket_list {
    [key:string]: websocket_client;
}

interface websocket_meta {
    lengthExtended: number;
    lengthShort: number;
    mask: boolean;
    startByte: number;
}

interface websocket_pong {
    callback: (err:node_error, roundTrip:bigint) => void;
    start: bigint;
    timeOut: NodeJS.Timeout;
    timeOutMessage: node_error;
    ttl: bigint;
}

interface websocket_store {
    [key:string]: websocket_list;
}

interface websocket_test {
    find_socket: (direction:"in"|"out", hashString:string) => websocket_client;
    handler_client: websocket_message_handler;
    handler_server: websocket_message_handler;
    handshake: receiver;
    message: receiver;
}