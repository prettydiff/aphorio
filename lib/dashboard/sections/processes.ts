

import dashboard from "../dashboard.ts";

const ui_processes = function ui_processes():void {
    const processes:section_processes = {
        dataName: "proc",
        nodes: {
            caseSensitive: document.getElementById("processes").getElementsByClassName("table-filters")[0].getElementsByTagName("input")[1],
            count: document.getElementById("processes").getElementsByClassName("table-stats")[0].getElementsByTagName("em")[0],
            filter_column: document.getElementById("processes").getElementsByClassName("table-filters")[0].getElementsByTagName("select")[0],
            filter_count: document.getElementById("processes").getElementsByClassName("table-stats")[0].getElementsByTagName("em")[1],
            filter_value: document.getElementById("processes").getElementsByClassName("table-filters")[0].getElementsByTagName("input")[0],
            list: document.getElementById("processes").getElementsByClassName("section")[0].getElementsByTagName("tbody")[0],
            update_button: document.getElementById("processes").getElementsByClassName("table-stats")[0].getElementsByTagName("button")[0],
            update_duration: document.getElementById("processes").getElementsByClassName("table-stats")[0].getElementsByTagName("time")[1],
            update_text: document.getElementById("processes").getElementsByClassName("table-stats")[0].getElementsByTagName("time")[0]
        },
        receive: null,
        row: function dashboard_sections_processes_row(record_item:type_lists, tr:HTMLElement):void {
            const record:os_proc = record_item as os_proc,
                timeValue:string = (record.time === null)
                    ? (0).time_elapsed()
                    : record.time.time_elapsed(),
                time:string = (dashboard.global.payload.os.main.process.platform === "win32")
                    ? timeValue.replace(/000$/, "")
                    : timeValue.replace(/\.0+$/, ""),
                memory:string = (record.memory === null)
                    ? "0"
                    : record.memory.commas(),
                id:string = (record === undefined)
                    ? ""
                    : String(record.id),
                percentage:string = `${record.percent.toFixed(2)}%`;
            if (record !== undefined) {
                dashboard.tables.cell(tr, record.name, null);
                dashboard.tables.cell(tr, id, id);
                dashboard.tables.cell(tr, memory, (record.memory === null)
                    ? "0"
                    : String(record.memory));
                dashboard.tables.cell(tr, time, (record.time === null)
                    ? "0"
                    : String(record.time));
                dashboard.tables.cell(tr, percentage, String(record.percent));
                dashboard.tables.cell(tr, record.user, null);
            }
        },
        sort_name: ["name", "id", "memory", "time", "percentage", "user"],
        time: 0
    };
    dashboard.sections["processes"] = processes;
};

export default ui_processes;