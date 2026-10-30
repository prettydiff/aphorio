
import node from "../core/node.ts";
import spawn from "../core/spawn.ts";
import vars from "../core/vars.ts";

const git = function start_git(complete_tasks:(task:type_start_primary_tasks) => void, process_path:string):core_start_task {
    return {
        label: "Get the latest update time and hash.",
        task: function start_git_task():void {
            const gitStat = function start_git_task_gitStat(error:node_error, stat:node_fs_Stats):void {
                if (error === null && stat !== null) {
                    const spawn_item:core_module_spawn = spawn("git show -s --format=%H,%ct HEAD", function start_git_task_gitStat_close(output:core_spawn_output):void {
                        const str:string[] = output.stdout.split(",");
                        vars.environment.date_commit = Number(str[1]) * 1000;
                        vars.environment.git_hash = str[0];
                        spawn_item.spawn.kill();
                        complete_tasks("git");
                    }, {
                        cwd: process_path.slice(0, process_path.length - 1)
                    });
                    spawn_item.execute();
                } else {
                    complete_tasks("git");
                }
            };
            node.fs.stat(`${process_path}.git`, gitStat);
        }
    };
};

export default git;