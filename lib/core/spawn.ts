
import log from "./log.ts";
import node from "./node.ts";

const spawn = function core_spawn(callback:() => void, command:string):core_spawn {
    const item:core_spawn = {
        child: function core_spawn_child():void {
            const spawn:node_childProcess_ChildProcess = node.child_process.spawn(command, [], {
                shell: true,
                windowsHide: true
            });
            spawn.on("close", item.close);
            spawn.on("data", item.data);
            spawn.on("error", item.error);
            item.spawn = spawn;
        },
        chunks: [],
        close: callback,
        command: command,
        data: function core_spawn_data(buf:Buffer):void {
            item.chunks.push(buf.toString());
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
        spawn: null
    };
    return item;
};

export default spawn;