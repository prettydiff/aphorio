// cspell: words serv, stcp, sudp
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
        time: (start?:bigint) => string;
    }

    interface HTMLAudioElement {
        playing: boolean;
    }

    interface HTMLVideoElement {
        playing: boolean;
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

    interface dashboard {
        execute: () => void;
        global: {
            loaded: boolean;
            payload: transmit_dashboard;
            section: type_dashboard_sections;
            state: state_store;
        };
        sections: {
            "application-logs": section_applicationLogs;
            "compose-containers": section_compose_containers;
            "devices": section_devices;
            "disks": module_sections;
            "dns-query": section_dns_query;
            "file-system": section_file_system;
            "hash": section_hash;
            "interfaces": section_interfaces;
            "os-machine": section_os;
            "ports-application": section_ports_application;
            "processes": section_processes;
            "servers-web": section_servers_web;
            "services": section_services;
            "sockets-application-tcp": section_sockets_application;
            "sockets-application-udp": section_sockets_application;
            "sockets-os-tcp": section_sockets_os;
            "sockets-os-udp": section_sockets_os;
            "statistics": section_statistics;
            "terminal": section_terminal;
            "test-http": section_http_test;
            "test-websocket": section_websocket_test;
            "udp-socket": section_udpSocket;
            "users": section_users;
        };
        shared_services: {
            cancel: (event:MouseEvent) => void;
            color: (name_server:string, type:type_dashboard_list) => type_activation_status;
            create: (event:MouseEvent) => void;
            details: (event:MouseEvent) => void;
            edit: (event:MouseEvent) => void;
            title: (name_server:string, type:type_dashboard_list) => HTMLElement;
        };
        socket: socket_object;
        tables: {
            cell: (tr:HTMLElement, text:string, raw:string) => void;
            filter: (event:Event, target?:HTMLInputElement) => void;
            init: (module:module_list|section_ports_application|section_sockets_application) => void;
            populate: (module:module_list, item:type_list_services) => void;
            sort: (event:MouseEvent, table?:HTMLElement, heading_index?:number) => void;
            update: (event:MouseEvent) => void;
        };
        utility: {
            baseline: () => void;
            clock: (data_item:socket_data) => void;
            message_send: (data:type_socket_data, service:type_service) => void;
            nodes: {
                clock: HTMLElement;
                load: HTMLElement;
                main: HTMLElement;
            };
            resize: () => void;
            setState: () => void;
        };
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

    interface module_compose_variables {
        cancel: (event:MouseEvent) => void;
        edit: () => void;
        message: (event:MouseEvent) => void;
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
        receive: (socket_data:socket_data) => void;
        row: (record:type_lists, tr:HTMLElement) => void;
        sort_name: string[];
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

    interface module_sections {
        events: {
            [key:string]: ((event:Event) => void) | ((event:FocusEvent) => void) | ((event:KeyboardEvent) => void) | ((event:MouseEvent) => void) | ((event:websocket_event) => void) | ((input:terminal_input) => void);
        };
        init: () => void;
        nodes: {
            [key:string]: HTMLElement;
        };
        receive: (socket_data:socket_data) => void;
        tools: {
            [key:string]: (input?:boolean|string) => void;
        };
    }

    interface section_applicationLogs extends module_sections {
        events: {
            resize: () => void;
        };
        nodes: {
            list: HTMLElement;
        };
    }

    interface section_compose_containers extends module_sections {
        events: {
            cancel_variable: (event:MouseEvent) => void;
            edit_variable: () => void;
            message_container: (event:MouseEvent) => void;
            message_variable: (event:MouseEvent) => void;
            update: () => void;
            validate_containers: (event:FocusEvent|KeyboardEvent) => void;
            validate_variables: (event:FocusEvent|KeyboardEvent) => void;
        };
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

    interface section_devices extends module_list {
        dataName: "devs";
    }

    interface section_dns_query extends module_sections {
        events: {
            directionEvent: (event:MouseEvent) => void;
            query: (event:KeyboardEvent|MouseEvent) => void;
        };
        nodes: {
            hosts: HTMLInputElement;
            lookup: HTMLInputElement;
            output: HTMLTextAreaElement;
            query: HTMLButtonElement;
            reverse: HTMLInputElement;
            types: HTMLInputElement;
        };
        tools: {
            direction: (reverse:boolean|string) => void;
        };
    }

    interface section_file_system extends module_sections {
        block: boolean;
        events: {
            key: (event:KeyboardEvent) => void;
            resize: () => void;
            send: (event:FocusEvent|KeyboardEvent) => void;
        };
        media: {
            audio: HTMLElement;
            image: HTMLElement;
            other: HTMLElement;
            pdf: HTMLIFrameElement;
            text: HTMLElement;
            video: HTMLElement;
        };
        nodes: {
            content: HTMLElement;
            failures: HTMLElement;
            output: HTMLElement;
            path: HTMLInputElement;
            search: HTMLInputElement;
            status: HTMLElement;
            summary: HTMLElement;
        };
        time: bigint;
        tools: {
            media_time: (input:boolean|number|string) => string;
        };
    }

    interface section_hash extends module_sections {
        events: {
            request: () => void;
            toggle_mode: (event:MouseEvent) => void;
        };
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
    }

    interface section_http_test extends module_sections {
        events: {
            request: () => void;
        };
        nodes: {
            encryption: HTMLInputElement;
            http_request: HTMLElement;
            request: HTMLTextAreaElement;
            responseBody: HTMLTextAreaElement;
            responseHeaders: HTMLTextAreaElement;
            responseURI: HTMLTextAreaElement;
            stats: HTMLElement;
            timeout: HTMLInputElement;
        };
    }

    interface section_interfaces extends module_sections {
        init: () => void;
        nodes: {
            count: HTMLElement;
            list: HTMLElement;
            update_button: HTMLButtonElement;
            update_text: HTMLElement;
        };
        receive: (socket_data:socket_data) => void;
    }

    interface section_os extends module_sections {
        nodes_os: module_os_nodes;
    }

    interface section_ports_application extends module_sections {
        dataName: "ports_application";
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
        receive: () => void;
    }

    interface section_processes extends module_list {
        dataName: "proc";
    }

    interface section_servers_web extends module_sections {
        events: {
            message: (event:MouseEvent) => void;
            validate: (event:FocusEvent|KeyboardEvent) => void;
        };
        nodes: {
            list: HTMLElement;
            service_new: HTMLButtonElement;
        };
        receive: (socket_data:socket_data) => void;
        tools: {
            activePorts: (id:boolean|string) => HTMLElement;
        };
    }

    interface section_services extends module_list {
        dataName: "serv";
    }

    interface section_sockets_application extends module_list {
        dataName: "sockets-application-tcp" | "sockets-application-udp";
        tools: {
            update: () => void;
        };
    }

    interface section_sockets_os extends module_list {
        dataName: "stcp" | "sudp";
    }

    interface section_statistics extends module_sections {
        events: {
            change_display: () => void;
            change_type: () => void;
            definitions: (event:FocusEvent|KeyboardEvent) => void;
        };
        graph_config: {
            colors: string[];
            labels: store_string;
            title: store_string;
        };
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
        tools: {
            graph_composite: (force_new:boolean|string) => void;
            graph_individual: (force_new:boolean|string) => void;
        };
    }

    interface section_terminal extends module_sections {
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
        item: Terminal;
        nodes: {
            cols: HTMLElement;
            output: HTMLElement;
            rows: HTMLElement;
            select: HTMLSelectElement;
        };
        rows: number;
        socket: WebSocket;
    }

    interface section_udpSocket extends module_sections {
        events: {
            create: () => void;
            toggle_multicast: () => void;
            toggle_role: () => void;
            toggle_type: () => void;
        };
        nodes: {
            button_create: HTMLElement;
            input_address_client: HTMLInputElement;
            input_address_server: HTMLInputElement;
            input_multicast_membership: HTMLInputElement;
            input_multicast_none: HTMLInputElement;
            input_multicast_source: HTMLInputElement;
            input_port_local: HTMLInputElement;
            input_port_remote: HTMLInputElement;
            input_role_client: HTMLInputElement;
            input_role_server: HTMLInputElement;
            input_type_ipv4: HTMLInputElement;
            input_type_ipv6: HTMLInputElement;
            interfaces: HTMLSelectElement;
            multicast_group: HTMLElement;
            multicast_interface: HTMLElement;
            multicast_membership: HTMLElement;
            multicast_source: HTMLElement;
            status: HTMLElement;
            toggle_client: HTMLElement;
            toggle_server: HTMLElement;
        };
    }

    interface section_users extends module_list {
        dataName: "user";
    }

    interface section_websocket_test extends module_sections {
        connected: boolean;
        events: {
            handshakeSend: () => void;
            keyup_frame: (event:Event) => void;
            keyup_message: (event:KeyboardEvent) => void;
            message_send: () => void;
        };
        
        frameBeautify: (target:"receive"|"send", valueItem?:string) => void;
        init: () => void;
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
        timeout: number;
        tools: {
            handshake: () => void;
            parse_frame: () => websocket_frame;
        };
        transmit: map_messages;
    }

    interface socket_object {
        connected: boolean;
        invoke: () => void;
        queue: (message:string) => void;
        queueStore: string[];
        socket: WebSocket;
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