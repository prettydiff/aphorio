
import core from "../browser/core.ts";
import dashboard from "./dashboard.ts";

const ui_execute = function ui_execute():void {
    const execute = function dashboard_execute():void {
        // eslint-disable-next-line max-params
        window.onerror = function dashboard_execute_windowError(message:Event|string, source:string, lineno:number, colno:number, error:Error):void {
            const payload:services_log = {
                log: {
                    error: error,
                    message: `JavaScript UI error in browser on line ${lineno} and column ${colno} in ${source}. ${message.toString()}`,
                    origin: "web browser",
                    section: "dashboard",
                    status: "error",
                    time: Date.now()
                },
                total: 0
            };
            dashboard.message.send({data: payload, service: "services_log"});
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
                dashboard.utility.resize();
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
            forbidden = function dashboard_execute_forbidden(this:Element):HTMLElement {
                // eslint-disable-next-line no-new
                new Error(`Disallowed feature used on: ${(this.nodeName === undefined) ? "window" : this.nodeName}\n The feature is not supported in this application.`);
                return document.createElement("div");
            },
            forbiddenList = function common_disallowed_forbiddenList(this:Element):NodeListOf<HTMLElement> {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const list:any = [document.createElement("div")];
                // eslint-disable-next-line no-new
                new Error(`Disallowed feature used on: ${(this.nodeName === undefined) ? "window" : this.nodeName}\n The feature is not supported in this application.`);
                return list;
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
        document.onclick = function dashboard_execute_documentClick():void {
            dashboard.global.click = true;
        };
        dashboard.socket = core({
            close: function dashboard_execute_socketClose():void {
                const log_entry:services_log = {
                    log: {
                        error: null,
                        message: "Dashboard browser connection offline.",
                        origin: "web browser",
                        section: "dashboard",
                        status: "informational",
                        time: Date.now()
                    },
                    total: null
                };
                dashboard.sections["application-logs"].receive({
                    data: log_entry,
                    service: "services_log"
                });
                dashboard.socket.connected = false;
                dashboard.utility.baseline();
                setTimeout(function dashboard_execute_socketClose_delay():void {
                    dashboard.socket.invoke();
                }, 10000);
            },
            message: function dashboard_execute_socketMessage(event:websocket_event):void {
                if (typeof event.data === "string") {
                    dashboard.message.receive(event.data);
                }
            },
            open: function dashboard_execute_socketOpen(event:Event):void {
                const target:WebSocket = event.target as WebSocket;
                dashboard.socket.connected = true;
                dashboard.socket.socket = target;
                if (dashboard.socket.queueStore.length > 0) {
                    do {
                        dashboard.socket.socket.send(dashboard.socket.queueStore[0]);
                        dashboard.socket.queueStore.splice(0, 1);
                    } while (dashboard.socket.queueStore.length > 0);
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
                table = (document.getElementById(table_key[0]) === null)
                    ? null
                    : document.getElementById(table_key[0]).getElementsByTagName("table")[Number(table_key[1])];
                if (table !== undefined && table !== null) {
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

        // Disabling popular but slow conventions. Enhancements to the project must consider performance and scale
        delete Element.prototype.innerHTML;
        // Element.prototype.addEventListener = forbidden;
        Element.prototype.querySelector    = forbidden;
        Element.prototype.querySelectorAll = forbiddenList;
        Element.prototype.closest          = forbidden;
        document.write                     = forbidden;
        document.querySelector             = forbidden;
        document.querySelectorAll          = forbiddenList;
        window.history.back                = forbidden;
        window.history.forward             = forbidden;
        window.history.go                  = forbidden;
        window.history.pushState           = forbidden;
        window.history.replaceState        = forbidden;


        // Prevent third party authors from overriding these performance measures
        Object.freeze(document.write);
        Object.freeze(document.querySelector);
        Object.freeze(document.querySelectorAll);
        Object.freeze(Element.prototype);
        Object.freeze(Document);
    };
    dashboard.execute = execute;
};

export default ui_execute;