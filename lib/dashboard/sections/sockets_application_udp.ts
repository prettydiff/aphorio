

import dashboard from "../dashboard.ts";

const ui_sockets_application_udp = function ui_sockets_application_udp():void {
    const sockets_application_udp:section_sockets_application = {
        dataName: "sockets-application-udp",
        nodes: {
            caseSensitive: document.getElementById("sockets-application-udp").getElementsByTagName("input")[1],
            count: document.getElementById("sockets-application-udp").getElementsByClassName("table-stats")[0].getElementsByTagName("em")[0],
            filter_column: document.getElementById("sockets-application-udp").getElementsByTagName("select")[0],
            filter_count: document.getElementById("sockets-application-udp").getElementsByClassName("table-stats")[0].getElementsByTagName("em")[1],
            filter_value: document.getElementById("sockets-application-udp").getElementsByTagName("input")[0],
            list: document.getElementById("sockets-application-udp").getElementsByTagName("tbody")[0],
            update_button: document.getElementById("sockets-application-udp").getElementsByTagName("button")[0],
            update_duration: document.getElementById("sockets-application-udp").getElementsByTagName("time")[1],
            update_text: document.getElementById("sockets-application-udp").getElementsByTagName("time")[0]
        },
        receive: null,
        row: function dashboard_sections_socketsApplicationTCP_row(record_item:type_lists, tr:HTMLElement):void {
            const record:services_udp_socket = record_item as services_udp_socket;
            dashboard.tables.cell(tr, record["hash"], null);
            dashboard.tables.cell(tr, record["address_source"], null);
            dashboard.tables.cell(tr, String(record["port_source"]), null);
            dashboard.tables.cell(tr, record["address_destination"], null);
            dashboard.tables.cell(tr, String(record["port_destination"]), null);
            dashboard.tables.cell(tr, record["role"], null);
            dashboard.tables.cell(tr, record["multicast_group"], null);
            dashboard.tables.cell(tr, record["multicast_interface"], null);
            dashboard.tables.cell(tr, record["multicast_membership"], null);
            dashboard.tables.cell(tr, record["multicast_source"], null);
            if (dashboard.sections["sockets-application-udp"].time === 0) {
                dashboard.tables.cell(tr, BigInt(record["time"] * 1e6).time_elapsed(BigInt(dashboard.global.payload.start_date * 1e6)), String(record["time"]));
            } else {
                dashboard.tables.cell(tr, BigInt(dashboard.sections["sockets-application-udp"].time * 1e6).time_elapsed(BigInt(record["time"] * 1e6)), String(record["time"]));
            }
        },
        sort_name: ["hash", "address_source", "port_source", "address_destination", "port_destination", "role", "multicast_group", "multicast_interface", "multicast_membership", "multicast_source", "time"],
        time: 0
    };
    dashboard.sections["sockets-application-udp"] = sockets_application_udp;
};

export default ui_sockets_application_udp;