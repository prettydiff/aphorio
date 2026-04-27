
// cspell: words Perc, serv, stcp, sudp

interface core_compose_commands {
    activate: string;
    add: string;
    deactivate: string;
    destroy: string;
    list: string;
    modify: string;
    update: string;
}

interface core_compose_container {
    compose: string;
    created: number;
    description: string;
    id: string;
    image: string;
    license: string;
    location: string;
    name: string;
    ports: type_docker_ports;
    state: type_docker_state;
    status: string;
    version: string;
}

interface core_compose_properties {
    Command: string;
    CreatedAt: string; // date
    ExitCode: number;
    ID: string;
    Image: string;
    Labels: string;
    LocalVolumes: string;
    Mounts: string;
    Name: string;
    Names: string;
    Networks: string;
    Ports: string;
    Project: string;
    Publishers: {
        Protocol: "tcp" | "udp";
        PublishedPort: number;
        TargetPort: number;
        URL: string;
    }[];
    RunningFor: string;
    Service: string;
    Size: string;
    State: type_docker_state;
    Status: string;
}

interface core_directory_data {
    atimeMs: number;
    ctimeMs: number;
    linkPath: string;
    linkType: type_file | "";
    mode: number;
    mtimeMs: number;
    size: number;
}

interface core_directory_list extends Array<type_directory_item> {
    [index:number]: type_directory_item;
    failures?: string[];
    parent?: type_directory_item;
}

interface core_docker_status {
    BlockIO: string;
    Container: string;
    CPUPerc: string;
    ID: string;
    MemPerc: string;
    MemUsage: string;
    Name: string;
    NetIO: string;
    PIDs: number;
}

interface core_external_ports {
    list: type_external_port[];
    time: number;
}

interface core_hash_output {
    filePath: string;
    hash: string;
    size: number;
}

interface core_module_docker {
    commands: core_compose_commands;
    list: (callback:() => void) => void;
    receive: receiver;
    resize: receiver;
    shell: pty;
    shell_start: () => void;
    variables: (variables:store_string, socket:websocket_client) => void;
}

interface core_module_file {
    mkdir: (config:config_file_mkdir) => void;
    read: (config:config_file_read) => void;
    remove: (config:config_file_remove) => void;
    stat: (config:config_file_stat) => void;
    write: (config:config_file_write) => void;
}

interface core_module_log {
    application: (config:config_log) => void;
    shell: (input:string[], summary?:boolean) => void;
}

interface core_module_spawn {
    close: () => void;
    command: string;
    data_stderr: (buf:Buffer) => void;
    data_stdout: (buf:Buffer) => void;
    error: (err:node_childProcess_ExecException) => void;
    execute: () => void;
    spawn: node_childProcess_ChildProcess;
    stderr: string[];
    stdout: string[];
    type: string;
}

interface core_module_statistics {
    change: (data:socket_data) => void;
    data: () => void;
}

interface core_module_udp {
    closed: () => void;
    create: (socket_data:socket_data, callback:(socket:transmit_udp) => void) => void;
    handler: (socket:transmit_udp, handler:(message:Buffer) => void) => void;
    send: (socket:transmit_udp, message_item:Array<number>|Buffer|bigint|number|string) => void;
}

interface core_module_universal {
    bytes: () => number;
    bytes_big: () => bigint;
    capitalize: () => string;
    commas: () => string;
    dateTime: (date:boolean, timeZone_offset:number) => string;
    time_elapsed: () => string;
}

interface core_server_child_input {
    encryption: boolean;
    id: string;
    path_process: string;
    port:number;
    token: string;
}

interface core_server_child_output {
    encryption: boolean;
    id: string;
    pid: number;
    port: number;
}

interface core_server_content {
    [key:string]: (property:type_server_property, parent:HTMLElement) => void;
}

interface core_server_instance extends node_net_Server {
    id?: string;
    secure?: boolean;
}

