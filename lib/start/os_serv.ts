
import os_lists from "../utilities/os_lists.ts";
import vars from "../core/vars.ts";

// cspell: words serv

const os_serv = function start_osServ(complete_tasks:(task:type_start_primary_tasks) => void):core_start_task {
    return {
        label: "Gathers a list of known services.",
        task: function start_osServ_task():void {
            if (vars.environment.features["services-os"] === true) {
                const callback = function start_osServ_task_callback():void {
                    complete_tasks("os_serv");
                };
                os_lists("serv", callback);
            } else {
                complete_tasks("os_serv");
            }
        }
    };
};

export default os_serv;