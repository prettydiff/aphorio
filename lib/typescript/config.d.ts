
import { Terminal } from "@xterm/xterm";

declare global {
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
        callback: (dir:core_directory_list) => void;
        depth: number;
        directory_size: boolean;
        exclusions: string[];
        parent: boolean;
        path: string;
        relative: boolean;
        search: string;
        symbolic: boolean;
    }

    interface config_directory_readdir {
        name_rel: string;
        parent_index: number;
        parent_item: boolean;
        path: string;
        path_drive: string;
        stat_obj: core_directory_data;
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
        section: type_dashboard_sections | "certificate" | "startup";
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
        callback: (hashOutput:core_hash_output) => void;
        digest: "base64-output" | "base64" | "hex";
        hash_input_type: type_hash_input;
        section: type_dashboard_sections | "startup";
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

    interface config_http {
        accept: string;
        body: Buffer;
        domain: string;
        encryption: "open" | "secure";
        fragment: string;
        headers: string[];
        host_index: number;
        http_test: boolean;
        http_upgrade: boolean;
        method: type_http_method;
        origin: string;
        port: number;
        proxy_type: "encryption" | "none" | "proxy_resource" | "proxy_server" | "resource";
        query: string;
        range: string;
        referrer: string;
        resource: string;
        resource_absolute: string;
        resource_size: number;
        resource_type: "directory" | "file" | "other";
        user_agent: string;
        websocket_key: string;
        websocket_nonce: string;
        websocket_type: string;
    }

    interface config_http_request_output {
        chunked: boolean;
        chunks: number;
        encrypted_proxy: boolean;
        encrypted_self: boolean;
        error: node_error;
        response_body_raw: string;
        response_headers: string;
        url: URL;
    }

    interface config_log {
        error: node_childProcess_ExecException | node_error | TypeError;
        message: string;
        origin: string;
        section: type_dashboard_sections | "certificate" | "dashboard" | "startup";
        status: type_dashboard_status;
        time: number;
    }

    interface config_log_start {
        conflict: boolean;
        name: string;
        type: "open" | "secure" | "tcp" | "udp";
        value: number;
    }

    interface config_os_comparison {
        dict: boolean;
        lists: {
            new: object[] | object;
            old: object[] | object;
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

    interface config_proxy_create {
        body: Buffer;
        encrypted: boolean;
        headers: string[];
        host: string;
        host_index: number;
        identifier: string;
        method: type_http_method | "";
        port: number;
        resource: string;
        server_hash: string;
        socket: websocket_client;
        user_agent: string;
    }

    interface config_resize {
        node: HTMLElement;
        section: type_dashboard_features;
        shell: Terminal;
    }

    interface config_spawn {
        args: string[];
        callback: (stderr:string, stdout:string, error:node_childProcess_ExecException) => void;
        command: string;
        recurse: number;
        timeout?: number;
    }

    interface config_terminal {
        cols: number;
        rows: number;
        shell: string;
    }

    interface config_validate_serverKeys {
        name: number | "block_list" | "method" | "ports" | "redirect_asset" | "redirect_domain";
        required_name: boolean;
        required_property: boolean;
        supported: string[];
        type: "array" | "method" | "number" | "proxy" | "store" | "string";
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
        userAgent: string;
    }

    interface config_websocket_server {
        callback: (name:string, secure:"open"|"secure") => void;
        name: string;
        options: transmit_tlsOptions;
    }
}