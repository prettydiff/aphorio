
import log from "./log.ts";
import node from "./node.ts";
import vars from "./vars.ts";

const spawn = function core_spawn(command:string, callback:(output:core_spawn_output) => void, options?:core_spawn_options):core_spawn {
    const item:core_spawn = {
        close: function core_spawn_close():void {
            if (callback !== null) {
                callback({
                    stderr: item.stderr.join(""),
                    stdout: item.stdout.join(""),
                    type: item.type
                });
            }
            item.spawn.kill();
            vars.stats.children = vars.stats.children - 1;
        },
        command: command,
        data_stderr: function core_spawn_stderr(buf:Buffer):void {
            item.stderr.push(buf.toString());
        },
        data_stdout: function core_spawn_stdout(buf:Buffer):void {
            item.stdout.push(buf.toString());
        },
        error: function core_spawn_error(err:node_childProcess_ExecException):void {
            item.spawn.off("close", close);
            item.spawn.kill();
            log.application({
                error: err,
                message: `Error executing docker command: ${command}`,
                section: "servers_web",
                status: "error",
                time: Date.now()
            });
            if (options !== undefined && options !== null && options.error !== undefined && options.error !== null) {
                options.error(err);
            }
        },
        execute: function core_spawn_execute():void {
            const spawn:node_childProcess_ChildProcess = node.child_process.spawn(command, [], {
                cwd: (options !== undefined && options !== null && typeof options.cwd === "string")
                    ? options.cwd
                    : vars.path.project,
                shell: (options !== undefined && options !== null && typeof options.shell === "string")
                    ? options.shell
                    : true,
                windowsHide: true
            });
            spawn.on("close", item.close);
            spawn.stderr.on("data", item.data_stderr);
            spawn.stdout.on("data", item.data_stdout);
            spawn.on("error", item.error
            );
            if (options !== undefined && options !== null && typeof options.type === "string") {
                item.type = options.type;
            }
            item.spawn = spawn;
            vars.stats.children = vars.stats.children + 1;
        },
        spawn: null,
        stderr: [],
        stdout: [],
        type: ""
    };
    return item;
};

export default spawn;