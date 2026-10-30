
import os_lists from "../utilities/os_lists.ts";
import vars from "../core/vars.ts";

// cspell: words sudp

const os_sudp = function start_osSUDP(complete_tasks:(task:type_start_primary_tasks) => void):core_start_task {
    return {
        label: "Gathers a list of known network UDP sockets.",
        task: function start_osSUDP_task():void {
            if (vars.environment.features["sockets-os-udp"] === true) {
                const callback = function start_osSUDP_task_callback():void {
                    complete_tasks("os_sudp");
                };
                os_lists("sudp", callback);
            } else {
                complete_tasks("os_sudp");
            }
        }
    };
};

export default os_sudp;