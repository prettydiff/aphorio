

import dashboard from "../dashboard.ts";

const ui_users = function ui_users():void {
    const users:section_users = {
        dataName: "user",
        nodes: {
            caseSensitive: document.getElementById("users").getElementsByClassName("table-filters")[0].getElementsByTagName("input")[1],
            count: document.getElementById("users").getElementsByClassName("table-stats")[0].getElementsByTagName("em")[0],
            filter_column: document.getElementById("users").getElementsByClassName("table-filters")[0].getElementsByTagName("select")[0],
            filter_count: document.getElementById("users").getElementsByClassName("table-stats")[0].getElementsByTagName("em")[1],
            filter_value: document.getElementById("users").getElementsByClassName("table-filters")[0].getElementsByTagName("input")[0],
            list: document.getElementById("users").getElementsByClassName("section")[0].getElementsByTagName("tbody")[0],
            update_button: document.getElementById("users").getElementsByClassName("table-stats")[0].getElementsByTagName("button")[0],
            update_duration: document.getElementById("users").getElementsByClassName("table-stats")[0].getElementsByTagName("time")[1],
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
        sort_name: ["name", "uid", "lastLogin", "proc"],
        time: 0
    };
    dashboard.sections["users"] = users;
};

export default ui_users;