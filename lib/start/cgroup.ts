
import file from "../utilities/file.ts";
import spawn from "../core/spawn.ts";
import vars from "../core/vars.ts";

const cgroup = function start_cgroup(complete_tasks:(task:type_start_primary_tasks) => void):core_start_task {
    return {
        label: "Find Linux cgroup address for gathering precision docker performance metrics.",
        task: function start_cgroup_task():void {
            const isWindows:boolean = (process.platform === "win32" || process.platform === "cygwin");
            if (vars.options.mode !== "demo" && vars.environment.features["compose-containers"] === true && vars.environment.compose_status === "" && (vars.os.main.process.admin === true || isWindows === true)) {
                const command:string = (isWindows === true)
                        ? vars.commands.docker_read.replace("cat address", "systemctl status containerd")
                        : "systemctl status containerd",
                    shell:string = (isWindows === true && vars.environment.terminal[0].includes("pwsh") === true)
                        ? vars.environment.terminal[0]
                        : null;
                // first determine if system_d is used
                spawn(command, function start_cgroup_task_systemD(out:core_spawn_output):void {
                    const addresses:string[] = [
                            "/sys/fs/cgroup/system.slice/",
                            "/sys/fs/cgroup/memory/system.slice/",
                            "/sys/fs/cgroup/docker/",
                            "/sys/fs/cgroup/memory/docker/"
                        ],
                        no_file = function start_cgroup_task_systemD_noFile():void {
                            index = index + 1;
                            if (index < 2) {
                                if (isWindows === true) {
                                    spawn(vars.commands.docker_read.replace("address", addresses[index]).replace("cat", "ls"), windows_callback, {shell: shell}).execute();
                                } else {
                                    file.stat({
                                        callback: stat_callback,
                                        location: addresses[index],
                                        no_file: start_cgroup_task_systemD_noFile,
                                        section: "startup"
                                    });
                                }
                            } else {
                                vars.path.cgroup = null;
                                complete_tasks("cgroup");
                            }
                        },
                        windows_callback = function start_cgroup_task_systemD_windowsCallback(out_windows:core_spawn_output):void {
                            if (out_windows.stderr.length > 0) {
                                no_file();
                            } else {
                                vars.path.cgroup = addresses[index];
                                complete_tasks("cgroup");
                            }
                        },
                        stat_callback = function start_cgroup_task_systemD_statCallback(stats:node_fs_BigIntStats, location:string):void {
                            vars.path.cgroup = location;
                            complete_tasks("cgroup");
                        };
                    let index:number = -1;
                    // if output is a string then system_d reported a status for containerd, so docker is a system_d service
                    if (out.stdout.length > 0) {
                        addresses.splice(2, 2);
                    } else {
                        addresses.splice(0, 2);
                    }
                    if (isWindows === true && shell === null) {
                        vars.path.cgroup = null;
                        complete_tasks("cgroup");
                    } else {
                        no_file();
                    }
                }, {
                    shell: shell
                }).execute();
            } else {
                vars.path.cgroup = null;
                complete_tasks("cgroup");
            }
        }
    };
};

export default cgroup;