
// cspell: words opencontainers, serv, TLSA

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

interface services_dns_callback {
    "0": (err:node_error, records:type_dns_records) => void;
    "1": (err:node_error, records:type_dns_records) => void;
    "10": (err:node_error, records:type_dns_records) => void;
    "11": (err:node_error, records:type_dns_records) => void;
    "2": (err:node_error, records:type_dns_records) => void;
    "3": (err:node_error, records:type_dns_records) => void;
    "4": (err:node_error, records:type_dns_records) => void;
    "5": (err:node_error, records:type_dns_records) => void;
    "6": (err:node_error, records:type_dns_records) => void;
    "7": (err:node_error, records:type_dns_records) => void;
    "8": (err:node_error, records:type_dns_records) => void;
    "9": (err:node_error, records:type_dns_records) => void;
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
        "TLSA"?: type_dns_records;
        "TXT"?: type_dns_records;
    };
}

interface services_fileSystem {
    address: string;
    dirs: type_directory_item[];
    failures: string[];
    file: string;
    mime: string;
    parent: type_directory_item;
    search: string;
    sep: "/"|"\\";
}

interface services_hash {
    algorithm: string;
    base64: boolean;
    digest: "base64" | "hex";
    size: number;
    time: number;
    type: type_hash_input;
    value: string;
}

interface services_http {
    connect: http_action;
    get: http_action;
    head: http_action;
    options: http_action;
    trace: http_action;
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

interface services_ports_application {
    data: services_ports_application_item[];
    time: number;
}

interface services_ports_application_item {
    hash: string;
    port: number;
    service: "container" | "server";
    service_name: string;
    type: "tcp" | "udp";

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
    id: string;
    method?: {
        delete?: services_server_method;
        patch?: services_server_method;
        post?: services_server_method;
        put?: services_server_method;
    };
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
    upgrade: boolean;
}

interface services_server_method {
    address: string;
    port: number;
}

interface services_socket_application {
    tcp: Array<services_socket_application_tcp>;
    time: number;
    udp: Array<services_udp_socket>;
}

interface services_socket_application_tcp {
    address: transmit_addresses_socket;
    encrypted: boolean;
    hash: string;
    proxy: string;
    role: "client" | "server";
    server_id: string;
    server_name: string;
    time: number;
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
    duration: number;
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
    labels: string[];
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
    shell: (socket:websocket_pty, config:config_terminal) => void;
}

interface services_terminal_request {
    secure: "open" | "secure";
}

interface services_terminal_resize {
    cols: number;
    hash: string;
    rows: number;
    section: type_dashboard_features;
    secure: "open" | "secure";
}

interface services_testBrowser {
    index: number;
    magicString: string;
    result: test_assert[];
    store: test_primitive;
    test: test_browserItem;
}

interface services_udp_socket {
    address_local: string;
    address_remote: string;
    handler: (message:Buffer) => void;
    hash: string;
    multicast_group: string;
    multicast_interface: string;
    multicast_membership: string;
    multicast_source: string;
    multicast_type: "membership" | "none" | "source";
    port_local: number;
    port_remote: number;
    role: "client" | "server";
    time: number;
    type: "ipv4" | "ipv6";
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