

import dashboard from "../dashboard.ts";
// cspell: words serv

const ui_services_os = function ui_services_os():void {
    const services_os:section_services_os = {
        dataName: "serv",
        nodes: {
            caseSensitive: document.getElementById("services-os").getElementsByClassName("table-filters")[0].getElementsByTagName("input")[1],
            count: document.getElementById("services-os").getElementsByClassName("table-stats")[0].getElementsByTagName("em")[0],
            filter_column: document.getElementById("services-os").getElementsByClassName("table-filters")[0].getElementsByTagName("select")[0],
            filter_count: document.getElementById("services-os").getElementsByClassName("table-stats")[0].getElementsByTagName("em")[1],
            filter_value: document.getElementById("services-os").getElementsByClassName("table-filters")[0].getElementsByTagName("input")[0],
            list: document.getElementById("services-os").getElementsByClassName("section")[0].getElementsByTagName("tbody")[0],
            update_button: document.getElementById("services-os").getElementsByClassName("table-stats")[0].getElementsByTagName("button")[0],
            update_duration: document.getElementById("services-os").getElementsByClassName("table-stats")[0].getElementsByTagName("time")[1],
            update_text: document.getElementById("services-os").getElementsByClassName("table-stats")[0].getElementsByTagName("time")[0]
        },
        receive: null,
        row: function dashboard_sections_services_row(record_item:type_lists, tr:HTMLElement):void {
            const record:os_serv = record_item as os_serv;
            dashboard.tables.cell(tr, record.name, null);
            dashboard.tables.cell(tr, record.status, null);
            dashboard.tables.cell(tr, record.description, null);
        },
        sort_name: ["name", "status", "description"],
        time: 0
    };
    dashboard.sections["services-os"] = services_os;
};

export default ui_services_os;