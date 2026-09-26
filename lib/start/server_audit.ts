
import file from "../utilities/file.ts";
import node from "../core/node.ts";
import vars from "../core/vars.ts";

const server_audit = function start_serverAudi(complete_tasks:(task:type_start_primary_tasks) => void):core_start_task {
    return {
        label: "Server audit removes directories of server artifacts no longer in the server inventory.",
        task: function start_serverAudit_task():void {
            if (vars.options.mode === "demo") {
                complete_tasks("server_audit");
            } else {
                node.fs.readdir(vars.path.servers, function start_serverAudit_task_dirs(erd:node_error, dirs:string[]):void {
                    if (erd === null) {
                        const removed = function start_serverAudit_task_dirs_removed():void {
                            count = count - 1;
                            if (count < 1) {
                                complete_tasks("server_audit");
                            }
                        };
                        let index:number = dirs.length,
                            count:number = 1;
                        do {
                            index = index - 1;
                            if (vars.data.server[dirs[index]] === undefined) {
                                count = count + 1;
                                file.remove({
                                    callback: removed,
                                    exclusions: [],
                                    location: vars.path.servers + dirs[index],
                                    section: "startup"
                                });
                            }
                        } while (index > 0);
                        removed();
                    } else {
                        complete_tasks("server_audit");
                    }
                });
            }
        }
    };
};

export default server_audit;