
import spawn from "../core/spawn.ts";
import vars from "../core/vars.ts";

const file_start = function start_fileStart(complete_tasks:(task:type_start_primary_tasks) => void):core_start_task {
    return {
        label: "Unix 'file' command discovered.",
        task: function start_fileStart_task():void {
            if (vars.environment.features["file-system"] === true) {
                if (process.platform === "win32" || process.platform === "cygwin") {
                    vars.commands.file = `${vars.path.process}node_modules${vars.path.sep}file${vars.path.sep}bin${vars.path.sep}file.exe -bi `;
                    complete_tasks("file");
                    return;
                }
                spawn("file --help", function start_fileStart_task_spawn(output:core_spawn_output):void {
                    if (output.stdout.indexOf("Usage: file [OPTION...] [FILE...]") === 0) {
                        vars.commands.file = "file -bi ";
                    }
                    complete_tasks("file");
                }).execute();
            } else {
                complete_tasks("file");
            }
        }
    };
};

export default file_start;