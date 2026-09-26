
import os_lists from "../utilities/os_lists.ts";
import vars from "../core/vars.ts";

const os_proc = function start_osProc(complete_tasks:(task:type_start_primary_tasks) => void):core_start_task {
    return {
        label: "Gathers a list of running processes.",
        task: (process.platform === "win32" || process.platform === "cygwin")
            ? function start_osProc_Windows():void {
                complete_tasks("os_proc");
            }
            : function start_osProc_task():void {
                if (vars.environment.features["processes"] === true) {
                    const callback = function start_osProc_task_callback():void {
                        complete_tasks("os_proc");
                    };
                    os_lists("proc", callback);
                } else {
                    complete_tasks("os_proc");
                }
            }
    };
};

export default os_proc;