
import os_lists from "../utilities/os_lists.ts";
import vars from "../core/vars.ts";

const os_disk = function start_osDisk(complete_tasks:(task:type_start_primary_tasks) => void):core_start_task {
    return {
        label: "Gathers information about disk hardware and partitions.",
        task: function start_osDisk_task():void {
            if (vars.environment.features["disks"] === true) {
                const callback = function start_osDisk_task_callback():void {
                        complete_tasks("os_disk");
                    };
                os_lists("disk", callback);
            } else {
                complete_tasks("os_disk");
            }
        }
    };
};

export default os_disk;