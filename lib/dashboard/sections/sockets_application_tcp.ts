

import dashboard from "../dashboard.ts";

const ui_sockets_application_tcp = function ui_sockets_application_tcp():void {
    const sockets_application_tcp:section_sockets_application = {
        dataName: "sockets-application-tcp",
        nodes: {
            caseSensitive: document.getElementById("sockets-application-tcp").getElementsByTagName("input")[1],
            count: document.getElementById("sockets-application-tcp").getElementsByClassName("table-stats")[0].getElementsByTagName("em")[0],
            filter_column: document.getElementById("sockets-application-tcp").getElementsByTagName("select")[0],
            filter_count: document.getElementById("sockets-application-tcp").getElementsByClassName("table-stats")[0].getElementsByTagName("em")[1],
            filter_value: document.getElementById("sockets-application-tcp").getElementsByTagName("input")[0],
            list: document.getElementById("sockets-application-tcp").getElementsByTagName("tbody")[0],
            update_button: document.getElementById("sockets-application-tcp").getElementsByTagName("button")[0],
            update_duration: document.getElementById("sockets-application-tcp").getElementsByTagName("time")[1],
            update_text: document.getElementById("sockets-application-tcp").getElementsByTagName("time")[0]
        },
        receive: null,
        row: function dashboard_sections_socketsApplicationTCP_row(record_item:type_lists, tr:HTMLElement):void {
            const record:supplemental_socket_application_tcp = record_item as supplemental_socket_application_tcp;
            dashboard.tables.cell(tr, record["server_id"], "id");
            dashboard.tables.cell(tr, record["server_name"], null);
            dashboard.tables.cell(tr, record["hash"], null);
            dashboard.tables.cell(tr, record["type"], null);
            dashboard.tables.cell(tr, record["role"], null);
            dashboard.tables.cell(tr, record["proxy"], null);
            dashboard.tables.cell(tr, String(record["encrypted"]), null);
            dashboard.tables.cell(tr, record["address"].local.address, null);
            dashboard.tables.cell(tr, String(record["address"].local.port), null);
            dashboard.tables.cell(tr, record["address"].remote.address, null);
            dashboard.tables.cell(tr, String(record["address"].remote.port), null);
            dashboard.tables.cell(tr, record["userAgent"], null);
            if (dashboard.sections["sockets-application-tcp"].time === 0) {
                dashboard.tables.cell(tr, BigInt(record["time"] * 1e6).time_elapsed(BigInt(dashboard.global.payload.start_date * 1e6)), String(record["time"]));
            } else {
                dashboard.tables.cell(tr, BigInt(dashboard.sections["sockets-application-tcp"].time * 1e6).time_elapsed(BigInt(record["time"] * 1e6)), String(record["time"]));
            }
        },
        sort_name: ["server_id", "server_name", "hash", "type", "role", "proxy", "encrypted", "address-local-address", "address-local-port", "address-remote-address", "address-remote-port", "userAgent", "time"],
        time: 0
    };
    dashboard.sections["sockets-application-tcp"] = sockets_application_tcp;
};

export default ui_sockets_application_tcp;