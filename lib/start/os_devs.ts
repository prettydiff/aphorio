
import os_lists from "../utilities/os_lists.ts";
import vars from "../core/vars.ts";

const os_devs = function start_osDevs(complete_tasks:(task:type_start_primary_tasks) => void):core_start_task {
    return {
        label: "Gathers a list of devices registered with the OS kernel.",
        task: function start_osDevs_task():void {
            if (vars.environment.features["devices"] === true) {
                const callback = function start_osDevs_task_callback():void {
                        complete_tasks("os_devs");
                    };
                os_lists("devs", callback);
            } else {
                complete_tasks("os_devs");
            }
        }
    };
};

export default os_devs;