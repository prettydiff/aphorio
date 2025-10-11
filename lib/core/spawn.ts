
import log from "./log.ts";
import node from "./node.ts";

const spawn = function core_spawn(callback:(output:core_spawn_output) => void, command:string):core_spawn {
    const item:core_spawn = {
        child: function core_spawn_child():void {
            const spawn:node_childProcess_ChildProcess = node.child_process.spawn(command, [], {
                shell: true,
                windowsHide: true
            });
            spawn.on("close", item.close);
            spawn.stderr.on("data", item.data_stderr);
            spawn.stdout.on("data", item.data_stdout);
            spawn.on("error", item.error);
            item.spawn = spawn;
        },
        close: function core_spawn_close():void {
            callback({
                stderr: item.stderr.join(""),
                stdout: item.stdout.join("")
            });
        },
        command: command,
        data_stderr: function core_spawn_stderr(buf:Buffer):void {
            item.stderr.push(buf.toString());
        },
        data_stdout: function core_spawn_stdout(buf:Buffer):void {
            item.stdout.push(buf.toString());
        },
        error: function core_spawn_error(err:node_error):void {
            item.spawn.off("close", close);
            item.spawn.kill();
            log.application({
                action: "activate",
                config: err,
                message: `Error executing docker command: ${command}`,
                status: "error",
                time: Date.now(),
                type: "os"
            });
        },
        spawn: null,
        stderr: [],
        stdout: []
    };
    return item;
};

export default spawn;