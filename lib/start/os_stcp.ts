
import os_lists from "../utilities/os_lists.ts";
import vars from "../core/vars.ts";

// cspell: words stcp

const os_stcp = function start_osSTCP(complete_tasks:(task:type_start_primary_tasks) => void):core_start_task {
    return {
        label: "Gathers a list of known network TCP sockets.",
        task: function start_taskOSSock():void {
            if (vars.environment.features["sockets-os-tcp"] === true) {
                const callback = function start_taskOSSock_callback():void {
                    complete_tasks("os_stcp");
                };
                os_lists("stcp", callback);
            } else {
                complete_tasks("os_stcp");
            }
        }
    };
};

export default os_stcp;