
import core from "../browser/core.ts";
import Chart from "chart.js/auto";
// @ts-expect-error - TypeScript claims xterm has no default export, but this is how the documentation says to use it.
import Terminal from "@xterm/xterm";

// cspell: words bootable, containerd, PUID, PGID, serv, winget
const dashboard = function dashboard():void {
    let loaded:boolean = false,
        section:type_dashboard_sections = "servers_web";
    const payload:transmit_dashboard = null,
        local:string = localStorage.state,
        state:state_store = (local === undefined || local === null || local === "")
            ? {
                dns: {
                    hosts: "",
                    types: ""
                },
                fileSystem: {
                    path: "",
                    search: ""
                },
                graph_type: 0,
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
                nav: "servers_web",
                table_os: {},
                tables: {},
                terminal: ""
            }
            : JSON.parse(local),
        tables:module_tables = {
            cell: function dashboard_tablesCell(tr:HTMLElement, text:string, raw:string):void {
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
            // filter large data tables
            filter: function dashboard_tablesFilter(event:Event, target?:HTMLInputElement):void {
                if (event !== null) {
                    const key:KeyboardEvent = event as KeyboardEvent;
                    if (event.type === "keyup" && key.key !== "Enter") {
                        return;
                    }
                    target = event.target as HTMLInputElement;
                    utility.setState();
                }
                const section:HTMLElement = target.getAncestor("table-filters", "class"),
                    tab:HTMLElement = section.getAncestor("tab", "class"),
                    tab_name:type_dashboard_tables = tab.getAttribute("id") as type_dashboard_tables,
                    module_map:store_module_map = {
                        "devices": system.devices,
                        "ports-application": network.ports_application,
                        "processes": system.processes,
                        "services": system.services,
                        "sockets-application": network.sockets_application,
                        "sockets-os": network.sockets_os,
                        "users": system.users
                    },
                    module:module_list|module_ports_application|module_sockets_application = module_map[tab_name],
                    select:HTMLSelectElement = module.nodes.filter_column,
                    columnIndex:number = select.selectedIndex - 1,
                    list:HTMLCollectionOf<HTMLElement> = module.nodes.list.getElementsByTagName("tr"),
                    cell_length:number = module.nodes.list.parentNode.getElementsByTagName("thead")[0].getElementsByTagName("th").length,
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
                    index = 0;
                    count = 0;
                    do {
                        if (list[index].style.display === "table-row") {
                            if (count % 2 === 0) {
                                list[index].setAttribute("class", "even");
                            } else {
                                list[index].setAttribute("class", "odd");
                            }
                            count = count + 1;
                        }
                        index = index + 1;
                    } while (index < list.length);
                }
            },
            // attaches event listeners to data tables and restores state
            init: function dashboard_tablesInit(module:module_list|module_ports_application|module_sockets_application):void {
                const select = function dashboard_tablesSelect(table:HTMLElement, select:HTMLSelectElement):void {
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
                };
                if (state.table_os[module.dataName] === undefined || state.table_os[module.dataName] === null) {
                    state.table_os[module.dataName] = {
                        filter_column: module.nodes.filter_column.selectedIndex,
                        filter_sensitive: module.nodes.caseSensitive.checked,
                        filter_value: module.nodes.filter_value.value
                    };
                } else {
                    module.nodes.filter_column.selectedIndex = state.table_os[module.dataName].filter_column;
                    module.nodes.caseSensitive.checked = state.table_os[module.dataName].filter_sensitive;
                    module.nodes.filter_value.value = state.table_os[module.dataName].filter_value;
                }
                module.nodes.filter_column.onchange = tables.filter;
                module.nodes.caseSensitive.onclick = utility.setState;
                module.nodes.filter_value.onblur = tables.filter;
                module.nodes.filter_value.onkeyup = tables.filter;
                select(module.nodes.list.parentNode, module.nodes.filter_column);
                if (module.dataName === "ports_application") {
                    tables.filter(null, module.nodes.filter_value);
                } else if (module.dataName === "sockets_application") {
                    tables.filter(null, module.nodes.filter_value);
                    module.nodes.update_button.onclick = network.sockets_application.update;
                } else {
                    module.nodes.update_button.onclick = tables.update;
                    module.nodes.update_button.setAttribute("data-list", module.dataName);
                    // @ts-expect-error - inferring types from an object fails
                    tables.populate(module, payload.os[module.dataName as type_list_services]);
                }
            },
            // populate large data tables
            populate: function dashboard_tablesPopulate(module:module_list, item:type_list_services):void {
                const len:number = item.data.length,
                    list:HTMLElement = module.nodes.list,
                    table:HTMLElement = (list === null)
                        ? null
                        : list.parentNode;
                if (len > 0 && table !== null) {
                    const sort_index:number = Number(table.dataset.column),
                        sort_name:string = module.sort_name[sort_index],
                        sort_direction:-1|1 = Number(table.getElementsByTagName("th")[sort_index].getElementsByTagName("button")[0].dataset.dir) as -1|1;
                    let index:number = 0,
                        row:HTMLElement = null;
                    list.textContent = "";
                    item.data.sort(function dashboard_tablesPopulate_sort(a:type_lists,b:type_lists):-1|1 {
                        // @ts-expect-error - inferring types based upon property names across unrelated objects of dissimilar property name is problematic
                        if (a[sort_name as "name"|"type"] as string < b[sort_name as "name"|"type"] as string) {
                            return sort_direction;
                        }
                        return (sort_direction * -1) as 1;
                    });
                    do {
                        row = document.createElement("tr");
                        module.row(item.data[index], row);
                        row.setAttribute("class", (index % 2 === 0) ? "even" : "odd");
                        list.appendChild(row);
                        index = index + 1;
                    } while (index < len);
                    module.nodes.update_text.textContent = item.time.dateTime(true, payload.timeZone_offset);
                    module.nodes.count.textContent = String(item.data.length);
                    module.nodes.list = table.getElementsByTagName("tbody")[0];
                    tables.filter(null, module.nodes.filter_value);
                    // @ts-expect-error - cannot infer a module from a union of modules by a type name from a union of type names
                    payload.os[module.dataName] = item;
                }
            },
            // sort data from html tables
            sort: function dashboard_tablesSort(event:MouseEvent, table?:HTMLElement, heading_index?:number):void {
                const target:HTMLElement = (event === null)
                        ? null
                        : event.target,
                    tableElement:HTMLElement = (event === null)
                        ? table
                        : target.getAncestor("table", "tag"),
                    tbody:HTMLElement = tableElement.getElementsByTagName("tbody")[0],
                    tr_list:HTMLCollectionOf<HTMLElement> = tbody.getElementsByTagName("tr"),
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
                        if (state.tables === undefined || state.tables === null) {
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

                    records.sort(function dashboard_tablesSort_records(a:HTMLElement, b:HTMLElement):-1|0|1 {
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
                    tbody.textContent = "";
                    do {
                        records[index_tr].setAttribute("class", (index_tr % 2 === 0) ? "even" : "odd");
                        tbody.appendChild(records[index_tr]);
                        index_tr = index_tr + 1;
                    } while (index_tr < tr_length);
                }
            },
            // request updated table data
            update: function dashboard_tablesUpdate(event:MouseEvent):void {
                const target:string = event.target.dataset.list;
                utility.message_send(null, `dashboard-os-${target}` as type_service);
            }
        },
        utility:module_utility = {
            // reset the UI to a near empty baseline
            baseline: function dashboard_utilityBaseline():void {
                if (loaded === true) {
                    const serverList:HTMLElement = document.getElementById("servers_web").getElementsByClassName("server-list")[0] as HTMLElement,
                        logs_old:HTMLElement = document.getElementById("application-logs").getElementsByTagName("ul")[0],
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
                        lists = function dashboard_utilityBaseline_lists(section:module_disks|module_interfaces|module_list, filter:boolean):void {
                            section.nodes.count.textContent = "";
                            section.nodes.list.textContent = "";
                            section.nodes.update_text.textContent = "";
                            if (filter === true) {
                                const sectionList:module_list = section as module_list;
                                sectionList.nodes.caseSensitive.checked = true;
                                sectionList.nodes.filter_column.textContent = "";
                                sectionList.nodes.filter_count.textContent = "";
                                sectionList.nodes.filter_value.value = "";
                            }
                        },
                        fileSummary:HTMLCollectionOf<HTMLElement> = tools.fileSystem.nodes.summary.getElementsByTagName("li"),
                        server_new:HTMLButtonElement = document.getElementById("servers_web").getElementsByClassName("server-new")[0] as HTMLButtonElement;

                    loaded = false;
                    replace(logs_old, false);
                    lists(network.interfaces, false);
                    lists(network.sockets_application, true);
                    lists(network.sockets_os, true);
                    lists(system.devices, true);
                    lists(system.disks, false);
                    lists(system.processes, true);
                    lists(system.services, true);
                    lists(system.users, true);
                    fileSummary[0].getElementsByTagName("strong")[0].textContent = "";
                    fileSummary[1].getElementsByTagName("strong")[0].textContent = "";
                    fileSummary[2].getElementsByTagName("strong")[0].textContent = "";
                    fileSummary[3].getElementsByTagName("strong")[0].textContent = "";
                    fileSummary[4].getElementsByTagName("strong")[0].textContent = "";
                    fileSummary[5].getElementsByTagName("strong")[0].textContent = "";
                    fileSummary[6].getElementsByTagName("strong")[0].textContent = "";
                    fileSummary[7].getElementsByTagName("strong")[0].textContent = "";
                    fileSummary[8].getElementsByTagName("strong")[0].textContent = "";
                    server_new.disabled = false;
                    services.compose_containers.nodes.body.style.display = "block";
                    services.compose_containers.nodes.list.textContent = "";
                    services.compose_containers.nodes.list_variables.textContent = "";
                    services.compose_containers.nodes.status.style.display = "none";
                    services.compose_containers.nodes.status.textContent = "";
                    services.compose_containers.nodes.update_containers.textContent = "";
                    services.compose_containers.nodes.update_time.textContent = "";
                    services.compose_containers.nodes.update_variables.textContent = "";
                    services.servers_web.nodes.list = replace(serverList, true);
                    status.setAttribute("class", "connection-offline");
                    status.getElementsByTagName("strong")[0].textContent = "Offline";
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
                    system.os.nodes.update_text.textContent = "";
                    system.os.nodes.user.gid.textContent = "";
                    system.os.nodes.user.uid.textContent = "";
                    system.os.nodes.user.homedir.textContent = "";
                    tools.fileSystem.block = false;
                    tools.fileSystem.nodes.failures.textContent = "";
                    tools.fileSystem.nodes.output.getElementsByTagName("tbody")[0].textContent = "";
                    tools.fileSystem.nodes.output.style.display = "none";
                    tools.fileSystem.nodes.status.textContent = "";
                    tools.fileSystem.time = 0n;
                    tools.terminal.nodes.output = replace(terminal_output, true);
                    tools.terminal.nodes.output.removeAttribute("data-info");
                    tools.terminal.nodes.output.removeAttribute("data-size");
                    if (tools.terminal.socket !== null) {
                        tools.terminal.socket.close();
                        tools.terminal.socket = null;
                    }
                    tools.websocket.nodes.handshake_status.value = "Disconnected.";
                    tools.websocket.nodes.button_handshake.textContent = "Connect";
                    tools.websocket.nodes.status.setAttribute("class", "connection-offline");
                    tools.websocket.nodes.message_receive_body.value = "";
                    tools.websocket.nodes.message_receive_frame.value = "";
                    utility.nodes.clock.textContent = "00:00:00L (00:00:00Z)";
                    utility.nodes.load.textContent = "0.00000 seconds";
                    utility.nodes.main.style.display = "none";
                    utility.socket.socket = null;
                }
            },
            // provides server status information
            clock: function dashboard_utilityClock(data_item:socket_data):void {
                const data:services_status_clock = data_item.data as services_status_clock,
                    str = function dashboard_utilityStatus_str(num:number):string {
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
                utility.nodes.clock.setAttribute("data-local", String(data.time_local));
                utility.nodes.clock.textContent = `${str(data.time_local)}L (${str(data.time_zulu)}Z)`;
            },
            // populate the log utility
            log: function dashboard_utilityLog(socket_data:socket_data):void {
                const item:config_log = socket_data.data as config_log,
                    li:HTMLElement = document.createElement("li"),
                    timeElement:HTMLElement = document.createElement("time"),
                    ul:HTMLElement = document.getElementById("application-logs").getElementsByTagName("ul")[0],
                    strong:HTMLElement = document.createElement("strong"),
                    code:HTMLElement = document.createElement("code"),
                    time:string = `[${item.time.dateTime(true, null)}]`,
                    p:HTMLElement = document.createElement("p");
                timeElement.appendText(time);
                strong.textContent = (item.section === "startup")
                    ? "Start Up"
                    : (item.section === "dashboard")
                        ? "Dashboard"
                        : document.getElementById(item.section).getElementsByTagName("h2")[0].textContent;
                p.textContent = item.message;
                li.appendChild(timeElement);
                li.appendChild(strong);
                if (item.status === "error" && item.error !== null) {
                    const str:string = JSON.stringify(item.error);
                    if (str === "{}") {
                        if (item.error.stack !== undefined) {
                            code.textContent = item.error.stack;
                            p.appendChild(code);
                            p.style.display = "block";
                        }
                    } else if (str !== "" && str !== null) {
                        code.textContent = str;
                        p.appendChild(code);
                        p.style.display = "block";
                    }
                }
                li.appendChild(p);
                if (ul.childNodes.length > 100) {
                    ul.removeChild(ul.lastChild);
                }
                ul.insertBefore(li, ul.firstChild);
            },
            // send dashboard service messages
            message_send: function dashboard_utilityMessageSend(data:type_socket_data, service:type_service):void {
                const message:socket_data = {
                        data: data,
                        service: service
                    };
                utility.socket.queue(JSON.stringify(message));
            },
            nodes: {
                clock: document.getElementById("clock").getElementsByTagName("time")[0],
                load: document.getElementsByClassName("title")[0].getElementsByTagName("time")[0],
                main: document.getElementsByTagName("main")[0]
            },
            // a universal bucket to store all resize event handlers
            resize: function dashboard_utilityResize():void {
                if (tools.terminal.socket !== null) {
                    tools.terminal.events.resize();
                }
            },
            // gathers state artifacts and saves state data
            setState: function dashboard_utilitySetState():void {
                if (utility.socket.connected === true) {
                    const hashInput:HTMLCollectionOf<HTMLInputElement> = document.getElementById("hash").getElementsByClassName("form")[0].getElementsByTagName("input"),
                        lists = function dashboard_utilitySetState_lists(module:module_list):void {
                            const type:string = module.dataName;
                            if (state.table_os[type] === null || state.table_os[type] === undefined) {
                                state.table_os[type] = {
                                    filter_column: module.nodes.filter_column.selectedIndex,
                                    filter_sensitive: module.nodes.caseSensitive.checked,
                                    filter_value: module.nodes.filter_value.value
                                };
                            } else {
                                state.table_os[type].filter_column = module.nodes.filter_column.selectedIndex;
                                state.table_os[type].filter_sensitive = module.nodes.caseSensitive.checked;
                                state.table_os[type].filter_value = module.nodes.filter_value.value;
                            }
                        };
                    if (state.dns === undefined || state.dns === null) {
                        state.dns = {
                            reverse: tools.dns.nodes.reverse.checked,
                            hosts: tools.dns.nodes.hosts.value,
                            types: tools.dns.nodes.types.value
                        };
                    } else {
                        state.dns.reverse = tools.dns.nodes.reverse.checked;
                        state.dns.hosts = tools.dns.nodes.hosts.value;
                        state.dns.types = tools.dns.nodes.types.value;
                    }
                    if (state.fileSystem === undefined || state.fileSystem === null) {
                        state.fileSystem = {
                            path: tools.fileSystem.nodes.path.value,
                            search: tools.fileSystem.nodes.search.value
                        };
                    } else {
                        state.fileSystem.path = tools.fileSystem.nodes.path.value;
                        state.fileSystem.search = tools.fileSystem.nodes.search.value;
                    }
                    state.graph_type = services.statistics.nodes.graph_type.selectedIndex;
                    if (state.hash === undefined || state.hash === null) {
                        state.hash = {
                            algorithm: (tools.hash.nodes.algorithm[tools.hash.nodes.algorithm.selectedIndex] === undefined)
                                ? ""
                                : tools.hash.nodes.algorithm[tools.hash.nodes.algorithm.selectedIndex].textContent,
                            hashFunction: (hashInput[1].checked === true)
                                ? "base64"
                                : "hash",
                            type: (hashInput[3].checked === true)
                                ? "file"
                                : "string",
                            digest: (hashInput[5].checked === true)
                                ? "base64"
                                : "hex",
                            source: tools.hash.nodes.source.value
                        };
                    } else {
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
                    }
                    if (state.http === undefined || state.http === null) {
                        state.http = {
                            encryption: (tools.http.nodes.encryption.checked === true),
                            request: tools.http.nodes.request.value
                        };
                    } else {
                        state.http.encryption = (tools.http.nodes.encryption.checked === true);
                        state.http.request = tools.http.nodes.request.value;
                    }
                    if (tools.terminal.nodes.select[tools.terminal.nodes.select.selectedIndex] !== undefined) {
                        state.terminal = tools.terminal.nodes.select[tools.terminal.nodes.select.selectedIndex].textContent;
                    }
                    lists(system.devices);
                    lists(system.processes);
                    lists(system.services);
                    lists(network.sockets_application);
                    lists(network.sockets_os);
                    lists(system.users);
                    localStorage.state = JSON.stringify(state);
                }
            },
            socket: core({
                close: function dashboard_socketClose():void {
                    const status:HTMLElement = document.getElementById("connection-status");
                    if (status !== null && status.getAttribute("class") === "connection-online") {
                        utility.log({
                            data: {
                                error: null,
                                message: "Dashboard browser connection offline.",
                                section: "dashboard",
                                status: "informational",
                                time: Date.now()
                            },
                            service: "dashboard-log"
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
                                // "test-browser": testBrowser,
                                "dashboard-compose": services.compose_containers.list,
                                "dashboard-dns": tools.dns.receive,
                                "dashboard-fileSystem": tools.fileSystem.receive,
                                "dashboard-hash": tools.hash.receive,
                                "dashboard-http": tools.http.receive,
                                "dashboard-log": utility.log,
                                "dashboard-server": services.servers_web.list,
                                "dashboard-socket-application": network.sockets_application.list,
                                "dashboard-status-clock": utility.clock,
                                "dashboard-statistics-data": services.statistics.receive,
                                "dashboard-websocket-message": tools.websocket.message_receive,
                                "dashboard-websocket-status": tools.websocket.status
                            };
                        if (message_item.service.indexOf("dashboard-os-") === 0) {
                            system.os.service(message_item);
                        } else {
                            service_map[message_item.service](message_item);
                        }
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
                        let index:number = payload.logs.length;
                        if (index > 0) {
                            do {
                                index = index - 1;
                                utility.log({
                                    data: payload.logs[index],
                                    service: "dashboard-log"
                                });
                            } while (index > 0);
                        }
                        loaded = true;
                        utility.log({
                            data: {
                                error: null,
                                message: "Dashboard browser connection online.",
                                section: "dashboard",
                                status: "informational",
                                time: Date.now()
                            },
                            service: "dashboard-log"
                        });
                        network.interfaces.init();
                        services.init();
                        system.os.init();
                        system.disks.init();
                        tables.init(network.ports_application);
                        tables.init(network.sockets_application);
                        tables.init(network.sockets_os);
                        tables.init(system.devices);
                        tables.init(system.processes);
                        tables.init(system.services);
                        tables.init(system.users);
                        tools.terminal.init();
                        tools.fileSystem.init();
                        tools.http.init();
                        tools.websocket.init();
                        tools.dns.init();
                        tools.hash.init();
                        utility.nodes.main.style.display = "block";
                        utility.nodes.load.textContent = `${Math.round(performance.getEntries()[0].duration * 10000) / 1e7} seconds`;
                    }
                },
                type: "dashboard"
            })
        },
        services:structure_services = {
            compose_containers: {
                descriptions: function dashboard_composeContainersDescriptions(id:string):HTMLElement {
                    const div:HTMLElement = document.createElement("div"),
                        p:HTMLElement = document.createElement("p"),
                        portHeading:HTMLElement = document.createElement("strong"),
                        portList:HTMLElement = document.createElement("ul"),
                        container:core_compose_container = payload.compose.containers[id],
                        ports:type_docker_ports = container.ports,
                        len:number = ports.length,
                        ul:HTMLElement = document.createElement("ul"),
                        properties = function dashboard_compose_containerDescription_properties(name:string, value:string):void {
                            const li:HTMLElement = document.createElement("li"),
                                strong:HTMLElement = document.createElement("strong"),
                                span:HTMLElement = document.createElement("span");
                            strong.textContent = name;
                            span.textContent = value;
                            li.appendChild(strong);
                            li.appendChild(span);
                            ul.appendChild(li);
                        };
                    let portItem:HTMLElement = null,
                        index:number = 0;
                    if (len > 0) {
                        portHeading.textContent = "Active Ports";
                        p.appendChild(portHeading);
                        div.appendChild(p);
                        do {
                            portItem = document.createElement("li");
                            portItem.appendText(`${ports[index][0]} (${ports[index][1].toUpperCase()})`);
                            portList.appendChild(portItem);
                            index = index + 1;
                        } while (index < len);
                        portList.setAttribute("class", "container-ports");
                        div.appendChild(portList);
                    }
                    div.setAttribute("class", "active-ports");
                    ul.setAttribute("class", "container-properties");
                    properties("Created On", container.created.dateTime(true, payload.timeZone_offset));
                    properties("Config Location", container.location);
                    properties("Description", container.description);
                    properties("ID", container.id);
                    properties("Image", container.image);
                    properties("License", container.license);
                    properties("State", container.state);
                    properties("Status", container.status);
                    properties("Version", container.version);
                    div.appendChild(ul);
                    return div;
                },
                events: {
                    cancel_variable: function dashboard_composeVariablesCancel(event:MouseEvent):void {
                        const target:HTMLElement = event.target.getAncestor("div", "tag"),
                            section:HTMLElement = target.getAncestor("section", "class"),
                            edit:HTMLElement = section.getElementsByClassName("edit")[0] as HTMLElement;
                        edit.parentNode.removeChild(edit);
                        services.compose_containers.nodes.list_variables.style.display = "block";
                        services.compose_containers.nodes.new_variable.disabled = false;
                    },
                    edit_variable: function dashboard_composeVariablesEdit():void {
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
                        ul.setAttribute("class", "edit-summary");
                        cancel.appendText("⚠ Cancel");
                        cancel.setAttribute("class", "server-cancel");
                        cancel.onclick = services.compose_containers.events.cancel_variable;
                        buttons.appendChild(cancel);
                        save.appendText("🖪 Modify");
                        save.setAttribute("class", "server-modify");
                        save.onclick = services.compose_containers.events.message_variable;
                        buttons.appendChild(save);
                        textArea.setAttribute("class", "compose-variables-edit");
                        services.compose_containers.nodes.list_variables.style.display = "none";
                        label.appendText("Docker Compose Variables");
                        label.appendChild(textArea);
                        p.setAttribute("class", "compose-edit");
                        p.appendChild(label);
                        buttons.setAttribute("class", "buttons");
                        edit.appendChild(p);
                        edit.appendChild(ul);
                        edit.appendChild(buttons);
                        services.compose_containers.nodes.list_variables.parentNode.appendChild(edit);
                        services.compose_containers.nodes.new_variable.disabled = true;
                        textArea.onkeyup = services.compose_containers.events.validate_variables;
                        textArea.onfocus = services.compose_containers.events.validate_variables;
                        textArea.focus();
                    },
                    message_container: function dashboard_composeContainersMessage(event:MouseEvent):void {
                        const target:HTMLElement = event.target,
                            action:type_dashboard_action = target.getAttribute("class").replace("server-", "") as type_dashboard_action,
                            edit:HTMLElement = target.getAncestor("edit", "class"),
                            cancel:HTMLButtonElement = edit.getElementsByClassName("server-cancel")[0] as HTMLButtonElement,
                            textArea:HTMLTextAreaElement = edit.getElementsByTagName("textarea")[0],
                            id:string = (action === "add")
                                ? ""
                                : edit.getAncestor("li", "tag").dataset.id,
                            message:services_compose_container = {
                                action: action,
                                compose: textArea.value.trim(),
                                id: id,
                                location: (action === "add")
                                    ? ""
                                    : payload.compose.containers[id].location
                            };
                        utility.message_send(message, "dashboard-compose-container");
                        services.compose_containers.nodes.new_container.disabled = false;
                        if (cancel === undefined) {
                            edit.parentNode.getElementsByTagName("button")[0].click();
                        } else {
                            services.shared.cancel(event);
                        }
                    },
                    message_variable: function dashboard_composeVariablesMessage(event:MouseEvent):void {
                        const target:HTMLElement = event.target,
                            edit:HTMLElement = target.getAncestor("edit", "class"),
                            cancel:HTMLButtonElement = edit.getElementsByClassName("server-cancel")[0] as HTMLButtonElement,
                            value:string = edit.getElementsByTagName("textarea")[0].value,
                            variables:store_string = JSON.parse(value);
                        utility.message_send(variables, "dashboard-compose-variables");
                        services.compose_containers.nodes.new_variable.disabled = false;
                        if (cancel === undefined) {
                            edit.parentNode.getElementsByTagName("button")[0].click();
                        } else {
                            services.shared.cancel(event);
                        }
                    },
                    update: function dashboard_composeVariablesUpdate():void {
                        const message:services_compose_container = {
                            action: "update",
                            compose: "",
                            id: "",
                            location: ""
                        };
                        utility.message_send(message, "dashboard-compose-container");
                    },
                    validate_containers: function dashboard_composeContainersValidate(event:FocusEvent|KeyboardEvent):void {
                        const target:HTMLElement = event.target,
                            id:string = target.getAncestor("li", "tag").dataset.id,
                            section:HTMLElement = target.getAncestor("edit", "class"),
                            newItem:boolean = (section.parentNode.getAttribute("class") === "section"),
                            textArea:HTMLTextAreaElement = section.getElementsByTagName("textarea")[0],
                            summary:HTMLElement = section.getElementsByClassName("summary")[0] as HTMLElement,
                            ul:HTMLElement = summary.getElementsByTagName("ul")[0] as HTMLElement,
                            modify:HTMLButtonElement = (newItem === true)
                                ? section.getElementsByClassName("server-add")[0] as HTMLButtonElement
                                : section.getElementsByClassName("server-modify")[0] as HTMLButtonElement,
                            reg:RegExp = (/^\s*$/),
                            value:string = textArea.value;
                        let valid:boolean = true,
                            li:HTMLElement = document.createElement("li"),
                            name:string = value.split("container_name")[1];
                        name = (name === undefined)
                            ? ""
                            : name.split("\n")[0].replace(/\s*:/, "").trim();
                        summary.style.display = "block";
                        ul.textContent = "";
                        if (reg.test(value) === true) {
                            valid = false;
                            li.appendText("Compose file contents must have a value in YAML format.");
                            li.setAttribute("class", "pass-false");
                        } else {
                            li.appendText("Compose file contents field contains a value.");
                            li.setAttribute("class", "pass-true");
                        }
                        if (name === undefined || name === "") {
                            valid = false;
                            li.appendText("Compose file must contain a 'container_name' property.");
                            li.setAttribute("class", "pass-false");
                        } else {
                            li.appendText("Compose file contains a 'container_name' property.");
                            li.setAttribute("class", "pass-true");
                        }
                        ul.appendChild(li);
                        if (valid === true && id !== undefined && payload.compose.containers[id].compose === value) {
                            valid = false;
                            li = document.createElement("li");
                            li.appendText("Values are populated, but aren't modified.");
                            li.setAttribute("class", "pass-false");
                            ul.appendChild(li);
                        }
                        if (valid === true) {
                            modify.disabled = false;
                        } else {
                            modify.disabled = true;
                        }
                    },
                    validate_variables: function dashboard_composeVariablesValidate(event:FocusEvent|KeyboardEvent):void {
                        const target:HTMLTextAreaElement = event.target as HTMLTextAreaElement,
                            value:string = target.value,
                            section:HTMLElement = target.getAncestor("section", "class"),
                            edit:HTMLElement = section.getElementsByClassName("edit")[0] as HTMLElement,
                            modify:HTMLButtonElement = section.getElementsByClassName("server-modify")[0] as HTMLButtonElement,
                            ul:HTMLElement = edit.getElementsByTagName("ul")[0],
                            text = function dashboard_composeValidateVariables_fail(message:string, pass:boolean):void {
                                const li:HTMLElement = document.createElement("li");
                                if (pass === true) {
                                    modify.disabled = false;
                                } else {
                                    modify.disabled = true;
                                }
                                li.setAttribute("class", `pass-${pass}`);
                                li.appendText(message);
                                ul.appendChild(li);
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
                        ul.textContent = "";
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
                list: function dashboard_composeContainersList(socket_data:socket_data):void {
                    const data:core_compose = socket_data.data as core_compose,
                        list:string[] = (data.containers === null)
                            ? []
                            : Object.keys(data.containers).sort(function dashboard_compose_containersList(a:string, b:string):-1|1 {
                                const nameA:string = (a.includes(".y") === true)
                                        ? a.split(payload.path.sep).pop()
                                        : payload.compose.containers[a].name,
                                    nameB:string = (b.includes(".y") === true)
                                        ? b.split(payload.path.sep).pop()
                                        : payload.compose.containers[b].name;
                                if (nameA < nameB) {
                                    return -1;
                                }
                                return 1;
                            }),
                        variables:string[] = (data.variables === null)
                            ? []
                            : Object.keys(data.variables).sort(),
                        list_containers:HTMLElement = services.compose_containers.nodes.list,
                        list_variables:HTMLElement = services.compose_containers.nodes.list_variables,
                        len_containers:number = list.length,
                        len_variables:number = variables.length;
                    let li:HTMLElement = null,
                        index:number = 0;
                    if (data.containers !== null) {
                        list_containers.textContent = "";
                        payload.compose.containers = data.containers;
                        if (len_containers > 0) {
                            do {
                                li = services.shared.title(list[index], "container");
                                li.setAttribute("data-id", data.containers[list[index]].id);
                                list_containers.appendChild(li);
                                index = index + 1;
                            } while (index < len_containers);
                            list_containers.style.display = "block";
                        } else {
                            list_containers.style.display = "none";
                        }
                    }
                    if (data.variables !== null) {
                        index = 0;
                        list_variables.textContent = "";
                        payload.compose.variables = data.variables;
                        if (len_variables > 0) {
                            let span:HTMLElement = null,
                                strong:HTMLElement = null;
                            do {
                                li = document.createElement("li");
                                strong = document.createElement("strong");
                                span = document.createElement("span");
                                strong.appendText(variables[index]);
                                span.appendText(payload.compose.variables[variables[index]]);
                                li.appendChild(strong);
                                li.appendChild(span);
                                list_variables.appendChild(li);
                                index = index + 1;
                            } while (index < len_variables);
                            list_variables.style.display = "block";
                        } else {
                            list_variables.style.display = "none";
                        }
                    }
                    services.compose_containers.nodes.update_containers.textContent = len_containers.toString();
                    services.compose_containers.nodes.update_variables.textContent = len_variables.toString();
                    services.compose_containers.nodes.update_time.textContent = data.time.dateTime(true, payload.timeZone_offset);
                    network.ports_application.list();
                },
                nodes: {
                    body: document.getElementById("compose_containers").getElementsByClassName("compose-body")[0] as HTMLElement,
                    list: document.getElementById("compose_containers").getElementsByClassName("compose-container-list")[0] as HTMLElement,
                    list_variables: document.getElementById("compose_containers").getElementsByClassName("compose-variable-list")[0] as HTMLElement,
                    new_container: document.getElementById("compose_containers").getElementsByClassName("compose-container-new")[0] as HTMLButtonElement,
                    new_variable: document.getElementById("compose_containers").getElementsByClassName("compose-variable-new")[0] as HTMLButtonElement,
                    status: document.getElementById("compose_containers").getElementsByClassName("status")[0] as HTMLElement,
                    update_button: document.getElementById("compose_containers").getElementsByClassName("update-button")[0].getElementsByTagName("button")[0],
                    update_containers: document.getElementById("compose_containers").getElementsByClassName("section")[0].getElementsByTagName("em")[0],
                    update_time: document.getElementById("compose_containers").getElementsByClassName("section")[0].getElementsByTagName("time")[0],
                    update_variables: document.getElementById("compose_containers").getElementsByClassName("section")[0].getElementsByTagName("em")[1]
                }
            },
            init: function dashboard_composeVariablesInit():void {
                if (payload.compose.status === "") {
                    services.compose_containers.nodes.new_container.onclick = services.shared.create;
                    services.compose_containers.nodes.new_variable.onclick = services.compose_containers.events.edit_variable;
                    services.compose_containers.nodes.update_button.onclick = services.compose_containers.events.update;
                    services.compose_containers.nodes.update_time.onclick = null;
                    services.compose_containers.list({
                        data: payload.compose,
                        service: "dashboard-compose"
                    });
                } else {
                    const strong:HTMLElement = document.createElement("strong");
                    strong.textContent = "Error: ";
                    services.compose_containers.nodes.body.style.display = "none";
                    services.compose_containers.nodes.status.appendChild(strong);
                    services.compose_containers.nodes.status.appendText(payload.compose.status);
                    services.compose_containers.nodes.status.style.display = "block";
                }
                services.statistics.nodes.frequency.onblur = services.statistics.definitions;
                services.statistics.nodes.frequency.onkeyup = services.statistics.definitions;
                services.statistics.nodes.frequency.value = (payload.stats.frequency / 1000).toString();
                services.statistics.nodes.graph_type.onchange = services.statistics.change_type;
                services.statistics.nodes.graph_type.selectedIndex = (state.graph_type === null || state.graph_type === undefined)
                    ? 0
                    : state.graph_type;
                services.statistics.nodes.records.onblur = services.statistics.definitions;
                services.statistics.nodes.records.onkeyup = services.statistics.definitions;
                services.statistics.nodes.records.value = payload.stats.records.toString();
                services.servers_web.list({
                    data: payload.servers,
                    service: "dashboard-server"
                });
                Chart.defaults.color = "#ccc";
                services.statistics.receive({
                    data: payload.stats,
                    service: "dashboard-statistics-data"
                });
            },
            servers_web: {
                activePorts: function dashboard_serverActivePorts(id:string):HTMLElement {
                    const div:HTMLElement = document.createElement("div"),
                        h5:HTMLElement = document.createElement("h5"),
                        portList:HTMLElement = document.createElement("ul"),
                        encryption:type_encryption = payload.servers[id].config.encryption,
                        ports:server_ports = payload.servers[id].status;
                    let portItem:HTMLElement = document.createElement("li");
                    h5.appendText("Active Ports");
                    div.appendChild(h5);
                    div.setAttribute("class", "active-ports");
                    portList.setAttribute("class", "container-ports");
                    
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
                list: function dashboard_serverList(socket_data:socket_data):void {
                    const list:string[] = Object.keys(socket_data.data),
                        list_old:HTMLElement = services.servers_web.nodes.list,
                        list_new:HTMLElement = document.createElement("ul"),
                        total:number = list.length;
                    let index:number = 0,
                        indexSocket:number = 0,
                        totalSocket:number = 0;
                    payload.servers = socket_data.data as store_servers;
                    services.servers_web.nodes.service_new.onclick = services.shared.create;
                    list_new.setAttribute("class", list_old.getAttribute("class"));
                    list.sort(function dashboard_serverList_sort(a:string, b:string):-1|1 {
                        if (a < b) {
                            return -1;
                        }
                        return 1;
                    });
                    do {
                        list_new.appendChild(services.shared.title(payload.servers[list[index]].config.id, "server"));
                        totalSocket = payload.servers[list[index]].sockets.length;
                        if (totalSocket > 0) {
                            indexSocket = 0;
                            do {
                                network.sockets_application.list({
                                    data: payload.sockets,
                                    service: "dashboard-socket-application"
                                });
                                indexSocket = indexSocket + 1;
                            } while (indexSocket < totalSocket);
                        }
                        index = index + 1;
                    } while (index < total);
                    list_old.parentNode.insertBefore(list_new, list_old);
                    list_old.parentNode.removeChild(list_old);
                    services.servers_web.nodes.list = list_new;
                    network.ports_application.list();
                },
                message: function dashboard_serverMessage(event:MouseEvent):void {
                    const target:HTMLElement = event.target,
                        edit:HTMLElement = target.getAncestor("edit", "class"),
                        action:type_dashboard_action = target.getAttribute("class").replace("server-", "") as type_dashboard_action,
                        cancel:HTMLElement = edit.getElementsByClassName("server-cancel")[0] as HTMLElement,
                        configuration:services_server = (function dashboard_serverMessage_configuration():services_server {
                            const textArea:HTMLTextAreaElement = edit.getElementsByTagName("textarea")[0],
                                config:services_server = JSON.parse(textArea.value);
                            if (payload.servers[config.id] !== undefined) {
                                payload.servers[config.id].config.encryption = config.encryption;
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
                        services.shared.cancel(event);
                        services.servers_web.nodes.service_new.disabled = false;
                    }
                },
                nodes: {
                    list: document.getElementById("servers_web").getElementsByClassName("server-list")[0] as HTMLElement,
                    service_new: document.getElementById("servers_web").getElementsByClassName("server-new")[0] as HTMLButtonElement
                },
                validate: function dashboard_serverValidate(event:FocusEvent|KeyboardEvent):void {
                    const target:HTMLTextAreaElement = event.target as HTMLTextAreaElement,
                        listItem:HTMLElement = target.getAncestor("li", "tag"),
                        id:string = listItem.dataset.id,
                        name_server:string = (id === undefined)
                            ? "new_server"
                            : payload.servers[id].config.name,
                        value:string = target.value,
                        edit:HTMLElement = target.getAncestor("edit", "class"),
                        summary:HTMLElement = edit.getElementsByClassName("summary")[0] as HTMLElement,
                        ul:HTMLElement = summary.getElementsByTagName("ul")[0],
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
                            const save:HTMLButtonElement = (id === undefined)
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
                            if (failures > 0) {
                                const plural:string = (failures === 1)
                                    ? ""
                                    : "s";
                                save.disabled = true;
                                populate(false, `The server configuration contains ${failures} violation${plural}.`);
                            } else if (id !== null && id !== undefined && order(serverData) === order(payload.servers[id].config)) {
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
                        key_test = function dashboard_serverValidate_keys(config:config_validate_serverKeys):void {
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
                                                indexActual = indexActual - 1;
                                            } else if (config.name === "ports" && ((serverData.encryption === "open" && config.supported[indexSupported] === "secure") || (serverData.encryption === "secure" && config.supported[indexSupported] === "open"))) {
                                                config.supported.splice(indexSupported, 1);
                                            } else if (config.name === null && keys.includes(config.supported[indexSupported]) === false && (config.supported[indexSupported] === "block_list" || config.supported[indexSupported] === "domain_local" || config.supported[indexSupported] === "http" || config.supported[indexSupported] === "redirect_domain" || config.supported[indexSupported] === "redirect_asset") || config.supported[indexSupported] === "single_socket" || config.supported[indexSupported] === "temporary") {
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
                        rootProperties:string[] = ["activate", "block_list", "domain_local", "encryption", "http", "id", "name", "ports", "redirect_asset", "redirect_domain", "single_socket", "temporary"];
                    let serverData:services_server = null,
                        failures:number = 0;
                    ul.textContent = "";
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
                    // activate
                    if (typeof serverData.activate === "boolean") {
                        populate(true, "Required property 'activate' has boolean type value.");
                    } else {
                        populate(false, "Required property 'activate' expects a boolean type value.");
                    }
                    // block_list
                    key_test({
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
                    key_test({
                        name: "http",
                        required_name: false,
                        required_property: false,
                        supported: ["delete", "post", "put"],
                        type: "path"
                    });
                    // id
                    if (typeof serverData.id === "string") {
                        populate(true, "Required property 'id' is a read only string.");
                    } else {
                        populate(false, "Required property 'id' must be a string.");
                    }
                    // name
                    if (typeof serverData.name === "string" && serverData.name !== "") {
                        if (serverData.name === "new_server") {
                            populate(null, "The name 'new_server' is a default placeholder. A more unique name is preferred.");
                        } else {
                            populate(true, "Required property 'name' is present with a value.");
                        }
                    } else {
                        populate(false, "Required property 'name' is not assigned an appropriate string value.");
                    }
                    // ports
                    if ((serverData.ports.open === 0 && (serverData.encryption === "both" || serverData.encryption === "open")) || (serverData.ports.secure === 0 && (serverData.encryption === "both" || serverData.encryption === "secure"))) {
                        populate(null, "A port value of 0 will assign a randomly available port from the local machine. A number greater than 0 and less than 65535 is preferred.");
                    }
                    key_test({
                        name: "ports",
                        required_name: true,
                        required_property: true,
                        supported: ["open", "secure"],
                        type: "number"
                    });
                    // redirect_asset
                    key_test({
                        name: "redirect_asset",
                        required_name: false,
                        required_property: false,
                        supported: [],
                        type: "store"
                    });
                    // redirect_domain
                    key_test({
                        name: "redirect_domain",
                        required_name: false,
                        required_property: false,
                        supported: [],
                        type: "array"
                    });
                    // single_socket
                    if (typeof serverData.single_socket === "boolean") {
                        populate(true, "Optional property 'single_socket' has boolean type value.");
                    } else if (serverData.single_socket === null || serverData.single_socket === undefined) {
                        populate(true, "Optional property 'single_socket' is either null or undefined.");
                    } else {
                        populate(false, "Optional property 'single_socket' expects a boolean type value.");
                    }
                    // temporary
                    if (typeof serverData.temporary === "boolean") {
                        populate(true, "Optional property 'temporary' has boolean type value.");
                    } else if (serverData.temporary === null || serverData.temporary === undefined) {
                        populate(true, "Optional property 'temporary' is either null or undefined.");
                    } else {
                        populate(false, "Optional property 'temporary' expects a boolean type value.");
                    }
                    // parent properties
                    key_test({
                        name: null,
                        required_name: false,
                        required_property: true,
                        supported: rootProperties,
                        type: null
                    });
                    disable();
                }
            },
            shared: {
                // back out of server and docker compose editing
                cancel: function dashboard_commonCancel(event:MouseEvent):void {
                    const target:HTMLElement = event.target,
                        edit:HTMLElement = target.getAncestor("edit", "class"),
                        create:HTMLButtonElement = (section === "servers_web")
                            ? services[section as "servers_web"].nodes.service_new
                            : services[section as "compose_containers"].nodes.new_variable;
                    edit.parentNode.removeChild(edit);
                    create.disabled = false;
                },
                // server and docker compose status colors
                color: function dashboard_commonColor(id:string, type:type_dashboard_list):type_activation_status {
                    if (id === undefined) {
                        return [null, "new"];
                    }
                    if (type === "container") {
                        if (payload.compose.containers[id].state === "running") {
                            return ["green", "online"];
                        }
                        return ["red", "offline"];
                    }
                    if (payload.servers[id].config.activate === false) {
                        return [null, "deactivated"];
                    }
                    const encryption:type_encryption = payload.servers[id].config.encryption,
                        ports:server_ports = payload.servers[id].status;
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
                create: function dashboard_commonCreate(event:MouseEvent):void {
                    const button:HTMLButtonElement = event.target as HTMLButtonElement;
                    button.disabled = true;
                    services.shared.details(event);
                },
                // server and docker compose instance details
                details: function dashboard_commonDetails(event:MouseEvent):void {
                    const target:HTMLElement = event.target,
                        classy:string = target.getAttribute("class"),
                        newFlag:boolean = (classy === "server-new" || classy === "compose-container-new"),
                        serverItem:HTMLElement = (newFlag === true)
                            ? services[section as "servers_web"].nodes.list
                            : target.getAncestor("li", "tag"),
                        titleButton:HTMLElement = serverItem.getElementsByTagName("button")[0],
                        expandButton:HTMLElement = (newFlag === true)
                            ? null
                            : titleButton.getElementsByClassName("expand")[0] as HTMLElement,
                        expandText:string = (newFlag === true)
                            ? ""
                            : expandButton.textContent;
                    if (newFlag === true || expandText === "Expand") {
                        let p:HTMLElement = null;
                        const id:string = serverItem.dataset.id,
                            details:HTMLElement = document.createElement("div"),
                            label:HTMLElement = document.createElement("label"),
                            textArea:HTMLTextAreaElement = document.createElement("textarea"),
                            span:HTMLElement = document.createElement("span"),
                            value:string = (section === "servers_web")
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
                                                id: "",
                                                name: "new_server",
                                                ports: {
                                                    open: 0,
                                                    secure: 0
                                                }
                                            }
                                            : payload.servers[id].config,
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
                                    output.push(`"id": "${serverData.id}",`);
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
                                        output.push(`"name": "${sanitize(serverData.name)}",`);
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
                                    if (serverData.single_socket !== undefined && serverData.single_socket !== null) {
                                        if (serverData.single_socket === true) {
                                            output.push("\"single_socket\": true,");
                                        } else {
                                            output.push("\"single_socket\": false,");
                                        }
                                    }
                                    if (serverData.temporary !== undefined && serverData.temporary !== null) {
                                        if (serverData.temporary === true) {
                                            output.push("\"temporary\": true");
                                        } else {
                                            output.push("\"temporary\": false");
                                        }
                                    }
                                    output[output.length - 1] = output[output.length - 1].replace(/,$/, "");
                                    return `${output.join("\n    ")}\n}`;
                                }())
                                : (newFlag === true || payload.compose === null)
                                    ? ""
                                    : payload.compose.containers[id].compose,
                            summary:HTMLElement = document.createElement("div"),
                            summaryTitle:HTMLElement = document.createElement("h5"),
                            summaryUl:HTMLElement = document.createElement("ul"),
                            editButton:HTMLElement = document.createElement("button"),
                            clear:HTMLElement = document.createElement("span");
                        p = document.createElement("p");
                        p.textContent = "Altering the 'id' property will have no effect as it will not change except for new servers awaiting a dynamically created id value.";
                        summaryUl.setAttribute("class", "edit-summary");
                        summaryTitle.appendText("Edit Summary");
                        summary.appendChild(p);
                        summary.appendChild(summaryTitle);
                        summary.appendChild(summaryUl);
                        summary.setAttribute("class", "summary");
                        details.setAttribute("class", "edit");
                        span.setAttribute("class", "text");
                        textArea.value = value;
                        textArea.spellcheck = false;
                        textArea.readOnly = true;
                        if (section === "compose_containers") {
                            span.appendText("Docker Compose YAML");
                        } else {
                            span.appendText("Server Configuration");
                        }
                        label.appendChild(span);
                        label.appendChild(textArea);
                        p = document.createElement("p");
                        p.appendChild(label);
                        details.appendChild(p);
                        details.appendChild(summary);
                        if (newFlag === false) {
                            const method:"activePorts"|"descriptions" = (section === "servers_web")
                                ? "activePorts"
                                : "descriptions";
                            expandButton.textContent = "Hide";
                            editButton.appendText("✎ Edit");
                            editButton.setAttribute("class", "server-edit");
                            editButton.onclick = services.shared.edit;
                            p.appendChild(editButton);
                            details.appendChild(services[section as "servers_web"][method as "activePorts"](id));
                        }
                        clear.setAttribute("class", "clear");
                        p = document.createElement("p");
                        p.appendChild(clear);
                        p.setAttribute("class", "buttons");
                        details.appendChild(p);
                        if (newFlag === true) {
                            serverItem.parentNode.insertBefore(details, serverItem);
                            services.shared.edit(event);
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
                        dashboard:boolean = (createServer === false && listItem.dataset.id === payload.dashboard_id),
                        p:HTMLElement = edit.lastChild as HTMLElement,
                        activate:HTMLButtonElement = document.createElement("button"),
                        deactivate:HTMLButtonElement = document.createElement("button"),
                        destroy:HTMLButtonElement = document.createElement("button"),
                        save:HTMLButtonElement = document.createElement("button"),
                        clear:HTMLElement = p.getElementsByClassName("clear")[0] as HTMLElement,
                        note:HTMLElement = document.createElement("p"),
                        textArea:HTMLTextAreaElement = edit.getElementsByTagName("textarea")[0],
                        summary:HTMLElement = edit.getElementsByClassName("summary")[0] as HTMLElement,
                        message:(event:MouseEvent) => void = (section === "compose_containers")
                            ? services.compose_containers.events.message_container
                            : services[section as "servers_web"].message;
                    save.disabled = true;
                    summary.style.display = "block";
                    if (createServer === false && dashboard === false) {
                        const span:HTMLElement = document.createElement("span"),
                            buttons:HTMLElement = document.createElement("p");
                        buttons.setAttribute("class", "buttons");
                        destroy.appendText("✘ Destroy");
                        destroy.setAttribute("class", "server-destroy");
                        destroy.onclick = message;
                        activate.appendText("⌁ Activate");
                        activate.setAttribute("class", "server-activate");
                        if (listItem.getAttribute("class") === "green") {
                            activate.disabled = true;
                        }
                        activate.onclick = message;
                        deactivate.appendText("። Deactivate");
                        deactivate.setAttribute("class", "server-deactivate");
                        deactivate.onclick = message;
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
                        destroy.onclick = services.shared.cancel;
                        p.appendChild(destroy);
                        save.appendText("✔ Create");
                        save.setAttribute("class", "server-add");
                    } else {
                        editButton.parentNode.removeChild(editButton);
                        save.appendText("🖪 Modify");
                        save.setAttribute("class", "server-modify");
                    }
                    save.onclick = message;
                    p.appendChild(save);
                    p.removeChild(clear);
                    p.appendChild(clear);
                    p.setAttribute("class", "buttons");
                    if (createServer === true) {
                        if (section === "compose_containers") {
                            note.textContent = "Container status messaging redirected to terminal.";
                        } else {
                            note.textContent = "Please be patient with new secure server activation as creating new TLS certificates requires several seconds.";
                        }
                        note.setAttribute("class", "note");
                        p.parentNode.appendChild(note);
                    } else if (dashboard === false) {
                        note.textContent = (section === "compose_containers")
                            ? `Changing the container name of an existing container will create a new container. Ensure the compose file mentions PUID and PGID with values ${payload.os.user_account.uid} and ${payload.os.user_account.gid} to prevent writing files as root.`
                            : "Destroying a server will delete all associated file system artifacts. Back up your data first.";
                        note.setAttribute("class", "note");
                        p.parentNode.appendChild(note);
                    }
                    if (section === "compose_containers") {
                        textArea.onkeyup = services.compose_containers.events.validate_containers;
                        textArea.onfocus = services.compose_containers.events.validate_containers;
                    } else {
                        textArea.onkeyup = services.servers_web.validate;
                        textArea.onfocus = services.servers_web.validate;
                    }
                    textArea.readOnly = false;
                    textArea.focus();
                },
                // expands server and docker compose sections
                title: function dashboard_commonTitle(id:string, type:type_dashboard_list):HTMLElement {
                    const li:HTMLElement = document.createElement("li"),
                        h4:HTMLElement = document.createElement("h4"),
                        expand:HTMLButtonElement = document.createElement("button"),
                        span:HTMLElement = document.createElement("span"),
                        name:string = (id === undefined)
                            ? `new_${type}`
                            : (type === "server")
                                ? payload.servers[id].config.name
                                : payload.compose.containers[id].name;
                    if (id === undefined) {
                        expand.appendText(name);
                    } else {
                        const color:type_activation_status = services.shared.color(id, type);
                        span.appendText("Expand");
                        span.setAttribute("class", "expand");
                        expand.appendChild(span);
                        expand.onclick = services.shared.details;
                        li.setAttribute("data-id", id);
                        expand.appendText(`${name} - ${color[1]}`);
                        if (color[0] !== null) {
                            li.setAttribute("class", color[0]);
                        }
                    }
                    h4.appendChild(expand);
                    li.appendChild(h4);
                    return li;
                }
            },
            statistics: {
                change_type: function dashboard_statisticsChangeType():void {
                    services.statistics.receive({
                        data: payload.stats,
                        service: "dashboard-statistics-data"
                    }, true);
                    utility.setState();
                },
                definitions: function dashboard_statisticsDefinitions(event:FocusEvent|KeyboardEvent):void {
                    const key:KeyboardEvent = event as KeyboardEvent,
                        frequency:number = Number(services.statistics.nodes.frequency.value),
                        records:number = Number(services.statistics.nodes.records.value);
                    if (key.type === "keyup" && key.key !== "Enter") {
                        return;
                    }
                    if (isNaN(frequency) === true || isNaN(records) === true) {
                        return;
                    }
                    utility.message_send({
                        frequency: (frequency * 1000),
                        records: records
                    }, "dashboard-statistics-change");
                },
                graphs: {},
                nodes: {
                    duration: document.getElementById("statistics").getElementsByClassName("section")[0].getElementsByTagName("em")[1],
                    frequency: document.getElementById("statistics").getElementsByClassName("table-filters")[0].getElementsByTagName("input")[0],
                    graph_type: document.getElementById("statistics").getElementsByClassName("table-filters")[0].getElementsByTagName("select")[0],
                    graphs: document.getElementById("statistics").getElementsByClassName("graphs")[0] as HTMLElement,
                    records: document.getElementById("statistics").getElementsByClassName("table-filters")[0].getElementsByTagName("input")[1],
                    update: document.getElementById("statistics").getElementsByClassName("section")[0].getElementsByTagName("em")[0]
                },
                receive: function dashboard_statisticsReceive(data:socket_data, force?:boolean):void {
                    const stats:services_statistics_data = (data === null)
                            ? payload.stats
                            : data.data as services_statistics_data,
                        id_list:string[] = Object.keys(stats.containers),
                        id_len:number = id_list.length,
                        colors:string[] = ["rgba(204,170,51,1)", "rgba(153,102,0,1)", "rgba(221,102,0,1)"],
                        graph_type:"bar"|"line" = services.statistics.nodes.graph_type[services.statistics.nodes.graph_type.selectedIndex].textContent as "bar"|"line",
                        labels:store_string = {
                            cpu: "CPU Usage, % and Millisecond Value",
                            disk_in: "Read",
                            disk_out: "Written",
                            mem: "Memory Usage, % and Bytes Written",
                            net_in: "Received",
                            net_out: "Sent",
                            threads: "Process Count"
                        },
                        title:store_string = {
                            cpu: "CPU",
                            disk: "Storage Device Usage",
                            mem: "Memory",
                            net: "Network Usage",
                            threads: "Total Processes"
                        },
                        destroy = function dashboard_statisticsReceive_destroy(id:string):void {
                            if (services.statistics.graphs[id] !== null && services.statistics.graphs[id] !== undefined) {
                                const each = function dashboard_statisticsReceive_destroy_each(type:type_graph):void {
                                    if (services.statistics.graphs[id][type] !== null && services.statistics.graphs[id][type] !== undefined) {
                                        services.statistics.graphs[id][type].destroy();
                                    }
                                };
                                each("cpu");
                                each("disk");
                                each("mem");
                                each("net");
                                each("threads");
                                services.statistics.graphs[id] = null;
                            }
                        },
                        empty = function dashboard_statisticsReceive_empty(id:string):void {
                            const sections:HTMLCollectionOf<HTMLElement> = services.statistics.nodes.graphs.getElementsByTagName("div");
                            let index:number = sections.length,
                                h4:HTMLElement = null,
                                p:HTMLElement = null,
                                div:HTMLElement = null;
                            if (index > 0) {
                                do {
                                    index = index - 1;
                                    if (sections[index].dataset.id === id) {
                                        h4 = sections[index].getElementsByTagName("h4")[0];
                                        p = document.createElement("p");
                                        h4.parentNode.removeChild(h4);
                                        sections[index].textContent = "";
                                        sections[index].appendChild(h4);
                                        p.textContent = `Container ${payload.compose.containers[id].name} is not running.`;
                                        sections[index].appendChild(p);
                                        return;
                                    }
                                } while (index > 0);
                            }
                            div = document.createElement("div");
                            div.setAttribute("class", "section");
                            div.setAttribute("data-id", id);
                            h4 = document.createElement("h4");
                            h4.textContent = (id === "application")
                                ? "Aphorio Application"
                                : `Container - ${payload.compose.containers[id].name}`;
                            p = document.createElement("p");
                            p.textContent = `Container ${payload.compose.containers[id].name} is not running.`;
                            div.appendChild(h4);
                            div.appendChild(p);
                            services.statistics.nodes.graphs.appendChild(div);
                            destroy(id);
                        },
                        update = function dashboard_statisticsReceive_update(id:string):void {
                            const modify = function dashboard_statisticsReceive_update_modify(config:graph_modify_config):void {
                                const graph:Chart = services.statistics.graphs[id][config.name];
                                graph.data.datasets[0].data = config.data_0;
                                graph.data.datasets[0].backgroundColor = colors[0].replace(",1)", ",0.1)");
                                graph.data.datasets[0].borderColor = colors[0];
                                graph.data.datasets[0].borderWidth = 2;
                                graph.data.datasets[0].label = config.label_0;
                                if (config.data_1 !== null) {
                                    graph.data.datasets[1].data = config.data_1;
                                    graph.data.datasets[1].backgroundColor = colors[1].replace(",1)", ",0.1)");
                                    graph.data.datasets[1].borderColor = colors[1];
                                    graph.data.datasets[1].borderWidth = 2;
                                    graph.data.datasets[1].label = config.label_1;
                                }
                                graph.data.labels = config.labels;
                                graph.options.plugins.title.text = title[config.name];
                                graph.update();
                            };
                            modify({
                                data_0: stats.containers[id].cpu.data,
                                data_1: null,
                                label_0: labels.cpu,
                                label_1: null,
                                labels: stats.containers[id].cpu.labels,
                                name: "cpu"
                            });
                            modify({
                                data_0: stats.containers[id].disk_in.data,
                                data_1: stats.containers[id].disk_out.data,
                                label_0: labels.disk_in,
                                label_1: labels.disk_out,
                                labels: stats.containers[id].disk_in.labels,
                                name: "disk"
                            });
                            modify({
                                data_0: stats.containers[id].mem.data,
                                data_1: null,
                                label_0: labels.mem,
                                label_1: null,
                                labels: stats.containers[id].mem.labels,
                                name: "mem"
                            });
                            modify({
                                data_0: stats.containers[id].net_in.data,
                                data_1: stats.containers[id].net_out.data,
                                label_0: labels.net_in,
                                label_1: labels.net_out,
                                labels: stats.containers[id].net_in.labels,
                                name: "net"
                            });
                            modify({
                                data_0: stats.containers[id].threads.data,
                                data_1: null,
                                label_0: labels.threads,
                                label_1: null,
                                labels: stats.containers[id].threads.labels,
                                name: "threads"
                            });
                        },
                        container = function dashboard_statisticsReceive_container(id:string):void {
                            const item:services_statistics_item = stats.containers[id],
                                section_div:HTMLElement = document.createElement("div"),
                                h4:HTMLElement = document.createElement("h4"),
                                clear:HTMLElement = document.createElement("span"),
                                sections:HTMLCollectionOf<HTMLElement> = services.statistics.nodes.graphs.getElementsByTagName("div"),
                                graph = function dashboard_statisticsReceive_container_graph(config:graph_config, type:type_graph):void {
                                    const graph_item:HTMLCanvasElement = document.createElement("canvas"),
                                        len:number = config.item.length,
                                        div:HTMLElement = document.createElement("div"),
                                        dataset:graph_dataset[] = [];
                                    let item_index:number = 0;
                                    do {
                                        dataset.push({
                                            backgroundColor: colors[item_index].replace(",1)", ",0.1)"),
                                            borderColor: colors[item_index],
                                            borderRadius: 4,
                                            borderWidth: 2,
                                            data: config.item[item_index].data,
                                            fill: true,
                                            label: config.label[item_index],
                                            showLine: true,
                                            tension: 0.2
                                        });
                                        item_index = item_index + 1;
                                    } while (item_index < len);
                                    // @ts-expect-error - TypeScript is warning on a third party super overloaded construct
                                    services.statistics.graphs[id][type] = new Chart(graph_item, {
                                        data: {
                                            labels: config.item[0].labels,
                                            datasets: dataset
                                        },
                                        options: {
                                            animation: false,
                                            responsive: true,
                                            plugins: {
                                                title: {
                                                    display: true,
                                                    text: `${name_literal} - ${config.title}`
                                                }
                                            }
                                        },
                                        type: graph_type
                                    });
                                    graph_item.setAttribute("class", "graph");
                                    div.appendChild(graph_item);div.style.border="0.1em solid #666";
                                    config.parent.appendChild(div);
                                },
                                name_literal:string = (id === "application")
                                    ? "Aphorio"
                                    : payload.compose.containers[id].name,
                                name:string = (id === "application")
                                    ? `Application - ${name_literal}`
                                    : `Container - ${name_literal}`;
                            let index_sections:number = sections.length;
                            if (force === true) {
                                destroy(id);
                            }
                            if (index_sections > 0) {
                                do {
                                    index_sections = index_sections - 1;
                                    if (sections[index_sections].dataset.id === id) {
                                        services.statistics.nodes.graphs.removeChild(sections[index_sections]);
                                        break;
                                    }
                                } while (index_sections > 0);
                            }
                            services.statistics.graphs[id] = {
                                cpu: null,
                                disk: null,
                                mem: null,
                                net: null,
                                threads: null
                            };
                            h4.textContent = name;
                            section_div.appendChild(h4);
                            graph({
                                item: [item.cpu],
                                label: [labels.cpu],
                                parent: section_div,
                                title: title.cpu
                            }, "cpu");
                            graph({
                                item: [item.mem],
                                label: [labels.mem],
                                parent: section_div,
                                title: title.mem
                            }, "mem");
                            graph({
                                item: [item.net_in, item.net_out],
                                label: [labels.disk_in, labels.disk_out],
                                parent: section_div,
                                title: title.net
                            }, "net");
                            graph({
                                item: [item.disk_in, item.disk_out],
                                label: [labels.disk_in, labels.disk_out],
                                parent: section_div,
                                title: title.disk
                            }, "disk");
                            graph({
                                item: [item.threads],
                                label: [labels.threads],
                                parent: section_div,
                                title: title.threads
                            }, "threads");
                            section_div.setAttribute("class", "section");
                            clear.setAttribute("class", "clear");
                            section_div.appendChild(clear);
                            section_div.setAttribute("data-id", id);
                            services.statistics.nodes.graphs.appendChild(section_div);
                        };
                    let index:number = 0;
                    payload.stats = stats;
                    if (id_len > 0) {
                        do {
                            if (stats.containers[id_list[index]] === null) {
                                empty(id_list[index]);
                            } else if (force === true || services.statistics.graphs[id_list[index]] === undefined || services.statistics.graphs[id_list[index]] === null) {
                                container(id_list[index]);
                            } else {
                                update(id_list[index]);
                            }
                            index = index + 1;
                        } while (index < id_len);
                    }
                    if (document.activeElement !== services.statistics.nodes.frequency) {
                        services.statistics.nodes.frequency.value = (stats.frequency / 1000).toString();
                    }
                    if (document.activeElement !== services.statistics.nodes.records) {
                        services.statistics.nodes.records.value = stats.records.toString();
                    }
                    services.statistics.nodes.update.textContent = stats.now.dateTime(true, payload.timeZone_offset);
                    services.statistics.nodes.duration.textContent = (stats.duration / 1e9).time();
                }
            }
        },
        network:structure_network = {
            interfaces: {
                init: function dashboard_interfaceInit():void {
                    network.interfaces.nodes.update_button.onclick = tables.update;
                    network.interfaces.list(payload.os.intr);
                    network.interfaces.nodes.update_button.setAttribute("data-list", "intr");
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
                        payload.os.intr = item;
                    }
                },
                nodes: {
                    count: document.getElementById("interfaces").getElementsByClassName("table-stats")[0].getElementsByTagName("em")[0],
                    list: document.getElementById("interfaces").getElementsByClassName("item-list")[0] as HTMLElement,
                    update_button: document.getElementById("interfaces").getElementsByClassName("table-stats")[0].getElementsByTagName("button")[0],
                    update_text: document.getElementById("interfaces").getElementsByClassName("table-stats")[0].getElementsByTagName("time")[0]
                }
            },
            ports_application: {
                dataName: "ports_application",
                list: function dashboard_networkPortsApplicationList():void {
                    const data:[number, "tcp"|"udp", "container"|"server", string, string][] = [],
                        keys_container:string[] = Object.keys(payload.compose.containers),
                        keys_servers:string[] = Object.keys(payload.servers);
                    let index_item:number = keys_container.length,
                        index_ports:number = 0,
                        container:core_compose_container = null,
                        server:server = null,
                        tr:HTMLElement = null;

                    // from containers
                    if (index_item > 0) {
                        do {
                            index_item = index_item - 1;
                            container = payload.compose.containers[keys_container[index_item]];
                            index_ports = container.ports.length;
                            if (index_ports > 0) {
                                do {
                                    index_ports = index_ports - 1;
                                    data.push([container.ports[index_ports][0], container.ports[index_ports][1], "container", container.name, keys_container[index_item]]);
                                } while (index_ports > 0);
                            }
                        } while (index_item > 0);
                    }

                    // from servers
                    index_item = keys_servers.length;
                    if (index_item > 0) {
                        do {
                            index_item = index_item - 1;
                            server = payload.servers[keys_servers[index_item]];
                            if (server.config.encryption === "both") {
                                data.push([server.status.open, "tcp", "server", server.config.name, keys_servers[index_item]]);
                                data.push([server.status.secure, "tcp", "server", server.config.name, keys_servers[index_item]]);
                            } else {
                                data.push([server.status[server.config.encryption], "tcp", "server", server.config.name, keys_servers[index_item]]);
                            }
                        } while (index_item > 0);
                    }
                    data.sort(function dashboard_networkPortsApplicationList_sort(a:[number, "tcp"|"udp", "container"|"server", string, string], b:[number, "tcp"|"udp", "container"|"server", string, string]):-1|1 {
                        if (a[0] < b[0] || (a[0] === b[0] && a[1] < b[1])) {
                            return -1;
                        }
                        return 1;
                    });
                    index_ports = data.length;
                    index_item = 0;
                    network.ports_application.nodes.list.textContent = "";
                    if (index_ports > 0) {
                        do {
                            tr = document.createElement("tr");
                            tables.cell(tr, data[index_item][0].toString(), null);
                            tables.cell(tr, data[index_item][1], null);
                            tables.cell(tr, data[index_item][2], null);
                            tables.cell(tr, data[index_item][3], null);
                            tables.cell(tr, data[index_item][4], null);
                            tr.setAttribute("class", (index_item % 2 === 0) ? "even" : "odd");
                            network.ports_application.nodes.list.appendChild(tr);
                            index_item = index_item + 1;
                        } while (index_item < index_ports);
                    }
                    network.ports_application.nodes.count.textContent = index_ports.toString();
                    network.ports_application.nodes.update_text.textContent = Date.now().dateTime(true, payload.timeZone_offset);
                },
                nodes: {
                    caseSensitive: document.getElementById("ports-application").getElementsByTagName("input")[1],
                    count: document.getElementById("ports-application").getElementsByTagName("em")[0],
                    filter_column: document.getElementById("ports-application").getElementsByTagName("select")[0],
                    filter_count: document.getElementById("ports-application").getElementsByTagName("em")[1],
                    filter_value: document.getElementById("ports-application").getElementsByTagName("input")[0],
                    list: document.getElementById("ports-application").getElementsByTagName("tbody")[0],
                    update_button: document.getElementById("ports-application").getElementsByTagName("button")[0],
                    update_text: document.getElementById("ports-application").getElementsByTagName("time")[0]
                }
            },
            sockets_application: {
                dataName: "sockets_application",
                list: function dashboard_networkSocketApplicationList(socket_data:socket_data):void {
                    let tr:HTMLElement = null,
                        index:number = 0;
                    const config:services_socket_application = socket_data.data as services_socket_application,
                        len:number = config.list.length,
                        tbody:HTMLElement = network.sockets_application.nodes.list,
                        table:HTMLElement = tbody.parentNode,
                        cell = function dashboard_networkSocketApplicationList_cell(text:string, classy:string):void {
                            const td:HTMLElement = document.createElement("td");
                            td.textContent = text;
                            if (classy !== null) {
                                td.setAttribute("class", classy);
                                td.setAttribute("title", text);
                            }
                            tr.appendChild(td);
                        };
                    tbody.textContent = "";
                    do {
                        tr = document.createElement("tr");
                        cell(config.list[index].server_id, "server_id");
                        cell(config.list[index].server_name, null);
                        cell(config.list[index].hash, null);
                        cell(config.list[index].type, null);
                        cell(config.list[index].role, null);
                        cell((config.list[index].proxy === null) ? "" : config.list[index].proxy, null);
                        cell(String(config.list[index].encrypted), null);
                        cell(config.list[index].address.local.address, null);
                        cell(String(config.list[index].address.local.port), null);
                        cell(config.list[index].address.remote.address, null);
                        cell(String(config.list[index].address.remote.port), null);
                        cell(config.list[index].userAgent, null);
                        tbody.appendChild(tr);
                        index = index + 1;
                    } while (index < len);
                    network.sockets_application.nodes.count.textContent = tbody.getElementsByTagName("tr").length.commas();
                    network.sockets_application.nodes.update_text.textContent = config.time.dateTime(true, payload.timeZone_offset);
                    tables.filter(null, network.sockets_application.nodes.filter_value);
                    tables.sort(null, table, Number(table.dataset.column));
                },
                nodes: {
                    caseSensitive: document.getElementById("sockets-application").getElementsByTagName("input")[1],
                    count: document.getElementById("sockets-application").getElementsByClassName("table-stats")[0].getElementsByTagName("em")[0],
                    filter_column: document.getElementById("sockets-application").getElementsByTagName("select")[0],
                    filter_count: document.getElementById("sockets-application").getElementsByClassName("table-stats")[0].getElementsByTagName("em")[1],
                    filter_value: document.getElementById("sockets-application").getElementsByTagName("input")[0],
                    list: document.getElementById("sockets-application").getElementsByTagName("tbody")[0],
                    update_button: document.getElementById("sockets-application").getElementsByTagName("button")[0],
                    update_text: document.getElementById("sockets-application").getElementsByTagName("time")[0]
                },
                row: null,
                sort_name: ["server", "type", "role", "name"],
                update: function dashboard_networkSocketApplicationUpdate():void {
                    utility.message_send(null, "dashboard-socket-application");
                }
            },
            sockets_os: {
                dataName: "sock",
                nodes: {
                    caseSensitive: document.getElementById("sockets-os").getElementsByTagName("input")[1],
                    count: document.getElementById("sockets-os").getElementsByClassName("table-stats")[0].getElementsByTagName("em")[0],
                    filter_column: document.getElementById("sockets-os").getElementsByTagName("select")[0],
                    filter_count: document.getElementById("sockets-os").getElementsByClassName("table-stats")[0].getElementsByTagName("em")[1],
                    filter_value: document.getElementById("sockets-os").getElementsByTagName("input")[0],
                    list: document.getElementById("sockets-os").getElementsByTagName("tbody")[0],
                    update_button: document.getElementById("sockets-os").getElementsByTagName("button")[0],
                    update_text: document.getElementById("sockets-os").getElementsByTagName("time")[0]
                },
                row: function dashboard_networkSocketOSRow(record_item:type_lists, tr:HTMLElement):void {
                    const record:os_sock = record_item as os_sock;
                    let index:number = payload.os.proc.data.length;
                    tables.cell(tr, record.type, null);
                    tables.cell(tr, record["local-address"], null);
                    tables.cell(tr, String(record["local-port"]), null);
                    tables.cell(tr, record["remote-address"], null);
                    tables.cell(tr, String(record["remote-port"]), null);
                    if (record.process === 0) {
                        tables.cell(tr, "null", null);
                        tables.cell(tr, "null", null);
                    } else {
                        tables.cell(tr, String(record.process), null);
                        do {
                            index = index - 1;
                            if (payload.os.proc.data[index].id === record.process) {
                                tables.cell(tr, payload.os.proc.data[index].name, null);
                                return;
                            }
                        } while (index > 0);
                        tables.cell(tr, "null", null);
                    }
                },
                sort_name: ["type", "local-address", "local-port", "remote-address", "remote-port"]
            }
        },
        system:structure_system = {
            devices: {
                dataName: "devs",
                nodes: {
                    caseSensitive: document.getElementById("devices").getElementsByClassName("table-filters")[0].getElementsByTagName("input")[1],
                    count: document.getElementById("devices").getElementsByClassName("table-stats")[0].getElementsByTagName("em")[0],
                    filter_column: document.getElementById("devices").getElementsByClassName("table-filters")[0].getElementsByTagName("select")[0],
                    filter_count: document.getElementById("devices").getElementsByClassName("table-stats")[0].getElementsByTagName("em")[1],
                    filter_value: document.getElementById("devices").getElementsByClassName("table-filters")[0].getElementsByTagName("input")[0],
                    list: document.getElementById("devices").getElementsByClassName("section")[0].getElementsByTagName("tbody")[0],
                    update_button: document.getElementById("devices").getElementsByClassName("table-stats")[0].getElementsByTagName("button")[0],
                    update_text: document.getElementById("devices").getElementsByClassName("table-stats")[0].getElementsByTagName("time")[0]
                },
                row: function dashboard_networkRow(record_item:type_lists, tr:HTMLElement):void {
                    const record:os_devs = record_item as os_devs;
                    tables.cell(tr, record.name, null);
                    tables.cell(tr, record.type, null);
                    tables.cell(tr, record.kernel_module, null);
                },
                sort_name: ["type", "name", "kernel_module"]
            },
            disks: {
                init: function dashboard_disksInit():void {
                    system.disks.nodes.update_button.onclick = tables.update;
                    system.disks.list(payload.os.disk);
                    system.disks.nodes.update_button.setAttribute("data-list", "disk");
                },
                list: function dashboard_disksList(item:services_os_disk):void {
                    if (item.data === null) {
                        return;
                    }
                    const output_old:HTMLElement = system.disks.nodes.list,
                        output_new:HTMLElement = document.createElement("div"),
                        len:number = item.data.length,
                        data_item = function dashboard_disksList_dataItem(ul:HTMLElement, disk:os_disk_partition[]|string, key:"active"|"bootable"|"bus"|"file_system"|"guid"|"hidden"|"id"|"name"|"partitions"|"path"|"read_only"|"serial"|"size_disk"|"size_free"|"size_total"|"size_used"|"type"):void {
                            const li:HTMLElement = document.createElement("li"),
                                len:number = (key === "partitions")
                                    ? item.data[index].partitions.length
                                    : 0,
                                strong:HTMLElement = (key === "partitions" && len > 0)
                                    ? document.createElement("h6")
                                    : document.createElement("strong"),
                                span:HTMLElement = document.createElement("span");
                            strong.textContent = key.capitalize().replace(/_\w/, function dashboard_osStorage_dataItem_cap(input:string):string {
                                return ` ${input.replace("_", "").capitalize()}`;
                            });
                            li.appendChild(strong);
                            if (key === "partitions" && len > 0) {
                                let list:HTMLElement = null,
                                    pIndex:number = 0,
                                    warn:HTMLElement = null,
                                    p:HTMLElement = null,
                                    percent:HTMLElement = null,
                                    sfLi:HTMLElement = null,
                                    sfBad:HTMLElement = null,
                                    sfStrong:HTMLElement = null;
                                span.textContent = String(len);
                                li.appendChild(span);
                                do {
                                    list = document.createElement("ul");
                                    if (item.data[index].partitions[pIndex].size_free_percent < 16 && item.data[index].partitions[pIndex].file_system !== null && item.data[index].partitions[pIndex].size_total > 0) {
                                        warn = document.createElement("strong");
                                        percent = document.createElement("strong");
                                        p = document.createElement("p");
                                        warn.textContent = "Warning!";
                                        p.appendChild(warn);
                                        percent.textContent = `${item.data[index].partitions[pIndex].size_free_percent}%`;
                                        p.appendText(` Disk partition ${String(item.data[index].partitions[pIndex].id)} only has `);
                                        p.appendChild(percent);
                                        p.appendText(" capacity free.");
                                        li.appendChild(p);
                                        list.setAttribute("class", "os-interface fail-list");
                                    } else {
                                        list.setAttribute("class", "os-interface");
                                    }
                                    data_item(list, String(item.data[index].partitions[pIndex].active), "active");
                                    data_item(list, String(item.data[index].partitions[pIndex].bootable), "bootable");
                                    data_item(list, String(item.data[index].partitions[pIndex].file_system), "file_system");
                                    data_item(list, String(item.data[index].partitions[pIndex].hidden), "hidden");
                                    data_item(list, String(item.data[index].partitions[pIndex].id), "id");
                                    data_item(list, String(item.data[index].partitions[pIndex].path), "path");
                                    data_item(list, String(item.data[index].partitions[pIndex].read_only), "read_only");
                                    if (item.data[index].partitions[pIndex].size_total === 0) {
                                        data_item(list, "0 bytes (0B)", "size_free");
                                    } else if (warn === null) {
                                        data_item(list, `${item.data[index].partitions[pIndex].size_free.bytesLong()}, ${item.data[index].partitions[pIndex].size_free_percent}%`, "size_free");
                                    } else {
                                        sfLi = document.createElement("li");
                                        sfBad = document.createElement("strong");
                                        sfStrong = document.createElement("strong");
                                        sfBad.setAttribute("class", "fail");
                                        sfBad.textContent = `${item.data[index].partitions[pIndex].size_free_percent}%`;
                                        sfStrong.textContent = "Size Free";
                                        sfLi.appendChild(sfStrong);
                                        sfLi.appendText(`${item.data[index].partitions[pIndex].size_free.bytesLong()}, `);
                                        sfLi.appendChild(sfBad);
                                        list.appendChild(sfLi);
                                    }
                                    if (item.data[index].partitions[pIndex].size_free === 0 || item.data[index].partitions[pIndex].size_total === 0) {
                                        data_item(list, `${item.data[index].partitions[pIndex].size_used.bytesLong()}`, "size_used");
                                    } else {
                                        data_item(list, `${item.data[index].partitions[pIndex].size_used.bytesLong()}, ${item.data[index].partitions[pIndex].size_used_percent}%`, "size_used");
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
                                if (key === "partitions") {
                                    span.textContent = "none";
                                } else {
                                    span.textContent = disk as string;
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
                    system.disks.nodes.list = output_new;
                    system.disks.nodes.count.textContent = String(len);
                    system.disks.nodes.update_text.textContent = item.time.dateTime(true, payload.timeZone_offset);
                },
                nodes: {
                    count: document.getElementById("disks").getElementsByClassName("table-stats")[0].getElementsByTagName("em")[0],
                    list: document.getElementById("disks").getElementsByClassName("item-list")[0] as HTMLElement,
                    update_button: document.getElementById("disks").getElementsByClassName("table-stats")[0].getElementsByTagName("button")[0],
                    update_text: document.getElementById("disks").getElementsByClassName("table-stats")[0].getElementsByTagName("time")[0]
                }
            },
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
                    system.os.nodes.process.admin.textContent = payload.os.process.admin.toString();
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
                        system.os.nodes.user.gid.textContent = String(payload.os.user_account.gid);
                        system.os.nodes.user.uid.textContent = String(payload.os.user_account.uid);
                    }
                    system.os.nodes.user.homedir.textContent = payload.os.user_account.homedir;
                    system.os.nodes.update_button.onclick = tables.update;
                    system.os.nodes.update_button.setAttribute("data-list", "main");
    
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
                                admin: item("process", 0),
                                arch: item("process", 1),
                                argv: item("process", 2),
                                cpuSystem: item("process", 3),
                                cpuUser: item("process", 4),
                                cwd: item("process", 5),
                                memoryProcess: item("process", 6),
                                memoryV8: item("process", 7),
                                memoryExternal: item("process", 8),
                                platform: item("process", 9),
                                pid: item("process", 10),
                                ppid: item("process", 11),
                                uptime: item("process", 12)
                            },
                            update_button: document.getElementById("os").getElementsByClassName("table-stats")[0].getElementsByTagName("button")[0],
                            update_text: document.getElementById("os").getElementsByClassName("table-stats")[0].getElementsByTagName("time")[0],
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
                    const main = function dashboard_osService_main(data:core_server_os):void {
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
                            system.os.nodes.process.admin.textContent = payload.os.process.admin.toString();
                            system.os.nodes.process.cpuSystem.textContent = payload.os.process.cpuSystem.time();
                            system.os.nodes.process.cpuUser.textContent = payload.os.process.cpuUser.time();
                            system.os.nodes.process.uptime.textContent = payload.os.process.uptime.time();
                            system.os.nodes.process.memoryProcess.textContent = `${payload.os.process.memory.rss.bytesLong()}, ${((payload.os.process.memory.rss / payload.os.machine.memory.total) * 100).toFixed(2)}%`;
                            system.os.nodes.process.memoryV8.textContent = payload.os.process.memory.V8.bytesLong();
                            system.os.nodes.process.memoryExternal.textContent = payload.os.process.memory.external.bytesLong();
                        };
                    if (data_item.service === "dashboard-os-all") {
                        const data:core_server_os = data_item.data as core_server_os;
                        main(data);
                        network.interfaces.list(data.intr);
                        system.disks.list(data.disk);
                        tables.populate(system.devices, data.devs);
                        tables.populate(system.processes, data.proc);
                        tables.populate(system.services, data.serv);
                        tables.populate(network.sockets_os, data.sock);
                        tables.populate(system.users, data.user);
                    } else if (data_item.service === "dashboard-os-devs") {
                        tables.populate(system.devices, data_item.data as services_os_devs);
                    } else if (data_item.service === "dashboard-os-disk") {
                        system.disks.list(data_item.data as services_os_disk);
                    } else if (data_item.service === "dashboard-os-intr") {
                        network.interfaces.list(data_item.data as services_os_intr);
                    } else if (data_item.service === "dashboard-os-main") {
                        main(data_item.data as core_server_os);
                    } else if (data_item.service === "dashboard-os-proc") {
                        tables.populate(system.processes, data_item.data as services_os_proc);
                    } else if (data_item.service === "dashboard-os-serv") {
                        tables.populate(system.services, data_item.data as services_os_serv);
                    } else if (data_item.service === "dashboard-os-sock") {
                        tables.populate(network.sockets_os, data_item.data as services_os_sock);
                    } else if (data_item.service === "dashboard-os-user") {
                        tables.populate(system.users, data_item.data as services_os_user);
                    }
                }
            },
            processes: {
                dataName: "proc",
                nodes: {
                    caseSensitive: document.getElementById("processes").getElementsByClassName("table-filters")[0].getElementsByTagName("input")[1],
                    count: document.getElementById("processes").getElementsByClassName("table-stats")[0].getElementsByTagName("em")[0],
                    filter_column: document.getElementById("processes").getElementsByClassName("table-filters")[0].getElementsByTagName("select")[0],
                    filter_count: document.getElementById("processes").getElementsByClassName("table-stats")[0].getElementsByTagName("em")[1],
                    filter_value: document.getElementById("processes").getElementsByClassName("table-filters")[0].getElementsByTagName("input")[0],
                    list: document.getElementById("processes").getElementsByClassName("section")[0].getElementsByTagName("tbody")[0],
                    update_button: document.getElementById("processes").getElementsByClassName("table-stats")[0].getElementsByTagName("button")[0],
                    update_text: document.getElementById("processes").getElementsByClassName("table-stats")[0].getElementsByTagName("time")[0]
                },
                row: function dashboard_networkSocketOSRow(record_item:type_lists, tr:HTMLElement):void {
                    const record:os_proc = record_item as os_proc,
                        timeValue:string = (record.time === null)
                            ? (0).time()
                            : record.time.time(),
                        time:string = (payload.os.process.platform === "win32")
                            ? timeValue.replace(/000$/, "")
                            : timeValue.replace(/\.0+$/, ""),
                        memory:string = (record.memory === null)
                            ? "0"
                            : record.memory.commas(),
                        id:string = String(record.id);
                    tables.cell(tr, record.name, null);
                    tables.cell(tr, id, id);
                    tables.cell(tr, memory, (record.memory === null)
                        ? "0"
                        : String(record.memory));
                    tables.cell(tr, time, (record.time === null)
                        ? "0"
                        : String(record.time));
                    tables.cell(tr, record.user, null);
                },
                sort_name: ["name", "id", "memory", "time", "user"]
            },
            services: {
                dataName: "serv",
                nodes: {
                    caseSensitive: document.getElementById("services").getElementsByClassName("table-filters")[0].getElementsByTagName("input")[1],
                    count: document.getElementById("services").getElementsByClassName("table-stats")[0].getElementsByTagName("em")[0],
                    filter_column: document.getElementById("services").getElementsByClassName("table-filters")[0].getElementsByTagName("select")[0],
                    filter_count: document.getElementById("services").getElementsByClassName("table-stats")[0].getElementsByTagName("em")[1],
                    filter_value: document.getElementById("services").getElementsByClassName("table-filters")[0].getElementsByTagName("input")[0],
                    list: document.getElementById("services").getElementsByClassName("section")[0].getElementsByTagName("tbody")[0],
                    update_button: document.getElementById("services").getElementsByClassName("table-stats")[0].getElementsByTagName("button")[0],
                    update_text: document.getElementById("services").getElementsByClassName("table-stats")[0].getElementsByTagName("time")[0]
                },
                row: function dashboard_networkSocketOSRow(record_item:type_lists, tr:HTMLElement):void {
                    const record:os_serv = record_item as os_serv;
                    tables.cell(tr, record.name, null);
                    tables.cell(tr, record.status, null);
                    tables.cell(tr, record.description, null);
                },
                sort_name: ["name", "status", "description"]
            },
            users: {
                dataName: "user",
                nodes: {
                    caseSensitive: document.getElementById("users").getElementsByClassName("table-filters")[0].getElementsByTagName("input")[1],
                    count: document.getElementById("users").getElementsByClassName("table-stats")[0].getElementsByTagName("em")[0],
                    filter_column: document.getElementById("users").getElementsByClassName("table-filters")[0].getElementsByTagName("select")[0],
                    filter_count: document.getElementById("users").getElementsByClassName("table-stats")[0].getElementsByTagName("em")[1],
                    filter_value: document.getElementById("users").getElementsByClassName("table-filters")[0].getElementsByTagName("input")[0],
                    list: document.getElementById("users").getElementsByClassName("section")[0].getElementsByTagName("tbody")[0],
                    update_button: document.getElementById("users").getElementsByClassName("table-stats")[0].getElementsByTagName("button")[0],
                    update_text: document.getElementById("users").getElementsByClassName("table-stats")[0].getElementsByTagName("time")[0]
                },
                row: function dashboard_networkSocketOSRow(record_item:type_lists, tr:HTMLElement):void {
                    const record:os_user = record_item as os_user,
                        uid:string = String(record.uid),
                        proc:string = String(record.proc);
                    tables.cell(tr, record.name, null);
                    tables.cell(tr, uid, uid);
                    tables.cell(tr, (record.lastLogin === 0)
                        ? "never"
                        : record.lastLogin.dateTime(true, null), String(record.lastLogin));
                    tables.cell(tr, proc, proc);
                    tables.cell(tr, record.type, null);
                },
                sort_name: ["name", "uid", "lastLogin", "proc"]
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
                    if (state.dns !== undefined && state.dns !== null) {
                        tools.dns.nodes.reverse.checked = state.dns.reverse;
                        tools.dns.nodes.hosts.value = state.dns.hosts;
                        tools.dns.nodes.types.value = state.dns.types;
                    }
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
                block: false,
                init: function dashboard_fileSystemInit():void {
                    tools.fileSystem.nodes.path.onblur = tools.fileSystem.send;
                    tools.fileSystem.nodes.search.onblur = tools.fileSystem.send;
                    tools.fileSystem.nodes.path.onkeydown = tools.fileSystem.key;
                    tools.fileSystem.nodes.search.onkeydown = tools.fileSystem.key;
                    tools.fileSystem.nodes.path.value = (state.fileSystem === undefined || state.fileSystem === null || typeof state.fileSystem.path !== "string" || state.fileSystem.path === "")
                        ? payload.path.project.replace(/(\\|\/)webserver(\\|\/)test(\\|\/)?$/, `${payload.path.sep}webserver`)
                        : state.fileSystem.path;
                    tools.fileSystem.nodes.search.value = (state.fileSystem === undefined || state.fileSystem === null || typeof state.fileSystem.search !== "string")
                        ? ""
                        : state.fileSystem.search;
                    tools.fileSystem.send(null);
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
                    status: document.getElementById("file-system").getElementsByClassName("file-list")[0].getElementsByTagName("em")[0],
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
                        tbody:HTMLElement = tools.fileSystem.nodes.output.getElementsByTagName("tbody")[0],
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
                            button.setAttribute("data-raw", name_raw);
                            tr = document.createElement("tr");
                            span = document.createElement("span");
                            tr.setAttribute("class", (index % 2 === 0) ? "even" : "odd");
                            td = document.createElement("td");
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
                            td.setAttribute("class", "right");
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
                            td.setAttribute("class", "right");
                            td.setAttribute("data-raw", String(item[4]));
                            td.appendText(item[4].commas());
                            tr.appendChild(td);
                            tbody.appendChild(tr);
                        };
                    let index_record:number = 0,
                        size:number = 0;
                    tools.fileSystem.nodes.status.textContent = `Fetched in ${BigInt(Math.round(performance.now() * 1e6)).time(tools.fileSystem.time).replace(/000$/, "")} time.`;
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
                    tbody.textContent = "";
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
                    tools.fileSystem.block = false;
                },
                send: function dashboard_fileSystemSend(event:FocusEvent|KeyboardEvent):void {
                    const target:HTMLElement = (event === null)
                            ? tools.fileSystem.nodes.path
                            : event.target,
                        name:string = target.lowName(),
                        address:string = (name === "input")
                            ? tools.fileSystem.nodes.path.value.replace(/^\s+/, "").replace(/\s+$/, "")
                            : target.dataset.raw,
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
                    if (tools.fileSystem.block === false) {
                        tools.fileSystem.block = true;
                        tools.fileSystem.time = BigInt(Math.round(performance.now() * 1e6));
                        tools.fileSystem.nodes.status.textContent = "Fetching\u2026";
                        utility.message_send(payload, "dashboard-fileSystem");
                    }
                },
                time: 0n
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
                    if (state.hash === undefined || state.hash === null) {
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
                        tools.hash.nodes.source.value = (typeof state.hash.source !== "string")
                            ? ""
                            : state.hash.source;
                    }
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
                    tools.http.nodes.request.value = (state.http === null || state.http === undefined || typeof state.http.request !== "string" || state.http.request === "")
                        ? payload.http_request
                        : state.http.request;
                    tools.http.nodes.http_request.onclick = tools.http.request;
                    tools.http.nodes.responseBody.value = "";
                    tools.http.nodes.responseHeaders.value = "";
                    tools.http.nodes.responseURI.value = "";
                    if (state.http !== null && state.http !== undefined && state.http.encryption === true) {
                        document.getElementById("http").getElementsByTagName("input")[1].checked =  true;
                    } else {
                        document.getElementById("http").getElementsByTagName("input")[0].checked =  true;
                    }
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
                cols: 0,
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
                        if (state.nav === "terminal") {
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
                            if (output_width < 1) {
                                setTimeout(dashboard_terminalResize, 10);
                            } else if (tools.terminal.cols !== cols || tools.terminal.rows !== rows) {
                                tools.terminal.cols = cols;
                                tools.terminal.rows = rows;
                                tools.terminal.nodes.output.style.height = `${output_height / 10}em`;
                                tools.terminal.nodes.output.setAttribute("data-size", JSON.stringify({
                                    col: tools.terminal.cols,
                                    row: tools.terminal.rows
                                }));
                                tools.terminal.nodes.cols.textContent = cols.toString();
                                tools.terminal.nodes.rows.textContent = rows.toString();
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
                    if (document.getElementById("terminal") === null) {
                        return;
                    }
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
                    if (typeof Terminal === "undefined") {
                        setTimeout(dashboard_terminalItem, 200);
                    } else {
                        tools.terminal.shell();
                    }
                    tools.terminal.events.resize();
                },
                item: null,
                nodes: {
                    cols: (document.getElementById("terminal") === null)
                        ? null
                        : document.getElementById("terminal").getElementsByClassName("dimensions")[0].getElementsByTagName("em")[0],
                    output: (document.getElementById("terminal") === null)
                        ? null
                        : document.getElementById("terminal").getElementsByClassName("terminal-output")[0] as HTMLElement,
                    rows: (document.getElementById("terminal") === null)
                        ? null
                        : document.getElementById("terminal").getElementsByClassName("dimensions")[0].getElementsByTagName("em")[1],
                    select: (document.getElementById("terminal") === null)
                        ? null
                        : document.getElementById("terminal").getElementsByTagName("select")[0] as HTMLSelectElement
                },
                rows: 0,
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
                    const form:HTMLElement = tools.websocket.nodes.handshake_scheme.getAncestor("form", "class"),
                        h4:HTMLElement = form.getElementsByTagName("h4")[0],
                        scheme:HTMLElement = form.getElementsByTagName("p")[1],
                        emOpen:HTMLElement = document.createElement("em"),
                        emSecure:HTMLElement = document.createElement("em");
                    tools.websocket.handshake();
                    tools.websocket.nodes.button_handshake.onclick = tools.websocket.handshakeSend;
                    tools.websocket.nodes.button_send.onclick = tools.websocket.message_send;
                    tools.websocket.nodes.message_send_body.onkeyup = tools.websocket.keyup_message;
                    tools.websocket.nodes.message_send_frame.onblur = tools.websocket.keyup_frame;
                    tools.websocket.nodes.handshake_label.textContent = "";
                    if (isNaN(payload.servers[payload.dashboard_id].status.open) === true) {
                        tools.websocket.nodes.handshake_scheme.checked = true;
                        h4.style.display = "none";
                        scheme.style.display = "none";
                        emSecure.textContent = String(payload.servers[payload.dashboard_id].status.secure);
                        tools.websocket.nodes.handshake_label.appendText("secure - ");
                        tools.websocket.nodes.handshake_label.appendChild(emSecure);
                    } else if (isNaN(payload.servers[payload.dashboard_id].status.secure) === true) {
                        tools.websocket.nodes.handshake_scheme.checked = false;
                        h4.style.display = "none";
                        scheme.style.display = "none";
                        emOpen.textContent = String(payload.servers[payload.dashboard_id].status.open);
                        tools.websocket.nodes.handshake_label.appendText("open - ");
                        tools.websocket.nodes.handshake_label.appendChild(emOpen);
                    } else {
                        emOpen.textContent = String(payload.servers[payload.dashboard_id].status.open);
                        emSecure.textContent = String(payload.servers[payload.dashboard_id].status.secure);
                        tools.websocket.nodes.handshake_label.appendText("open - ");
                        tools.websocket.nodes.handshake_label.appendChild(emOpen);
                        tools.websocket.nodes.handshake_label.appendText(", secure - ");
                        tools.websocket.nodes.handshake_label.appendChild(emSecure);
                    }
                },
                keyup_frame: function dashboard_websocketKeuUpFrame(event:Event):void {
                    const encodeLength:TextEncoder = new TextEncoder(),
                        text:string = tools.websocket.nodes.message_send_body.value,
                        textLength:number = encodeLength.encode(text).length,
                        frame:websocket_frame = {
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
                    let frame_try:websocket_frame = null;
                    // eslint-disable-next-line no-restricted-syntax
                    try {
                        frame_try = tools.websocket.parse_frame();
                    // eslint-disable-next-line no-empty
                    } catch {}
                    if (frame_try !== null) {
                        const opcode:number = (isNaN(frame_try.opcode) === true)
                            ? 1
                            : Math.floor(frame_try.opcode);
                        frame.fin = (frame_try.fin === false)
                            ? false
                            : true;
                        frame.mask = (frame_try.mask === true)
                            ? true
                            : false;
                        frame.opcode = (opcode > -1 && opcode < 16)
                            ? opcode
                            : 1;
                        frame.rsv1 = (frame_try.rsv1 === true)
                            ? true
                            : false;
                        frame.rsv2 = (frame_try.rsv2 === true)
                            ? true
                            : false;
                        frame.rsv3 = (frame_try.rsv3 === true)
                            ? true
                            : false;
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
                    handshake_label: document.getElementById("websocket").getElementsByClassName("form")[0].getElementsByClassName("ports")[0].getElementsByTagName("span")[0],
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
        // eslint-disable-next-line max-params
        window.onerror = function dashboard_windowError(message:Event|string, source:string, lineno:number, colno:number, error:Error):void {
            utility.log({
                data: {
                    error: error,
                    message: `JavaScript UI error in browser on line ${lineno} and column ${colno} in ${source}. ${message.toString()}`,
                    section: "dashboard",
                    status: "error",
                    time: Date.now()
                },
                service: "dashboard-log"
            });
        };
        const navButtons:HTMLCollectionOf<HTMLElement> = document.getElementsByTagName("nav")[0].getElementsByTagName("button"),
            navigation = function dashboard_navigation(event:MouseEvent):void {
                const target:HTMLElement = event.target;
                let index:number = sections.length;
                section = target.dataset.section as type_dashboard_sections;
                if (document.getElementById(section) === null) {
                    section = "servers_web";
                }
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
                state.nav = section;
                tools.terminal.events.resize();
                utility.setState();
                target.setAttribute("class", "nav-focus");
            },
            // dynamically discover navigation and assign navigation event handler
            sections:string[] = (function dashboard_sections():string[] {
                const output:string[] = [];
                let index:number = navButtons.length;
                do {
                    index = index - 1;
                    output.push(navButtons[index].dataset.section);
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
            title:HTMLElement = document.getElementsByTagName("h1")[0],
            th:HTMLCollectionOf<HTMLElement> = document.getElementsByTagName("th"),
            expand:HTMLCollectionOf<HTMLButtonElement> = document.getElementsByClassName("expand") as HTMLCollectionOf<HTMLButtonElement>,
            table_keys:string[] = (state.tables === undefined || state.tables === null)
                ? []
                : Object.keys(state.tables);
        let index:number = table_keys.length,
            button:HTMLElement = null,
            table_key:string[] = null,
            table:HTMLElement = null;

        title.textContent = `${payload.name.capitalize()} Dashboard`;

        // restore state of table filter controls
        if (state.table_os === undefined || state.table_os === null) {
            state.table_os = {};
        }

        // restore table sorting direction and column
        if (index > 0) {
            do {
                index = index - 1;
                table_key = [table_keys[index].slice(0, table_keys[index].lastIndexOf("-")), table_keys[index].slice(table_keys[index].lastIndexOf("-") + 1)];
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
                button.onclick = tables.sort;
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
        if (state.nav !== "servers_web" && document.getElementById(state.nav) !== null) {
            index = navButtons.length;
            do {
                index = index - 1;
                if (navButtons[index].dataset.section === state.nav) {
                    navButtons[index].setAttribute("class", "nav-focus");
                } else {
                    navButtons[index].removeAttribute("class");
                }
            } while (index > 0);
            document.getElementById("servers_web").style.display = "none";
            document.getElementById(state.nav).style.display = "block";
            section = state.nav as type_dashboard_sections;
        }

        // invoke web socket connection to application
        utility.socket.invoke();

        // handle page resize
        window.onresize = utility.resize;
    }
};

export default dashboard;