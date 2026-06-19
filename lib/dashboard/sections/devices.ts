

import dashboard from "../dashboard.ts";

const ui_devices = function ui_devices():void {
    const devices:section_devices = {
        dataName: "devs",
        nodes: {
            caseSensitive: document.getElementById("devices").getElementsByClassName("table-filters")[0].getElementsByTagName("input")[1],
            count: document.getElementById("devices").getElementsByClassName("table-stats")[0].getElementsByTagName("em")[0],
            filter_column: document.getElementById("devices").getElementsByClassName("table-filters")[0].getElementsByTagName("select")[0],
            filter_count: document.getElementById("devices").getElementsByClassName("table-stats")[0].getElementsByTagName("em")[1],
            filter_value: document.getElementById("devices").getElementsByClassName("table-filters")[0].getElementsByTagName("input")[0],
            list: document.getElementById("devices").getElementsByClassName("section")[0].getElementsByTagName("tbody")[0],
            update_button: document.getElementById("devices").getElementsByClassName("table-stats")[0].getElementsByTagName("button")[0],
            update_duration: document.getElementById("devices").getElementsByClassName("table-stats")[0].getElementsByTagName("time")[1],
            update_text: document.getElementById("devices").getElementsByClassName("table-stats")[0].getElementsByTagName("time")[0]
        },
        receive: null,
        row: function dashboard_sections_devices_row(record_item:type_lists, tr:HTMLElement):void {
            const record:os_devs = record_item as os_devs;
            dashboard.tables.cell(tr, record.name, null);
            dashboard.tables.cell(tr, record.type, null);
            dashboard.tables.cell(tr, record.kernel_module, null);
        },
        sort_name: ["type", "name", "kernel_module"],
        time: 0
    };
    dashboard.sections["devices"] = devices;
};

export default ui_devices;