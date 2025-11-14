
interface config_certificate {
    callback: () => void;
    days: number;
    id: string;
    selfSign: boolean;
}

interface config_core {
    close?: (event:Event) => void;
    message: (event:websocket_event) => void;
    open?: (event:Event) => void;
    type: string;
}

interface config_dashboardObject {
    path: string;
    search: string;
    socket: websocket_client;
}

interface config_directory {
    callback: (dir:directory_list | string[]) => void;
    depth: number;
    exclusions: string[];
    mode: type_directory_mode;
    path: string;
    relative: boolean;
    search: string;
    symbolic: boolean;
}

interface config_file_mkdir {
    callback: (location:string, identifier:string) => void;
    identifier?: string;
    location: string;
    section: type_dashboard_sections | "startup";
}

interface config_file_read {
    callback: (file:Buffer, location:string, identifier:string) => void;
    identifier?: string;
    location: string;
    no_file: (location:string, identifier:string) => void;
    section: type_dashboard_sections | "startup";
}

interface config_file_remove {
    callback: (location:string, identifier:string) => void;
    exclusions: string[];
    identifier?: string;
    location: string;
    section: type_dashboard_sections | "startup";
}

interface config_file_stat {
    callback: (stats:node_fs_BigIntStats, location:string, identifier:string) => void;
    identifier?: string;
    location: string;
    no_file: (location:string, identifier:string) => void;
    section: type_dashboard_sections | "startup";
}

interface config_file_write {
    callback: (location:string, identifier:string) => void;
    contents: Buffer | string;
    identifier?: string;
    location: string;
    section: type_dashboard_sections | "startup";
}

interface config_hash {
    algorithm: string;
    callback: (hashOutput:hash_output) => void;
    digest: "base64-output" | "base64" | "hex";
    hash_input_type: type_hash_input;
    section: type_dashboard_sections;
    source: Buffer | string;
}

interface config_html {
    content: Buffer|string[];
    content_type: string;
    core: boolean;
    page_title: string;
    script: () => void;
    status: number;
    template: boolean;
}

interface config_log {
    error: node_childProcess_ExecException | node_error | TypeError;
    message: string;
    section: type_dashboard_sections | "dashboard" | "startup";
    status: type_dashboard_status;
    time: number;
}

interface config_os_comparison {
    dict: boolean;
    lists: {
        new: Array<object> | object;
        old: Array<object> | object;
    };
    messages: {
        child: {
            new: (item:object, name?:string) => string;
            old: (item:object, name?:string) => string;
        };
        no_child: (item:object, name?:string) => string;
        parent: {
            new: (item:object, name?:string) => string;
            old: (item:object, name?:string) => string;
        };
    };
    properties: {
        child: string;
        parent: string;
    };
}

interface config_spawn {
    args: string[];
    callback: (stderr:string, stdout:string, error:node_childProcess_ExecException) => void;
    command: string;
    recurse: number;
    timeout?: number;
}

interface config_validate_serverKeys {
    name: "block_list" | "http" | "ports" | "redirect_asset" | "redirect_domain";
    required_name: boolean;
    required_property: boolean;
    supported: string[];
    type: "array" | "number" | "path" | "store" | "string";
}

interface config_websocket_create {
    callback: (socket:websocket_client, timeout:bigint, error?:node_error) => void;
    handler: websocket_message_handler;
    hash: string;
    headers: string[];
    ip: string;
    port: number;
    proxy: websocket_client;
    resource: string;
    secure: boolean;
    server: string;
    timeout: number;
    type: string;
}

interface config_websocket_extensions {
    callback: (socket:websocket_client, timeout:bigint) => void;
    handler: websocket_message_handler;
    identifier: string;
    proxy: websocket_client;
    role: "client"|"server";
    server: string;
    single_socket: boolean;
    socket: websocket_client;
    temporary: boolean;
    timeout: bigint;
    type: string;
}

interface config_websocket_server {
    callback: (name:string, secure:"open"|"secure") => void;
    name: string;
    options: transmit_tlsOptions;
}