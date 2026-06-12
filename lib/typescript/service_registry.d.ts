

type socket_data =
    {data: services_compose_container;   service: "services_compose_container";} |   // changes from the user for docker compose objects
    {data: services_compose_out;         service: "services_compose_out";} |         // streams stdout of docker spawn commands to the ui
    {data: services_compose_variables;   service: "services_compose_variables";} |   // a key/value list of custom docker compose template variables
    {data: services_compose;             service: "services_compose";} |             // docker compose objects and service status
    {data: services_dns_input;           service: "services_dns_input";} |           // data submitted to trigger a dns query
    {data: services_dns_output;          service: "services_dns_output";} |          // data response to a dns query
    {data: services_dns_reverse;         service: "services_dns_reverse";} |         // data response to a reverse dns query
    {data: services_file_system;         service: "services_file_system";} |         // file system list
    {data: services_hash;                service: "services_hash";} |                // hash and base64 computational output
    {data: services_http_test;           service: "services_http_test";} |           // response messaging for an HTTP test request
    {data: services_log;                 service: "services_log";} |                 // a log entry
    {data: services_message_inspection;  service: "services_message_inspection";} |  // view data passing to/from a web server or docker logs for a named container
    {data: services_notes;               service: "services_notes";} |               // sends an updated notes value from UI for storage
    {data: services_os_devs;             service: "services_os_devs";} |             // only the device portion of services_os_all
    {data: services_os_disk;             service: "services_os_disk";} |             // only the disk portion of services_os_all
    {data: services_os_intr;             service: "services_os_intr";} |             // only the network interface data of services_os_all
    {data: services_os_proc;             service: "services_os_proc";} |             // only the process list information of services_os_all
    {data: services_os_serv;             service: "services_os_serv";} |             // only the service information of services_os_all
    {data: services_os_sock;             service: "services_os_stcp";} |             // only the tcp socket information of services_os_all
    {data: services_os_sock;             service: "services_os_sudp";} |             // only the udp socket information of services_os_all
    {data: services_os_user;             service: "services_os_user";} |             // only the user list information of services_os_all
    {data: services_os;                  service: "services_os_all";} |              // all the information regarding machine, application, process, and more
    {data: services_os;                  service: "services_os_main";} |             // only the hardware, application, and process information of services_os_all
    {data: services_ports_application;   service: "services_ports_application";} |   // a list of port information and associated processes managed from this application
    {data: services_server_action;       service: "services_server_action";} |       // provides a user initiated action to execute against servers
    {data: services_server_update;       service: "services_server_update";} |       // configuration details and port status for all servers
    {data: services_socket_application;  service: "services_socket_application";} |  // status updates about sockets created by this application
    {data: services_statistics_change;   service: "services_statistics_change";} |   // modifies control information respective to service statistical data collection
    {data: services_statistics_data;     service: "services_statistics_data";} |     // resource consumption statistics
    {data: services_status_clock;        service: "services_status_clock";} |        // current server clock time as epoch number
    {data: services_terminal_resize;     service: "services_terminal_resize";} |     // resizes the shell such that text is formatted properly with invisible control characters
    {data: services_test_browser;        service: "services_test_browser";} |        // test automation messaging to the browser
    {data: services_udp_socket;          service: "services_udp_socket";} |          // sends information about the creation of a UDP socket
    {data: services_udp_status;          service: "services_udp_status";} |          // notifies the user a UDP socket is created
    {data: services_websocket_handshake; service: "services_websocket_handshake";} | // custom created message to create a test WebSocket connection
    {data: services_websocket_message;   service: "services_websocket_message";} |   // parses the header of a WebSocket mes sage frame header sufficient to respond to the message on a test socket
    {data: services_websocket_status;    service: "services_websocket_status";};     // sends connection establishment details for a test socket

type services_compose_out = string[];
type services_compose_variables = store_string;
type services_udp_status = string[];

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
    children: boolean;
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

interface services_notes {
    notes: string;
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