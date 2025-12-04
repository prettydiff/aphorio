// cspell: words serv
import Chart from "chart.js/auto";
import { Terminal } from "@xterm/xterm";

declare global {
    interface BigInt {
        time:(start:bigint) => string;
    }

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
        bytes: () => number;
        bytes_big: () => bigint;
        capitalize: () => string;
    }

    interface Number {
        bytes: (input?:number) => string;
        bytesLong: () => string;
        commas: () => string;
        dateTime: (date:boolean, timezone_offset:number) => string;
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

    interface graph_composite {
        cpu: number[][];
        disk_in: number[][];
        disk_out: number[][];
        mem: number[][];
        net_in: number[][];
        net_out: number[][];
        threads: number[][];
    }

    interface graph_config {
        item: services_statistics_facet[];
        label: string[];
        parent: HTMLElement;
        title: string;
    }

    interface graph_dataset {
        backgroundColor: string;
        borderColor: string;
        borderRadius: number;
        borderWidth: number;
        data: number[];
        fill: boolean;
        label: string;
        showLine: boolean;
        tension: number;
    }

    interface graph_modify_config {
        data_0: number[];
        data_1: number[];
        label_0: string;
        label_1: string;
        labels: string[];
        name: "cpu"|"disk"|"mem"|"net"|"threads";
    }

    interface map_messages {
        [key:string]: (data_item:socket_data) => void;
    }

    interface module_compose_containers {
        descriptions: (id:string) => HTMLElement;
        events: {
            cancel_variable: (event:MouseEvent) => void;
            edit_variable: () => void;
            message_container: (event:MouseEvent) => void;
            message_variable: (event:MouseEvent) => void;
            update: () => void;
            validate_containers: (event:FocusEvent|KeyboardEvent) => void;
            validate_variables: (event:FocusEvent|KeyboardEvent) => void;
        };
        list: (socket_data:socket_data) => void;
        nodes: {
            body: HTMLElement;
            list: HTMLElement;
            list_variables: HTMLElement;
            new_container: HTMLButtonElement;
            new_variable: HTMLButtonElement;
            status: HTMLElement;
            update_button: HTMLButtonElement;
            update_containers: HTMLElement;
            update_time: HTMLElement;
            update_variables: HTMLElement;
        };
    }
    interface module_compose_variables {
        cancel: (event:MouseEvent) => void;
        edit: () => void;
        message: (event:MouseEvent) => void;
    }

    interface module_disks {
        init: () => void;
        list: (item:services_os_disk) => void;
        nodes: {
            count: HTMLElement;
            list: HTMLElement;
            update_button: HTMLButtonElement;
            update_text: HTMLElement;
        };
    }

    interface module_dns {
        direction: (reverse:boolean) => void;
        directionEvent: (event:MouseEvent) => void;
        init: () => void;
        nodes: {
            hosts: HTMLInputElement;
            lookup: HTMLInputElement;
            output: HTMLTextAreaElement;
            query: HTMLButtonElement;
            reverse: HTMLInputElement;
            types: HTMLInputElement;
        };
        query: (event:KeyboardEvent|MouseEvent) => void;
        receive: (data_item:socket_data) => void;
    }

    interface module_fileSystem {
        block: boolean;
        init: () => void;
        key: (event:KeyboardEvent) => void;
        nodes: {
            content: HTMLElement;
            failures: HTMLElement;
            output: HTMLElement;
            path: HTMLInputElement;
            search: HTMLInputElement;
            status: HTMLElement;
            summary: HTMLElement;
        };
        receive: (data_item:socket_data) => void;
        send: (event:FocusEvent|KeyboardEvent) => void;
        time: bigint;
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

    interface module_list {
        dataName: string;
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
        row: (record:type_lists, tr:HTMLElement) => void;
        sort_name: string[];
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
            admin: HTMLElement;
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

    interface module_ports_application {
        dataName: string;
        list: () => void;
        nodes: {
            caseSensitive: HTMLInputElement;
            count: HTMLElement;
            filter_column: HTMLSelectElement;
            filter_count: HTMLElement;
            filter_value: HTMLInputElement;
            list: HTMLElement;
            update_button: HTMLElement;
            update_text: HTMLElement;
        };
    }

    interface module_remote {
        delay: (config:test_browserItem) => void;
        domFailure: boolean;
        // eslint-disable-next-line max-params
        error: (message:string, source:string, line:number, col:number, error:Error) => void;
        evaluate: (test:test_assertion_dom) => test_assert;
        event: (item:services_testBrowser, pageLoad:boolean) => void;
        getProperty: (test:test_assertion_dom) => [HTMLElement, test_primitive];
        index: number;
        keyAlt: boolean;
        keyControl: boolean;
        keyShift: boolean;
        magicString: string;
        node: (dom:test_browserDOM, property:string) => HTMLElement;
        report: (delay:test_assertion_dom, test:test_assertion_dom[], index:number) => void;
        sendTest: (payload:test_assert[], index:number) => services_testBrowser;
        store: HTMLElement | test_primitive;
        stringify: (primitive:test_primitive) => string;
        test_item: services_testBrowser;
    }

    interface module_servers_web {
        activePorts: (id:string) => HTMLElement;
        getTitle?: (textArea:HTMLTextAreaElement) => string;
        list: (socket_data:socket_data) => void;
        message: (event:MouseEvent) => void;
        nodes: {
            list: HTMLElement;
            service_new: HTMLButtonElement;
        };
        validate: (event:FocusEvent|KeyboardEvent) => void;
    }

    interface module_serverShared {
        cancel: (event:MouseEvent) => void;
        color: (name_server:string, type:type_dashboard_list) => type_activation_status;
        create: (event:MouseEvent) => void;
        details: (event:MouseEvent) => void;
        edit: (event:MouseEvent) => void;
        title: (name_server:string, type:type_dashboard_list) => HTMLElement;
    }

    interface module_statistics {
        change_display: () => void;
        change_type: () => void;
        definitions: (event:FocusEvent|KeyboardEvent) => void;
        graph_composite: (force_new:boolean) => void;
        graph_config: {
            colors: string[];
            labels: store_string;
            title: store_string;
        };
        graph_individual: (force_new:boolean) => void;
        graphs: {
            [key:string]: {
                cpu: Chart;
                disk?: Chart;
                disk_in?: Chart;
                disk_out?: Chart;
                mem: Chart;
                net?: Chart;
                net_in?: Chart;
                net_out?: Chart;
                threads: Chart;
            };
        };
        nodes: {
            duration: HTMLElement;
            frequency: HTMLInputElement;
            graph_display: HTMLSelectElement;
            graph_type: HTMLSelectElement;
            graphs: HTMLElement;
            records: HTMLInputElement;
            update: HTMLElement;
        };
        receive: (data:socket_data) => void;
    }

    interface module_sockets_application extends module_list {
        list: (socket_data:socket_data) => void;
        update: () => void;
    }

    interface module_tables {
        cell: (tr:HTMLElement, text:string, raw:string) => void;
        filter: (event:Event, target?:HTMLInputElement) => void;
        init: (module:module_list|module_ports_application|module_sockets_application) => void;
        populate: (module:module_list, item:type_list_services) => void;
        sort: (event:MouseEvent, table?:HTMLElement, heading_index?:number) => void;
        update: (event:MouseEvent) => void;
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
            cols: HTMLElement;
            output: HTMLElement;
            rows: HTMLElement;
            select: HTMLSelectElement;
        };
        rows: number;
        shell: () => void;
        socket: WebSocket;
    }

    interface module_utility {
        baseline: () => void;
        clock: (data_item:socket_data) => void;
        log: (socket_data:socket_data) => void;
        message_send: (data:type_socket_data, service:type_service) => void;
        nodes: {
            clock: HTMLElement;
            load: HTMLElement;
            main: HTMLElement;
        };
        resize: () => void;
        setState: () => void;
        socket: socket_object;
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
            handshake_label: HTMLElement;
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
        ports_application: module_ports_application;
        sockets_application: module_sockets_application;
        sockets_os: module_list;
    }

    interface structure_services {
        compose_containers: module_compose_containers;
        init: () => void;
        servers_web: module_servers_web;
        shared: module_serverShared;
        statistics: module_statistics;
    }

    interface structure_system {
        devices: module_list;
        disks: module_disks;
        os: module_os;
        processes: module_list;
        services: module_list;
        users: module_list;
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
            reverse: boolean;
            types: string;
        };
        fileSystem: {
            path: string;
            search: string;
        };
        graph_display: number;
        graph_type: number;
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
            [key:string]: table_os_item;
        };
        tables: {
            [key:string]: {
                col: number;
                dir: -1|1;
            };
        };
        terminal: string;
    }

    interface table_os_item {
        filter_column: number;
        filter_sensitive: boolean;
        filter_value: string;
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