
import os_lists from "../utilities/os_lists.ts";
import vars from "../core/vars.ts";

const os_intr = function start_osIntr(complete_tasks:(task:type_start_primary_tasks) => void):core_start_task {
    return {
        label: "Gathers information about the state of available network interfaces.",
        task: function start_osIntr_task():void {
            if (vars.environment.features["interfaces"] === true) {
                const callback = function start_osIntr_task_callback():void {
                    complete_tasks("os_intr");
                };
                os_lists("intr", callback);
            } else {
                complete_tasks("os_intr");
            }
        }
    };
};

export default os_intr;