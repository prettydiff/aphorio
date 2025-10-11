
import file from "../utilities/file.ts";
import log from "../core/log.ts";
import spawn from "../core/spawn.ts";
import vars from "../core/vars.ts";

const compose = function services_compose(socket_data:socket_data):void {
    const data:services_action_compose = socket_data.data as services_action_compose;
    if (socket_data.service === "dashboard-compose-variables" || data.action === "add" || data.action === "modify") {
        const flags:store_flag = {
                compose: false,
                file: false
            },
            complete = function services_compose_complete(flag:"compose"|"file", type:"containers"|"variables", name:string):void {
                flags[flag] = true;
                if (flags.compose === true && flags.file === true) {
                    const service:"dashboard-compose-container"|"dashboard-compose-variables" = socket_data.service as "dashboard-compose-container"|"dashboard-compose-variables",
                        message:string = (service === "dashboard-compose-container")
                            ? `Compose container ${data.compose.name} updated.`
                            : "Compose environmental variables updated.";
                    log.application({
                        action: "modify",
                        config: (type === "containers")
                            ? vars.compose.containers[name]
                            : vars.compose.variables,
                        message: message,
                        status: "success",
                        time: Date.now(),
                        type: `compose-${type}`
                    });
                }
            },
            write = function services_compose_write(contents:string, location:string, type:"containers"|"variables"):void {
                // compose.json - for this application
                file.write({
                    callback: function services_compose_write_compose():void {
                        complete("compose", type, data.compose.name);
                    },
                    contents: JSON.stringify(vars.compose),
                    location: `${vars.path.project}compose.json`
                });
                // container file
                file.write({
                    callback: function services_compose_write_file():void {
                        complete("file", type, data.compose.name);
                    },
                    contents: contents,
                    location: location
                });
            };
        if (socket_data.service === "dashboard-compose-container") {
            vars.compose.containers[data.compose.name] = data.compose;
            write(data.compose.compose, `${vars.path.compose + data.compose.name}.yml`, "containers");
        } else if (socket_data.service === "dashboard-compose-variables") {
            const close = function services_compose_complete_ps(output:core_spawn_output):void {
                    const lns:string[] = output.stdout.replace(/\s+$/, "").split("\n"),
                        keys:string[] = Object.keys(vars.compose.containers);
                    let index:number = keys.length,
                        compose:services_docker_compose = null;
                    do {
                        index = index - 1;
                        compose = JSON.parse(lns[index]);
                        if (compose.name === data.name) {
                            if (compose.state === "running") {
                                compose.compose = vars.compose.containers[data.name].compose;
                                compose.description = vars.compose.containers[data.name].description;
                                vars.compose.containers[data.name] = compose;
                                log.application({
                                    action: "activate",
                                    config: compose,
                                    message: `Docker container ${data.name} is online.`,
                                    status: "informational",
                                    time: Date.now(),
                                    type: "compose-containers"
                                });
                            }
                            break;
                        }
                    } while (index > 0);
                    write((function services_compose_variables():string {
                        const keys:string[] = Object.keys(data),
                            outputString:string[] = [],
                            len:number = keys.length;
                        let index:number = 0;
                        if (len > 0) {
                            do {
                                outputString.push(`${keys[index]}='${vars.compose.variables[keys[index]]}'`);
                                index = index + 1;
                            } while (index < len);
                        }
                        return outputString.join("\n");
                    }()), `${vars.path.compose}.env`, "variables");
                },
                data:store_string = socket_data.data as store_string;
            spawn(`docker compose -f ${vars.path.compose_empty} ps --format=json`, close).child();
            vars.compose.variables = data;
        }
    } else if (data.action === "destroy") {
        const close = function services_compose_kill():void {
            const close_child = function services_compose_kill_container():void {
                const lines:string[] = vars.compose.containers[data.compose.name].compose.split("\n"),
                    write = function services_compose_kill_container_write():void {
                        delete vars.compose.containers[data.compose.name];
                        file.write({
                            callback: function services_compose_stat_writeContents_compose():void {
                                log.application({
                                    action: "destroy",
                                    config: data.compose,
                                    message: `Destroyed container ${data.compose.name}`,
                                    status: "success",
                                    time: Date.now(),
                                    type: "compose-containers"
                                });
                            },
                            contents: JSON.stringify(vars.compose),
                            location: `${vars.path.project}compose.json`
                        });
                    };
                let index:number = lines.length;
                if (index > 0) {
                    do {
                        index = index - 1;
                        if ((/\s+image:/).test(lines[index]) === true) {
                            spawn(`docker image rm ${lines[index].replace(/\s*image:\s*/, "")}`, write);
                            return;
                        }
                    } while (index > 0);
                }
                write();
            };
            spawn(`docker rm ${data.compose.name}`, close_child).child();
        };
        spawn(`docker kill ${data.compose.name}`, close).child();
    }
};

export default compose;