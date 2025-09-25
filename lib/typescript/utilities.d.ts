
// cspell: words serv

interface configuration_compose {
    containers: store_compose;
    variables: store_string;
}

interface directory_data {
    atimeMs: number;
    ctimeMs: number;
    linkPath: string;
    linkType: "" | "directory" | "file";
    mode: number;
    mtimeMs: number;
    size: number;
}

interface directory_list extends Array<type_directory_item> {
    [index:number]: type_directory_item;
    failures?: string[];
}

interface dns_callback {
    "0": (err:node_error, records:type_dns_records) => void;
    "1": (err:node_error, records:type_dns_records) => void;
    "10": (err:node_error, records:type_dns_records) => void;
    "2": (err:node_error, records:type_dns_records) => void;
    "3": (err:node_error, records:type_dns_records) => void;
    "4": (err:node_error, records:type_dns_records) => void;
    "5": (err:node_error, records:type_dns_records) => void;
    "6": (err:node_error, records:type_dns_records) => void;
    "7": (err:node_error, records:type_dns_records) => void;
    "8": (err:node_error, records:type_dns_records) => void;
    "9": (err:node_error, records:type_dns_records) => void;
}

interface external_ports {
    list: type_external_port[];
    time: number;
}

interface file {
    mkdir: (config:file_mkdir) => void;
    read: (config:file_read) => void;
    remove: (config:file_remove) => void;
    stat: (config:file_stat) => void;
    write: (config:file_write) => void;
}

interface file_mkdir {
    callback: () => void;
    location: string;
}

interface file_read {
    callback: (file:Buffer) => void;
    location: string;
    no_file: () => void;
}

interface file_remove {
    callback: () => void;
    exclusions: string[];
    location: string;
}

interface file_stat {
    callback: (stats:node_fs_BigIntStats) => void;
    location: string;
    no_file: () => void;
}

interface file_write {
    callback: () => void;
    contents: Buffer | string;
    location: string;
}

interface hash_output {
    filePath: string;
    hash: string;
    size: number;
}

interface log {
    application: (config:config_log) => void;
    shell: (input:string[], summary?:boolean) => void;
}

interface server {
    config: services_server;
    sockets: services_socket[];
    status: server_ports;
}

interface server_content {
    [key:string]: (property:type_server_property, parent:HTMLElement) => void;
}

interface server_instance extends node_net_Server {
    name?: string;
    secure?: boolean;
}

interface server_meta {
    [key:string]: server_meta_item;
}

interface server_meta_item {
    server: {
        open: server_instance;
        secure: server_instance;
    };
    sockets: {
        open: websocket_client[];
        secure: websocket_client[];
    };
}

interface server_os {
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
    process: {
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
    proc: services_os_proc;
    serv: services_os_serv;
    sock: services_os_sock;
    time: number;
    user: services_os_user;
    user_account: {
        gid: number;
        homedir: string;
        uid: number;
    };
}

interface server_os_memoryUsage {
    arrayBuffers: number;
    external: number;
    heapTotal: number;
    heapUsed: number;
    rss: number;
}

interface server_ports {
    open?: number;
    secure?: number;
}

interface store_arrays {
    [key:string]: Array<any>;
}

interface store_children {
    [key:string]: node_childProcess_ChildProcess;
}

interface store_children_os {
    [key:string]: os_child;
}

interface store_compose {
    [key:string]: services_docker_compose;
}

interface store_elements {
    [key:string]: HTMLElement;
}

interface store_flag {
    [key:string]: boolean;
}

interface store_function {
    [key:string]: () => void;
}

interface store_number {
    [key:string]: number;
}

interface store_os_difference {
    [key:string]: config_os_comparison;
}

interface store_ports {
    [key:string]: server_ports;
}

interface store_server_config {
    [key:string]: services_server;
}

interface store_servers {
    [key:string]: server;
}

interface store_sockets {
    [key:string]: websocket_client[];
}

interface store_string {
    [key:string]: string;
}

interface store_string_list {
    [key:string]: string[];
}

interface store_test_list {
    [key:string]: test_list;
}

interface string_detect {
    confidence: number;
    encoding: string;
}

interface terminal {
    cols: number;
    rows: number;
    shell: string;
}

interface vars {
    commands: store_string;
    compose: configuration_compose;
    css: {
        basic: string;
        complete: string;
    };
    dashboard: string;
    environment: {
        date_commit: number;
        hash: string;
    };
    hashes: string[];
    http_request: string;
    interfaces: string[];
    intervals: store_number;
    logs: services_dashboard_status[];
    os: server_os;
    path: vars_path;
    server_meta: server_meta;
    servers: store_servers;
    start_time: bigint;
    terminal: string[];
    test: {
        browser_args: string[];
        browser_child: node_childProcess_ChildProcess;
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
    timeZone_offset: number;
}

interface vars_path {
    compose: string;
    compose_empty: string;
    project: string;
    sep: "/" | "\\";
    servers: string;
}

interface windows_drives {
    DriveLetter: string;
    Size: number;
    SizeRemaining: number;
}