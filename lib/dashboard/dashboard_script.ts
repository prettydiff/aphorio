
import core from "../browser/core.js";
// @ts-expect-error - TypeScript claims xterm has no default export, but this is how the documentation says to use it.
import Terminal from "@xterm/xterm";

// cspell: words bootable, buildx, containerd, PUID, PGID, serv, winget
const dashboard = function dashboard():void {
    let loaded:boolean = false,
        section:type_dashboard_sections = "web";
    const payload:transmit_dashboard = null,
        local:string = localStorage.state,
        state:state_store = (local === undefined || local === null)
            ? {
                dns: {
                    hosts: "",
                    types: ""
                },
                fileSystem: {
                    path: "",
                    search: ""
                },
                hash: {
                    algorithm: "sha3-512",
                    digest: "hex",
                    hashFunction: "hash",
                    source: "",
                    type: "string"
                },
                http: {
                    encryption: true,
                    request: ""
                },
                nav: "servers",
                table_os: {
                    processes: {
                        filter_column: 0,
                        filter_sensitive: true,
                        filter_value: ""
                    },
                    services: {
                        filter_column: 0,
                        filter_sensitive: true,
                        filter_value: ""
                    },
                    sockets: {
                        filter_column: 0,
                        filter_sensitive: true,
                        filter_value: ""
                    }
                },
                tables: {},
                terminal: ""
            }
            : JSON.parse(local),
        utility:module_utility = {
            // reset the UI to a near empty baseline
            baseline: function dashboard_utilityBaseline():void {
                if (loaded === true) {
                    const serverList:HTMLElement = document.getElementById("servers").getElementsByClassName("server-list")[0] as HTMLElement,
                        logs_old:HTMLElement = document.getElementById("application-logs").getElementsByTagName("ul")[0],
                        sockets_old:HTMLElement = document.getElementById("sockets").getElementsByTagName("tbody")[0],
                        status:HTMLElement = document.getElementById("connection-status"),
                        terminal_output:HTMLElement = document.getElementById("terminal").getElementsByClassName("terminal-output")[0] as HTMLElement,
                        replace = function dashboard_utilityBaseline_replace(node:HTMLElement, className:boolean):HTMLElement {
                            if (node !== null && node !== undefined && node.parentNode !== null) {
                                const node_new:HTMLElement = document.createElement(node.lowName());
                                if (className === true) {
                                    node_new.setAttribute("class", node.getAttribute("class"));
                                }
                                node.parentNode.appendChild(node_new);
                                node.parentNode.removeChild(node);
                                return node_new;
                            }
                            return null;
                        },
                        server_new:HTMLButtonElement = document.getElementById("servers").getElementsByClassName("server-new")[0] as HTMLButtonElement;

                    loaded = false;

                    replace(logs_old, false);
                    replace(sockets_old, false);
                    network.interfaces.nodes.count.textContent = "";
                    network.interfaces.nodes.list.textContent = "";
                    network.interfaces.nodes.update_text.textContent = "";
                    network.sockets.nodes.caseSensitive.checked = true;
                    network.sockets.nodes.count.textContent = "";
                    network.sockets.nodes.filter_column.textContent = "";
                    network.sockets.nodes.filter_count.textContent = "";
                    network.sockets.nodes.filter_value.value = "";
                    network.sockets.nodes.list.textContent = "";
                    network.sockets.nodes.update_text.textContent = "";
                    if (servers.compose.nodes !== null) {
                        servers.compose.nodes.containers_list = replace(servers.compose.nodes.containers_list, true);
                        servers.compose.nodes.variables_list = replace(servers.compose.nodes.variables_list, true);
                        if (servers.compose.nodes.containers_new.disabled === true) {
                            const compose_containers_cancel:HTMLButtonElement = document.getElementById("compose").getElementsByClassName("section")[1].getElementsByClassName("server-cancel")[0] as HTMLButtonElement;
                            compose_containers_cancel.click();
                        }
                        if (servers.compose.nodes.variables_new.disabled === true) {
                            const compose_variable_cancel:HTMLButtonElement = document.getElementById("compose").getElementsByClassName("section")[0].getElementsByClassName("server-cancel")[0] as HTMLButtonElement;
                            compose_variable_cancel.click();
                        }
                    }
                    server_new.disabled = false;
                    servers.web.nodes.list = replace(serverList, true);
                    status.setAttribute("class", "connection-offline");
                    status.getElementsByTagName("strong")[0].textContent = "Offline";
                    system.os.nodes.update_text.textContent = "";
                    system.os.nodes.cpu.arch.textContent = "";
                    system.os.nodes.cpu.cores.textContent = "";
                    system.os.nodes.cpu.endianness.textContent = "";
                    system.os.nodes.cpu.frequency.textContent = "";
                    system.os.nodes.cpu.name.textContent = "";
                    system.os.nodes.memory.free.textContent = "";
                    system.os.nodes.memory.used.textContent = "";
                    system.os.nodes.memory.total.textContent = "";
                    system.os.nodes.os.hostname.textContent = "";
                    system.os.nodes.os.name.textContent = "";
                    system.os.nodes.os.platform.textContent = "";
                    system.os.nodes.os.release.textContent = "";
                    system.os.nodes.os.type.textContent = "";
                    system.os.nodes.os.uptime.textContent = "";
                    system.os.nodes.process.arch.textContent = "";
                    system.os.nodes.process.argv.textContent = "";
                    system.os.nodes.process.cpuSystem.textContent = "";
                    system.os.nodes.process.cpuUser.textContent = "";
                    system.os.nodes.process.cwd.textContent = "";
                    system.os.nodes.process.platform.textContent = "";
                    system.os.nodes.process.pid.textContent = "";
                    system.os.nodes.process.ppid.textContent = "";
                    system.os.nodes.process.uptime.textContent = "";
                    system.os.nodes.process.memoryProcess.textContent = "";
                    system.os.nodes.process.memoryV8.textContent = "";
                    system.os.nodes.process.memoryExternal.textContent = "";
                    system.processes.nodes.caseSensitive.checked = true;
                    system.processes.nodes.count.textContent = "";
                    system.processes.nodes.filter_column.textContent = "";
                    system.processes.nodes.filter_count.textContent = "";
                    system.processes.nodes.filter_value.value = "";
                    system.processes.nodes.list.textContent = "";
                    system.processes.nodes.update_text.textContent = "";
                    system.services.nodes.caseSensitive.checked = true;
                    system.services.nodes.count.textContent = "";
                    system.services.nodes.filter_column.textContent = "";
                    system.services.nodes.filter_count.textContent = "";
                    system.services.nodes.filter_value.value = "";
                    system.services.nodes.list.textContent = "";
                    system.services.nodes.update_text.textContent = "";
                    system.storage.nodes.count.textContent = "";
                    system.storage.nodes.list.textContent = "";
                    system.storage.nodes.update_text.textContent = "";
                    system.users.nodes.caseSensitive.checked = true;
                    system.users.nodes.count.textContent = "";
                    system.users.nodes.filter_column.textContent = "";
                    system.users.nodes.filter_count.textContent = "";
                    system.users.nodes.filter_value.value = "";
                    system.users.nodes.list.textContent = "";
                    system.users.nodes.update_text.textContent = "";
                    tools.terminal.nodes.output = replace(terminal_output, true);
                    if (tools.terminal.socket !== null) {
                        tools.terminal.socket.close();
                        tools.terminal.socket = null;
                    }
                    tools.websocket.nodes.handshake_status.value = "Disconnected.";
                    tools.websocket.nodes.button_handshake.textContent = "Connect";
                    tools.websocket.nodes.status.setAttribute("class", "connection-offline");
                    tools.websocket.nodes.message_receive_body.value = "";
                    tools.websocket.nodes.message_receive_frame.value = "";
                    utility.clock_node.textContent = "00:00:00";
                    utility.socket.socket = null;
                }
            },
            // provides server time
            clock: function dashboard_utilityClock(data_item:socket_data):void {
                const data:services_clock = data_item.data as services_clock,
                    str = function dashboard_utilityClock_str(num:number):string {
                        const date:Date = new Date(num),
                            hour:string = String(date.getHours()),
                            minute:string = String(date.getMinutes()),
                            second:string = String(date.getSeconds()),
                            hours:string = (hour.length === 1)
                                ? `0${hour}`
                                : hour,
                            minutes:string = (minute.length === 1)
                                ? `0${minute}`
                                : minute,
                            seconds:string = (second.length === 1)
                                ? `0${second}`
                                : second;
                        return `${hours}:${minutes}:${seconds}`;
                    };
                utility.clock_node.textContent = `${str(data.time_local)}L (${str(data.time_zulu)}Z)`;
            },
            clock_node: document.getElementById("clock").getElementsByTagName("em")[0],
            // populate the log utility
            log: function dashboard_utilityLog(item:services_dashboard_status):void {
                const li:HTMLElement = document.createElement("li"),
                    timeElement:HTMLElement = document.createElement("time"),
                    ul:HTMLElement = document.getElementById("application-logs").getElementsByTagName("ul")[0],
                    strong:HTMLElement = document.createElement("strong"),
                    code:HTMLElement = document.createElement("code"),
                    time:string = item.time.dateTime(false, null);
                timeElement.appendText(time);
                li.appendChild(timeElement);
                li.setAttribute("class", `log-${item.status}`);
                if (item.status === "error" && item.configuration !== null) {
                    strong.appendText(item.message);
                    code.appendText(JSON.stringify(item.configuration));
                    li.appendChild(strong);
                    li.appendChild(code);
                } else {
                    li.appendText(item.message);
                }
                if (ul.childNodes.length > 100) {
                    ul.removeChild(ul.firstChild);
                }
                ul.appendChild(li);
            },
            // send dashboard service messages
            message_send: function dashboard_utilityMessageSend(data:type_socket_data, service:type_service):void {
                const message:socket_data = {
                        data: data,
                        service: service
                    };
                utility.socket.queue(JSON.stringify(message));
            },
            // gathers state artifacts and saves state data
            setState: function dashboard_utilitySetState():void {
                if (utility.socket.connected === true) {
                    const hashInput:HTMLCollectionOf<HTMLInputElement> = document.getElementById("hash").getElementsByClassName("form")[0].getElementsByTagName("input");
                    state.dns.reverse = tools.dns.nodes.reverse.checked;
                    state.dns.hosts = tools.dns.nodes.hosts.value;
                    state.dns.types = tools.dns.nodes.types.value;
                    state.fileSystem.path = tools.fileSystem.nodes.path.value;
                    state.fileSystem.search = tools.fileSystem.nodes.search.value;
                    state.hash.algorithm = (tools.hash.nodes.algorithm[tools.hash.nodes.algorithm.selectedIndex] === undefined)
                        ? ""
                        : tools.hash.nodes.algorithm[tools.hash.nodes.algorithm.selectedIndex].textContent;
                    state.hash.hashFunction = (hashInput[1].checked === true)
                        ? "base64"
                        : "hash";
                    state.hash.type = (hashInput[3].checked === true)
                        ? "file"
                        : "string";
                    state.hash.digest = (hashInput[5].checked === true)
                        ? "base64"
                        : "hex";
                    state.hash.source = tools.hash.nodes.source.value;
                    state.http.encryption = (tools.http.nodes.encryption.checked === true);
                    state.http.request = tools.http.nodes.request.value;
                    if (tools.terminal.nodes.select[tools.terminal.nodes.select.selectedIndex] !== undefined) {
                        state.terminal = tools.terminal.nodes.select[tools.terminal.nodes.select.selectedIndex].textContent;
                    }
                    if (state.table_os === undefined) {
                        state.table_os = {
                            processes: {
                                filter_column: 0,
                                filter_sensitive: true,
                                filter_value: ""
                            },
                            services: {
                                filter_column: 0,
                                filter_sensitive: true,
                                filter_value: ""
                            },
                            sockets: {
                                filter_column: 0,
                                filter_sensitive: true,
                                filter_value: ""
                            },
                            users: {
                                filter_column: 0,
                                filter_sensitive: true,
                                filter_value: ""
                            }
                        };
                    }
                    if (state.table_os.processes === undefined) {
                        state.table_os.processes = {
                            filter_column: system.processes.nodes.filter_column.selectedIndex,
                            filter_sensitive: system.processes.nodes.caseSensitive.checked,
                            filter_value: system.processes.nodes.filter_value.value
                        };
                    } else {
                        state.table_os.processes.filter_column = system.processes.nodes.filter_column.selectedIndex;
                        state.table_os.processes.filter_sensitive = system.processes.nodes.caseSensitive.checked;
                        state.table_os.processes.filter_value = system.processes.nodes.filter_value.value;
                    }
                    if (state.table_os.services === undefined) {
                        state.table_os.services = {
                            filter_column: system.processes.nodes.filter_column.selectedIndex,
                            filter_sensitive: system.processes.nodes.caseSensitive.checked,
                            filter_value: system.processes.nodes.filter_value.value
                        };
                    } else {
                        state.table_os.services.filter_column = system.services.nodes.filter_column.selectedIndex;
                        state.table_os.services.filter_sensitive = system.services.nodes.caseSensitive.checked;
                        state.table_os.services.filter_value = system.services.nodes.filter_value.value;
                    }
                    if (state.table_os.sockets === undefined) {
                        state.table_os.sockets = {
                            filter_column: system.processes.nodes.filter_column.selectedIndex,
                            filter_sensitive: system.processes.nodes.caseSensitive.checked,
                            filter_value: system.processes.nodes.filter_value.value
                        };
                    } else {
                        state.table_os.sockets.filter_column = network.sockets.nodes.filter_column.selectedIndex;
                        state.table_os.sockets.filter_sensitive = network.sockets.nodes.caseSensitive.checked;
                        state.table_os.sockets.filter_value = network.sockets.nodes.filter_value.value;
                    }
                    if (state.table_os.users === undefined) {
                        state.table_os.users = {
                            filter_column: system.processes.nodes.filter_column.selectedIndex,
                            filter_sensitive: system.processes.nodes.caseSensitive.checked,
                            filter_value: system.processes.nodes.filter_value.value
                        };
                    } else {
                        state.table_os.users.filter_column = system.users.nodes.filter_column.selectedIndex;
                        state.table_os.users.filter_sensitive = system.users.nodes.caseSensitive.checked;
                        state.table_os.users.filter_value = system.users.nodes.filter_value.value;
                    }
                    localStorage.state = JSON.stringify(state);
                }
            },
            socket: core({
                close: function dashboard_socketClose():void {
                    const status:HTMLElement = document.getElementById("connection-status");
                    if (status !== null && status.getAttribute("class") === "connection-online") {
                        utility.log({
                            action: "activate",
                            configuration: null,
                            message: "Dashboard browser connection offline.",
                            status: "error",
                            time: Date.now(),
                            type: "log"
                        });
                    }
                    utility.socket.connected = false;
                    utility.baseline();
                    setTimeout(function core_close_delay():void {
                        utility.socket.invoke();
                    }, 10000);
                },
                message: function dashboard_socketMessage(event:websocket_event):void {
                    if (typeof event.data === "string") {
                        const message_item:socket_data = JSON.parse(event.data),
                            service_map:map_messages = {
                                "dashboard-clock": utility.clock,
                                "dashboard-dns": tools.dns.receive,
                                "dashboard-fileSystem": tools.fileSystem.receive,
                                "dashboard-hash": tools.hash.receive,
                                "dashboard-http": tools.http.receive,
                                "dashboard-os-all": system.os.service,
                                "dashboard-os-disk": system.os.service,
                                "dashboard-os-intr": system.os.service,
                                "dashboard-os-main": system.os.service,
                                "dashboard-os-proc": system.os.service,
                                "dashboard-os-serv": system.os.service,
                                "dashboard-os-sock": system.os.service,
                                "dashboard-os-user": system.os.service,
                                "dashboard-status": utility.status,
                                "dashboard-websocket-message": tools.websocket.message_receive,
                                "dashboard-websocket-status": tools.websocket.status
                            };
                        service_map[message_item.service](message_item);
                    }
                },
                open: function dashboard_socketOpen(event:Event):void {
                    const target:WebSocket = event.target as WebSocket,
                        fileSearch:string = tools.fileSystem.nodes.search.value,
                        fileRequest:services_fileSystem = {
                            address: tools.fileSystem.nodes.path.value,
                            dirs: null,
                            failures: null,
                            file: null,
                            parent: null,
                            search: (fileSearch === "")
                                ? null
                                : fileSearch,
                            sep: null
                        },
                        status:HTMLElement = document.getElementById("connection-status");
                    utility.socket.connected = true;
                    if (status !== null ) {
                        status.getElementsByTagName("strong")[0].textContent = "Online";
                        status.setAttribute("class", "connection-online");
                    }
                    
                    utility.socket.socket = target;
                    if (utility.socket.queueStore.length > 0) {
                        do {
                            utility.socket.socket.send(utility.socket.queueStore[0]);
                            utility.socket.queueStore.splice(0, 1);
                        } while (utility.socket.queueStore.length > 0);
                    }
                    utility.message_send(fileRequest, "dashboard-fileSystem");
                    if (loaded === false) {
                        // populate log data
                        payload.logs.forEach(function dashboard_utilityInit_logsEach(item:services_dashboard_status):void {
                            utility.log(item);
                        });
                        loaded = true;
                        utility.log({
                            action: "activate",
                            configuration: null,
                            message: "Dashboard browser connection online.",
                            status: "informational",
                            time: Date.now(),
                            type: "log"
                        });

                        servers.web.list();
                        servers.compose.init();
                        network.sockets.init();
                        network.interfaces.init();
                        system.os.init();
                        system.processes.init();
                        system.services.init();
                        system.storage.init();
                        system.users.init();
                        tools.terminal.init();
                        tools.fileSystem.init();
                        tools.http.init();
                        tools.websocket.init();
                        tools.dns.init();
                        tools.hash.init();
                    }
                },
                type: "dashboard"
            }),
            // dynamically populates the filter select elements used for filtering tables
            sort_column_names: function dashboard_utilitySortColumnNames(table:HTMLElement, select:HTMLSelectElement):void {
                const th:HTMLCollectionOf<HTMLElement> = table.getElementsByTagName("th"),
                    len:number = th.length;
                let index:number = 0,
                    option:HTMLElement = document.createElement("option");
                option.textContent = "All";
                select.appendChild(option);
                if (len > 0) {
                    do {
                        option = document.createElement("option");
                        option.textContent = th[index].getElementsByTagName("button")[0].textContent;
                        select.appendChild(option);
                        index = index + 1;
                    } while (index < len);
                }
            },
            // sort data from html tables
            sort_tables: function dashboard_utilitySortTables(event:MouseEvent, table?:HTMLElement, heading_index?:number):void {
                const target:HTMLElement = (event === null)
                        ? null
                        : event.target,
                    tableElement:HTMLElement = (event === null)
                        ? table
                        : target.getAncestor("table", "tag"),
                    tbody_old:HTMLElement = tableElement.getElementsByTagName("tbody")[0],
                    tbody_new:HTMLElement = document.createElement("tbody"),
                    tr_list:HTMLCollectionOf<HTMLElement> = tbody_old.getElementsByTagName("tr"),
                    records:HTMLElement[] = [],
                    tr_length:number = tr_list.length;
                if (tr_length > 0) {
                    const th:HTMLElement = (event === null)
                            ? table.getElementsByTagName("th")[heading_index]
                            : target.parentNode,
                        tr_head:HTMLElement = th.parentNode,
                        ths:HTMLCollectionOf<HTMLElement> = tr_head.getElementsByTagName("th"),
                        cells_length:number = ths.length,
                        button:HTMLElement = (event === null)
                            ? th.getElementsByTagName("button")[0]
                            : target,
                        direction:-1|1 = Number(button.dataset.dir) as -1,
                        id:string = tableElement.getAncestor("tab", "class").getAttribute("id");
                    let index_th:number = (event === null)
                            ? heading_index
                            : cells_length,
                        index_tr:number = 0;
                    if (event !== null) {
                        const tables:HTMLCollectionOf<HTMLElement> = document.getElementById(id).getElementsByTagName("table");
                        let tables_index:number = tables.length;
                        // apply change of direction
                        if (direction === -1) {
                            button.setAttribute("data-dir", "1");
                        } else {
                            button.setAttribute("data-dir", "-1");
                        }

                        // find which column to sort by
                        do {
                            index_th = index_th - 1;
                            if (ths[index_th] === th) {
                                break;
                            }
                        } while (index_th > 0);
                        tableElement.setAttribute("data-column", String(index_th));

                        // save state
                        if (state.tables === undefined) {
                            state.tables = {};
                        }
                        do {
                            tables_index = tables_index - 1;
                        } while (tables_index > 0 && tables[tables_index] !== tableElement);
                        state.tables[`${id}-${tables_index}`] = {
                            col: index_th,
                            dir: direction
                        };
                        utility.setState();
                    }
                    do {
                        records.push(tr_list[index_tr]);
                        index_tr = index_tr + 1;
                    } while (index_tr < tr_length);

                    records.sort(function dashboard_utilitySortHTML_records(a:HTMLElement, b:HTMLElement):-1|0|1 {
                        const td_a:HTMLElement = a.getElementsByTagName("td")[index_th],
                            td_b:HTMLElement = b.getElementsByTagName("td")[index_th],
                            text_a:string = (td_a.dataset.raw === undefined)
                                ? td_a.textContent
                                : td_a.dataset.raw,
                            text_b:string = (td_b.dataset.raw === undefined)
                                ? td_b.textContent
                                : td_b.dataset.raw,
                            numb_a:number = Number(text_a),
                            numb_b:number = Number(text_b);
                        if (isNaN(numb_a) === false && isNaN(numb_b) === false) {
                            if (numb_a < numb_b) {
                                return direction;
                            }
                            if (numb_a > numb_b) {
                                return (direction * -1 as -1);
                            }
                            return 0;
                        }
                        if (text_a < text_b) {
                            return direction;
                        }
                        if (text_a > text_b) {
                            return (direction * -1 as -1);
                        }
                        return 0;
                    });

                    index_tr = 0;
                    do {
                        records[index_tr].setAttribute("class", (index_tr % 2 === 0) ? "even" : "odd");
                        tbody_new.appendChild(records[index_tr]);
                        index_tr = index_tr + 1;
                    } while (index_tr < tr_length);
                    tbody_old.parentNode.appendChild(tbody_new);
                    tbody_old.parentNode.removeChild(tbody_old);
                }
            },
            // living status updates for servers, containers, and their sockets
            status: function dashboard_utilityStatus(data_item:socket_data):void {
                const data:services_dashboard_status = data_item.data as services_dashboard_status,
                    socket_destroy = function dashboard_utilityStatus_socketDestroy(hash:string):void {
                        const tbody:HTMLElement = document.getElementById("sockets").getElementsByTagName("tbody")[0],
                            tr:HTMLCollectionOf<HTMLElement> = tbody.getElementsByTagName("tr");
                        let index:number = tr.length;
                        if (index > 0) {
                            do {
                                index = index - 1;
                                if (tr[index].getElementsByTagName("td")[1].textContent === hash || (hash === "dashboard" && tr[index].getElementsByTagName("td")[2].textContent === "dashboard")) {
                                    tbody.removeChild(tr[index]);
                                    return;
                                }
                            } while (index > 0);
                        }
                    };
                if (data.type !== "socket" && data.message !== "Container status refreshed.") {
                    utility.log(data);
                }
                if (data.status === "error") {
                    if (data.type === "socket") {
                        const config:services_socket = data.configuration as services_socket;
                        if (config !== null) {
                            socket_destroy(config.hash);
                        }
                    }
                } else {
                    if (data.type === "server") {
                        const config:services_server = data.configuration as services_server,
                            list:HTMLCollectionOf<HTMLElement> = document.getElementById("servers").getElementsByTagName("li");
                        let index:number = list.length;
                        if (data.action === "destroy") {
                            delete payload.servers[config.name];
                            do {
                                index = index - 1;
                                if (list[index].getAttribute("data-name") === config.name) {
                                    list[index].parentNode.removeChild(list[index]);
                                    return;
                                }
                            } while (index > 0);
                        } else if (data.action === "add" && payload.servers[config.name] === undefined) {
                            payload.servers[config.name] = {
                                config: config,
                                sockets: [],
                                status: {
                                    open: 0,
                                    secure: 0
                                }
                            };
                            const names:string[] = Object.keys(payload.servers),
                                ul_current:HTMLElement = document.getElementById("servers").getElementsByClassName("server-list")[0] as HTMLElement,
                                ul:HTMLElement = (ul_current === undefined)
                                    ? document.createElement("ul")
                                    : ul_current;
                            payload.servers[config.name].status = {
                                open: 0,
                                secure: 0
                            };
                            names.sort(function dashboard_serverList_sort(a:string, b:string):-1|1 {
                                if (a < b) {
                                    return -1;
                                }
                                return 1;
                            });
                            index = names.length;
                            if (names[names.length - 1] === config.name) {
                                ul.appendChild(servers.shared.title(config.name, "server"));
                            } else if (names[0] === config.name) {
                                ul.insertBefore(servers.shared.title(config.name, "server"), ul.firstChild);
                            } else {
                                do {
                                    index = index - 1;
                                    if (names[index] === config.name) {
                                        ul.insertBefore(servers.shared.title(config.name, "server"), ul.childNodes[index - 1]);
                                        break;
                                    }
                                } while (index > 0);
                            }
                        } else if (data.action === "activate") {
                            payload.servers[config.name].status = config.ports;
                            const color:type_activation_status = servers.shared.color(config.name, "server");
                            let oldPorts:HTMLElement = null,
                                activate:HTMLButtonElement = null,
                                deactivate:HTMLButtonElement = null;
                            do {
                                index = index - 1;
                                if (list[index].getAttribute("data-name") === config.name) {
                                    if (color[0] !== null) {
                                        list[index].setAttribute("class", color[0]);
                                    }
                                    list[index].getElementsByTagName("h4")[0].getElementsByTagName("button")[0].lastChild.textContent = `${config.name} - ${color[1]}`;
                                    oldPorts = list[index].getElementsByClassName("active-ports")[0] as HTMLElement;
                                    activate = list[index].getElementsByClassName("server-activate")[0] as HTMLButtonElement;
                                    deactivate = list[index].getElementsByClassName("server-deactivate")[0] as HTMLButtonElement;
                                    if (oldPorts !== undefined) {
                                        oldPorts.parentNode.insertBefore(servers.web.activePorts(config.name), oldPorts);
                                        oldPorts.parentNode.removeChild(oldPorts);
                                    }
                                    if (activate !== undefined) {
                                        if (color[0] === "green") {
                                            activate.disabled = true;
                                        } else {
                                            activate.disabled = false;
                                        }
                                    }
                                    if (deactivate !== undefined) {
                                        if (color[0] === "red") {
                                            deactivate.disabled = true;
                                        } else {
                                            deactivate.disabled = false;
                                        }
                                    }
                                    break;
                                }
                            } while (index > 0);
                        } else if (data.action === "deactivate") {
                            payload.servers[config.name].status = {
                                open: 0,
                                secure: 0
                            };
                            let oldPorts:HTMLElement = null,
                                activate:HTMLButtonElement = null,
                                deactivate:HTMLButtonElement = null;
                            do {
                                index = index - 1;
                                if (list[index].getAttribute("data-name") === config.name) {
                                    list[index].setAttribute("class", "red");
                                    list[index].getElementsByTagName("h4")[0].getElementsByTagName("button")[0].lastChild.textContent = `${config.name} - offline`;
                                    oldPorts = list[index].getElementsByClassName("active-ports")[0] as HTMLElement;
                                    activate = list[index].getElementsByClassName("server-activate")[0] as HTMLButtonElement;
                                    deactivate = list[index].getElementsByClassName("server-deactivate")[0] as HTMLButtonElement;
                                    if (oldPorts !== undefined) {
                                        oldPorts.parentNode.insertBefore(servers.web.activePorts(config.name), oldPorts);
                                        oldPorts.parentNode.removeChild(oldPorts);
                                    }
                                    if (activate !== undefined) {
                                        activate.disabled = false;
                                    }
                                    if (deactivate !== undefined) {
                                        deactivate.disabled = true;
                                    }
                                    break;
                                }
                            } while (index > 0);
                        } else if (data.action === "modify") {
                            const list:HTMLElement = document.getElementById("servers").getElementsByClassName("server-list")[0] as HTMLElement,
                                items:HTMLCollectionOf<HTMLElement> = list.getElementsByTagName("li");
                            let index:number = items.length;
                            payload.servers[config.name].config = config;
                            if (index > 0) {
                                do {
                                    index = index - 1;
                                    if (items[index].getAttribute("data-name") === config.name) {
                                        list.insertBefore(servers.shared.title(config.name, "server"), items[index]);
                                        list.removeChild(items[index]);
                                        break;
                                    }
                                } while (index > 0);
                            }
                        }
                    } else if (data.type === "socket") {
                        const config:services_socket = data.configuration as services_socket;
                        if (data.action === "add") {
                            socket_destroy(config.hash);
                            servers.web.socket_add(config);
                        } else if (data.action === "destroy") {
                            socket_destroy(config.hash);
                        }
                    } else if (data.type === "compose-containers") {
                        if (data.action === "destroy") {
                            servers.compose.destroyContainer(data.configuration as services_docker_compose);
                        } else {
                            servers.compose.container(data.configuration as services_docker_compose);
                        }
                    } else if (data.type === "compose-variables") {
                        const store:store_string = data.configuration as store_string;
                        payload.compose.variables = store;
                        servers.compose.list("variables");
                    }
                }
            },
            // populate large data tables
            tables: function dashboard_utilityTables(module:module_processes|module_services|module_sockets|module_users, item:services_os_proc|services_os_serv|services_os_sock|services_os_user):void {
                const len:number = item.data.length;
                if (len > 0 && module.nodes.list !== null && module.nodes.list.parentNode !== null) {
                    const list:HTMLElement = module.nodes.list,
                        table:HTMLElement = list.parentNode,
                        cell = function dashboard_utilityTables_cell(tr:HTMLElement, text:string, raw:string):void {
                            const td:HTMLElement = document.createElement("td");
                            td.textContent = text;
                            if (raw !== null) {
                                td.setAttribute("class", "right");
                                if (raw !== text) {
                                    td.setAttribute("data-raw", raw);
                                }
                            }
                            tr.appendChild(td);
                        },
                        populate_process = function dashboard_utilityTables_populateProcess(tr:HTMLElement, record:os_proc):void {
                            const time:string = (record.time === null)
                                    ? (payload.platform === "win32")
                                        ? (0).time().replace(/000$/, "")
                                        : (0).time().replace(/\.0+$/, "")
                                    : (payload.platform === "win32")
                                        ? record.time.time().replace(/000$/, "")
                                        : record.time.time().replace(/\.0+$/, ""),
                                memory:string = (record.memory === null)
                                    ? "0"
                                    : record.memory.commas(),
                                id:string = String(record.id);
                            cell(tr, record.name, null);
                            cell(tr, id, id);
                            cell(tr, memory, (record.memory === null)
                                ? "0"
                                : String(record.memory));
                            cell(tr, time, (record.time === null)
                                ? "0"
                                : String(record.time));
                            cell(tr, record.user, null);
                        },
                        populate_services = function dashboard_utilityTables_populateServices(tr:HTMLElement, record:os_service):void {
                            cell(tr, record.name, null);
                            cell(tr, record.status, null);
                            cell(tr, record.description, null);
                        },
                        populate_sockets = function dashboard_utilityTable_populateSockets(tr:HTMLElement, record:os_sockets):void {
                            cell(tr, record.type, null);
                            cell(tr, record["local-address"], null);
                            cell(tr, String(record["local-port"]), null);
                            cell(tr, record["remote-address"], null);
                            cell(tr, String(record["remote-port"]), null);
                        },
                        populate_users = function dashboard_utilityTable_populateUsers(tr:HTMLElement, record:os_user):void {
                            const uid:string = String(record.uid),
                                proc:string = String(record.proc);
                            cell(tr, record.name, null);
                            cell(tr, uid, uid);
                            cell(tr, (record.lastLogin === 0)
                                ? "never"
                                : record.lastLogin.dateTime(true, null), String(record.lastLogin));
                            cell(tr, proc, proc);
                            cell(tr, record.type, null);
                        },
                        sort_index:number = Number(table.dataset.column),
                        sort_name:string = (module === network.sockets)
                            ? ["type", "local-address", "local-port", "remote-address", "remote-port"][sort_index]
                            : (module === system.processes)
                                ? ["name", "id", "memory", "time", "user"][sort_index]
                                : (module === system.services)
                                    ? ["name", "status", "description"][sort_index]
                                    : ["name", "uid", "lastLogin", "proc"][sort_index],
                        sort_direction:-1|1 = Number(table.getElementsByTagName("th")[sort_index].getElementsByTagName("button")[0].dataset.dir) as -1|1;
                    let index:number = 0,
                        row:HTMLElement = null;
                    list.textContent = "";
                    item.data.sort(function dashboard_utilityTable_sort(a:os_proc|os_service|os_sockets|os_user,b:os_proc|os_service|os_sockets|os_user):-1|1 {
                        // @ts-expect-error - inferring types based upon property names across unrelated objects of dissimilar property name is problematic
                        if (a[sort_name as "name"|"type"] as string < b[sort_name as "name"|"type"] as string) {
                            return sort_direction;
                        }
                        return (sort_direction * -1) as 1;
                    });
                    do {
                        row = document.createElement("tr");
                        if (module === system.processes) {
                            populate_process(row, item.data[index] as os_proc);
                        } else if (module === system.services) {
                            populate_services(row, item.data[index] as os_service);
                        } else if (module === network.sockets) {
                            populate_sockets(row, item.data[index] as os_sockets);
                        } else if (module === system.users) {
                            populate_users(row, item.data[index] as os_user);
                        }
                        row.setAttribute("class", (index % 2 === 0) ? "even" : "odd");
                        list.appendChild(row);
                        index = index + 1;
                    } while (index < len);
                    module.nodes.update_text.textContent = item.time.dateTime(true, payload.timeZone_offset);
                    module.nodes.count.textContent = String(item.data.length);
                    module.nodes.list = table.getElementsByTagName("tbody")[0];
                    utility.table_filter(null, module.nodes.filter_value);
                    if (module === system.processes) {
                        payload.os.processes = item as services_os_proc;
                    } else if (module === system.services) {
                        payload.os.services = item as services_os_serv;
                    } else if (module === network.sockets) {
                        payload.os.sockets = item as services_os_sock;
                    } else if (module === system.users) {
                        payload.os.users = item as services_os_user;
                    }
                }
            },
            // filter large data tables
            table_filter: function dashboard_utilityTableFilter(event:Event, target?:HTMLInputElement):void {
                if (event !== null) {
                    const key:KeyboardEvent = event as KeyboardEvent;
                    if (event.type === "keyup" && key.key !== "Enter") {
                        return;
                    }
                    target = event.target as HTMLInputElement;
                    utility.setState();
                }
                const section:string = target.getAncestor("tab", "class").getAttribute("id"),
                    module:module_processes|module_services|module_sockets|module_users = (section === "processes")
                        ? system.processes
                        : (section === "services")
                            ? system.services
                            : (section === "sockets")
                                ? network.sockets
                                : system.users,
                    select:HTMLSelectElement = module.nodes.filter_column,
                    columnIndex:number = select.selectedIndex - 1,
                    list:HTMLCollectionOf<HTMLElement> = module.nodes.list.getElementsByTagName("tr"),
                    cell_length:number = module.nodes.list.parentNode.getElementsByTagName("th").length,
                    sensitive:boolean = module.nodes.caseSensitive.checked,
                    value:string = (sensitive === true)
                        ? module.nodes.filter_value.value
                        : module.nodes.filter_value.value.toLowerCase();
                let index:number = list.length,
                    cells:HTMLCollectionOf<HTMLElement> = null,
                    count:number = 0,
                    test:boolean = false,
                    cell_index:number = 0;
                if (index > 0) {
                    do {
                        index = index - 1;
                        cells = list[index].getElementsByTagName("td");
                        cell_index = cell_length;
                        if (value === "") {
                            list[index].style.display = "table-row";
                            count = count + 1;
                        } else if (columnIndex < 0) {
                            test = false;
                            do {
                                cell_index = cell_index - 1;
                                if ((sensitive === true && cells[cell_index].textContent.includes(value) === true) || (sensitive === false && cells[cell_index].textContent.toLowerCase().includes(value) === true)) {
                                    list[index].style.display = "table-row";
                                    count = count + 1;
                                    test = true;
                                    break;
                                }
                            } while (cell_index > 0);
                            if (test === false) {
                                list[index].style.display = "none";
                            }
                        } else if ((sensitive === true && cells[columnIndex].textContent.includes(value) === true) || (sensitive === false && cells[columnIndex].textContent.toLowerCase().includes(value) === true)) {
                            list[index].style.display = "table-row";
                            count = count + 1;
                        } else {
                            list[index].style.display = "none";
                        }
                    } while (index > 0);
                    module.nodes.filter_count.textContent = String(count);
                }
            },
            // request updated table data
            table_update: function dashboard_utilityTableUpdate(event:MouseEvent):void {
                const target:HTMLElement = event.target,
                    id:string = target.getAncestor("tab", "class").getAttribute("id"),
                    map:store_string = {
                        interfaces: "intr",
                        os: "main",
                        processes: "proc",
                        services: "serv",
                        sockets: "sock",
                        storage: "disk",
                        users: "user"
                    };
                utility.message_send(null, `dashboard-os-${map[id]}` as type_service);
            }
        },
        network:structure_network = {
            interfaces: {
                init: function dashboard_interfaceInit():void {
                    network.interfaces.nodes.update_button.onclick = utility.table_update;
                    network.interfaces.list(payload.os.interfaces);
                },
                list: function dashboard_interfacesList(item:services_os_intr):void {
                    const output_old:HTMLElement = network.interfaces.nodes.list,
                        output_new:HTMLElement = document.createElement("div"),
                        keys:string[] = Object.keys(item.data),
                        len:number = keys.length,
                        data_item = function dashboard_interfacesList_dataItem(ul:HTMLElement, item:node_os_NetworkInterfaceInfo, key:"address"|"cidr"|"family"|"internal"|"mac"|"netmask"|"scopeid"):void {
                            if (item[key] !== undefined) {
                                const li:HTMLElement = document.createElement("li"),
                                    strong:HTMLElement = document.createElement("strong"),
                                    span:HTMLElement = document.createElement("span");
                                strong.textContent = key;
                                span.textContent = String(item[key]);
                                li.appendChild(strong);
                                li.appendChild(span);
                                ul.appendChild(li);
                            }
                        },
                        property = function dashboard_interfacesList_property():void {
                            const ul:HTMLElement = document.createElement("ul");
                            ul.setAttribute("class", "os-interface");
                            data_item(ul, item.data[keys[index]][index_child], "address");
                            data_item(ul, item.data[keys[index]][index_child], "netmask");
                            data_item(ul, item.data[keys[index]][index_child], "family");
                            data_item(ul, item.data[keys[index]][index_child], "mac");
                            data_item(ul, item.data[keys[index]][index_child], "internal");
                            data_item(ul, item.data[keys[index]][index_child], "cidr");
                            data_item(ul, item.data[keys[index]][index_child], "scopeid");
                            div.appendChild(ul);
                        };
                    let index:number = 0,
                        index_child:number = 0,
                        len_child:number = 0,
                        div:HTMLElement = null,
                        h3:HTMLElement = null;
                    if (len > 0) {
                        do {
                            div = document.createElement("div");
                            h3 = document.createElement("h3");
                            h3.textContent = keys[index];
                            div.appendChild(h3);
                            len_child = item.data[keys[index]].length;
                            if (len_child > 0) {
                                index_child = 0;
                                do {
                                    property();
                                    index_child = index_child + 1;
                                } while (index_child < len_child);
                            }
                            div.setAttribute("class", "section");
                            output_new.appendChild(div);
                            index = index + 1;
                        } while (index < len);
                        output_new.setAttribute("class", "item-list");
                        output_old.parentNode.insertBefore(output_new, output_old);
                        output_old.parentNode.removeChild(output_old);
                        network.interfaces.nodes.list = output_new;
                        network.interfaces.nodes.count.textContent = String(len);
                        network.interfaces.nodes.update_text.textContent = item.time.dateTime(true, payload.timeZone_offset);
                        payload.os.interfaces = item;
                    }
                },
                nodes: {
                    count: document.getElementById("interfaces").getElementsByClassName("table-stats")[0].getElementsByTagName("em")[0],
                    list: document.getElementById("interfaces").getElementsByClassName("item-list")[0] as HTMLElement,
                    update_button: document.getElementById("interfaces").getElementsByClassName("table-stats")[0].getElementsByTagName("button")[0],
                    update_text: document.getElementById("interfaces").getElementsByClassName("table-stats")[0].getElementsByTagName("em")[1]
                }
            },
            sockets: {
                init: function dashboard_socketsInit():void {
                    network.sockets.nodes.filter_column.selectedIndex = state.table_os.sockets.filter_column;
                    network.sockets.nodes.caseSensitive.checked = state.table_os.sockets.filter_sensitive;
                    network.sockets.nodes.filter_value.value = state.table_os.sockets.filter_value;
                    network.sockets.nodes.filter_column.onchange = utility.table_filter;
                    network.sockets.nodes.caseSensitive.onclick = utility.setState;
                    network.sockets.nodes.filter_value.onblur = utility.table_filter;
                    network.sockets.nodes.filter_value.onkeyup = utility.table_filter;
                    network.sockets.nodes.update_button.onclick = utility.table_update;
                    utility.sort_column_names(network.sockets.nodes.list.parentNode, network.sockets.nodes.filter_column);
                    utility.tables(network.sockets, payload.os.sockets);
                },
                nodes: {
                    caseSensitive: document.getElementById("sockets").getElementsByClassName("table-filters")[0].getElementsByTagName("input")[1],
                    count: document.getElementById("sockets").getElementsByClassName("table-stats")[0].getElementsByTagName("em")[0],
                    filter_column: document.getElementById("sockets").getElementsByClassName("table-filters")[0].getElementsByTagName("select")[0],
                    filter_count: document.getElementById("sockets").getElementsByClassName("table-stats")[0].getElementsByTagName("em")[1],
                    filter_value: document.getElementById("sockets").getElementsByClassName("table-filters")[0].getElementsByTagName("input")[0],
                    list: document.getElementById("sockets").getElementsByClassName("section")[2].getElementsByTagName("tbody")[0],
                    update_button: document.getElementById("sockets").getElementsByClassName("table-stats")[0].getElementsByTagName("button")[0],
                    update_text: document.getElementById("sockets").getElementsByClassName("table-stats")[0].getElementsByTagName("em")[2]
                }
            }
        },
        servers:structure_servers = {
            compose: {
                activePorts: function dashboard_composeActivePorts(name_server:string):HTMLElement {
                    const div:HTMLElement = document.createElement("div"),
                        h5:HTMLElement = document.createElement("h5"),
                        portList:HTMLElement = document.createElement("ul"),
                        ports:services_docker_compose_publishers[] = payload.compose.containers[name_server].publishers;
                    let portItem:HTMLElement = null,
                        index:number = ports.length;
                    if (index < 1) {
                        return div;
                    }
                    ports.sort(function dashboard_composeActivePorts_sort(a:services_docker_compose_publishers, b:services_docker_compose_publishers):-1|1 {
                        if (a.PublishedPort < b.PublishedPort) {
                            return 1;
                        }
                        return -1;
                    });
                    h5.appendText("Active Ports");
                    div.appendChild(h5);
                    div.setAttribute("class", "active-ports");
                    do {
                        index = index - 1;
                        portItem = document.createElement("li");
                        portItem.appendText(`${ports[index].PublishedPort} (${ports[index].Protocol.toUpperCase()})`);
                        portList.appendChild(portItem);
                        // prevent redundant output in the case of reporting for both IPv4 and IPv6
                        if (index > 0 && ports[index - 1].PublishedPort === ports[index].PublishedPort) {
                            index = index - 1;
                        }
                    } while (index > 0);
                    div.appendChild(portList);
                    return div;
                },
                cancelVariables: function dashboard_composeCancelVariables(event:MouseEvent):void {
                    const target:HTMLElement = event.target.getAncestor("div", "tag"),
                        section:HTMLElement = target.getAncestor("section", "class"),
                        edit:HTMLElement = section.getElementsByClassName("edit")[0] as HTMLElement;
                    edit.parentNode.removeChild(edit);
                    servers.compose.nodes.variables_list.style.display = "block";
                    servers.compose.nodes.variables_new.disabled = false;
                },
                container: function dashboard_composeContainer(config:services_docker_compose):void {
                    const list:HTMLCollectionOf<HTMLElement> = servers.compose.nodes.containers_list.getElementsByTagName("li");
                    let index:number = list.length;
                    payload.compose.containers[config.name] = config;
                    if (index > 0) {
                        do {
                            index = index - 1;
                            if (list[index].getAttribute("data-name") === config.name) {
                                servers.compose.nodes.containers_list.insertBefore(servers.shared.title(config.name, "container"), list[index]);
                                servers.compose.nodes.containers_list.removeChild(list[index]);
                                return;
                            }
                        } while (index > 0);
                    }
                    servers.compose.nodes.containers_list.appendChild(servers.shared.title(config.name, "container"));
                },
                create: function dashboard_composeCreate(event:MouseEvent):void {
                    const button:HTMLButtonElement = event.target as HTMLButtonElement;
                    button.disabled = true;
                    servers.shared.details(event);
                },
                destroyContainer: function dashboard_composeDestroyContainer(config:services_docker_compose):void {
                    delete payload.compose.containers[config.name];
                    if (servers.compose.nodes !== null) {
                        const list:HTMLCollectionOf<HTMLElement> = servers.compose.nodes.containers_list.getElementsByTagName("li");
                        let index:number = list.length;
                        if (index > 0) {
                            do {
                                index = index - 1;
                                if (list[index].getAttribute("data-name") === config.name) {
                                    list[index].parentNode.removeChild(list[index]);
                                    break;
                                }
                            } while (index > 0);
                        }
                    }
                },
                editVariables: function dashboard_composeEditVariables():void {
                    const p:HTMLElement = document.createElement("p"),
                        buttons:HTMLElement = document.createElement("p"),
                        label:HTMLElement = document.createElement("label"),
                        edit:HTMLElement = document.createElement("div"),
                        ul:HTMLElement = document.createElement("ul"),
                        textArea:HTMLTextAreaElement = document.createElement("textarea"),
                        keys:string[] = Object.keys(payload.compose.variables).sort(),
                        output:string[] = [],
                        len:number = keys.length,
                        cancel:HTMLElement = document.createElement("button"),
                        save:HTMLElement = document.createElement("button");
                    let index:number = 0;
                    edit.setAttribute("class", "edit");
                    if (len > 0) {
                        do {
                            output.push(`"${keys[index]}": "${payload.compose.variables[keys[index]]}"`);
                            index = index + 1;
                        } while (index < len);
                        textArea.value = `{\n    ${output.join(",\n    ")}\n}`;
                    }
                    cancel.appendText("⚠ Cancel");
                    cancel.setAttribute("class", "server-cancel");
                    cancel.onclick = servers.compose.cancelVariables;
                    buttons.appendChild(cancel);
                    save.appendText("🖪 Modify");
                    save.setAttribute("class", "server-modify");
                    save.onclick = servers.compose.message;
                    buttons.appendChild(save);
                    textArea.setAttribute("class", "compose-variables-edit");
                    servers.compose.nodes.variables_list.style.display = "none";
                    label.appendText("Docker Compose Variables");
                    label.appendChild(textArea);
                    p.setAttribute("class", "compose-edit");
                    p.appendChild(label);
                    buttons.setAttribute("class", "buttons");
                    edit.appendChild(p);
                    edit.appendChild(ul);
                    edit.appendChild(buttons);
                    servers.compose.nodes.variables_list.parentNode.appendChild(edit);
                    servers.compose.nodes.variables_new.disabled = true;
                    textArea.onkeyup = servers.compose.validateVariables;
                    textArea.onfocus = servers.compose.validateVariables;
                    textArea.focus();
                },
                getTitle: function dashboard_composeGetTitle(textArea:HTMLTextAreaElement):string {
                    const regTitle:RegExp = (/^\s+container_name\s*:\s*/),
                        values:string[] = textArea.value.split("\n"),
                        len:number = values.length;
                    let index:number = 0;
                    if (len > 0) {
                        do {
                            if (regTitle.test(values[index]) === true) {
                                return values[index].replace(regTitle, "").replace(/^("|')/, "").replace(/\s*("|')$/, "");
                            }
                            index = index + 1;
                        } while (index < len);
                    }
                    return "";
                },
                init: function dashboard_composeInit():void {
                    if (payload.compose === null) {
                        if (servers.compose.nodes !== null) {
                            const composeElement:HTMLElement = document.getElementById("compose"),
                                sections:HTMLCollectionOf<HTMLElement> = composeElement.getElementsByClassName("section") as HTMLCollectionOf<HTMLElement>,
                                p:HTMLElement = document.createElement("p");
                                servers.compose.nodes = null;
                            p.appendText("Docker Compose is not available. Please see the logs for additional information.");
                            composeElement.removeChild(sections[1]);
                            composeElement.removeChild(sections[0]);
                            composeElement.appendChild(p);
                        }
                        return;
                    }
                    servers.compose.list("containers");
                    servers.compose.list("variables");
                    servers.compose.nodes.variables_new.onclick = servers.compose.editVariables;
                    servers.compose.nodes.containers_new.onclick = servers.compose.create;
                },
                list: function dashboard_composeList(type:"containers"|"variables"):void {
                    const list:string[] = Object.keys(payload.compose[type]).sort(),
                        parent:HTMLElement = servers.compose.nodes[`${type}_list`],
                        ul:HTMLElement = document.createElement("ul"),
                        len:number = list.length;
                    let li:HTMLElement = null,
                        strong:HTMLElement = null,
                        span:HTMLElement = null,
                        index:number = 0;
                    ul.setAttribute("class", parent.getAttribute("class"));
                    if (len > 0) {
                        do {
                            if (type === "containers") {
                                li = servers.shared.title(payload.compose.containers[list[index]].name, "container");
                                ul.appendChild(li);
                            } else if (type === "variables") {
                                li = document.createElement("li");
                                strong = document.createElement("strong");
                                span = document.createElement("span");
                                strong.appendText(list[index]);
                                span.appendText(payload.compose[type][list[index]]);
                                li.appendChild(strong);
                                li.appendChild(span);
                                ul.appendChild(li);
                            }
                            index = index + 1;
                        } while (index < len);
                        parent.parentNode.insertBefore(ul, parent);
                        parent.parentNode.removeChild(parent);
                        servers.compose.nodes[`${type}_list`] = ul;
                    } else {
                        parent.style.display = "none";
                    }
                },
                message: function dashboard_composeMessage(event:MouseEvent):void {
                    const target:HTMLElement = event.target,
                        classy:string = target.getAttribute("class"),
                        edit:HTMLElement = target.getAncestor("edit", "class"),
                        section:HTMLElement = edit.getAncestor("section", "class"),
                        title:string = section.getElementsByTagName("h3")[0].textContent,
                        cancel:HTMLButtonElement = edit.getElementsByClassName("server-cancel")[0] as HTMLButtonElement,
                        textArea:HTMLTextAreaElement = edit.getElementsByTagName("textarea")[1],
                        value:string = edit.getElementsByTagName("textarea")[0].value;
                    if (title === "Environmental Variables") {
                        const variables:store_string = JSON.parse(value);
                        utility.message_send(variables, "dashboard-compose-variables");
                        servers.compose.nodes.variables_new.disabled = false;
                    } else {
                        const action:type_dashboard_action = classy.replace("server-", "") as type_dashboard_action,
                            newTitle:string = servers.compose.getTitle(textArea);
                        if (action === "activate" || action === "deactivate") {
                            const direction:"down"|"up --detach" = (action === "activate")
                                ? "up --detach"
                                : "down";
                            tools.terminal.socket.send(`docker compose -f ${payload.path.compose + newTitle}.yml ${direction}\n`);
                        } else {
                            const yaml:string = textArea.value,
                                trim = function dashboard_composeMessage_trim(input:string):string {
                                    return input.replace(/^\s+/, "").replace(/\s+$/, "");
                                },
                                item:services_docker_compose = (payload.compose.containers[newTitle] === undefined)
                                    ? {
                                        command: "",
                                        compose: "",
                                        createdAt: "",
                                        description: "",
                                        exitCode: 0,
                                        health: "",
                                        id: "",
                                        image: "",
                                        labels: [],
                                        localVolumes: null,
                                        mounts: [],
                                        name: newTitle,
                                        names: [newTitle],
                                        networks: [],
                                        ports: [],
                                        project: "",
                                        publishers: [],
                                        runningFor: "",
                                        service: "",
                                        size: null,
                                        state: "dead",
                                        status: ""
                                    }
                                    : payload.compose.containers[newTitle],
                                data:services_action_compose = {
                                    action: action,
                                    compose: item
                                };
                            item.compose = trim(yaml);
                            item.description = trim(value);
                            payload.compose.containers[newTitle] = item;
                            utility.message_send(data, "dashboard-compose-container");
                        }
                        servers.compose.nodes.containers_new.disabled = false;
                    }
                    if (cancel === undefined) {
                        edit.parentNode.getElementsByTagName("button")[0].click();
                    } else {
                        servers.shared.cancel(event);
                    }
                },
                nodes: {
                    containers_list: document.getElementById("compose").getElementsByClassName("compose-container-list")[0] as HTMLElement,
                    containers_new: document.getElementById("compose").getElementsByClassName("compose-container-new")[0] as HTMLButtonElement,
                    variables_list: document.getElementById("compose").getElementsByClassName("compose-variable-list")[0] as HTMLElement,
                    variables_new: document.getElementById("compose").getElementsByClassName("compose-variable-new")[0] as HTMLButtonElement
                },
                validateContainer: function dashboard_composeValidateContainer(event:FocusEvent|KeyboardEvent):void {
                    const target:HTMLElement = event.target,
                        section:HTMLElement = target.getAncestor("edit", "class"),
                        newItem:boolean = (section.parentNode.getAttribute("class") === "section"),
                        textArea:HTMLTextAreaElement = section.getElementsByTagName("textarea")[1],
                        summary:HTMLElement = section.getElementsByClassName("summary")[0] as HTMLElement,
                        old:HTMLElement = summary.getElementsByTagName("ul")[0] as HTMLElement,
                        modify:HTMLButtonElement = (newItem === true)
                            ? section.getElementsByClassName("server-add")[0] as HTMLButtonElement
                            : section.getElementsByClassName("server-modify")[0] as HTMLButtonElement,
                        ul:HTMLElement = document.createElement("ul"),
                        reg:RegExp = (/^\s*$/),
                        title:string = servers.compose.getTitle(textArea),
                        value:string = textArea.value;
                    let valid:boolean = true,
                        li:HTMLElement = document.createElement("li");
                    summary.style.display = "block";
                    if (reg.test(value) === true) {
                        valid = false;
                        li.appendText("Compose file contents must have a value.");
                        li.setAttribute("class", "pass-false");
                    } else if (title === "") {
                        valid = false;
                        li.appendText("Compose file does not contain a valid container name.");
                        li.setAttribute("class", "pass-false");
                    } else {
                        li.appendText("Compose file contents field contains a value.");
                        li.setAttribute("class", "pass-true");
                    }
                    ul.appendChild(li);
                    if (valid === true && payload.compose.containers[title] !== undefined) {
                        if (newItem === true) {
                            valid = false;
                            li = document.createElement("li");
                            li.appendText("There is already a container with this name.");
                            li.setAttribute("class", "pass-false");
                            ul.appendChild(li);
                        } else if (payload.compose.containers[title].compose === value) {
                            valid = false;
                            li = document.createElement("li");
                            li.appendText("Values are populated, but aren't modified.");
                            li.setAttribute("class", "pass-false");
                            ul.appendChild(li);
                        }
                    }
                    if (valid === true) {
                        modify.disabled = false;
                    } else {
                        modify.disabled = true;
                    }
                    old.parentNode.insertBefore(ul, old);
                    old.parentNode.removeChild(old);
                },
                validateVariables: function dashboard_composeValidateVariables(event:FocusEvent|KeyboardEvent):void {
                    const target:HTMLTextAreaElement = event.target as HTMLTextAreaElement,
                        value:string = target.value,
                        section:HTMLElement = target.getAncestor("section", "class"),
                        edit:HTMLElement = section.getElementsByClassName("edit")[0] as HTMLElement,
                        modify:HTMLButtonElement = section.getElementsByClassName("server-modify")[0] as HTMLButtonElement,
                        ulOld:HTMLElement = edit.getElementsByTagName("ul")[0],
                        ulNew:HTMLElement = document.createElement("ul"),
                        text = function dashboard_composeValidateVariables_fail(message:string, pass:boolean):void {
                            const li:HTMLElement = document.createElement("li");
                            if (pass === true) {
                                modify.disabled = false;
                            } else {
                                modify.disabled = true;
                            }
                            li.setAttribute("class", `pass-${pass}`);
                            li.appendText(message);
                            ulNew.appendChild(li);
                        },
                        sort = function dashboard_composeValidateVariables_sort(object:store_string):string {
                            const store:store_string = {},
                                keys:string[] = Object.keys(object),
                                len:number = keys.length;
                            let index:number = 0;
                            keys.sort();
                            do {
                                store[keys[index]] = object[keys[index]];
                                index = index + 1;
                            } while (index < len);
                            return JSON.stringify(store);
                        };
                    let variables:store_string = null;
                    ulOld.parentNode.insertBefore(ulNew, ulOld);
                    ulOld.parentNode.removeChild(ulOld);
                    if (value === "" || (/^\s*\{\s*\}\s*$/).test(value) === true) {
                        text("Supply key/value pairs in JSON format.", false);
                    } else {
                        // eslint-disable-next-line no-restricted-syntax
                        try {
                            variables = JSON.parse(value);
                        } catch (e:unknown) {
                            const error:Error = e as Error;
                            text(error.message, false);
                            return;
                        }
                        if (sort(variables) === sort(payload.compose.variables)) {
                            text("Value is valid JSON, but is not modified.", false);
                        } else {
                            text("Input is valid JSON format.", true);
                        }
                    }
                }
            },
            shared: {
                // back out of server and docker compose editing
                cancel: function dashboard_commonCancel(event:MouseEvent):void {
                    const target:HTMLElement = event.target,
                        edit:HTMLElement = target.getAncestor("edit", "class"),
                        create:HTMLButtonElement = (section === "web")
                            ? servers.web.nodes.server_new
                            : servers.compose.nodes.containers_new;
                    edit.parentNode.removeChild(edit);
                    create.disabled = false;
                },
                // server and docker compose status colors
                color: function dashboard_commonColor(name_server:string, type:type_dashboard_list):type_activation_status {
                    if (name_server === null) {
                        return [null, "new"];
                    }
                    if (type === "container") {
                        if (payload.compose.containers[name_server].state === "running") {
                            return ["green", "online"];
                        }
                        return ["red", "offline"];
                    }
                    if (payload.servers[name_server].config.activate === false) {
                        return [null, "deactivated"];
                    }
                    const encryption:type_encryption = payload.servers[name_server].config.encryption,
                        ports:server_ports = payload.servers[name_server].status;
                    if (encryption === "both") {
                        if (ports.open === 0 && ports.secure === 0) {
                            return ["red", "offline"];
                        }
                        if (ports.open > 0 && ports.secure > 0) {
                            return ["green", "online"];
                        }
                        return ["amber", "partially online"];
                    }
                    if (encryption === "open") {
                        if (ports.open === 0) {
                            return ["red", "offline"];
                        }
                        return ["green", "online"];
                    }
                    if (encryption === "secure") {
                        if (ports.secure === 0) {
                            return ["red", "offline"];
                        }
                        return ["green", "online"];
                    }
                },
                // server and docker compose instance details
                details: function dashboard_commonDetails(event:MouseEvent):void {
                    const target:HTMLElement = event.target,
                        classy:string = target.getAttribute("class"),
                        newFlag:boolean = (classy === "server-new" || classy === "compose-container-new"),
                        serverItem:HTMLElement = (newFlag === true)
                            ? (section === "web")
                                ? servers.web.nodes.list
                                : servers.compose.nodes.containers_list
                            : target.getAncestor("li", "tag"),
                        titleButton:HTMLElement = serverItem.getElementsByTagName("button")[0],
                        expandButton:HTMLElement = (newFlag === true)
                            ? null
                            : titleButton.getElementsByClassName("expand")[0] as HTMLElement,
                        expandText:string = (newFlag === true)
                            ? ""
                            : expandButton.textContent;
                    if (newFlag === true || expandText === "Expand") {
                        let p:HTMLElement = document.createElement("p");
                        const name_server:string = serverItem.getAttribute("data-name"),
                            details:HTMLElement = document.createElement("div"),
                            label:HTMLElement = document.createElement("label"),
                            textArea:HTMLTextAreaElement = document.createElement("textarea"),
                            span:HTMLElement = document.createElement("span"),
                            value:string = (section === "web")
                                ? (function dashboard_commonDetails_value():string {
                                    const array = function dashboard_commonDetails_value_array(indent:boolean, name:string, property:string[]):void {
                                            const ind:string = (indent === true)
                                                ? "    "
                                                : "";
                                            if (property === null || property === undefined || property.length < 1) {
                                                output.push(`${ind}"${name}": [],`);
                                            } else {
                                                output.push(`${ind}"${name}": [`);
                                                property.forEach(function dashboard_commonDetails_value_array_each(value:string):void {
                                                    output.push(`${ind}    "${sanitize(value)}",`);
                                                });
                                                output[output.length - 1] = output[output.length - 1].replace(/,$/, "");
                                                output.push(`${ind}],`);
                                            }
                                        },
                                        object = function dashboard_commonDetails_value_object(property:"redirect_asset"|"redirect_domain"):void {
                                            const list:string[] = Object.keys(serverData[property]),
                                                total:number = list.length,
                                                objValue = function dashboard_commonDetails_value_object(input:string):void {
                                                    if (serverData.redirect_asset[input] === null || serverData.redirect_asset[input] === undefined) {
                                                        output.push(`    "${sanitize(input)}": {},`);
                                                    } else {
                                                        const childList:string[] = Object.keys(serverData.redirect_asset[input]),
                                                            childTotal:number = childList.length;
                                                        let childIndex:number = 0;
                                                        if (childTotal < 1) {
                                                            output.push(`    "${sanitize(input)}": {},`);
                                                        } else {
                                                            output.push(`    "${sanitize(input)}": {`);
                                                            do {
                                                                output.push(`        "${sanitize(childList[childIndex])}": "${sanitize(serverData.redirect_asset[input][childList[childIndex]])}",`);
                                                                childIndex = childIndex + 1;
                                                            } while (childIndex < childTotal);
                                                            output[output.length - 1] = output[output.length - 1].replace(/,$/, "");
                                                            output.push("    },");
                                                        }
                                                    }
                                                };
                                            let index:number = 0;
                                            if (total < 1) {
                                                output.push(`"${property}": {},`);
                                                return;
                                            }
                                            output.push(`"${property}": {`);
                                            do {
                                                if (property === "redirect_domain") {
                                                    output.push(`    "${sanitize(list[index])}": ${`["${sanitize(serverData.redirect_domain[list[index]][0])}", ${serverData.redirect_domain[list[index]][1]}]`},`);
                                                } else {
                                                    objValue(list[index]);
                                                }
                                                index = index + 1;
                                            } while (index < total);
                                            output[output.length - 1] = output[output.length - 1].replace(/,$/, "");
                                            output.push("},");
                                        },
                                        sanitize = function dashboard_commonDetails_value_sanitize(input:string):string {
                                            return input.replace(/\\/g, "\\\\").replace(/"/g, "\\\"");
                                        },
                                        serverData:services_server = (newFlag === true)
                                            ? {
                                                activate: true,
                                                domain_local: ["localhost"],
                                                encryption: "both",
                                                name: "new_server",
                                                ports: {
                                                    open: 0,
                                                    secure: 0
                                                }
                                            }
                                            : payload.servers[name_server].config,
                                        output:string[] = [
                                                "{",
                                                `"activate": ${serverData.activate},`
                                            ];
                                    if (serverData.block_list !== null && serverData.block_list !== undefined) {
                                        output.push("\"block_list\": {");
                                        array(true, "host", serverData.block_list.host);
                                        array(true, "ip", serverData.block_list.ip);
                                        array(true, "referrer", serverData.block_list.referrer);
                                        output[output.length - 1] = output[output.length - 1].replace(/,$/, "");
                                        output.push("},");
                                    }
                                    array(false, "domain_local", serverData.domain_local);
                                    if (serverData.encryption === "both" || serverData.encryption === "open" || serverData.encryption === "secure") {
                                        output.push(`"encryption": "${serverData.encryption}",`);
                                    } else {
                                        output.push("\"encryption\": \"both\",");
                                    }
                                    if (serverData.http !== null && serverData.http !== undefined) {
                                        output.push("\"http\": {");
                                        output.push(`    "delete": "${sanitize(serverData.http.delete)}",`);
                                        output.push(`    "post": "${sanitize(serverData.http.post)}",`);
                                        output.push(`    "put": "${sanitize(serverData.http.put)}"`);
                                        output.push("},");
                                    }
                                    if (newFlag === true) {
                                        output.push("\"name\": \"new_server\",");
                                    } else {
                                        output.push(`"name": "${sanitize(name_server)}",`);
                                    }
                                    output.push("\"ports\": {");
                                    if (serverData.encryption === "both") {
                                        output.push(`    "open": ${serverData.ports.open},`);
                                        output.push(`    "secure": ${serverData.ports.secure}`);
                                    } else if (serverData.encryption === "open") {
                                        output.push(`    "open": ${serverData.ports.open}`);
                                    } else {
                                        output.push(`    "secure": ${serverData.ports.secure}`);
                                    }
                                    output.push("},");
                                    if (serverData.redirect_domain !== undefined && serverData.redirect_domain !== null) {
                                        object("redirect_domain");
                                    }
                                    if (serverData.redirect_asset !== undefined && serverData.redirect_asset !== null) {
                                        object("redirect_asset");
                                    }
                                    output[output.length - 1] = output[output.length - 1].replace(/,$/, "");
                                    return `${output.join("\n    ")}\n}`;
                                }())
                                : (newFlag === true || payload.compose === null)
                                    ? ""
                                    : payload.compose.containers[name_server].compose,
                            summary:HTMLElement = document.createElement("div"),
                            summaryTitle:HTMLElement = document.createElement("h5"),
                            summaryUl:HTMLElement = document.createElement("ul"),
                            editButton:HTMLElement = document.createElement("button"),
                            clear:HTMLElement = document.createElement("span");
                        if (section === "compose") {
                            const textArea:HTMLTextAreaElement = document.createElement("textarea");
                            let p:HTMLElement = document.createElement("p"),
                                label:HTMLElement = document.createElement("label"),
                                span:HTMLElement = document.createElement("span");

                            // compose textarea
                            textArea.spellcheck = false;
                            textArea.readOnly = true;
                            if (newFlag === false) {
                                textArea.value = payload.compose.containers[name_server].description;
                            }
                            p = document.createElement("p");
                            label = document.createElement("label");
                            span = document.createElement("span");
                            span.appendText("Description (optional)");
                            span.setAttribute("class", "text");
                            textArea.setAttribute("class", "short");
                            label.appendChild(span);
                            label.appendChild(textArea);
                            p.appendChild(label);
                            details.appendChild(p);
                        }
                        summaryTitle.appendText("Edit Summary");
                        summary.appendChild(summaryTitle);
                        summary.appendChild(summaryUl);
                        summary.setAttribute("class", "summary");
                        details.setAttribute("class", "edit");
                        span.setAttribute("class", "text");
                        textArea.value = value;
                        textArea.spellcheck = false;
                        textArea.readOnly = true;
                        if (section === "compose") {
                            span.appendText("Compose YAML");
                        } else {
                            span.appendText("Server Configuration");
                        }
                        label.appendChild(span);
                        label.appendChild(textArea);
                        p.appendChild(label);
                        details.appendChild(p);
                        details.appendChild(summary);
                        if (newFlag === false) {
                            expandButton.textContent = "Hide";
                            editButton.appendText("✎ Edit");
                            editButton.setAttribute("class", "server-edit");
                            editButton.onclick = servers.shared.edit;
                            p.appendChild(editButton);
                            if (section === "compose") {
                                details.appendChild(servers.compose.activePorts(name_server));
                            } else {
                                details.appendChild(servers.web.activePorts(name_server));
                            }
                        }
                        clear.setAttribute("class", "clear");
                        p = document.createElement("p");
                        p.appendChild(clear);
                        p.setAttribute("class", "buttons");
                        details.appendChild(p);
                        if (newFlag === true) {
                            serverItem.parentNode.insertBefore(details, serverItem);
                            servers.shared.edit(event);
                        } else {
                            serverItem.appendChild(details);
                        }
                    } else {
                        do {
                            serverItem.removeChild(serverItem.lastChild);
                        } while (serverItem.childNodes.length > 1);
                        expandButton.textContent = "Expand";
                    }
                },
                // modify server and docker compose information
                edit: function dashboard_commonEdit(event:MouseEvent):void {
                    const target:HTMLElement = event.target,
                        classy:string = target.getAttribute("class"),
                        createServer:boolean = (classy === "server-new" || classy === "compose-container-new"),
                        edit:HTMLElement = (createServer === true)
                            ? target.getAncestor("section", "class").getElementsByClassName("edit")[0] as HTMLElement
                            : target.getAncestor("edit", "class"),
                        editButton:HTMLElement = edit.getElementsByClassName("server-edit")[0] as HTMLElement,
                        listItem:HTMLElement = edit.parentNode,
                        dashboard:boolean = (createServer === false && listItem.getAttribute("data-name") === "dashboard"),
                        p:HTMLElement = edit.lastChild as HTMLElement,
                        activate:HTMLButtonElement = document.createElement("button"),
                        deactivate:HTMLButtonElement = document.createElement("button"),
                        destroy:HTMLButtonElement = document.createElement("button"),
                        save:HTMLButtonElement = document.createElement("button"),
                        clear:HTMLElement = p.getElementsByClassName("clear")[0] as HTMLElement,
                        note:HTMLElement = document.createElement("p");
                    save.disabled = true;
                    if (createServer === false && dashboard === false) {
                        const span:HTMLElement = document.createElement("span"),
                            buttons:HTMLElement = document.createElement("p");
                        buttons.setAttribute("class", "buttons");
                        destroy.appendText("✘ Destroy");
                        destroy.setAttribute("class", "server-destroy");
                        destroy.onclick = (section === "compose")
                            ? servers.compose.message
                            : servers.web.message;
                        activate.appendText("⌁ Activate");
                        activate.setAttribute("class", "server-activate");
                        if (listItem.getAttribute("class") === "green") {
                            activate.disabled = true;
                        }
                        activate.onclick = (section === "compose")
                            ? servers.compose.message
                            : servers.web.message;
                        deactivate.appendText("። Deactivate");
                        deactivate.setAttribute("class", "server-deactivate");
                        deactivate.onclick = (section === "compose")
                            ? servers.compose.message
                            : servers.web.message;
                        if (listItem.getAttribute("class") === "red") {
                            deactivate.disabled = true;
                        }
                        buttons.appendChild(deactivate);
                        buttons.appendChild(activate);
                        span.setAttribute("class", "clear");
                        buttons.appendChild(span);
                        p.parentNode.insertBefore(buttons, p);
                        p.appendChild(destroy);
                    }
                    if (createServer === true) {
                        destroy.appendText("⚠ Cancel");
                        destroy.setAttribute("class", "server-cancel");
                        destroy.onclick = servers.shared.cancel;
                        p.appendChild(destroy);
                        save.appendText("✔ Create");
                        save.setAttribute("class", "server-add");
                    } else {
                        editButton.parentNode.removeChild(editButton);
                        save.appendText("🖪 Modify");
                        save.setAttribute("class", "server-modify");
                    }
                    save.onclick = (section === "compose")
                        ? servers.compose.message
                        : servers.web.message;
                    p.appendChild(save);
                    p.removeChild(clear);
                    p.appendChild(clear);
                    p.setAttribute("class", "buttons");
                    if (createServer === true) {
                        if (section === "compose") {
                            note.textContent = "Container status messaging redirected to terminal.";
                        } else {
                            note.textContent = "Please be patient with new secure server activation as creating new TLS certificates requires several seconds.";
                        }
                        note.setAttribute("class", "note");
                        p.parentNode.appendChild(note);
                    } else if (dashboard === false) {
                        note.textContent = (section === "compose")
                            ? `Changing the container name of an existing container will create a new container. Ensure the compose file mentions PUID and PGID with values ${payload.os.user.uid} and ${payload.os.user.gid} to prevent writing files as root.`
                            : "Destroying a server will delete all associated file system artifacts. Back up your data first.";
                        note.setAttribute("class", "note");
                        p.parentNode.appendChild(note);
                    }
                    if (section === "compose") {
                        const textArea0:HTMLTextAreaElement = edit.getElementsByTagName("textarea")[0],
                            textArea1:HTMLTextAreaElement = edit.getElementsByTagName("textarea")[1];
                        textArea0.readOnly = false;
                        textArea1.readOnly = false;
                        textArea1.onkeyup = servers.compose.validateContainer;
                        textArea1.onfocus = servers.compose.validateContainer;
                        textArea0.focus();
                    } else {
                        const textArea:HTMLTextAreaElement = edit.getElementsByTagName("textarea")[0];
                        textArea.readOnly = false;
                        textArea.onkeyup = servers.web.validate;
                        textArea.onfocus = servers.web.validate;
                        textArea.focus();
                    }
                },
                // expands server and docker compose sections
                title: function dashboard_commonTitle(name_server:string, type:type_dashboard_list):HTMLElement {
                    const li:HTMLElement = document.createElement("li"),
                        h4:HTMLElement = document.createElement("h4"),
                        expand:HTMLButtonElement = document.createElement("button"),
                        span:HTMLElement = document.createElement("span"),
                        name:string = (name_server === null)
                            ? `new_${type}`
                            : name_server;
                    if (name_server === null) {
                        expand.appendText(name);
                    } else {
                        const color:type_activation_status = servers.shared.color(name_server, type);
                        span.appendText("Expand");
                        span.setAttribute("class", "expand");
                        expand.appendChild(span);
                        expand.onclick = servers.shared.details;
                        li.setAttribute("data-name", name);
                        expand.appendText(`${name} - ${color[1]}`);
                        if (color[0] !== null) {
                            li.setAttribute("class", color[0]);
                        }
                        if (type === "server" && (payload.servers[name_server].config.modification_name === null || payload.servers[name_server].config.modification_name === undefined)) {
                            payload.servers[name_server].config.modification_name = name_server;
                        }
                    }
                    h4.appendChild(expand);
                    li.appendChild(h4);
                    return li;
                }
            },
            web: {
                activePorts: function dashboard_serverActivePorts(name_server:string):HTMLElement {
                    const div:HTMLElement = document.createElement("div"),
                        h5:HTMLElement = document.createElement("h5"),
                        portList:HTMLElement = document.createElement("ul"),
                        encryption:type_encryption = payload.servers[name_server].config.encryption,
                        ports:server_ports = payload.servers[name_server].status;
                    let portItem:HTMLElement = document.createElement("li");
                    h5.appendText("Active Ports");
                    div.appendChild(h5);
                    div.setAttribute("class", "active-ports");
                    
                    if (encryption === "both") {
                        if (ports.open === 0) {
                            portItem.appendText("Open - offline");
                        } else {
                            portItem.appendText(`Open - ${ports.open} (TCP)`);
                        }
                        portList.appendChild(portItem);
                        portItem = document.createElement("li");
                        if (ports.secure === 0) {
                            portItem.appendText("Secure - offline");
                        } else {
                            portItem.appendText(`Secure - ${ports.secure} (TCP)`);
                        }
                        portList.appendChild(portItem);
                    } else if (encryption === "open") {
                        if (ports.open === 0) {
                            portItem.appendText("Open - offline");
                        } else {
                            portItem.appendText(`Open - ${ports.open} (TCP)`);
                        }
                        portList.appendChild(portItem);
                    } else {
                        if (ports.secure === 0) {
                            portItem.appendText("Secure - offline");
                        } else {
                            portItem.appendText(`Secure - ${ports.secure} (TCP)`);
                        }
                        portList.appendChild(portItem);
                    }
                    div.appendChild(portList);
                    return div;
                },
                create: function dashboard_serverCreate(event:MouseEvent):void {
                    const button:HTMLButtonElement = event.target as HTMLButtonElement;
                    button.disabled = true;
                    servers.shared.details(event);
                },
                list: function dashboard_serverList():void {
                    const list:string[] = Object.keys(payload.servers),
                        list_old:HTMLElement = servers.web.nodes.list,
                        list_new:HTMLElement = document.createElement("ul"),
                        total:number = list.length;
                    let index:number = 0,
                        indexSocket:number = 0,
                        totalSocket:number = 0;
                    servers.web.nodes.server_new.onclick = servers.web.create;
                    list_new.setAttribute("class", list_old.getAttribute("class"));
                    list.sort(function dashboard_serverList_sort(a:string, b:string):-1|1 {
                        if (a < b) {
                            return -1;
                        }
                        return 1;
                    });
                    do {
                        list_new.appendChild(servers.shared.title(list[index], "server"));
                        totalSocket = payload.servers[list[index]].sockets.length;
                        if (totalSocket > 0) {
                            indexSocket = 0;
                            do {
                                servers.web.socket_add(payload.servers[list[index]].sockets[indexSocket]);
                                indexSocket = indexSocket + 1;
                            } while (indexSocket < totalSocket);
                        }
                        index = index + 1;
                    } while (index < total);
                    list_old.parentNode.insertBefore(list_new, list_old);
                    list_old.parentNode.removeChild(list_old);
                    servers.web.nodes.list = list_new;
                },
                message: function dashboard_serverMessage(event:MouseEvent): void {
                    const target:HTMLElement = event.target,
                        edit:HTMLElement = target.getAncestor("edit", "class"),
                        action:type_dashboard_action = target.getAttribute("class").replace("server-", "") as type_dashboard_action,
                        cancel:HTMLElement = edit.getElementsByClassName("server-cancel")[0] as HTMLElement,
                        configuration:services_server = (function dashboard_serverMessage_configuration():services_server {
                            const textArea:HTMLTextAreaElement = edit.getElementsByTagName("textarea")[0],
                                config:services_server = JSON.parse(textArea.value);
                            config.modification_name = edit.parentNode.getAttribute("data-name");
                            if (payload.servers[config.modification_name] !== undefined) {
                                payload.servers[config.modification_name].config.encryption = config.encryption;
                            }
                            return config;
                        }()),
                        data:services_action_server = {
                            action: action,
                            server: configuration
                        };
                    utility.message_send(data, "dashboard-server");
                    if (cancel === undefined) {
                        edit.parentNode.getElementsByTagName("button")[0].click();
                    } else {
                        servers.shared.cancel(event);
                        servers.web.nodes.server_new.disabled = false;
                    }
                },
                nodes: {
                    list: document.getElementById("servers").getElementsByClassName("server-list")[0] as HTMLElement,
                    server_new: document.getElementById("servers").getElementsByClassName("server-new")[0] as HTMLButtonElement
                },
                socket_add: function dashboard_serverSocketAdd(config:services_socket):void {
                    const table:HTMLElement = document.getElementById("sockets").getElementsByTagName("table")[0],
                        tbody:HTMLElement = table.getElementsByTagName("tbody")[0],
                        tr:HTMLElement = document.createElement("tr");
                    let td:HTMLElement = null;
                    if (config.address.local.port === undefined || config.address.remote.port === undefined) {
                        return;
                    }
    
                    td = document.createElement("td");
                    td.appendText(config.server);
                    tr.appendChild(td);
    
                    td = document.createElement("td");
                    td.appendText(config.hash);
                    tr.appendChild(td);
    
                    td = document.createElement("td");
                    td.appendText(config.type);
                    tr.appendChild(td);
    
                    td = document.createElement("td");
                    td.appendText(config.role);
                    tr.appendChild(td);
    
                    td = document.createElement("td");
                    td.appendText((config.proxy === null) ? "" : config.proxy);
                    tr.appendChild(td);
    
                    td = document.createElement("td");
                    td.appendText(String(config.encrypted));
                    tr.appendChild(td);
    
                    td = document.createElement("td");
                    td.appendText(config.address.local.address);
                    tr.appendChild(td);
    
                    td = document.createElement("td");
                    td.appendText(String(config.address.local.port));
                    tr.appendChild(td);
    
                    td = document.createElement("td");
                    td.appendText(config.address.remote.address);
                    tr.appendChild(td);
    
                    td = document.createElement("td");
                    td.appendText(String(config.address.remote.port));
                    tr.appendChild(td);
    
                    tbody.appendChild(tr);
                    utility.sort_tables(null, table, Number(table.dataset.column));
                },
                validate: function dashboard_serverValidate(event:FocusEvent|KeyboardEvent):void {
                    const target:HTMLTextAreaElement = event.target as HTMLTextAreaElement,
                        listItem:HTMLElement = target.getAncestor("li", "tag"),
                        name_attribute:string = listItem.getAttribute("data-name"),
                        name_server:string = (name_attribute === null)
                            ? "new_server"
                            : name_attribute,
                        value:string = target.value,
                        edit:HTMLElement = target.getAncestor("edit", "class"),
                        summary:HTMLElement = edit.getElementsByClassName("summary")[0] as HTMLElement,
                        ul:HTMLElement = document.createElement("ul"),
                        pathReg:RegExp = new RegExp(`(\\\\|\\/)${name_server}(\\\\|\\/)`, "g"),
                        populate = function dashboard_serverValidate_populate(pass:boolean, message:string):void {
                            const li:HTMLElement = document.createElement("li");
                            if (pass === null) {
                                li.setAttribute("class", "pass-warn");
                                li.appendText(`Warning: ${message}`);
                            } else {
                                li.setAttribute("class", `pass-${pass}`);
                                li.appendText(message);
                            }
                            ul.appendChild(li);
                            if (pass === false) {
                                failures = failures + 1;
                            }
                        },
                        disable = function dashboard_serverValidate_disable():void {
                            const save:HTMLButtonElement = (name_attribute === null)
                                    ? listItem.getElementsByClassName("server-add")[0] as HTMLButtonElement
                                    : listItem.getElementsByClassName("server-modify")[0] as HTMLButtonElement,
                                order = function dashboard_serverValidate_disable_order(item:services_server):string {
                                    const keys:type_server_property[] = Object.keys(item).sort() as type_server_property[],
                                        output:object = {},
                                        len:number = keys.length;
                                    let index:number = 0;
                                    do {
                                        // @ts-expect-error - warns on implied any, but we know that the key values are extract from the same object
                                        output[keys[index]] = item[keys[index]];
                                        index = index + 1;
                                    } while (index < len);
                                    return JSON.stringify(output);
                                };
                            summary.removeChild(summary.getElementsByTagName("ul")[0]);
                            summary.appendChild(ul);
                            if (failures > 0) {
                                const plural:string = (failures === 1)
                                    ? ""
                                    : "s";
                                save.disabled = true;
                                populate(false, `The server configuration contains ${failures} violation${plural}.`);
                            } else if (name_attribute !== null && order(serverData) === order(payload.servers[name_server].config)) {
                                save.disabled = true;
                                populate(false, "The server configuration is valid, but not modified.");
                            } else {
                                save.disabled = false;
                                populate(true, "The server configuration is valid.");
                            }
                        },
                        stringArray = function dashboard_serverValidate_stringArray(required:boolean, name:string, property:string[]):boolean {
                            let index:number = (property === null || property === undefined)
                                    ? 0
                                    : property.length;
                            const requirement:string = (required === true)
                                    ? "Required"
                                    : "Optional";
                            if (index > 0) {
                                do {
                                    index = index - 1;
                                    if (typeof property[index] !== "string") {
                                        const requirement_lower:string = (required === true)
                                            ? "required"
                                            : "optional";
                                        populate(false, `Index ${index} of ${requirement_lower} property ${name} is not a string.`);
                                        return false;
                                    }
                                } while (index > 0);
                                if (name.includes(".") === false) {
                                    populate(true, `${requirement} property '${name}' is an array only containing strings.`);
                                    return true;
                                }
                            } else if (name.includes(".") === false) {
                                if (serverData.domain_local === null) {
                                    populate(required, `${requirement} property '${name}' is null.`);
                                } else if (serverData.domain_local === undefined) {
                                    populate(required, `${requirement} property '${name}' is undefined.`);
                                }
                                return required;
                            }
                        },
                        keys = function dashboard_serverValidate_keys(config:config_validate_serverKeys):void {
                            const requirement_child:string = (config.required_property === true)
                                    ? "required"
                                    : "supported",
                                requirement_parent:string = (config.required_name === true)
                                    ? "Required"
                                    : "Optional",
                                keys:string[] = (config.name === null)
                                    ? Object.keys(serverData)
                                    : (serverData[config.name] === null || serverData[config.name] === undefined)
                                        ? []
                                        : Object.keys(serverData[config.name]);
                            let value:string = null,
                                redirect:[string, number] = null,
                                indexActual:number = keys.length,
                                indexSupported:number = 0,
                                pass:boolean = true;
                            if (config.name !== null) {
                                if (serverData[config.name] === null) {
                                    if (config.required_name === true) {
                                        populate(false, `${requirement_parent} property '${config.name}' is null, but is required.`);
                                    } else {
                                        populate(true, `${requirement_parent} property '${config.name}' is null and that is acceptable.`);
                                    }
                                    return;
                                }
                                if (serverData[config.name] === undefined) {
                                    if (config.required_name === true) {
                                        populate(false, `${requirement_parent} property '${config.name}' is undefined, but is required.`);
                                    } else {
                                        populate(true, `${requirement_parent} property '${config.name}' is undefined and that is acceptable.`);
                                    }
                                    return;
                                }
                            }
                            if (indexActual > 0) {
                                do {
                                    indexActual = indexActual - 1;
                                    indexSupported = config.supported.length;
                                    value = (serverData[config.name] === undefined || serverData[config.name] === null)
                                        ? null
                                        // @ts-expect-error - The following line forces an implicit any, but we don't care because we are only evaluating for data type not value or assignment
                                        : serverData[config.name][keys[indexActual]];
                                    if ((
                                        (config.type === "array" && Array.isArray(value) === false) ||
                                        ((config.type === "string" || config.type === "path") && typeof value !== "string") ||
                                        (config.type === "number" && typeof value !== "number")
                                    ) && value !== null) {
                                        populate(false, `Property '${keys[indexActual]}' of '${config.name}' is not of type: ${config.type}.`);
                                        pass = false;
                                    } else if (config.type === "path" && serverData.name !== name_server && pathReg.test(value) === true) {
                                        populate(null, `Property '${keys[indexActual]}' of '${config.name}' is a file system path that contains a directory references to a prior or default server name.`);
                                        // @ts-expect-error - The following line complains about comparing a string to a number when the value is not actually a string
                                    } else if (config.name === "ports" && value > 65535) {
                                        populate(false, `Property '${keys[indexActual]}' of 'ports' must be a value in range 0 to 65535.`);
                                        pass = false;
                                    } else if (config.type === "array") {
                                        if (config.name === "redirect_domain") {
                                            redirect = serverData.redirect_domain[keys[indexActual]];
                                            if (redirect.length !== 2 || typeof redirect[0] !== "string" || typeof redirect[1] !== "number" ) {
                                                populate(false, `Property '${keys[indexActual]}' of 'redirect_domain' is not a 2 index array with the first index of string type and the second of type number.`);
                                                pass = false;
                                            }
                                        } else {
                                            // @ts-expect-error - The last argument expects a string[] but variable value is superficially typed as string
                                            if (stringArray(config.required_property, `${config.name}.${keys[indexActual]}`, value) === false) {
                                                pass = false;
                                            }
                                        }
                                    } else if (config.type === "store") {
                                        const childKeys:string[] = Object.keys(value);
                                        let childIndex:number = childKeys.length;
                                        if (childIndex > 0) {
                                            do {
                                                childIndex = childIndex - 1;
                                                // @ts-expect-error - The following line forces an implicit any, but we expect it to be a string value on a string store as a child of a larger string store
                                                if (typeof value[childKeys[childIndex]] !== "string") {
                                                    populate(false, `Property '${keys[indexActual]}.${[childKeys[childIndex]]}' of '${config.name}' is not type: string.`);
                                                    pass = false;
                                                }
                                            } while (childIndex > 0);
                                        }
                                    }
                                    if (indexSupported > 0) {
                                        do {
                                            indexSupported = indexSupported - 1;
                                            if (keys[indexActual] === config.supported[indexSupported]) {
                                                keys.splice(indexActual, 1);
                                                config.supported.splice(indexSupported, 1);
                                            } else if (config.name === "ports" && ((serverData.encryption === "open" && config.supported[indexSupported] === "secure") || (serverData.encryption === "secure" && config.supported[indexSupported] === "open"))) {
                                                config.supported.splice(indexSupported, 1);
                                            } else if (config.name === null && keys.includes(config.supported[indexSupported]) === false && (config.supported[indexSupported] === "block_list" || config.supported[indexSupported] === "domain_local" || config.supported[indexSupported] === "http" || config.supported[indexSupported] === "redirect_domain" || config.supported[indexSupported] === "redirect_asset") || config.supported[indexSupported] === "temporary") {
                                                config.supported.splice(indexSupported, 1);
                                            }
                                        } while (indexSupported > 0);
                                    }
                                } while (indexActual > 0);
                            }
                            if (config.name === "redirect_domain" || config.name === "redirect_asset") {
                                if (pass === true) {
                                    populate(true, `${requirement_parent} property '${config.name}' contains values of the proper type.`);
                                }
                            } else {
                                if (keys.length === 0 && config.supported.length === 0) {
                                    if (config.name === null) {
                                        populate(true, "Configuration contains only optional property names and all required primary property names.");
                                    } else {
                                        populate(true, `${requirement_parent} property '${config.name}' contains only the ${requirement_child} property names.`);
                                    }
                                } else {
                                    if (config.supported.length > 0 && config.required_property === true) {
                                        if (config.name === null) {
                                            populate(false, `Configuration is missing required primary properties: ${JSON.stringify(config.supported)}.`);
                                        } else {
                                            populate(false, `${requirement_parent} property '${config.name}' is missing required properties: ${JSON.stringify(config.supported)}.`);
                                        }
                                    }
                                    if (keys.length > 0) {
                                        if (config.name === null) {
                                            populate(false, `Configuration contains unsupported primary properties: ${JSON.stringify(keys)}.`);
                                        } else {
                                            populate(false, `${requirement_parent} property '${config.name}' contains unsupported properties: ${JSON.stringify(keys)}.`);
                                        }
                                    }
                                }
                            }
                        },
                        rootProperties:string[] = ["activate", "block_list", "domain_local", "encryption", "http", "name", "ports", "redirect_asset", "redirect_domain", "temporary"];
                    let serverData:services_server = null,
                        failures:number = 0;
                    summary.style.display = "block";
                    // eslint-disable-next-line no-restricted-syntax
                    try {
                        serverData = JSON.parse(value);
                    } catch (e:unknown) {
                        const error:Error = e as Error;
                        populate(false, error.message);
                        disable();
                        return;
                    }
                    if (name_attribute !== null) {
                        serverData.modification_name = payload.servers[name_server].config.modification_name;
                        rootProperties.push("modification_name");
                    }
                    // activate
                    if (typeof serverData.activate === "boolean") {
                        populate(true, "Required property 'activate' has boolean type value.");
                    } else {
                        populate(false, "Required property 'activate' expects a boolean type value.");
                    }
                    // block_list
                    keys({
                        name: "block_list",
                        required_name: false,
                        required_property: true,
                        supported: ["host", "ip", "referrer"],
                        type: "array"
                    });
                    // domain_local
                    stringArray(false, "domain_local", serverData.domain_local);
                    // encryption
                    if (serverData.encryption === "both" || serverData.encryption === "open" || serverData.encryption === "secure") {
                        populate(true, "Required property 'encryption' has an appropriate value of: \"both\", \"open\", or \"secure\".");
                    } else {
                        populate(false, "Required property 'encryption' is not assigned a supported value: \"both\", \"open\", or \"secure\".");
                    }
                    // http
                    keys({
                        name: "http",
                        required_name: false,
                        required_property: false,
                        supported: ["delete", "post", "put"],
                        type: "path"
                    });
                    // name
                    if (listItem.getAttribute("data-name") === "dashboard" && serverData.name !== "dashboard") {
                        populate(false, "The dashboard server cannot be renamed.");
                    } else if (typeof serverData.name === "string" && serverData.name !== "") {
                        if (serverData.name === "new_server") {
                            populate(null, "The name 'new_server' is a default placeholder. A more unique name is preferred.");
                        } else if (serverData.name === name_server || payload.servers[serverData.name] === undefined) {
                            populate(true, "Required property 'name' has an appropriate value.");
                        } else {
                            populate(false, `Name ${serverData.name} is already in use. Value for required property 'name' must be unique.`);
                        }
                    } else {
                        populate(false, "Required property 'name' is not assigned an appropriate string value.");
                    }
                    // ports
                    if ((serverData.ports.open === 0 && (serverData.encryption === "both" || serverData.encryption === "open")) || (serverData.ports.secure === 0 && (serverData.encryption === "both" || serverData.encryption === "secure"))) {
                        populate(null, "A port value of 0 will assign a randomly available port from the local machine. A number greater than 0 and less than 65535 is preferred.");
                    }
                    keys({
                        name: "ports",
                        required_name: true,
                        required_property: true,
                        supported: ["open", "secure"],
                        type: "number"
                    });
                    // redirect_asset
                    keys({
                        name: "redirect_asset",
                        required_name: false,
                        required_property: false,
                        supported: [],
                        type: "store"
                    });
                    // redirect_domain
                    keys({
                        name: "redirect_domain",
                        required_name: false,
                        required_property: false,
                        supported: [],
                        type: "array"
                    });
                    // temporary
                    if (typeof serverData.temporary === "boolean") {
                        populate(true, "Optional property 'temporary' has boolean type value.");
                    } else if (serverData.temporary === null || serverData.temporary === undefined) {
                        populate(true, "Optional property 'temporary' is either null or undefined.");
                    } else {
                        populate(false, "Optional property 'temporary' expects a boolean type value.");
                    }
                    // parent properties
                    keys({
                        name: null,
                        required_name: false,
                        required_property: true,
                        supported: rootProperties,
                        type: null
                    });
                    disable();
                }
            }
        },
        system:structure_system = {
            os: {
                init: function dashboard_osInit():void {
                    const time:string = payload.os.time.dateTime(true, payload.timeZone_offset);
                    let keys:string[] = null,
                        li:HTMLElement = null,
                        strong:HTMLElement = null,
                        span:HTMLElement = null,
                        len:number = 0,
                        index:number = 0;
                    system.os.nodes.update_text.textContent = time;
                    system.os.nodes.cpu.arch.textContent = payload.os.machine.cpu.arch;
                    system.os.nodes.cpu.cores.textContent = payload.os.machine.cpu.cores.commas();
                    system.os.nodes.cpu.endianness.textContent = payload.os.machine.cpu.endianness;
                    system.os.nodes.cpu.frequency.textContent = `${payload.os.machine.cpu.frequency.commas()}mhz`;
                    system.os.nodes.cpu.name.textContent = payload.os.machine.cpu.name;
                    system.os.nodes.memory.free.textContent = `${payload.os.machine.memory.free.bytesLong()}, ${((payload.os.machine.memory.free / payload.os.machine.memory.total) * 100).toFixed(2)}%`;
                    system.os.nodes.memory.used.textContent = `${(payload.os.machine.memory.total - payload.os.machine.memory.free).bytesLong()}, ${(((payload.os.machine.memory.total - payload.os.machine.memory.free) / payload.os.machine.memory.total) * 100).toFixed(2)}%`;
                    system.os.nodes.memory.total.textContent = `${payload.os.machine.memory.total.bytesLong()}, 100%`;
                    system.os.nodes.os.hostname.textContent = payload.os.os.hostname;
                    system.os.nodes.os.name.textContent = payload.os.os.name;
                    system.os.nodes.os.platform.textContent = payload.os.os.platform;
                    system.os.nodes.os.release.textContent = payload.os.os.release;
                    system.os.nodes.os.type.textContent = payload.os.os.type;
                    system.os.nodes.os.uptime.textContent = payload.os.os.uptime.time();
                    system.os.nodes.process.arch.textContent = payload.os.process.arch;
                    system.os.nodes.process.argv.textContent = JSON.stringify(payload.os.process.argv);
                    system.os.nodes.process.cpuSystem.textContent = payload.os.process.cpuSystem.time();
                    system.os.nodes.process.cpuUser.textContent = payload.os.process.cpuUser.time();
                    system.os.nodes.process.cwd.textContent = payload.os.process.cwd;
                    system.os.nodes.process.platform.textContent = payload.os.process.platform;
                    system.os.nodes.process.pid.textContent = String(payload.os.process.pid);
                    system.os.nodes.process.ppid.textContent = String(payload.os.process.ppid);
                    system.os.nodes.process.uptime.textContent = payload.os.process.uptime.time();
                    system.os.nodes.process.memoryProcess.textContent = `${payload.os.process.memory.rss.bytesLong()}, ${((payload.os.process.memory.rss / payload.os.machine.memory.total) * 100).toFixed(2)}%`;
                    system.os.nodes.process.memoryV8.textContent = payload.os.process.memory.V8.bytesLong();
                    system.os.nodes.process.memoryExternal.textContent = payload.os.process.memory.external.bytesLong();
                    if (payload.os.process.platform === "win32") {
                        system.os.nodes.user.gid.parentNode.style.display = "none";
                        system.os.nodes.user.uid.parentNode.style.display = "none";
                    } else {
                        system.os.nodes.user.gid.textContent = String(payload.os.user.gid);
                        system.os.nodes.user.uid.textContent = String(payload.os.user.uid);
                    }
                    system.os.nodes.user.homedir.textContent = payload.os.user.homedir;
                    system.os.nodes.update_button.onclick = utility.table_update;
    
                    // System Path
                    len = payload.os.os.path.length;
                    if (len > 0) {
                        index = 0;
                        do {
                            li = document.createElement("li");
                            li.textContent = payload.os.os.path[index];
                            system.os.nodes.path.appendChild(li);
                            index = index + 1;
                        } while (index < len);
                    }
                    delete payload.os.os.env.Path;
                    delete payload.os.os.env.PATH;
    
                    // Environmental Variables
                    keys = Object.keys(payload.os.os.env);
                    len = keys.length;
                    if (len > 0) {
                        do {
                            li = document.createElement("li");
                            strong = document.createElement("strong");
                            strong.textContent = keys[index];
                            span = document.createElement("span");
                            span.textContent = payload.os.os.env[keys[index]];
                            li.appendChild(strong);
                            li.appendChild(span);
                            system.os.nodes.env.appendChild(li);
                            index = index + 1;
                        } while (index < len);
                    }
    
                    // Node Dependency Versions
                    keys = Object.keys(payload.os.process.versions);
                    len = keys.length;
                    if (len > 0) {
                        index = 0;
                        do {
                            li = document.createElement("li");
                            strong = document.createElement("strong");
                            strong.textContent = keys[index];
                            span = document.createElement("span");
                            span.textContent = payload.os.process.versions[keys[index]];
                            li.appendChild(strong);
                            li.appendChild(span);
                            system.os.nodes.versions.appendChild(li);
                            index = index + 1;
                        } while (index < len);
                    }
                },
                nodes: (function dashboard_osNodes():module_os_nodes {
                    const sectionList:HTMLCollectionOf<HTMLElement> = document.getElementById("os").getElementsByClassName("section")[0].getElementsByClassName("section") as HTMLCollectionOf<HTMLElement>,
                        sections:store_elements = {
                            cpu: sectionList[0].getElementsByTagName("ul")[0],
                            env: sectionList[1].getElementsByTagName("ul")[1],
                            memory: sectionList[0].getElementsByTagName("ul")[1],
                            os: sectionList[1].getElementsByTagName("ul")[0],
                            path: sectionList[1].getElementsByTagName("ul")[2],
                            process: sectionList[2].getElementsByTagName("ul")[0],
                            user: sectionList[3].getElementsByTagName("ul")[0],
                            versions: sectionList[2].getElementsByTagName("ul")[1]
                        },
                        item = function dashboard_osNodes_item(section:"cpu"|"memory"|"os"|"process"|"user", index:number):HTMLElement {
                            return sections[section].getElementsByTagName("li")[index].getElementsByTagName("span")[0];
                        },
                        nodeList:module_os_nodes = {
                            cpu: {
                                arch: item("cpu", 0),
                                cores: item("cpu", 1),
                                endianness: item("cpu", 2),
                                frequency: item("cpu", 3),
                                name: item("cpu", 4)
                            },
                            env: sections.env,
                            memory: {
                                free: item("memory", 0),
                                total: item("memory", 2),
                                used: item("memory", 1)
                            },
                            os: {
                                hostname: item("os", 0),
                                name: item("os", 1),
                                platform: item("os", 2),
                                release: item("os", 3),
                                type: item("os", 4),
                                uptime: item("os", 5)
                            },
                            path: sections.path,
                            process: {
                                arch: item("process", 0),
                                argv: item("process", 1),
                                cpuSystem: item("process", 2),
                                cpuUser: item("process", 3),
                                cwd: item("process", 4),
                                memoryProcess: item("process", 5),
                                memoryV8: item("process", 6),
                                memoryExternal: item("process", 7),
                                platform: item("process", 8),
                                pid: item("process", 9),
                                ppid: item("process", 10),
                                uptime: item("process", 11)
                            },
                            update_button: document.getElementById("os").getElementsByClassName("table-stats")[0].getElementsByTagName("button")[0],
                            update_text: document.getElementById("os").getElementsByClassName("table-stats")[0].getElementsByTagName("em")[0],
                            user: {
                                gid: item("user", 0),
                                uid: item("user", 1),
                                homedir: item("user", 2)
                            },
                            versions: sections.versions
                        };
                    return nodeList;
                }()),
                service: function dashboard_osService(data_item:socket_data):void {
                    const main = function dashboard_osService_main(data:services_os_all):void {
                            system.os.nodes.update_text.textContent = data.time.dateTime(true, payload.timeZone_offset);
                            payload.os.machine.memory = data.machine.memory;
                            payload.os.os.uptime = data.os.uptime;
                            payload.os.process.cpuSystem = data.process.cpuSystem;
                            payload.os.process.cpuUser = data.process.cpuUser;
                            payload.os.process.uptime = data.process.uptime;
                            system.os.nodes.memory.free.textContent = `${payload.os.machine.memory.free.bytesLong()}, ${((payload.os.machine.memory.free / payload.os.machine.memory.total) * 100).toFixed(2)}%`;
                            system.os.nodes.memory.used.textContent = `${(payload.os.machine.memory.total - payload.os.machine.memory.free).bytesLong()}, ${(((payload.os.machine.memory.total - payload.os.machine.memory.free) / payload.os.machine.memory.total) * 100).toFixed(2)}%`;
                            system.os.nodes.memory.total.textContent = `${payload.os.machine.memory.total.bytesLong()}, 100%`;
                            system.os.nodes.os.uptime.textContent = payload.os.os.uptime.time();
                            system.os.nodes.process.cpuSystem.textContent = payload.os.process.cpuSystem.time();
                            system.os.nodes.process.cpuUser.textContent = payload.os.process.cpuUser.time();
                            system.os.nodes.process.uptime.textContent = payload.os.process.uptime.time();
                            system.os.nodes.process.memoryProcess.textContent = `${payload.os.process.memory.rss.bytesLong()}, ${((payload.os.process.memory.rss / payload.os.machine.memory.total) * 100).toFixed(2)}%`;
                            system.os.nodes.process.memoryV8.textContent = payload.os.process.memory.V8.bytesLong();
                            system.os.nodes.process.memoryExternal.textContent = payload.os.process.memory.external.bytesLong();
                        };
                    if (data_item.service === "dashboard-os-all") {
                        const data:services_os_all = data_item.data as services_os_all;
                        main(data);
                        network.interfaces.list(data.interfaces);
                        system.storage.list(data.storage);
                        utility.tables(system.processes, data.processes);
                        utility.tables(system.services, data.services);
                        utility.tables(network.sockets, data.sockets);
                        utility.tables(system.users, data.users);
                    } else if (data_item.service === "dashboard-os-disk") {
                        const data:services_os_disk = data_item.data as services_os_disk;
                        system.storage.list(data);
                    } else if (data_item.service === "dashboard-os-intr") {
                        const data:services_os_intr = data_item.data as services_os_intr;
                        network.interfaces.list(data);
                    } else if (data_item.service === "dashboard-os-main") {
                        const data:services_os_all = data_item.data as services_os_all;
                        main(data);
                    } else if (data_item.service === "dashboard-os-proc") {
                        const data:services_os_proc = data_item.data as services_os_proc;
                        utility.tables(system.processes, data);
                    } else if (data_item.service === "dashboard-os-serv") {
                        const data:services_os_serv = data_item.data as services_os_serv;
                        utility.tables(system.services, data);
                    } else if (data_item.service === "dashboard-os-sock") {
                        const data:services_os_sock = data_item.data as services_os_sock;
                        utility.tables(network.sockets, data);
                    } else if (data_item.service === "dashboard-os-user") {
                        const data:services_os_sock = data_item.data as services_os_sock;
                        utility.tables(system.users, data);
                    }
                }
            },
            processes: {
                init: function dashboard_processesInit():void {
                    system.processes.nodes.filter_column.selectedIndex = state.table_os.processes.filter_column;
                    system.processes.nodes.caseSensitive.checked = state.table_os.processes.filter_sensitive;
                    system.processes.nodes.filter_value.value = state.table_os.processes.filter_value;
                    system.processes.nodes.filter_column.onchange = utility.table_filter;
                    system.processes.nodes.caseSensitive.onclick = utility.setState;
                    system.processes.nodes.filter_value.onblur = utility.table_filter;
                    system.processes.nodes.filter_value.onkeyup = utility.table_filter;
                    system.processes.nodes.update_button.onclick = utility.table_update;
                    utility.sort_column_names(system.processes.nodes.list.parentNode, system.processes.nodes.filter_column);
                    utility.tables(system.processes, payload.os.processes);
                },
                nodes: {
                    caseSensitive: document.getElementById("processes").getElementsByClassName("table-filters")[0].getElementsByTagName("input")[1],
                    count: document.getElementById("processes").getElementsByClassName("table-stats")[0].getElementsByTagName("em")[0],
                    filter_column: document.getElementById("processes").getElementsByClassName("table-filters")[0].getElementsByTagName("select")[0],
                    filter_count: document.getElementById("processes").getElementsByClassName("table-stats")[0].getElementsByTagName("em")[1],
                    filter_value: document.getElementById("processes").getElementsByClassName("table-filters")[0].getElementsByTagName("input")[0],
                    list: document.getElementById("processes").getElementsByClassName("section")[0].getElementsByTagName("tbody")[0],
                    update_button: document.getElementById("processes").getElementsByClassName("table-stats")[0].getElementsByTagName("button")[0],
                    update_text: document.getElementById("processes").getElementsByClassName("table-stats")[0].getElementsByTagName("em")[2]
                }
            },
            services: {
                init: function dashboard_servicesInit():void {
                    system.services.nodes.filter_column.selectedIndex = state.table_os.services.filter_column;
                    system.services.nodes.caseSensitive.checked = state.table_os.services.filter_sensitive;
                    system.services.nodes.filter_value.value = state.table_os.services.filter_value;
                    system.services.nodes.filter_column.onchange = utility.table_filter;
                    system.services.nodes.caseSensitive.onclick = utility.setState;
                    system.services.nodes.filter_value.onblur = utility.table_filter;
                    system.services.nodes.filter_value.onkeyup = utility.table_filter;
                    system.services.nodes.update_button.onclick = utility.table_update;
                    utility.sort_column_names(system.services.nodes.list.parentNode, system.services.nodes.filter_column);
                    utility.tables(system.services, payload.os.services);
                },
                nodes: {
                    caseSensitive: document.getElementById("services").getElementsByClassName("table-filters")[0].getElementsByTagName("input")[1],
                    count: document.getElementById("services").getElementsByClassName("table-stats")[0].getElementsByTagName("em")[0],
                    filter_column: document.getElementById("services").getElementsByClassName("table-filters")[0].getElementsByTagName("select")[0],
                    filter_count: document.getElementById("services").getElementsByClassName("table-stats")[0].getElementsByTagName("em")[1],
                    filter_value: document.getElementById("services").getElementsByClassName("table-filters")[0].getElementsByTagName("input")[0],
                    list: document.getElementById("services").getElementsByClassName("section")[0].getElementsByTagName("tbody")[0],
                    update_button: document.getElementById("services").getElementsByClassName("table-stats")[0].getElementsByTagName("button")[0],
                    update_text: document.getElementById("services").getElementsByClassName("table-stats")[0].getElementsByTagName("em")[2]
                }
            },
            storage: {
                init: function dashboard_storageInit():void {
                    system.storage.nodes.update_button.onclick = utility.table_update;
                    system.storage.list(payload.os.storage);
                },
                list: function dashboard_storageList(item:services_os_disk):void {
                    if (item.data === null) {
                        return;
                    }
                    const output_old:HTMLElement = system.storage.nodes.list,
                        output_new:HTMLElement = document.createElement("div"),
                        len:number = item.data.length,
                        data_item = function dashboard_storageList_dataItem(ul:HTMLElement, disk:os_disk_partition[]|string, key:"active"|"bootable"|"bus"|"file_system"|"guid"|"hidden"|"id"|"name"|"partitions"|"path"|"read_only"|"serial"|"size_disk"|"size_free"|"size_total"|"size_used"|"type"):void {
                            const li:HTMLElement = document.createElement("li"),
                                len:number = (key === "partitions")
                                    ? item.data[index].partitions.length
                                    : 0,
                                strong:HTMLElement = (key === "partitions" && len > 0)
                                    ? document.createElement("h6")
                                    : document.createElement("strong"),
                                span:HTMLElement = document.createElement("span"),
                                cap = function dashboard_osStorage_dataItem_cap(input:string):string {
                                    return ` ${input.replace("_", "").capitalize()}`;
                                };
                            strong.textContent = key.capitalize().replace(/_\w/, cap);
                            li.appendChild(strong);
                            if (key === "partitions" && len > 0) {
                                let list:HTMLElement = null,
                                    pIndex:number = 0,
                                    warn:HTMLElement = null,
                                    p:HTMLElement = null,
                                    percent:number = 0;
                                span.textContent = String(len);
                                li.appendChild(span);
                                do {
                                    list = document.createElement("ul");
                                    list.setAttribute("class", "os-interface");
                                    percent = (item.data[index].partitions[pIndex].size_free === 0 || item.data[index].partitions[pIndex].size_total === 0)
                                        ? 100
                                        : Math.round((item.data[index].partitions[pIndex].size_free / item.data[index].partitions[pIndex].size_total) * 100);
                                    if (percent < 16) {
                                        warn = document.createElement("strong");
                                        p = document.createElement("p");
                                        warn.textContent = "Warning!";
                                        p.appendChild(warn);
                                        p.appendText(` Disk partition ${String(item.data[index].partitions[pIndex].id)} only has ${percent}% capacity free.`);
                                        li.appendChild(p);
                                    }
                                    data_item(list, String(item.data[index].partitions[pIndex].active), "active");
                                    data_item(list, String(item.data[index].partitions[pIndex].bootable), "bootable");
                                    data_item(list, String(item.data[index].partitions[pIndex].file_system), "file_system");
                                    data_item(list, String(item.data[index].partitions[pIndex].hidden), "hidden");
                                    data_item(list, String(item.data[index].partitions[pIndex].id), "id");
                                    data_item(list, String(item.data[index].partitions[pIndex].path), "path");
                                    data_item(list, String(item.data[index].partitions[pIndex].read_only), "read_only");
                                    if (item.data[index].partitions[pIndex].size_free === 0 || item.data[index].partitions[pIndex].size_total === 0) {
                                        data_item(list, item.data[index].partitions[pIndex].size_free.bytesLong(), "size_free");
                                    } else {
                                        data_item(list, `${item.data[index].partitions[pIndex].size_free.bytesLong()}, ${percent}%`, "size_free");
                                    }
                                    if (item.data[index].partitions[pIndex].size_free === 0 || item.data[index].partitions[pIndex].size_total === 0) {
                                        data_item(list, `${item.data[index].partitions[pIndex].size_used.bytesLong()}`, "size_used");
                                    } else {
                                        data_item(list, `${item.data[index].partitions[pIndex].size_used.bytesLong()}, ${Math.round((item.data[index].partitions[pIndex].size_used / item.data[index].partitions[pIndex].size_total) * 100)}%`, "size_used");
                                    }
                                    if (item.data[index].partitions[pIndex].size_total === 0) {
                                        data_item(list, "0 bytes (0B)", "size_total");
                                    } else {
                                        data_item(list, `${item.data[index].partitions[pIndex].size_total.bytesLong()}, 100%`, "size_total");
                                    }
                                    data_item(list, item.data[index].partitions[pIndex].type, "type");
                                    li.appendChild(list);
                                    pIndex = pIndex + 1;
                                } while (pIndex < len);
                            } else {
                                if (key === "size_free") {
                                    const val:string = disk as string,
                                        index:number = val.indexOf(", ") + 2,
                                        percent:number = (val === "0")
                                            ? 0
                                            : Number(val.slice(index, val.indexOf("%")));
                                    if (val !== "0" && percent < 16) {
                                        const bad:HTMLElement = document.createElement("strong");
                                        bad.textContent = `${percent}%`;
                                        bad.setAttribute("class", "fail");
                                        span.textContent = val.slice(0, index);
                                        span.appendChild(bad);
                                        ul.setAttribute("class", "os-interface fail-list");
                                    } else {
                                        span.textContent = disk as string;
                                    }
                                } else {
                                    if (key === "partitions") {
                                        span.textContent = "none";
                                    } else {
                                        span.textContent = disk as string;
                                    }
                                }
                                li.appendChild(span);
                            }
                            ul.appendChild(li);
                        };
                    let div:HTMLElement = null,
                        ul:HTMLElement = null,
                        h3:HTMLElement = null,
                        index:number = 0;
                    if (len > 0) {
                        do {
                            div = document.createElement("div");
                            ul = document.createElement("ul");
                            h3 = document.createElement("h3");
                            h3.textContent = item.data[index].name;
                            div.appendChild(h3);
                            data_item(ul, String(item.data[index].bus), "bus");
                            data_item(ul, String(item.data[index].guid), "guid");
                            data_item(ul, String(item.data[index].name), "name");
                            data_item(ul, String(item.data[index].serial), "serial");
                            data_item(ul, item.data[index].size_disk.bytesLong(), "size_disk");
                            data_item(ul, item.data[index].partitions, "partitions");
                            div.appendChild(ul);
                            div.setAttribute("class", "section");
                            output_new.appendChild(div);
                            index = index + 1;
                        } while (index < len);
                    }
                    output_new.setAttribute("class", "item-list");
                    output_old.parentNode.insertBefore(output_new, output_old);
                    output_old.parentNode.removeChild(output_old);
                    system.storage.nodes.list = output_new;
                    system.storage.nodes.count.textContent = String(len);
                    system.storage.nodes.update_text.textContent = item.time.dateTime(true, payload.timeZone_offset);
                },
                nodes: {
                    count: document.getElementById("storage").getElementsByClassName("table-stats")[0].getElementsByTagName("em")[0],
                    list: document.getElementById("storage").getElementsByClassName("item-list")[0] as HTMLElement,
                    update_button: document.getElementById("storage").getElementsByClassName("table-stats")[0].getElementsByTagName("button")[0],
                    update_text: document.getElementById("storage").getElementsByClassName("table-stats")[0].getElementsByTagName("em")[1]
                }
            },
            users: {
                init: function dashboard_usersInit():void {
                    system.users.nodes.filter_column.selectedIndex = state.table_os.users.filter_column;
                    system.users.nodes.caseSensitive.checked = state.table_os.users.filter_sensitive;
                    system.users.nodes.filter_value.value = state.table_os.users.filter_value;
                    system.users.nodes.filter_column.onchange = utility.table_filter;
                    system.users.nodes.caseSensitive.onclick = utility.setState;
                    system.users.nodes.filter_value.onblur = utility.table_filter;
                    system.users.nodes.filter_value.onkeyup = utility.table_filter;
                    system.users.nodes.update_button.onclick = utility.table_update;
                    utility.sort_column_names(system.users.nodes.list.parentNode, system.users.nodes.filter_column);
                    utility.tables(system.users, payload.os.users);
                },
                nodes: {
                    caseSensitive: document.getElementById("users").getElementsByClassName("table-filters")[0].getElementsByTagName("input")[1],
                    count: document.getElementById("users").getElementsByClassName("table-stats")[0].getElementsByTagName("em")[0],
                    filter_column: document.getElementById("users").getElementsByClassName("table-filters")[0].getElementsByTagName("select")[0],
                    filter_count: document.getElementById("users").getElementsByClassName("table-stats")[0].getElementsByTagName("em")[1],
                    filter_value: document.getElementById("users").getElementsByClassName("table-filters")[0].getElementsByTagName("input")[0],
                    list: document.getElementById("users").getElementsByClassName("section")[0].getElementsByTagName("tbody")[0],
                    update_button: document.getElementById("users").getElementsByClassName("table-stats")[0].getElementsByTagName("button")[0],
                    update_text: document.getElementById("users").getElementsByClassName("table-stats")[0].getElementsByTagName("em")[2]
                }
            }
        },
        tools:structure_tools = {
            dns: {
                direction: function dashboard_dnsDirection(reverse:boolean):void {
                    const label:Node = tools.dns.nodes.hosts.parentNode.firstChild;
                    if (reverse === true) {
                        label.textContent = "Comma separated list of IP addresses ";
                        tools.dns.nodes.types.disabled = true;
                    } else {
                        label.textContent = "Comma separated list of domains and/or hostname entries ";
                        tools.dns.nodes.types.disabled = false;
                    }
                },
                directionEvent: function dashboard_dnsDirectionEvent(event:MouseEvent):void {
                    tools.dns.direction(event.target === tools.dns.nodes.reverse);
                },
                init: function dashboard_dnsInit():void {
                    tools.dns.nodes.query.onclick = tools.dns.query;
                    tools.dns.nodes.output.value = "";
                    tools.dns.nodes.lookup.checked = true;
                    tools.dns.nodes.reverse.checked = state.dns.reverse;
                    tools.dns.nodes.hosts.value = state.dns.hosts;
                    tools.dns.nodes.types.value = state.dns.types;
                    tools.dns.nodes.hosts.onkeyup = tools.dns.query;
                    tools.dns.nodes.types.onkeyup = tools.dns.query;
                    tools.dns.nodes.lookup.onclick = tools.dns.directionEvent;
                    tools.dns.nodes.reverse.onclick = tools.dns.directionEvent;
                    tools.dns.direction(state.dns.reverse);
                },
                nodes: {
                    hosts: document.getElementById("dns").getElementsByTagName("input")[2],
                    lookup: document.getElementById("dns").getElementsByTagName("input")[0],
                    output: document.getElementById("dns").getElementsByTagName("textarea")[0],
                    query: document.getElementById("dns").getElementsByTagName("button")[1],
                    reverse: document.getElementById("dns").getElementsByTagName("input")[1],
                    types: document.getElementById("dns").getElementsByTagName("input")[3]
                },
                query: function dashboard_dnsQuery(event:KeyboardEvent|MouseEvent):void {
                    const target:HTMLElement = event.target,
                        key:KeyboardEvent = event as KeyboardEvent;
                    if (target === tools.dns.nodes.query || (target !== tools.dns.nodes.query && key.key === "Enter")) {
                        const values:string[] = tools.dns.nodes.hosts.value.replace(/,\s+/g, ",").split(","),
                            types:string = tools.dns.nodes.types.value,
                            payload:services_dns_input = {
                                names: values,
                                reverse: tools.dns.nodes.reverse.checked,
                                types: types
                            };
                        utility.setState();
                        utility.message_send(payload, "dashboard-dns");
                        tools.dns.nodes.output.value = "";
                    }
                },
                receive: function dashboard_dnsReceive(data_item:socket_data):void {
                    const reverse:services_dns_reverse = data_item.data as services_dns_reverse;
                    if (reverse.reverse === true) {
                        const keys:string[] = Object.keys(reverse.hostnames),
                            len:number = keys.length;
                        if (len > 0) {
                            const output:string[] = ["{"];
                            let index_host:number = 0,
                                index_address:number = 0,
                                len_address:number = 0,
                                comma_address:string = "",
                                comma_host:string = "";
                            do {
                                len_address = reverse.hostnames[keys[index_host]].length;
                                comma_host = (index_host < len - 1)
                                    ? ","
                                    : "";
                                if (len_address === 0) {
                                    output.push(`    "${keys[index_host]}": []${comma_host}`);
                                } else if (len_address === 1) {
                                    output.push(`    "${keys[index_host]}": ["${reverse.hostnames[keys[index_host]][0]}"]${comma_host}`);
                                } else {
                                    index_address = 0;
                                    output.push(`    "${keys[index_host]}": [`);
                                    do {
                                        comma_address = (index_address < len_address - 1)
                                            ? ","
                                            : "";
                                        output.push(`        "${reverse.hostnames[keys[index_host]][index_address]}"${comma_address}`);
                                        index_address = index_address + 1;
                                    } while (index_address < len_address);
                                    output.push(`    ]${comma_host}`);
                                }
                                index_host = index_host + 1;
                            } while (index_host < len);
                            output.push("}");
                            tools.dns.nodes.output.value = output.join("\n");
                        } else {
                            tools.dns.nodes.output.value = "{}";
                        }
                    } else {
                        const result:services_dns_output = data_item.data as services_dns_output,
                            hosts:string[] = Object.keys(result),
                            len_hosts:number = hosts.length;
                        if (len_hosts > 0) {
                            const output:string[] = ["{"],
                                sort = function dashboard_dnsReceive_sort(a:string, b:string):-1|1 {
                                    if (a < b) {
                                        return -1;
                                    }
                                    return 1;
                                },
                                types:type_dns_types[] = Object.keys(result[hosts[0]]) as type_dns_types[],
                                len_types:number = types.length,
                                get_max = function dashboard_dnsReceive_getMax(input:string[]):number {
                                    let index_input:number = input.length,
                                        max:number = 0;
                                    do {
                                        index_input = index_input - 1;
                                        if (input[index_input].length > max) {
                                            max = input[index_input].length;
                                        }
                                    } while (index_input > 0);
                                    return max;
                                },
                                max_type:number = get_max(types),
                                pad = function dashboard_dnsReceive_pad(input:string, max:number):string {
                                    input = `"${input}"`;
                                    max = max + 2;
                                    if (input.length === max) {
                                        return input;
                                    }
                                    do {
                                        input = `${input} `;
                                    } while (input.length < max);
                                    return input;
                                },
                                object = function dashboard_dnsReceive_object(object:node_dns_soaRecord, soa:boolean):void {
                                    const indent:string = (soa === true)
                                            ? ""
                                            : "    ",
                                        obj:string[] = Object.keys(object),
                                        len_obj:number = obj.length,
                                        max_obj:number = get_max(obj);
                                    let index_obj:number = 0;
                                    obj.sort();
                                    if (soa === true) {
                                        output.push(`        ${pad("SOA", max_type)}: {`);
                                    } else {
                                        output.push("            {");
                                    }
                                    do {
                                        if (isNaN(Number(object[obj[index_obj] as "hostmaster"])) === true) {
                                            output.push(`            ${indent + pad(obj[index_obj], max_obj)}: "${object[obj[index_obj] as "hostmaster"]}",`);
                                        } else {
                                            output.push(`            ${indent + pad(obj[index_obj], max_obj)}: ${object[obj[index_obj] as "hostmaster"]},`);
                                        }
                                        index_obj = index_obj + 1;
                                    } while (index_obj < len_obj);
                                    output[output.length - 1] = output[output.length - 1].slice(0, output[output.length - 1].length - 1);
                                    output.push(`${indent}        },`);
                                };
                            let index_hosts:number = 0,
                                index_types:number = 0,
                                index_object:number = 0,
                                len_object:number = 0,
                                record_string:string[] = null,
                                record_strings:string[][] = null,
                                record_object:node_dns_soaRecord[] = null;
                            types.sort(sort);
                            // beautification, loop through hostnames
                            do {
                                output.push(`    "${hosts[index_hosts]}": {`);
                                index_types = 0;
                                // loop through type names on each hostname
                                do {
                                    // SOA object
                                    if (types[index_types] === "SOA" && Array.isArray(result[hosts[index_hosts]].SOA) === false) {
                                        object(result[hosts[index_hosts]].SOA as node_dns_soaRecord, true);
                                        output.push("        },");
                                    // array of objects
                                    } else if ((types[index_types] === "CAA" || types[index_types] === "MX" || types[index_types] === "NAPTR" || types[index_types] === "SRV")) {
                                        record_object = result[hosts[index_hosts]][types[index_types]] as node_dns_soaRecord[];
                                        len_object = record_object.length;
                                        if (len_object < 1) {
                                            output.push(`        ${pad(types[index_types], max_type)}: [],`);
                                        } else if (typeof record_object[0] === "string") {
                                            output.push(`        ${pad(types[index_types], max_type)}: ["${record_object[0]}"],`);
                                        } else {
                                            output.push(`        ${pad(types[index_types], max_type)}: [`);
                                            index_object = 0;
                                            if (len_object > 0) {
                                                // loop through keys of each child object of an array
                                                do {
                                                    object(record_object[index_object] as node_dns_soaRecord, false);
                                                    index_object = index_object + 1;
                                                } while (index_object < len_object);
                                                output[output.length - 1] = output[output.length - 1].slice(0, output[output.length - 1].length - 1);
                                            }
                                            output.push("        ],");
                                        }
                                    // string[][]
                                    } else if (types[index_types] === "TXT") {
                                        record_strings = result[hosts[index_hosts]].TXT as string[][];
                                        len_object = record_strings.length;
                                        if (len_object < 1) {
                                            output.push(`        ${pad(types[index_types], max_type)}: [],`);
                                        } else if (Array.isArray(record_strings[0]) === false) {
                                            output.push(`        ${pad(types[index_types], max_type)}: ["${record_strings.join("")}"],`);
                                        } else {
                                            output.push(`        ${pad(types[index_types], max_type)}: [`);
                                            index_object = 0;
                                            // loop through string array of a parent array
                                            do {
                                                output.push(`            ["${record_strings[index_object].join("\", \"")}"],`);
                                                index_object = index_object + 1;
                                            } while (index_object < len_object);
                                            output[output.length - 1] = output[output.length - 1].slice(0, output[output.length - 1].length - 1);
                                            output.push("        ],");
                                        }
                                    // string[]
                                    } else {
                                        record_string = (result[hosts[index_hosts]][types[index_types]] as string[]);
                                        if (record_string.length < 1) {
                                            output.push(`        ${pad(types[index_types], max_type)}: [],`);
                                        } else {
                                            output.push(`        ${pad(types[index_types], max_type)}: ["${record_string.join("\", \"")}"],`);
                                        }
                                    }
                                    index_types = index_types + 1;
                                } while (index_types < len_types);
                                output[output.length - 1] = output[output.length - 1].slice(0, output[output.length - 1].length - 1);
                                output.push("    },");
                                index_hosts = index_hosts + 1;
                            } while (index_hosts < len_hosts);
                            output[output.length - 1] = output[output.length - 1].slice(0, output[output.length - 1].length - 1);
                            output.push("}");
                            tools.dns.nodes.output.value = output.join("\n");
                        } else {
                            tools.dns.nodes.output.value = "{}";
                        }
                    }
                }
            },
            fileSystem: {
                init: function dashboard_fileSystemInit():void {
                    tools.fileSystem.nodes.path.onblur = tools.fileSystem.send;
                    tools.fileSystem.nodes.search.onblur = tools.fileSystem.send;
                    tools.fileSystem.nodes.path.onkeydown = tools.fileSystem.key;
                    tools.fileSystem.nodes.search.onkeydown = tools.fileSystem.key;
                    tools.fileSystem.nodes.path.value = state.fileSystem.path;
                    tools.fileSystem.nodes.search.value = state.fileSystem.search;
                },
                key: function dashboard_fileSystemKey(event:KeyboardEvent):void {
                    if (event.key.toLowerCase() === "enter") {
                        tools.fileSystem.send(event);
                    }
                },
                nodes: {
                    content: document.getElementById("file-system").getElementsByClassName("file-system-content")[0] as HTMLElement,
                    failures: document.getElementById("file-system").getElementsByClassName("file-system-failures")[0] as HTMLElement,
                    output: document.getElementById("file-system").getElementsByClassName("file-list")[0] as HTMLElement,
                    path: document.getElementById("file-system").getElementsByTagName("input")[0],
                    search: document.getElementById("file-system").getElementsByTagName("input")[1],
                    summary: document.getElementById("file-system").getElementsByClassName("summary-stats")[0] as HTMLElement
                },
                receive: function dashboard_fileSystemReceive(data_item:socket_data):void {
                    const fs:services_fileSystem = data_item.data as services_fileSystem,
                        len:number = fs.dirs.length,
                        len_fail:number = fs.failures.length,
                        fails:HTMLElement = (len_fail > 0 && fs.dirs[0][1] === "directory")
                            ? document.createElement("ul")
                            : document.createElement("p"),
                        summary:store_number = {
                            "block_device": 0,
                            "character_device": 0,
                            "directory": -2,
                            "fifo_pipe": 0,
                            "file": 0,
                            "socket": 0,
                            "symbolic_link": 0
                        },
                        tbody_old:HTMLElement = tools.fileSystem.nodes.output.getElementsByTagName("tbody")[0],
                        tbody_new:HTMLElement = document.createElement("tbody"),
                        icons:store_string = {
                            "block_device": "\u2580",
                            "character_device": "\u0258",
                            "directory": "\ud83d\udcc1",
                            "fifo_pipe": "\u275a",
                            "file": "\ud83d\uddce",
                            "socket": "\ud83d\udd0c",
                            "symbolic_link": "\ud83d\udd17"
                        },
                        failureTitle:HTMLElement = tools.fileSystem.nodes.failures.parentNode.getElementsByTagName("h3")[0],
                        record = function dashboard_fileSystemReceive_record(index:number):void {
                            const item:type_directory_item = (index < 0)
                                    ? fs.parent
                                    : fs.dirs[index],
                                name:string = (index < 0)
                                    ? ".."
                                    : (index === 0 && fs.search === null)
                                        ? "."
                                        : item[0],
                                name_raw:string = (index < 1)
                                    ? ((/^\w:(\\)?$/).test(fs.address) === true)
                                        ? "\\"
                                        : item[0]
                                    : (fs.address === "\\")
                                        ? item[0]
                                        : fs.address.replace(/(\\|\/)\s*$/, "") + fs.sep + item[0];
                            let tr:HTMLElement = null,
                                td:HTMLElement = null,
                                button:HTMLElement = null,
                                span:HTMLElement = null,
                                dtg:string[] = null;
                            summary[item[1]] = summary[item[1]] + 1;
                            size = size + item[5].size;
                            dtg = item[5].mtimeMs.dateTime(true, payload.timeZone_offset).split(", ");
                            button = document.createElement("button");
                            tr = document.createElement("tr");
                            span = document.createElement("span");
                            tr.setAttribute("class", (index % 2 === 0) ? "even" : "odd");
    
                            td = document.createElement("td");
                            td.setAttribute("data-raw", name_raw);
                            td.setAttribute("class", "file-name");
                            button.appendText(name);
                            button.onclick = tools.fileSystem.send;
                            span.setAttribute("class", "icon");
                            span.appendText(icons[item[1]]);
                            td.appendChild(span);
                            td.appendText(" ");
                            td.appendChild(button);
                            tr.appendChild(td);
    
                            td = document.createElement("td");
                            td.appendText(item[1]);
                            tr.appendChild(td);
    
                            td = document.createElement("td");
                            td.setAttribute("data-raw", String(item[5].size));
                            td.appendText(item[5].size.commas());
                            tr.appendChild(td);
    
                            td = document.createElement("td");
                            td.setAttribute("data-raw", String(item[5].mtimeMs));
                            td.appendText(dtg[0]);
                            tr.appendChild(td);
    
                            td = document.createElement("td");
                            td.appendText(dtg[1]);
                            tr.appendChild(td);
    
                            td = document.createElement("td");
                            td.appendText(item[5].mode === null ? "" : (item[5].mode & parseInt("777", 8)).toString(8));
                            tr.appendChild(td);
    
                            td = document.createElement("td");
                            td.setAttribute("data-raw", String(item[4]));
                            td.appendText(item[4].commas());
                            tr.appendChild(td);
                            tbody_new.appendChild(tr);
                        };
                    let index_record:number = 0,
                        size:number = 0;
                    tools.fileSystem.nodes.path.value = fs.address;
                    tools.fileSystem.nodes.search.value = (fs.search === null)
                        ? ""
                        : fs.search;
                    utility.setState();
                    // td[0] = icon name
                    // td[1] = type
                    // td[2] = size
                    // td[3] = modified date
                    // td[4] = modified time
                    // td[5] = permissions
                    // td[6] = children
                    if (fs.dirs[0] === null) {
                        tools.fileSystem.nodes.output.style.display = "none";
                    } else {
                        tools.fileSystem.nodes.output.style.display = "block";
                        if (fs.parent !== null) {
                            record(-1);
                        }
                        if (len > 0) {
                            do {
                                record(index_record);
                                index_record = index_record + 1;
                            } while (index_record < len);
                            tbody_old.parentNode.appendChild(tbody_new);
                            tbody_old.parentNode.removeChild(tbody_old);
                        }
                    }
                    if (fs.dirs[0][1] === "directory" || fs.search !== null) {
                        const li:HTMLCollectionOf<HTMLElement> = tools.fileSystem.nodes.summary.getElementsByTagName("li");
                        li[0].getElementsByTagName("strong")[0].textContent = size.commas();
                        li[1].getElementsByTagName("strong")[0].textContent = (fs.dirs.length - 1).commas();
                        li[2].getElementsByTagName("strong")[0].textContent = summary.block_device.commas();
                        li[3].getElementsByTagName("strong")[0].textContent = summary.character_device.commas();
                        li[4].getElementsByTagName("strong")[0].textContent = summary.directory.commas();
                        li[5].getElementsByTagName("strong")[0].textContent = summary.fifo_pipe.commas();
                        li[6].getElementsByTagName("strong")[0].textContent = summary.file.commas();
                        li[7].getElementsByTagName("strong")[0].textContent = summary.socket.commas();
                        li[8].getElementsByTagName("strong")[0].textContent = summary.symbolic_link.commas();
                        tools.fileSystem.nodes.summary.style.display = "block";
                    } else {
                        tools.fileSystem.nodes.summary.style.display = "none";
                    }
                    if (fs.file === null) {
                        tools.fileSystem.nodes.content.style.display = "none";
                        if (len_fail > 0) {
                            let index_fail:number = 0,
                                li:HTMLElement = null;
                            do {
                                li = document.createElement("li");
                                li.appendText(fs.failures[index_fail]);
                                fails.appendChild(li);
                                index_fail = index_fail + 1;
                            } while (index_fail < len_fail);
                        } else {
                            fails.appendText("0 artifacts failed accessing.");
                        }
                        failureTitle.textContent = "Items in current directory that could not be read";
                    } else {
                        const strong:HTMLElement = document.createElement("strong");
                        strong.appendText(fs.failures[0]);
                        tools.fileSystem.nodes.content.style.display = "block";
                        tools.fileSystem.nodes.content.getElementsByTagName("textarea")[0].value = fs.file.replace(/\u0000/g, "");
                        if (fs.failures[0] === "binary") {
                            fails.appendText("File is either binary or uses a text encoding larger than utf8.");
                        } else {
                            fails.appendText("File encoded as ");
                            fails.appendChild(strong);
                            fails.appendText(".");
                        }
                        failureTitle.textContent = "File encoding";
                    }
                    fails.setAttribute("class", tools.fileSystem.nodes.failures.getAttribute("class"));
                    tools.fileSystem.nodes.failures.parentNode.appendChild(fails);
                    tools.fileSystem.nodes.failures.parentNode.removeChild(tools.fileSystem.nodes.failures);
                    tools.fileSystem.nodes.failures = fails;
                },
                send: function dashboard_fileSystemSend(event:FocusEvent|KeyboardEvent):void {
                    const target:HTMLElement = event.target,
                        name:string = target.lowName(),
                        address:string = (name === "input")
                            ? tools.fileSystem.nodes.path.value.replace(/^\s+/, "").replace(/\s+$/, "")
                            : target.parentNode.dataset.raw,
                        search:string = (name === "input")
                            ? tools.fileSystem.nodes.search.value.replace(/^\s+/, "").replace(/\s+$/, "")
                            : null,
                        payload:services_fileSystem = {
                            address: address,
                            dirs: null,
                            failures: null,
                            file: null,
                            parent: null,
                            search: (search !== null && search.replace(/\s+/, "") === "")
                                ? null
                                : search,
                            sep: null
                        };
                    utility.message_send(payload, "dashboard-fileSystem");
                }
            },
            hash: {
                init: function dashboard_hashInit():void {
                    const len:number = payload.hashes.length;
                    let index:number = 0,
                        option:HTMLElement = null;
                    do {
                        option = document.createElement("option");
                        option.textContent = payload.hashes[index];
                        if (state.hash.algorithm === payload.hashes[index] || (state.hash.algorithm === "" && payload.hashes[index] === "sha3-512")) {
                            option.setAttribute("selected", "selected");
                        }
                        tools.hash.nodes.algorithm.appendChild(option);
                        index = index + 1;
                    } while (index < len);
                    if (state.hash.hashFunction === "hash") {
                        tools.hash.nodes.hash.checked = true;
                    } else {
                        tools.hash.nodes.base64.checked = true;
                    }
                    if (state.hash.type === "string") {
                        tools.hash.nodes.string.checked = true;
                    } else {
                        tools.hash.nodes.file.checked = true;
                    }
                    if (state.hash.digest === "hex") {
                        tools.hash.nodes.hex.checked = true;
                    } else {
                        tools.hash.nodes.digest.checked = true;
                    }

                    tools.hash.nodes.source.value = state.hash.source;
                    tools.hash.nodes.button.onclick = tools.hash.request;
                    tools.hash.nodes.base64.onclick = tools.hash.toggle_mode;
                    tools.hash.nodes.hash.onclick = tools.hash.toggle_mode;
                    tools.hash.toggle_mode(null);
                },
                nodes: {
                    algorithm: document.getElementById("hash").getElementsByClassName("form")[0].getElementsByTagName("select")[0],
                    base64: document.getElementById("hash").getElementsByClassName("form")[0].getElementsByTagName("input")[1],
                    button: document.getElementById("hash").getElementsByClassName("form")[0].getElementsByTagName("button")[0],
                    digest: document.getElementById("hash").getElementsByClassName("form")[0].getElementsByTagName("input")[5],
                    file: document.getElementById("hash").getElementsByClassName("form")[0].getElementsByTagName("input")[3],
                    hash: document.getElementById("hash").getElementsByClassName("form")[0].getElementsByTagName("input")[0],
                    hex: document.getElementById("hash").getElementsByClassName("form")[0].getElementsByTagName("input")[4],
                    output: document.getElementById("hash").getElementsByClassName("form")[1].getElementsByTagName("textarea")[0],
                    size: document.getElementById("hash").getElementsByClassName("form")[1].getElementsByTagName("strong")[0],
                    source: document.getElementById("hash").getElementsByClassName("form")[0].getElementsByTagName("textarea")[0],
                    string: document.getElementById("hash").getElementsByClassName("form")[0].getElementsByTagName("input")[2],
                    type: document.getElementById("hash").getElementsByClassName("form")[0].getElementsByTagName("input")[3]
                },
                receive: function dashboard_hashReceive(data_item:socket_data):void {
                    const data:services_hash = data_item.data as services_hash;
                    tools.hash.nodes.output.value = data.value;
                    tools.hash.nodes.size.textContent = data.size.commas();
                },
                request: function dashboard_hashRequest():void {
                    const option:HTMLOptionElement = tools.hash.nodes.algorithm[tools.hash.nodes.algorithm.selectedIndex] as HTMLOptionElement,
                        selectValue:string = option.value,
                        service:services_hash = {
                            algorithm: selectValue,
                            base64: (tools.hash.nodes.base64.checked === true),
                            digest: (tools.hash.nodes.digest.checked === true)
                                ? "base64"
                                : "hex",
                            size: 0,
                            type: (tools.hash.nodes.type.checked === true)
                                ? "file"
                                : "direct",
                            value: tools.hash.nodes.source.value
                        };
                    tools.hash.nodes.output.value = "";
                    utility.setState();
                    utility.message_send(service, "dashboard-hash");
                },
                toggle_mode: function dashboard_hashToggleMode(event:MouseEvent):void {
                    const target:HTMLElement = (event === null)
                        ? (tools.hash.nodes.hash.checked === true)
                            ? tools.hash.nodes.hash
                            : tools.hash.nodes.base64
                        : event.target;
                    if (target === tools.hash.nodes.hash) {
                        tools.hash.nodes.digest.disabled = false;
                        tools.hash.nodes.hex.disabled = false;
                    } else {
                        tools.hash.nodes.digest.disabled = true;
                        tools.hash.nodes.hex.disabled = true;
                    }
                }
            },
            http: {
                init: function dashboard_httpInit():void {
                    // populate a default HTTP test value
                    tools.http.nodes.request.value = state.http.request;
                    tools.http.nodes.http_request.onclick = tools.http.request;
                    tools.http.nodes.responseBody.value = "";
                    tools.http.nodes.responseHeaders.value = "";
                    tools.http.nodes.responseURI.value = "";
                    if (state.http.encryption === true) {
                        document.getElementById("http").getElementsByTagName("input")[1].checked =  true;
                    } else {
                        document.getElementById("http").getElementsByTagName("input")[0].checked =  true;
                    }
                    tools.http.nodes.request.value = state.http.request;
                },
                nodes: {
                    encryption: document.getElementById("http").getElementsByTagName("input")[1],
                    http_request: document.getElementById("http").getElementsByClassName("send_request")[0] as HTMLButtonElement,
                    request: document.getElementById("http").getElementsByTagName("textarea")[0],
                    responseBody: document.getElementById("http").getElementsByTagName("textarea")[3],
                    responseHeaders: document.getElementById("http").getElementsByTagName("textarea")[2],
                    responseURI: document.getElementById("http").getElementsByTagName("textarea")[1],
                    stats: document.getElementById("http").getElementsByClassName("summary-stats")[0].getElementsByTagName("strong"),
                    timeout: document.getElementById("http").getElementsByTagName("input")[2]
                },
                receive: function dashboard_httpReceive(data_item:socket_data):void {
                    const data:services_http_test = data_item.data as services_http_test;
                    tools.http.nodes.responseBody.value = data.body;
                    tools.http.nodes.responseHeaders.value = data.headers;
                    tools.http.nodes.responseURI.value = data.uri;
                    // round trip time
                    tools.http.nodes.stats[0].textContent = `${data.stats.time} seconds`;
                    // response header size
                    tools.http.nodes.stats[1].textContent = data.stats.response.size_header.bytesLong();
                    // response body size
                    tools.http.nodes.stats[2].textContent = data.stats.response.size_body.bytesLong();
                    // chunked?
                    tools.http.nodes.stats[3].textContent = String(data.stats.chunks.chunked);
                    // chunk count
                    tools.http.nodes.stats[4].textContent = data.stats.chunks.count.commas();
                    // request header size
                    tools.http.nodes.stats[5].textContent = data.stats.request.size_header.bytesLong();
                    // request body size
                    tools.http.nodes.stats[6].textContent = data.stats.request.size_body.bytesLong();
                    // URI length
                    tools.http.nodes.stats[7].textContent = `${JSON.parse(data.uri.replace(/\s+"/g, "\"")).absolute.length.commas()} characters`;
                },
                request: function dashboard_httpRequest():void {
                    const encryption:boolean = tools.http.nodes.encryption.checked,
                        timeout:number = Number(tools.http.nodes.timeout.value),
                        data:services_http_test = {
                            body: "",
                            encryption: encryption,
                            headers: tools.http.nodes.request.value,
                            stats: null,
                            timeout: (isNaN(timeout) === true || timeout < 0)
                                ? 0
                                : Math.floor(timeout),
                            uri: ""
                        };
                    utility.setState();
                    utility.message_send(data, "dashboard-http");
                    tools.http.nodes.responseBody.value = "";
                    tools.http.nodes.responseHeaders.value = "";
                    tools.http.nodes.responseURI.value = "";
                    tools.http.nodes.stats[0].textContent = "";
                    tools.http.nodes.stats[1].textContent = "";
                    tools.http.nodes.stats[2].textContent = "";
                    tools.http.nodes.stats[3].textContent = "";
                    tools.http.nodes.stats[4].textContent = "";
                    tools.http.nodes.stats[5].textContent = "";
                    tools.http.nodes.stats[6].textContent = "";
                    tools.http.nodes.stats[7].textContent = "";
                }
            },
            terminal: {
                // https://xtermjs.org/docs/
                cols: 60,
                events: {
                    change: function dashboard_terminalChange():void {
                        utility.setState();
                        tools.terminal.item.dispose();
                        tools.terminal.socket.close();
                        tools.terminal.item = null;
                        tools.terminal.socket = null;
                        tools.terminal.shell();
                    },
                    data: function dashboard_terminalData(event:websocket_event):void {
                        tools.terminal.item.write(event.data);
                    },
                    firstData: function dashboard_terminalFirstData(event:websocket_event):void {
                        tools.terminal.socket.onmessage = tools.terminal.events.data;
                        tools.terminal.info = JSON.parse(event.data);
                        tools.terminal.nodes.output.setAttribute("data-info", event.data);
                    },
                    input: function dashboard_terminalInput(input:terminal_input):void {
                        if (tools.terminal.socket.readyState === 1) {
                            tools.terminal.socket.send(input.key);
                        }
                    },
                    resize: function dashboard_terminalResize():void {
                        const char_height:number = (tools.terminal.item === null)
                                ? 17
                                : (document.getElementById("terminal").getElementsByClassName("xterm-rows")[0] === undefined)
                                    ? 17
                                    : Number(document.getElementById("terminal").getElementsByClassName("xterm-rows")[0].getElementsByTagName("div")[0].style.height.replace("px", "")),
                            char_width:number = 9,
                            output_height:number = window.innerHeight - 110,
                            output_width:number = tools.terminal.nodes.output.clientWidth,
                            cols:number = Math.floor(output_width / char_width),
                            rows:number = Math.floor(output_height / char_height);
                        if (tools.terminal.cols !== cols || tools.terminal.rows !== rows) {
                            tools.terminal.cols = cols;
                            tools.terminal.rows = rows;
                            tools.terminal.nodes.output.style.height = `${output_height / 10}em`;
                            if (tools.terminal.item !== null) {
                                tools.terminal.item.resize(tools.terminal.cols, tools.terminal.rows);
                            }
                            if (tools.terminal.info !== null) {
                                utility.message_send({
                                    cols: tools.terminal.cols,
                                    hash: tools.terminal.info.socket_hash,
                                    rows: tools.terminal.rows,
                                    secure: (location.protocol === "http:")
                                        ? "open"
                                        : "secure"
                                } as services_terminal_resize, "dashboard-terminal-resize");
                            }
                        }
                    },
                    selection: function dashboard_terminalSelection():void {
                        navigator.clipboard.write([
                            new ClipboardItem({["text/plain"]: tools.terminal.item.getSelection()})
                        ]);
                    }
                },
                id: null,
                info: null,
                init: function dashboard_terminalItem():void {
                    const len:number = payload.terminal.length;
                    let option:HTMLElement = null,
                        index:number = 0;
                    tools.terminal.nodes.select.textContent = "";
                    if (len > 0) {
                        do {
                            option = document.createElement("option");
                            option.textContent = payload.terminal[index];
                            if (payload.terminal[index] === state.terminal) {
                                option.setAttribute("selected", "selected");
                            }
                            tools.terminal.nodes.select.appendChild(option);
                            index = index + 1;
                        } while (index < len);
                        tools.terminal.nodes.select.onchange = tools.terminal.events.change;
                        if (state.terminal === "") {
                            tools.terminal.nodes.select.selectedIndex = 0;
                            utility.setState();
                        }
                    }
                    window.onresize = tools.terminal.events.resize;
                    if (typeof Terminal === "undefined") {
                        setTimeout(dashboard_terminalItem, 200);
                    } else {
                        tools.terminal.shell();
                    }
                },
                item: null,
                nodes: {
                    output: document.getElementById("terminal").getElementsByClassName("terminal-output")[0] as HTMLElement,
                    select: document.getElementById("terminal").getElementsByTagName("select")[0] as HTMLSelectElement
                },
                rows: 60,
                shell: function dashboard_terminalShell():void {
                    const encryption:type_encryption = (location.protocol === "http:")
                            ? "open"
                            : "secure",
                        scheme:"ws"|"wss" = (encryption === "open")
                            ? "ws"
                            : "wss";
                    tools.terminal.item = new Terminal({
                        cols: tools.terminal.cols,
                        cursorBlink: true,
                        cursorStyle: "underline",
                        disableStdin: false,
                        rows: tools.terminal.rows,
                        theme: {
                            background: "#222",
                            selectionBackground: "#444"
                        }
                    });
                    tools.terminal.item.open(tools.terminal.nodes.output);
                    tools.terminal.item.onKey(tools.terminal.events.input);
                    tools.terminal.item.write("Terminal emulator pending connection...\r\n");
                    if (section === "terminal") {
                        tools.terminal.events.resize();
                    }
                    // client-side terminal is ready, so alert the backend to initiate a pseudo-terminal
                    tools.terminal.socket = new WebSocket(`${scheme}://${location.host}/?shell=${encodeURIComponent(state.terminal)}&cols=${tools.terminal.cols}&rows=${tools.terminal.rows}`, ["dashboard-terminal"]);
                    tools.terminal.socket.onmessage = tools.terminal.events.firstData;
                    if (typeof navigator.clipboard === "undefined") {
                        const em:HTMLElement = document.getElementById("terminal").getElementsByClassName("tab-description")[0].getElementsByTagName("em")[0] as HTMLElement;
                        if (location.protocol === "http:") {
                            em.textContent = "Terminal clipboard functionality only available when page is requested with HTTPS.";
                            em.style.fontWeight = "bold";
                        } else if (em !== undefined) {
                            em.parentNode.removeChild(em);
                        }
                    } else {
                        tools.terminal.item.onSelectionChange(tools.terminal.events.selection);
                    }
                },
                socket: null
            },
            websocket: {
                connected: false,
                frameBeautify: function dashboard_websocketFrameBeautify(target:"receive"|"send", valueItem?:string):void {
                    const value:string = (valueItem === null || valueItem === undefined)
                        ? tools.websocket.nodes[`message_${target}_frame`].value
                        : valueItem;
                    tools.websocket.nodes[`message_${target}_frame`].value = value
                        .replace("{", "{\n    ")
                        .replace(/,/g, ",\n    ")
                        .replace("}", "\n}")
                        .replace(/:/g, ": ");
                },
                handshake: function dashboard_websocketHandshake():void {
                    const handshakeString:string[] = [],
                        key:string = window.btoa((Math.random().toString() + Math.random().toString()).slice(2, 18));
                    handshakeString.push("GET / HTTP/1.1");
                    handshakeString.push(`Host: ${location.host}`);
                    handshakeString.push("Upgrade: websocket");
                    handshakeString.push("Connection: Upgrade");
                    handshakeString.push(`Sec-WebSocket-Key: ${key}`);
                    handshakeString.push(`Origin: ${location.origin}`);
                    handshakeString.push("Sec-WebSocket-Protocol: websocket-test");
                    handshakeString.push("Sec-WebSocket-Version: 13");
                    tools.websocket.nodes.handshake.value = handshakeString.join("\n");
                },
                handshakeSend: function dashboard_websocketHandshakeSend():void {
                    const timeout:number = Number(tools.websocket.nodes.handshake_timeout.value),
                        payload:services_websocket_handshake = {
                            encryption: (tools.websocket.nodes.handshake_scheme.checked === true),
                            message: (tools.websocket.connected === true)
                                ? ["disconnect"]
                                : tools.websocket.nodes.handshake.value.replace(/^\s+/, "").replace(/\s+$/, "").replace(/\r\n/g, "\n").split("\n"),
                            timeout: (isNaN(timeout) === true)
                                ? 0
                                : timeout
                        };
                    tools.websocket.timeout = payload.timeout;
                    tools.websocket.nodes.status.value = "";
                    utility.message_send(payload, "dashboard-websocket-handshake");
                },
                init: function dashboard_websocketInit():void {
                    tools.websocket.handshake();
                    tools.websocket.nodes.button_handshake.onclick = tools.websocket.handshakeSend;
                    tools.websocket.nodes.button_send.onclick = tools.websocket.message_send;
                    tools.websocket.nodes.message_send_body.onkeyup = tools.websocket.keyup_message;
                    tools.websocket.nodes.message_send_frame.onblur = tools.websocket.keyup_frame;
                },
                keyup_frame: function dashboard_websocketKeuUpFrame(event:Event):void {
                    const encodeLength:TextEncoder = new TextEncoder(),
                        text:string = tools.websocket.nodes.message_send_body.value,
                        textLength:number = encodeLength.encode(text).length;
                    let frame:websocket_frame = null;
                    // eslint-disable-next-line no-restricted-syntax
                    try {
                        const frameTry:websocket_frame = tools.websocket.parse_frame();
                        frameTry.opcode = (isNaN(frameTry.opcode) === true)
                            ? 1
                            : Math.floor(frameTry.opcode);
                        frame = {
                            extended: 0,
                            fin: (frameTry.fin === false)
                                ? false
                                : true,
                            len: 0,
                            mask: (frameTry.mask === true)
                                ? true
                                : false,
                            maskKey: null,
                            opcode: (frameTry.opcode > -1 && frameTry.opcode < 16)
                                ? frameTry.opcode
                                : 1,
                            rsv1: (frameTry.rsv1 === true)
                                ? true
                                : false,
                            rsv2: (frameTry.rsv2 === true)
                                ? true
                                : false,
                            rsv3: (frameTry.rsv3 === true)
                                ? true
                                : false,
                            startByte: 0
                        };
                    } catch {
                        frame = {
                            extended: 0,
                            fin: true,
                            len: 0,
                            mask: false,
                            maskKey: null,
                            opcode: 1,
                            rsv1: false,
                            rsv2: false,
                            rsv3: false,
                            startByte: 0
                        };
                    }
                    if (textLength < 126) {
                        frame.extended = 0;
                        frame.len = textLength;
                        frame.startByte = 2;
                    } else if (textLength < 65536) {
                        frame.extended = textLength;
                        frame.len = 126;
                        frame.startByte = 4;
                    } else {
                        frame.extended = textLength;
                        frame.len = 127;
                        frame.startByte = 10;
                    }
                    if (frame.mask === true) {
                        frame.startByte = frame.startByte + 4;
                    }
                    if ((event === null || event.target === tools.websocket.nodes.message_send_frame) && frame.mask === true) {
                        const encodeKey:TextEncoder = new TextEncoder;
                        frame.maskKey = encodeKey.encode(window.btoa(Math.random().toString() + Math.random().toString() + Math.random().toString()).replace(/0\./g, "").slice(0, 32)) as Buffer;
                    }
                    tools.websocket.frameBeautify("send", JSON.stringify(frame));
                },
                keyup_message: function dashboard_websocketKeyUpMessage(event:KeyboardEvent):void {
                    tools.websocket.keyup_frame(event);
                },
                message_receive: function dashboard_websocketMessageReceive(data_item:socket_data):void {
                    if ((tools.websocket.nodes.halt_receive.checked === true && tools.websocket.nodes.message_receive_frame.value !== "") || tools.websocket.nodes.halt_receive.checked === false) {
                        const data:services_websocket_message = data_item.data as services_websocket_message;
                        tools.websocket.nodes.message_receive_body.value = data.message;
                        tools.websocket.frameBeautify("receive", JSON.stringify(data.frame));
                    }
                },
                message_send: function dashboard_websocketMessageSend():void {
                    const payload:services_websocket_message = {
                        frame: tools.websocket.parse_frame(),
                        message: tools.websocket.nodes.message_send_body.value
                    };
                    utility.message_send(payload, "dashboard-websocket-message");
                    tools.websocket.keyup_frame(null);
                },
                nodes: {
                    button_handshake: document.getElementById("websocket").getElementsByClassName("form")[0].getElementsByTagName("button")[0] as HTMLButtonElement,
                    button_send: document.getElementById("websocket").getElementsByClassName("form")[2].getElementsByTagName("button")[0] as HTMLButtonElement,
                    halt_receive: document.getElementById("websocket").getElementsByClassName("form")[3].getElementsByTagName("input")[0] as HTMLInputElement,
                    handshake: document.getElementById("websocket").getElementsByClassName("form")[0].getElementsByTagName("textarea")[0] as HTMLTextAreaElement,
                    handshake_scheme: document.getElementById("websocket").getElementsByClassName("form")[0].getElementsByTagName("input")[1] as HTMLInputElement,
                    handshake_status: document.getElementById("websocket").getElementsByClassName("form")[0].getElementsByTagName("textarea")[1] as HTMLTextAreaElement,
                    handshake_timeout: document.getElementById("websocket").getElementsByClassName("form")[0].getElementsByTagName("input")[2] as HTMLInputElement,
                    message_receive_body: document.getElementById("websocket").getElementsByClassName("form")[3].getElementsByTagName("textarea")[1] as HTMLTextAreaElement,
                    message_receive_frame: document.getElementById("websocket").getElementsByClassName("form")[3].getElementsByTagName("textarea")[0] as HTMLTextAreaElement,
                    message_send_body: document.getElementById("websocket").getElementsByClassName("form")[2].getElementsByTagName("textarea")[1] as HTMLTextAreaElement,
                    message_send_frame: document.getElementById("websocket").getElementsByClassName("form")[2].getElementsByTagName("textarea")[0] as HTMLTextAreaElement,
                    status: document.getElementById("websocket-status") as HTMLTextAreaElement
                },
                parse_frame: function dashboard_websocketParseFrame():websocket_frame {
                    return JSON.parse(tools.websocket.nodes.message_send_frame.value
                        .replace(/",\s+/g, "\",")
                        .replace(/\{\s+/, "{")
                        .replace(/,\s+\}/, "}"));
                },
                status: function dashboard_websocketStatus(data_item:socket_data):void {
                    const data:services_websocket_status = data_item.data as services_websocket_status;
                    tools.websocket.nodes.button_handshake.onclick = tools.websocket.handshakeSend;
                    if (data.connected === true) {
                        tools.websocket.nodes.button_handshake.textContent = "Disconnect";
                        tools.websocket.nodes.status.setAttribute("class", "connection-online");
                        tools.websocket.connected = true;
                        tools.websocket.nodes.message_receive_body.value = "";
                        tools.websocket.nodes.message_receive_frame.value = "";
                        tools.websocket.nodes.button_send.disabled = false;
                    } else {
                        tools.websocket.nodes.button_handshake.textContent = "Connect";
                        tools.websocket.nodes.status.setAttribute("class", "connection-offline");
                        tools.websocket.connected = false;
                        tools.websocket.nodes.button_send.disabled = true;
                    }
                    if (data.error === null) {
                        if (data.connected === true) {
                            tools.websocket.nodes.handshake_status.value = "Connected.";
                        } else {
                            tools.websocket.nodes.handshake_status.value = "Disconnected.";
                        }
                    } else if (typeof data.error === "string") {
                        tools.websocket.nodes.handshake_status.value = data.error;
                    } else {
                        let error:string = JSON.stringify(data.error);
                        if (data.error.code === "ETIMEDOUT") {
                            tools.websocket.nodes.handshake_status.value = `WebSocket handshake exceeded the specified timeout of ${tools.websocket.timeout} milliseconds.`;
                        } else {
                            if (typeof data.error !== "string" && data.error.code === "ECONNRESET") {
                                error = `The server dropped the connection. Ensure the encryption options matches whether the server's port accepts encrypted traffic.\n\n${error}`;
                            }
                            tools.websocket.nodes.handshake_status.value = error;
                        }
                    }
                },
                timeout: 0
            }
        };

    // start up logic for browser
    {
        window.onerror = function dashboard_windowError(message:string|Event, source:string, lineno:number, colno:number, error:Error):void {
            utility.log({
                action: "modify",
                configuration: null,
                message: `JavaScript UI error in browser on line ${lineno} and column ${colno} in ${source}.\n\nError message:\n${message.toString()}\n\nError object:\n${JSON.stringify(error)}`,
                status: "error",
                time: 0,
                type: "log"
            });
        };
        const navButtons:HTMLCollectionOf<HTMLElement> = document.getElementsByTagName("nav")[0].getElementsByTagName("button"),
            navigation = function dashboard_navigation(event:MouseEvent):void {
                const target:HTMLElement = event.target;
                let index:number = sections.length;
                section = target.getAttribute("data-section") as type_dashboard_sections;
                do {
                    index = index - 1;
                    document.getElementById(sections[index]).style.display = "none";
                } while (index > 0);
                index = navButtons.length;
                do {
                    index = index - 1;
                    navButtons[index].removeAttribute("class");
                } while (index > 0);
                document.getElementById(section).style.display = "block";
                if (section === "terminal") {
                    tools.terminal.events.resize();
                }
                state.nav = target.dataset.section;
                utility.setState();
                target.setAttribute("class", "nav-focus");
            },
            // dynamically discover navigation and assign navigation event handler
            sections:string[] = (function dashboard_sections():string[] {
                const output:string[] = [];
                let index:number = navButtons.length;
                do {
                    index = index - 1;
                    output.push(navButtons[index].getAttribute("data-section"));
                    navButtons[index].onclick = navigation;
                } while (index > 0);
                return output;
            }()),
            definitions = function dashboard_commonDefinitions(event:MouseEvent):void {
                const target:HTMLElement = event.target,
                    parent:HTMLElement = target.getAncestor("div", "tag") as HTMLElement,
                    child:HTMLElement = parent.getElementsByClassName("definition-body")[0] as HTMLElement;
                if (target.textContent === "Expand") {
                    child.style.display = "block";
                    target.textContent = "Hide";
                } else {
                    child.style.display = "none";
                    target.textContent = "Expand";
                }
            },
            th:HTMLCollectionOf<HTMLElement> = document.getElementsByTagName("th"),
            expand:HTMLCollectionOf<HTMLButtonElement> = document.getElementsByClassName("expand") as HTMLCollectionOf<HTMLButtonElement>,
            table_keys:string[] = (state.tables === undefined)
                ? []
                : Object.keys(state.tables);
        let index:number = 0,
            button:HTMLElement = null,
            table_key:string[] = null,
            table:HTMLElement = null;

        // restore state of table filter controls
        if (state.table_os === undefined) {
            state.table_os = {
                processes: {
                    filter_column: 0,
                    filter_sensitive: true,
                    filter_value: ""
                },
                services: {
                    filter_column: 0,
                    filter_sensitive: true,
                    filter_value: ""
                },
                sockets: {
                    filter_column: 0,
                    filter_sensitive: true,
                    filter_value: ""
                },
                users: {
                    filter_column: 0,
                    filter_sensitive: true,
                    filter_value: ""
                }
            };
        }

        // restore table sorting direction and column
        index = table_keys.length;
        if (index > 0) {
            do {
                index = index - 1;
                table_key = table_keys[index].split("-");
                table = document.getElementById(table_key[0]).getElementsByTagName("table")[Number(table_key[1])];
                if (table !== undefined) {
                    table.setAttribute("data-column", String(state.tables[table_keys[index]].col));
                    table.getElementsByTagName("thead")[0].getElementsByTagName("th")[state.tables[table_keys[index]].col].getElementsByTagName("button")[0].setAttribute("data-dir", String(state.tables[table_keys[index]].dir));
                }
            } while (index > 0);
        }

        // table header sort buttons
        index = th.length;
        do {
            index = index - 1;
            button = th[index].getElementsByTagName("button")[0];
            if (button !== undefined) {
                button.onclick = utility.sort_tables;
            }
        } while (index > 0);

        // expand buttons
        index = expand.length;
        if (index > 0) {
            do {
                index = index - 1;
                if (expand[index].lowName() === "button" && (expand[index].parentNode.lowName() === "h3" || expand[index].parentNode.lowName() === "h4")) {
                    expand[index].onclick = definitions;
                }
            } while (index > 0);
        }

        // set active tab from state
        if (state.nav !== "servers") {
            index = navButtons.length;
            do {
                index = index - 1;
                if (navButtons[index].dataset.section === state.nav) {
                    navButtons[index].setAttribute("class", "nav-focus");
                } else {
                    navButtons[index].removeAttribute("class");
                }
            } while (index > 0);
            document.getElementById("servers").style.display = "none";
            document.getElementById(state.nav).style.display = "block";
        }

        // invoke web socket connection to application
        utility.socket.invoke();
    }
};

export default dashboard;