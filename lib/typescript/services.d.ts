import { IModes } from "@xterm/xterm";

// cspell: words opencontainers, serv

declare global {

    interface services_action_compose {
        action: type_dashboard_action;
        compose: services_docker_compose;
    }

    interface services_action_server {
        action: type_dashboard_action;
        server: services_server;
    }

    interface services_clock {
        time_local: number;
        time_zulu: number;
    }

    interface services_dashboard {
        "activate": type_server_action;
        "add": type_server_action;
        "deactivate": type_server_action;
        "destroy": type_server_action;
        "modify": type_server_action;
    }

    interface services_dashboard_activate {
        name: string;
        ports: server_ports;
    }

    interface services_dashboard_status {
        action: type_dashboard_action;
        configuration: type_dashboard_config;
        message: string;
        status: type_dashboard_status;
        time: number;
        type: type_dashboard_type;
    }

    interface services_dashboard_terminal {
        modes: IModes;
        text: string;
    }

    interface services_docker_compose {
        command: string;
        compose: string;
        createdAt: string;
        description: string;
        exitCode: number;
        health: string;
        id: string;
        image: string;
        labels: string[];
        localVolumes: number;
        mounts: string[];
        name: string;
        names: string[];
        networks: string[];
        ports: string[];
        project: string;
        publishers: services_docker_compose_publishers[];
        runningFor: string;
        service: string;
        size: number;
        state: type_docker_state;
        status: string;
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

    interface services_os_all {
        interfaces: services_os_intr;
        machine: {
            cores: number;
            memory: {
                free: number;
                total: number;
            };
        };
        os: {
            uptime: number;
        };
        process: {
            cpuSystem: number;
            cpuUser: number;
            memory: {
                external: number;
                rss: number;
                V8: number;
            };
            uptime: number;
        };
        processes: services_os_proc;
        services: services_os_serv;
        sockets: services_os_sock;
        storage: services_os_disk;
        time: number;
        users: services_os_user;
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
        data: os_service[];
        time: number;
    }

    interface services_os_sock {
        data: os_sockets[];
        time: number;
    }

    interface services_os_user {
        data: os_user[];
        time: number;
    }

    interface services_processKill {
        process: number;
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
        modification_name?: string;
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

    interface services_socket {
        address: transmit_addresses_socket;
        encrypted: boolean;
        hash: string;
        proxy: string;
        role: "client" | "server";
        server: string;
        time: number;
        type: string;
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
}