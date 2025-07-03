// cspell: words serv

import { Terminal } from "@xterm/xterm";

declare global {
    interface Document {
        activeElement: HTMLElement;
        getElementsByAttribute: (name:string, value:string) => HTMLElement[];
        getElementsByText: (textValue:string, caseSensitive?:boolean) => HTMLElement[];
        getNodesByType: (typeValue:number | string) => Node[];
        highlight: (element:HTMLElement) => void;
        removeHighlight: (element:HTMLElement) => void;
    }

    /**
     * Extends the DOM's Element interface to include custom methods.
     */
    interface Element {
        addClass: (className:string) => void;
        appendText: (text:string, empty?:boolean) => void;
        getAncestor: (identifier:string, selector:type_selector) => HTMLElement;
        getElementsByAttribute: (name:string, value:string) => HTMLElement[];
        getElementsByText: (textValue:string, caseSensitive?:boolean) => HTMLElement[];
        getNodesByType: (typeValue:number | string) => Node[];
        highlight: () => void;
        lowName: () => string;
        parentNode: HTMLElement;
        removeClass: (className:string) => void;
        removeHighlight: () => void;
    }

    interface String {
        capitalize: () => string;
    }

    interface Number {
        bytes: (input?:number) => string;
        bytesLong: () => string;
        commas: () => string;
        dateTime: (date:boolean) => string;
        time: () => string;
    }

    interface FocusEvent {
        target: HTMLElement;
    }
    interface KeyboardEvent {
        target: HTMLElement;
    }
    interface MouseEvent {
        target: HTMLElement;
    }
    interface TouchEvent {
        target: HTMLElement;
    }

    interface map_messages {
        [key:string]: (data_item:socket_data) => void;
    }

    interface module_compose {
        activePorts: (name_server:string) => HTMLElement;
        cancelVariables: (event:MouseEvent) => void;
        container: (config:services_docker_compose) => void;
        create: (event:MouseEvent) => void;
        destroyContainer: (config:services_docker_compose) => void;
        editVariables: () => void;
        getTitle: (textArea:HTMLTextAreaElement) => string;
        init: () => void;
        list: (type:"containers"|"variables") => void;
        message: (event:MouseEvent) => void;
        nodes: {
            containers_list: HTMLElement;
            containers_new: HTMLButtonElement;
            variables_list: HTMLElement;
            variables_new: HTMLButtonElement;
        };
        validateContainer: (event:FocusEvent|KeyboardEvent) => void;
        validateVariables: (event:FocusEvent|KeyboardEvent) => void;
    }

    interface module_dns {
        init: () => void;
        nodes: {
            hosts: HTMLInputElement;
            output: HTMLTextAreaElement;
            resolve: HTMLButtonElement;
            types: HTMLInputElement;
        };
        receive: (data_item:socket_data) => void;
        resolve: (event:MouseEvent) => void;
    }

    interface module_fileSystem {
        init: () => void;
        key: (event:KeyboardEvent) => void;
        nodes: {
            content: HTMLElement;
            failures: HTMLElement;
            output: HTMLElement;
            path: HTMLInputElement;
            search: HTMLInputElement;
            summary: HTMLElement;
        };
        receive: (data_item:socket_data) => void;
        send: (event:FocusEvent|KeyboardEvent) => void;
    }

    interface module_hash {
        init: () => void;
        nodes: {
            algorithm: HTMLSelectElement;
            base64: HTMLInputElement;
            button: HTMLButtonElement;
            digest: HTMLInputElement;
            file: HTMLInputElement;
            hash: HTMLInputElement;
            hex: HTMLInputElement;
            output: HTMLTextAreaElement;
            size: HTMLElement;
            source: HTMLTextAreaElement;
            string: HTMLInputElement;
            type: HTMLInputElement;
        };
        receive: (data_item:socket_data) => void;
        request: () => void;
        toggle_mode: (event:MouseEvent) => void;
    }

    interface module_http {
        init: () => void;
        nodes: {
            encryption: HTMLInputElement;
            http_request: HTMLElement;
            request: HTMLTextAreaElement;
            responseBody: HTMLTextAreaElement;
            responseHeaders: HTMLTextAreaElement;
            responseURI: HTMLTextAreaElement;
            stats: HTMLCollectionOf<HTMLElement>;
            timeout: HTMLInputElement;
        };
        receive: (data_item:socket_data) => void;
        request: (event:MouseEvent) => void;
    }

    interface module_interfaces {
        init: () => void;
        list: (item:services_os_intr) => void;
        nodes: {
            count: HTMLElement;
            list: HTMLElement;
            update_button: HTMLButtonElement;
            update_text: HTMLElement;
        };
    }

    interface module_os {
        init: () => void;
        nodes: module_os_nodes;
        service: (data_item:socket_data) => void;
    }

    interface module_os_nodes {
        cpu: {
            arch: HTMLElement;
            cores: HTMLElement;
            endianness: HTMLElement;
            frequency: HTMLElement;
            name: HTMLElement;
        };
        env: HTMLElement;
        memory: {
            free: HTMLElement;
            total: HTMLElement;
            used: HTMLElement;
        };
        os: {
            hostname: HTMLElement;
            name: HTMLElement;
            platform: HTMLElement;
            release: HTMLElement;
            type: HTMLElement;
            uptime: HTMLElement;
        };
        path: HTMLElement;
        process: {
            arch: HTMLElement;
            argv: HTMLElement;
            cpuSystem: HTMLElement;
            cpuUser: HTMLElement;
            cwd: HTMLElement;
            memoryExternal: HTMLElement;
            memoryProcess: HTMLElement;
            memoryV8: HTMLElement;
            pid: HTMLElement;
            platform: HTMLElement;
            ppid: HTMLElement;
            uptime: HTMLElement;
        };
        update_button: HTMLButtonElement;
        update_text: HTMLElement;
        user: {
            gid: HTMLElement;
            homedir: HTMLElement;
            uid: HTMLElement;
        };
        versions: HTMLElement;
    }

    interface module_processes {
        init: () => void;
        nodes: {
            caseSensitive: HTMLInputElement;
            count: HTMLElement;
            filter_column: HTMLSelectElement;
            filter_count: HTMLElement;
            filter_value: HTMLInputElement;
            list: HTMLElement;
            update_button: HTMLButtonElement;
            update_text: HTMLElement;
        };
    }

    interface module_serverItems {
        cancel: (event:MouseEvent) => void;
        color: (name_server:string, type:type_dashboard_list) => type_activation_status;
        details: (event:MouseEvent) => void;
        edit: (event:MouseEvent) => void;
        title: (name_server:string, type:type_dashboard_list) => HTMLElement;
    }

    interface module_services {
        init: () => void;
        nodes: {
            caseSensitive: HTMLInputElement;
            count: HTMLElement;
            filter_column: HTMLSelectElement;
            filter_count: HTMLElement;
            filter_value: HTMLInputElement;
            list: HTMLElement;
            update_button: HTMLButtonElement;
            update_text: HTMLElement;
        };
    }

    interface module_sockets {
        init: () => void;
        nodes: {
            caseSensitive: HTMLInputElement;
            count: HTMLElement;
            filter_column: HTMLSelectElement;
            filter_count: HTMLElement;
            filter_value: HTMLInputElement;
            list: HTMLElement;
            update_button: HTMLButtonElement;
            update_text: HTMLElement;
        };
    }

    interface module_storage {
        init: () => void;
        list: (item:services_os_disk) => void;
        nodes: {
            count: HTMLElement;
            list: HTMLElement;
            update_button: HTMLButtonElement;
            update_text: HTMLElement;
        };
    }

    interface module_terminal {
        cols: number;
        events: {
            change: (event:Event) => void;
            data: (event:websocket_event) => void;
            firstData: (event:websocket_event) => void;
            input: (input:terminal_input) => void;
            resize: () => void;
            selection: () => void;
        };
        id: string;
        info: terminal_identifiers;
        init: () => void;
        item: Terminal;
        nodes: {
            output: HTMLElement;
            select: HTMLSelectElement;
        };
        rows: number;
        shell: () => void;
        socket: WebSocket;
    }

    interface module_users {
        init: () => void;
        nodes: {
            caseSensitive: HTMLInputElement;
            count: HTMLElement;
            filter_column: HTMLSelectElement;
            filter_count: HTMLElement;
            filter_value: HTMLInputElement;
            list: HTMLElement;
            update_button: HTMLButtonElement;
            update_text: HTMLElement;
        };
    }

    interface module_utility {
        baseline: () => void;
        clock: (data_item:socket_data) => void;
        clock_node: HTMLElement;
        log: (item:services_dashboard_status) => void;
        message_send: (data:type_socket_data, service:type_service) => void;
        setState: () => void;
        socket: socket_object;
        sort_column_names: (table:HTMLElement, select:HTMLSelectElement) => void;
        sort_tables: (event:MouseEvent, table?:HTMLElement, heading_index?:number) => void;
        status: (data_item:socket_data) => void;
        table_filter: (event:Event, target?:HTMLInputElement) => void;
        table_update: (event:MouseEvent) => void;
        tables: (module:module_processes|module_services|module_sockets|module_users, item:services_os_proc|services_os_serv|services_os_sock|services_os_user) => void;
    }

    interface module_web {
        activePorts: (name_server:string) => HTMLElement;
        create: (event:MouseEvent) => void;
        list: () => void;
        message: (event:MouseEvent) => void;
        nodes: {
            list: HTMLElement;
            server_new: HTMLButtonElement;
        };
        socket_add: (config:services_socket) => void;
        validate: (event:FocusEvent|KeyboardEvent) => void;
    }

    interface module_websocket {
        connected: boolean;
        frameBeautify: (target:"receive"|"send", value?:string) => void;
        handshake: () => void;
        handshakeSend: () => void;
        init: () => void;
        keyup_frame: (event:Event) => void;
        keyup_message: (event:KeyboardEvent) => void;
        message_receive: (data_item:socket_data) => void;
        message_send: (event:MouseEvent) => void;
        nodes: {
            button_handshake: HTMLButtonElement;
            button_send: HTMLButtonElement;
            halt_receive: HTMLInputElement;
            handshake: HTMLTextAreaElement;
            handshake_scheme: HTMLInputElement;
            handshake_status: HTMLTextAreaElement;
            handshake_timeout: HTMLInputElement;
            message_receive_body: HTMLTextAreaElement;
            message_receive_frame: HTMLTextAreaElement;
            message_send_body: HTMLTextAreaElement;
            message_send_frame: HTMLTextAreaElement;
            status: HTMLTextAreaElement;
        };
        parse_frame:() => websocket_frame;
        status: (data_item:socket_data) => void;
        timeout: number;
    }

    interface socket_object {
        connected: boolean;
        invoke: () => void;
        queue: (message:string) => void;
        queueStore: string[];
        socket: WebSocket;
    }

    interface structure_network {
        interfaces: module_interfaces;
        sockets: module_sockets;
    }

    interface structure_servers {
        compose: module_compose;
        shared: module_serverItems;
        web: module_web;
    }

    interface structure_system {
        os: module_os;
        processes: module_processes;
        services: module_services;
        storage: module_storage;
        users: module_users;
    }

    interface structure_tools {
        dns: module_dns;
        fileSystem: module_fileSystem;
        hash: module_hash;
        http: module_http;
        terminal: module_terminal;
        websocket: module_websocket;
    }

    interface state_store {
        dns: {
            hosts: string;
            types: string;
        };
        fileSystem: {
            path: string;
            search: string;
        };
        hash: {
            algorithm: string;
            digest: "base64" | "hex";
            hashFunction: "base64" | "hash";
            source: string;
            type: "file" | "string";
        };
        http: {
            encryption: boolean;
            request: string;
        };
        nav: string;
        table_os: {
            processes: {
                filter_column: number;
                filter_sensitive: boolean;
                filter_value: string;
            };
            services: {
                filter_column: number;
                filter_sensitive: boolean;
                filter_value: string;
            };
            sockets: {
                filter_column: number;
                filter_sensitive: boolean;
                filter_value: string;
            };
            users: {
                filter_column: number;
                filter_sensitive: boolean;
                filter_value: string;
            };
        };
        tables: {
            [key:string]: {
                col: number;
                dir: -1|1;
            };
        };
        terminal: string;
    }

    interface terminal_identifiers {
        pid: number;
        port_browser: number;
        port_terminal: number;
        server_name: string;
        socket_hash: string;
    }

    interface terminal_input {
        domEvent:KeyboardEvent;
        key:string;
    }
}