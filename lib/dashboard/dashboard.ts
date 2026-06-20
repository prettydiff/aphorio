
import core from "../browser/core.ts";
import Terminal from "@xterm/xterm";

/* eslint-disable @typescript-eslint/no-unused-vars */
// cspell: words serv, stcp, sudp

const dashboard:dashboard = {
    execute: function():void {},
    global: {
        "click": false,
        "loaded": false,
        "payload": {
            "compose": {
                "containers": {},
                "status": "",
                "time": 0,
                "variables": {}
            },
            "dashboard_id": "",
            "hashes": [""],
            "http_request": "",
            "logs": {
                "entries": [],
                "max": 0,
                "total": 0
            },
            "name": "",
            "notes": "",
            "os": {
                "devs": {
                    "data": [],
                    "time": 0
                },
                "disk": {
                    "data": [],
                    "time": 0
                },
                "intr": {
                    "data": {},
                    "time": 0
                },
                "main": {
                    "machine": {
                        "cpu": {
                            "arch": "",
                            "cores": 0,
                            "endianness": "",
                            "frequency": 0,
                            "name": ""
                        },
                        "memory": {
                            "free": 0,
                            "total": 0
                        }
                    },
                    "os": {
                        "env": {},
                        "hostname": "",
                        "name": "",
                        "path": [""],
                        "platform": "",
                        "release": "",
                        "type": "",
                        "uptime": 0
                    },
                    "process": {
                        "admin": false,
                        "arch": "",
                        "argv": [""],
                        "cpuSystem": 0,
                        "cpuUser": 0,
                        "cwd": "",
                        "memory": {
                            "V8": 0,
                            "external": 0,
                            "rss": 0
                        },
                        "pid": 0,
                        "platform": "",
                        "ppid": 0,
                        "uptime": 0,
                        "versions": {}
                    },
                    "time": 0,
                    "user_account": {
                        "gid": 0,
                        "homedir": "",
                        "uid": 0
                    }
                },
                "proc": {
                    "data": [],
                    "time": 0
                },
                "serv": {
                    "data": [],
                    "time": 0
                },
                "stcp": {
                    "data": [],
                    "time": 0
                },
                "sudp": {
                    "data": [],
                    "time": 0
                },
                "time": 0,
                "user": {
                    "data": [],
                    "time": 0
                }
            },
            "path": {
                "cgroup": "",
                "compose": "",
                "compose_empty": "",
                "node": "",
                "process": "",
                "project": "",
                "sep": "/",
                "servers": ""
            },
            "ports-application": {
                "data": [],
                "time": 0
            },
            "repository": "",
            "server_ports": {},
            "servers": {},
            "services_app": [],
            "sockets": {
                "tcp": [],
                "time": 0,
                "udp": []
            },
            "start_date": 0,
            "stats": {
                "containers": {},
                "duration": 0,
                "frequency": 0,
                "now": 0,
                "records": 0
            },
            "terminal": [""],
            "timeZone_offset": 0,
            "version": ""
        },
        "section": "application-logs",
        "state": {
            "dns": {
                "hosts": "",
                "reverse": false,
                "types": ""
            },
            "fileSystem": {
                "children": 0,
                "depth": "",
                "directory_size": 0,
                "path": "",
                "path_style": 0,
                "search": ""
            },
            "graph_display": 0,
            "graph_type": 0,
            "hash": {
                "algorithm": "",
                "digest": "base64",
                "hashFunction": "base64",
                "source": "",
                "type": "file"
            },
            "http": {
                "encryption": false,
                "request": ""
            },
            "messageInspection": "docker-container",
            "nav": "application-logs",
            "table_os": {},
            "tables": {},
            "terminal": "",
            "test_websocket": {
                "request_timeout": "",
                "send_frame": "",
                "send_message": ""
            },
            "udp_socket": {
                "address_destination": "",
                "address_source": "",
                "interfaces": "",
                "multicast_group": "",
                "multicast_membership": "",
                "multicast_source": "",
                "port_destination": "",
                "port_source": "",
                "toggle_multicast": "membership",
                "toggle_role": "bind",
                "toggle_type": "ipv4"
            }
        }
    },
    message: {
        "init": function():void {},
        "receive": function(data:string):void {},
        "send": function(socket_data:socket_data):void {}
    },
    sections: {
        "application-logs": {
            "events": {
                "resize": function():void {}
            },
            "init": function():void {},
            "nodes": {
                "count": document.getElementsByTagName("div")[0],
                "list": document.getElementsByTagName("div")[0],
                "total": document.getElementsByTagName("div")[0]
            },
            "receive": function(socket_data:socket_data):void {},
            "tools": {}
        },
        "compose-containers": {
            "cols": 0,
            "events": {
                "cancel_variable": function(event:MouseEvent):void {},
                "edit_variable": function():void {},
                "message_container": function(event:MouseEvent):void {},
                "message_variable": function(event:MouseEvent):void {},
                "resize": function():void {},
                "selection": function():void {},
                "update": function():void {},
                "validate_containers": function(event:FocusEvent|KeyboardEvent):void {},
                "validate_variables": function(event:FocusEvent|KeyboardEvent):void {}
            },
            "init": function():void {},
            "nodes": {
                body: document.getElementsByTagName("div")[0] as HTMLElement,
                cols: document.getElementsByTagName("div")[0] as HTMLElement,
                list: document.getElementsByTagName("div")[0] as HTMLElement,
                list_variables: document.getElementsByTagName("div")[0] as HTMLElement,
                new_container: document.getElementsByTagName("button")[0] as HTMLButtonElement,
                new_variable: document.getElementsByTagName("button")[0] as HTMLButtonElement,
                rows: document.getElementsByTagName("div")[0] as HTMLElement,
                shell: document.getElementsByTagName("div")[0] as HTMLElement,
                status: document.getElementsByTagName("div")[0] as HTMLElement,
                update_button: document.getElementsByTagName("button")[0] as HTMLButtonElement,
                update_containers: document.getElementsByTagName("div")[0] as HTMLElement,
                update_time: document.getElementsByTagName("div")[0] as HTMLElement,
                update_variables: document.getElementsByTagName("div")[0] as HTMLElement
            },
            "receive": function(socket_data:socket_data):void {},
            "rows": 0,
            // @ts-expect-error - xterm has not updated their types to reflect Terminal is a constructor
            "shell": new Terminal({
                cols: 0,
                cursorBlink: true,
                cursorStyle: "underline",
                disableStdin: false,
                readonly: true,
                rows: 0,
                theme: {
                    background: "#222",
                    selectionBackground: "#444"
                }
            }),
            "status_out": function(socket_data:socket_data):void {},
            "tools": {}
        },
        "devices": {
            "dataName": "devs",
            "nodes": {
                caseSensitive: document.getElementsByTagName("input")[0],
                count: document.getElementsByTagName("div")[0],
                filter_column: document.getElementsByTagName("select")[0],
                filter_count: document.getElementsByTagName("div")[0],
                filter_value: document.getElementsByTagName("input")[0],
                list: document.getElementsByTagName("div")[0],
                update_button: document.getElementsByTagName("button")[0],
                update_duration: document.getElementsByTagName("time")[0],
                update_text: document.getElementsByTagName("time")[0]
            },
            "receive": function():void {}, // not used
            "row": function(record_item:type_lists, tr:HTMLElement):void {},
            "sort_name": [""],
            "time": 0
        },
        "disks": {
            "events": {
                "update": function():void {}
            },
            "init": function():void {},
            "nodes": {
                count: document.getElementsByTagName("em")[0],
                list: document.getElementsByTagName("div")[0] as HTMLElement,
                update_button: document.getElementsByTagName("button")[0],
                update_duration: document.getElementsByTagName("time")[0],
                update_text: document.getElementsByTagName("time")[0]
            },
            "receive": function(socket_data:socket_data):void {},
            "time": 0,
            "tools": {}
        },
        "dns-query": {
            "events": {
                "directionEvent": function(event:MouseEvent):void {},
                "query": function(event:KeyboardEvent|MouseEvent):void {}
            },
            "init": function():void {},
            "nodes": {
                hosts: document.getElementsByTagName("input")[0],
                lookup: document.getElementsByTagName("input")[0],
                output: document.getElementsByTagName("textarea")[0],
                query: document.getElementsByTagName("button")[0],
                reverse: document.getElementsByTagName("input")[0],
                types: document.getElementsByTagName("input")[3]
            },
            "receive": function(socket_data:socket_data):void {},
            "tools": {
                "direction": function(reverse:boolean|string):void {}
            }
        },
        "file-system": {
            "block": false,
            "events": {
                "file_button": function(event:MouseEvent):void {},
                "key": function(event:KeyboardEvent):void {},
                "resize": function():void {},
                "send": function(event:Event):void {}
            },
            "init": function():void {},
            "media": {
                "audio": document.getElementsByTagName("audio")[0],
                "image": document.getElementsByTagName("img")[0],
                "other": document.getElementsByTagName("div")[0],
                "pdf": document.getElementsByTagName("iframe")[0],
                "text": document.getElementsByTagName("textarea")[0],
                "video": document.getElementsByTagName("video")[0]
            },
            "nodes": {
                children: document.getElementsByTagName("select")[0],
                content: document.getElementsByTagName("div")[0] as HTMLElement,
                depth: document.getElementsByTagName("input")[0],
                directory_size: document.getElementsByTagName("select")[0],
                failures: document.getElementsByTagName("div")[0] as HTMLElement,
                output: document.getElementsByTagName("div")[0] as HTMLElement,
                path: document.getElementsByTagName("input")[0],
                path_style: document.getElementsByTagName("select")[0],
                search: document.getElementsByTagName("input")[0],
                status: document.getElementsByTagName("em")[0],
                summary: document.getElementsByTagName("div")[0] as HTMLElement,
                tbody: document.getElementsByTagName("tbody")[0]
            },
            "receive": function(socket_data:socket_data):void {},
            "time": 0,
            "tools": {
                "media_time": function(input:boolean|number|string):string {return "";}
            }
        },
        "hash": {
            "events": {
                "request": function():void {},
                "toggle_mode": function(event:MouseEvent):void {}
            },
            "init": function():void {},
            "nodes": {
                algorithm: document.getElementsByTagName("select")[0],
                base64: document.getElementsByTagName("input")[0],
                button: document.getElementsByTagName("button")[0],
                digest: document.getElementsByTagName("input")[0],
                file: document.getElementsByTagName("input")[0],
                hash: document.getElementsByTagName("input")[0],
                hex: document.getElementsByTagName("input")[0],
                output: document.getElementsByTagName("textarea")[0],
                size: document.getElementsByTagName("strong")[0],
                source: document.getElementsByTagName("textarea")[0],
                string: document.getElementsByTagName("input")[0],
                time: document.getElementsByTagName("strong")[0],
                type: document.getElementsByTagName("input")[0]
            },
            "receive": function(socket_data:socket_data):void {},
            "time": 0,
            "tools": {}
        },
        "interfaces": {
            "events": {
                "update": function():void {}
            },
            "init": function():void {},
            "nodes": {
                count: document.getElementsByTagName("div")[0],
                list: document.getElementsByTagName("div")[0] as HTMLElement,
                update_button: document.getElementsByTagName("button")[0],
                update_duration: document.getElementsByTagName("time")[0],
                update_text: document.getElementsByTagName("time")[0]
            },
            "receive": function(socket_data:socket_data):void {},
            "time": 0,
            "tools": {}
        },
        "message-inspection": {
            "events": {
                "service": function():void {},
                "type": function():void {}
            },
            "init": function():void {},
            "nodes": {
                em_in: document.getElementsByTagName("em")[0],
                em_out: document.getElementsByTagName("em")[0],
                label_in: document.getElementsByTagName("label")[0],
                label_out: document.getElementsByTagName("label")[0],
                service: document.getElementsByTagName("select")[0] as HTMLSelectElement,
                type: document.getElementsByTagName("select")[0] as HTMLSelectElement
            },
            "receive": function(socket_data:socket_data):void {},
            "tools": {}
        },
        "notes": {
            "events": {
                "blur": function():void {},
                "key": function():void {},
                "resize": function():void {}
            },
            "init": function():void {},
            "nodes": {
                "textarea": document.getElementsByTagName("textarea")[0]
            },
            "receive": function(socket_data:socket_data):void {},
            "timer": setTimeout(function():void {}, 0),
            "tools": {}
        },
        "os-machine": {
            "events": {
                "update": function():void {}
            },
            "init": function():void {},
            "nodes": {},
            "nodes_os": {
                "cpu": {
                    "arch": document.getElementsByTagName("div")[0],
                    "cores": document.getElementsByTagName("div")[0],
                    "endianness": document.getElementsByTagName("div")[0],
                    "frequency": document.getElementsByTagName("div")[0],
                    "name": document.getElementsByTagName("div")[0]
                },
                "env": document.getElementsByTagName("div")[0],
                "memory": {
                    "free": document.getElementsByTagName("div")[0],
                    "total": document.getElementsByTagName("div")[0],
                    "used": document.getElementsByTagName("div")[0]
                },
                "os": {
                    "hostname": document.getElementsByTagName("div")[0],
                    "name": document.getElementsByTagName("div")[0],
                    "platform": document.getElementsByTagName("div")[0],
                    "release": document.getElementsByTagName("div")[0],
                    "type": document.getElementsByTagName("div")[0],
                    "uptime": document.getElementsByTagName("div")[0]
                },
                "path": document.getElementsByTagName("div")[0],
                "process": {
                    "admin": document.getElementsByTagName("div")[0],
                    "arch": document.getElementsByTagName("div")[0],
                    "argv": document.getElementsByTagName("div")[0],
                    "cpuSystem": document.getElementsByTagName("div")[0],
                    "cpuUser": document.getElementsByTagName("div")[0],
                    "cwd": document.getElementsByTagName("div")[0],
                    "memoryExternal": document.getElementsByTagName("div")[0],
                    "memoryProcess": document.getElementsByTagName("div")[0],
                    "memoryV8": document.getElementsByTagName("div")[0],
                    "pid": document.getElementsByTagName("div")[0],
                    "platform": document.getElementsByTagName("div")[0],
                    "ppid": document.getElementsByTagName("div")[0],
                    "uptime": document.getElementsByTagName("div")[0]
                },
                "update_button": document.getElementsByTagName("button")[0],
                "update_duration": document.getElementsByTagName("div")[0],
                "update_text": document.getElementsByTagName("div")[0],
                "user": {
                    "gid": document.getElementsByTagName("div")[0],
                    "homedir": document.getElementsByTagName("div")[0],
                    "uid": document.getElementsByTagName("div")[0]
                },
                "versions": document.getElementsByTagName("div")[0],
            },
            "receive": function(socket_data:socket_data):void {},
            "time": 0,
            "tools": {}
        },
        "ports-application": {
            "dataName": "ports-application",
            "nodes": {
                caseSensitive: document.getElementsByTagName("input")[0],
                count: document.getElementsByTagName("div")[0],
                filter_column: document.getElementsByTagName("select")[0],
                filter_count: document.getElementsByTagName("div")[0],
                filter_value: document.getElementsByTagName("input")[0],
                list: document.getElementsByTagName("div")[0],
                update_button: document.getElementsByTagName("button")[0],
                update_duration: document.getElementsByTagName("time")[0],
                update_text: document.getElementsByTagName("time")[0]
            },
            "receive": function():void {}, // not used
            "row": function(record_item:type_lists, tr:HTMLElement):void {},
            "sort_name": [""],
            "time": 0
        },
        "processes": {
            "dataName": "proc",
            "nodes": {
                caseSensitive: document.getElementsByTagName("input")[0],
                count: document.getElementsByTagName("div")[0],
                filter_column: document.getElementsByTagName("select")[0],
                filter_count: document.getElementsByTagName("div")[0],
                filter_value: document.getElementsByTagName("input")[0],
                list: document.getElementsByTagName("div")[0],
                update_button: document.getElementsByTagName("button")[0],
                update_duration: document.getElementsByTagName("time")[0],
                update_text: document.getElementsByTagName("time")[0]
            },
            "receive": function():void {}, // not used
            "row": function(record_item:type_lists, tr:HTMLElement):void {},
            "sort_name": [""],
            "time": 0
        },
        "servers-web": {
            "events": {
                "message": function(event:MouseEvent):void {},
                "validate": function(event:FocusEvent|KeyboardEvent):void {}
            },
            "init": function():void {},
            "nodes": {
                "list": document.getElementsByTagName("div")[0],
                "service_new": document.getElementsByTagName("button")[0]
            },
            "receive": function(socket_data:socket_data):void {},
            "tools": {
                "activePorts": function(id:boolean|string):HTMLElement {return document.createElement("div");}
            }
        },
        "services-app": {
            "events": {},
            "init": function():void {},
            "nodes": {
                "": document.getElementsByTagName("div")[0]
            },
            "receive": function():void {}, // not used
            "tools": {}
        },
        "services-os": {
            "dataName": "serv",
            "nodes": {
                caseSensitive: document.getElementsByTagName("input")[0],
                count: document.getElementsByTagName("div")[0],
                filter_column: document.getElementsByTagName("select")[0],
                filter_count: document.getElementsByTagName("div")[0],
                filter_value: document.getElementsByTagName("input")[0],
                list: document.getElementsByTagName("div")[0],
                update_button: document.getElementsByTagName("button")[0],
                update_duration: document.getElementsByTagName("time")[0],
                update_text: document.getElementsByTagName("time")[0]
            },
            "receive": function():void {}, // not used
            "row": function(record_item:type_lists, tr:HTMLElement):void {},
            "sort_name": [""],
            "time": 0
        },
        "sockets-application-tcp": {
            "dataName": "sockets-application-tcp",
            "nodes": {
                caseSensitive: document.getElementsByTagName("input")[0],
                count: document.getElementsByTagName("div")[0],
                filter_column: document.getElementsByTagName("select")[0],
                filter_count: document.getElementsByTagName("div")[0],
                filter_value: document.getElementsByTagName("input")[0],
                list: document.getElementsByTagName("div")[0],
                update_button: document.getElementsByTagName("button")[0],
                update_duration: document.getElementsByTagName("time")[0],
                update_text: document.getElementsByTagName("time")[0]
            },
            "receive": function():void {}, // not used
            "row": function(record_item:type_lists, tr:HTMLElement):void {},
            "sort_name": [""],
            "time": 0
        },
        "sockets-application-udp": {
            "dataName": "sockets-application-udp",
            "nodes": {
                caseSensitive: document.getElementsByTagName("input")[0],
                count: document.getElementsByTagName("div")[0],
                filter_column: document.getElementsByTagName("select")[0],
                filter_count: document.getElementsByTagName("div")[0],
                filter_value: document.getElementsByTagName("input")[0],
                list: document.getElementsByTagName("div")[0],
                update_button: document.getElementsByTagName("button")[0],
                update_duration: document.getElementsByTagName("time")[0],
                update_text: document.getElementsByTagName("time")[0]
            },
            "receive": function():void {}, // not used
            "row": function(record_item:type_lists, tr:HTMLElement):void {},
            "sort_name": [""],
            "time": 0
        },
        "sockets-os-tcp": {
            "dataName": "stcp",
            "nodes": {
                caseSensitive: document.getElementsByTagName("input")[0],
                count: document.getElementsByTagName("div")[0],
                filter_column: document.getElementsByTagName("select")[0],
                filter_count: document.getElementsByTagName("div")[0],
                filter_value: document.getElementsByTagName("input")[0],
                list: document.getElementsByTagName("div")[0],
                update_button: document.getElementsByTagName("button")[0],
                update_duration: document.getElementsByTagName("time")[0],
                update_text: document.getElementsByTagName("time")[0]
            },
            "receive": function():void {}, // not used
            "row": function(record_item:type_lists, tr:HTMLElement):void {},
            "sort_name": [""],
            "time": 0
        },
        "sockets-os-udp": {
            "dataName": "sudp",
            "nodes": {
                caseSensitive: document.getElementsByTagName("input")[0],
                count: document.getElementsByTagName("div")[0],
                filter_column: document.getElementsByTagName("select")[0],
                filter_count: document.getElementsByTagName("div")[0],
                filter_value: document.getElementsByTagName("input")[0],
                list: document.getElementsByTagName("div")[0],
                update_button: document.getElementsByTagName("button")[0],
                update_duration: document.getElementsByTagName("time")[0],
                update_text: document.getElementsByTagName("time")[0]
            },
            "receive": function():void {}, // not used
            "row": function(record_item:type_lists, tr:HTMLElement):void {},
            "sort_name": [""],
            "time": 0
        },
        "statistics-resources": {
            "events": {
                "change_display": function():void {},
                "change_type": function():void {},
                "definitions": function(event:FocusEvent|KeyboardEvent):void {}
            },
            "graph_config": {
                "colors": [""],
                "labels": {},
                "title": {}
            },
            "graphs": {},
            "init": function():void {},
            "nodes": {
                duration: document.getElementsByTagName("div")[0],
                frequency: document.getElementsByTagName("input")[0],
                graph_display: document.getElementsByTagName("select")[0],
                graph_type: document.getElementsByTagName("select")[0],
                graphs: document.getElementsByTagName("div")[0] as HTMLElement,
                records: document.getElementsByTagName("input")[0],
                update: document.getElementsByTagName("div")[0]
            },
            "receive": function(socket_data:socket_data):void {},
            "tools": {
                "graph_composite": function(force_new:boolean|string):void {},
                "graph_individual": function(force_new:boolean|string):void {}
            }
        },
        "terminal": {
            "cols": 0,
            "events": {
                "change": function():void {},
                "data": function(event:websocket_event):void {},
                "firstData": function(event:websocket_event):void {},
                "input": function(input:terminal_input):void {},
                "resize": function():void {},
                "selection": function():void {}
            },
            "id": "",
            "info": {
                "pid": 0,
                "port_browser": 0,
                "port_terminal": 0,
                "server_name": "",
                "socket_hash": ""
            },
            "init": function():void {},
            // @ts-expect-error - xterm has not updated their types to reflect Terminal is a constructor
            "item": new Terminal({
                cols: 0,
                cursorBlink: true,
                cursorStyle: "underline",
                disableStdin: false,
                readonly: true,
                rows: 0,
                theme: {
                    background: "#222",
                    selectionBackground: "#444"
                }
            }),
            "nodes": {
                cols: document.getElementsByTagName("div")[0],
                output: document.getElementsByTagName("div")[0] as HTMLElement,
                rows: document.getElementsByTagName("div")[0],
                select: document.getElementsByTagName("select")[0] as HTMLSelectElement
            },
            "receive": function():void {}, // not used
            "rows": 0,
            socket: new WebSocket(""),
            "tools": {
                "": function():void {}
            }
        },
        "test-http": {
            "events": {
                "request": function():void {}
            },
            "init": function():void {},
            "nodes": {
                encryption: document.getElementsByTagName("input")[0],
                http_request: document.getElementsByTagName("button")[0] as HTMLButtonElement,
                request: document.getElementsByTagName("textarea")[0],
                responseBody: document.getElementsByTagName("textarea")[0],
                responseHeaders: document.getElementsByTagName("textarea")[0],
                responseURI: document.getElementsByTagName("textarea")[0],
                stats: document.getElementsByTagName("div")[0] as HTMLElement,
                timeout: document.getElementsByTagName("input")[0]
            },
            "receive": function(socket_data:socket_data):void {},
            "tools": {}
        },
        "test-websocket": {
            "connected": false,
            "events": {
                "encryption": function(event:MouseEvent):void {},
                "handshakeSend": function():void {},
                "keyup_frame": function(event:Event):void {},
                "keyup_message": function(event:KeyboardEvent):void {},
                "message_send": function():void {}
            },
            "frameBeautify": function(target:"receive"|"send", valueItem?:string):void {},
            "init": function():void {},
            "nodes": {
                button_handshake: document.getElementsByTagName("button")[0] as HTMLButtonElement,
                button_send: document.getElementsByTagName("button")[0] as HTMLButtonElement,
                encrypt_false: document.getElementsByTagName("input")[0] as HTMLInputElement,
                encrypt_true: document.getElementsByTagName("input")[0] as HTMLInputElement,
                frame_validate: document.getElementsByTagName("p")[0],
                halt_receive: document.getElementsByTagName("input")[0] as HTMLInputElement,
                handshake: document.getElementsByTagName("textarea")[0] as HTMLTextAreaElement,
                handshake_label: document.getElementsByTagName("span")[0],
                handshake_status: document.getElementsByTagName("textarea")[0] as HTMLTextAreaElement,
                handshake_timeout: document.getElementsByTagName("input")[0] as HTMLInputElement,
                message_receive_body: document.getElementsByTagName("textarea")[0] as HTMLTextAreaElement,
                message_receive_frame: document.getElementsByTagName("textarea")[0] as HTMLTextAreaElement,
                message_send_body: document.getElementsByTagName("textarea")[0] as HTMLTextAreaElement,
                message_send_frame: document.getElementsByTagName("textarea")[0] as HTMLTextAreaElement,
                status: document.getElementById("websocket-status") as HTMLTextAreaElement
            },
            "receive": function():void {},
            "timeout": 0,
            "tools": {
                "handshake": function():void {},
                "parse_frame": function():websocket_frame {
                    return {
                        "extended": 0,
                        "fin": true,
                        "len": 0,
                        "mask": false,
                        "maskKey": Buffer.alloc(0),
                        "opcode": 0,
                        "rsv1": false,
                        "rsv2": false,
                        "rsv3": false,
                        "size_buffer": 0,
                        "size_fragment": 0,
                        "startByte": 0
                    };
                }
            },
            "transmit": {
                "": function(socket_data):void {}
            }
        },
        "udp-socket": {
            "events": {
                "create": function():void {},
                "setState": function():void {},
                "toggle_multicast": function():void {},
                "toggle_role": function():void {},
                "toggle_type": function():void {}
            },
            "init": function ():void {},
            "nodes": {
                button_create: document.getElementsByTagName("button")[0],
                input_address_destination: document.getElementsByTagName("input")[0],
                input_address_source: document.getElementsByTagName("input")[0],
                input_multicast_membership: document.getElementsByTagName("input")[0],
                input_multicast_none: document.getElementsByTagName("input")[8],
                input_multicast_source: document.getElementsByTagName("input")[0],
                input_port_destination: document.getElementsByTagName("input")[0],
                input_port_source: document.getElementsByTagName("input")[0],
                input_role_client: document.getElementsByTagName("input")[0],
                input_role_server: document.getElementsByTagName("input")[0],
                input_type_ipv4: document.getElementsByTagName("input")[0],
                input_type_ipv6: document.getElementsByTagName("input")[0],
                interfaces: document.getElementsByTagName("select")[0],
                multicast_group: document.getElementsByTagName("div")[0] as HTMLElement,
                multicast_interface: document.getElementsByTagName("div")[0] as HTMLElement,
                multicast_membership: document.getElementsByTagName("div")[0] as HTMLElement,
                multicast_source: document.getElementsByTagName("div")[0] as HTMLElement,
                status: document.getElementsByTagName("div")[0] as HTMLElement,
                toggle_client: document.getElementsByTagName("div")[0] as HTMLElement,
                toggle_server: document.getElementsByTagName("div")[0] as HTMLElement
            },
            "receive": function(socket_data:socket_data):void {},
            tools: {}
        },
        "users": {
            "dataName": "user",
            "nodes": {
                caseSensitive: document.getElementsByTagName("input")[0],
                count: document.getElementsByTagName("em")[0],
                filter_column: document.getElementsByTagName("select")[0],
                filter_count: document.getElementsByTagName("em")[0],
                filter_value: document.getElementsByTagName("input")[0],
                list: document.getElementsByTagName("tbody")[0],
                update_button: document.getElementsByTagName("button")[0],
                update_duration: document.getElementsByTagName("time")[0],
                update_text: document.getElementsByTagName("time")[0]
            },
            "receive": function():void {}, // not used
            "row": function(record_item:type_lists, tr:HTMLElement):void {},
            sort_name: [""],
            time: 0
        }
    },
    shared_services: {
        "cancel": function(event:MouseEvent):void {},
        "color": function(id:string, type:type_dashboard_list):type_activation_status {return ["green", "online"];},
        "create": function(event:Event):void {},
        "details": function(event:Event):void {},
        "edit": function(event:Event):void {},
        "shellResize": function(config:config_resize):void {},
        "title": function(id:string, type:type_dashboard_list):HTMLElement {return document.getElementsByTagName("div")[0];}
    },
    socket: core({
        "close": function():void {},
        "message": function(event:websocket_event):void {},
        "open": function(event:Event):void {},
        "type": "dashboard"
    }),
    tables: {
        "cell": function(tr:HTMLElement, text:string, raw:string):void {},
        "filter": function(event:Event, target?:HTMLInputElement):void {},
        "init": function(module:module_list|section_ports_application|section_sockets_application):void {},
        "populate": function(module:module_list, item:type_list_services):void {},
        "receive": function(socket_data:socket_data):void {},
        "sort": function(event:MouseEvent, table?:HTMLElement, heading_index?:number):void {},
        "update": function(event:MouseEvent):void {}
    },
    utility: {
        "baseline": function():void {},
        "clock": function(socket_data:socket_data):void {},
        "nodes": {
            clock: document.getElementsByTagName("time")[0],
            load: document.getElementsByTagName("time")[0],
            main: document.getElementsByTagName("main")[0]
        },
        "performance_get": function(section:type_dashboard_sections):string {return "";},
        "performance_set": function(section:type_dashboard_sections):void {},
        "resize": function():void {},
        "setState": function():void {}
    }
};
export default dashboard;