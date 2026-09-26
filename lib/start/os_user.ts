
import os_lists from "../utilities/os_lists.ts";
import vars from "../core/vars.ts";

const os_user = function start_osUser(complete_tasks:(task:type_start_primary_tasks) => void):core_start_task {
    return {
        label: "Gathers a list of user accounts.",
        task: function start_osUser_task():void {
            if (vars.environment.features["users"] === true) {
                const callback = function start_osUser_task_callback():void {
                    complete_tasks("os_user");
                };
                os_lists("user", callback);
            } else {
                complete_tasks("os_user");
            }
        }
    };
};

export default os_user;