interface core_server_os {
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

interface core_server_ports {
    open?: number;
    secure?: number;
}

interface core_servers_file {
    "compose-variables": store_string;
    dashboard_id: string;
    servers: store_server_config;
    stats: {
        frequency: number;
        records: number;
    };
}

interface core_spawn_options {
    cwd?: string;
    env?: store_string;
    error?: (err:node_childProcess_ExecException) => void;
    shell?: string;
    type?: string;
}

interface core_spawn_output {
    stderr: string;
    stdout: string;
    type: string;
}

interface core_start_tasks {
    [key:string]: {
        label: string;
        task: () => void;
    };
}

interface core_string_detect {
    confidence: number;
    encoding: string;
}

interface core_vars {
    commands: os_vars;
    data: {
        compose_variables: store_string;
        containers: store_compose;
        logs: config_log[];
        ports_application: services_ports_application_item[];
        servers: store_servers;
        sockets_tcp: services_socket_application_tcp[];
        sockets_udp: services_udp_socket[];
    };
    data_meta: {
        compose_time: number;
        // time of last port update
        ports_application: number;
        // time of last sockets update
        sockets: number;
    };
    data_store: {
        // storage of actual web server objects
        server: {
            [key:string]: {
                open: core_server_instance;
                secure: core_server_instance;
            };
        };
        // server certificates
        server_certs: {
            [key:string]: transmit_tlsCerts;
        };
        // actual ports in use by web servers
        server_ports: {
            [key:string]: core_server_ports;
        };
        // storage of application managed tcp sockets
        sockets_tcp: {
            [key:string]: {
                open: websocket_client[];
                secure: websocket_client[];
            };
        };
        // storage of application managed udp sockets
        sockets_udp: transmit_udp[];
    };
    environment: {
        compose_status: string;
        // css for generated web pages and file system display
        css_basic: string;
        // css for the dashboard application
        css_complete: string;
        dashboard_id: string;
        dashboard_page: string;
        date_commit: number;
        features: {
            "application-logs": boolean;
            "compose-containers": boolean;
            "devices": boolean;
            "disks": boolean;
            "dns-query": boolean;
            "file-system": boolean;
            "hash": boolean;
            "interfaces": boolean;
            "os-machine": boolean;
            "ports-application": boolean;
            "processes": boolean;
            "servers-web": boolean;
            "services": boolean;
            "sockets-application-tcp": boolean;
            "sockets-application-udp": boolean;
            "sockets-os-tcp": boolean;
            "sockets-os-udp": boolean;
            "statistics": boolean;
            "terminal": boolean;
            "test-http": boolean;
            "test-websocket": boolean;
            "udp-socket": boolean;
            "users": boolean;
        };
        file: boolean;
        hash: string;
        hashes: string[];
        http_request: string;
        interfaces: string[];
        loading: boolean;
        logs: {
            max: number;
            total: number;
        };
        name: string;
        start_time: bigint;
        terminal: string[];
        timeZone_offset: number;
        version: string;
    };
    options: {
        "browser": string;
        "list": string;
        "no-color": boolean;
        "no-exit": boolean;
        "port-open": number;
        "port-secure": number;
        "stop-on-fail": boolean;
        "test": boolean;
        "test_verbose": boolean;
    };
    os: core_server_os;
    path: core_vars_path;
    stats: {
        children: number;
        containers: {
            [key:string]: services_statistics_item;
        };
        duration: number;
        frequency: number;
        net_in: number;
        net_out: number;
        now: number;
        records: number;
    };
    test: {
        browser_args: string[];
        browser_child: core_module_spawn;
        browser_start: boolean;
        counts: {
            [key:string]: test_counts;
        };
        index: number;
        list: test_list;
        magicString: string;
        store: test_primitive;
        test_browser: string;
        testing: boolean;
        total_assertions: number;
        total_assertions_fail: number;
        total_lists: number;
        total_tests: number;
        total_tests_fail: number;
        total_tests_skipped: number;
        total_time_end: bigint;
        total_time_start: bigint;
    };
    text: store_string;
}

interface core_vars_path {
    cgroup: string;
    compose: string;
    compose_empty: string;
    node: string;
    process: string;
    project: string;
    sep: "/" | "\\";
    servers: string;
}

interface core_windows_drives {
    DriveLetter: string;
    Size: number;
    SizeRemaining: number;
}