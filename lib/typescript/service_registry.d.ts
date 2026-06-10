
//   service name                  - data type transmitted        - description
//   ---
// * dashboard-compose             - services_compose             - docker compose objects and service status
// * dashboard-compose-container   - services_compose_container   - changes from the user for docker compose objects
// * dashboard-compose-out         - string[]                     - streams stdout of docker spawn commands to the ui
// * dashboard-compose-variables   - store_string                 - a key/value list of custom docker compose template variables
// * dashboard-dns-input           - services_dns_input           - data submitted to trigger a dns query
// * dashboard-dns-output          - services_dns_output          - data response to a dns query
// * dashboard-dns-reverse         - services_dns_reverse         - data response to a reverse dns query
// * dashboard-file-system         - services_file_system         - file system list
// * dashboard-hash                - services_hash                - hash and base64 computational output
// * dashboard-http-test           - services_http_test           - response messaging for an HTTP test request
// * dashboard-log                 - services_log                 - a log entry
// * dashboard-message-inspection  - services_message_inspection  - view data passing to/from a web server or docker logs for a named container
// * dashboard-notes               - store_string                 - sends an updated notes value from UI for storage
// * dashboard-os-all              - core_server_os               - all the information regarding machine, application, process, and more
// * dashboard-os-devs             - services_os_devs             - only the device portion of dashboard-os-all
// * dashboard-os-disk             - services_os_disk             - only the disk portion of dashboard-os-all
// * dashboard-os-intr             - services_os_intr             - only the network interface data of dashboard-os-all
// * dashboard-os-main             - core_server_os               - only the hardware, application, and process information of dashboard-os-all
// * dashboard-os-proc             - services_os_proc             - only the process list information of dashboard-os-all
// * dashboard-os-serv             - services_os_serv             - only the service information of dashboard-os-all
// * dashboard-os-stcp             - services_os_sockets          - only the tcp socket information of dashboard-os-all
// * dashboard-os-sudp             - services_os_sockets          - only the udp socket information of dashboard-os-all
// * dashboard-os-user             - services_os_user             - only the user list information of dashboard-os-all
// * dashboard-ports-application   - services_ports_application   - a list of port information and associated processes managed from this application
// * dashboard-server-action       - services_server_action       - provides a user initiated action to execute against servers
// * dashboard-server-update       - services_server_update       - configuration details and port status for all servers
// * dashboard-socket-application  - services_socket_application  - status updates about sockets created by this application
// * dashboard-statistics-change   - services_statistics_change   - modifies control information respective to service statistical data collection
// * dashboard-statistics-data     - services_statistics_data     - resource consumption statistics
// * dashboard-status-clock        - services_status_clock        - current server clock time as epoch number
// * dashboard-terminal-resize     - services_terminal_resize     - resizes the shell such that text is formatted properly with invisible control characters
// * dashboard-udp-socket          - services_udp_socket          - sends information about the creation of a UDP socket
// * dashboard-udp-status          - string[]                     - notifies the user a UDP socket is created
// * dashboard-websocket-handshake - services_websocket_handshake - custom created message to create a test WebSocket connection
// * dashboard-websocket-message   - services_websocket_message   - parses the header of a WebSocket message frame header sufficient to respond to the message on a test socket
// * dashboard-websocket-status    - services_websocket_status    - sends connection establishment details for a test socket
// * test-browser                  - services_test_browser        - test automation messaging to the browser
type type_service = "dashboard-compose-container" | "dashboard-compose-out" | "dashboard-compose-variables" | "dashboard-compose" | "dashboard-dns-input" | "dashboard-dns-output" |
    "dashboard-dns-reverse" | "dashboard-file-system" | "dashboard-hash" | "dashboard-http-test" | "dashboard-log" | "dashboard-message-inspection" | "dashboard-notes" | "dashboard-os-all" |
    "dashboard-os-devs" | "dashboard-os-disk" | "dashboard-os-intr" | "dashboard-os-main" | "dashboard-os-proc" | "dashboard-os-serv" | "dashboard-os-stcp" | "dashboard-os-sudp" |
    "dashboard-os-user" | "dashboard-ports-application" | "dashboard-server-action" | "dashboard-server-update" | "dashboard-socket-application" | "dashboard-statistics-change" |
    "dashboard-statistics-data" | "dashboard-status-clock" | "dashboard-terminal-resize" | "dashboard-udp-socket" | "dashboard-udp-status" | "dashboard-websocket-handshake" |
    "dashboard-websocket-message" | "dashboard-websocket-status" | "test-browser";

type type_socket_data = services_compose | services_compose_container | services_dns_input | services_dns_output | services_dns_reverse | services_file_system | services_hash |
    services_http_test | services_log | services_message_inspection | services_os | services_os_devs | services_os_disk | services_os_intr | services_os_proc |  services_os_serv |
    services_os_sock | services_os_user | services_ports_application | services_server_action | services_server_update | services_socket_application | services_statistics_change |
    services_statistics_data | services_status_clock | services_terminal_resize | services_test_browser | services_udp_socket | services_websocket_handshake | services_websocket_message |
    services_websocket_status | store_string | string[];

