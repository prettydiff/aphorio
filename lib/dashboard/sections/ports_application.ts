

import dashboard from "../dashboard.ts";

const ui_ports_application = function ui_ports_application():void {
    const ports_application:section_ports_application = {
        dataName: "ports-application",
        nodes: {
            caseSensitive: document.getElementById("ports-application").getElementsByTagName("input")[1],
            count: document.getElementById("ports-application").getElementsByTagName("em")[0],
            filter_column: document.getElementById("ports-application").getElementsByTagName("select")[0],
            filter_count: document.getElementById("ports-application").getElementsByTagName("em")[1],
            filter_value: document.getElementById("ports-application").getElementsByTagName("input")[0],
            list: document.getElementById("ports-application").getElementsByTagName("tbody")[0],
            update_button: document.getElementById("ports-application").getElementsByTagName("button")[0],
            update_duration: document.getElementById("ports-application").getElementsByTagName("time")[1],
            update_text: document.getElementById("ports-application").getElementsByTagName("time")[0]
        },
        receive: null,
        row: function dashboard_sections_portsApplication_row(record_item:type_lists, tr:HTMLElement):void {
            const record:supplemental_ports_application_item = record_item as supplemental_ports_application_item;
            dashboard.tables.cell(tr, record.port.toString(), null);
            dashboard.tables.cell(tr, record.type, null);
            dashboard.tables.cell(tr, record.service, null);
            dashboard.tables.cell(tr, record.service_name, null);
            dashboard.tables.cell(tr, record.hash, "id");
        },
        sort_name: ["port", "type", "service", "name", "id"],
        time: 0
    };
    dashboard.sections["ports-application"] = ports_application;
};

export default ui_ports_application;