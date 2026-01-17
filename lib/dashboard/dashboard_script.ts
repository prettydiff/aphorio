
import core from "../browser/core.ts";
import Chart from "chart.js/auto";
// @ts-expect-error - TypeScript claims xterm has no default export, but this is how the documentation says to use it.
import Terminal from "@xterm/xterm";

// cspell: words bootable, PGID, PUID, serv, TLSA

const ui = function ui():void {
    const dashboard:dashboard = {
        execute: function dashboard_execute():void {
            // eslint-disable-next-line max-params
            window.onerror = function dashboard_execute_windowError(message:Event|string, source:string, lineno:number, colno:number, error:Error):void {
                if (dashboard.sections["application-logs"] !== undefined) {
                    dashboard.sections["application-logs"].receive({
                        data: {
                            error: error,
                            message: `JavaScript UI error in browser on line ${lineno} and column ${colno} in ${source}. ${message.toString()}`,
                            section: "dashboard",
                            status: "error",
                            time: Date.now()
                        },
                        service: "dashboard-log"
                    });
                }
            };
            const navButtons:HTMLCollectionOf<HTMLElement> = document.getElementsByTagName("nav")[0].getElementsByTagName("button"),
                navigation = function dashboard_execute_navigation(event:MouseEvent):void {
                    const target:HTMLElement = event.target;
                    let index:number = sections.length;
                    dashboard.global.section = target.dataset.section as type_dashboard_sections;
                    if (document.getElementById(dashboard.global.section) === null) {
                        dashboard.global.section = "servers-web";
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
                    document.getElementById(dashboard.global.section).style.display = "block";
                    dashboard.global.state.nav = dashboard.global.section;
                    if (dashboard.sections["terminal"] !== undefined) {
                        dashboard.sections["terminal"].events.resize();
                    }
                    dashboard.utility.setState();
                    target.setAttribute("class", "nav-focus");
                },
                // dynamically discover navigation and assign navigation event handler
                sections:string[] = (function dashboard_execute_sections():string[] {
                    const output:string[] = [];
                    let index:number = navButtons.length;
                    do {
                        index = index - 1;
                        output.push(navButtons[index].dataset.section);
                        navButtons[index].onclick = navigation;
                    } while (index > 0);
                    return output;
                }()),
                definitions = function dashboard_execute_definitions(event:MouseEvent):void {
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
                table_keys:string[] = (dashboard.global.state.tables === undefined || dashboard.global.state.tables === null)
                    ? []
                    : Object.keys(dashboard.global.state.tables);
            let index:number = table_keys.length,
                button:HTMLElement = null,
                table_key:string[] = null,
                table:HTMLElement = null;
            dashboard.socket = core({
                close: function dashboard_execute_socketClose():void {
                    const status:HTMLElement = document.getElementById("connection-status");
                    if (dashboard.sections["application-logs"] !== undefined && status !== null && status.getAttribute("class") === "connection-online") {
                        dashboard.sections["application-logs"].receive({
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
                    dashboard.socket.connected = false;
                    dashboard.utility.baseline();
                    setTimeout(function dashboard_execute_socketClose_delay():void {
                        dashboard.socket.invoke();
                    }, 10000);
                },
                message: function dashboard_execute_socketMessage(event:websocket_event):void {
                    if (typeof event.data === "string") {
                        const message_item:socket_data = JSON.parse(event.data),
                            service_map:map_messages = {
                                // "test-browser": testBrowser,
                                "dashboard-compose": (dashboard.sections["compose-containers"] === undefined)
                                    ? null
                                    : dashboard.sections["compose-containers"].receive,
                                "dashboard-dns": (dashboard.sections["dns-query"] === undefined)
                                    ? null
                                    : dashboard.sections["dns-query"].receive,
                                "dashboard-fileSystem": (dashboard.sections["file-system"] === undefined)
                                    ? null
                                    : dashboard.sections["file-system"].receive,
                                "dashboard-hash": (dashboard.sections["hash"] === undefined)
                                    ? null
                                    : dashboard.sections["hash"].receive,
                                "dashboard-log": (dashboard.sections["application-logs"] === undefined)
                                    ? null
                                    : dashboard.sections["application-logs"].receive,
                                "dashboard-os-devs": (dashboard.sections["devices"] === undefined)
                                    ? null
                                    : dashboard.sections["devices"].receive,
                                "dashboard-os-disk": (dashboard.sections["disks"] === undefined)
                                    ? null
                                    : dashboard.sections["disks"].receive,
                                "dashboard-os-intr": (dashboard.sections["interfaces"] === undefined)
                                    ? null
                                    : dashboard.sections["interfaces"].receive,
                                "dashboard-os-main": (dashboard.sections["os-machine"] === undefined)
                                    ? null
                                    : dashboard.sections["os-machine"].receive,
                                "dashboard-os-proc": (dashboard.sections["processes"] === undefined)
                                    ? null
                                    : dashboard.sections["processes"].receive,
                                "dashboard-os-serv": (dashboard.sections["services"] === undefined)
                                    ? null
                                    : dashboard.sections["services"].receive,
                                "dashboard-os-sock": (dashboard.sections["sockets-os"] === undefined)
                                    ? null
                                    : dashboard.sections["sockets-os"].receive,
                                "dashboard-os-user": (dashboard.sections["users"] === undefined)
                                    ? null
                                    : dashboard.sections["users"].receive,
                                "dashboard-server": (dashboard.sections["servers-web"] === undefined)
                                    ? (dashboard.sections["ports-application"] === undefined)
                                        ? null
                                        : dashboard.sections["ports-application"].receive
                                    : dashboard.sections["servers-web"].receive,
                                "dashboard-socket-application": (dashboard.sections["sockets-application"] === undefined)
                                    ? null
                                    : dashboard.sections["sockets-application"].receive,
                                "dashboard-status-clock": dashboard.utility.clock,
                                "dashboard-statistics-data": (dashboard.sections["statistics"] === undefined)
                                    ? null
                                    : dashboard.sections["statistics"].receive,
                                "dashboard-http": (dashboard.sections["test-http"] === undefined)
                                    ? null
                                    : dashboard.sections["test-http"].receive,
                                "dashboard-websocket-message": (dashboard.sections["test-websocket"] === undefined)
                                    ? null
                                    : dashboard.sections["test-websocket"].transmit.message_receive,
                                "dashboard-websocket-status": (dashboard.sections["test-websocket"] === undefined)
                                    ? null
                                    : dashboard.sections["test-websocket"].transmit.status
                            };
                        if (message_item.service === "dashboard-os-all") {
                            const data:core_server_os = message_item.data as core_server_os;
                            if (dashboard.sections["devices"] !== undefined) {
                                dashboard.tables.populate(dashboard.sections["devices"], data.devs);
                            }
                            if (dashboard.sections["disks"] !== undefined) {
                                dashboard.sections["disks"].receive({
                                    data: data.disk,
                                    service: "dashboard-os-disk"
                                });
                            }
                            if (dashboard.sections["interfaces"] !== undefined) {
                                dashboard.sections["interfaces"].receive({
                                    data: data.intr,
                                    service: "dashboard-os-intr"
                                });
                            }
                            if (dashboard.sections["os-machine"] !== undefined) {
                                dashboard.sections["os-machine"].receive({
                                    data: data,
                                    service: "dashboard-os-main"
                                });
                            }
                            if (dashboard.sections["processes"] !== undefined) {
                                dashboard.tables.populate(dashboard.sections["processes"], data.proc);
                            }
                            if (dashboard.sections["services"] !== undefined) {
                                dashboard.tables.populate(dashboard.sections["services"], data.serv);
                            }
                            if (dashboard.sections["sockets-os"] !== undefined) {
                                dashboard.tables.populate(dashboard.sections["sockets-os"], data.sock);
                            }
                            if (dashboard.sections["users"] !== undefined) {
                                dashboard.tables.populate(dashboard.sections["users"], data.user);
                            }
                        } else if (service_map[message_item.service] !== null) {
                            service_map[message_item.service](message_item);
                        }
                    }
                },
                open: function dashboard_execute_socketOpen(event:Event):void {
                    const target:WebSocket = event.target as WebSocket,
                        status:HTMLElement = document.getElementById("connection-status"),
                        title:HTMLElement = document.getElementsByTagName("h1")[0],
                        version:HTMLElement = document.createElement("span");
                    dashboard.socket.connected = true;
                    if (status !== null ) {
                        status.getElementsByTagName("strong")[0].textContent = "Online";
                        status.setAttribute("class", "connection-online");
                    }
                    
                    dashboard.socket.socket = target;
                    if (dashboard.socket.queueStore.length > 0) {
                        do {
                            dashboard.socket.socket.send(dashboard.socket.queueStore[0]);
                            dashboard.socket.queueStore.splice(0, 1);
                        } while (dashboard.socket.queueStore.length > 0);
                    }
                    if (dashboard.global.loaded === false) {
                        const init = function dashboard_execute_init(section_name:type_dashboard_init):void {
                            if (dashboard.sections[section_name] !== undefined) {
                                dashboard.sections[section_name].init();
                            }
                        };
                        dashboard.global.loaded = true;
                        if (dashboard.sections["application-logs"] !== undefined) {
                            // populate log data
                            let index:number = dashboard.global.payload.logs.length;
                            if (index > 0) {
                                do {
                                    index = index - 1;
                                    dashboard.sections["application-logs"].receive({
                                        data: dashboard.global.payload.logs[index],
                                        service: "dashboard-log"
                                    });
                                } while (index > 0);
                            }
                            dashboard.sections["application-logs"].receive({
                                data: {
                                    error: null,
                                    message: "Dashboard browser connection online.",
                                    section: "dashboard",
                                    status: "informational",
                                    time: Date.now()
                                },
                                service: "dashboard-log"
                            });
                        }
                        init("application-logs");
                        init("compose-containers");
                        dashboard.tables.init(dashboard.sections["devices"]);
                        init("disks");
                        init("dns-query");
                        init("file-system");
                        init("hash");
                        init("interfaces");
                        init("os-machine");
                        dashboard.tables.init(dashboard.sections["ports-application"]);
                        dashboard.tables.init(dashboard.sections["processes"]);
                        if (dashboard.sections["servers-web"] !== undefined) {
                            dashboard.sections["servers-web"].init();
                        } else if (dashboard.sections["ports-application"] !== undefined) {
                            dashboard.sections["ports-application"].receive();
                        }
                        dashboard.tables.init(dashboard.sections["services"]);
                        dashboard.tables.init(dashboard.sections["sockets-application"]);
                        dashboard.tables.init(dashboard.sections["sockets-os"]);
                        init("statistics");
                        init("terminal");
                        init("test-http");
                        init("test-websocket");
                        dashboard.tables.init(dashboard.sections["users"]);
                        dashboard.utility.nodes.main.style.display = "block";
                        dashboard.utility.nodes.load.textContent = `${Math.round(performance.getEntries()[0].duration * 10000) / 1e7} seconds`;
                        version.textContent = `version ${dashboard.global.payload.version}`;
                        title.appendChild(version);
                    }
                },
                type: "dashboard"
            });

            // restore state of table filter controls
            if (dashboard.global.state.table_os === undefined || dashboard.global.state.table_os === null) {
                dashboard.global.state.table_os = {};
            }

            // restore table sorting direction and column
            if (index > 0) {
                do {
                    index = index - 1;
                    table_key = [table_keys[index].slice(0, table_keys[index].lastIndexOf("-")), table_keys[index].slice(table_keys[index].lastIndexOf("-") + 1)];
                    table = document.getElementById(table_key[0]).getElementsByTagName("table")[Number(table_key[1])];
                    if (table !== undefined) {
                        table.setAttribute("data-column", String(dashboard.global.state.tables[table_keys[index]].col));
                        table.getElementsByTagName("thead")[0].getElementsByTagName("th")[dashboard.global.state.tables[table_keys[index]].col].getElementsByTagName("button")[0].setAttribute("data-dir", String(dashboard.global.state.tables[table_keys[index]].dir));
                    }
                } while (index > 0);
            }

            // table header sort buttons
            index = th.length;
            if (index > 0) {
                do {
                    index = index - 1;
                    button = th[index].getElementsByTagName("button")[0];
                    if (button !== undefined) {
                        button.onclick = dashboard.tables.sort;
                    }
                } while (index > 0);
            }

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
            if (dashboard.global.state.nav !== "servers-web" && document.getElementById(dashboard.global.state.nav) !== null) {
                index = navButtons.length;
                do {
                    index = index - 1;
                    if (navButtons[index].dataset.section === dashboard.global.state.nav) {
                        navButtons[index].setAttribute("class", "nav-focus");
                    } else {
                        navButtons[index].removeAttribute("class");
                    }
                } while (index > 0);
                if (dashboard.sections["servers-web"] !== undefined) {
                    document.getElementById("servers-web").style.display = "none";
                }
                document.getElementById(dashboard.global.state.nav).style.display = "block";
                dashboard.global.section = dashboard.global.state.nav as type_dashboard_sections;
            } else if (document.getElementById(dashboard.global.state.nav) === null) {
                navButtons[0].setAttribute("class", "nav-focus");
                document.getElementById(navButtons[0].dataset.section).style.display = "block";
            }

            // invoke web socket connection to application
            dashboard.socket.invoke();

            // handle page resize
            window.onresize = dashboard.utility.resize;
            // @ts-expect-error - I am not extending the global window object type for this troubleshooting helper
            window.show_payload = function dashboard_execute_showPayload():[string, transmit_dashboard] {
                return [
                    JSON.stringify(dashboard.global.payload).length.commas(),
                    dashboard.global.payload
                ];
            };
        },
        global: {
            loaded: false,
            payload: null,
            section: "servers-web",
            state: (function dashboard_state():state_store {
                const local:string = (typeof localStorage === "undefined")
                        ? undefined
                        : localStorage.state,
                    item:state_store = (local === undefined || local === null || local === "")
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
                            nav: "servers-web",
                            table_os: {},
                            tables: {},
                            terminal: ""
                        }
                        : JSON.parse(local);
                return item;
            }())
        },
        sections: {
            // application-logs start
            "application-logs": {
                events: {
                    resize: function dashboard_sections_applicationLog_resize():void {
                        const output_height:number = window.innerHeight - 50;
                        dashboard.sections["application-logs"].nodes.list.style.height = `${output_height / 10}em`;
                    }
                },
                init: function dashboard_sections_applicationLog_init():void {
                    dashboard.sections["application-logs"].events.resize();
                },
                nodes: {
                    list: document.getElementById("application-logs").getElementsByTagName("ul")[0]
                },
                receive: function dashboard_sections_applicationLog_receive(socket_data:socket_data):void {
                    const item:config_log = socket_data.data as config_log,
                        li:HTMLElement = document.createElement("li"),
                        timeElement:HTMLElement = document.createElement("time"),
                        strong:HTMLElement = document.createElement("strong"),
                        code:HTMLElement = document.createElement("code"),
                        time:string = `[${item.time.dateTime(true, null)}]`,
                        p:HTMLElement = document.createElement("p");
                    timeElement.appendText(time);
                    strong.textContent = item.section;
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
                    if (dashboard.sections["application-logs"].nodes.list.childNodes.length > dashboard.global.payload.logs_max) {
                        dashboard.sections["application-logs"].nodes.list.removeChild(dashboard.sections["application-logs"].nodes.list.lastChild);
                    }
                    dashboard.sections["application-logs"].nodes.list.insertBefore(li, dashboard.sections["application-logs"].nodes.list.firstChild);
                },
                tools: null
            },
            // application-logs end
            // compose-containers start
            "compose-containers": {
                events: {
                    cancel_variable: function dashboard_sections_composeContainers_cancelVariable(event:MouseEvent):void {
                        const target:HTMLElement = event.target as HTMLElement,
                            ancestor:HTMLElement = target.getAncestor("div", "tag"),
                            section:HTMLElement = ancestor.getAncestor("section", "class"),
                            edit:HTMLElement = section.getElementsByClassName("edit")[0] as HTMLElement;
                        edit.parentNode.removeChild(edit);
                        dashboard.sections["compose-containers"].nodes.list_variables.style.display = "block";
                        dashboard.sections["compose-containers"].nodes.new_variable.disabled = false;
                    },
                    edit_variable: function dashboard_sections_composeContainers_editVariable():void {
                        const p:HTMLElement = document.createElement("p"),
                            buttons:HTMLElement = document.createElement("p"),
                            label:HTMLElement = document.createElement("label"),
                            edit:HTMLElement = document.createElement("div"),
                            ul:HTMLElement = document.createElement("ul"),
                            textArea:HTMLTextAreaElement = document.createElement("textarea"),
                            keys:string[] = Object.keys(dashboard.global.payload.compose.variables).sort(),
                            output:string[] = [],
                            len:number = keys.length,
                            cancel:HTMLElement = document.createElement("button"),
                            save:HTMLElement = document.createElement("button");
                        let index:number = 0;
                        edit.setAttribute("class", "edit");
                        if (len > 0) {
                            do {
                                output.push(`"${keys[index]}": "${dashboard.global.payload.compose.variables[keys[index]]}"`);
                                index = index + 1;
                            } while (index < len);
                            textArea.value = `{\n    ${output.join(",\n    ")}\n}`;
                        }
                        ul.setAttribute("class", "edit-summary");
                        cancel.appendText("⚠ Cancel");
                        cancel.setAttribute("class", "server-cancel");
                        cancel.onclick = dashboard.sections["compose-containers"].events.cancel_variable;
                        buttons.appendChild(cancel);
                        save.appendText("🖪 Modify");
                        save.setAttribute("class", "server-modify");
                        save.onclick = dashboard.sections["compose-containers"].events.message_variable;
                        buttons.appendChild(save);
                        textArea.setAttribute("class", "compose-variables-edit");
                        dashboard.sections["compose-containers"].nodes.list_variables.style.display = "none";
                        label.appendText("Docker Compose Variables");
                        label.appendChild(textArea);
                        p.setAttribute("class", "compose-edit");
                        p.appendChild(label);
                        buttons.setAttribute("class", "buttons");
                        edit.appendChild(p);
                        edit.appendChild(ul);
                        edit.appendChild(buttons);
                        dashboard.sections["compose-containers"].nodes.list_variables.parentNode.appendChild(edit);
                        dashboard.sections["compose-containers"].nodes.new_variable.disabled = true;
                        textArea.onkeyup = dashboard.sections["compose-containers"].events.validate_variables;
                        textArea.onfocus = dashboard.sections["compose-containers"].events.validate_variables;
                        textArea.focus();
                    },
                    message_container: function dashboard_sections_composeContainers_messageContainer(event:MouseEvent):void {
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
                                    : dashboard.global.payload.compose.containers[id].location
                            };
                        dashboard.utility.message_send(message, "dashboard-compose-container");
                        dashboard.sections["compose-containers"].nodes.new_container.disabled = false;
                        if (cancel === undefined) {
                            edit.parentNode.getElementsByTagName("button")[0].click();
                        } else {
                            dashboard.shared_services.cancel(event);
                        }
                    },
                    message_variable: function dashboard_sections_composeContainers_messageVariable(event:MouseEvent):void {
                        const target:HTMLElement = event.target,
                            edit:HTMLElement = target.getAncestor("edit", "class"),
                            cancel:HTMLButtonElement = edit.getElementsByClassName("server-cancel")[0] as HTMLButtonElement,
                            value:string = edit.getElementsByTagName("textarea")[0].value,
                            variables:store_string = JSON.parse(value);
                        dashboard.utility.message_send(variables, "dashboard-compose-variables");
                        dashboard.sections["compose-containers"].nodes.new_variable.disabled = false;
                        if (cancel === undefined) {
                            edit.parentNode.getElementsByTagName("button")[0].click();
                        } else {
                            dashboard.shared_services.cancel(event);
                        }
                    },
                    update: function dashboard_sections_composeContainers_update():void {
                        const message:services_compose_container = {
                            action: "update",
                            compose: "",
                            id: "",
                            location: ""
                        };
                        dashboard.utility.message_send(message, "dashboard-compose-container");
                    },
                    validate_containers: function dashboard_sections_composeContainers_validateContainers(event:FocusEvent|KeyboardEvent):void {
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
                        if (valid === true && id !== undefined && dashboard.global.payload.compose.containers[id].compose === value) {
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
                    validate_variables: function dashboard_sections_composeContainers_validateVariables(event:FocusEvent|KeyboardEvent):void {
                        const target:HTMLTextAreaElement = event.target as HTMLTextAreaElement,
                            value:string = target.value,
                            section:HTMLElement = target.getAncestor("section", "class"),
                            edit:HTMLElement = section.getElementsByClassName("edit")[0] as HTMLElement,
                            modify:HTMLButtonElement = section.getElementsByClassName("server-modify")[0] as HTMLButtonElement,
                            ul:HTMLElement = edit.getElementsByTagName("ul")[0],
                            text = function dashboard_sections_composeContainers_validateVariables_text(message:string, pass:boolean):void {
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
                            sort = function dashboard_sections_composeContainers_validateVariables_sort(object:store_string):string {
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
                            if (sort(variables) === sort(dashboard.global.payload.compose.variables)) {
                                text("Value is valid JSON, but is not modified.", false);
                            } else {
                                text("Input is valid JSON format.", true);
                            }
                        }
                    }
                },
                init: function dashboard_sections_composeContainers_init():void {
                    if (dashboard.global.payload.compose.status === "") {
                        dashboard.sections["compose-containers"].nodes.new_container.onclick = dashboard.shared_services.create;
                        dashboard.sections["compose-containers"].nodes.new_variable.onclick = dashboard.sections["compose-containers"].events.edit_variable;
                        dashboard.sections["compose-containers"].nodes.update_button.onclick = dashboard.sections["compose-containers"].events.update;
                        dashboard.sections["compose-containers"].nodes.update_time.onclick = null;
                        dashboard.sections["compose-containers"].receive({
                            data: dashboard.global.payload.compose,
                            service: "dashboard-compose"
                        });
                    } else {
                        const strong:HTMLElement = document.createElement("strong");
                        strong.textContent = "Error: ";
                        dashboard.sections["compose-containers"].nodes.body.style.display = "none";
                        dashboard.sections["compose-containers"].nodes.status.appendChild(strong);
                        dashboard.sections["compose-containers"].nodes.status.appendText(dashboard.global.payload.compose.status);
                        dashboard.sections["compose-containers"].nodes.status.style.display = "block";
                    }
                },
                nodes: {
                    body: document.getElementById("compose-containers").getElementsByClassName("compose-body")[0] as HTMLElement,
                    list: document.getElementById("compose-containers").getElementsByClassName("compose-container-list")[0] as HTMLElement,
                    list_variables: document.getElementById("compose-containers").getElementsByClassName("compose-variable-list")[0] as HTMLElement,
                    new_container: document.getElementById("compose-containers").getElementsByClassName("compose-container-new")[0] as HTMLButtonElement,
                    new_variable: document.getElementById("compose-containers").getElementsByClassName("compose-variable-new")[0] as HTMLButtonElement,
                    status: document.getElementById("compose-containers").getElementsByClassName("status")[0] as HTMLElement,
                    update_button: document.getElementById("compose-containers").getElementsByClassName("update-button")[0].getElementsByTagName("button")[0],
                    update_containers: document.getElementById("compose-containers").getElementsByClassName("section")[0].getElementsByTagName("em")[0],
                    update_time: document.getElementById("compose-containers").getElementsByClassName("section")[0].getElementsByTagName("time")[0],
                    update_variables: document.getElementById("compose-containers").getElementsByClassName("section")[0].getElementsByTagName("em")[1]
                },
                receive: function dashboard_sections_composeContainers_receive(socket_data:socket_data):void {
                    const data:core_compose = socket_data.data as core_compose,
                        list:string[] = (data.containers === null)
                            ? []
                            : Object.keys(data.containers).sort(function dashboard_sections_composeContainers_receive_keys(a:string, b:string):-1|1 {
                                const nameA:string = (a.includes(".y") === true)
                                        ? a.split(dashboard.global.payload.path.sep).pop()
                                        : data.containers[a].name,
                                    nameB:string = (b.includes(".y") === true)
                                        ? b.split(dashboard.global.payload.path.sep).pop()
                                        : data.containers[b].name;
                                if (nameA < nameB) {
                                    return -1;
                                }
                                return 1;
                            }),
                        variables:string[] = (data.variables === null)
                            ? []
                            : Object.keys(data.variables).sort(),
                        list_containers:HTMLElement = dashboard.sections["compose-containers"].nodes.list,
                        list_variables:HTMLElement = dashboard.sections["compose-containers"].nodes.list_variables,
                        len_containers:number = list.length,
                        len_variables:number = variables.length;
                    let li:HTMLElement = null,
                        index:number = 0;
                    if (data.containers !== null) {
                        list_containers.textContent = "";
                        dashboard.global.payload.compose.containers = data.containers;
                        if (len_containers > 0) {
                            do {
                                if (data.containers[list[index]] !== undefined) {
                                    li = dashboard.shared_services.title(list[index], "container");
                                    li.setAttribute("data-id", data.containers[list[index]].id);
                                    list_containers.appendChild(li);
                                }
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
                        dashboard.global.payload.compose.variables = data.variables;
                        if (len_variables > 0) {
                            let span:HTMLElement = null,
                                strong:HTMLElement = null;
                            do {
                                li = document.createElement("li");
                                strong = document.createElement("strong");
                                span = document.createElement("span");
                                strong.appendText(variables[index]);
                                span.appendText(dashboard.global.payload.compose.variables[variables[index]]);
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
                    dashboard.sections["compose-containers"].nodes.update_containers.textContent = len_containers.toString();
                    dashboard.sections["compose-containers"].nodes.update_variables.textContent = len_variables.toString();
                    dashboard.sections["compose-containers"].nodes.update_time.textContent = data.time.dateTime(true, dashboard.global.payload.timeZone_offset);
                    if (dashboard.sections["ports-application"] !== undefined) {
                        dashboard.sections["ports-application"].receive();
                    }
                },
                tools: {
                    descriptions: function dashboard_sections_composeContainers_description(id:boolean|string):HTMLElement {
                        const div:HTMLElement = document.createElement("div"),
                            p:HTMLElement = document.createElement("p"),
                            portHeading:HTMLElement = document.createElement("strong"),
                            portList:HTMLElement = document.createElement("ul"),
                            container:core_compose_container = dashboard.global.payload.compose.containers[id as string],
                            ports:type_docker_ports = container.ports,
                            len:number = ports.length,
                            ul:HTMLElement = document.createElement("ul"),
                            properties = function dashboard_sections_composeContainers_description_properties(name:string, value:string):void {
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
                        if (container !== undefined) {
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
                            properties("Created On", container.created.dateTime(true, dashboard.global.payload.timeZone_offset));
                            properties("Config Location", container.location);
                            properties("Description", container.description);
                            properties("ID", container.id);
                            properties("Image", container.image);
                            properties("License", container.license);
                            properties("State", container.state);
                            properties("Status", container.status);
                            properties("Version", container.version);
                            div.appendChild(ul);
                        }
                        return div;
                    }
                }
            },
            // compose-containers end
            // devices start
            "devices": {
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
                receive: null,
                row: function dashboard_sections_devices_row(record_item:type_lists, tr:HTMLElement):void {
                    const record:os_devs = record_item as os_devs;
                    dashboard.tables.cell(tr, record.name, null);
                    dashboard.tables.cell(tr, record.type, null);
                    dashboard.tables.cell(tr, record.kernel_module, null);
                },
                sort_name: ["type", "name", "kernel_module"]
            },
            // devices end
            // disks start
            "disks": {
                events: null,
                init: function dashboard_sections_disks_init():void {
                    dashboard.sections["disks"].nodes.update_button.onclick = dashboard.tables.update;
                    dashboard.sections["disks"].receive({
                        data: dashboard.global.payload.os.disk,
                        service: "dashboard-os-disk"
                    });
                    dashboard.sections["disks"].nodes.update_button.setAttribute("data-list", "disk");
                },
                nodes: {
                    count: document.getElementById("disks").getElementsByClassName("table-stats")[0].getElementsByTagName("em")[0],
                    list: document.getElementById("disks").getElementsByClassName("item-list")[0] as HTMLElement,
                    update_button: document.getElementById("disks").getElementsByClassName("table-stats")[0].getElementsByTagName("button")[0],
                    update_text: document.getElementById("disks").getElementsByClassName("table-stats")[0].getElementsByTagName("time")[0]
                },
                receive: function dashboard_sections_disks_receive(socket_data:socket_data):void {
                    const item:services_os_disk = socket_data.data as services_os_disk,
                        output_new:HTMLElement = dashboard.sections["disks"].nodes.list,
                        len:number = item.data.length,
                        data_item = function dashboard_sections_disks_receive_dataItem(ul:HTMLElement, disk:os_disk_partition[]|string, key:"active"|"bootable"|"bus"|"file_system"|"guid"|"hidden"|"id"|"name"|"partitions"|"path"|"read_only"|"serial"|"size_disk"|"size_free"|"size_total"|"size_used"|"type"):void {
                            const li:HTMLElement = document.createElement("li"),
                                len:number = (key === "partitions")
                                    ? item.data[index].partitions.length
                                    : 0,
                                strong:HTMLElement = (key === "partitions" && len > 0)
                                    ? document.createElement("h6")
                                    : document.createElement("strong"),
                                span:HTMLElement = document.createElement("span");
                            strong.textContent = key.capitalize().replace(/_\w/, function dashboard_sections_disks_receive_dataItem_cap(input:string):string {
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
                                    if (item.data[index].partitions[pIndex] !== undefined) {
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
                                    }
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
                    output_new.textContent = "";
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
                    dashboard.sections["disks"].nodes.count.textContent = String(len);
                    dashboard.sections["disks"].nodes.update_text.textContent = item.time.dateTime(true, dashboard.global.payload.timeZone_offset);
                },
                tools: null
            },
            // disks end
            // dns-query start
            "dns-query": {
                events: {
                    directionEvent: function dashboard_sections_dnsQuery_directionEvent(event:MouseEvent):void {
                        dashboard.sections["dns-query"].tools.direction(event.target === dashboard.sections["dns-query"].nodes.reverse);
                    },
                    query: function dashboard_sections_dnsQuery_query(event:KeyboardEvent|MouseEvent):void {
                        const target:HTMLElement = event.target,
                            key:KeyboardEvent = event as KeyboardEvent;
                        if (target === dashboard.sections["dns-query"].nodes.query || (target !== dashboard.sections["dns-query"].nodes.query && key.key === "Enter")) {
                            const hosts_values:string[] = dashboard.sections["dns-query"].nodes.hosts.value.replace(/,\s+/g, ",").split(","),
                                types_value:string = dashboard.sections["dns-query"].nodes.types.value,
                                payload:services_dns_input = {
                                    names: hosts_values,
                                    reverse: dashboard.sections["dns-query"].nodes.reverse.checked,
                                    types: types_value
                                };
                            dashboard.utility.setState();
                            dashboard.utility.message_send(payload, "dashboard-dns");
                            dashboard.sections["dns-query"].nodes.output.value = "";
                        }
                    }
                },
                init: function dashboard_sections_dnsQuery_init():void {
                    dashboard.sections["dns-query"].nodes.query.onclick = dashboard.sections["dns-query"].events.query;
                    dashboard.sections["dns-query"].nodes.output.value = "";
                    dashboard.sections["dns-query"].nodes.lookup.checked = true;
                    if (dashboard.global.state.dns !== undefined && dashboard.global.state.dns !== null) {
                        dashboard.sections["dns-query"].nodes.reverse.checked = dashboard.global.state.dns.reverse;
                        dashboard.sections["dns-query"].nodes.hosts.value = dashboard.global.state.dns.hosts;
                        dashboard.sections["dns-query"].nodes.types.value = dashboard.global.state.dns.types;
                    }
                    dashboard.sections["dns-query"].nodes.hosts.onkeyup = dashboard.sections["dns-query"].events.query;
                    dashboard.sections["dns-query"].nodes.types.onkeyup = dashboard.sections["dns-query"].events.query;
                    dashboard.sections["dns-query"].nodes.lookup.onclick = dashboard.sections["dns-query"].events.directionEvent;
                    dashboard.sections["dns-query"].nodes.reverse.onclick = dashboard.sections["dns-query"].events.directionEvent;
                    dashboard.sections["dns-query"].tools.direction(dashboard.global.state.dns.reverse);
                },
                nodes: {
                    hosts: document.getElementById("dns-query").getElementsByTagName("input")[2],
                    lookup: document.getElementById("dns-query").getElementsByTagName("input")[0],
                    output: document.getElementById("dns-query").getElementsByTagName("textarea")[0],
                    query: document.getElementById("dns-query").getElementsByTagName("button")[1],
                    reverse: document.getElementById("dns-query").getElementsByTagName("input")[1],
                    types: document.getElementById("dns-query").getElementsByTagName("input")[3]
                },
                receive: function dashboard_sections_dnsQuery_receive(data_item:socket_data):void {
                    const reverse:services_dns_reverse = data_item.data as services_dns_reverse;
                    if (reverse.reverse === true) {
                        const keys:string[] = Object.keys(reverse.hostnames),
                            len:number = keys.length;
                        if (len > 0) {
                            const output_value:string[] = ["{"];
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
                                    output_value.push(`    "${keys[index_host]}": []${comma_host}`);
                                } else if (len_address === 1) {
                                    output_value.push(`    "${keys[index_host]}": ["${reverse.hostnames[keys[index_host]][0]}"]${comma_host}`);
                                } else {
                                    index_address = 0;
                                    output_value.push(`    "${keys[index_host]}": [`);
                                    do {
                                        comma_address = (index_address < len_address - 1)
                                            ? ","
                                            : "";
                                        output_value.push(`        "${reverse.hostnames[keys[index_host]][index_address]}"${comma_address}`);
                                        index_address = index_address + 1;
                                    } while (index_address < len_address);
                                    output_value.push(`    ]${comma_host}`);
                                }
                                index_host = index_host + 1;
                            } while (index_host < len);
                            output_value.push("}");
                            dashboard.sections["dns-query"].nodes.output.value = output_value.join("\n");
                        } else {
                            dashboard.sections["dns-query"].nodes.output.value = "{}";
                        }
                    } else {
                        const result:services_dns_output = data_item.data as services_dns_output,
                            hosts:string[] = Object.keys(result),
                            len_hosts:number = hosts.length;
                        if (len_hosts > 0) {
                            const output_value:string[] = ["{"],
                                sort = function dashboard_sections_dnsQuery_receive_sort(a:string, b:string):-1|1 {
                                    if (a < b) {
                                        return -1;
                                    }
                                    return 1;
                                },
                                types:type_dns_types[] = Object.keys(result[hosts[0]]) as type_dns_types[],
                                len_types:number = types.length,
                                get_max = function dashboard_sections_dnsQuery_receive_getMax(input:string[]):number {
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
                                pad = function dashboard_sections_dnsQuery_receive_pad(input:string, max:number):string {
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
                                object = function dashboard_sections_dnsQuery_receive_object(object:node_dns_soaRecord, soa:boolean):void {
                                    const indent:string = (soa === true)
                                            ? ""
                                            : "    ",
                                        obj:string[] = Object.keys(object),
                                        len_obj:number = obj.length,
                                        max_obj:number = get_max(obj);
                                    let index_obj:number = 0;
                                    obj.sort();
                                    if (soa === true) {
                                        output_value.push(`        ${pad("SOA", max_type)}: {`);
                                    } else {
                                        output_value.push("            {");
                                    }
                                    do {
                                        if (isNaN(Number(object[obj[index_obj] as "hostmaster"])) === true) {
                                            output_value.push(`            ${indent + pad(obj[index_obj], max_obj)}: "${object[obj[index_obj] as "hostmaster"]}",`);
                                        } else {
                                            output_value.push(`            ${indent + pad(obj[index_obj], max_obj)}: ${object[obj[index_obj] as "hostmaster"]},`);
                                        }
                                        index_obj = index_obj + 1;
                                    } while (index_obj < len_obj);
                                    output_value[output_value.length - 1] = output_value[output_value.length - 1].slice(0, output_value[output_value.length - 1].length - 1);
                                    output_value.push(`${indent}        },`);
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
                                output_value.push(`    "${hosts[index_hosts]}": {`);
                                index_types = 0;
                                // loop through type names on each hostname
                                do {
                                    // SOA object
                                    if (types[index_types] === "SOA" && Array.isArray(result[hosts[index_hosts]].SOA) === false) {
                                        object(result[hosts[index_hosts]].SOA as node_dns_soaRecord, true);
                                    // array of objects
                                    } else if ((types[index_types] === "CAA" || types[index_types] === "MX" || types[index_types] === "NAPTR" || types[index_types] === "SRV" || types[index_types] === "TLSA")) {
                                        record_object = result[hosts[index_hosts]][types[index_types]] as node_dns_soaRecord[];
                                        len_object = record_object.length;
                                        if (len_object < 1) {
                                            output_value.push(`        ${pad(types[index_types], max_type)}: [],`);
                                        } else if (typeof record_object[0] === "string") {
                                            output_value.push(`        ${pad(types[index_types], max_type)}: ["${record_object[0]}"],`);
                                        } else {
                                            output_value.push(`        ${pad(types[index_types], max_type)}: [`);
                                            index_object = 0;
                                            if (len_object > 0) {
                                                // loop through keys of each child object of an array
                                                do {
                                                    object(record_object[index_object] as node_dns_soaRecord, false);
                                                    index_object = index_object + 1;
                                                } while (index_object < len_object);
                                                output_value[output_value.length - 1] = output_value[output_value.length - 1].slice(0, output_value[output_value.length - 1].length - 1);
                                            }
                                            output_value.push("        ],");
                                        }
                                    // string[][]
                                    } else if (types[index_types] === "TXT") {
                                        record_strings = result[hosts[index_hosts]].TXT as string[][];
                                        len_object = record_strings.length;
                                        if (len_object < 1) {
                                            output_value.push(`        ${pad(types[index_types], max_type)}: [],`);
                                        } else if (Array.isArray(record_strings[0]) === false) {
                                            output_value.push(`        ${pad(types[index_types], max_type)}: ["${record_strings.join("")}"],`);
                                        } else {
                                            output_value.push(`        ${pad(types[index_types], max_type)}: [`);
                                            index_object = 0;
                                            // loop through string array of a parent array
                                            do {
                                                output_value.push(`            ["${record_strings[index_object].join("\", \"")}"],`);
                                                index_object = index_object + 1;
                                            } while (index_object < len_object);
                                            output_value[output_value.length - 1] = output_value[output_value.length - 1].slice(0, output_value[output_value.length - 1].length - 1);
                                            output_value.push("        ],");
                                        }
                                    // string[]
                                    } else {
                                        record_string = (result[hosts[index_hosts]][types[index_types]] as string[]);
                                        if (record_string.length < 1) {
                                            output_value.push(`        ${pad(types[index_types], max_type)}: [],`);
                                        } else {
                                            output_value.push(`        ${pad(types[index_types], max_type)}: ["${record_string.join("\", \"")}"],`);
                                        }
                                    }
                                    index_types = index_types + 1;
                                } while (index_types < len_types);
                                output_value[output_value.length - 1] = output_value[output_value.length - 1].slice(0, output_value[output_value.length - 1].length - 1);
                                output_value.push("    },");
                                index_hosts = index_hosts + 1;
                            } while (index_hosts < len_hosts);
                            output_value[output_value.length - 1] = output_value[output_value.length - 1].slice(0, output_value[output_value.length - 1].length - 1);
                            output_value.push("}");
                            dashboard.sections["dns-query"].nodes.output.value = output_value.join("\n");
                        } else {
                            dashboard.sections["dns-query"].nodes.output.value = "{}";
                        }
                    }
                },
                tools: {
                    direction: function dashboard_sections_dnsQuery_direction(reverse:boolean|string):void {
                        const label:Node = dashboard.sections["dns-query"].nodes.hosts.parentNode.firstChild;
                        if (reverse === true) {
                            label.textContent = "Comma separated list of IP addresses ";
                            dashboard.sections["dns-query"].nodes.types.disabled = true;
                        } else {
                            label.textContent = "Comma separated list of domains and/or hostname entries ";
                            dashboard.sections["dns-query"].nodes.types.disabled = false;
                        }
                    }
                }
            },
            // dns-query end
            // file-system start
            "file-system": {
                block: false,
                events: {
                    key: function dashboard_sections_fileSystem_key(event:KeyboardEvent):void {
                        if (event.key.toLowerCase() === "enter") {
                            dashboard.sections["file-system"].events.send(event);
                        }
                    },
                    resize: function dashboard_sections_fileSystem_resize():void {
                        const outer_height:number = (window.innerHeight - 470) / 10;
                        dashboard.sections["file-system"].nodes.output.style.maxHeight = `${outer_height}em`;
                    },
                    send: function dashboard_sections_fileSystem_send(event:FocusEvent|KeyboardEvent):void {
                        const target:HTMLElement = (event === null)
                                ? dashboard.sections["file-system"].nodes.path
                                : event.target,
                            name:string = target.lowName(),
                            address:string = (name === "input")
                                ? dashboard.sections["file-system"].nodes.path.value.replace(/^\s+/, "").replace(/\s+$/, "")
                                : target.dataset.raw,
                            search:string = (name === "input")
                                ? dashboard.sections["file-system"].nodes.search.value.replace(/^\s+/, "").replace(/\s+$/, "")
                                : null,
                            payload:services_fileSystem = {
                                address: address,
                                dirs: null,
                                failures: null,
                                file: null,
                                mime: null,
                                parent: null,
                                search: (search !== null && search.replace(/\s+/, "") === "")
                                    ? null
                                    : search,
                                sep: null
                            };
                        if (dashboard.sections["file-system"].block === false) {
                            dashboard.sections["file-system"].block = true;
                            dashboard.sections["file-system"].time = BigInt(Math.round(performance.now() * 1e6));
                            dashboard.sections["file-system"].nodes.status.textContent = "Fetching\u2026";
                            dashboard.utility.message_send(payload, "dashboard-fileSystem");
                        }
                    }
                },
                init: function dashboard_sections_fileSystem_init():void {
                    const textarea:HTMLTextAreaElement = document.createElement("textarea"),
                        media = function dashboard_sections_fileSystem_init_media(name:"audio"|"video"):void {
                            const parent:HTMLElement = dashboard.sections["file-system"].media[name],
                                media_element:HTMLAudioElement = document.createElement(name),
                                track:HTMLElement = document.createElement("button"),
                                input = function dashboard_sections_fileSystem_init_media_input(classy:string):void {
                                    const label:HTMLElement = document.createElement("label"),
                                        span:HTMLElement = document.createElement("span"),
                                        input:HTMLInputElement = document.createElement("input");
                                    label.setAttribute("class", classy);
                                    input.type = "text";
                                    input.readOnly = true;
                                    span.textContent = (classy === "time-current")
                                        ? "Media current time"
                                        : "Media total time";
                                    label.appendChild(span);
                                    label.appendChild(input);
                                    p.appendChild(label);
                                },
                                control = function dashboard_sections_fileSystem_init_media_control(type:"pause"|"play"|"stop"):void {
                                    const button:HTMLElement = document.createElement("button"),
                                        svg:Element = document.createElementNS("http://www.w3.org/2000/svg", "svg"),
                                        g:Element = document.createElementNS("http://www.w3.org/2000/svg", "g"),
                                        path:Element = document.createElementNS("http://www.w3.org/2000/svg", "path"),
                                        path1:Element = document.createElementNS("http://www.w3.org/2000/svg", "path"),
                                        span:HTMLElement = document.createElement("span");
                                    button.setAttribute("class", type);
                                    if (type === "play") {
                                        path.setAttribute("d", "M85.5,51.7l-69,39.8c-1.3,0.8-3-0.2-3-1.7V10.2c0-1.5,1.7-2.5,3-1.7l69,39.8C86.8,49,86.8,51,85.5,51.7z");
                                        button.onclick = function dashboard_sections_fileSystem_init_media_control_play(event:MouseEvent):void {
                                            const el:HTMLElement = event.target as HTMLElement,
                                                player:HTMLElement = el.getAncestor("div", "tag"),
                                                media:HTMLAudioElement = player.lastChild as HTMLAudioElement,
                                                currentTime = function dashboard_sections_fileSystem_init_media_control_play_time():void {
                                                    const timer:HTMLInputElement = player.getElementsByTagName("input")[0],
                                                        bar:HTMLElement = player.getElementsByClassName("media-slider")[0].getElementsByClassName("progress")[0] as HTMLElement;
                                                    timer.value = dashboard.sections["file-system"].tools.media_time(media.currentTime);
                                                    if (media.currentTime === media.duration) {
                                                        media.playing = false;
                                                    }
                                                    if (media.playing === true) {
                                                        setTimeout(dashboard_sections_fileSystem_init_media_control_play_time, 50);
                                                        bar.style.width = `${(media.currentTime / media.duration) * 100}%`;
                                                    }
                                                };
                                            if (media.playing === true) {
                                                media.currentTime = 0;
                                            }
                                            media.play();
                                            media.playing = true;
                                            setTimeout(currentTime, 50);
                                        };
                                    } else if (type === "pause") {
                                        path.setAttribute("d", "M44.2,78.3H32.1c-1.1,0-2-0.9-2-2V23.7c0-1.1,0.9-2,2-2h12.1c1.1,0,2,0.9,2,2v52.5C46.2,77.4,45.3,78.3,44.2,78.3z");
                                        path1.setAttribute("d", "M67.9,78.3H55.8c-1.1,0-2-0.9-2-2V23.7c0-1.1,0.9-2,2-2h12.1c1.1,0,2,0.9,2,2v52.5C69.9,77.4,69,78.3,67.9,78.3z");
                                        button.onclick = function dashboard_sections_fileSystem_init_media_control_pause(event:MouseEvent):void {
                                            const el:HTMLElement = event.target as HTMLElement,
                                                player:HTMLElement = el.getAncestor("div", "tag"),
                                                media:HTMLAudioElement = player.lastChild as HTMLAudioElement;
                                            media.pause();
                                            media.playing = false;
                                        };
                                    } else {
                                        path.setAttribute("d", "M78,80H22c-1.1,0-2-0.9-2-2V22c0-1.1,0.9-2,2-2h56c1.1,0,2,0.9,2,2v56C80,79.1,79.1,80,78,80z");
                                        button.onclick = function dashboard_sections_fileSystem_init_media_control_stop(event:MouseEvent):void {
                                            const el:HTMLElement = event.target as HTMLElement,
                                                player:HTMLElement = el.getAncestor("div", "tag"),
                                                media:HTMLAudioElement = player.lastChild as HTMLAudioElement,
                                                timer:HTMLInputElement = player.getElementsByTagName("input")[0],
                                                bar:HTMLElement = player.getElementsByClassName("media-slider")[0].getElementsByClassName("progress")[0] as HTMLElement;
                                            media.pause();
                                            bar.style.width = "0%";
                                            timer.value = "00:00:00";
                                            media.playing = false;
                                            media.currentTime = 0;
                                        };
                                    }
                                    svg.setAttribute("version", "1.1");
                                    svg.setAttribute("viewBox", "0 0 100 100");
                                    g.appendChild(path);
                                    if (type === "pause") {
                                        g.appendChild(path1);
                                    }
                                    svg.appendChild(g);
                                    span.textContent = type;
                                    button.appendChild(svg);
                                    button.appendChild(span);
                                    p.appendChild(button);
                                },
                                progress = function dashboard_sections_fileSystem_init_media_progress(event:MouseEvent):void {
                                    const target:HTMLElement = (event.target.lowName() === "button")
                                            ? event.target
                                            : event.target.getAncestor("button", "tag"),
                                        player:HTMLElement = target.getAncestor("div", "tag"),
                                        media:HTMLAudioElement = player.lastChild as HTMLAudioElement,
                                        progress_bar:HTMLElement = target.getElementsByClassName("progress")[0] as HTMLElement,
                                        distance:number = (event.clientX + window.scrollX) - target.offsetLeft,
                                        percent:number = (isNaN(media.duration) === true)
                                            ? 0
                                            : distance / target.clientWidth,
                                        time:number = (isNaN(media.duration) === true)
                                            ? 0
                                            : media.duration * percent;
                                    media.currentTime = time;
                                    progress_bar.style.width = `${percent * 100}%`;
                                };
                            let p:HTMLElement = document.createElement("p"),
                                span:HTMLElement = document.createElement("span");
                            // slider / progression track
                            p.setAttribute("class", "media-slider");
                            span.setAttribute("class", "text");
                            span.textContent = "progression";
                            track.appendChild(span);
                            span = document.createElement("span");
                            span.setAttribute("class", "progress");
                            track.appendChild(span);
                            track.onclick = progress;
                            p.appendChild(track);
                            parent.appendChild(p);

                            // timers
                            p = document.createElement("p");
                            input("time-current");
                            input("time-total");
                            span = document.createElement("span");
                            span.setAttribute("class", "clear");
                            p.appendChild(span);
                            parent.appendChild(p);

                            // control buttons
                            p = document.createElement("p");
                            control("play");
                            control("pause");
                            control("stop");
                            span = document.createElement("span");
                            span.setAttribute("class", "clear");
                            p.appendChild(span);
                            p.setAttribute("class", "media-controls");
                            parent.appendChild(p);

                            if (name === "video") {
                                p = document.createElement("p");
                                p.setAttribute("class", "buffer");
                                p.textContent = "Video is buffering.";
                                parent.appendChild(p);
                            }

                            parent.setAttribute("class", "media");
                            parent.appendChild(media_element);
                            media_element.ondurationchange = function dashboard_sections_fileSystem_init_media_duration(event:Event):void {
                                const target:HTMLVideoElement = event.target as HTMLVideoElement,
                                    player:HTMLElement = target.getAncestor("div", "tag"),
                                    media:HTMLAudioElement = player.lastChild as HTMLAudioElement,
                                    duration:HTMLInputElement = player.getElementsByTagName("input")[1];
                                if (target.lowName() === "video") {
                                    const buffer:HTMLElement = player.getElementsByClassName("buffer")[0] as HTMLElement;
                                    buffer.style.display = "none";
                                    target.style.height = `${target.videoHeight}px`;
                                    target.style.width = `${target.videoWidth}px`;
                                }
                                duration.value = dashboard.sections["file-system"].tools.media_time(media.duration);
                            };
                            media_element.onerror = function dashboard_sections_fileSystem_init_media_duration(event:Event|string):void {
                                const target:HTMLElement = (typeof event === "string")
                                        ? null
                                        : event.target as HTMLElement,
                                    player:HTMLElement = target.getAncestor("div", "tag"),
                                    buffer:HTMLElement = player.getElementsByClassName("buffer")[0] as HTMLElement;
                                buffer.textContent = JSON.stringify(event);
                                buffer.style.display = "block";
                                
                            };
                            if (name === "video") {
                                const video:HTMLVideoElement = media_element as HTMLVideoElement;
                                video.playsInline = true;
                                video.preload = "auto";
                            }
                        },
                        image:HTMLElement = document.createElement("img"),
                        label:HTMLElement = document.createElement("label");
                    dashboard.sections["file-system"].nodes.path.onblur = dashboard.sections["file-system"].events.send;
                    dashboard.sections["file-system"].nodes.search.onblur = dashboard.sections["file-system"].events.send;
                    dashboard.sections["file-system"].nodes.path.onkeydown = dashboard.sections["file-system"].events.key;
                    dashboard.sections["file-system"].nodes.search.onkeydown = dashboard.sections["file-system"].events.key;
                    dashboard.sections["file-system"].nodes.path.value = (dashboard.global.state.fileSystem === undefined || dashboard.global.state.fileSystem === null || typeof dashboard.global.state.fileSystem.path !== "string" || dashboard.global.state.fileSystem.path === "")
                        ? dashboard.global.payload.path.project.replace(/test(\\|\/)?$/, "")
                        : dashboard.global.state.fileSystem.path;
                    dashboard.sections["file-system"].nodes.search.value = (dashboard.global.state.fileSystem === undefined || dashboard.global.state.fileSystem === null || typeof dashboard.global.state.fileSystem.search !== "string")
                        ? ""
                        : dashboard.global.state.fileSystem.search;
                    dashboard.sections["file-system"].events.send(null);
                    dashboard.sections["file-system"].media.audio = document.createElement("div");
                    dashboard.sections["file-system"].media.image = document.createElement("p");
                    dashboard.sections["file-system"].media.text = document.createElement("p");
                    dashboard.sections["file-system"].media.video = document.createElement("div");
                    textarea.spellcheck = false;
                    dashboard.sections["file-system"].media.image.appendChild(image);
                    dashboard.sections["file-system"].media.text.appendText("Text file contents converted to UTF-8 ");
                    dashboard.sections["file-system"].media.text.appendChild(textarea);
                    dashboard.sections["file-system"].media.text.appendChild(label);
                    media("audio");
                    media("video");
                    dashboard.sections["file-system"].media.other = document.createElement("p");
                    dashboard.sections["file-system"].media.other.textContent = "File is likely a binary format that cannot be previewed in a web browser.";
                    dashboard.sections["file-system"].media.pdf = document.createElement("iframe");
                    dashboard.sections["file-system"].events.resize();
                },
                media: {
                    audio: null,
                    image: null,
                    other: null,
                    pdf: null,
                    text: null,
                    video: null
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
                receive: function dashboard_sections_fileSystem_receive(data_item:socket_data):void {
                    const fs:services_fileSystem = data_item.data as services_fileSystem,
                        len:number = (fs.dirs === null)
                            ? 0
                            : fs.dirs.length,
                        len_fail:number = fs.failures.length,
                        fails:HTMLElement = (len_fail > 0 && len > 0 && fs.dirs[0][1] === "directory")
                            ? document.createElement("ul")
                            : document.createElement("p"),
                        summary:store_number = {
                            "block_device": 0,
                            "character_device": 0,
                            "directory": (fs.search === null)
                                ? -2
                                : 0,
                            "fifo_pipe": 0,
                            "file": 0,
                            "socket": 0,
                            "symbolic_link": 0
                        },
                        tbody:HTMLElement = dashboard.sections["file-system"].nodes.output.getElementsByTagName("tbody")[0],
                        icons:store_string = {
                            "block_device": "\u2580",
                            "character_device": "\u0258",
                            "directory": "\ud83d\udcc1",
                            "fifo_pipe": "\u275a",
                            "file": "\ud83d\uddce",
                            "socket": "\ud83d\udd0c",
                            "symbolic_link": "\ud83d\udd17"
                        },
                        failureTitle:HTMLElement = dashboard.sections["file-system"].nodes.failures.parentNode.getElementsByTagName("h3")[0],
                        audio:HTMLAudioElement = dashboard.sections["file-system"].media.audio.lastChild as HTMLAudioElement,
                        video:HTMLVideoElement = dashboard.sections["file-system"].media.video.lastChild as HTMLVideoElement,
                        record = function dashboard_sections_fileSystem_receive_record(index:number):void {
                            const item:type_directory_item = (index < 0)
                                    ? fs.parent
                                    : fs.dirs[index],
                                name:string = (index < 0)
                                    ? ".."
                                    : (index === 0 && fs.search === null && fs.address !== "\\")
                                        ? "."
                                        : (fs.search === null)
                                            ? item[0].replace(fs.dirs[0][0] + fs.sep, "")
                                            : item[0].replace(fs.parent[0] + fs.sep, ""),
                                name_raw:string = (index < 1)
                                    ? ((/^\w:(\\)?$/).test(fs.address) === true)
                                        ? "\\"
                                        : item[0]
                                    : (item[0].includes(fs.sep) === true)
                                        ? item[0]
                                        : fs.address.replace(/(\\|\/)\s*$/, "") + fs.sep + item[0];
                            let tr:HTMLElement = null,
                                td:HTMLElement = null,
                                button:HTMLElement = null,
                                span:HTMLElement = null,
                                dtg:string[] = null;
                            summary[item[1]] = summary[item[1]] + 1;
                            size = size + item[4].size;
                            dtg = item[4].mtimeMs.dateTime(true, dashboard.global.payload.timeZone_offset).split(", ");
                            button = document.createElement("button");
                            button.setAttribute("data-raw", name_raw);
                            tr = document.createElement("tr");
                            span = document.createElement("span");
                            tr.setAttribute("class", (index % 2 === 0) ? "even" : "odd");
                            td = document.createElement("td");
                            td.setAttribute("class", "file-name");
                            button.onclick = dashboard.sections["file-system"].events.send;
                            span.setAttribute("class", "icon");
                            span.appendText(icons[item[1]]);
                            button.appendChild(span);
                            button.appendText(` ${name}`);
                            td.appendText(" ");
                            td.appendChild(button);
                            tr.appendChild(td);

                            td = document.createElement("td");
                            td.appendText(item[1]);
                            tr.appendChild(td);

                            td = document.createElement("td");
                            td.setAttribute("class", "right");
                            td.setAttribute("data-raw", String(item[4].size));
                            td.appendText(item[4].size.commas());
                            tr.appendChild(td);

                            td = document.createElement("td");
                            td.setAttribute("data-raw", String(item[4].mtimeMs));
                            td.appendText(dtg[0]);
                            tr.appendChild(td);

                            td = document.createElement("td");
                            td.appendText(dtg[1]);
                            tr.appendChild(td);

                            td = document.createElement("td");
                            td.appendText(item[4].mode === null ? "" : (item[4].mode & parseInt("777", 8)).toString(8));
                            tr.appendChild(td);

                            td = document.createElement("td");
                            td.setAttribute("class", "right");
                            td.setAttribute("data-raw", String(item[3]));
                            td.appendText(item[3].commas());
                            tr.appendChild(td);
                            tbody.appendChild(tr);
                        };
                    let index_record:number = 0,
                        size:number = 0;
                    dashboard.sections["file-system"].nodes.status.textContent = `Fetched in ${BigInt(Math.round(performance.now() * 1e6)).time(dashboard.sections["file-system"].time).replace(/000$/, "")} time.`;
                    dashboard.sections["file-system"].nodes.path.value = fs.address;
                    dashboard.sections["file-system"].nodes.search.value = (fs.search === null)
                        ? ""
                        : fs.search;
                    dashboard.utility.setState();
                    // td[0] = icon name
                    // td[1] = type
                    // td[2] = size
                    // td[3] = modified date
                    // td[4] = modified time
                    // td[5] = permissions
                    // td[6] = children
                    tbody.textContent = "";
                    audio.pause();
                    video.pause();
                    audio.currentTime = 0;
                    video.currentTime = 0;
                    if (len < 1 || fs.dirs[0] === null) {
                        dashboard.sections["file-system"].nodes.output.style.display = "none";
                    } else {
                        dashboard.sections["file-system"].nodes.output.style.display = "block";
                        if (fs.parent !== null && fs.search === null) {
                            record(-1);
                        }
                        if (len > 0) {
                            do {
                                record(index_record);
                                index_record = index_record + 1;
                            } while (index_record < len);
                        }
                    }
                    if (len === 0) {
                        dashboard.sections["file-system"].nodes.summary.style.display = "none";
                    } else if (fs.dirs[0][1] === "directory" || fs.search !== null) {
                        const li:HTMLCollectionOf<HTMLElement> = dashboard.sections["file-system"].nodes.summary.getElementsByTagName("li");
                        li[0].getElementsByTagName("strong")[0].textContent = size.commas();
                        li[1].getElementsByTagName("strong")[0].textContent = (fs.search === null)
                            ? (fs.dirs.length - 1).commas()
                            : (fs.dirs.length).commas();
                        li[2].getElementsByTagName("strong")[0].textContent = summary.block_device.commas();
                        li[3].getElementsByTagName("strong")[0].textContent = summary.character_device.commas();
                        li[4].getElementsByTagName("strong")[0].textContent = summary.directory.commas();
                        li[5].getElementsByTagName("strong")[0].textContent = summary.fifo_pipe.commas();
                        li[6].getElementsByTagName("strong")[0].textContent = summary.file.commas();
                        li[7].getElementsByTagName("strong")[0].textContent = summary.socket.commas();
                        li[8].getElementsByTagName("strong")[0].textContent = summary.symbolic_link.commas();
                        dashboard.sections["file-system"].nodes.summary.style.display = "block";
                    } else {
                        dashboard.sections["file-system"].nodes.summary.style.display = "none";
                    }
                    if (fs.file === null) {
                        dashboard.sections["file-system"].nodes.content.style.display = "none";
                        if (len === 0) {
                            fails.appendText("System cannot access file system object at this address.");
                        } else if (len_fail > 0) {
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
                        const strong:HTMLElement = document.createElement("strong"),
                            media = function dashboard_sections_fileSystem_receive_media(mediaType:type_fileSystem_media):void {
                                const address:string = `${location.origin}/file-system-${fs.address}`,
                                    player = function dashboard_sections_fileSystem_receive_media_player(type:"audio"|"video"):void {
                                        const times:HTMLCollectionOf<HTMLInputElement> = dashboard.sections["file-system"].media[type].getElementsByTagName("input"),
                                            item:HTMLAudioElement|HTMLVideoElement = (type === "audio")
                                                ? audio
                                                : video,
                                            source:HTMLSourceElement = document.createElement("source");
                                        times[0].value = "00:00:00";
                                        source.src = address;
                                        if (item.childNodes.length > 0) {
                                            item.removeChild(item.lastChild);
                                        }
                                        source.setAttribute("type", fs.mime);
                                        item.appendChild(source);
                                        dashboard.sections["file-system"].nodes.content.appendChild(dashboard.sections["file-system"].media[type]);
                                        item.load();
                                    },
                                    h3:HTMLElement = document.createElement("h3");
                                h3.textContent = "File Contents";
                                dashboard.sections["file-system"].nodes.content.textContent = "";
                                dashboard.sections["file-system"].nodes.content.appendChild(h3);
                                dashboard.sections["file-system"].nodes.content.style.display = "block";
                                // if ([
                                //     "application/pdf",
                                //     "application/x-pdf",
                                //     "application/acrobat",
                                //     "text/pdf",
                                //     "text/x-pdf"].includes(fs.mime) === true
                                // ) {
                                //     dashboard.sections["file-system"].media.pdf.src = address;
                                //     dashboard.sections["file-system"].nodes.content.appendChild(dashboard.sections["file-system"].media.pdf);
                                // } else
                                if (mediaType === "audio") {
                                    player("audio");
                                } else if (mediaType === "image") {
                                    const image:HTMLImageElement = dashboard.sections["file-system"].media.image.getElementsByTagName("img")[0];
                                    image.setAttribute("alt", `Dynamically populated image of type ${fs.mime} from file system location ${fs.address}`);
                                    image.setAttribute("src", address);
                                    dashboard.sections["file-system"].nodes.content.appendChild(dashboard.sections["file-system"].media.image);
                                } else if (mediaType === "text") {
                                    dashboard.sections["file-system"].media.text.getElementsByTagName("textarea")[0].value = fs.file.replace(/\u0000/g, "");
                                    dashboard.sections["file-system"].nodes.content.appendChild(dashboard.sections["file-system"].media.text);
                                } else if (mediaType === "video") {
                                    const buffer:HTMLElement = dashboard.sections["file-system"].media.video.getElementsByClassName("buffer")[0] as HTMLElement;
                                    buffer.style.display = "block";
                                    player("video");
                                } else {
                                    dashboard.sections["file-system"].nodes.content.appendChild(dashboard.sections["file-system"].media.other);
                                }
                            },
                            mediaType:type_fileSystem_media = fs.mime.slice(0, fs.mime.indexOf("/")) as type_fileSystem_media;
                        strong.appendText(fs.failures[0]);
                        media((mediaType === "application" && fs.failures[0] !== "binary")
                            ? "text"
                            : mediaType
                        );
                        if (fs.failures[0] === "binary") {
                            fails.appendText("File is either binary or uses a text encoding larger than utf8.");
                        } else {
                            fails.appendText("File encoded as ");
                            fails.appendChild(strong);
                            if (fs.mime !== "" && fs.mime !== null) {
                                const mime:HTMLElement = document.createElement("strong");
                                mime.textContent = fs.mime;
                                fails.appendText(" with mime type ");
                                fails.appendChild(mime);
                            }
                            fails.appendText(".");
                        }
                        failureTitle.textContent = "File encoding";
                    }
                    fails.setAttribute("class", dashboard.sections["file-system"].nodes.failures.getAttribute("class"));
                    dashboard.sections["file-system"].nodes.failures.parentNode.appendChild(fails);
                    dashboard.sections["file-system"].nodes.failures.parentNode.removeChild(dashboard.sections["file-system"].nodes.failures);
                    dashboard.sections["file-system"].nodes.failures = fails;
                    dashboard.sections["file-system"].block = false;
                },
                time: 0n,
                tools: {
                    media_time: function dashboard_sections_fileSystem_mediaTime(input:boolean|number|string):string {
                        const hour:number = Math.floor(input as number / 3600),
                            min:number = Math.floor((input as number % 3600) / 60),
                            second:number = Math.floor((input as number % 3600) % 60),
                            hStr:string = (hour < 10)
                                ? `0${hour}`
                                : String(hour),
                            mStr:string = (min < 10)
                                ? `0${min}`
                                : String(min),
                            sStr:string = (second < 10)
                                ? `0${second}`
                                : String(second);
                        return `${hStr}:${mStr}:${sStr}`;
                    }
                }
            },
            // file-system end
            // hash start
            "hash": {
                events: {
                    request: function dashboard_sections_hash_request():void {
                        const option:HTMLOptionElement = dashboard.sections["hash"].nodes.algorithm[dashboard.sections["hash"].nodes.algorithm.selectedIndex] as HTMLOptionElement,
                            selectValue:string = option.value,
                            service:services_hash = {
                                algorithm: selectValue,
                                base64: (dashboard.sections["hash"].nodes.base64.checked === true),
                                digest: (dashboard.sections["hash"].nodes.digest.checked === true)
                                    ? "base64"
                                    : "hex",
                                size: 0,
                                type: (dashboard.sections["hash"].nodes.type.checked === true)
                                    ? "file"
                                    : "direct",
                                value: dashboard.sections["hash"].nodes.source.value
                            };
                        dashboard.sections["hash"].nodes.output.value = "";
                        dashboard.utility.setState();
                        dashboard.utility.message_send(service, "dashboard-hash");
                    },
                    toggle_mode: function dashboard_sections_hash_toggleMode(event:MouseEvent):void {
                        const target:HTMLElement = (event === null)
                            ? (dashboard.sections["hash"].nodes.hash.checked === true)
                                ? dashboard.sections["hash"].nodes.hash
                                : dashboard.sections["hash"].nodes.base64
                            : event.target;
                        if (target === dashboard.sections["hash"].nodes.hash) {
                            dashboard.sections["hash"].nodes.digest.disabled = false;
                            dashboard.sections["hash"].nodes.hex.disabled = false;
                        } else {
                            dashboard.sections["hash"].nodes.digest.disabled = true;
                            dashboard.sections["hash"].nodes.hex.disabled = true;
                        }
                    }
                },
                init: function dashboard_sections_hash_init():void {
                    const len:number = dashboard.global.payload.hashes.length;
                    let index:number = 0,
                        option:HTMLElement = null;
                    do {
                        option = document.createElement("option");
                        option.textContent = dashboard.global.payload.hashes[index];
                        if (dashboard.global.state.hash.algorithm === dashboard.global.payload.hashes[index] || (dashboard.global.state.hash.algorithm === "" && dashboard.global.payload.hashes[index] === "sha3-512")) {
                            option.setAttribute("selected", "selected");
                        }
                        dashboard.sections["hash"].nodes.algorithm.appendChild(option);
                        index = index + 1;
                    } while (index < len);
                    if (dashboard.global.state.hash === undefined || dashboard.global.state.hash === null) {
                        if (dashboard.global.state.hash.hashFunction === "hash") {
                            dashboard.sections["hash"].nodes.hash.checked = true;
                        } else {
                            dashboard.sections["hash"].nodes.base64.checked = true;
                        }
                        if (dashboard.global.state.hash.type === "string") {
                            dashboard.sections["hash"].nodes.string.checked = true;
                        } else {
                            dashboard.sections["hash"].nodes.file.checked = true;
                        }
                        if (dashboard.global.state.hash.digest === "hex") {
                            dashboard.sections["hash"].nodes.hex.checked = true;
                        } else {
                            dashboard.sections["hash"].nodes.digest.checked = true;
                        }
                        dashboard.sections["hash"].nodes.source.value = (typeof dashboard.global.state.hash.source !== "string")
                            ? ""
                            : dashboard.global.state.hash.source;
                    }
                    dashboard.sections["hash"].nodes.button.onclick = dashboard.sections["hash"].events.request;
                    dashboard.sections["hash"].nodes.base64.onclick = dashboard.sections["hash"].events.toggle_mode;
                    dashboard.sections["hash"].nodes.hash.onclick = dashboard.sections["hash"].events.toggle_mode;
                    dashboard.sections["hash"].events.toggle_mode(null);
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
                receive: function dashboard_sections_hash_receive(data_item:socket_data):void {
                    const data:services_hash = data_item.data as services_hash;
                    dashboard.sections["hash"].nodes.output.value = data.value;
                    dashboard.sections["hash"].nodes.size.textContent = data.size.commas();
                },
                tools: null
            },
            // hash end
            // interfaces start
            "interfaces": {
                events: null,
                init: function dashboard_sections_interfaces_init():void {
                    dashboard.sections["interfaces"].nodes.update_button.onclick = dashboard.tables.update;
                    dashboard.sections["interfaces"].receive({
                        data: dashboard.global.payload.os.intr,
                        service: "dashboard-os-intr"
                    });
                    dashboard.sections["interfaces"].nodes.update_button.setAttribute("data-list", "intr");
                },
                receive: function dashboard_sections_interfaces_receive(socket_data:socket_data):void {
                    const item:services_os_intr = socket_data.data as services_os_intr,
                        output_old:HTMLElement = dashboard.sections["interfaces"].nodes.list,
                        output_new:HTMLElement = document.createElement("div"),
                        keys:string[] = Object.keys(item.data),
                        len:number = keys.length,
                        data_item = function dashboard_sections_interfaces_receive_dataItem(ul:HTMLElement, item:node_os_NetworkInterfaceInfo, key:"address"|"cidr"|"family"|"internal"|"mac"|"netmask"|"scopeid"):void {
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
                        property = function dashboard_sections_interfaces_receive_property():void {
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
                        dashboard.sections["interfaces"].nodes.list = output_new;
                        dashboard.sections["interfaces"].nodes.count.textContent = String(len);
                        dashboard.sections["interfaces"].nodes.update_text.textContent = item.time.dateTime(true, dashboard.global.payload.timeZone_offset);
                        dashboard.global.payload.os.intr = item;
                    }
                },
                nodes: {
                    count: document.getElementById("interfaces").getElementsByClassName("table-stats")[0].getElementsByTagName("em")[0],
                    list: document.getElementById("interfaces").getElementsByClassName("item-list")[0] as HTMLElement,
                    update_button: document.getElementById("interfaces").getElementsByClassName("table-stats")[0].getElementsByTagName("button")[0],
                    update_text: document.getElementById("interfaces").getElementsByClassName("table-stats")[0].getElementsByTagName("time")[0]
                },
                tools: null
            },
            // interfaces end
            // os-machine start
            "os-machine": {
                events: null,
                init: function dashboard_sections_osMachine_init():void {
                    const time:string = dashboard.global.payload.os.time.dateTime(true, dashboard.global.payload.timeZone_offset);
                    let keys:string[] = null,
                        li:HTMLElement = null,
                        strong:HTMLElement = null,
                        span:HTMLElement = null,
                        len:number = 0,
                        index:number = 0;
                    dashboard.sections["os-machine"].nodes_os.update_text.textContent = time;
                    dashboard.sections["os-machine"].nodes_os.cpu.arch.textContent = dashboard.global.payload.os.machine.cpu.arch;
                    dashboard.sections["os-machine"].nodes_os.cpu.cores.textContent = dashboard.global.payload.os.machine.cpu.cores.commas();
                    dashboard.sections["os-machine"].nodes_os.cpu.endianness.textContent = dashboard.global.payload.os.machine.cpu.endianness;
                    dashboard.sections["os-machine"].nodes_os.cpu.frequency.textContent = `${dashboard.global.payload.os.machine.cpu.frequency.commas()}mhz`;
                    dashboard.sections["os-machine"].nodes_os.cpu.name.textContent = dashboard.global.payload.os.machine.cpu.name;
                    dashboard.sections["os-machine"].nodes_os.memory.free.textContent = `${dashboard.global.payload.os.machine.memory.free.bytesLong()}, ${((dashboard.global.payload.os.machine.memory.free / dashboard.global.payload.os.machine.memory.total) * 100).toFixed(2)}%`;
                    dashboard.sections["os-machine"].nodes_os.memory.used.textContent = `${(dashboard.global.payload.os.machine.memory.total - dashboard.global.payload.os.machine.memory.free).bytesLong()}, ${(((dashboard.global.payload.os.machine.memory.total - dashboard.global.payload.os.machine.memory.free) / dashboard.global.payload.os.machine.memory.total) * 100).toFixed(2)}%`;
                    dashboard.sections["os-machine"].nodes_os.memory.total.textContent = `${dashboard.global.payload.os.machine.memory.total.bytesLong()}, 100%`;
                    dashboard.sections["os-machine"].nodes_os.os.hostname.textContent = dashboard.global.payload.os.os.hostname;
                    dashboard.sections["os-machine"].nodes_os.os.name.textContent = dashboard.global.payload.os.os.name;
                    dashboard.sections["os-machine"].nodes_os.os.platform.textContent = dashboard.global.payload.os.os.platform;
                    dashboard.sections["os-machine"].nodes_os.os.release.textContent = dashboard.global.payload.os.os.release;
                    dashboard.sections["os-machine"].nodes_os.os.type.textContent = dashboard.global.payload.os.os.type;
                    dashboard.sections["os-machine"].nodes_os.os.uptime.textContent = dashboard.global.payload.os.os.uptime.time();
                    dashboard.sections["os-machine"].nodes_os.process.admin.textContent = dashboard.global.payload.os.process.admin.toString();
                    dashboard.sections["os-machine"].nodes_os.process.arch.textContent = dashboard.global.payload.os.process.arch;
                    dashboard.sections["os-machine"].nodes_os.process.argv.textContent = JSON.stringify(dashboard.global.payload.os.process.argv);
                    dashboard.sections["os-machine"].nodes_os.process.cpuSystem.textContent = dashboard.global.payload.os.process.cpuSystem.time();
                    dashboard.sections["os-machine"].nodes_os.process.cpuUser.textContent = dashboard.global.payload.os.process.cpuUser.time();
                    dashboard.sections["os-machine"].nodes_os.process.cwd.textContent = dashboard.global.payload.os.process.cwd;
                    dashboard.sections["os-machine"].nodes_os.process.platform.textContent = dashboard.global.payload.os.process.platform;
                    dashboard.sections["os-machine"].nodes_os.process.pid.textContent = String(dashboard.global.payload.os.process.pid);
                    dashboard.sections["os-machine"].nodes_os.process.ppid.textContent = String(dashboard.global.payload.os.process.ppid);
                    dashboard.sections["os-machine"].nodes_os.process.uptime.textContent = dashboard.global.payload.os.process.uptime.time();
                    dashboard.sections["os-machine"].nodes_os.process.memoryProcess.textContent = `${dashboard.global.payload.os.process.memory.rss.bytesLong()}, ${((dashboard.global.payload.os.process.memory.rss / dashboard.global.payload.os.machine.memory.total) * 100).toFixed(2)}%`;
                    dashboard.sections["os-machine"].nodes_os.process.memoryV8.textContent = dashboard.global.payload.os.process.memory.V8.bytesLong();
                    dashboard.sections["os-machine"].nodes_os.process.memoryExternal.textContent = dashboard.global.payload.os.process.memory.external.bytesLong();
                    if (dashboard.global.payload.os.process.platform === "win32") {
                        dashboard.sections["os-machine"].nodes_os.user.gid.parentNode.style.display = "none";
                        dashboard.sections["os-machine"].nodes_os.user.uid.parentNode.style.display = "none";
                    } else {
                        dashboard.sections["os-machine"].nodes_os.user.gid.textContent = String(dashboard.global.payload.os.user_account.gid);
                        dashboard.sections["os-machine"].nodes_os.user.uid.textContent = String(dashboard.global.payload.os.user_account.uid);
                    }
                    dashboard.sections["os-machine"].nodes_os.user.homedir.textContent = dashboard.global.payload.os.user_account.homedir;
                    dashboard.sections["os-machine"].nodes_os.update_button.onclick = dashboard.tables.update;
                    dashboard.sections["os-machine"].nodes_os.update_button.setAttribute("data-list", "main");

                    // System Path
                    len = dashboard.global.payload.os.os.path.length;
                    if (len > 0) {
                        index = 0;
                        do {
                            li = document.createElement("li");
                            li.textContent = dashboard.global.payload.os.os.path[index];
                            dashboard.sections["os-machine"].nodes_os.path.appendChild(li);
                            index = index + 1;
                        } while (index < len);
                    }
                    delete dashboard.global.payload.os.os.env.Path;
                    delete dashboard.global.payload.os.os.env.PATH;

                    // Environmental Variables
                    keys = Object.keys(dashboard.global.payload.os.os.env);
                    len = keys.length;
                    if (len > 0) {
                        do {
                            li = document.createElement("li");
                            strong = document.createElement("strong");
                            strong.textContent = keys[index];
                            span = document.createElement("span");
                            span.textContent = dashboard.global.payload.os.os.env[keys[index]];
                            li.appendChild(strong);
                            li.appendChild(span);
                            dashboard.sections["os-machine"].nodes_os.env.appendChild(li);
                            index = index + 1;
                        } while (index < len);
                    }

                    // Node Dependency Versions
                    keys = Object.keys(dashboard.global.payload.os.process.versions);
                    len = keys.length;
                    if (len > 0) {
                        index = 0;
                        do {
                            li = document.createElement("li");
                            strong = document.createElement("strong");
                            strong.textContent = keys[index];
                            span = document.createElement("span");
                            span.textContent = dashboard.global.payload.os.process.versions[keys[index]];
                            li.appendChild(strong);
                            li.appendChild(span);
                            dashboard.sections["os-machine"].nodes_os.versions.appendChild(li);
                            index = index + 1;
                        } while (index < len);
                    }
                },
                nodes: null,
                nodes_os: (function dashboard_sections_osMachine_nodes():module_os_nodes {
                    const sectionList:HTMLCollectionOf<HTMLElement> = document.getElementById("os-machine").getElementsByClassName("section")[0].getElementsByClassName("section") as HTMLCollectionOf<HTMLElement>,
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
                        item = function dashboard_sections_osMachine_nodes_item(section:"cpu"|"memory"|"os"|"process"|"user", index:number):HTMLElement {
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
                            update_button: document.getElementById("os-machine").getElementsByClassName("table-stats")[0].getElementsByTagName("button")[0],
                            update_text: document.getElementById("os-machine").getElementsByClassName("table-stats")[0].getElementsByTagName("time")[0],
                            user: {
                                gid: item("user", 0),
                                uid: item("user", 1),
                                homedir: item("user", 2)
                            },
                            versions: sections.versions
                        };
                    return nodeList;
                }()),
                receive: function dashboard_sections_osMachine_receive(data_item:socket_data):void {
                    const data:core_server_os = data_item.data as core_server_os;
                    dashboard.sections["os-machine"].nodes_os.update_text.textContent = data.time.dateTime(true, dashboard.global.payload.timeZone_offset);
                    dashboard.global.payload.os.machine.memory = data.machine.memory;
                    dashboard.global.payload.os.os.uptime = data.os.uptime;
                    dashboard.global.payload.os.process.cpuSystem = data.process.cpuSystem;
                    dashboard.global.payload.os.process.cpuUser = data.process.cpuUser;
                    dashboard.global.payload.os.process.uptime = data.process.uptime;
                    dashboard.sections["os-machine"].nodes_os.memory.free.textContent = `${dashboard.global.payload.os.machine.memory.free.bytesLong()}, ${((dashboard.global.payload.os.machine.memory.free / dashboard.global.payload.os.machine.memory.total) * 100).toFixed(2)}%`;
                    dashboard.sections["os-machine"].nodes_os.memory.used.textContent = `${(dashboard.global.payload.os.machine.memory.total - dashboard.global.payload.os.machine.memory.free).bytesLong()}, ${(((dashboard.global.payload.os.machine.memory.total - dashboard.global.payload.os.machine.memory.free) / dashboard.global.payload.os.machine.memory.total) * 100).toFixed(2)}%`;
                    dashboard.sections["os-machine"].nodes_os.memory.total.textContent = `${dashboard.global.payload.os.machine.memory.total.bytesLong()}, 100%`;
                    dashboard.sections["os-machine"].nodes_os.os.uptime.textContent = dashboard.global.payload.os.os.uptime.time();
                    dashboard.sections["os-machine"].nodes_os.process.admin.textContent = dashboard.global.payload.os.process.admin.toString();
                    dashboard.sections["os-machine"].nodes_os.process.cpuSystem.textContent = dashboard.global.payload.os.process.cpuSystem.time();
                    dashboard.sections["os-machine"].nodes_os.process.cpuUser.textContent = dashboard.global.payload.os.process.cpuUser.time();
                    dashboard.sections["os-machine"].nodes_os.process.uptime.textContent = dashboard.global.payload.os.process.uptime.time();
                    dashboard.sections["os-machine"].nodes_os.process.memoryProcess.textContent = `${dashboard.global.payload.os.process.memory.rss.bytesLong()}, ${((dashboard.global.payload.os.process.memory.rss / dashboard.global.payload.os.machine.memory.total) * 100).toFixed(2)}%`;
                    dashboard.sections["os-machine"].nodes_os.process.memoryV8.textContent = dashboard.global.payload.os.process.memory.V8.bytesLong();
                    dashboard.sections["os-machine"].nodes_os.process.memoryExternal.textContent = dashboard.global.payload.os.process.memory.external.bytesLong();
                },
                tools: null
            },
            // os-machine end
            // ports-application start
            "ports-application": {
                dataName: "ports_application",
                events: null,
                init: null,
                nodes: {
                    caseSensitive: document.getElementById("ports-application").getElementsByTagName("input")[1],
                    count: document.getElementById("ports-application").getElementsByTagName("em")[0],
                    filter_column: document.getElementById("ports-application").getElementsByTagName("select")[0],
                    filter_count: document.getElementById("ports-application").getElementsByTagName("em")[1],
                    filter_value: document.getElementById("ports-application").getElementsByTagName("input")[0],
                    list: document.getElementById("ports-application").getElementsByTagName("tbody")[0],
                    update_button: document.getElementById("ports-application").getElementsByTagName("button")[0],
                    update_text: document.getElementById("ports-application").getElementsByTagName("time")[0]
                },
                receive: function dashboard_sections_portsApplication_receive():void {
                    const data:[number, "tcp"|"udp", "container"|"server", string, string][] = [],
                        keys_container:string[] = Object.keys(dashboard.global.payload.compose.containers),
                        keys_servers:string[] = Object.keys(dashboard.global.payload.servers);
                    let index_item:number = keys_container.length,
                        index_ports:number = 0,
                        container:core_compose_container = null,
                        server:server = null,
                        tr:HTMLElement = null;

                    // from containers
                    if (index_item > 0) {
                        do {
                            index_item = index_item - 1;
                            container = dashboard.global.payload.compose.containers[keys_container[index_item]];
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
                            server = dashboard.global.payload.servers[keys_servers[index_item]];
                            if (server.config.encryption === "both") {
                                data.push([server.status.open, "tcp", "server", server.config.name, keys_servers[index_item]]);
                                data.push([server.status.secure, "tcp", "server", server.config.name, keys_servers[index_item]]);
                            } else {
                                data.push([server.status[server.config.encryption], "tcp", "server", server.config.name, keys_servers[index_item]]);
                            }
                        } while (index_item > 0);
                    }
                    data.sort(function dashboard_sections_portsApplication_receive_sort(a:[number, "tcp"|"udp", "container"|"server", string, string], b:[number, "tcp"|"udp", "container"|"server", string, string]):-1|1 {
                        if (a[0] < b[0] || (a[0] === b[0] && a[1] < b[1])) {
                            return -1;
                        }
                        return 1;
                    });
                    index_ports = data.length;
                    index_item = 0;
                    dashboard.sections["ports-application"].nodes.list.textContent = "";
                    if (index_ports > 0) {
                        do {
                            tr = document.createElement("tr");
                            dashboard.tables.cell(tr, data[index_item][0].toString(), null);
                            dashboard.tables.cell(tr, data[index_item][1], null);
                            dashboard.tables.cell(tr, data[index_item][2], null);
                            dashboard.tables.cell(tr, data[index_item][3], null);
                            dashboard.tables.cell(tr, data[index_item][4], null);
                            tr.setAttribute("class", (index_item % 2 === 0) ? "even" : "odd");
                            dashboard.sections["ports-application"].nodes.list.appendChild(tr);
                            index_item = index_item + 1;
                        } while (index_item < index_ports);
                    }
                    dashboard.sections["ports-application"].nodes.count.textContent = index_ports.toString();
                    dashboard.sections["ports-application"].nodes.update_text.textContent = Date.now().dateTime(true, dashboard.global.payload.timeZone_offset);
                },
                tools: null
            },
            // ports-application end
            // processes start
            "processes": {
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
                receive: null,
                row: function dashboard_sections_processes_row(record_item:type_lists, tr:HTMLElement):void {
                    const record:os_proc = record_item as os_proc,
                        timeValue:string = (record.time === null)
                            ? (0).time()
                            : record.time.time(),
                        time:string = (dashboard.global.payload.os.process.platform === "win32")
                            ? timeValue.replace(/000$/, "")
                            : timeValue.replace(/\.0+$/, ""),
                        memory:string = (record.memory === null)
                            ? "0"
                            : record.memory.commas(),
                        id:string = (record === undefined)
                            ? ""
                            : String(record.id);
                    if (record !== undefined) {
                        dashboard.tables.cell(tr, record.name, null);
                        dashboard.tables.cell(tr, id, id);
                        dashboard.tables.cell(tr, memory, (record.memory === null)
                            ? "0"
                            : String(record.memory));
                        dashboard.tables.cell(tr, time, (record.time === null)
                            ? "0"
                            : String(record.time));
                        dashboard.tables.cell(tr, record.user, null);
                    }
                },
                sort_name: ["name", "id", "memory", "time", "user"]
            },
            // processes end
            // servers-web start
            "servers-web": {
                events: {
                    message: function dashboard_sections_serversWeb_message(event:MouseEvent):void {
                        const target:HTMLElement = event.target,
                            edit:HTMLElement = target.getAncestor("edit", "class"),
                            action:type_dashboard_action = target.getAttribute("class").replace("server-", "") as type_dashboard_action,
                            cancel:HTMLElement = edit.getElementsByClassName("server-cancel")[0] as HTMLElement,
                            configuration:services_server = (function dashboard_serverMessage_configuration():services_server {
                                const textArea:HTMLTextAreaElement = edit.getElementsByTagName("textarea")[0],
                                    config:services_server = JSON.parse(textArea.value);
                                if (dashboard.global.payload.servers[config.id] !== undefined) {
                                    dashboard.global.payload.servers[config.id].config.encryption = config.encryption;
                                }
                                return config;
                            }()),
                            data:services_action_server = {
                                action: action,
                                server: configuration
                            };
                        dashboard.utility.message_send(data, "dashboard-server");
                        if (cancel === undefined) {
                            edit.parentNode.getElementsByTagName("button")[0].click();
                        } else {
                            dashboard.shared_services.cancel(event);
                            dashboard.sections["servers-web"].nodes.service_new.disabled = false;
                        }
                    },
                    validate: function dashboard_sections_serversWeb_validate(event:FocusEvent|KeyboardEvent):void {
                        const target:HTMLTextAreaElement = event.target as HTMLTextAreaElement,
                            listItem:HTMLElement = target.getAncestor("li", "tag"),
                            id:string = listItem.dataset.id,
                            value:string = target.value,
                            edit:HTMLElement = target.getAncestor("edit", "class"),
                            summary:HTMLElement = edit.getElementsByClassName("summary")[0] as HTMLElement,
                            ul:HTMLElement = summary.getElementsByTagName("ul")[0],
                            populate = function dashboard_sections_serversWeb_validate_populate(pass:boolean, message:string):void {
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
                            disable = function dashboard_sections_serversWeb_validate_disable():void {
                                const save:HTMLButtonElement = (id === undefined)
                                        ? listItem.getElementsByClassName("server-add")[0] as HTMLButtonElement
                                        : listItem.getElementsByClassName("server-modify")[0] as HTMLButtonElement,
                                    order = function dashboard_sections_serversWeb_validate_disable_order(item:services_server):string {
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
                                } else if (id !== null && id !== undefined && order(serverData) === order(dashboard.global.payload.servers[id].config)) {
                                    save.disabled = true;
                                    populate(false, "The server configuration is valid, but not modified.");
                                } else {
                                    save.disabled = false;
                                    populate(true, "The server configuration is valid.");
                                }
                            },
                            stringArray = function dashboard_sections_serversWeb_validate_stringArray(required:boolean, name:string, property:string[]):boolean {
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
                            key_test = function dashboard_sections_serversWeb_validate_keyTest(config:config_validate_serverKeys):void {
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
                                            (config.type === "string" && typeof value !== "string") ||
                                            (config.type === "number" && typeof value !== "number")
                                        ) && value !== null) {
                                            populate(false, `Property '${keys[indexActual]}' of '${config.name}' is not of type: ${config.type}.`);
                                            pass = false;
                                        } else if (config.name === "ports" && typeof value === "number" && value > 65535) {
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
                                            let upper:string = null,
                                                key:string = null,
                                                keys:string[] = null;
                                            do {
                                                indexSupported = indexSupported - 1;
                                                upper = config.supported[indexSupported].toUpperCase();
                                                if (keys[indexActual] === config.supported[indexSupported] || (keys[indexActual] === upper && config.name === "method")) {
                                                    if (config.name === "method") {
                                                        key = (keys[indexActual] === upper)
                                                            ? upper
                                                            : config.supported[indexSupported];
                                                        if (typeof serverData.method[key as "delete"].address !== "string") {
                                                            populate(false, `Property method.${key}.address must be a string.`);
                                                        } else {
                                                            delete serverData.method[key as "delete"].address;
                                                        }
                                                        if (typeof serverData.method[key as "delete"].port !== "number" || serverData.method[key as "delete"].port > 65535) {
                                                            populate(false, `Property method.${key}.port must be an integer less than 65536.`);
                                                        } else {
                                                            delete serverData.method[key as "delete"].port;
                                                        }
                                                        keys = Object.keys(delete serverData.method[key as "delete"]);
                                                        if (keys.length > 0) {
                                                            populate(false, `Property method.${key} contains unsupported child properties.`);
                                                        }
                                                    }
                                                    keys.splice(indexActual, 1);
                                                    config.supported.splice(indexSupported, 1);
                                                    indexActual = indexActual - 1;
                                                } else if (config.name === "ports" && ((serverData.encryption === "open" && config.supported[indexSupported] === "secure") || (serverData.encryption === "secure" && config.supported[indexSupported] === "open"))) {
                                                    config.supported.splice(indexSupported, 1);
                                                } else if (config.name === null && keys.includes(config.supported[indexSupported]) === false && (config.supported[indexSupported] === "block_list" || config.supported[indexSupported] === "domain_local" || config.supported[indexSupported] === "method" || config.supported[indexSupported] === "redirect_domain" || config.supported[indexSupported] === "redirect_asset") || config.supported[indexSupported] === "single_socket" || config.supported[indexSupported] === "temporary") {
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
                            rootProperties:string[] = ["activate", "block_list", "domain_local", "encryption", "id", "method", "name", "ports", "redirect_asset", "redirect_domain", "single_socket", "temporary", "upgrade"];
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
                            name: "method",
                            required_name: false,
                            required_property: false,
                            supported: ["delete", "patch", "post", "put"],
                            type: "method"
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
                        // upgrade
                        if (typeof serverData.upgrade === "boolean") {
                            populate(true, "Property 'upgrade' has boolean type value.");
                        } else {
                            populate(false, "Property 'temporary' expects a boolean type value.");
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
                init: function dashboard_sections_serversWeb_init():void {
                    dashboard.sections["servers-web"].receive({
                        data: dashboard.global.payload.servers,
                        service: "dashboard-server"
                    });
                },
                nodes: {
                    list: document.getElementById("servers-web").getElementsByClassName("server-list")[0] as HTMLElement,
                    service_new: document.getElementById("servers-web").getElementsByClassName("server-new")[0] as HTMLButtonElement
                },
                receive: function dashboard_sections_serversWeb_receive(socket_data:socket_data):void {
                    const list:string[] = Object.keys(socket_data.data),
                        list_old:HTMLElement = dashboard.sections["servers-web"].nodes.list,
                        list_new:HTMLElement = document.createElement("ul"),
                        total:number = list.length;
                    let index:number = 0,
                        indexSocket:number = 0,
                        totalSocket:number = 0;
                    dashboard.global.payload.servers = socket_data.data as store_servers;
                    dashboard.sections["servers-web"].nodes.service_new.onclick = dashboard.shared_services.create;
                    list_new.setAttribute("class", list_old.getAttribute("class"));
                    list.sort(function dashboard_sections_serversWeb_receive_sort(a:string, b:string):-1|1 {
                        if (a < b) {
                            return -1;
                        }
                        return 1;
                    });
                    if (total > 0) {
                        do {
                            if (dashboard.global.payload.servers[list[index]].config !== undefined) {
                                list_new.appendChild(dashboard.shared_services.title(dashboard.global.payload.servers[list[index]].config.id, "server"));
                                totalSocket = dashboard.global.payload.servers[list[index]].sockets.length;
                                if (dashboard.sections["sockets-application"] !== undefined && totalSocket > 0) {
                                    indexSocket = 0;
                                    do {
                                        dashboard.sections["sockets-application"].receive({
                                            data: dashboard.global.payload.sockets,
                                            service: "dashboard-socket-application"
                                        });
                                        indexSocket = indexSocket + 1;
                                    } while (indexSocket < totalSocket);
                                }
                            }
                            index = index + 1;
                        } while (index < total);
                    }
                    list_old.parentNode.insertBefore(list_new, list_old);
                    list_old.parentNode.removeChild(list_old);
                    dashboard.sections["servers-web"].nodes.list = list_new;
                    if (dashboard.sections["ports-application"] !== undefined) {
                        dashboard.sections["ports-application"].receive();
                    }
                },
                tools: {
                    activePorts: function dashboard_sections_serversWeb_activePorts(id:boolean|string):HTMLElement {
                        const div:HTMLElement = document.createElement("div"),
                            h5:HTMLElement = document.createElement("h5"),
                            portList:HTMLElement = document.createElement("ul"),
                            encryption:type_encryption = dashboard.global.payload.servers[id as string].config.encryption,
                            ports:server_ports = dashboard.global.payload.servers[id as string].status;
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
                    }
                }
            },
            // servers-web end
            // services start
            "services": {
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
                receive: null,
                row: function dashboard_sections_services_row(record_item:type_lists, tr:HTMLElement):void {
                    const record:os_serv = record_item as os_serv;
                    dashboard.tables.cell(tr, record.name, null);
                    dashboard.tables.cell(tr, record.status, null);
                    dashboard.tables.cell(tr, record.description, null);
                },
                sort_name: ["name", "status", "description"]
            },
            // services end
            // sockets-application start
            "sockets-application": {
                dataName: "sockets_application",
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
                receive: function dashboard_sections_socketsApplication_receive(socket_data:socket_data):void {
                    let tr:HTMLElement = null,
                        index:number = 0;
                    const config:services_socket_application = socket_data.data as services_socket_application,
                        len:number = config.list.length,
                        tbody:HTMLElement = dashboard.sections["sockets-application"].nodes.list,
                        table:HTMLElement = tbody.parentNode,
                        cell = function dashboard_sections_socketsApplication_receive_cell(text:string, classy:string):void {
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
                    dashboard.sections["sockets-application"].nodes.count.textContent = tbody.getElementsByTagName("tr").length.commas();
                    dashboard.sections["sockets-application"].nodes.update_text.textContent = config.time.dateTime(true, dashboard.global.payload.timeZone_offset);
                    dashboard.tables.filter(null, dashboard.sections["sockets-application"].nodes.filter_value);
                    dashboard.tables.sort(null, table, Number(table.dataset.column));
                },
                row: null,
                sort_name: ["server", "type", "role", "name"],
                tools: {
                    update: function dashboard_sections_socketsApplication_update():void {
                        dashboard.utility.message_send(null, "dashboard-socket-application");
                    }
                }
            },
            // sockets-application end
            // sockets-os start
            "sockets-os": {
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
                receive: null,
                row: function dashboard_sections_socketsOS_row(record_item:type_lists, tr:HTMLElement):void {
                    const record:os_sock = record_item as os_sock;
                    let index:number = dashboard.global.payload.os.proc.data.length;
                    dashboard.tables.cell(tr, record.type, null);
                    dashboard.tables.cell(tr, record["local-address"], null);
                    dashboard.tables.cell(tr, String(record["local-port"]), null);
                    dashboard.tables.cell(tr, record["remote-address"], null);
                    dashboard.tables.cell(tr, String(record["remote-port"]), null);
                    if (record.process === 0) {
                        dashboard.tables.cell(tr, "null", null);
                        dashboard.tables.cell(tr, "null", null);
                    } else {
                        dashboard.tables.cell(tr, String(record.process), null);
                        do {
                            index = index - 1;
                            if (dashboard.global.payload.os.proc.data[index] !== undefined && dashboard.global.payload.os.proc.data[index].id === record.process) {
                                dashboard.tables.cell(tr, dashboard.global.payload.os.proc.data[index].name, null);
                                return;
                            }
                        } while (index > 0);
                        dashboard.tables.cell(tr, "null", null);
                    }
                },
                sort_name: ["type", "local-address", "local-port", "remote-address", "remote-port"]
            },
            // sockets-os end
            // statistics start
            "statistics": {
                events: {
                    change_display: function dashboard_sections_statistics_changeDisplay():void {
                        dashboard.sections["statistics"].graphs = {};
                        dashboard.sections["statistics"].nodes.graphs.textContent = "";
                        dashboard.sections["statistics"].nodes.graphs.setAttribute("data-type", dashboard.sections["statistics"].nodes.graph_display.value);
                        dashboard.sections["statistics"].events.change_type();
                    },
                    change_type: function dashboard_sections_statistics_changeType():void {
                        const keys:string[] = Object.keys(dashboard.sections["statistics"].graphs);
                        let index:number = keys.length,
                            keys_graphs:type_graph_keys[],
                            index_graphs:number = 0,
                            graph:Chart = null;
                        if (index > 0) {
                            do {
                                index = index - 1;
                                keys_graphs = Object.keys(dashboard.sections["statistics"].graphs[keys[index]]) as type_graph_keys[];
                                index_graphs = keys_graphs.length;
                                if (index_graphs > 0) {
                                    do {
                                        index_graphs = index_graphs - 1;
                                        graph = dashboard.sections["statistics"].graphs[keys[index]][keys_graphs[index_graphs]];
                                        if (graph !== null) {
                                            if (graph.canvas !== null && graph.canvas.parentNode !== null) {
                                                graph.canvas.parentNode.parentNode.removeChild(graph.canvas.parentNode);
                                            }
                                            graph.destroy();
                                        }
                                    } while (index_graphs > 0);
                                }
                            } while (index > 0);
                        }
                        dashboard.utility.setState();
                        if (dashboard.sections["statistics"].nodes.graph_display.value === "individual") {
                            dashboard.sections["statistics"].tools.graph_individual(true);
                        } else if (dashboard.sections["statistics"].nodes.graph_display.value === "composite") {
                            dashboard.sections["statistics"].tools.graph_composite(true);
                        }
                    },
                    definitions: function dashboard_sections_statistics_definitions(event:FocusEvent|KeyboardEvent):void {
                        const key:KeyboardEvent = event as KeyboardEvent,
                            frequency:number = Number(dashboard.sections["statistics"].nodes.frequency.value),
                            records:number = Number(dashboard.sections["statistics"].nodes.records.value);
                        if (key.type === "keyup" && key.key !== "Enter") {
                            return;
                        }
                        if (isNaN(frequency) === true || isNaN(records) === true) {
                            return;
                        }
                        dashboard.utility.message_send({
                            frequency: (frequency * 1000),
                            records: records
                        }, "dashboard-statistics-change");
                    },
                },
                init: function dashboard_sections_statistics_init():void {
                    dashboard.sections["statistics"].nodes.frequency.onblur = dashboard["sections"].statistics.events.definitions;
                    dashboard.sections["statistics"].nodes.frequency.onkeyup = dashboard["sections"].statistics.events.definitions;
                    dashboard.sections["statistics"].nodes.frequency.value = (dashboard.global.payload.stats.frequency / 1000).toString();
                    dashboard.sections["statistics"].nodes.graph_display.onchange = dashboard.sections["statistics"].events.change_display;
                    dashboard.sections["statistics"].nodes.graph_type.onchange = dashboard.sections["statistics"].events.change_type;    
                    dashboard.sections["statistics"].nodes.graph_display.selectedIndex = (dashboard.global.state.graph_display === null || dashboard.global.state.graph_display === undefined)
                        ? 0
                        : dashboard.global.state.graph_display;
                    dashboard.sections["statistics"].nodes.graph_type.selectedIndex = (dashboard.global.state.graph_type === null || dashboard.global.state.graph_type === undefined)
                        ? 0
                        : dashboard.global.state.graph_type;
                    dashboard.sections["statistics"].nodes.graphs.setAttribute("data-type", dashboard.sections["statistics"].nodes.graph_display.value);
                    dashboard.sections["statistics"].nodes.records.onblur = dashboard.sections["statistics"].events.definitions;
                    dashboard.sections["statistics"].nodes.records.onkeyup = dashboard.sections["statistics"].events.definitions;
                    dashboard.sections["statistics"].nodes.records.value = dashboard.global.payload.stats.records.toString();
                    if (dashboard.sections["servers-web"] !== undefined) {
                        dashboard.sections["servers-web"].receive({
                            data: dashboard.global.payload.servers,
                            service: "dashboard-server"
                        });
                    }
                    Chart.defaults.color = "#ccc";
                    dashboard.sections["statistics"].receive({
                        data: dashboard.global.payload.stats,
                        service: "dashboard-statistics-data"
                    });
                },
                graph_config: {
                    colors: ["rgba(204,170,51,1)", "rgba(153,102,0,1)", "rgba(221,102,0,1)", "rgba(182,32,0,1)", "rgba(64,164,21,1)", "rgba(153,53,127,1)", "rgba(27,82,153,1)", "rgba(128,128,128,1)", "rgba(192,192,192,1)"],
                    labels: {
                        cpu: "CPU Usage, % and Millisecond Value",
                        disk_in: "Read",
                        disk_out: "Written",
                        mem: "Memory Usage, % and Bytes Written",
                        net_in: "Received",
                        net_out: "Sent",
                        threads: "Process Count"
                    },
                    title: {
                        cpu: "CPU %",
                        disk: "Storage Device Usage",
                        disk_in: "Bytes Read from Storage Devices",
                        disk_out: "Bytes Written to Storage Devices",
                        mem: "Memory %",
                        net: "Network Usage",
                        net_in: "Network Bytes Received",
                        net_out: "Network Bytes Sent",
                        threads: "Total Processes"
                    }
                },
                graphs: {},
                nodes: {
                    duration: document.getElementById("statistics").getElementsByClassName("section")[0].getElementsByTagName("em")[1],
                    frequency: document.getElementById("statistics").getElementsByClassName("table-filters")[0].getElementsByTagName("input")[0],
                    graph_display: document.getElementById("statistics").getElementsByClassName("table-filters")[0].getElementsByTagName("select")[1],
                    graph_type: document.getElementById("statistics").getElementsByClassName("table-filters")[0].getElementsByTagName("select")[0],
                    graphs: document.getElementById("statistics").getElementsByClassName("graphs")[0] as HTMLElement,
                    records: document.getElementById("statistics").getElementsByClassName("table-filters")[0].getElementsByTagName("input")[1],
                    update: document.getElementById("statistics").getElementsByClassName("section")[0].getElementsByTagName("em")[0]
                },
                receive: function dashboard_sections_statistics_receive(data:socket_data):void {
                    const stats:services_statistics_data = data.data as services_statistics_data;
                    dashboard.global.payload.stats = stats;
                    if (document.activeElement !== dashboard.sections["statistics"].nodes.frequency) {
                        dashboard.sections["statistics"].nodes.frequency.value = (stats.frequency / 1000).toString();
                    }
                    if (document.activeElement !== dashboard.sections["statistics"].nodes.records) {
                        dashboard.sections["statistics"].nodes.records.value = stats.records.toString();
                    }
                    dashboard.sections["statistics"].nodes.update.textContent = stats.now.dateTime(true, dashboard.global.payload.timeZone_offset);
                    dashboard.sections["statistics"].nodes.duration.textContent = (stats.duration / 1e9).time();
                    if (dashboard.sections["statistics"].nodes.graph_display.value === "individual") {
                        dashboard.sections["statistics"].tools.graph_individual(false);
                    } else if (dashboard.sections["statistics"].nodes.graph_display.value === "composite") {
                        dashboard.sections["statistics"].tools.graph_composite(false);
                    }
                },
                tools: {
                    graph_composite: function dashboard_sections_statistics_graphComposite(force_new:boolean|string):void {
                        const keys:string[] = Object.keys(dashboard.global.payload.stats.containers),
                            len:number = keys.length,
                            keys_data:type_graph_keys[] = ["cpu", "mem", "net_in", "net_out", "threads", "disk_in", "disk_out"],
                            keys_len:number = keys_data.length,
                            graph_type:"bar"|"line" = dashboard.sections["statistics"].nodes.graph_type.value as "bar"|"line",
                            dataset = function dashboard_sections_statistics_graphComposite_dataset(type:type_graph_keys):type_graph_datasets {
                                const output:graph_dataset[] = [],
                                    names:string[] = [],
                                    data = function dashboard_sections_statistics_graphComposite_dataset_data(ind:number):number[] {
                                        if (type === "cpu" || type === "mem") {
                                            const store:number[] = [],
                                                base:string[] = dashboard.global.payload.stats.containers[keys[ind]][type].labels,
                                                len:number = base.length;
                                            let start:number = 0;
                                            do {
                                                store.push(Number(base[start].replace("%", "").replace("< ", "")));
                                                start = start + 1;
                                            } while (start < len);
                                            return store;
                                        }
                                        return dashboard.global.payload.stats.containers[keys[ind]][type].data;
                                    };
                                let index_key:number = 0;
                                if (len > 0) {
                                    index_key = 0;
                                    do {
                                        if (dashboard.global.payload.stats.containers[keys[index_key]] !== undefined && dashboard.global.payload.stats.containers[keys[index_key]] !== null) {
                                            output.push({
                                                backgroundColor: dashboard.sections["statistics"].graph_config.colors[index_key].replace(",1)", ",0.1)"),
                                                borderColor: dashboard.sections["statistics"].graph_config.colors[index_key],
                                                borderRadius: 4,
                                                borderWidth: 2,
                                                data: data(index_key),
                                                fill: true,
                                                label: (keys[index_key] === "application")
                                                    ? "Aphorio"
                                                    : (dashboard.global.payload.compose.containers[keys[index_key]] === null || dashboard.global.payload.compose.containers[keys[index_key]] === undefined)
                                                        ? keys[index_key]
                                                        : dashboard.global.payload.compose.containers[keys[index_key]].name,
                                                showLine: true,
                                                tension: 0.2
                                            });
                                        }
                                        index_key = index_key + 1;
                                    } while (index_key < len);
                                    index_key = 0;
                                    do {
                                        names.push((index_key + 1).toString());
                                        index_key = index_key + 1;
                                    } while (index_key < output[0].data.length);
                                }
                                return [output, names];
                            },
                            update = function dashboard_sections_statistics_graphComposite_update(type:type_graph_keys, section:HTMLElement):void {
                                const dataList:type_graph_datasets = dataset(type),
                                    graph_item:HTMLCanvasElement = (section === null)
                                        ? null
                                        : document.createElement("canvas"),
                                    graph:Chart = (section === null)
                                        ? dashboard.sections["statistics"].graphs.composite[type]
                                        : new Chart(graph_item, {
                                            data: {
                                                datasets: dataList[0],
                                                labels: dataList[1]
                                            },
                                            options: {
                                                animation: false,
                                                maintainAspectRatio: false,
                                                responsive: true
                                            },
                                            type: graph_type
                                        });
                                if (section === null) {
                                    graph.data.datasets = dataList[0];
                                    graph.data.labels = dataList[1];
                                    graph.update();
                                } else {
                                    const div:HTMLElement = document.createElement("div");
                                    graph_item.setAttribute("class", "graph");
                                    dashboard.sections["statistics"].graphs.composite[type] = graph;
                                    div.appendChild(graph_item);
                                    section.appendChild(div);
                                }
                            },
                            create = function dashboard_sections_statistics_graphComposite_create(type:type_graph_keys):void {
                                let new_item:boolean = false;
                                const section_div:HTMLElement = (function dashboard_statisticsGraphIndividual_create_div():HTMLElement {
                                        const sections:HTMLCollectionOf<HTMLElement> = dashboard.sections["statistics"].nodes.graphs.getElementsByClassName("section") as HTMLCollectionOf<HTMLElement>;
                                        let index_sections:number = sections.length;
                                        if (index_sections > 0) {
                                            do {
                                                index_sections = index_sections - 1;
                                                if (sections[index_sections].dataset.id === type) {
                                                    sections[index_sections].textContent = "";
                                                    return sections[index_sections];
                                                }
                                            } while (index_sections > 0);
                                        }
                                        new_item = true;
                                        return document.createElement("div");
                                    }()),
                                    h4:HTMLElement = document.createElement("h4");

                                section_div.setAttribute("class", "section");
                                section_div.setAttribute("data-id", type);
                                h4.textContent = dashboard.sections["statistics"].graph_config.title[type];
                                section_div.appendChild(h4);
                                update(type, section_div);
                                if (new_item === true) {
                                    dashboard.sections["statistics"].nodes.graphs.appendChild(section_div);
                                }
                            };
                        let index:number = 0;
                        if (dashboard.sections["statistics"].graphs.composite === undefined || dashboard.sections["statistics"].graphs.composite === null) {
                            dashboard.sections["statistics"].graphs.composite = {
                                cpu: null,
                                disk_in: null,
                                disk_out: null,
                                mem: null,
                                net_in: null,
                                net_out: null,
                                threads: null
                            };
                        }
                        do {
                            if (force_new === true || dashboard.sections["statistics"].graphs.composite[keys_data[index]] === null) {
                                create(keys_data[index]);
                            } else {
                                update(keys_data[index], null);
                            }
                            index = index + 1;
                        } while (index < keys_len);
                    },
                    graph_individual: function dashboard_sections_statistics_graphIndividual(force_new:boolean|string):void {
                        const id_list:string[] = Object.keys(dashboard.global.payload.stats.containers),
                            id_len:number = id_list.length,
                            graph_type:"bar"|"line" = dashboard.sections["statistics"].nodes.graph_type.value as "bar"|"line",
                            destroy = function dashboard_sections_statistics_graphIndividual_destroy(id:string):void {
                                if (dashboard.sections["statistics"].graphs[id] !== null && dashboard.sections["statistics"].graphs[id] !== undefined) {
                                    const each = function dashboard_sections_statistics_graphIndividual_destroy_each(type:type_graph):void {
                                        if (dashboard.sections["statistics"].graphs[id][type] !== null && dashboard.sections["statistics"].graphs[id][type] !== undefined) {
                                            dashboard.sections["statistics"].graphs[id][type].destroy();
                                        }
                                    };
                                    each("cpu");
                                    each("mem");
                                    each("net");
                                    each("threads");
                                    if (id !== "application") {
                                        each("disk");
                                    }
                                    dashboard.sections["statistics"].graphs[id] = null;
                                }
                            },
                            empty = function dashboard_sections_statistics_graphIndividual_empty(id:string):void {
                                const sections:HTMLCollectionOf<HTMLElement> = dashboard.sections["statistics"].nodes.graphs.getElementsByTagName("div");
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
                                            p.textContent = `Container ${dashboard.global.payload.compose.containers[id].name} is not running.`;
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
                                    : `Container - ${dashboard.global.payload.compose.containers[id].name}`;
                                p = document.createElement("p");
                                p.textContent = `Container ${dashboard.global.payload.compose.containers[id].name} is not running.`;
                                div.appendChild(h4);
                                div.appendChild(p);
                                dashboard.sections["statistics"].nodes.graphs.appendChild(div);
                                destroy(id);
                            },
                            update = function dashboard_sections_statistics_graphIndividual_update(id:string, section:HTMLElement):void {
                                const modify = function dashboard_sections_statistics_graphIndividual_update_modify(type:type_graph):void {
                                    const dataList:type_graph_datasets = (function dashboard_sections_statistics_graphIndividual_update_modify_dataset():type_graph_datasets {
                                            const dataset0:graph_dataset = {
                                                    backgroundColor: dashboard.sections["statistics"].graph_config.colors[0].replace(",1)", ",0.1)"),
                                                    borderColor: dashboard.sections["statistics"].graph_config.colors[0],
                                                    borderRadius: 4,
                                                    borderWidth: 2,
                                                    data: (type === "cpu" || type === "mem" || type === "threads")
                                                        ? dashboard.global.payload.stats.containers[id][type].data
                                                        : dashboard.global.payload.stats.containers[id][`${type}_in` as "disk_in"].data,
                                                    fill: true,
                                                    label: (type === "cpu" || type === "mem" || type === "threads")
                                                        ? dashboard.sections["statistics"].graph_config.labels[type]
                                                        : dashboard.sections["statistics"].graph_config.labels[`${type}_in` as "disk_in"],
                                                    showLine: true,
                                                    tension: 0.2
                                                },
                                                dataset1:graph_dataset = (type === "cpu" || type === "mem" || type === "threads")
                                                    ? null
                                                    : {
                                                        backgroundColor: dashboard.sections["statistics"].graph_config.colors[1].replace(",1)", ",0.1)"),
                                                        borderColor: dashboard.sections["statistics"].graph_config.colors[1],
                                                        borderRadius: 4,
                                                        borderWidth: 2,
                                                        data: dashboard.global.payload.stats.containers[id][`${type}_out` as "disk_out"].data,
                                                        fill: true,
                                                        label: dashboard.sections["statistics"].graph_config.labels[`${type}_out` as "disk_out"],
                                                        showLine: true,
                                                        tension: 0.2
                                                    };
                                            if (type === "cpu" || type === "mem" || type === "threads") {
                                                return [[dataset0], dashboard.global.payload.stats.containers[id][type].labels];
                                            }
                                            return [[dataset0, dataset1], dashboard.global.payload.stats.containers[id][`${type}_in` as "disk_in"].labels];
                                        }()),
                                        graph_item:HTMLCanvasElement = (section === null)
                                            ? null
                                            : document.createElement("canvas"),
                                        graph:Chart = (section === null)
                                            ? dashboard.sections["statistics"].graphs[id][type]
                                            : new Chart(graph_item, {
                                                data: {
                                                    datasets: dataList[0],
                                                    labels: dataList[1]
                                                },
                                                options: {
                                                    animation: false,
                                                    maintainAspectRatio: false,
                                                    plugins: {
                                                        title: {
                                                            display: true,
                                                            text: `${(id === "application")
                                                                ? "Aphorio"
                                                                : (dashboard.global.payload.compose.containers[id] === null || dashboard.global.payload.compose.containers[id] === undefined)
                                                                    ? id
                                                                    : dashboard.global.payload.compose.containers[id].name
                                                            } - ${dashboard.sections["statistics"].graph_config.title[type]}`
                                                        }
                                                    },
                                                    responsive: true
                                                },
                                                type: graph_type
                                            });
                                    if (section === null) {
                                        graph.data.datasets = dataList[0];
                                        graph.data.labels = dataList[1];
                                        graph.update();
                                    } else {
                                        const div:HTMLElement = document.createElement("div");
                                        graph_item.setAttribute("class", "graph");
                                        dashboard.sections["statistics"].graphs[id][type] = graph;
                                        div.appendChild(graph_item);
                                        section.appendChild(div);
                                    }
                                };
                                modify("cpu");
                                modify("mem");
                                modify("net");
                                modify("threads");
                                if (id !== "application") {
                                    modify("disk");
                                }
                            },
                            create = function dashboard_sections_statistics_graphIndividual_create(id:string):void {
                                let new_item:boolean = false;
                                const section_div:HTMLElement = (function dashboard_sections_statistics_graphIndividual_create_sectionDiv():HTMLElement {
                                        const sections:HTMLCollectionOf<HTMLElement> = dashboard.sections["statistics"].nodes.graphs.getElementsByClassName("section") as HTMLCollectionOf<HTMLElement>;
                                        let index_sections:number = sections.length;
                                        if (index_sections > 0) {
                                            do {
                                                index_sections = index_sections - 1;
                                                if (sections[index_sections].dataset.id === id) {
                                                    sections[index_sections].textContent = "";
                                                    return sections[index_sections];
                                                }
                                            } while (index_sections > 0);
                                        }
                                        new_item = true;
                                        return document.createElement("div");
                                    }()),
                                    h4:HTMLElement = document.createElement("h4"),
                                    clear:HTMLElement = document.createElement("span"),
                                    name_literal:string = (id === "application")
                                        ? "Aphorio"
                                        : dashboard.global.payload.compose.containers[id].name,
                                    name:string = (id === "application")
                                        ? `Application - ${name_literal}`
                                        : `Container - ${name_literal}`;
                                dashboard.sections["statistics"].graphs[id] = {
                                    cpu: null,
                                    disk: null,
                                    mem: null,
                                    net: null,
                                    threads: null
                                };
                                h4.textContent = name;
                                section_div.appendChild(h4);
                                update(id, section_div);
                                clear.setAttribute("class", "clear");
                                section_div.setAttribute("class", "section");
                                section_div.appendChild(clear);
                                section_div.setAttribute("data-id", id);
                                if (new_item === true) {
                                    dashboard.sections["statistics"].nodes.graphs.appendChild(section_div);
                                }
                            };
                        let index:number = 0;
                        if (id_len > 0) {
                            do {
                                if (dashboard.global.payload.stats.containers[id_list[index]] === null) {
                                    empty(id_list[index]);
                                } else if (force_new === true || dashboard.sections["statistics"].graphs[id_list[index]] === undefined || dashboard.sections["statistics"].graphs[id_list[index]] === null) {
                                    create(id_list[index]);
                                } else {
                                    update(id_list[index], null);
                                }
                                index = index + 1;
                            } while (index < id_len);
                        }
                    }
                }
            },
            // statistics end
            // terminal start
            "terminal": {
                // https://xtermjs.org/docs/
                cols: 0,
                events: {
                    change: function dashboard_sections_terminal_change():void {
                        dashboard.utility.setState();
                        dashboard.sections["terminal"].item.dispose();
                        dashboard.sections["terminal"].socket.close();
                        dashboard.sections["terminal"].item = null;
                        dashboard.sections["terminal"].socket = null;
                        dashboard.sections["terminal"].tools.shell();
                    },
                    data: function dashboard_sections_terminal_data(event:websocket_event):void {
                        dashboard.sections["terminal"].item.write(event.data);
                    },
                    firstData: function dashboard_sections_terminal_firstData(event:websocket_event):void {
                        dashboard.sections["terminal"].socket.onmessage = dashboard.sections["terminal"].events.data;
                        dashboard.sections["terminal"].info = JSON.parse(event.data);
                        dashboard.sections["terminal"].nodes.output.setAttribute("data-info", event.data);
                    },
                    input: function dashboard_sections_terminal_input(input:terminal_input):void {
                        if (dashboard.sections["terminal"].socket.readyState === 1) {
                            dashboard.sections["terminal"].socket.send(input.key);
                        }
                    },
                    resize: function dashboard_sections_terminal_resize():void {
                        if (dashboard.global.state.nav === "terminal") {
                            const char_height:number = (dashboard.sections["terminal"].item === null)
                                    ? 17
                                    : (document.getElementById("terminal").getElementsByClassName("xterm-rows")[0] === undefined)
                                        ? 17
                                        : Number(document.getElementById("terminal").getElementsByClassName("xterm-rows")[0].getElementsByTagName("div")[0].style.height.replace("px", "")),
                                char_width:number = 9,
                                output_height:number = window.innerHeight - 110,
                                output_width:number = dashboard.sections["terminal"].nodes.output.clientWidth,
                                cols:number = Math.floor(output_width / char_width),
                                rows:number = Math.floor(output_height / char_height);
                            if (output_width < 1) {
                                setTimeout(dashboard_sections_terminal_resize, 10);
                            } else if (dashboard.sections["terminal"].cols !== cols || dashboard.sections["terminal"].rows !== rows) {
                                dashboard.sections["terminal"].cols = cols;
                                dashboard.sections["terminal"].rows = rows;
                                dashboard.sections["terminal"].nodes.output.style.height = `${output_height / 10}em`;
                                dashboard.sections["terminal"].nodes.output.setAttribute("data-size", JSON.stringify({
                                    col: dashboard.sections["terminal"].cols,
                                    row: dashboard.sections["terminal"].rows
                                }));
                                dashboard.sections["terminal"].nodes.cols.textContent = cols.toString();
                                dashboard.sections["terminal"].nodes.rows.textContent = rows.toString();
                                if (dashboard.sections["terminal"].item !== null) {
                                    dashboard.sections["terminal"].item.resize(dashboard.sections["terminal"].cols, dashboard.sections["terminal"].rows);
                                }
                                if (dashboard.sections["terminal"].info !== null) {
                                    dashboard.utility.message_send({
                                        cols: dashboard.sections["terminal"].cols,
                                        hash: dashboard.sections["terminal"].info.socket_hash,
                                        rows: dashboard.sections["terminal"].rows,
                                        secure: (location.protocol === "http:")
                                            ? "open"
                                            : "secure"
                                    } as services_terminal_resize, "dashboard-terminal-resize");
                                }
                            }
                        }
                    },
                    selection: function dashboard_sections_terminal_selection():void {
                        navigator.clipboard.write([
                            new ClipboardItem({["text/plain"]: dashboard.sections["terminal"].item.getSelection()})
                        ]);
                    }
                },
                id: null,
                info: null,
                init: function dashboard_sections_terminal_init():void {
                    if (document.getElementById("terminal") === null) {
                        return;
                    }
                    const len:number = dashboard.global.payload.terminal.length;
                    let option:HTMLElement = null,
                        index:number = 0;
                    dashboard.sections["terminal"].nodes.select.textContent = "";
                    if (len > 0) {
                        do {
                            option = document.createElement("option");
                            option.textContent = dashboard.global.payload.terminal[index];
                            if (dashboard.global.payload.terminal[index] === dashboard.global.state.terminal) {
                                option.setAttribute("selected", "selected");
                            }
                            dashboard.sections["terminal"].nodes.select.appendChild(option);
                            index = index + 1;
                        } while (index < len);
                        dashboard.sections["terminal"].nodes.select.onchange = dashboard.sections["terminal"].events.change;
                        if (dashboard.global.state.terminal === "") {
                            dashboard.sections["terminal"].nodes.select.selectedIndex = 0;
                            dashboard.utility.setState();
                        }
                    }
                    if (typeof Terminal === "undefined") {
                        setTimeout(dashboard_sections_terminal_init, 200);
                    } else {
                        dashboard.sections["terminal"].tools.shell();
                    }
                    dashboard.sections["terminal"].events.resize();
                },
                item: null,
                nodes: {
                    cols: document.getElementById("terminal").getElementsByClassName("dimensions")[0].getElementsByTagName("em")[0],
                    output: document.getElementById("terminal").getElementsByClassName("terminal-output")[0] as HTMLElement,
                    rows: document.getElementById("terminal").getElementsByClassName("dimensions")[0].getElementsByTagName("em")[1],
                    select: document.getElementById("terminal").getElementsByTagName("select")[0] as HTMLSelectElement
                },
                receive: null,
                rows: 0,
                socket: null,
                tools: {
                    shell: function dashboard_sections_terminal_shell():void {
                        const encryption:type_encryption = (location.protocol === "http:")
                                ? "open"
                                : "secure",
                            scheme:"ws"|"wss" = (encryption === "open")
                                ? "ws"
                                : "wss";
                        dashboard.sections["terminal"].item = new Terminal({
                            cols: dashboard.sections["terminal"].cols,
                            cursorBlink: true,
                            cursorStyle: "underline",
                            disableStdin: false,
                            rows: dashboard.sections["terminal"].rows,
                            theme: {
                                background: "#222",
                                selectionBackground: "#444"
                            }
                        });
                        dashboard.sections["terminal"].item.open(dashboard.sections["terminal"].nodes.output);
                        dashboard.sections["terminal"].item.onKey(dashboard.sections["terminal"].events.input);
                        dashboard.sections["terminal"].item.write("Terminal emulator pending connection...\r\n");
                        // client-side terminal is ready, so alert the backend to initiate a pseudo-terminal
                        dashboard.sections["terminal"].socket = new WebSocket(`${scheme}://${location.host}/?shell=${encodeURIComponent(dashboard.global.state.terminal)}&cols=${dashboard.sections["terminal"].cols}&rows=${dashboard.sections["terminal"].rows}`, ["dashboard-terminal"]);
                        dashboard.sections["terminal"].socket.onmessage = dashboard.sections["terminal"].events.firstData;
                        if (typeof navigator.clipboard === "undefined") {
                            const em:HTMLElement = document.getElementById("terminal").getElementsByClassName("tab-description")[0].getElementsByTagName("em")[0] as HTMLElement;
                            if (location.protocol === "http:") {
                                em.textContent = "Terminal clipboard functionality only available when page is requested with HTTPS.";
                                em.style.fontWeight = "bold";
                            } else if (em !== undefined) {
                                em.parentNode.removeChild(em);
                            }
                        } else {
                            dashboard.sections["terminal"].item.onSelectionChange(dashboard.sections["terminal"].events.selection);
                        }
                    }
                }
            },
            // terminal end
            // test-http start
            "test-http": {
                events: {
                    request: function dashboard_sections_http_request():void {
                        const encryption:boolean = dashboard.sections["test-http"].nodes.encryption.checked,
                            timeout:number = Number(dashboard.sections["test-http"].nodes.timeout.value),
                            data:services_http_test = {
                                body: "",
                                encryption: encryption,
                                headers: dashboard.sections["test-http"].nodes.request.value,
                                stats: null,
                                timeout: (isNaN(timeout) === true || timeout < 0)
                                    ? 0
                                    : Math.floor(timeout),
                                uri: ""
                            },
                            strong:HTMLCollectionOf<HTMLElement> = dashboard.sections["test-http"].nodes.stats.getElementsByTagName("strong");
                        dashboard.utility.setState();
                        dashboard.utility.message_send(data, "dashboard-http");
                        dashboard.sections["test-http"].nodes.responseBody.value = "";
                        dashboard.sections["test-http"].nodes.responseHeaders.value = "";
                        dashboard.sections["test-http"].nodes.responseURI.value = "";
                        strong[0].textContent = "";
                        strong[1].textContent = "";
                        strong[2].textContent = "";
                        strong[3].textContent = "";
                        strong[4].textContent = "";
                        strong[5].textContent = "";
                        strong[6].textContent = "";
                        strong[7].textContent = "";
                    }
                },
                init: function dashboard_sections_http_init():void {
                    // populate a default HTTP test value
                    dashboard.sections["test-http"].nodes.request.value = (dashboard.global.state.http === null || dashboard.global.state.http === undefined || typeof dashboard.global.state.http.request !== "string" || dashboard.global.state.http.request === "")
                        ? dashboard.global.payload.http_request
                        : dashboard.global.state.http.request;
                    dashboard.sections["test-http"].nodes.http_request.onclick = dashboard.sections["test-http"].events.request;
                    dashboard.sections["test-http"].nodes.responseBody.value = "";
                    dashboard.sections["test-http"].nodes.responseHeaders.value = "";
                    dashboard.sections["test-http"].nodes.responseURI.value = "";
                    if (dashboard.global.state.http !== null && dashboard.global.state.http !== undefined && dashboard.global.state.http.encryption === true) {
                        document.getElementById("test-http").getElementsByTagName("input")[1].checked =  true;
                    } else {
                        document.getElementById("test-http").getElementsByTagName("input")[0].checked =  true;
                    }
                },
                nodes: {
                    encryption: document.getElementById("test-http").getElementsByTagName("input")[1],
                    http_request: document.getElementById("test-http").getElementsByClassName("send_request")[0] as HTMLButtonElement,
                    request: document.getElementById("test-http").getElementsByTagName("textarea")[0],
                    responseBody: document.getElementById("test-http").getElementsByTagName("textarea")[3],
                    responseHeaders: document.getElementById("test-http").getElementsByTagName("textarea")[2],
                    responseURI: document.getElementById("test-http").getElementsByTagName("textarea")[1],
                    stats: document.getElementById("test-http").getElementsByClassName("summary-stats")[0] as HTMLElement,
                    timeout: document.getElementById("test-http").getElementsByTagName("input")[2]
                },
                receive: function dashboard_sections_http_receive(data_item:socket_data):void {
                    const data:services_http_test = data_item.data as services_http_test,
                        strong:HTMLCollectionOf<HTMLElement> = dashboard.sections["test-http"].nodes.stats.getElementsByTagName("strong");
                    dashboard.sections["test-http"].nodes.responseBody.value = data.body;
                    dashboard.sections["test-http"].nodes.responseHeaders.value = data.headers;
                    dashboard.sections["test-http"].nodes.responseURI.value = data.uri;
                    // round trip time
                    strong[0].textContent = `${data.stats.time} seconds`;
                    // response header size
                    strong[1].textContent = data.stats.response.size_header.bytesLong();
                    // response body size
                    strong[2].textContent = data.stats.response.size_body.bytesLong();
                    // chunked?
                    strong[3].textContent = String(data.stats.chunks.chunked);
                    // chunk count
                    strong[4].textContent = data.stats.chunks.count.commas();
                    // request header size
                    strong[5].textContent = data.stats.request.size_header.bytesLong();
                    // request body size
                    strong[6].textContent = data.stats.request.size_body.bytesLong();
                    // URI length
                    strong[7].textContent = `${JSON.parse(data.uri.replace(/\s+"/g, "\"")).absolute.length.commas()} characters`;
                },
                tools: null
            },
            // test-http end
            // test-websocket start
            "test-websocket": {
                connected: false,
                events: {
                    handshakeSend: function dashboard_sections_websocketTest_handshakeSend():void {
                        const timeout:number = Number(dashboard.sections["test-websocket"].nodes.handshake_timeout.value),
                            payload:services_websocket_handshake = {
                                encryption: (dashboard.sections["test-websocket"].nodes.handshake_scheme.checked === true),
                                message: (dashboard.sections["test-websocket"].connected === true)
                                    ? ["disconnect"]
                                    : dashboard.sections["test-websocket"].nodes.handshake.value.replace(/^\s+/, "").replace(/\s+$/, "").replace(/\r\n/g, "\n").split("\n"),
                                timeout: (isNaN(timeout) === true)
                                    ? 0
                                    : timeout
                            };
                        dashboard.sections["test-websocket"].timeout = payload.timeout;
                        dashboard.sections["test-websocket"].nodes.status.value = "";
                        dashboard.utility.message_send(payload, "dashboard-websocket-handshake");
                    },
                    keyup_frame: function dashboard_sections_websocketTest_keyupFrame(event:Event):void {
                        const encodeLength:TextEncoder = new TextEncoder(),
                            text:string = dashboard.sections["test-websocket"].nodes.message_send_body.value,
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
                            frame_try = dashboard.sections["test-websocket"].tools.parse_frame();
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
                        if ((event === null || event.target === dashboard.sections["test-websocket"].nodes.message_send_frame) && frame.mask === true) {
                            const encodeKey:TextEncoder = new TextEncoder;
                            frame.maskKey = encodeKey.encode(window.btoa(Math.random().toString() + Math.random().toString() + Math.random().toString()).replace(/0\./g, "").slice(0, 32)) as Buffer;
                        }
                        dashboard.sections["test-websocket"].frameBeautify("send", JSON.stringify(frame));
                    },
                    keyup_message: function dashboard_sections_websocketTest_keyupMessage(event:KeyboardEvent):void {
                        dashboard.sections["test-websocket"].events.keyup_frame(event);
                    },
                    message_send: function dashboard_sections_websocketTest_messageSend():void {
                        const payload:services_websocket_message = {
                            frame: dashboard.sections["test-websocket"].tools.parse_frame(),
                            message: dashboard.sections["test-websocket"].nodes.message_send_body.value
                        };
                        dashboard.utility.message_send(payload, "dashboard-websocket-message");
                        dashboard.sections["test-websocket"].events.keyup_frame(null);
                    }
                },
                frameBeautify: function dashboard_sections_websocketTest_frameBeautify(target:"receive"|"send", valueItem?:string):void {
                    const value:string = (valueItem === null || valueItem === undefined)
                        ? dashboard.sections["test-websocket"].nodes[`message_${target}_frame`].value
                        : valueItem;
                    dashboard.sections["test-websocket"].nodes[`message_${target}_frame`].value = value
                        .replace("{", "{\n    ")
                        .replace(/,/g, ",\n    ")
                        .replace(/,?\s*\}/, "\n}")
                        .replace(/:/g, ": ");
                },
                init: function dashboard_sections_websocketTest_init():void {
                    const form:HTMLElement = dashboard.sections["test-websocket"].nodes.handshake_scheme.getAncestor("form", "class"),
                        h4:HTMLElement = form.getElementsByTagName("h4")[0],
                        scheme:HTMLElement = form.getElementsByTagName("p")[1],
                        emOpen:HTMLElement = document.createElement("em"),
                        emSecure:HTMLElement = document.createElement("em");
                    dashboard.sections["test-websocket"].tools.handshake();
                    dashboard.sections["test-websocket"].nodes.button_handshake.onclick = dashboard.sections["test-websocket"].events.handshakeSend;
                    dashboard.sections["test-websocket"].nodes.button_send.onclick = dashboard.sections["test-websocket"].events.message_send;
                    dashboard.sections["test-websocket"].nodes.message_send_body.onkeyup = dashboard.sections["test-websocket"].events.keyup_message;
                    dashboard.sections["test-websocket"].nodes.message_send_frame.onblur = dashboard.sections["test-websocket"].events.keyup_frame;
                    dashboard.sections["test-websocket"].nodes.handshake_label.textContent = "";
                    if (isNaN(dashboard.global.payload.servers[dashboard.global.payload.dashboard_id].status.open) === true) {
                        dashboard.sections["test-websocket"].nodes.handshake_scheme.checked = true;
                        h4.style.display = "none";
                        scheme.style.display = "none";
                        emSecure.textContent = String(dashboard.global.payload.servers[dashboard.global.payload.dashboard_id].status.secure);
                        dashboard.sections["test-websocket"].nodes.handshake_label.appendText("secure - ");
                        dashboard.sections["test-websocket"].nodes.handshake_label.appendChild(emSecure);
                    } else if (isNaN(dashboard.global.payload.servers[dashboard.global.payload.dashboard_id].status.secure) === true) {
                        dashboard.sections["test-websocket"].nodes.handshake_scheme.checked = false;
                        h4.style.display = "none";
                        scheme.style.display = "none";
                        emOpen.textContent = String(dashboard.global.payload.servers[dashboard.global.payload.dashboard_id].status.open);
                        dashboard.sections["test-websocket"].nodes.handshake_label.appendText("open - ");
                        dashboard.sections["test-websocket"].nodes.handshake_label.appendChild(emOpen);
                    } else {
                        emOpen.textContent = String(dashboard.global.payload.servers[dashboard.global.payload.dashboard_id].status.open);
                        emSecure.textContent = String(dashboard.global.payload.servers[dashboard.global.payload.dashboard_id].status.secure);
                        dashboard.sections["test-websocket"].nodes.handshake_label.appendText("open - ");
                        dashboard.sections["test-websocket"].nodes.handshake_label.appendChild(emOpen);
                        dashboard.sections["test-websocket"].nodes.handshake_label.appendText(", secure - ");
                        dashboard.sections["test-websocket"].nodes.handshake_label.appendChild(emSecure);
                    }
                },
                nodes: {
                    button_handshake: document.getElementById("test-websocket").getElementsByClassName("form")[0].getElementsByTagName("button")[0] as HTMLButtonElement,
                    button_send: document.getElementById("test-websocket").getElementsByClassName("form")[2].getElementsByTagName("button")[0] as HTMLButtonElement,
                    halt_receive: document.getElementById("test-websocket").getElementsByClassName("form")[3].getElementsByTagName("input")[0] as HTMLInputElement,
                    handshake: document.getElementById("test-websocket").getElementsByClassName("form")[0].getElementsByTagName("textarea")[0] as HTMLTextAreaElement,
                    handshake_label: document.getElementById("test-websocket").getElementsByClassName("form")[0].getElementsByClassName("ports")[0].getElementsByTagName("span")[0],
                    handshake_scheme: document.getElementById("test-websocket").getElementsByClassName("form")[0].getElementsByTagName("input")[1] as HTMLInputElement,
                    handshake_status: document.getElementById("test-websocket").getElementsByClassName("form")[0].getElementsByTagName("textarea")[1] as HTMLTextAreaElement,
                    handshake_timeout: document.getElementById("test-websocket").getElementsByClassName("form")[0].getElementsByTagName("input")[2] as HTMLInputElement,
                    message_receive_body: document.getElementById("test-websocket").getElementsByClassName("form")[3].getElementsByTagName("textarea")[1] as HTMLTextAreaElement,
                    message_receive_frame: document.getElementById("test-websocket").getElementsByClassName("form")[3].getElementsByTagName("textarea")[0] as HTMLTextAreaElement,
                    message_send_body: document.getElementById("test-websocket").getElementsByClassName("form")[2].getElementsByTagName("textarea")[1] as HTMLTextAreaElement,
                    message_send_frame: document.getElementById("test-websocket").getElementsByClassName("form")[2].getElementsByTagName("textarea")[0] as HTMLTextAreaElement,
                    status: document.getElementById("websocket-status") as HTMLTextAreaElement
                },
                receive: null,
                timeout: 0,
                tools: {
                    handshake: function dashboard_sections_WebsocketTest_handshake():void {
                        const handshakeString:string[] = [],
                            key:string = window.btoa((Math.random().toString() + Math.random().toString()).slice(2, 18));
                        handshakeString.push("GET / HTTP/1.1");
                        handshakeString.push(`Host: ${location.host}`);
                        handshakeString.push("Upgrade: websocket");
                        handshakeString.push("Connection: Upgrade");
                        handshakeString.push(`Sec-WebSocket-Key: ${key}`);
                        handshakeString.push(`Origin: ${location.origin}`);
                        handshakeString.push("Sec-WebSocket-Protocol: test-websocket");
                        handshakeString.push("Sec-WebSocket-Version: 13");
                        dashboard.sections["test-websocket"].nodes.handshake.value = handshakeString.join("\n");
                    },
                    parse_frame: function dashboard_sections_websocketTest_parseFrame():websocket_frame {
                        return JSON.parse(dashboard.sections["test-websocket"].nodes.message_send_frame.value
                            .replace(/",\s+/g, "\",")
                            .replace(/\{\s+/, "{")
                            .replace(/,\s+\}/, "}"));
                    },
                },
                transmit: {
                    message_receive: function dashboard_sections_websocketTest_messageReceive(data_item:socket_data):void {
                        if ((dashboard.sections["test-websocket"].nodes.halt_receive.checked === true && dashboard.sections["test-websocket"].nodes.message_receive_frame.value !== "") || dashboard.sections["test-websocket"].nodes.halt_receive.checked === false) {
                            const data:services_websocket_message = data_item.data as services_websocket_message;
                            dashboard.sections["test-websocket"].nodes.message_receive_body.value = data.message;
                            dashboard.sections["test-websocket"].frameBeautify("receive", JSON.stringify(data.frame));
                        }
                    },
                    status: function dashboard_sections_websocketTest_status(data_item:socket_data):void {
                        const data:services_websocket_status = data_item.data as services_websocket_status;
                        dashboard.sections["test-websocket"].nodes.button_handshake.onclick = dashboard.sections["test-websocket"].events.handshakeSend;
                        if (data.connected === true) {
                            dashboard.sections["test-websocket"].nodes.button_handshake.textContent = "Disconnect";
                            dashboard.sections["test-websocket"].nodes.status.setAttribute("class", "connection-online");
                            dashboard.sections["test-websocket"].nodes.status.lastChild.textContent = "Online";
                            dashboard.sections["test-websocket"].connected = true;
                            dashboard.sections["test-websocket"].nodes.message_receive_body.value = "";
                            dashboard.sections["test-websocket"].nodes.message_receive_frame.value = "";
                            dashboard.sections["test-websocket"].nodes.button_send.disabled = false;
                        } else {
                            dashboard.sections["test-websocket"].nodes.button_handshake.textContent = "Connect";
                            dashboard.sections["test-websocket"].nodes.status.setAttribute("class", "connection-offline");
                            dashboard.sections["test-websocket"].nodes.status.lastChild.textContent = "Offline";
                            dashboard.sections["test-websocket"].connected = false;
                            dashboard.sections["test-websocket"].nodes.button_send.disabled = true;
                        }
                        if (data.error === null) {
                            if (data.connected === true) {
                                dashboard.sections["test-websocket"].nodes.handshake_status.value = "Connected.";
                            } else {
                                dashboard.sections["test-websocket"].nodes.handshake_status.value = "Disconnected.";
                            }
                        } else if (typeof data.error === "string") {
                            dashboard.sections["test-websocket"].nodes.handshake_status.value = data.error;
                        } else {
                            let error:string = JSON.stringify(data.error);
                            if (data.error.code === "ETIMEDOUT") {
                                dashboard.sections["test-websocket"].nodes.handshake_status.value = `WebSocket handshake exceeded the specified timeout of ${dashboard.sections["test-websocket"].timeout} milliseconds.`;
                            } else {
                                if (typeof data.error !== "string" && data.error.code === "ECONNRESET") {
                                    error = `The server dropped the connection. Ensure the encryption options matches whether the server's port accepts encrypted traffic.\n\n${error}`;
                                }
                                dashboard.sections["test-websocket"].nodes.handshake_status.value = error;
                            }
                        }
                    }
                }
            },
            // test-websocket end
            // users start
            "users": {
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
                receive: null,
                row: function dashboard_networkSocketOSRow(record_item:type_lists, tr:HTMLElement):void {
                    const record:os_user = record_item as os_user,
                        uid:string = String(record.uid),
                        proc:string = String(record.proc);
                    dashboard.tables.cell(tr, record.name, null);
                    dashboard.tables.cell(tr, uid, uid);
                    dashboard.tables.cell(tr, (record.lastLogin === 0)
                        ? "never"
                        : record.lastLogin.dateTime(true, null), String(record.lastLogin));
                    dashboard.tables.cell(tr, proc, proc);
                    dashboard.tables.cell(tr, record.type, null);
                },
                sort_name: ["name", "uid", "lastLogin", "proc"]
            }
            // users end
        },
        shared_services: {
            // back out of server and docker compose editing
            cancel: function dashboard_shareServices_cancel(event:MouseEvent):void {
                const target:HTMLElement = event.target,
                    edit:HTMLElement = target.getAncestor("edit", "class"),
                    create:HTMLButtonElement = (dashboard.global.section === "servers-web")
                        ? dashboard.sections[dashboard.global.section as "servers-web"].nodes.service_new
                        : dashboard.sections[dashboard.global.section as "compose-containers"].nodes.new_variable;
                edit.parentNode.removeChild(edit);
                create.disabled = false;
            },
            // server and docker compose status colors
            color: function dashboard_shareServices_color(id:string, type:type_dashboard_list):type_activation_status {
                if (id === undefined) {
                    return [null, "new"];
                }
                if (type === "container") {
                    if (dashboard.global.payload.compose.containers[id].state === "running") {
                        return ["green", "online"];
                    }
                    return ["red", "offline"];
                }
                if (dashboard.global.payload.servers[id].config.activate === false) {
                    return [null, "deactivated"];
                }
                const encryption:type_encryption = dashboard.global.payload.servers[id].config.encryption,
                    ports:server_ports = dashboard.global.payload.servers[id].status;
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
            create: function dashboard_shareServices_create(event:MouseEvent):void {
                const button:HTMLButtonElement = event.target as HTMLButtonElement;
                button.disabled = true;
                dashboard.shared_services.details(event);
            },
            // server and docker compose instance details
            details: function dashboard_shareServices_details(event:MouseEvent):void {
                const target:HTMLElement = event.target,
                    classy:string = target.getAttribute("class"),
                    newFlag:boolean = (classy === "server-new" || classy === "compose-container-new"),
                    serverItem:HTMLElement = (newFlag === true)
                        ? dashboard.sections[dashboard.global.section as "servers-web"].nodes.list
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
                        value:string = (dashboard.global.section === "servers-web")
                            ? (function dashboard_shareServices_details_serversWeb():string {
                                const array = function dashboard_shareServices_details_serversWeb_array(indent:boolean, name:string, property:string[]):void {
                                        const ind:string = (indent === true)
                                            ? "    "
                                            : "";
                                        if (property === null || property === undefined || property.length < 1) {
                                            output.push(`${ind}"${name}": [],`);
                                        } else {
                                            output.push(`${ind}"${name}": [`);
                                            property.forEach(function dashboard_shareServices_details_serversWeb_array_each(value:string):void {
                                                output.push(`${ind}    "${sanitize(value)}",`);
                                            });
                                            output[output.length - 1] = output[output.length - 1].replace(/,$/, "");
                                            output.push(`${ind}],`);
                                        }
                                    },
                                    object = function dashboard_shareServices_details_serversWeb_object(property:"redirect_asset"|"redirect_domain"):void {
                                        const list:string[] = Object.keys(serverData[property]),
                                            total:number = list.length,
                                            objValue = function dashboard_shareServices_details_serversWeb_object_value(input:string):void {
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
                                    methods = function dashboard_shareServices_details_serversWeb_methods():void {
                                        if (serverData.method !== null && serverData.method !== undefined) {
                                            const keys:string[] = Object.keys(serverData.method),
                                                len:number = keys.length;
                                            keys.sort();
                                            if (len > 0) {
                                                output.push("\"method\": {");
                                                keys.forEach(function dashboard_commonDetails_value_methods_key(key:string) {
                                                    output.push(`    "${key.toLowerCase()}: {`);
                                                    output.push(`        "address": "${serverData.method[key as "delete"].address}",`);
                                                    output.push(`        "port": ${serverData.method[key as "delete"].address}`);
                                                    output.push("    }");
                                                });
                                                output.push("},");
                                            }
                                        }
                                    },
                                    sanitize = function dashboard_shareServices_details_serversWeb_sanitize(input:string):string {
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
                                            },
                                            upgrade: false
                                        }
                                        : dashboard.global.payload.servers[id].config,
                                    output:string[] = [
                                            "{",
                                            `"activate": ${serverData.activate},`
                                        ];
                                if (typeof serverData.activate !== "boolean") {
                                    output.push("\"activate\": true,");
                                }
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
                                methods();
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
                                if (serverData.redirect_asset !== undefined && serverData.redirect_asset !== null) {
                                    object("redirect_asset");
                                }
                                if (serverData.redirect_domain !== undefined && serverData.redirect_domain !== null) {
                                    object("redirect_domain");
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
                                        output.push("\"temporary\": true,");
                                    } else {
                                        output.push("\"temporary\": false,");
                                    }
                                }
                                if (typeof serverData.upgrade !== "boolean") {
                                    output.push("\"upgrade\": false");
                                }
                                output[output.length - 1] = output[output.length - 1].replace(/,$/, "");
                                return `${output.join("\n    ")}\n}`;
                            }())
                            : (newFlag === true || dashboard.global.payload.compose === null)
                                ? ""
                                : dashboard.global.payload.compose.containers[id].compose,
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
                    if (dashboard.global.section === "compose-containers") {
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
                        const method:"activePorts"|"descriptions" = (dashboard.global.section === "servers-web")
                            ? "activePorts"
                            : "descriptions";
                        expandButton.textContent = "Hide";
                        editButton.appendText("✎ Edit");
                        editButton.setAttribute("class", "server-edit");
                        editButton.onclick = dashboard.shared_services.edit;
                        p.appendChild(editButton);
                        details.appendChild(dashboard.sections[dashboard.global.section as "servers-web"].tools[method as "activePorts"](id));
                    }
                    clear.setAttribute("class", "clear");
                    p = document.createElement("p");
                    p.appendChild(clear);
                    p.setAttribute("class", "buttons");
                    details.appendChild(p);
                    if (newFlag === true) {
                        serverItem.parentNode.insertBefore(details, serverItem);
                        dashboard.shared_services.edit(event);
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
            edit: function dashboard_sharedServices_edit(event:MouseEvent):void {
                const target:HTMLElement = event.target,
                    classy:string = target.getAttribute("class"),
                    createServer:boolean = (classy === "server-new" || classy === "compose-container-new"),
                    edit:HTMLElement = (createServer === true)
                        ? target.getAncestor("section", "class").getElementsByClassName("edit")[0] as HTMLElement
                        : target.getAncestor("edit", "class"),
                    editButton:HTMLElement = edit.getElementsByClassName("server-edit")[0] as HTMLElement,
                    listItem:HTMLElement = edit.parentNode,
                    dashboard_server:boolean = (createServer === false && listItem.dataset.id === dashboard.global.payload.dashboard_id),
                    p:HTMLElement = edit.lastChild as HTMLElement,
                    activate:HTMLButtonElement = document.createElement("button"),
                    deactivate:HTMLButtonElement = document.createElement("button"),
                    destroy:HTMLButtonElement = document.createElement("button"),
                    save:HTMLButtonElement = document.createElement("button"),
                    clear:HTMLElement = p.getElementsByClassName("clear")[0] as HTMLElement,
                    note:HTMLElement = document.createElement("p"),
                    textArea:HTMLTextAreaElement = edit.getElementsByTagName("textarea")[0],
                    summary:HTMLElement = edit.getElementsByClassName("summary")[0] as HTMLElement,
                    message:(event:MouseEvent) => void = (dashboard.global.section === "compose-containers")
                        ? dashboard.sections["compose-containers"].events.message_container
                        : dashboard.sections[dashboard.global.section as "servers-web"].events.message;
                save.disabled = true;
                summary.style.display = "block";
                if (createServer === false && dashboard_server === false) {
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
                    destroy.onclick = dashboard.shared_services.cancel;
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
                    if (dashboard.global.section === "compose-containers") {
                        note.textContent = "Container status messaging redirected to terminal.";
                    } else {
                        note.textContent = "Please be patient with new secure server activation as creating new TLS certificates requires several seconds.";
                    }
                    note.setAttribute("class", "note");
                    p.parentNode.appendChild(note);
                } else if (dashboard_server === false) {
                    note.textContent = (dashboard.global.section === "compose-containers")
                        ? `Changing the container name of an existing container will create a new container. Ensure the compose file mentions PUID and PGID with values ${dashboard.global.payload.os.user_account.uid} and ${dashboard.global.payload.os.user_account.gid} to prevent writing files as root.`
                        : "Destroying a server will delete all associated file system artifacts. Back up your data first.";
                    note.setAttribute("class", "note");
                    p.parentNode.appendChild(note);
                }
                if (dashboard.global.section === "compose-containers") {
                    textArea.onkeyup = dashboard.sections["compose-containers"].events.validate_containers;
                    textArea.onfocus = dashboard.sections["compose-containers"].events.validate_containers;
                } else {
                    textArea.onkeyup = dashboard.sections["servers-web"].events.validate;
                    textArea.onfocus = dashboard.sections["servers-web"].events.validate;
                }
                textArea.readOnly = false;
                textArea.focus();
            },
            // expands server and docker compose sections
            title: function dashboard_sharedServices_title(id:string, type:type_dashboard_list):HTMLElement {
                const li:HTMLElement = document.createElement("li"),
                    h4:HTMLElement = document.createElement("h4"),
                    expand:HTMLButtonElement = document.createElement("button"),
                    span:HTMLElement = document.createElement("span"),
                    name:string = (id === undefined)
                        ? `new_${type}`
                        : (type === "server")
                            ? dashboard.global.payload.servers[id].config.name
                            : dashboard.global.payload.compose.containers[id].name;
                if (id === undefined) {
                    expand.appendText(name);
                } else {
                    const color:type_activation_status = dashboard.shared_services.color(id, type);
                    span.appendText("Expand");
                    span.setAttribute("class", "expand");
                    expand.appendChild(span);
                    expand.onclick = dashboard.shared_services.details;
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
        socket: null,
        tables: {
            cell: function dashboard_tables_cell(tr:HTMLElement, text:string, raw:string):void {
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
            filter: function dashboard_tables_filter(event:Event, target?:HTMLInputElement):void {
                if (event !== null) {
                    const key:KeyboardEvent = event as KeyboardEvent;
                    if (event.type === "keyup" && key.key !== "Enter") {
                        return;
                    }
                    target = event.target as HTMLInputElement;
                    dashboard.utility.setState();
                }
                const section:HTMLElement = target.getAncestor("table-filters", "class"),
                    tab:HTMLElement = section.getAncestor("tab", "class"),
                    tab_name:type_dashboard_tables = tab.getAttribute("id") as type_dashboard_tables,
                    module_map:store_module_map = {
                        "devices": dashboard.sections["devices"],
                        "ports-application": dashboard.sections["ports-application"],
                        "processes": dashboard.sections["processes"],
                        "services": dashboard.sections["services"],
                        "sockets-application": dashboard.sections["sockets-application"],
                        "sockets-os": dashboard.sections["sockets-os"],
                        "users": dashboard.sections["users"]
                    },
                    module:module_list|section_ports_application|section_sockets_application = module_map[tab_name],
                    columnIndex:number = module.nodes.filter_column.selectedIndex - 1,
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
                if (module === undefined) {
                    return;
                }
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
            init: function dashboard_tables_init(module:module_list|section_ports_application|section_sockets_application):void {
                if (module !== undefined) {
                    const select = function dashboard_tables_init_select(table:HTMLElement, select:HTMLSelectElement):void {
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
                    if (dashboard.global.state.table_os[module.dataName] === undefined || dashboard.global.state.table_os[module.dataName] === null) {
                        dashboard.global.state.table_os[module.dataName] = {
                            filter_column: module.nodes.filter_column.selectedIndex,
                            filter_sensitive: module.nodes.caseSensitive.checked,
                            filter_value: module.nodes.filter_value.value
                        };
                    } else {
                        module.nodes.filter_column.selectedIndex = dashboard.global.state.table_os[module.dataName].filter_column;
                        module.nodes.caseSensitive.checked = dashboard.global.state.table_os[module.dataName].filter_sensitive;
                        module.nodes.filter_value.value = dashboard.global.state.table_os[module.dataName].filter_value;
                    }
                    module.nodes.filter_column.onchange = dashboard.tables.filter;
                    module.nodes.caseSensitive.onclick = dashboard.utility.setState;
                    module.nodes.filter_value.onblur = dashboard.tables.filter;
                    module.nodes.filter_value.onkeyup = dashboard.tables.filter;
                    select(module.nodes.list.parentNode, module.nodes.filter_column);
                    if (module.dataName === "ports_application") {
                        dashboard.tables.filter(null, module.nodes.filter_value);
                    } else if (module.dataName === "sockets_application") {
                        dashboard.tables.filter(null, module.nodes.filter_value);
                        module.nodes.update_button.onclick = dashboard.sections["sockets-application"].tools.update;
                    } else {
                        module.nodes.update_button.onclick = dashboard.tables.update;
                        module.nodes.update_button.setAttribute("data-list", module.dataName);
                        // @ts-expect-error - inferring types from an object fails
                        dashboard.tables.populate(module, dashboard.global.payload.os[module.dataName as type_list_services]);
                    }
                }
            },
            // populate large data tables
            populate: function dashboard_tables_populate(module:module_list, item:type_list_services):void {
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
                    item.data.sort(function dashboard_tables_populate_sort(a:type_lists,b:type_lists):-1|1 {
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
                    module.nodes.update_text.textContent = item.time.dateTime(true, dashboard.global.payload.timeZone_offset);
                    module.nodes.count.textContent = String(item.data.length);
                    module.nodes.list = table.getElementsByTagName("tbody")[0];
                    dashboard.tables.filter(null, module.nodes.filter_value);
                    // @ts-expect-error - cannot infer a module from a union of modules by a type name from a union of type names
                    dashboard.global.payload.os[module.dataName] = item;
                }
            },
            // sort data from html tables
            sort: function dashboard_tables_sort(event:MouseEvent, table?:HTMLElement, heading_index?:number):void {
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
                        if (dashboard.global.state.tables === undefined || dashboard.global.state.tables === null) {
                            dashboard.global.state.tables = {};
                        }
                        do {
                            tables_index = tables_index - 1;
                        } while (tables_index > 0 && tables[tables_index] !== tableElement);
                        dashboard.global.state.tables[`${id}-${tables_index}`] = {
                            col: index_th,
                            dir: direction
                        };
                        dashboard.utility.setState();
                    }
                    do {
                        records.push(tr_list[index_tr]);
                        index_tr = index_tr + 1;
                    } while (index_tr < tr_length);

                    records.sort(function dashboard_tables_sort_records(a:HTMLElement, b:HTMLElement):-1|0|1 {
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
            update: function dashboard_tables_update(event:MouseEvent):void {
                const target:string = event.target.dataset.list;
                dashboard.utility.message_send(null, `dashboard-os-${target}` as type_service);
            }
        },
        utility: {
            // reset the UI to a near empty baseline
            baseline: function dashboard_utility_baseline():void {
                if (dashboard.global.loaded === true) {
                    const status:HTMLElement = document.getElementById("connection-status"),
                        replace = function dashboard_utility_baseline_replace(node:HTMLElement, className:boolean):HTMLElement {
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
                        lists = function dashboard_utility_baseline_lists(section:module_list|module_sections|section_interfaces, filter:boolean):void {
                            if (section !== undefined) {
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
                            }
                        },
                        title:HTMLElement = document.getElementsByTagName("h1")[0];
                    dashboard.global.loaded = false;
                    status.setAttribute("class", "connection-offline");
                    status.getElementsByTagName("strong")[0].textContent = "Offline";
                    lists(dashboard.sections["interfaces"], false);
                    lists(dashboard.sections["sockets-application"], true);
                    lists(dashboard.sections["sockets-os"], true);
                    lists(dashboard.sections["devices"], true);
                    lists(dashboard.sections["disks"], false);
                    lists(dashboard.sections["processes"], true);
                    lists(dashboard.sections["services"], true);
                    lists(dashboard.sections["users"], true);
                    if (dashboard.sections["application-logs"] !== undefined) {
                        replace(dashboard.sections["application-logs"].nodes.list, false);
                    }
                    if (dashboard.sections["compose-containers"] !== undefined) {
                        dashboard.sections["compose-containers"].nodes.body.style.display = "block";
                        dashboard.sections["compose-containers"].nodes.list.textContent = "";
                        dashboard.sections["compose-containers"].nodes.list_variables.textContent = "";
                        dashboard.sections["compose-containers"].nodes.status.style.display = "none";
                        dashboard.sections["compose-containers"].nodes.status.textContent = "";
                        dashboard.sections["compose-containers"].nodes.update_containers.textContent = "";
                        dashboard.sections["compose-containers"].nodes.update_time.textContent = "";
                        dashboard.sections["compose-containers"].nodes.update_variables.textContent = "";
                    }
                    if (dashboard.sections["file-system"] !== undefined) {
                        const fileSummary:HTMLCollectionOf<HTMLElement> = dashboard.sections["file-system"].nodes.summary.getElementsByTagName("li"),
                            audio:HTMLAudioElement = dashboard.sections["file-system"].media.audio.lastChild as HTMLAudioElement,
                            video:HTMLVideoElement = dashboard.sections["file-system"].media.video.lastChild as HTMLVideoElement;
                        audio.pause();
                        audio.currentTime = 0;
                        video.pause();
                        video.currentTime = 0;
                        fileSummary[0].getElementsByTagName("strong")[0].textContent = "";
                        fileSummary[1].getElementsByTagName("strong")[0].textContent = "";
                        fileSummary[2].getElementsByTagName("strong")[0].textContent = "";
                        fileSummary[3].getElementsByTagName("strong")[0].textContent = "";
                        fileSummary[4].getElementsByTagName("strong")[0].textContent = "";
                        fileSummary[5].getElementsByTagName("strong")[0].textContent = "";
                        fileSummary[6].getElementsByTagName("strong")[0].textContent = "";
                        fileSummary[7].getElementsByTagName("strong")[0].textContent = "";
                        fileSummary[8].getElementsByTagName("strong")[0].textContent = "";
                        dashboard.sections["file-system"].block = false;
                        dashboard.sections["file-system"].nodes.failures.textContent = "";
                        dashboard.sections["file-system"].nodes.output.getElementsByTagName("tbody")[0].textContent = "";
                        dashboard.sections["file-system"].nodes.output.style.display = "none";
                        dashboard.sections["file-system"].nodes.status.textContent = "";
                        dashboard.sections["file-system"].time = 0n;
                    }
                    if (dashboard.sections["os-machine"] !== undefined) {
                        dashboard.sections["os-machine"].nodes_os.cpu.arch.textContent = "";
                        dashboard.sections["os-machine"].nodes_os.cpu.cores.textContent = "";
                        dashboard.sections["os-machine"].nodes_os.cpu.endianness.textContent = "";
                        dashboard.sections["os-machine"].nodes_os.cpu.frequency.textContent = "";
                        dashboard.sections["os-machine"].nodes_os.cpu.name.textContent = "";
                        dashboard.sections["os-machine"].nodes_os.memory.free.textContent = "";
                        dashboard.sections["os-machine"].nodes_os.memory.used.textContent = "";
                        dashboard.sections["os-machine"].nodes_os.memory.total.textContent = "";
                        dashboard.sections["os-machine"].nodes_os.os.hostname.textContent = "";
                        dashboard.sections["os-machine"].nodes_os.os.name.textContent = "";
                        dashboard.sections["os-machine"].nodes_os.os.platform.textContent = "";
                        dashboard.sections["os-machine"].nodes_os.os.release.textContent = "";
                        dashboard.sections["os-machine"].nodes_os.os.type.textContent = "";
                        dashboard.sections["os-machine"].nodes_os.os.uptime.textContent = "";
                        dashboard.sections["os-machine"].nodes_os.process.arch.textContent = "";
                        dashboard.sections["os-machine"].nodes_os.process.argv.textContent = "";
                        dashboard.sections["os-machine"].nodes_os.process.cpuSystem.textContent = "";
                        dashboard.sections["os-machine"].nodes_os.process.cpuUser.textContent = "";
                        dashboard.sections["os-machine"].nodes_os.process.cwd.textContent = "";
                        dashboard.sections["os-machine"].nodes_os.process.platform.textContent = "";
                        dashboard.sections["os-machine"].nodes_os.process.pid.textContent = "";
                        dashboard.sections["os-machine"].nodes_os.process.ppid.textContent = "";
                        dashboard.sections["os-machine"].nodes_os.process.uptime.textContent = "";
                        dashboard.sections["os-machine"].nodes_os.process.memoryProcess.textContent = "";
                        dashboard.sections["os-machine"].nodes_os.process.memoryV8.textContent = "";
                        dashboard.sections["os-machine"].nodes_os.process.memoryExternal.textContent = "";
                        dashboard.sections["os-machine"].nodes_os.update_text.textContent = "";
                        dashboard.sections["os-machine"].nodes_os.user.gid.textContent = "";
                        dashboard.sections["os-machine"].nodes_os.user.uid.textContent = "";
                        dashboard.sections["os-machine"].nodes_os.user.homedir.textContent = "";
                    }
                    if (dashboard.sections["servers-web"] !== undefined) {
                        const server_new:HTMLButtonElement = document.getElementById("servers-web").getElementsByClassName("server-new")[0] as HTMLButtonElement;
                        server_new.disabled = false;
                        dashboard.sections["servers-web"].nodes.list = replace(dashboard.sections["servers-web"].nodes.list, true);
                    }
                    if (dashboard.sections["terminal"] !== undefined) {
                        dashboard.sections["terminal"].nodes.output = replace(dashboard.sections["terminal"].nodes.output, true);
                        dashboard.sections["terminal"].nodes.output.removeAttribute("data-info");
                        dashboard.sections["terminal"].nodes.output.removeAttribute("data-size");
                        if (dashboard.sections["terminal"].socket !== null) {
                            dashboard.sections["terminal"].socket.close();
                            dashboard.sections["terminal"].socket = null;
                        }
                    }
                    if (dashboard.sections["test-websocket"] !== undefined) {
                        dashboard.sections["test-websocket"].nodes.handshake_status.value = "Disconnected.";
                        dashboard.sections["test-websocket"].nodes.button_handshake.textContent = "Connect";
                        dashboard.sections["test-websocket"].nodes.status.setAttribute("class", "connection-offline");
                        dashboard.sections["test-websocket"].nodes.message_receive_body.value = "";
                        dashboard.sections["test-websocket"].nodes.message_receive_frame.value = "";
                    }
                    dashboard.utility.nodes.clock.textContent = "00:00:00L (00:00:00Z)";
                    dashboard.utility.nodes.load.textContent = "0.00000 seconds";
                    dashboard.utility.nodes.main.style.display = "none";
                    dashboard.socket.socket = null;
                    title.removeChild(title.getElementsByTagName("span")[0]);
                }
            },
            // provides server status information
            clock: function dashboard_utility_clock(data_item:socket_data):void {
                const data:services_status_clock = data_item.data as services_status_clock,
                    str = function dashboard_utility_clock_srt(num:number):string {
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
                dashboard.utility.nodes.clock.setAttribute("data-local", String(data.time_local));
                dashboard.utility.nodes.clock.textContent = `${str(data.time_local)}L (${str(data.time_zulu)}Z)`;
            },
            // send dashboard service messages
            message_send: function dashboard_utility_messageSend(data:type_socket_data, service:type_service):void {
                const message:socket_data = {
                        data: data,
                        service: service
                    };
                dashboard.socket.queue(JSON.stringify(message));
            },
            nodes: {
                clock: document.getElementById("clock").getElementsByTagName("time")[0],
                load: document.getElementsByClassName("title")[0].getElementsByTagName("time")[0],
                main: document.getElementsByTagName("main")[0]
            },
            // a universal bucket to store all resize event handlers
            resize: function dashboard_utility_resize():void {
                if (dashboard.sections["application-logs"] !== undefined) {
                    dashboard.sections["application-logs"].events.resize();
                }
                if (dashboard.sections["file-system"] !== undefined) {
                    dashboard.sections["file-system"].events.resize();
                }
                if (dashboard.sections["terminal"] !== undefined && dashboard.sections["terminal"].socket !== null) {
                    dashboard.sections["terminal"].events.resize();
                }
            },
            // gathers state artifacts and saves state data
            setState: function dashboard_utility_setState():void {
                if (dashboard.socket.connected === true) {
                    const hashInput:HTMLCollectionOf<HTMLInputElement> = (document.getElementById("hash") === null)
                            ? null
                            : document.getElementById("hash").getElementsByClassName("form")[0].getElementsByTagName("input"),
                        lists = function dashboard_utility_setState_lists(module:module_list):void {
                            if (module !== undefined) {
                                const type:string = module.dataName;
                                if (dashboard.global.state.table_os[type] === null || dashboard.global.state.table_os[type] === undefined) {
                                    dashboard.global.state.table_os[type] = {
                                        filter_column: module.nodes.filter_column.selectedIndex,
                                        filter_sensitive: module.nodes.caseSensitive.checked,
                                        filter_value: module.nodes.filter_value.value
                                    };
                                } else {
                                    dashboard.global.state.table_os[type].filter_column = module.nodes.filter_column.selectedIndex;
                                    dashboard.global.state.table_os[type].filter_sensitive = module.nodes.caseSensitive.checked;
                                    dashboard.global.state.table_os[type].filter_value = module.nodes.filter_value.value;
                                }
                            }
                        };
                    if (dashboard.sections["dns-query"] !== undefined) {
                        if (dashboard.global.state.dns === undefined || dashboard.global.state.dns === null) {
                            dashboard.global.state.dns = {
                                reverse: dashboard.sections["dns-query"].nodes.reverse.checked,
                                hosts: dashboard.sections["dns-query"].nodes.hosts.value,
                                types: dashboard.sections["dns-query"].nodes.types.value
                            };
                        } else {
                            dashboard.global.state.dns.reverse = dashboard.sections["dns-query"].nodes.reverse.checked;
                            dashboard.global.state.dns.hosts = dashboard.sections["dns-query"].nodes.hosts.value;
                            dashboard.global.state.dns.types = dashboard.sections["dns-query"].nodes.types.value;
                        }
                    }
                    if (dashboard.sections["file-system"] !== undefined) {
                        if (dashboard.global.state.fileSystem === undefined || dashboard.global.state.fileSystem === null) {
                            dashboard.global.state.fileSystem = {
                                path: dashboard.sections["file-system"].nodes.path.value,
                                search: dashboard.sections["file-system"].nodes.search.value
                            };
                        } else {
                            dashboard.global.state.fileSystem.path = dashboard.sections["file-system"].nodes.path.value;
                            dashboard.global.state.fileSystem.search = dashboard.sections["file-system"].nodes.search.value;
                        }
                    }
                    if (dashboard.sections["hash"] !== undefined) {
                        if (dashboard.global.state.hash === undefined || dashboard.global.state.hash === null) {
                            dashboard.global.state.hash = {
                                algorithm: (dashboard.sections["hash"].nodes.algorithm[dashboard.sections["hash"].nodes.algorithm.selectedIndex] === undefined)
                                    ? ""
                                    : dashboard.sections["hash"].nodes.algorithm[dashboard.sections["hash"].nodes.algorithm.selectedIndex].textContent,
                                hashFunction: (hashInput[1].checked === true)
                                    ? "base64"
                                    : "hash",
                                type: (hashInput[3].checked === true)
                                    ? "file"
                                    : "string",
                                digest: (hashInput[5].checked === true)
                                    ? "base64"
                                    : "hex",
                                source: dashboard.sections["hash"].nodes.source.value
                            };
                        } else {
                            dashboard.global.state.hash.algorithm = (dashboard.sections["hash"].nodes.algorithm[dashboard.sections["hash"].nodes.algorithm.selectedIndex] === undefined)
                                ? ""
                                : dashboard.sections["hash"].nodes.algorithm[dashboard.sections["hash"].nodes.algorithm.selectedIndex].textContent;
                            dashboard.global.state.hash.hashFunction = (hashInput[1].checked === true)
                                ? "base64"
                                : "hash";
                            dashboard.global.state.hash.type = (hashInput[3].checked === true)
                                ? "file"
                                : "string";
                            dashboard.global.state.hash.digest = (hashInput[5].checked === true)
                                ? "base64"
                                : "hex";
                            dashboard.global.state.hash.source = dashboard.sections["hash"].nodes.source.value;
                        }
                    }
                    if (dashboard.sections["statistics"] !== undefined) {
                        dashboard.global.state.graph_display = dashboard.sections["statistics"].nodes.graph_display.selectedIndex;
                        dashboard.global.state.graph_type = dashboard.sections["statistics"].nodes.graph_type.selectedIndex;
                    }
                    if (dashboard.sections["terminal"] !== undefined) {
                        if (dashboard.sections["terminal"].nodes.select[dashboard.sections["terminal"].nodes.select.selectedIndex] !== undefined) {
                            dashboard.global.state.terminal = dashboard.sections["terminal"].nodes.select[dashboard.sections["terminal"].nodes.select.selectedIndex].textContent;
                        }
                    }
                    if (dashboard.sections["test-http"] !== undefined) {
                        if (dashboard.global.state.http === undefined || dashboard.global.state.http === null) {
                            dashboard.global.state.http = {
                                encryption: (dashboard.sections["test-http"].nodes.encryption.checked === true),
                                request: dashboard.sections["test-http"].nodes.request.value
                            };
                        } else {
                            dashboard.global.state.http.encryption = (dashboard.sections["test-http"].nodes.encryption.checked === true);
                            dashboard.global.state.http.request = dashboard.sections["test-http"].nodes.request.value;
                        }
                    }
                    lists(dashboard.sections["devices"]);
                    lists(dashboard.sections["processes"]);
                    lists(dashboard.sections["services"]);
                    lists(dashboard.sections["sockets-application"]);
                    lists(dashboard.sections["sockets-os"]);
                    lists(dashboard.sections["users"]);
                    localStorage.state = JSON.stringify(dashboard.global.state);
                }
            }
        }
    };
    dashboard.execute();
};

export default ui;