type socket_data =
    {data: services_compose_container;   service: "dashboard-compose-container";} |
    {data: services_compose;             service: "dashboard-compose";} |
    {data: services_dns_input;           service: "dashboard-dns-input";} |
    {data: services_dns_output;          service: "dashboard-dns-output";} |
    {data: services_dns_reverse;         service: "dashboard-dns-reverse";} |
    {data: services_file_system;         service: "dashboard-file-system";} |
    {data: services_hash;                service: "dashboard-hash";} |
    {data: services_http_test;           service: "dashboard-http-test";} |
    {data: services_log;                 service: "dashboard-log";} |
    {data: services_message_inspection;  service: "dashboard-message-inspection";} |
    {data: services_os_devs;             service: "dashboard-os-devs";} |
    {data: services_os_disk;             service: "dashboard-os-disk";} |
    {data: services_os_intr;             service: "dashboard-os-intr";} |
    {data: services_os_proc;             service: "dashboard-os-proc";} |
    {data: services_os_serv;             service: "dashboard-os-serv";} |
    {data: services_os_sock;             service: "dashboard-os-stcp";} |
    {data: services_os_sock;             service: "dashboard-os-sudp";} |
    {data: services_os_user;             service: "dashboard-os-user";} |
    {data: services_os;                  service: "dashboard-os-all";} |
    {data: services_os;                  service: "dashboard-os-main";} |
    {data: services_ports_application;   service: "dashboard-ports-application";} |
    {data: services_server_action;       service: "dashboard-server-action";} |
    {data: services_server_update;       service: "dashboard-server-update";} |
    {data: services_socket_application;  service: "dashboard-socket-application";} |
    {data: services_statistics_change;   service: "dashboard-statistics-change";} |
    {data: services_statistics_data;     service: "dashboard-statistics-data";} |
    {data: services_status_clock;        service: "dashboard-status-clock";} |
    {data: services_terminal_resize;     service: "dashboard-terminal-resize";} |
    {data: services_test_browser;        service: "test-browser";} |
    {data: services_udp_socket;          service: "dashboard-udp-socket";} |
    {data: services_websocket_handshake; service: "dashboard-websocket-handshake";} |
    {data: services_websocket_message;   service: "dashboard-websocket-message";} |
    {data: services_websocket_status;    service: "dashboard-websocket-status";} |
    {data: store_string;                 service: "dashboard-compose-variables";} |
    {data: store_string;                 service: "dashboard-notes";} |
    {data: string[];                     service: "dashboard-compose-out";} |
    {data: string[];                     service: "dashboard-udp-status";};

interface services_compose {
    containers: store_compose;
    status: string;
    time: number;
    variables: store_string;
}

interface services_compose_container {
    action: type_dashboard_action;
    compose: string;
    id: string;
    location: string;
}

interface services_dns_input {
    names: string[];
    reverse: boolean;
    types: string;
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

interface services_dns_reverse {
    hostnames: store_string_list;
    reverse: true;
}

interface services_file_system {
    address: string;
    depth: number;
    directory_size: boolean;
    dirs: type_directory_item[];
    failures: string[];
    file: string;
    mime: string;
    parent: type_directory_item;
    path_style: "absolute" | "relative";
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

interface services_log {
    log: config_log;
    total: number;
}

interface services_message_inspection {
    count: number;
    direction: "in" | "out";
    max_size: number;
    message: string;
    service: string;
    type: "docker-container" | "web-server";
}

interface services_os {
    devs: services_os_devs;
    disk: services_os_disk;
    intr: services_os_intr;
    machine: {
        cpu: {
            arch: string;
            cores: number;
            endianness: string;
            frequency: number;
            name: string;
        };
        memory: {
            free: number;
            total: number;
        };
    };
    os: {
        env: store_string;
        hostname: string;
        name: string;
        path: string[];
        platform: string;
        release: string;
        type: string;
        uptime: number;
    };
    proc: services_os_proc;
    process: {
        admin: boolean;
        arch: string;
        argv: string[];
        cpuSystem: number;
        cpuUser: number;
        cwd: string;
        memory: {
            external: number;
            rss: number;
            V8: number;
        };
        pid: number;
        platform: string;
        ppid: number;
        uptime: number;
        versions: store_string;
    };
    serv: services_os_serv;
    stcp: services_os_sock;
    sudp: services_os_sock;
    time: number;
    user: services_os_user;
    user_account: {
        gid: number;
        homedir: string;
        uid: number;
    };
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
    data: supplemental_ports_application_item[];
    time: number;
}

interface services_server_action {
    action: type_dashboard_action;
    server: supplemental_server;
}

interface services_server_update {
    ports_used: {
        [key:string]: core_server_ports;
    };
    servers: store_servers;
}

interface services_socket_application {
    tcp: supplemental_socket_application_tcp[];
    time: number;
    udp: services_udp_socket[];
}

interface services_statistics_change {
    frequency: number;
    records: number;
}

interface services_statistics_data {
    containers: {
        [key:string]: supplemental_statistics_item;
    };
    duration: number;
    frequency: number;
    now: number;
    records: number;
}

interface services_status_clock {
    time_local: number;
    time_zulu: number;
}

interface services_terminal_resize {
    cols: number;
    hash: string;
    rows: number;
    section: type_dashboard_features;
    secure: "open" | "secure";
}

interface services_test_browser {
    index: number;
    magicString: string;
    result: test_assert[];
    store: test_primitive;
    suite_name: string;
    test: test_browserItem;
}

interface services_udp_socket {
    address_destination: string;
    address_source: string;
    handler: (message:Buffer) => void;
    hash: string;
    multicast_group: string;
    multicast_interface: string;
    multicast_membership: string;
    multicast_source: string;
    multicast_type: "membership" | "none" | "source";
    port_destination: number;
    port_source: number;
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
    encrypted: boolean;
    error: node_error | string;
}