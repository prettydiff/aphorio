
import spawn from "../core/spawn.ts";
import vars from "../core/vars.ts";

const admin = function start_admin(start_prerequisites: () => void):core_start_task {
    return {
        label: "Determines if the application is run with administrative privileges.",
        task: function start_admin_task():void {
            spawn(vars.commands.admin_check, function start_admin_task_callback(output:core_spawn_output):void {
                const std:string = output.stdout.replace(/\s+/g, "");
                if (std === "0" || std.toLowerCase() === "true") {
                    vars.os.main.process.admin = true;
                } else {
                    vars.commands.firewall_allow_in = "echo \"hello\"";
                    vars.commands.firewall_allow_out = "echo \"hello\"";
                    vars.commands.firewall_deny_in = "echo \"hello\"";
                    vars.commands.firewall_deny_out = "echo \"hello\"";
                }
                start_prerequisites();
            }, {
                shell: (process.platform === "win32" || process.platform === "cygwin")
                    ? "powershell"
                    : "sh"
            }).execute();
        }
    };
};

export default admin;