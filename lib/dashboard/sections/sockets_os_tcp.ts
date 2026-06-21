

import dashboard from "../dashboard.ts";
// cspell: words stcp

const ui_sockets_os_tcp = function ui_sockets_os_tcp():void {
    const sockets_os_tcp:section_sockets_os = {
        dataName: "stcp",
        nodes: {
            caseSensitive: document.getElementById("sockets-os-tcp").getElementsByTagName("input")[1],
            count: document.getElementById("sockets-os-tcp").getElementsByClassName("table-stats")[0].getElementsByTagName("em")[0],
            filter_column: document.getElementById("sockets-os-tcp").getElementsByTagName("select")[0],
            filter_count: document.getElementById("sockets-os-tcp").getElementsByClassName("table-stats")[0].getElementsByTagName("em")[1],
            filter_value: document.getElementById("sockets-os-tcp").getElementsByTagName("input")[0],
            list: document.getElementById("sockets-os-tcp").getElementsByTagName("tbody")[0],
            update_button: document.getElementById("sockets-os-tcp").getElementsByTagName("button")[0],
            update_duration: document.getElementById("sockets-os-tcp").getElementsByTagName("time")[1],
            update_text: document.getElementById("sockets-os-tcp").getElementsByTagName("time")[0]
        },
        receive: null,
        row: function dashboard_sections_socketsOS_TCP_row(record_item:type_lists, tr:HTMLElement):void {
            const record:os_sock = record_item as os_sock;
            let index:number = dashboard.global.payload["ports-application"].data.length;
            dashboard.tables.cell(tr, record["local-address"], null);
            dashboard.tables.cell(tr, String(record["local-port"]), null);
            dashboard.tables.cell(tr, record["remote-address"], null);
            dashboard.tables.cell(tr, String(record["remote-port"]), null);
            if (record.process === 0) {
                dashboard.tables.cell(tr, "null", null);
                dashboard.tables.cell(tr, "null", null);
            } else if (index > 0) {
                dashboard.tables.cell(tr, String(record.process), null);
                do {
                    index = index - 1;
                    if (dashboard.global.payload["ports-application"].data[index].port === record["local-port"] && dashboard.global.payload["ports-application"].data[index].type === "tcp") {
                        dashboard.tables.cell(tr, `${dashboard.global.payload["ports-application"].data[index].service_name} (${dashboard.global.payload["ports-application"].data[index].service})`, null);
                        return;
                    }
                } while (index > 0);
                index = dashboard.global.payload.os.proc.data.length;
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
        sort_name: ["local-address", "local-port", "remote-address", "remote-port"],
        time: 0
    };
    dashboard.sections["sockets-os-tcp"] = sockets_os_tcp;
};

export default ui_sockets_os_tcp;