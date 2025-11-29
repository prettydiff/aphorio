
// cspell: words opencontainers, serv

interface services_action_compose {
    action: type_dashboard_action;
    compose: string;
}

interface services_action_server {
    action: type_dashboard_action;
    server: services_server;
}

interface services_compose_container {
    action: type_dashboard_action;
    compose: string;
    id: string;
    location: string;
}

interface services_docker_compose_publishers {
    Protocol: "tcp"|"udp";
    PublishedPort: number;
    TargetPort: number;
    URL: string;
}

interface services_docker_event {
    action: "create" | "destroy" | "die" | "kill" | "start" | "stop";
    attributes: {
        execID: string;
        exitCode?: number;
        image: string;
        name: string;
        "org.opencontainers.image.source": string;
    };
    id: string;
    service: string;
    time: string;
    type: string;
}

interface services_dns_input {
    names: string[];
    reverse: boolean;
    types: string;
}

interface services_dns_reverse {
    hostnames: store_string_list;
    reverse: true;
}

interface services_dns_output {
    [key:string]: {
        "A"?: type_dns_records;
        "AAAA"?: type_dns_records;
        "ANY"?: type_dns_records;
        "CAA"?: type_dns_records;
        "CNAME"?: type_dns_records;
        "MX"?: type_dns_records;
        "NAPTR"?: type_dns_records;
        "NS"?: type_dns_records;
        "PTR"?: type_dns_records;
        "SOA"?: type_dns_records;
        "SRV"?: type_dns_records;
        "TXT"?: type_dns_records;
    };
}

interface services_fileSystem {
    address: string;
    dirs: type_directory_item[];
    failures: string[];
    file: string;
    parent: type_directory_item;
    search: string;
    sep: "/"|"\\";
}

interface services_hash {
    algorithm: string;
    base64: boolean;
    digest: "base64" | "hex";
    size: number;
    type: type_hash_input;
    value: string;
}

interface services_http {
    connect: http_action;
    delete: http_action;
    get: http_action;
    head: http_action;
    post: http_action;
    put: http_action;
}

interface services_http_test {
    body: string;
    encryption: boolean;
    headers: string;
    stats: {
        chunks: {
            chunked: boolean;
            count: number;
        };
        request: {
            size_body: number;
            size_header: number;
        };
        response: {
            size_body: number;
            size_header: number;
        };
        time: number;
    };
    timeout: number;
    uri: string;
}

interface services_os_devs {
    data: os_devs[];
    time: number;
}

interface services_os_disk {
    data: os_disk[];
    time: number;
}

interface services_os_intr {
    data: NodeJS.Dict<node_os_NetworkInterfaceInfo[]>;
    time: number;
}

interface services_os_proc {
    data: os_proc[];
    time: number;
}

interface services_os_serv {
    data: os_serv[];
    time: number;
}

interface services_os_sock {
    data: os_sock[];
    time: number;
}

interface services_os_user {
    data: os_user[];
    time: number;
}

interface services_server {
    activate: boolean;
    block_list?: {
        host: string[];
        ip: string[];
        referrer: string[];
    };
    domain_local: string[];
    encryption: type_encryption;
    http?: {
        delete?: string;
        post?: string;
        put?: string;
    };
    id: string;
    name: string;
    ports: server_ports;
    redirect_asset?: {
        [key:string]: store_string;
    };
    redirect_domain?: {
        [key:string]: [string, number];
    };
    single_socket?: boolean;
    temporary?: boolean;
}

interface services_socket_application {
    list: Array<services_socket_application_item>;
    time: number;
}

interface services_socket_application_item {
    address: transmit_addresses_socket;
    encrypted: boolean;
    hash: string;
    proxy: string;
    role: "client" | "server";
    server_id: string;
    server_name: string;
    type: string;
    userAgent: string;
}

interface services_status_clock {
    time_local: number;
    time_zulu: number;
}

interface services_statistics_data {
    containers: {
        [key:string]: services_statistics_item;
    };
    frequency: number;
    now: number;
    records: number;
}

interface services_statistics_change {
    frequency: number;
    records: number;
}

interface services_statistics_facet {
    data: number[];
    labels: number[];
}

interface services_statistics_item {
    cpu: services_statistics_facet;
    disk_in: services_statistics_facet;
    disk_out: services_statistics_facet;
    mem: services_statistics_facet;
    net_in: services_statistics_facet;
    net_out: services_statistics_facet;
    threads: services_statistics_facet;
}

interface services_terminal {
    resize: receiver;
    shell: (socket:websocket_pty, terminal:terminal) => void;
}

interface services_terminal_request {
    secure: "open" | "secure";
}

interface services_terminal_resize {
    cols: number;
    hash: string;
    rows: number;
    secure: "open" | "secure";
}

interface services_testBrowser {
    index: number;
    magicString: string;
    result: test_assert[];
    store: test_primitive;
    test: test_browserItem;
}

interface services_websocket_handshake {
    encryption: boolean;
    message: string[];
    timeout: number;
}

interface services_websocket_message {
    frame: websocket_frame;
    message: string;
}

interface services_websocket_status {
    connected: boolean;
    error: node_error | string;
}

interface services_youtubeDownload {
    address: string;
    options: string;
    type: type_youtubeDownload;
}

interface services_youtubeStatus {
    pid: number;
    status: string;
    time: string;
}